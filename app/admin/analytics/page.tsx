'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Funnel {
  total_signups: number; trial_given: number; trial_expired: number; made_calls: number
  paying_customers: number; with_balance: number; total_trial_balance_outstanding: number; total_trial_given: number
}
interface EmailStats { total_sent: number; total_opened: number; total_ignored: number }
interface EmailTemplate { template: string; sent: number; opened: number }
interface Customer {
  id: number; first_name: string; last_name: string; email: string; balance: number
  creation: string; country_name: string; trial_balance: number; trial_credited_at: string | null
  email_opt_out: number; connected_calls: number; paid_count: number
  emails_sent: number; emails_opened: number; days_since_signup: number
}

type Segment = 'all' | 'no_trial' | 'trial_no_calls' | 'made_calls_no_pay' | 'paying' | 'sleeping' | 'opened_no_activity' | 'never_opened'

const SEGMENTS: { key: Segment; label: string; desc: string }[] = [
  { key: 'all', label: 'All Customers', desc: 'Everyone' },
  { key: 'no_trial', label: 'No Trial Given', desc: 'Signed up but no trial credit yet' },
  { key: 'trial_no_calls', label: 'Trial, No Calls', desc: 'Got trial credit but never called' },
  { key: 'made_calls_no_pay', label: 'Called, Not Paid', desc: 'Made calls but never purchased' },
  { key: 'paying', label: 'Paying Customers', desc: 'Made at least one payment' },
  { key: 'sleeping', label: 'Sleeping (7+ days)', desc: 'No activity for 7+ days, $0 balance' },
  { key: 'opened_no_activity', label: 'Opened Email, No Action', desc: 'Opened our emails but never called or paid' },
  { key: 'never_opened', label: 'Never Opened Email', desc: 'We sent emails but they never opened' },
]

function filterBySegment(customers: Customer[], segment: Segment, country: string): Customer[] {
  let filtered = customers.filter(c => !c.email_opt_out)
  if (country) filtered = filtered.filter(c => c.country_name === country)

  switch (segment) {
    case 'no_trial': return filtered.filter(c => !c.trial_credited_at)
    case 'trial_no_calls': return filtered.filter(c => c.trial_credited_at && c.connected_calls === 0)
    case 'made_calls_no_pay': return filtered.filter(c => c.connected_calls > 0 && c.paid_count === 0)
    case 'paying': return filtered.filter(c => c.paid_count > 0)
    case 'sleeping': return filtered.filter(c => c.days_since_signup >= 7 && c.balance <= 0)
    case 'opened_no_activity': return filtered.filter(c => c.emails_opened > 0 && c.connected_calls === 0 && c.paid_count === 0)
    case 'never_opened': return filtered.filter(c => c.emails_sent > 0 && c.emails_opened === 0)
    default: return filtered
  }
}

