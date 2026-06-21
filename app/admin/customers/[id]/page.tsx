'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Account {
  id: number; number: string; first_name: string; last_name: string; email: string
  balance: number; credit_limit: number; status: number; creation: string
  company_name: string; telephone_1: string; telephone_2: string
  address_1: string; city: string; province: string; postal_code: string
  maxchannels: number; type: number; country_id: number; country_name?: string
}

interface SipDevice { id: number; username: string; alias: string | null; status: number; codec: string; creation_date: string }
interface CDR { callerid: string; callednum: string; billseconds: number; debit: number; cost: number; disposition: string; callstart: string; call_direction: string }
interface Payment { id: number; amount: number; payment_method: string; date: string }
interface Recharge { id: number; amount: number; status: string; payment_method: string; created_at: string; review_note: string }

export default function CustomerDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<{ account: Account; sipDevices: SipDevice[]; cdrs: CDR[]; payments: Payment[]; recharges: Recharge[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'cdrs' | 'payments' | 'recharges' | 'sip'>('cdrs')
  const [balanceModal, setBalanceModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  // Edit state
  const [editModal, setEditModal] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Account>>({})
  // SIP device state
  const [sipModal, setSipModal] = useState(false)
  const [sipPass, setSipPass] = useState('')
  const [sipCreateResult, setSipCreateResult] = useState<{ username: string; password: string } | null>(null)
  // Delete/suspend state
  const [confirmAction, setConfirmAction] = useState<'delete' | 'suspend' | 'activate' | null>(null)
  // SIP device edit/reset state
  const [sipEditModal, setSipEditModal] = useState<SipDevice | null>(null)
  const [sipEditCodec, setSipEditCodec] = useState('')
  const [sipEditAlias, setSipEditAlias] = useState('')
  const [sipResetModal, setSipResetModal] = useState<SipDevice | null>(null)
  const [sipResetPass, setSipResetPass] = useState('')
  const [sipResetResult, setSipResetResult] = useState<string | null>(null)
  // Reset password state
  const [resetModal, setResetModal] = useState(false)
  const [resetPassword, setResetPassword] = useState('')
  const [resetResult, setResetResult] = useState<{ password: string; emailSent: boolean } | null>(null)
  // Email state
  const [emailModal, setEmailModal] = useState(false)
  const [emailTemplate, setEmailTemplate] = useState('custom')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  async function fetchData() {
    const res = await fetch(`/api/admin/customers/${id}`)
    const d = await res.json()
    setData(d)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id])

  async function handleAddBalance() {
    if (!amount) return
    setSaving(true)
    await fetch(`/api/admin/customers/${id}/balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount), notes }),
    })
    setSaving(false); setBalanceModal(false); setAmount(''); setNotes(''); fetchData()
  }

  function openEdit() {
    if (!data) return
    const a = data.account
    setEditForm({ first_name: a.first_name, last_name: a.last_name, email: a.email, company_name: a.company_name,
      telephone_1: a.telephone_1, telephone_2: a.telephone_2, address_1: a.address_1, city: a.city,
      province: a.province, postal_code: a.postal_code, maxchannels: a.maxchannels, credit_limit: a.credit_limit, country_id: a.country_id })
    setEditModal(true)
  }

  async function handleSaveEdit() {
    setSaving(true)
    await fetch(`/api/admin/customers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    setSaving(false); setEditModal(false); fetchData()
  }

  async function handleSuspendToggle() {
    if (!data) return
    const newStatus = data.account.status === 0 ? 1 : 0
    await fetch(`/api/admin/customers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setConfirmAction(null); fetchData()
  }

  async function handleDelete() {
    await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' })
    setConfirmAction(null)
    router.push('/admin/customers')
  }

  async function handleCreateSip() {
    setSaving(true)
    const res = await fetch(`/api/admin/customers/${id}/sip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: sipPass || undefined }),
    })
    const d = await res.json()
    setSaving(false)
    if (d.error) { alert(d.error); return }
    setSipCreateResult({ username: d.username, password: d.password })
    fetchData()
  }

  async function handleDeleteSip(sipId: number) {
    if (!confirm('Delete this SIP device?')) return
    await fetch(`/api/admin/customers/${id}/sip?sipId=${sipId}`, { method: 'DELETE' })
    fetchData()
  }

  async function handleToggleSipStatus(device: SipDevice) {
    setSaving(true)
    await fetch(`/api/admin/customers/${id}/sip`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sipId: device.id, action: 'toggle-status', status: device.status }),
    })
    setSaving(false); fetchData()
  }

  async function handleSipEdit() {
    if (!sipEditModal) return
    setSaving(true)
    await fetch(`/api/admin/customers/${id}/sip`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sipId: sipEditModal.id, action: 'edit', codec: sipEditCodec, alias: sipEditAlias }),
    })
    setSaving(false); setSipEditModal(null); fetchData()
  }

  async function handleSipResetPassword() {
    if (!sipResetModal) return
    setSaving(true)
    const res = await fetch(`/api/admin/customers/${id}/sip`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sipId: sipResetModal.id, action: 'reset-password', password: sipResetPass || undefined }),
    })
    const d = await res.json()
    setSaving(false)
    if (d.error) { alert(d.error); return }
    setSipResetResult(d.newPassword)
  }

  async function handleResetPassword() {
    setSaving(true)
    const res = await fetch(`/api/admin/customers/${id}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: resetPassword || undefined }),
    })
    const d = await res.json()
    setSaving(false)
    if (d.error) { alert(d.error); return }
    setResetResult({ password: d.newPassword, emailSent: d.emailSent })
  }

  function closeResetModal() {
    setResetModal(false); setResetPassword(''); setResetResult(null)
  }

  const acctNum = data?.account?.number || ''
  const acctBalance = data ? Number(data.account.balance).toFixed(2) : '0.00'

  const EMAIL_TEMPLATES: Record<string, { subject: string; message: string }> = {
    balance: {
      subject: `VoxClouds account ${acctNum} — balance update`,
      message: `Your VoxClouds account balance has been updated.\n\nAccount: ${acctNum}\nCurrent balance: $${acctBalance}\n\nYou can view your balance and add funds by signing in at app.voxclouds.com.`,
    },
    low_balance: {
      subject: `VoxClouds account ${acctNum} — low balance notice`,
      message: `Your VoxClouds account balance is currently $${acctBalance}.\n\nTo avoid service interruption, you can add funds at any time by signing in to your account.\n\nIf you have questions about your account, reply to this email.`,
    },
    rates: {
      subject: `VoxClouds account ${acctNum} — calling rates update`,
      message: 'We have updated our calling rates for several international destinations.\n\nYou can view the current rates for your preferred destinations by signing in to your account.\n\nIf you have questions, reply to this email.',
    },
    service: {
      subject: `VoxClouds — service update`,
      message: 'We are writing to let you know about an update to your VoxClouds service.\n\n[Describe the update here]\n\nNo action is required on your part. If you have questions, reply to this email.',
    },
    followup: {
      subject: `Welcome to VoxClouds — how can we help you?`,
      message: `Hi ${data?.account?.first_name || ''},\n\nThanks for signing up with VoxClouds! We'd love to help you get the most out of our platform.\n\nCould you let us know what you're looking for?\n\n1. Personal international calling — affordable rates to 100+ countries\n2. Cloud PBX / business telephony — extensions, IVR, call routing\n3. DID / virtual phone numbers — local numbers in multiple countries\n4. Wholesale VoIP — carrier-grade termination for resellers\n\nAlso helpful to know:\n- Which countries do you call most?\n- How many users or extensions do you need?\n- Do you need a local phone number (DID)? If so, which country/city?\n\nJust reply to this email or WhatsApp us at +1 415 843-7100 — we'll get you set up right away.\n\nBest regards,\nVoxClouds Team`,
    },
    custom: { subject: '', message: '' },
  }

  function applyTemplate(key: string) {
    setEmailTemplate(key)
    const t = EMAIL_TEMPLATES[key]
    if (t) { setEmailSubject(t.subject); setEmailMessage(t.message) }
  }

  async function handleSendEmail() {
    if (!emailSubject.trim() || !emailMessage.trim()) return
    setSaving(true)
    const res = await fetch(`/api/admin/customers/${id}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: emailSubject, message: emailMessage }),
    })
    const d = await res.json()
    setSaving(false)
    if (d.error) { alert(d.error); return }
    setEmailSent(true)
    setTimeout(() => { setEmailModal(false); setEmailSent(false); setEmailSubject(''); setEmailMessage(''); setEmailTemplate('custom') }, 2000)
  }

  if (loading) return <div className="animate-pulse"><div className="h-48 bg-navy-800 rounded-xl" /></div>
  if (!data) return <p className="text-red-400">Customer not found</p>

  const a = data.account
  const typeLabel = a.type === 0 ? 'Customer' : a.type === 1 ? 'Reseller' : a.type === 3 ? 'Provider' : 'Admin'
  const typeColor = a.type === 0 ? 'bg-blue-900/50 text-blue-400' : a.type === 1 ? 'bg-purple-900/50 text-purple-400' : a.type === 3 ? 'bg-orange-900/50 text-orange-400' : 'bg-slate-700 text-slate-300'

  function fmtDuration(s: number) { const m = Math.floor(s / 60); const sec = s % 60; return m > 0 ? `${m}m ${sec}s` : `${sec}s` }

  const tabs = [
    { key: 'cdrs', label: 'Calls', count: data.cdrs.length },
    { key: 'payments', label: 'Payments', count: data.payments.length },
    { key: 'recharges', label: 'Recharges', count: data.recharges.length },
    { key: 'sip', label: 'SIP Devices', count: data.sipDevices.length },
  ] as const

  return (
    <div>
      <Link href="/admin/customers" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">&larr; Back to Customers</Link>

      {/* Profile Card */}
      <div className="bg-navy-800 rounded-xl border border-slate-700/50 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">{a.first_name} {a.last_name}</h1>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColor}`}>{typeLabel}</span>
            </div>
            <p className="text-slate-400 font-mono text-sm mt-1">{a.number}</p>
            {a.email && <p className="text-slate-400 text-sm">{a.email}</p>}
            {a.company_name && <p className="text-slate-500 text-sm">{a.company_name}</p>}
            {a.telephone_1 && <p className="text-slate-500 text-sm">Tel: {a.telephone_1}</p>}
            <div className="flex items-center gap-3 mt-3">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.status === 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                {a.status === 0 ? 'Active' : 'Suspended'}
              </span>
              <span className="text-xs text-slate-500">Created {new Date(a.creation).toLocaleDateString()}</span>
              <span className="text-xs text-slate-500">Max {a.maxchannels} ch</span>
            </div>
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={openEdit}
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-medium hover:bg-blue-600/30 border border-blue-600/30">
                Edit Info
              </button>
              <button onClick={() => setResetModal(true)}
                className="px-3 py-1.5 rounded-lg bg-orange-600/20 text-orange-400 text-xs font-medium hover:bg-orange-600/30 border border-orange-600/30">
                Reset Password
              </button>
              <button onClick={() => { setEmailModal(true); applyTemplate('custom') }}
                className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 text-xs font-medium hover:bg-cyan-600/30 border border-cyan-600/30">
                Send Email
              </button>
              <button onClick={() => setConfirmAction(a.status === 0 ? 'suspend' : 'activate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  a.status === 0
                    ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30 hover:bg-yellow-600/30'
                    : 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30'
                }`}>
                {a.status === 0 ? 'Suspend' : 'Activate'}
              </button>
              {a.type !== -1 && (
                <button onClick={() => setConfirmAction('delete')}
                  className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 text-xs font-medium hover:bg-red-600/30 border border-red-600/30">
                  Delete
                </button>
              )}
            </div>
          </div>
          <div className="bg-navy-900 rounded-xl p-5 min-w-[200px]">
            <p className="text-xs text-slate-400 uppercase">Balance</p>
            <p className={`text-3xl font-bold mt-1 ${Number(a.balance) > 5 ? 'text-green-400' : Number(a.balance) > 1 ? 'text-yellow-400' : 'text-red-400'}`}>
              ${Number(a.balance).toFixed(2)}
            </p>
            {Number(a.credit_limit) > 0 && <p className="text-xs text-slate-500 mt-1">Credit: ${Number(a.credit_limit).toFixed(2)}</p>}
            <button onClick={() => setBalanceModal(true)}
              className="mt-3 w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors">
              + Add Balance
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-navy-800 rounded-lg p-1 w-fit overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t.key ? 'bg-navy-700 text-white' : 'text-slate-400 hover:text-white'
            }`}>
            {t.label} <span className="text-xs text-slate-500 ml-1">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-navy-800 rounded-xl border border-slate-700/50 overflow-x-auto">
        {tab === 'cdrs' && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs uppercase">
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Direction</th>
                <th className="text-left px-5 py-3">Called</th>
                <th className="text-left px-5 py-3">Duration</th>
                <th className="text-right px-5 py-3">Billed</th>
                <th className="text-right px-5 py-3">Cost</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {data.cdrs.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-500">No calls yet</td></tr>
              ) : data.cdrs.map((c, i) => (
                <tr key={i} className="hover:bg-navy-700/50">
                  <td className="px-5 py-3 text-slate-300 text-xs">{new Date(c.callstart).toLocaleString()}</td>
                  <td className="px-5 py-3"><span className={`text-xs ${c.call_direction === 'inbound' ? 'text-cyan-400' : 'text-orange-400'}`}>{c.call_direction || 'outbound'}</span></td>
                  <td className="px-5 py-3 font-mono text-white text-xs">{c.callednum}</td>
                  <td className="px-5 py-3 text-slate-300">{fmtDuration(c.billseconds)}</td>
                  <td className="px-5 py-3 text-right text-green-400">${Number(c.debit).toFixed(4)}</td>
                  <td className="px-5 py-3 text-right text-red-400">${Number(c.cost).toFixed(4)}</td>
                  <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${c.disposition?.includes('NORMAL') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>{c.disposition?.split(' ')[0]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'payments' && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs uppercase">
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-right px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {data.payments.length === 0 ? (
                <tr><td colSpan={3} className="px-5 py-8 text-center text-slate-500">No payments</td></tr>
              ) : data.payments.map(p => (
                <tr key={p.id} className="hover:bg-navy-700/50">
                  <td className="px-5 py-3 text-slate-300 text-xs">{new Date(p.date).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-green-400">${Number(p.amount).toFixed(2)}</td>
                  <td className="px-5 py-3 text-slate-400">{p.payment_method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'recharges' && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs uppercase">
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-right px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Method</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {data.recharges.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">No recharge requests</td></tr>
              ) : data.recharges.map(r => (
                <tr key={r.id} className="hover:bg-navy-700/50">
                  <td className="px-5 py-3 text-slate-300 text-xs">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-white">${Number(r.amount).toFixed(2)}</td>
                  <td className="px-5 py-3 text-slate-400">{r.payment_method || '-'}</td>
                  <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${r.status === 'approved' ? 'bg-green-900/50 text-green-400' : r.status === 'rejected' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'}`}>{r.status}</span></td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{r.review_note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'sip' && (
          <div>
            <div className="flex justify-between items-center px-5 py-3 border-b border-slate-700/50">
              <span className="text-xs text-slate-400 uppercase font-medium">SIP Devices</span>
              <button onClick={() => setSipModal(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500">
                + Add Device
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs uppercase">
                  <th className="text-left px-5 py-3">Username</th>
                  <th className="text-left px-5 py-3">Alias</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Codec</th>
                  <th className="text-left px-5 py-3">Created</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {data.sipDevices.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">No SIP devices</td></tr>
                ) : data.sipDevices.map(s => (
                  <tr key={s.id} className="hover:bg-navy-700/50">
                    <td className="px-5 py-3 font-mono text-white">{s.username}</td>
                    <td className="px-5 py-3 text-slate-300">{s.alias || <span className="text-slate-600">—</span>}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${s.status === 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>{s.status === 0 ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-5 py-3 text-slate-400">{s.codec || 'default'}</td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{s.creation_date ? new Date(s.creation_date).toLocaleDateString() : '-'}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleToggleSipStatus(s)}
                          className={`text-xs font-medium ${s.status === 0 ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
                          {s.status === 0 ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => { setSipEditModal(s); setSipEditCodec(s.codec || 'ulaw,alaw,g729'); setSipEditAlias(s.alias || '') }}
                          className="text-blue-400 hover:text-blue-300 text-xs font-medium">Edit</button>
                        <button onClick={() => { setSipResetModal(s); setSipResetPass(''); setSipResetResult(null) }}
                          className="text-orange-400 hover:text-orange-300 text-xs font-medium">Reset PW</button>
                        <button onClick={() => handleDeleteSip(s.id)}
                          className="text-red-400 hover:text-red-300 text-xs font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Balance Modal */}
      {balanceModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setBalanceModal(false)}>
          <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Add Balance — {a.first_name} ({a.number})</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Amount ($)</label>
                <input type="number" step="0.01" min="0.01" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 h-20 resize-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setBalanceModal(false)} className="flex-1 py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Cancel</button>
                <button onClick={handleAddBalance} disabled={saving || !amount}
                  className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium disabled:opacity-50">{saving ? 'Adding...' : 'Add Balance'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditModal(false)}>
          <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Edit Customer</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'first_name', label: 'First Name', type: 'text' },
                { key: 'last_name', label: 'Last Name', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'company_name', label: 'Company', type: 'text' },
                { key: 'telephone_1', label: 'Phone (with +code)', type: 'text' },
                { key: 'telephone_2', label: 'Phone 2', type: 'text' },
                { key: 'address_1', label: 'Address', type: 'text' },
                { key: 'city', label: 'City', type: 'text' },
                { key: 'province', label: 'Province', type: 'text' },
                { key: 'postal_code', label: 'Postal Code', type: 'text' },
                { key: 'maxchannels', label: 'Max Channels', type: 'number' },
                { key: 'credit_limit', label: 'Credit Limit ($)', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-slate-400 mb-1">{f.label}</label>
                  <input type={f.type} value={(editForm as any)[f.key] ?? ''}
                    onChange={e => setEditForm(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Country</label>
                <select value={(editForm as any).country_id ?? 0}
                  onChange={e => setEditForm(p => ({ ...p, country_id: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value={0}>— Select Country —</option>
                  {[
                    { id: 146, name: 'Pakistan (+92)' }, { id: 88, name: 'India (+91)' },
                    { id: 203, name: 'United States (+1)' }, { id: 200, name: 'United Kingdom (+44)' },
                    { id: 199, name: 'UAE (+971)' }, { id: 162, name: 'Saudi Arabia (+966)' },
                    { id: 57, name: 'Egypt (+20)' }, { id: 156, name: 'Qatar (+974)' },
                    { id: 102, name: 'Kuwait (+965)' }, { id: 16, name: 'Bahrain (+973)' },
                    { id: 145, name: 'Oman (+968)' }, { id: 36, name: 'Canada (+1)' },
                    { id: 72, name: 'Germany (+49)' }, { id: 66, name: 'France (+33)' },
                    { id: 12, name: 'Australia (+61)' }, { id: 117, name: 'Malaysia (+60)' },
                    { id: 152, name: 'Philippines (+63)' }, { id: 17, name: 'Bangladesh (+880)' },
                    { id: 135, name: 'Nepal (+977)' }, { id: 175, name: 'Sri Lanka (+94)' },
                    { id: 141, name: 'Nigeria (+234)' }, { id: 171, name: 'South Africa (+27)' },
                    { id: 100, name: 'Kenya (+254)' }, { id: 194, name: 'Turkey (+90)' },
                  ].map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button onClick={() => setEditModal(false)} className="flex-1 py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Cancel</button>
              <button onClick={handleSaveEdit} disabled={saving}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add SIP Device Modal */}
      {sipModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => { setSipModal(false); setSipCreateResult(null); setSipPass('') }}>
          <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Add SIP Device</h3>
            {sipCreateResult ? (
              <div>
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-4">
                  <p className="text-green-400 text-sm font-medium mb-3">Device created successfully</p>
                  <div className="space-y-2">
                    <div className="bg-navy-900 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Username</p>
                      <p className="text-white font-mono text-lg font-bold select-all">{sipCreateResult.username}</p>
                    </div>
                    <div className="bg-navy-900 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Password</p>
                      <p className="text-white font-mono text-lg font-bold select-all">{sipCreateResult.password}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setSipModal(false); setSipCreateResult(null); setSipPass('') }}
                  className="w-full py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Done</button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">Username will be auto-generated as <span className="font-mono text-white">{a.number}-N</span></p>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Password <span className="text-slate-600">(leave empty to auto-generate)</span></label>
                  <input type="text" value={sipPass} onChange={e => setSipPass(e.target.value)} placeholder="Auto-generate if empty"
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setSipModal(false); setSipPass('') }} className="flex-1 py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Cancel</button>
                  <button onClick={handleCreateSip} disabled={saving}
                    className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50">{saving ? 'Creating...' : 'Create Device'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setConfirmAction(null)}>
          <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">
              {confirmAction === 'delete' ? 'Delete Customer' : confirmAction === 'suspend' ? 'Suspend Customer' : 'Activate Customer'}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              {confirmAction === 'delete'
                ? `Are you sure you want to delete ${a.first_name} ${a.last_name} (${a.number})? This will disable their account and all SIP devices.`
                : confirmAction === 'suspend'
                ? `Suspend ${a.first_name} ${a.last_name}? They will not be able to make calls.`
                : `Reactivate ${a.first_name} ${a.last_name}'s account?`}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Cancel</button>
              <button onClick={confirmAction === 'delete' ? handleDelete : handleSuspendToggle}
                className={`flex-1 py-2.5 rounded-lg text-white text-sm font-medium ${
                  confirmAction === 'delete' ? 'bg-red-600 hover:bg-red-500' :
                  confirmAction === 'suspend' ? 'bg-yellow-600 hover:bg-yellow-500' :
                  'bg-green-600 hover:bg-green-500'
                }`}>
                {confirmAction === 'delete' ? 'Delete' : confirmAction === 'suspend' ? 'Suspend' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeResetModal}>
          <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">Reset Password</h3>
            <p className="text-sm text-slate-400 mb-4">{a.first_name} {a.last_name} ({a.number})</p>

            {resetResult ? (
              <div>
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-4">
                  <p className="text-green-400 text-sm font-medium mb-2">Password reset successfully!</p>
                  <div className="bg-navy-900 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">New Password</p>
                    <p className="text-white font-mono text-lg font-bold select-all">{resetResult.password}</p>
                  </div>
                  {resetResult.emailSent && (
                    <p className="text-xs text-slate-400 mt-3">Email sent to {a.email} with new credentials.</p>
                  )}
                </div>
                <button onClick={closeResetModal}
                  className="w-full py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Done</button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">New Password <span className="text-slate-600">(leave empty to auto-generate)</span></label>
                  <input type="text" value={resetPassword} onChange={e => setResetPassword(e.target.value)}
                    placeholder="Auto-generate if empty"
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <p className="text-xs text-slate-500">
                  This will update the account password and all SIP device passwords.
                  {a.email && ' A notification email will be sent to the customer.'}
                </p>
                <div className="flex gap-2 pt-2">
                  <button onClick={closeResetModal} className="flex-1 py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Cancel</button>
                  <button onClick={handleResetPassword} disabled={saving}
                    className="flex-1 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-medium disabled:opacity-50">
                    {saving ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {emailModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => { setEmailModal(false); setEmailSent(false) }}>
          <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">Send Email</h3>
            <p className="text-sm text-slate-400 mb-4">To: {a.first_name} {a.last_name} ({a.email || 'No email'})</p>

            {emailSent ? (
              <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-400 font-medium">Email sent successfully!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Template picker */}
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Quick Templates</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'balance', label: 'Balance Update' },
                      { key: 'low_balance', label: 'Low Balance' },
                      { key: 'rates', label: 'Rates Update' },
                      { key: 'service', label: 'Service Update' },
                      { key: 'followup', label: 'Follow Up' },
                      { key: 'custom', label: 'Custom' },
                    ].map(t => (
                      <button key={t.key} onClick={() => applyTemplate(t.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          emailTemplate === t.key
                            ? 'bg-cyan-600 text-white'
                            : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-700'
                        }`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Subject</label>
                  <input type="text" value={emailSubject} onChange={e => { setEmailSubject(e.target.value); setEmailTemplate('custom') }}
                    placeholder="Email subject line"
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Message</label>
                  <textarea value={emailMessage} onChange={e => { setEmailMessage(e.target.value); setEmailTemplate('custom') }}
                    placeholder="Type your message here..."
                    rows={8}
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
                </div>

                <p className="text-xs text-slate-500">
                  Email will be sent from support@voxclouds.com with VoxClouds branding and a sign-in button.
                </p>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEmailModal(false)} className="flex-1 py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Cancel</button>
                  <button onClick={handleSendEmail} disabled={saving || !emailSubject.trim() || !emailMessage.trim() || !a.email}
                    className="flex-1 py-2.5 rounded-lg bg-cyan-600 text-white text-sm font-medium disabled:opacity-50">
                    {saving ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SIP Edit Codec Modal */}
      {sipEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSipEditModal(null)}>
          <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">Edit SIP Device</h3>
            <p className="text-sm text-slate-400 mb-4 font-mono">{sipEditModal.username}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Alias <span className="text-slate-600">(shown on dialpad)</span></label>
                <input type="text" value={sipEditAlias} onChange={e => setSipEditAlias(e.target.value)}
                  placeholder="e.g. John's Phone, Office Line"
                  className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Codec</label>
                <select value={sipEditCodec} onChange={e => setSipEditCodec(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="ulaw,alaw,g729">ulaw, alaw, g729</option>
                  <option value="ulaw,alaw">ulaw, alaw</option>
                  <option value="g729,ulaw,alaw">g729, ulaw, alaw</option>
                  <option value="opus,ulaw,alaw">opus, ulaw, alaw</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setSipEditModal(null)} className="flex-1 py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Cancel</button>
                <button onClick={handleSipEdit} disabled={saving}
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIP Reset Password Modal */}
      {sipResetModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSipResetModal(null)}>
          <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">Reset Device Password</h3>
            <p className="text-sm text-slate-400 mb-4 font-mono">{sipResetModal.username}</p>
            {sipResetResult ? (
              <div>
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-4">
                  <p className="text-green-400 text-sm font-medium mb-2">Password reset successfully</p>
                  <div className="bg-navy-900 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">New Password</p>
                    <p className="text-white font-mono text-lg font-bold select-all">{sipResetResult}</p>
                  </div>
                </div>
                <button onClick={() => setSipResetModal(null)}
                  className="w-full py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Done</button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">New Password <span className="text-slate-600">(leave empty to auto-generate)</span></label>
                  <input type="text" value={sipResetPass} onChange={e => setSipResetPass(e.target.value)}
                    placeholder="Auto-generate if empty"
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <p className="text-xs text-slate-500">This only resets the password for this specific SIP device, not the account login password.</p>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setSipResetModal(null)} className="flex-1 py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium">Cancel</button>
                  <button onClick={handleSipResetPassword} disabled={saving}
                    className="flex-1 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-medium disabled:opacity-50">
                    {saving ? 'Resetting...' : 'Reset Password'}
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
