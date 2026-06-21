'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Message {
  id: number
  sender_type: 'customer' | 'admin'
  message: string
  created_at: string
}

interface TicketDetail {
  id: number
  subject: string
  status: string
  priority: string
  accountid: number
  account_number: string
  customer_name: string
  customer_email: string
  balance: number
  created_at: string
  sender_email: string | null
  sender_name: string | null
  source: 'web' | 'email' | null
}

export default function AdminTicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [customerTicketCount, setCustomerTicketCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTicket()
    const interval = setInterval(fetchTicket, 5000) // poll every 5s
    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchTicket() {
    const res = await fetch(`/api/admin/tickets/${id}`)
    if (!res.ok) return
    const data = await res.json()
    setTicket(data.ticket)
    setMessages(data.messages)
    setCustomerTicketCount(data.customer_ticket_count)
    setLoading(false)
  }

  async function handleSend() {
    if (!reply.trim() || sending) return
    setSending(true)
    await fetch(`/api/admin/tickets/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: reply.trim() }),
    })
    setReply('')
    setSending(false)
    fetchTicket()
  }

  async function handleStatusChange(status: string) {
    await fetch(`/api/admin/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchTicket()
  }

  async function handlePriorityChange(priority: string) {
    await fetch(`/api/admin/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority }),
    })
    fetchTicket()
  }

  if (loading) return <div className="text-slate-400">Loading...</div>
  if (!ticket) return <div className="text-red-400">Ticket not found</div>

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">
      {/* Messages Panel */}
      <div className="flex-1 flex flex-col bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden min-w-0">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/tickets" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0">
              <h2 className="text-sm font-medium text-white truncate">{ticket.subject}</h2>
              <p className="text-xs text-slate-500">#{ticket.id} &bull; {ticket.customer_name?.trim() || ticket.account_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {(['open', 'in_progress', 'resolved', 'closed'] as const).map(s => {
              const colors: Record<string, string> = {
                open: ticket.status === s ? 'bg-blue-600 text-white' : 'bg-navy-800 text-blue-400 border border-blue-800 hover:bg-blue-900/50',
                in_progress: ticket.status === s ? 'bg-yellow-600 text-white' : 'bg-navy-800 text-yellow-400 border border-yellow-800 hover:bg-yellow-900/50',
                resolved: ticket.status === s ? 'bg-green-600 text-white' : 'bg-navy-800 text-green-400 border border-green-800 hover:bg-green-900/50',
                closed: ticket.status === s ? 'bg-slate-600 text-white' : 'bg-navy-800 text-slate-400 border border-slate-700 hover:bg-slate-800',
              }
              const labels: Record<string, string> = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' }
              return (
                <button key={s} onClick={() => handleStatusChange(s)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${colors[s]}`}>
                  {labels[s]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.sender_type === 'admin'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-navy-800 text-slate-200 rounded-bl-md'
              }`}>
                <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                <p className={`text-[10px] mt-1 ${msg.sender_type === 'admin' ? 'text-blue-200' : 'text-slate-500'}`}>
                  {msg.sender_type === 'admin' ? 'You' : 'Customer'} &bull;{' '}
                  {new Date(msg.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Reply Box */}
        <div className="px-4 py-3 border-t border-slate-800 shrink-0">
          <div className="flex gap-2">
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Type your reply... (Enter to send, Shift+Enter for new line)"
              rows={2}
              className="flex-1 px-4 py-2.5 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!reply.trim() || sending}
              className="px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Sidebar */}
      <div className="w-full lg:w-72 shrink-0 space-y-4">
        {/* Customer Info */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            {ticket.source === 'email' && !ticket.accountid ? 'Email Sender' : 'Customer'}
          </h3>
          {ticket.source === 'email' && (
            <div className="mb-3 px-2 py-1.5 rounded-lg bg-cyan-900/20 border border-cyan-800/30">
              <p className="text-[10px] text-cyan-400 font-medium">Via Email</p>
            </div>
          )}
          <div className="space-y-2 text-sm">
            {/* Sender info for email-originated tickets */}
            {ticket.sender_name && (
              <div>
                <p className="text-slate-500 text-xs">Sender Name</p>
                <p className="text-white">{ticket.sender_name}</p>
              </div>
            )}
            {ticket.sender_email && (
              <div>
                <p className="text-slate-500 text-xs">Sender Email</p>
                <a href={`mailto:${ticket.sender_email}`} className="text-cyan-400 hover:text-cyan-300 text-xs break-all">
                  {ticket.sender_email}
                </a>
              </div>
            )}
            {/* Customer account info (only if linked to a real account) */}
            {ticket.accountid > 0 && (
              <>
                <div>
                  <p className="text-slate-500 text-xs">Name</p>
                  <p className="text-white">{ticket.customer_name?.trim() || '—'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Account</p>
                  <Link href={`/admin/customers/${ticket.accountid}`} className="text-blue-400 hover:text-blue-300">
                    {ticket.account_number}
                  </Link>
                </div>
                {ticket.customer_email && !ticket.sender_email && (
                  <div>
                    <p className="text-slate-500 text-xs">Email</p>
                    <p className="text-slate-300 text-xs break-all">{ticket.customer_email}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-500 text-xs">Balance</p>
                  <p className="text-white font-medium">${Number(ticket.balance || 0).toFixed(2)}</p>
                </div>
              </>
            )}
            {/* Show "Guest" badge for non-customer emails */}
            {!ticket.accountid && ticket.sender_email && (
              <div className="px-2 py-1.5 rounded-lg bg-orange-900/20 border border-orange-800/30">
                <p className="text-[10px] text-orange-400 font-medium">Guest — no VoxClouds account</p>
              </div>
            )}
            <div>
              <p className="text-slate-500 text-xs">Total Tickets</p>
              <p className="text-slate-300">{customerTicketCount}</p>
            </div>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Ticket Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-slate-500 text-xs">Priority</p>
              <select
                value={ticket.priority}
                onChange={e => handlePriorityChange(e.target.value)}
                className="mt-1 text-xs bg-navy-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Created</p>
              <p className="text-slate-300 text-xs">
                {new Date(ticket.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Actions</h3>
          <div className="space-y-2">
            {ticket.status !== 'resolved' && (
              <button onClick={() => handleStatusChange('resolved')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-green-400 hover:bg-navy-800 transition-colors">
                Mark Resolved
              </button>
            )}
            {ticket.status !== 'closed' && (
              <button onClick={() => handleStatusChange('closed')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-navy-800 transition-colors">
                Close Ticket
              </button>
            )}
            {(ticket.status === 'resolved' || ticket.status === 'closed') && (
              <button onClick={() => handleStatusChange('open')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-blue-400 hover:bg-navy-800 transition-colors">
                Reopen Ticket
              </button>
            )}
            {ticket.accountid > 0 && (
              <Link href={`/admin/customers/${ticket.accountid}`}
                className="block px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-navy-800 transition-colors">
                View Customer Profile
              </Link>
            )}
            <button onClick={async () => {
              if (!confirm(`Delete ticket #${ticket.id} "${ticket.subject}"? This cannot be undone.`)) return
              await fetch(`/api/admin/tickets/${id}`, { method: 'DELETE' })
              router.push('/admin/tickets')
            }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-colors">
              Delete Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
