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

  return (
    <div className="min-h-screen bg-navy-950 max-w-sm mx-auto flex flex-col pb-20">
      {/* Header */}
      <div className="px-5 pt-12 pb-2 flex items-center justify-between shrink-0">
        {view === 'list' ? (
          <>
            <h1 className="text-xl font-bold text-white">Support</h1>
            <button onClick={() => setView('new')}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
              New Ticket
            </button>
          </>
        ) : (
          <>
            <button onClick={() => { setView('list'); setActiveTicketId(null) }}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back</span>
            </button>
            <div className="text-right">
              <h1 className="text-base font-bold text-white">
                {view === 'new' ? 'New Ticket' : `#${activeTicketId}`}
              </h1>
              {view === 'chat' && activeTicketStatus && statusBadge(activeTicketStatus)}
            </div>
          </>
        )}
      </div>

      {/* Ticket List */}
      {view === 'list' && (
        <div className="flex-1 overflow-y-auto px-5 pt-4">
          {tickets.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-slate-400 text-sm mb-1">No conversations yet</p>
              <p className="text-slate-500 text-xs">Tap &quot;New Ticket&quot; to get help</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map(t => (
                <button key={t.id} onClick={() => openTicket(t)}
                  className={`w-full text-left bg-navy-800 rounded-2xl px-4 py-3.5 transition-colors hover:bg-navy-700 ${t.unread_customer ? 'ring-1 ring-blue-600/30' : ''}`}>
                  <div className="flex items-start gap-2">
                    {t.unread_customer ? <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" /> : null}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${t.unread_customer ? 'text-white font-semibold' : 'text-slate-300'}`}>
                        {t.subject}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        {statusBadge(t.status)}
                        <span className="text-[10px] text-slate-500">
                          {new Date(t.last_message_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Ticket Form */}
      {view === 'new' && (
        <div className="flex-1 px-5 pt-4 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Subject</label>
            <input value={newSubject} onChange={e => setNewSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              placeholder="What do you need help with?" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Message</label>
            <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} rows={6}
              className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
              placeholder="Describe your issue..." />
          </div>
          <button onClick={handleNewTicket} disabled={!newSubject.trim() || !newMessage.trim() || sending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl text-sm transition-colors">
            {sending ? 'Sending...' : 'Send Ticket'}
          </button>
        </div>
      )}

      {/* Chat View */}
      {view === 'chat' && (
        <>
          {activeTicketSubject && (
            <div className="px-5 py-2">
              <p className="text-xs text-slate-400 truncate">{activeTicketSubject}</p>
            </div>
          )}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.sender_type === 'admin'
                    ? 'bg-navy-800 text-slate-200 rounded-bl-md'
                    : 'bg-blue-600 text-white rounded-br-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender_type === 'admin' ? 'text-slate-500' : 'text-blue-200'}`}>
                    {msg.sender_type === 'admin' ? 'Support' : 'You'} &bull;{' '}
                    {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="px-4 py-3 border-t border-slate-800 shrink-0">
            <div className="flex gap-2">
              <input
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSendReply() } }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button onClick={handleSendReply} disabled={!reply.trim() || sending}
                className="px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  )
}
