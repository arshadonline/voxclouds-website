'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Ticket {
  id: number
  subject: string
  status: string
  priority: string
  unread_admin: number
  last_message_at: string
  created_at: string
  accountid: number
  account_number: string
  customer_name: string
  sender_email: string | null
  sender_name: string | null
  source: 'web' | 'email' | null
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-900/50 text-blue-400',
  in_progress: 'bg-yellow-900/50 text-yellow-400',
  resolved: 'bg-green-900/50 text-green-400',
  closed: 'bg-slate-800 text-slate-500',
}

const priorityIcons: Record<string, string> = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-slate-500',
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchTickets()
    const interval = setInterval(fetchTickets, 10000)
    return () => clearInterval(interval)
  }, [filter])

  async function fetchTickets() {
    const params = new URLSearchParams()
    if (filter) params.set('status', filter)
    if (search) params.set('search', search)
    const res = await fetch(`/api/admin/tickets?${params}`)
    const data = await res.json()
    setTickets(data.tickets || [])
    setUnreadCount(data.unread_count || 0)
    setLoading(false)
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  // Split tickets into categories
  const customerTickets = tickets.filter(t => t.accountid > 0)
  const guestTickets = tickets.filter(t => !t.accountid || t.accountid === 0)

  function renderTicket(ticket: Ticket) {
    const isGuest = !ticket.accountid || ticket.accountid === 0
    const displayName = isGuest
      ? ticket.sender_name || ticket.sender_email || 'Unknown'
      : ticket.customer_name?.trim() || ticket.account_number

    return (
      <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`}
        className={`block px-4 py-3.5 hover:bg-navy-800/50 transition-colors ${ticket.unread_admin ? 'bg-blue-950/20' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {ticket.unread_admin ? <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" /> : null}
              {ticket.priority === 'high' && <span className="text-red-400 text-xs font-bold shrink-0">!!</span>}
              <h3 className={`text-sm font-medium truncate ${ticket.unread_admin ? 'text-white' : 'text-slate-300'}`}>
                {ticket.subject.replace(/^\[(sales|support)\] /i, '')}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              {/* Source badge */}
              {ticket.source === 'email' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-900/30 text-cyan-400 border border-cyan-800/30">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Email
                </span>
              )}
              {/* Priority badge for medium/high */}
              {ticket.priority === 'high' && (
                <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-900/30 text-red-400 border border-red-800/30">
                  High
                </span>
              )}
              <span className="text-xs text-slate-500">{displayName}</span>
              {!isGuest && <span className="text-xs text-slate-600 font-mono">{ticket.account_number}</span>}
              {isGuest && ticket.sender_email && (
                <span className="text-xs text-slate-500">{ticket.sender_email}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[ticket.status] || ''}`}>
              {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </span>
            <span className="text-xs text-slate-500 w-14 text-right">{timeAgo(ticket.last_message_at)}</span>
          </div>
        </div>
      </Link>
    )
  }

  const customerUnread = customerTickets.filter(t => t.unread_admin).length
  const guestUnread = guestTickets.filter(t => t.unread_admin).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Support Tickets
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Customer support conversations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2">
          {['', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === s ? 'bg-blue-600 text-white' : 'bg-navy-800 text-slate-400 hover:text-white'
              }`}>
              {s === '' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex-1">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchTickets()}
            placeholder="Search by subject, account, customer, email..."
            className="w-full px-4 py-2 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading...</div>
      ) : tickets.length === 0 ? (
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">No tickets found</div>
      ) : (
        <div className="space-y-5">
          {/* Customer Tickets — Priority */}
          {customerTickets.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Customer Tickets
                </h2>
                <span className="text-xs text-slate-600">({customerTickets.length})</span>
                {customerUnread > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold">
                    {customerUnread}
                  </span>
                )}
              </div>
              <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="divide-y divide-slate-800/50">
                  {customerTickets.map(renderTicket)}
                </div>
              </div>
            </div>
          )}

          {/* Guest / Email Tickets */}
          {guestTickets.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email / Guest Inquiries
                </h2>
                <span className="text-xs text-slate-600">({guestTickets.length})</span>
                {guestUnread > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-600 text-white text-[10px] font-bold">
                    {guestUnread}
                  </span>
                )}
              </div>
              <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="divide-y divide-slate-800/50">
                  {guestTickets.map(renderTicket)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