export default function AnalyticsPage() {
  const [funnel, setFunnel] = useState<Funnel | null>(null)
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null)
  const [emailByTemplate, setEmailByTemplate] = useState<EmailTemplate[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const [segment, setSegment] = useState<Segment>('all')
  const [country, setCountry] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  // Bulk email state
  const [showCompose, setShowCompose] = useState(false)
  const [bulkSubject, setBulkSubject] = useState('')
  const [bulkMessage, setBulkMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null)

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(d => {
      setFunnel(d.funnel)
      setEmailStats(d.emailStats)
      setEmailByTemplate(d.emailByTemplate || [])
      setCustomers(d.customers || [])
      setLoading(false)
    })
  }, [])

  const filtered = filterBySegment(customers, segment, country)
  const countries = Array.from(new Set(customers.map(c => c.country_name))).filter(Boolean).sort()

  function toggleSelect(id: number) {
    const s = new Set(selected)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelected(s)
    setSelectAll(false)
  }

  function toggleAll() {
    if (selectAll) {
      setSelected(new Set())
      setSelectAll(false)
    } else {
      setSelected(new Set(filtered.map(c => c.id)))
      setSelectAll(true)
    }
  }

  async function handleBulkSend() {
    if (!bulkSubject.trim() || !bulkMessage.trim() || selected.size === 0) return
    setSending(true)
    setSendResult(null)
    const res = await fetch('/api/admin/bulk-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerIds: Array.from(selected),
        subject: bulkSubject.trim(),
        message: bulkMessage.trim(),
      }),
    })
    const d = await res.json()
    setSending(false)
    setSendResult(d)
  }

  if (loading) return <div className="animate-pulse p-8"><div className="h-48 bg-navy-800 rounded-xl" /></div>

  const f = funnel!
  const e = emailStats!
  const openRate = e.total_sent > 0 ? Math.round((e.total_opened / e.total_sent) * 100) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Sales Analytics</h1>
        <Link href="/admin" className="text-blue-400 hover:text-blue-300 text-sm">&larr; Dashboard</Link>
      </div>

      {/* Funnel Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Total Signups', value: f.total_signups, color: 'text-white' },
          { label: 'Trial Given', value: f.trial_given, color: 'text-emerald-400' },
          { label: 'Made Calls', value: f.made_calls, color: 'text-blue-400' },
          { label: 'Paying', value: f.paying_customers, color: 'text-green-400' },
          { label: 'With Balance', value: f.with_balance, color: 'text-yellow-400' },
          { label: 'Trial Expired', value: f.trial_expired, color: 'text-red-400' },
        ].map(card => (
          <div key={card.label} className="bg-navy-800 rounded-xl p-4 border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Funnel Visualization */}
      <div className="bg-navy-800 rounded-xl p-5 mb-6 border border-slate-700/30">
        <h2 className="text-sm font-semibold text-white mb-4">Conversion Funnel</h2>
        <div className="space-y-2">
          {[
            { label: 'Signed Up', count: f.total_signups, pct: 100, color: 'bg-slate-500' },
            { label: 'Trial Credit Given', count: f.trial_given, pct: f.total_signups > 0 ? (f.trial_given / f.total_signups) * 100 : 0, color: 'bg-emerald-500' },
            { label: 'Made a Call', count: f.made_calls, pct: f.total_signups > 0 ? (f.made_calls / f.total_signups) * 100 : 0, color: 'bg-blue-500' },
            { label: 'Became Paying', count: f.paying_customers, pct: f.total_signups > 0 ? (f.paying_customers / f.total_signups) * 100 : 0, color: 'bg-green-500' },
          ].map(step => (
            <div key={step.label} className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-36 shrink-0">{step.label}</span>
              <div className="flex-1 bg-navy-900 rounded-full h-6 relative overflow-hidden">
                <div className={`${step.color} h-full rounded-full transition-all`} style={{ width: `${Math.max(step.pct, 2)}%` }} />
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-white">
                  {step.count} ({Math.round(step.pct)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-700/50">
          <span className="text-xs text-slate-500">Trial balance outstanding: <span className="text-yellow-400">${Number(f.total_trial_balance_outstanding).toFixed(2)}</span></span>
          <span className="text-xs text-slate-500">Total trial given: <span className="text-emerald-400">${Number(f.total_trial_given).toFixed(2)}</span></span>
        </div>
      </div>

      {/* Email Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-navy-800 rounded-xl p-5 border border-slate-700/30">
          <h2 className="text-sm font-semibold text-white mb-4">Email Performance</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-2xl font-bold text-white">{e.total_sent}</p>
              <p className="text-[10px] text-slate-500 uppercase">Sent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{e.total_opened}</p>
              <p className="text-[10px] text-slate-500 uppercase">Opened</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-400">{openRate}%</p>
              <p className="text-[10px] text-slate-500 uppercase">Open Rate</p>
            </div>
          </div>
          <div className="w-full bg-navy-900 rounded-full h-3 overflow-hidden">
            <div className="bg-green-500 h-full rounded-full" style={{ width: `${openRate}%` }} />
          </div>
          <p className="text-[10px] text-slate-600 mt-1">{e.total_ignored} never opened</p>
        </div>

        <div className="bg-navy-800 rounded-xl p-5 border border-slate-700/30">
          <h2 className="text-sm font-semibold text-white mb-4">By Email Type</h2>
          <div className="space-y-2">
            {emailByTemplate.map(t => (
              <div key={t.template} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    t.template === 'welcome' ? 'bg-blue-500' : t.template === 'trial_credit' ? 'bg-emerald-500'
                    : t.template === 're-engage' ? 'bg-yellow-500' : t.template === 'bulk' ? 'bg-purple-500' : 'bg-slate-500'
                  }`} />
                  <span className="text-sm text-slate-300">{t.template}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{t.sent} sent</span>
                  <span className="text-xs text-green-400">{t.opened} opened</span>
                  <span className="text-xs text-slate-600">{t.sent > 0 ? Math.round((t.opened / t.sent) * 100) : 0}%</span>
                </div>
              </div>
            ))}
            {emailByTemplate.length === 0 && <p className="text-sm text-slate-500">No emails sent yet</p>}
          </div>
        </div>
      </div>

      {/* Segment Selector + Customer List + Bulk Email */}
      <div className="bg-navy-800 rounded-xl border border-slate-700/30 overflow-hidden mb-6">
        <div className="p-5 border-b border-slate-700/50">
          <h2 className="text-sm font-semibold text-white mb-3">Customer Segments</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {SEGMENTS.map(s => (
              <button key={s.key} onClick={() => { setSegment(s.key); setSelected(new Set()); setSelectAll(false) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  segment === s.key ? 'bg-blue-600 text-white' : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-700'
                }`}>
                {s.label}
                <span className="ml-1 opacity-60">({filterBySegment(customers, s.key, country).length})</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <select value={country} onChange={e => { setCountry(e.target.value); setSelected(new Set()); setSelectAll(false) }}
              className="px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="text-xs text-slate-500">{filtered.length} customers</span>
            {selected.size > 0 && (
              <button onClick={() => setShowCompose(true)}
                className="ml-auto px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
                Email {selected.size} Selected
              </button>
            )}
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs uppercase bg-navy-900/50">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={selectAll} onChange={toggleAll} className="accent-blue-500" />
                </th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3 text-center">Trial</th>
                <th className="px-4 py-3 text-center">Calls</th>
                <th className="px-4 py-3 text-center">Paid</th>
                <th className="px-4 py-3 text-center">Emails</th>
                <th className="px-4 py-3 text-center">Opens</th>
                <th className="px-4 py-3 text-right">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.map(c => (
                <tr key={c.id} className={`hover:bg-navy-700/30 ${selected.has(c.id) ? 'bg-blue-900/10' : ''}`}>
                  <td className="px-4 py-2.5">
                    <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} className="accent-blue-500" />
                  </td>
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/customers/${c.id}`} className="hover:text-blue-400">
                      <p className="text-white text-sm font-medium">{c.first_name} {c.last_name}</p>
                      <p className="text-[11px] text-slate-500">{c.email}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 text-xs">{c.country_name}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={Number(c.balance) > 0 ? 'text-green-400' : 'text-red-400'}>${Number(c.balance).toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {c.trial_credited_at ? (
                      <span className="text-emerald-400 text-xs">$0.50</span>
                    ) : (
                      <span className="text-slate-600 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={c.connected_calls > 0 ? 'text-blue-400' : 'text-slate-600'}>{c.connected_calls}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={c.paid_count > 0 ? 'text-green-400' : 'text-slate-600'}>{c.paid_count}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center text-slate-400">{c.emails_sent}</td>
                  <td className="px-4 py-2.5 text-center">
                    {c.emails_opened > 0 ? (
                      <span className="text-green-400">{c.emails_opened}</span>
                    ) : c.emails_sent > 0 ? (
                      <span className="text-red-400">0</span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs text-slate-500">{c.days_since_signup}d</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-slate-500">No customers in this segment</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compose Bulk Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => { if (!sending) { setShowCompose(false); setSendResult(null) } }}>
          <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">Send Email to {selected.size} Customers</h3>
            <p className="text-xs text-slate-500 mb-4">
              Segment: {SEGMENTS.find(s => s.key === segment)?.label}{country ? ` / ${country}` : ''}
            </p>

            {sendResult ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-900/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-semibold">{sendResult.sent} emails sent</p>
                {sendResult.failed > 0 && <p className="text-red-400 text-sm mt-1">{sendResult.failed} failed</p>}
                <button onClick={() => { setShowCompose(false); setSendResult(null); setBulkSubject(''); setBulkMessage('') }}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Done</button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Subject</label>
                  <input value={bulkSubject} onChange={e => setBulkSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Email subject line" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Message</label>
                  <textarea value={bulkMessage} onChange={e => setBulkMessage(e.target.value)} rows={6}
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Email body (plain text, newlines become line breaks)" />
                </div>
                <p className="text-[10px] text-slate-600">Each email is personalized with the customer's name. 2s delay between sends. Max 50 per batch.</p>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setShowCompose(false); setSendResult(null) }}
                    className="flex-1 py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Cancel</button>
                  <button onClick={handleBulkSend} disabled={sending || !bulkSubject.trim() || !bulkMessage.trim()}
                    className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50">
                    {sending ? `Sending... (${selected.size} emails)` : `Send to ${selected.size} Customers`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
