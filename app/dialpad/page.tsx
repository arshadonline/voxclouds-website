'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Script from 'next/script'
import BottomNav from '@/components/BottomNav'

declare global { interface Window { JsSIP: any } }

type CallState = 'idle' | 'connecting' | 'registered' | 'calling' | 'in-call' | 'incoming' | 'error'

type IceServer = { urls: string; username?: string; credential?: string }
type SipConfig = { username: string; alias?: string; password: string; domain: string; server: string; iceServers?: IceServer[] }

// Fallback ICE if the API doesn't return any (primary STUN + Google backup + TURN/TURNS)
const DEFAULT_ICE: IceServer[] = [
  { urls: 'stun:84.247.187.198:3478' },
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'turn:84.247.187.198:3478?transport=udp', username: 'voxturn', credential: 'dd4fa56c59a81423134b066f78c2d043' },
  { urls: 'turn:84.247.187.198:3478?transport=tcp', username: 'voxturn', credential: 'dd4fa56c59a81423134b066f78c2d043' },
  { urls: 'turns:84.247.187.198:5349?transport=tcp', username: 'voxturn', credential: 'dd4fa56c59a81423134b066f78c2d043' },
]

// Shared RTCPeerConnection config for every call/answer
function pcConfigFor(cfg: SipConfig | null): RTCConfiguration {
  return {
    iceServers: (cfg?.iceServers && cfg.iceServers.length ? cfg.iceServers : DEFAULT_ICE) as RTCIceServer[],
    iceTransportPolicy: 'all',
    // 'balanced' (not 'max-bundle'): FreeSWITCH answers a single audio m-line
    // WITHOUT an a=group:BUNDLE line. max-bundle would make Chrome reject that
    // answer ("Bad Media Description"); balanced accepts the non-bundled answer.
    bundlePolicy: 'balanced',
    rtcpMuxPolicy: 'require',
    iceCandidatePoolSize: 1,
  }
}

// DTMF tone frequencies
const DTMF_FREQS: Record<string, [number, number]> = {
  '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
  '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
  '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
  '*': [941, 1209], '0': [941, 1336], '#': [941, 1477],
}

let audioCtx: AudioContext | null = null
function playDtmf(key: string) {
  const freqs = DTMF_FREQS[key]
  if (!freqs) return
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    const [f1, f2] = freqs
    const now = audioCtx.currentTime
    const gain = audioCtx.createGain()
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
    gain.connect(audioCtx.destination)
    for (const f of [f1, f2]) {
      const osc = audioCtx.createOscillator()
      osc.frequency.value = f
      osc.connect(gain)
      osc.start(now)
      osc.stop(now + 0.12)
    }
  } catch {}
}

function wirePc(pc: RTCPeerConnection, audioEl: HTMLAudioElement) {
  pc.addEventListener('iceconnectionstatechange', () => {
    if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
      const rcvrs = pc.getReceivers()
      rcvrs.forEach(r => {
        if (r.track?.kind === 'audio') {
          audioEl.srcObject = new MediaStream([r.track])
          audioEl.play().catch(() => {})
        }
      })
    }
  })
  pc.addEventListener('track', (ev) => {
    audioEl.srcObject = ev.streams?.[0] ?? new MediaStream([ev.track])
    audioEl.play().catch(() => {})
  })
}

