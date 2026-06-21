'use client'
import { useState, useEffect } from 'react'

interface DIDRate {
  id: number
  country_name: string
  country_code: string
  number_type: string
  prefix: string
  city: string
  monthly_cost: number
  monthly_price: number
  setup_cost: number
  setup_price: number
  per_min_cost: number
  per_min_price: number
  channels: number
  features: string
  provider: string
}

const emptyForm: Omit<DIDRate, 'id'> = {
  country_name: '', country_code: '', number_type: 'local', prefix: '', city: '',
  monthly_cost: 0, monthly_price: 0, setup_cost: 0, setup_price: 0,
  per_min_cost: 0, per_min_price: 0, channels: 2, features: 'Voice', provider: 'Telnyx',
}

export default function AdminDIDRatesPage() {
  const [rates, setRates] = useState<DIDRate[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function loadRates() {
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search)
    if (typeFilter) params.set('type', typeFilter)
    const res = await fetch(`/api/admin/did-rates?${params}`)
    const data = await res.json()
    setRates(data.rates || [])
    setLoading(false)
  }

  useEffect(() => {
    const t = setTimeout(loadRates, 300)
    return () => clearTimeout(t)
  }, [search, typeFilter])

  function startEdit(r: DIDRate) {
    setEditId(r.id)
    setForm({
      country_name: r.country_name, country_code: r.country_code, number_type: r.number_type,
      prefix: r.prefix, city: r.city,
      monthly_cost: Number(r.monthly_cost), monthly_price: Number(r.monthly_price),
      setup_cost: Number(r.setup_cost), setup_price: Number(r.setup_price),
      per_min_cost: Number(r.per_min_cost), per_min_price: Number(r.per_min_price),
      channels: Number(r.channels), features: r.features, provider: r.provider,
    })
    setShowForm(true)
  }

  function startAdd() {
    setEditId(null)
    setForm({ ...emptyForm })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    if (editId) {
      await fetch('/api/admin/did-rates', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...form }),
      })
    } else {
      await fetch('/api/admin/did-rates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setSaving(false)
    setShowForm(false)
    setEditId(null)
    loadRates()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this DID rate?')) return
    await fetch(`/api/admin/did-rates?id=${id}`, { method: 'DELETE' })
    loadRates()
  }

  function marginPct(sell: number | string, cost: number | string) {
    const s = Number(sell), c = Number(cost)
    if (!s) return 0
    return ((s - c) / s) * 100
  }

  function marginColor(pct: number) {
    if (pct >= 30) return 'text-green-400'
    if (pct >= 15) return 'text-yellow-400'
    return 'text-red-400'
  }

  const typeLabel: Record<string, string> = { local: 'Local', mobile: 'Mobile', toll_free: 'Toll-Free', national: 'National' }
  const typeColor: Record<string, string> = { local: 'bg-blue-900/50 text-blue-300', mobile: 'bg-green-900/50 text-green-300', toll_free: 'bg-purple-900/50 text-purple-300', national: 'bg-orange-900/50 text-orange-300' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">DID Number Rates</h1>
          <p className="text-sm text-slate-400 mt-1">Manage virtual number pricing — cost, sell price, and margins</p>
        </div>
        <button onClick={startAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + Add Rate
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search country or code..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-navy-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-navy-800 border border-slate-700 text-white text-sm focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="local">Local</option>
          <option value="mobile">Mobile</option>
          <option value="toll_free">Toll-Free</option>
          <option value="national">National</option>
        </select>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-navy-800 rounded-xl p-5 mb-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">{editId ? 'Edit' : 'Add'} DID Rate</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Country Name *</label>
              <input value={form.country_name} onChange={e => setForm({ ...form, country_name: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Country Code *</label>
              <input value={form.country_code} onChange={e => setForm({ ...form, country_code: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" required placeholder="e.g. 44" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Type *</label>
              <select value={form.number_type} onChange={e => setForm({ ...form, number_type: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm">
                <option value="local">Local</option>
                <option value="mobile">Mobile</option>
                <option value="toll_free">Toll-Free</option>
                <option value="national">National</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Prefix</label>
              <input value={form.prefix} onChange={e => setForm({ ...form, prefix: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" placeholder="e.g. 447" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Monthly Cost</label>
              <input type="number" step="0.01" value={form.monthly_cost} onChange={e => setForm({ ...form, monthly_cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Monthly Price</label>
              <input type="number" step="0.01" value={form.monthly_price} onChange={e => setForm({ ...form, monthly_price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Setup Cost</label>
              <input type="number" step="0.01" value={form.setup_cost} onChange={e => setForm({ ...form, setup_cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Setup Price</label>
              <input type="number" step="0.01" value={form.setup_price} onChange={e => setForm({ ...form, setup_price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Inbound/min Cost</label>
              <input type="number" step="0.0001" value={form.per_min_cost} onChange={e => setForm({ ...form, per_min_cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Inbound/min Price</label>
              <input type="number" step="0.0001" value={form.per_min_price} onChange={e => setForm({ ...form, per_min_price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Channels</label>
              <input type="number" value={form.channels} onChange={e => setForm({ ...form, channels: parseInt(e.target.value) || 2 })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Features</label>
              <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" placeholder="Voice,SMS,MMS" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Provider</label>
              <input value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">City (optional)</label>
              <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
              {saving ? 'Saving...' : editId ? 'Update' : 'Add Rate'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
              className="px-5 py-2 text-slate-400 text-sm hover:text-white">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Rate Table */}
      {loading ? (
        <div className="text-slate-400 text-center py-12">Loading...</div>
      ) : rates.length === 0 ? (
        <div className="bg-navy-800 rounded-xl p-8 text-center text-slate-400">No DID rates found</div>
      ) : (
        <div className="bg-navy-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-3 py-3 text-left text-xs text-slate-400 uppercase">Country</th>
                  <th className="px-3 py-3 text-left text-xs text-slate-400 uppercase">Prefix</th>
                  <th className="px-3 py-3 text-left text-xs text-slate-400 uppercase">Type</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 uppercase">Monthly Cost</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 uppercase">Monthly Price</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 uppercase">Margin</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 uppercase">Setup Cost</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 uppercase">Setup Price</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 uppercase">In/min Cost</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 uppercase">In/min Price</th>
                  <th className="px-3 py-3 text-left text-xs text-slate-400 uppercase">Provider</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {rates.map(r => {
                  const mPct = marginPct(r.monthly_price, r.monthly_cost)
                  return (
                    <tr key={r.id} className="hover:bg-navy-750 transition-colors">
                      <td className="px-3 py-2.5 text-white font-medium">
                        {r.country_name}
                        <span className="text-slate-500 ml-1 text-xs">+{r.country_code}</span>
                      </td>
                      <td className="px-3 py-2.5 text-cyan-400 font-mono">{r.prefix}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[r.number_type] || 'bg-slate-700 text-slate-300'}`}>
                          {typeLabel[r.number_type] || r.number_type}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-right font-mono">${Number(r.monthly_cost).toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-white text-right font-mono font-medium">${Number(r.monthly_price).toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          mPct >= 30 ? 'bg-green-900/50 text-green-400' :
                          mPct >= 15 ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>
                          {mPct.toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-right font-mono">${Number(r.setup_cost).toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-white text-right font-mono">${Number(r.setup_price).toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-slate-400 text-right font-mono">${Number(r.per_min_cost).toFixed(4)}</td>
                      <td className="px-3 py-2.5 text-white text-right font-mono">${Number(r.per_min_price).toFixed(4)}</td>
                      <td className="px-3 py-2.5 text-slate-500 text-xs">{r.provider}</td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => startEdit(r)} className="text-xs text-blue-400 hover:text-blue-300">Edit</button>
                          <button onClick={() => handleDelete(r.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
