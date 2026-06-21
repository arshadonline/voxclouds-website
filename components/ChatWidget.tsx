'use client'
import { useState, useEffect, useRef } from 'react'

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

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'list' | 'new' | 'chat'>('list')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [activeTicketId, setActiveTicketId] = useState<number | null>(null)
  const [activeTicketStatus, setActiveTicketStatus] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [unreadTotal, setUnreadTotal] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && view === 'list') fetchTickets()
  }, [open, view])

  useEffect(() => {
    // Poll for unread
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
      const tix = data.tickets || []
      setTickets(tix)
      setUnreadTotal(tix.reduce((sum: number, t: Ticket) => sum + (t.unread_customer || 0), 0))
      // Update active ticket status if viewing one
      if (activeTicketId) {
        const active = tix.find((t: Ticket) => t.id === activeTicketId)
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

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all"
      >
        {unreadTotal > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadTotal}
          </span>
        )}
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[500px] bg-navy-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-navy-900 shrink-0">
            {view === 'list' ? (
              <>
                <h3 className="text-sm font-semibold text-white">Support</h3>
                <button onClick={() => setView('new')} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition-colors">
                  New Ticket
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setView('list'); setActiveTicketId(null) }}
                  className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-white">
                    {view === 'new' ? 'New Ticket' : `Ticket #${activeTicketId}`}
                  </h3>
                  {view === 'chat' && activeTicketStatus && (
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-0.5 ${
                      activeTicketStatus === 'open' ? 'bg-blue-900/50 text-blue-400'
                        : activeTicketStatus === 'in_progress' ? 'bg-yellow-900/50 text-yellow-400'
                        : activeTicketStatus === 'resolved' ? 'bg-green-900/50 text-green-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {activeTicketStatus === 'in_progress' ? 'In Progress' : activeTicketStatus.charAt(0).toUpperCase() + activeTicketStatus.slice(1)}
                    </span>
                  )}
                </div>
                <div className="w-5" />
              </>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {view === 'list' && (
              <div>
                {tickets.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-slate-400 text-sm">No conversations yet</p>
                    <button onClick={() => setView('new')} className="mt-3 text-sm text-blue-400 hover:text-blue-300">
                      Start a new conversation
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/50">
                    {tickets.map(t => (
                      <button key={t.id} onClick={() => openTicket(t)}
                        className={`w-full text-left px-4 py-3 hover:bg-navy-900 transition-colors ${t.unread_customer ? 'bg-blue-950/20' : ''}`}>
                        <div className="flex items-center gap-2">
                          {t.unread_customer ? <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" /> : null}
                          <span className={`text-sm truncate ${t.unread_customer ? 'text-white font-medium' : 'text-slate-300'}`}>
                            {t.subject}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            t.status === 'open' ? 'bg-blue-900/50 text-blue-400'
                              : t.status === 'in_progress' ? 'bg-yellow-900/50 text-yellow-400'
                              : t.status === 'resolved' ? 'bg-green-900/50 text-green-400'
                              : 'bg-slate-800 text-slate-500'
                          }`}>
                            {t.status === 'in_progress' ? 'In Progress' : t.status}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(t.last_message_at).toLocaleDateString()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {view === 'new' && (
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Subject</label>
                  <input value={newSubject} onChange={e => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                    placeholder="What do you need help with?" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Message</label>
                  <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} rows={5}
                    className="w-full px-3 py-2 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
                    placeholder="Describe your issue..." />
                </div>
                <button onClick={handleNewTicket} disabled={!newSubject.trim() || !newMessage.trim() || sending}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-colors">
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            )}

            {view === 'chat' && (
              <div className="px-3 py-3 space-y-2">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                      msg.sender_type === 'admin'
                        ? 'bg-navy-800 text-slate-200 rounded-bl-md'
                        : 'bg-blue-600 text-white rounded-br-md'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                      <p className={`text-[10px] mt-0.5 ${msg.sender_type === 'admin' ? 'text-slate-500' : 'text-blue-200'}`}>
                        {msg.sender_type === 'admin' ? 'Support' : 'You'} &bull;{' '}
                        {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Reply input for chat view */}
          {view === 'chat' && (
            <div className="px-3 py-2 border-t border-slate-800 shrink-0">
              <div className="flex gap-2">
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSendReply() } }}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
                <button onClick={handleSendReply} disabled={!reply.trim() || sending}
                  className="px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
