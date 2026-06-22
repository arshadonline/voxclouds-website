'use client'
import { useState, useEffect, useRef } from 'react'
import BottomNav from '@/components/BottomNav'

interface Ticket {
  id: number
  subject: string
  status: string
  unread_customer: number
  last_message_at: string
}

interface Message {
  id: number
  sender_type: 'customer' | 'admin'
  message: string
  created_at: string
}

export default function SupportPage() {
  const [view, setView] = useState<'list' | 'new' | 'chat'>('list')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [activeTicketId, setActiveTicketId] = useState<number | null>(null)
  const [activeTicketSubject, setActiveTicketSubject] = useState('')
  const [activeTicketStatus, setActiveTicketStatus] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showSent, setShowSent] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTickets()
    const interval = setInterval(() => {
      fetchTickets()
      if (activeTicketId && view === 'chat') fetchMessages(activeTicketId)
    }, 8000)
    return () => clearInterval(interval)
  }, [activeTicketId, view])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchTickets() {
    try {
      const res = await fetch('/api/tickets')
      if (!res.ok) return
      const data = await res.json()
      setTickets(data.tickets || [])
      if (activeTicketId) {
        const active = (data.tickets || []).find((t: Ticket) => t.id === activeTicketId)
        if (active) setActiveTicketStatus(active.status)
      }
    } catch {}
  }

  async function fetchMessages(ticketId: number) {
    const res = await fetch(`/api/tickets/${ticketId}/messages`)
    if (!res.ok) return
    const data = await res.json()
    setMessages(data.messages || [])
  }

  function openTicket(t: Ticket) {
    setActiveTicketId(t.id)
    setActiveTicketSubject(t.subject)
    setActiveTicketStatus(t.status)
    setView('chat')
    fetchMessages(t.id)
  }

  async function handleNewTicket() {
    if (!newSubject.trim() || !newMessage.trim() || sending) return
    setSending(true)
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: newSubject.trim(), message: newMessage.trim() }),
    })
    const data = await res.json()
    setSending(false)
    if (res.ok) {
      setNewSubject('')
      setNewMessage('')
      setActiveTicketId(data.id)
      setActiveTicketSubject(newSubject.trim())
      setView('chat')
      fetchMessages(data.id)
    }
  }

  async function handleSendReply() {
    if (!reply.trim() || !activeTicketId || sending) return
    setSending(true)
    await fetch(`/api/tickets/${activeTicketId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: reply.trim() }),
    })
    setReply('')
    setSending(false)
    setShowSent(true)
    setTimeout(() => setShowSent(false), 2000)
    fetchMessages(activeTicketId)
  }

  const statusBadge = (s: string) => {
    const cls = s === 'open' ? 'bg-blue-900/50 text-blue-400'
      : s === 'in_progress' ? 'bg-yellow-900/50 text-yellow-400'
      : s === 'resolved' ? 'bg-green-900/50 text-green-400'
      : 'bg-slate-800 text-slate-500'
    const label = s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)
    return <span className={`text-[10px] px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
  }

  const hour = new Date().getHours()
  const isBusinessHours = hour >= 9 && hour < 22

  return (
    <div className="min-h-screen bg-navy-950 max-w-sm mx-auto flex flex-col pb-20">

      {/* === LIST VIEW === */}
      {view === 'list' && (
        <>
          {/* Live Header */}
          <div className="px-5 pt-10 pb-1">
            <div className="bg-gradient-to-br from-blue-900/40 via-navy-800 to-navy-800 rounded-2xl p-5 border border-blue-800/20 relative overflow-hidden">
              {/* Animated glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-green-500/8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

              <div className="flex items-center gap-3 mb-3 relative">
                {/* Agent avatars */}
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold ring-2 ring-navy-800 z-10">V</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold ring-2 ring-navy-800">S</div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">VoxClouds Support</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-[11px] text-green-400 font-medium">
                      {isBusinessHours ? 'We\'re online' : 'We\'ll reply soon'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-[13px] leading-relaxed relative">
                {isBusinessHours
                  ? 'Hey! We\'re here and ready to help. Ask us anything about your account, calls, or payments.'
                  : 'Leave us a message and we\'ll get back to you first thing in the morning!'}
              </p>

              <div className="flex items-center gap-4 mt-4 relative">
                <button onClick={() => setView('new')}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Conversation
                </button>
              </div>

              <p className="text-[10px] text-slate-500 mt-3 text-center relative">
                Avg. response time: <span className="text-slate-400">under 2 hours</span>
              </p>
            </div>
          </div>

          {/* Ticket List */}
          <div className="flex-1 overflow-y-auto px-5 pt-4">
            {tickets.length > 0 && (
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium mb-2 px-1">Your conversations</p>
            )}
            {tickets.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-navy-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">No conversations yet</p>
                <p className="text-slate-600 text-xs mt-1">Start one — we&apos;re fast!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tickets.map((t, i) => (
                  <button key={t.id} onClick={() => openTicket(t)}
                    className={`w-full text-left bg-navy-800 rounded-2xl px-4 py-3.5 transition-all hover:bg-navy-700 active:scale-[0.98] ${t.unread_customer ? 'ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/5' : ''}`}
                    style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {t.unread_customer ? (
                            <span className="relative flex h-2 w-2 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                            </span>
                          ) : null}
                          <p className={`text-sm truncate ${t.unread_customer ? 'text-white font-semibold' : 'text-slate-300'}`}>
                            {t.subject}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          {statusBadge(t.status)}
                          <span className="text-[10px] text-slate-500">
                            {new Date(t.last_message_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-slate-600 shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* === NEW TICKET VIEW === */}
      {view === 'new' && (
        <>
          <div className="px-5 pt-10 pb-2 flex items-center justify-between shrink-0">
            <button onClick={() => setView('list')}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-base font-bold text-white">New Conversation</h1>
            <div className="w-14" />
          </div>

          {/* Agent strip */}
          <div className="mx-5 mt-2 mb-4 flex items-center gap-3 bg-navy-800/50 rounded-xl px-4 py-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">V</div>
            <div className="flex-1">
              <p className="text-xs text-slate-300">You&apos;re messaging <span className="text-white font-medium">VoxClouds Support</span></p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                <span className="text-[10px] text-green-400">Online now</span>
              </div>
            </div>
          </div>

          <div className="flex-1 px-5 space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Subject</label>
              <input value={newSubject} onChange={e => setNewSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-sm transition-all"
                placeholder="What do you need help with?" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Message</label>
              <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} rows={5}
                className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-sm resize-none transition-all"
                placeholder="Tell us what's going on..." />
            </div>
            <button onClick={handleNewTicket} disabled={!newSubject.trim() || !newMessage.trim() || sending}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl text-sm transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
              {sending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Message
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* === CHAT VIEW === */}
      {view === 'chat' && (
        <>
          {/* Chat Header */}
          <div className="px-4 pt-10 pb-2 flex items-center gap-3 shrink-0">
            <button onClick={() => { setView('list'); setActiveTicketId(null) }}
              className="text-slate-400 hover:text-white transition-colors active:scale-95 p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">V</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 ring-2 ring-navy-950" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">VoxClouds Support</p>
                <p className="text-[10px] text-green-400">Online</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-slate-500">#{activeTicketId}</p>
              {activeTicketStatus && statusBadge(activeTicketStatus)}
            </div>
          </div>

          {/* Ticket subject */}
          {activeTicketSubject && (
            <div className="px-5 py-1.5 border-b border-slate-800/50">
              <p className="text-[11px] text-slate-500 truncate">{activeTicketSubject}</p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}>
                {msg.sender_type === 'admin' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mr-2 mt-auto mb-1">V</div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.sender_type === 'admin'
                    ? 'bg-navy-800 text-slate-200 rounded-bl-md'
                    : 'bg-blue-600 text-white rounded-br-md'
                }`}>
                  <p className="text-[13px] whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender_type === 'admin' ? 'text-slate-500' : 'text-blue-200'}`}>
                    {msg.sender_type === 'admin' ? 'Support' : 'You'} &bull;{' '}
                    {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Reply input */}
          <div className="px-4 py-3 border-t border-slate-800/50 shrink-0 bg-navy-950">
            {showSent && (
              <div className="flex items-center justify-center gap-1.5 mb-2 text-green-400 text-xs animate-bounce">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sent!
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSendReply() } }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-sm transition-all"
              />
              <button onClick={handleSendReply} disabled={!reply.trim() || sending}
                className="px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl transition-all active:scale-95">
                {sending ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  )
}