export default function DialpadPage() {
  const [number, setNumber] = useState('')
  const [callState, setCallState] = useState<CallState>('idle')
  const [status, setStatus] = useState('Not connected')
  const [balance, setBalance] = useState<string | null>(null)
  const [sipCfg, setSipCfg] = useState<SipConfig | null>(null)
  const [toneEnabled, setToneEnabled] = useState(true)
  const [incomingFrom, setIncomingFrom] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const uaRef = useRef<InstanceType<typeof import('jssip').UA> | null>(null)
  const sessionRef = useRef<ReturnType<InstanceType<typeof import('jssip').UA>['call']> | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Load balance + SIP config
  useEffect(() => {
    fetch('/api/balance').then(r => r.json()).then(d => {
      if (d.balance !== undefined) setBalance('$' + d.balance.toFixed(2))
    }).catch(() => {})
    fetch('/api/sip-config').then(r => r.json()).then(d => {
      if (d.username) setSipCfg(d)
    }).catch(() => {})
  }, [])

  // Boot JsSIP once script is loaded and SIP config is ready
  const startSip = useCallback(() => {
    if (!sipCfg || !window.JsSIP || uaRef.current) return
    const JsSIP = window.JsSIP
    JsSIP.debug.disable('JsSIP:*')
    const socket = new JsSIP.WebSocketInterface(sipCfg.server)
    ;(socket as any).via_transport = 'WS'
    const ua = new JsSIP.UA({
        sockets: [socket],
        uri: `sip:${sipCfg.username}@${sipCfg.domain}`,
        password: sipCfg.password,
        display_name: 'VoxClouds',
        register: true,
        session_timers: false,
        // Fast reconnection — no exponential backoff
        connection_recovery_min_interval: 2,
        connection_recovery_max_interval: 4,
        // P4: short registration so a dropped client is detected fast (re-reg ~halfway, ~30s)
        register_expires: 60,
      })
      ua.on('connected', () => setStatus('Connecting…'))
      ua.on('disconnected', () => {
        setStatus('Reconnecting…')
        setCallState(s => s === 'registered' ? 'idle' : s)
      })
      ua.on('registered', () => { setStatus('Ready ✓'); setCallState('registered') })
      ua.on('unregistered', () => {
        setStatus('Reconnecting…')
        setCallState('idle')
        // Re-register immediately
        setTimeout(() => { try { ua.register() } catch {} }, 500)
      })
      ua.on('registrationFailed', () => {
        setStatus('Reconnecting…')
        setCallState('idle')
        // Retry registration after 2s
        setTimeout(() => { try { ua.register() } catch {} }, 2000)
      })
      ua.on('newRTCSession', ({ session, originator }: any) => {
        session.on('peerconnection', ({ peerconnection: pc }: any) => {
          if (audioRef.current) wirePc(pc, audioRef.current)
        })
        if (originator === 'remote') {
          // Incoming call: RING and wait for the user to answer.
          // (Do NOT auto-answer — that hijacks call-forking to other devices and causes echo.)
          sessionRef.current = session
          const ri = session.remote_identity || {}
          setIncomingFrom((ri.uri && ri.uri.user) || ri.display_name || 'Unknown')
          setCallState('incoming')
          setStatus('Incoming call…')
          const clear = () => { setCallState('registered'); setStatus('Ready ✓'); setIncomingFrom(null); sessionRef.current = null; if (audioRef.current) audioRef.current.srcObject = null }
          session.on('failed', clear)
          session.on('ended', clear)
          session.on('accepted', () => { setCallState('in-call'); setStatus('In call') })
          session.on('confirmed', () => {
            setCallState('in-call'); setStatus('In call')
            const pc = session.connection as RTCPeerConnection
            if (pc && audioRef.current) wirePc(pc, audioRef.current)
          })
        }
      })
    ua.start()
    uaRef.current = ua
    setStatus('Connecting...')
    setCallState('connecting')
  }, [sipCfg])

  useEffect(() => {
    if (sipCfg && window.JsSIP) startSip()
  }, [sipCfg, startSip])

  // Keep React callState in sync with JsSIP's REAL registration state.
  // The 'registered' event can fail to re-fire after a WS recovery, leaving
  // callState stuck at 'idle'/'connecting' (greying out the Call button) even
  // though the UA is actually registered on the server. Poll and resync.
  useEffect(() => {
    const id = setInterval(() => {
      const ua: any = uaRef.current
      if (ua && typeof ua.isRegistered === 'function' && ua.isRegistered()) {
        setCallState(s => (s === 'idle' || s === 'connecting' || s === 'error') ? 'registered' : s)
        setStatus(st => (st !== 'Ready ✓' && st !== 'In call' && st !== 'Incoming call…' && st !== 'Calling…') ? 'Ready ✓' : st)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const dial = useCallback((key: string) => {
    if (callState === 'in-call' && sessionRef.current) {
      // During active call: send DTMF only, don't change the number field
      try {
        sessionRef.current.sendDTMF(key, { transportType: 'RFC2833' as any })
      } catch (e1) {
        // Fallback to SIP INFO if RFC2833 fails
        try { sessionRef.current.sendDTMF(key) } catch (e2) { console.error('[VOX] DTMF failed', e1, e2) }
      }
    } else {
      setNumber(n => n + key)
    }
    if (toneEnabled) playDtmf(key)
  }, [toneEnabled, callState])

  const makeCall = useCallback(() => {
    const ua: any = uaRef.current
    const regd = !!(ua && typeof ua.isRegistered === 'function' && ua.isRegistered())
    console.log('[VOX] makeCall', { hasUA: !!ua, number, callState, isRegistered: regd })
    if (!ua || !number.trim()) { console.warn('[VOX] abort: no UA or empty number'); return }
    if (callState !== 'registered' && !regd) { console.warn('[VOX] abort: not registered'); return }
    // Normalize: strip leading +, 00 international prefix
    const normalized = number.trim().replace(/^\+/, '').replace(/^00([1-9])/, '$1')
    let sess: any
    try {
      sess = ua.call(`sip:${normalized}@${sipCfg?.domain ?? '84.247.187.198'}`, {
        mediaConstraints: { audio: true, video: false },
        pcConfig: pcConfigFor(sipCfg),
      } as any)
      console.log('[VOX] ua.call invoked ->', normalized)
    } catch (e) {
      console.error('[VOX] ua.call threw', e)
      setStatus('Call error'); return
    }
    sessionRef.current = sess
    setCallState('calling')
    sess.on('peerconnection', ({ peerconnection: pc }: any) => {
      if (audioRef.current) wirePc(pc, audioRef.current)
    })
    sess.on('progress', () => setStatus('Ringing…'))
    sess.on('confirmed', () => {
      setCallState('in-call'); setStatus('In call')
      const pc = (sess as any).connection as RTCPeerConnection
      if (pc && audioRef.current) {
        wirePc(pc, audioRef.current)
        pc.getReceivers().forEach(r => {
          if (r.track?.kind === 'audio' && audioRef.current) {
            audioRef.current.srcObject = new MediaStream([r.track])
            audioRef.current.play().catch(() => {})
          }
        })
      }
    })
    sess.on('ended', () => { setCallState('registered'); setStatus('Ready'); sessionRef.current = null; if (audioRef.current) audioRef.current.srcObject = null })
    sess.on('failed', (e: any) => { console.error('[VOX] session failed', { cause: e?.cause, originator: e?.originator, message: e?.message }); setCallState('registered'); setStatus(`Call failed: ${e?.cause ?? ''}`); sessionRef.current = null; if (audioRef.current) audioRef.current.srcObject = null })
    sess.on('getusermediafailed', (err: any) => console.error('[VOX] getUserMedia FAILED (mic permission/device)', err))
  }, [number, callState])

  const hangup = useCallback(() => {
    try { sessionRef.current?.terminate?.() } catch {}
    setCallState('registered'); setStatus('Ready'); sessionRef.current = null
    if (audioRef.current) audioRef.current.srcObject = null
  }, [])

  const answerCall = useCallback(() => {
    const session: any = sessionRef.current
    if (!session) return
    try {
      session.answer({ mediaConstraints: { audio: true, video: false }, pcConfig: pcConfigFor(sipCfg) })
      setCallState('in-call'); setStatus('In call'); setIncomingFrom(null)
    } catch (e) { console.error('[VOX] answer failed', e) }
  }, [sipCfg])

  const rejectCall = useCallback(() => {
    try { sessionRef.current?.terminate?.({ status_code: 486, reason_phrase: 'Busy Here' }) } catch {}
    setCallState('registered'); setStatus('Ready ✓'); setIncomingFrom(null); sessionRef.current = null
  }, [])

  // Reconnect when tab becomes visible again (user returns to app)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && uaRef.current) {
        try {
          const ua = uaRef.current
          if (!(ua as any).isRegistered()) ua.register()
        } catch {}
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  const reconnect = useCallback(() => {
    setStatus('Reconnecting…')
    if (uaRef.current) {
      try { uaRef.current.register() } catch {}
    } else {
      startSip()
    }
  }, [startSip])

  // Keyboard input — play tones even when typing in the input field
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const inInput = e.target instanceof HTMLInputElement
      // During active call, intercept digit keys to send DTMF instead of typing
      if (/^[0-9*#]$/.test(e.key) && callState === 'in-call') {
        e.preventDefault()
        dial(e.key)
        return
      }
      // Always play tones for digit keys regardless of focus
      if (/^[0-9*#]$/.test(e.key) && toneEnabled) playDtmf(e.key)
      // Global shortcuts when NOT in the input field
      if (!inInput) {
        if (e.key === 'Enter' && callState === 'registered') { e.preventDefault(); makeCall() }
        if ((e.key === 'Escape') && (callState === 'in-call' || callState === 'calling')) hangup()
      } else {
        // Enter to call from input field
        if (e.key === 'Enter' && callState === 'registered') { e.preventDefault(); makeCall() }
        if (e.key === 'Escape' && (callState === 'in-call' || callState === 'calling')) hangup()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [dial, callState, makeCall, hangup, toneEnabled])

  const statusColor = callState === 'registered' ? 'text-green-400' : callState === 'in-call' ? 'text-blue-400' : callState === 'error' ? 'text-red-400' : 'text-yellow-400'
  const keys = [['1','2','3'],['4','5','6'],['7','8','9'],['*','0','#'],['+','-','']]

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col max-w-sm mx-auto pb-20">
      <Script src="/jssip.min.js" strategy="afterInteractive" onLoad={() => { if (sipCfg) startSip() }} />
      <audio ref={audioRef} autoPlay playsInline className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div>
          <h1 className="text-lg font-bold text-white">{sipCfg?.alias || sipCfg?.username || 'VoxClouds'}</h1>
          {sipCfg?.username && <p className="text-xs text-slate-500 font-mono">{sipCfg.username}</p>}
          {(callState === 'idle' || callState === 'error') && status !== 'Ready ✓' ? (
            <button onClick={reconnect} className={`text-xs font-medium mt-0.5 ${statusColor} flex items-center gap-1`}>
              <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {status}
            </button>
          ) : (
            <p className={`text-xs font-medium mt-0.5 ${statusColor}`}>{status}</p>
          )}
        </div>
        {balance && (
          <div className="text-right">
            <p className="text-xs text-slate-400">Balance</p>
            <p className="text-base font-bold text-white">{balance}</p>
          </div>
        )}
      </div>

      {/* Number input — editable with cursor */}
      <div className="px-5 mb-4">
        <div className="bg-navy-800 rounded-2xl px-5 py-1 flex items-center min-h-[64px] focus-within:ring-1 focus-within:ring-blue-500">
          <input
            ref={inputRef}
            type="tel"
            value={number}
            onChange={e => setNumber(e.target.value.replace(/[^0-9*#+-]/g, ''))}
            placeholder="Enter number"
            className="flex-1 bg-transparent text-2xl font-light tracking-widest text-white placeholder-slate-600 outline-none py-3"
            autoComplete="off"
          />
          {number && (
            <button onClick={() => setNumber(n => n.slice(0, -1))} className="text-slate-400 hover:text-white p-1 ml-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Dialpad + tone toggle */}
      <div className="px-6 space-y-3 flex-1">
        {keys.map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-3">
            {row.map(k => k ? (
              <button key={k} onClick={() => { dial(k); inputRef.current?.focus() }}
                className="bg-navy-800 hover:bg-navy-700 active:scale-95 transition-all rounded-2xl h-16 text-xl font-semibold text-white shadow-sm select-none">
                {k}
              </button>
            ) : <div key="empty" />)}
          </div>
        ))}
        {/* Tone toggle */}
        <div className="flex justify-end pt-1">
          <button
            onClick={() => setToneEnabled(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${toneEnabled ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {toneEnabled
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
              }
            </svg>
            {toneEnabled ? 'Tones on' : 'Tones off'}
          </button>
        </div>
      </div>

      {/* Call / Hangup button */}
      <div className="px-6 mt-6 mb-2">
        {callState === 'incoming' ? (
          <div>
            <p className="text-center text-sm text-slate-300 mb-3">Incoming call{incomingFrom ? ` from ${incomingFrom}` : ''}…</p>
            <div className="flex gap-3">
              <button onClick={rejectCall}
                className="flex-1 h-16 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 transition-all flex items-center justify-center gap-2 text-white font-semibold text-base shadow-lg shadow-red-900/30">
                Decline
              </button>
              <button onClick={answerCall}
                className="flex-1 h-16 rounded-2xl bg-green-600 hover:bg-green-500 active:scale-95 transition-all flex items-center justify-center gap-2 text-white font-semibold text-base shadow-lg shadow-green-900/30 animate-pulse">
                Answer
              </button>
            </div>
          </div>
        ) : (callState === 'calling' || callState === 'in-call') ? (
          <button onClick={hangup}
            className="w-full h-16 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 transition-all flex items-center justify-center gap-3 text-white font-semibold text-base shadow-lg shadow-red-900/30">
            <svg className="w-6 h-6 rotate-135" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            {callState === 'calling' ? 'Cancel' : 'Hang Up'}
          </button>
        ) : (
          <button onClick={makeCall}
            disabled={!number || callState !== 'registered'}
            className="w-full h-16 rounded-2xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-3 text-white font-semibold text-base shadow-lg shadow-green-900/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            Call
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
