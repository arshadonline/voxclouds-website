'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Campaign {
  id: number; name: string; description: string; caller_id: string; agent_extension: string
  mode: string; status: string; total_numbers: number; dialed: number; answered: number; failed: number
  interested: number; max_concurrent: number; ring_timeout: number
}

interface DialNumber {
  id: number; phone_number: string; name: string; status: string; attempts: number
  call_duration: number; hangup_cause: string; dtmf_response: string; notes: string; called_at: string
}

const statusIcon: Record<string, string> = {
  pending: '⏳', dialing: '📞', answered: '✅', no_answer: '📵', busy: '🔴', failed: '❌', skipped: '⏭️',
}

const statusColor: Record<string, string> = {
  pending: 'text-slate-400', dialing: 'text-yellow-400', answered: 'text-green-400',
  no_answer: 'text-orange-400', busy: 'text-red-400', failed: 'text-red-500', skipped: 'text-slate-500',
}

export default function CampaignDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [numbers, setNumbers] = useState<DialNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [addMode, setAddMode] = useState<'single' | 'csv' | null>(null)
  const [singleNumber, setSingleNumber] = useState('')
  const [singleName, setSingleName] = useState('')
  const [csvText, setCsvText] = useState('')
  const [adding, setAdding] = useState(false)
  const [calling, setCalling] = useState(false)
  const [callLog, setCallLog] = useState<string[]>([])
  const [autoDialing, setAutoDialing] = useState(false)
  const autoDialRef = useRef(false)
  const logRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/dialer/${id}`)
    const data = await res.json()
    setCampaign(data.campaign)
    setNumbers(data.numbers || [])
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, [callLog])

  async function addNumbers(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    let body: Record<string, unknown> = {}
    if (addMode === 'single') {
      body = { phone_number: singleNumber, name: singleName }
    } else {
      body = { csv: csvText }
    }
    const res = await fetch(`/api/admin/dialer/${id}/numbers`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    const data = await res.json()
    appendLog(`Added ${data.added} number(s)`)
    setSingleNumber(''); setSingleName(''); setCsvText(''); setAddMode(null); setAdding(false)
    load()
  }

  async function deleteNumber(numberId: number) {
    await fetch(`/api/admin/dialer/${id}/numbers?numberId=${numberId}`, { method: 'DELETE' })
    load()
  }

  async function clearAll() {
    if (!confirm('Remove all numbers from this campaign?')) return
    await fetch(`/api/admin/dialer/${id}/numbers`, { method: 'DELETE' })
    load()
  }

  async function deleteCampaign() {
    if (!confirm('Delete this campaign permanently?')) return
    await fetch(`/api/admin/dialer/${id}`, { method: 'DELETE' })
    router.push('/admin/dialer')
  }

  function appendLog(msg: string) {
    const time = new Date().toLocaleTimeString()
    setCallLog(prev => [...prev, `[${time}] ${msg}`])
  }

  async function dialOne(numberId?: number) {
    setCalling(true)
    const body: Record<string, unknown> = numberId ? { numberId } : {}
    const num = numberId ? numbers.find(n => n.id === numberId) : numbers.find(n => n.status === 'pending')
    appendLog(`Dialing ${num?.phone_number || 'next'}${num?.name ? ` (${num.name})` : ''}...`)

    const res = await fetch(`/api/admin/dialer/${id}/call`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    const data = await res.json()

    if (data.done) {
      appendLog('All numbers have been dialed!')
      setAutoDialing(false)
      autoDialRef.current = false
    } else if (data.status === 'answered') {
      appendLog(`${data.number} — ANSWERED${data.dtmfLabel ? ` → ${data.dtmfLabel}` : ''}`)
    } else {
      appendLog(`${data.number} — ${data.status.toUpperCase()}${data.cause ? ` (${data.cause})` : ''}`)
    }

    setCalling(false)
    await load()
    return data
  }

  async function startAutoDialer() {
    setAutoDialing(true)
    autoDialRef.current = true
    await updateStatus('running')
    appendLog('Auto-dialer started')

    while (autoDialRef.current) {
      const data = await dialOne()
      if (data?.done) break
      // Small pause between calls
      await new Promise(r => setTimeout(r, 2000))
      if (!autoDialRef.current) break
    }

    setAutoDialing(false)
    appendLog('Auto-dialer stopped')
  }

  function stopAutoDialer() {
    autoDialRef.current = false
    setAutoDialing(false)
    updateStatus('paused')
    appendLog('Stopping after current call...')
  }

  async function hangupCall() {
    appendLog('Hanging up active call...')
    try {
      await fetch(`/api/admin/dialer/${id}/call`, { method: 'DELETE' })
      appendLog('Call hung up')
    } catch (e) {
      appendLog('Failed to hang up')
    }
    setCalling(false)
    await load()
  }

  async function updateStatus(status: string) {
    await fetch(`/api/admin/dialer/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    })
    load()
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setCsvText(text)
    setAddMode('csv')
  }

  if (loading) return <div className="text-slate-400 text-center py-12">Loading...</div>
  if (!campaign) return <div className="text-red-400 text-center py-12">Campaign not found</div>

  const pending = numbers.filter(n => n.status === 'pending').length
  const callLaterCount = numbers.filter(n => n.dtmf_response === 'call_later' && n.status !== 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => router.push('/admin/dialer')} className="text-sm text-slate-400 hover:text-white mb-2 block">
            &larr; Back to campaigns
          </button>
          <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
          {campaign.description && <p className="text-slate-400 mt-1">{campaign.description}</p>}
        </div>
        <button onClick={deleteCampaign} className="text-sm text-red-400 hover:text-red-300">Delete</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: campaign.total_numbers, color: 'text-white' },
          { label: 'Pending', value: pending, color: 'text-slate-400' },
          { label: 'Dialed', value: campaign.dialed, color: 'text-blue-400' },
          { label: 'Answered', value: campaign.answered, color: 'text-green-400' },
          { label: 'Failed', value: campaign.failed, color: 'text-red-400' },
          ...(campaign.mode === 'robocall' ? [{ label: 'Interested', value: campaign.interested, color: 'text-cyan-400' }] : []),
        ].map(s => (
          <div key={s.label} className="bg-navy-800 rounded-lg p-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-navy-800 rounded-xl p-4">
        <div className="flex flex-wrap gap-3">
          {!autoDialing ? (
            <>
              <button
                onClick={startAutoDialer}
                disabled={pending === 0 || calling}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                Start Auto-Dial ({pending} remaining)
              </button>
              <button
                onClick={() => dialOne()}
                disabled={pending === 0 || calling}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {calling ? 'Dialing...' : 'Dial Next'}
              </button>
              {calling && (
                <button
                  onClick={hangupCall}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 animate-pulse"
                >
                  Hang Up
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={stopAutoDialer}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Stop Auto-Dial
              </button>
              {calling && (
                <button
                  onClick={hangupCall}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 animate-pulse"
                >
                  Hang Up Current Call
                </button>
              )}
            </>
          )}
          <button
            onClick={() => setAddMode(addMode ? null : 'single')}
            className="px-4 py-2 bg-navy-700 text-white rounded-lg text-sm hover:bg-navy-600"
          >
            + Add Number
          </button>
          <label className="px-4 py-2 bg-navy-700 text-white rounded-lg text-sm hover:bg-navy-600 cursor-pointer">
            Upload CSV
            <input type="file" accept=".csv,.txt" onChange={handleCsvUpload} className="hidden" />
          </label>
          {callLaterCount > 0 && (
            <button
              onClick={async () => {
                await fetch(`/api/admin/dialer/${id}/numbers`, {
                  method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ resetCallLater: true }),
                })
                appendLog(`Reset ${callLaterCount} "Call Later" number(s) to pending`)
                load()
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700"
            >
              Redial Call Later ({callLaterCount})
            </button>
          )}
          {numbers.length > 0 && (
            <button onClick={clearAll} className="px-4 py-2 text-red-400 text-sm hover:text-red-300">
              Clear All
            </button>
          )}
        </div>

        {/* Add form */}
        {addMode && (
          <form onSubmit={addNumbers} className="mt-4 space-y-3">
            {addMode === 'single' ? (
              <div className="flex gap-3">
                <input
                  value={singleNumber}
                  onChange={e => setSingleNumber(e.target.value)}
                  placeholder="Phone number (e.g. 923001234567)"
                  className="flex-1 px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm"
                  required
                />
                <input
                  value={singleName}
                  onChange={e => setSingleName(e.target.value)}
                  placeholder="Name (optional)"
                  className="w-48 px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm"
                />
                <button type="submit" disabled={adding} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm disabled:opacity-50">
                  {adding ? 'Adding...' : 'Add'}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-400 mb-2">CSV format: phone_number,name (one per line). Name is optional.</p>
                <textarea
                  value={csvText}
                  onChange={e => setCsvText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm font-mono"
                  placeholder={"923001234567,Ahmed Khan\n923009876543,Sara Ali\n441234567890"}
                />
                <button type="submit" disabled={adding || !csvText.trim()} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm disabled:opacity-50">
                  {adding ? 'Importing...' : 'Import'}
                </button>
              </div>
            )}
          </form>
        )}
      </div>

      {/* Call Log */}
      {callLog.length > 0 && (
        <div className="bg-navy-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Call Log</h3>
          <div ref={logRef} className="bg-navy-950 rounded-lg p-3 max-h-48 overflow-y-auto font-mono text-xs space-y-1">
            {callLog.map((log, i) => (
              <div key={i} className={log.includes('ANSWERED') ? 'text-green-400' : log.includes('FAILED') || log.includes('BUSY') ? 'text-red-400' : log.includes('NO_ANSWER') ? 'text-orange-400' : 'text-slate-300'}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Number List */}
      <div className="bg-navy-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Numbers ({numbers.length})</h3>
        </div>
        {numbers.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">
            No numbers yet. Add manually or upload a CSV file.
          </div>
        ) : (
          <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
            {numbers.map(n => (
              <div key={n.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-navy-750">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{statusIcon[n.status] || '❓'}</span>
                  <div>
                    <span className="text-white font-mono text-sm">{n.phone_number}</span>
                    {n.name && <span className="text-slate-400 text-sm ml-2">{n.name}</span>}
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${statusColor[n.status]}`}>{n.status}</span>
                      {n.dtmf_response && n.dtmf_response !== '' && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          n.dtmf_response === 'interested' ? 'bg-cyan-900 text-cyan-300' :
                          n.dtmf_response === 'not_interested' ? 'bg-red-900 text-red-300' :
                          n.dtmf_response === 'call_later' ? 'bg-yellow-900 text-yellow-300' :
                          n.dtmf_response === 'agent' ? 'bg-green-900 text-green-300' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {n.dtmf_response === 'interested' ? 'Interested' :
                           n.dtmf_response === 'not_interested' ? 'Not Interested' :
                           n.dtmf_response === 'call_later' ? 'Call Later' :
                           n.dtmf_response === 'agent' ? 'Agent' :
                           n.dtmf_response === 'no_response' ? 'No Response' : n.dtmf_response}
                        </span>
                      )}
                      {n.hangup_cause && n.hangup_cause !== 'NORMAL_CLEARING' && !n.dtmf_response && (
                        <span className="text-xs text-slate-500">{n.hangup_cause}</span>
                      )}
                      {n.attempts > 1 && <span className="text-xs text-slate-500">({n.attempts} attempts)</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {n.status === 'pending' && (
                    <button
                      onClick={() => dialOne(n.id)}
                      disabled={calling}
                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Dial
                    </button>
                  )}
                  {n.status !== 'pending' && n.status !== 'dialing' && (
                    <button
                      onClick={async () => {
                        await fetch(`/api/admin/dialer/${id}/numbers`, {
                          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ numberId: n.id, status: 'pending', dtmf_response: '' }),
                        })
                        load()
                      }}
                      className={`text-xs px-2 py-1 rounded ${
                        n.dtmf_response === 'call_later' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                        'text-slate-400 hover:text-white hover:bg-navy-700'
                      }`}
                    >
                      Redial
                    </button>
                  )}
                  <button onClick={() => deleteNumber(n.id)} className="text-xs text-red-400 hover:text-red-300 px-1">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
