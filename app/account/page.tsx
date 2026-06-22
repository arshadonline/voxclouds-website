'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

const PRESET_AMOUNTS = [5, 10, 25, 50]

interface Payment { id: number; amount: number; payment_method: string; date: string }

export default function AccountPage() {
  const router = useRouter()
  const [balance, setBalance] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [bankRequested, setBankRequested] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('topup=success')) setSuccess(true)
    fetch('/api/balance').then(r => r.json()).then(d => {
      if (d.balance !== undefined) setBalance(d.balance)
    })
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.name) setName(d.name)
    }).catch(() => {})
    fetch('/api/account/payments').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.payments) setPayments(d.payments)
    }).catch(() => {})
  }, [])

  async function handleOnlinePay() {
    const val = parseFloat(amount)
    if (!val || val < 5) return
    setLoading(true)
    try {
      const res = await fetch('/api/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: val }),
      })
      const data = await res.json()
      setLoading(false)
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Payment error: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      setLoading(false)
      alert('Network error: ' + String(err))
    }
  }

  async function handleRequestBankDetails() {
    setBankRequested(true)
    await fetch('/api/topup/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(amount) || 0,
        payment_method: 'bank_transfer',
        payment_reference: '',
        notes: 'Customer requested bank details for wire transfer',
      }),
    })
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-navy-950 max-w-sm mx-auto pb-24">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-xl font-bold text-white">Account</h1>
      </div>

      {/* Profile card */}
      <div className="mx-5 bg-navy-800 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
            {name ? name[0].toUpperCase() : 'V'}
          </div>
          <div>
            <p className="text-white font-semibold">{name || 'Account'}</p>
            <p className="text-xs text-slate-400 mt-0.5">VoxClouds Customer</p>
          </div>
        </div>
      </div>

      {/* Balance card */}
      <div className="mx-5 bg-gradient-to-br from-blue-900/60 to-navy-800 rounded-2xl p-5 mb-4 border border-blue-800/30">
        <p className="text-xs text-blue-300 font-medium uppercase tracking-wider">Current Balance</p>
        <p className="text-4xl font-bold text-white mt-2">
          {balance !== null ? `$${balance.toFixed(2)}` : '---'}
        </p>
        <p className="text-xs text-slate-400 mt-1">USD - Prepaid account</p>
      </div>

      {/* Success message */}
      {success && (
        <div className="mx-5 mb-4 px-4 py-3 rounded-xl bg-green-900/30 border border-green-700/50 text-green-400 text-sm">
          Payment successful! Your balance has been updated.
        </div>
      )}

      {/* Top-up section */}
      <div className="mx-5 bg-navy-800 rounded-2xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-white mb-3">Top Up Balance</h2>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {PRESET_AMOUNTS.map(a => (
            <button key={a} onClick={() => setAmount(String(a))}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                amount === String(a) ? 'bg-blue-600 text-white' : 'bg-navy-900 text-slate-300 hover:bg-navy-700'
              }`}>
              ${a}
            </button>
          ))}
        </div>
        <input
          type="number" step="0.01" min="5" placeholder="Or enter custom amount ($5 min)"
          value={PRESET_AMOUNTS.includes(Number(amount)) ? '' : amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 mb-4"
        />

        {/* Visa/Mastercard Pay Button */}
        <button onClick={handleOnlinePay}
          disabled={loading || !amount || parseFloat(amount) < 5}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold transition-colors mb-2">
          {loading ? 'Redirecting to secure checkout...' : `Pay $${parseFloat(amount || '0').toFixed(2)} with Card`}
        </button>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
            <svg viewBox="0 0 48 32" className="h-5 w-auto"><rect width="48" height="32" rx="4" fill="#1A1F71"/><path d="M19.5 21h-3.2l2-12.4h3.2L19.5 21zm13.3-12.1a7.9 7.9 0 00-2.9-.5c-3.2 0-5.4 1.7-5.4 4.1 0 1.8 1.6 2.8 2.8 3.4 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.3 0-1.9-.2-3-.7l-.4-.2-.4 2.7a9.5 9.5 0 003.4.6c3.4 0 5.6-1.7 5.6-4.2 0-1.4-.8-2.5-2.7-3.4-1.1-.6-1.8-1-1.8-1.5 0-.5.6-1 1.8-1 1 0 1.8.2 2.4.5l.3.1.4-2.6zm8.3-.3h-2.5c-.8 0-1.3.2-1.7 1l-4.7 11.4h3.4l.7-1.9h4.1l.4 1.9H44l-2.9-12.4zm-3.9 8c.3-.7 1.3-3.5 1.3-3.5l.3-.9.2.8s.6 3 .8 3.6h-2.6zM15.9 8.6l-3 8.5-.3-1.6c-.6-1.9-2.3-4-4.2-5l2.8 10.5h3.4l5.1-12.4h-3.4" fill="#fff"/><path d="M10.4 8.6H5.1l-.1.3c4 1 6.7 3.5 7.8 6.5l-1.1-5.7c-.2-.8-.8-1-1.3-1.1" fill="#F9A533"/></svg>
            <svg viewBox="0 0 48 32" className="h-5 w-auto"><rect width="48" height="32" rx="4" fill="#252525"/><circle cx="19" cy="16" r="10" fill="#EB001B"/><circle cx="29" cy="16" r="10" fill="#F79E1B"/><path d="M24 8.8a10 10 0 013.8 7.2 10 10 0 01-3.8 7.2 10 10 0 01-3.8-7.2A10 10 0 0124 8.8z" fill="#FF5F00"/></svg>
          </div>
          <span className="text-[10px] text-slate-500">Secure payment via SSL</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-xs text-slate-500">other payment options</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {bankRequested ? (
          <div className="text-sm text-green-400 bg-green-900/20 rounded-xl px-4 py-3 border border-green-800/30">
            Bank details will be sent to your email shortly.
          </div>
        ) : (
          <button onClick={handleRequestBankDetails}
            className="w-full py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-navy-700 text-sm font-semibold transition-colors mb-2">
            Bank Wire Transfer
          </button>
        )}
        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          For local payment options (JazzCash, EasyPaisa, local bank), <a href="mailto:support@voxclouds.com" className="text-blue-400 hover:underline">contact us</a> or WhatsApp <a href="https://wa.me/14158437100" className="text-blue-400 hover:underline">+1 415 843-7100</a>
        </p>
      </div>

      {/* Payment History */}
      <div className="mx-5 bg-navy-800 rounded-2xl overflow-hidden mb-4">
        <button onClick={() => setShowHistory(!showHistory)}
          className="w-full flex justify-between items-center px-5 py-4">
          <span className="text-sm font-semibold text-white">Payment History</span>
          <div className="flex items-center gap-2">
            {payments.length > 0 && <span className="text-xs text-slate-400">{payments.length} transactions</span>}
            <svg className={`w-4 h-4 text-slate-400 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        {showHistory && (
          <div className="border-t border-slate-700/50">
            {payments.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-slate-500">No payment history yet</p>
            ) : (
              payments.map((p, i) => (
                <div key={p.id} className={`flex justify-between items-center px-5 py-3 ${i > 0 ? 'border-t border-slate-800' : ''}`}>
                  <div>
                    <p className="text-sm text-white">+${Number(p.amount).toFixed(2)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.payment_method === 'admin_credit' ? 'Admin Credit' : p.payment_method === 'lemonsqueezy' ? 'Online Payment' : p.payment_method || 'Payment'}</p>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(p.date).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Support */}
      <div className="mx-5 bg-navy-800 rounded-2xl overflow-hidden mb-4">
        {[
          { label: 'Email Support', value: 'support@voxclouds.com' },
          { label: 'Phone', value: '+1 415 843 7100' },
          { label: 'Portal', value: 'billing.voxclouds.com' },
        ].map((row, i) => (
          <div key={i} className={`flex justify-between items-center px-5 py-3.5 ${i > 0 ? 'border-t border-slate-800' : ''}`}>
            <span className="text-xs text-slate-400">{row.label}</span>
            <span className="text-xs text-slate-200">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-5">
        <button onClick={logout}
          className="w-full py-3 rounded-xl border border-red-800/50 text-red-400 hover:bg-red-900/20 text-sm font-semibold transition-colors">
          Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
