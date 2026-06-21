'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface Customer {
  id: number
  number: string
  first_name: string
  last_name: string
  email: string
  balance: number
  credit_limit: number
  status: number
  creation: string
  maxchannels: number
  type: number
  telephone_1: string
  country_name: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Add balance modal
  const [balanceModal, setBalanceModal] = useState<{ id: number; name: string } | null>(null)
  const [balanceAmount, setBalanceAmount] = useState('')
  const [balanceNotes, setBalanceNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)
    const res = await fetch(`/api/admin/customers?${params}`)
    const data = await res.json()
    setCustomers(data.customers)
    setTotalPages(data.totalPages)
    setTotal(data.total)
    setLoading(false)
  }, [page, search])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  useEffect(() => { setPage(1) }, [search])

  async function handleAddBalance() {
    if (!balanceModal || !balanceAmount) return
    setSaving(true)
    await fetch(`/api/admin/customers/${balanceModal.id}/balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(balanceAmount), notes: balanceNotes }),
    })
    setSaving(false)
    setBalanceModal(null)
    setBalanceAmount('')
    setBalanceNotes('')
    fetchCustomers()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-sm text-slate-400 mt-1">{total} total customers</p>
        </div>
        <Link href="/admin/customers/new"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
          + Add Customer
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by number, name, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-lg bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-navy-800 rounded-xl border border-slate-700/50 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-xs uppercase">
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Phone</th>
              <th className="text-left px-5 py-3">Country</th>
              <th className="text-right px-5 py-3">Balance</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Created</th>
              <th className="text-left px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-5 py-3"><div className="h-5 bg-navy-700 rounded animate-pulse" /></td></tr>
              ))
            ) : customers.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-slate-500">No customers found</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-navy-700/50">
                  <td className="px-5 py-3 text-white">{c.first_name} {c.last_name}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{c.email}</td>
                  <td className="px-5 py-3 text-slate-300 font-mono text-xs">{c.telephone_1 || '—'}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{c.country_name || '—'}</td>
                  <td className={`px-5 py-3 text-right font-medium ${
                    Number(c.balance) > 5 ? 'text-green-400' : Number(c.balance) > 1 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    ${Number(c.balance).toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      c.status === 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {c.status === 0 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{new Date(c.creation).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/customers/${c.id}`}
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium">View</Link>
                      <button onClick={() => setBalanceModal({ id: c.id, name: `${c.first_name} (${c.number})` })}
                        className="text-green-400 hover:text-green-300 text-xs font-medium">+ Balance</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 rounded bg-navy-800 text-slate-400 hover:text-white disabled:opacity-30 text-sm">Prev</button>
          <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 rounded bg-navy-800 text-slate-400 hover:text-white disabled:opacity-30 text-sm">Next</button>
        </div>
      )}

      {/* Add Balance Modal */}
      {balanceModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setBalanceModal(null)}>
          <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">Add Balance</h3>
            <p className="text-sm text-slate-400 mb-4">{balanceModal.name}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Amount ($)</label>
                <input type="number" step="0.01" min="0.01" value={balanceAmount}
                  onChange={e => setBalanceAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Notes (optional)</label>
                <textarea value={balanceNotes} onChange={e => setBalanceNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 h-20 resize-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setBalanceModal(null)}
                  className="flex-1 py-2.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-600">Cancel</button>
                <button onClick={handleAddBalance} disabled={saving || !balanceAmount}
                  className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-500 disabled:opacity-50">
                  {saving ? 'Adding...' : 'Add Balance'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
