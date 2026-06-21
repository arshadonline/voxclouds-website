'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface DIDRate {
  country_name: string
  country_code: string
  number_type: string
  prefix: string
  monthly_price: number
  setup_price: number
  per_min_price: number
  channels: number
  features: string
}

interface AvailableNumber {
  phone_number: string
  number_type: string
  country: string
  country_code: string
  location: string
  state: string
  features: string[]
  monthly_price: number
  setup_price: number
  reservable: boolean
  quickship: boolean
}

const typeLabel: Record<string, string> = {
  local: 'Local', mobile: 'Mobile', toll_free: 'Toll-Free', national: 'National',
}
const typeColor: Record<string, string> = {
  local: 'bg-blue-900/50 text-blue-300', mobile: 'bg-green-900/50 text-green-300',
  toll_free: 'bg-purple-900/50 text-purple-300', national: 'bg-orange-900/50 text-orange-300',
}

const countries = [
  { code: 'US', name: 'United States', iso: '1' },
  { code: 'GB', name: 'United Kingdom', iso: '44' },
  { code: 'CA', name: 'Canada', iso: '1' },
  { code: 'DE', name: 'Germany', iso: '49' },
  { code: 'FR', name: 'France', iso: '33' },
  { code: 'IT', name: 'Italy', iso: '39' },
  { code: 'AU', name: 'Australia', iso: '61' },
  { code: 'PK', name: 'Pakistan', iso: '92' },
  { code: 'NL', name: 'Netherlands', iso: '31' },
  { code: 'ES', name: 'Spain', iso: '34' },
  { code: 'IE', name: 'Ireland', iso: '353' },
  { code: 'BE', name: 'Belgium', iso: '32' },
  { code: 'CH', name: 'Switzerland', iso: '41' },
  { code: 'SE', name: 'Sweden', iso: '46' },
  { code: 'PL', name: 'Poland', iso: '48' },
  { code: 'AT', name: 'Austria', iso: '43' },
  { code: 'PT', name: 'Portugal', iso: '351' },
  { code: 'DK', name: 'Denmark', iso: '45' },
  { code: 'NO', name: 'Norway', iso: '47' },
  { code: 'SG', name: 'Singapore', iso: '65' },
  { code: 'HK', name: 'Hong Kong', iso: '852' },
  { code: 'JP', name: 'Japan', iso: '81' },
  { code: 'BR', name: 'Brazil', iso: '55' },
  { code: 'MX', name: 'Mexico', iso: '52' },
]

export default function DIDRateSearch() {
  const [tab, setTab] = useState<'rates' | 'inventory'>('rates')

  // Rates state
  const [rateSearch, setRateSearch] = useState('')
  const [rateType, setRateType] = useState('')
  const [rates, setRates] = useState<DIDRate[]>([])
  const [ratesLoading, setRatesLoading] = useState(true)
  const rateDebounce = useRef<NodeJS.Timeout | null>(null)

  // Inventory state
  const [invCountry, setInvCountry] = useState('US')
  const [invType, setInvType] = useState('')
  const [invAreaCode, setInvAreaCode] = useState('')
  const [numbers, setNumbers] = useState<AvailableNumber[]>([])
  const [invLoading, setInvLoading] = useState(false)
  const [invTotal, setInvTotal] = useState(0)
  const [invCountryName, setInvCountryName] = useState('United States')

  // Load rates
  useEffect(() => {
    if (rateDebounce.current) clearTimeout(rateDebounce.current)
    rateDebounce.current = setTimeout(async () => {
      setRatesLoading(true)
      const params = new URLSearchParams()
      if (rateSearch.trim()) params.set('search', rateSearch)
      if (rateType) params.set('type', rateType)
      try {
        const res = await fetch(`/api/did-rates?${params}`)
        const data = await res.json()
        setRates(data.rates || [])
      } catch (e) { setRates([]) }
      setRatesLoading(false)
    }, 300)
    return () => { if (rateDebounce.current) clearTimeout(rateDebounce.current) }
  }, [rateSearch, rateType])

  // Load inventory
  async function searchInventory() {
    setInvLoading(true)
    const params = new URLSearchParams()
    params.set('country', invCountry)
    if (invType) params.set('type', invType)
    if (invAreaCode) params.set('area_code', invAreaCode)
    params.set('limit', '20')
    try {
      const res = await fetch(`/api/did-inventory?${params}`)
      const data = await res.json()
      setNumbers(data.numbers || [])
      setInvTotal(data.total || 0)
      setInvCountryName(data.country || invCountry)
    } catch (e) { setNumbers([]) }
    setInvLoading(false)
  }

  useEffect(() => { if (tab === 'inventory') searchInventory() }, [invCountry])

  function formatNumber(num: string) {
    return num.startsWith('+') ? num : `+${num}`
  }

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex bg-navy-900 rounded-xl p-1 mb-6">
        <button
          onClick={() => setTab('rates')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'rates' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Rate Card
        </button>
        <button
          onClick={() => { setTab('inventory'); if (numbers.length === 0) searchInventory() }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'inventory' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Available Numbers
        </button>
      </div>

      {/* ===== RATE CARD TAB ===== */}
      {tab === 'rates' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                value={rateSearch}
                onChange={e => setRateSearch(e.target.value)}
                placeholder="Search by country, code... e.g. United Kingdom, 44"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-navy-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <select
              value={rateType}
              onChange={e => setRateType(e.target.value)}
              className="px-4 py-3 rounded-xl bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="local">Local</option>
              <option value="mobile">Mobile</option>
              <option value="toll_free">Toll-Free</option>
            </select>
          </div>

          {ratesLoading ? (
            <div className="p-10 text-center text-slate-400">Loading rates...</div>
          ) : rates.length === 0 ? (
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
              {rateSearch ? `No rates found for "${rateSearch}"` : 'No rates available'}
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">{rates.length} rates available</p>
                <p className="text-xs text-slate-600">Prices in USD, billed monthly</p>
              </div>
              <div className="mb-4 bg-blue-900/20 border border-blue-800/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <span className="text-blue-400 text-sm">💰</span>
                <p className="text-xs text-blue-300">Need bulk DIDs? <Link href="/signup" className="underline text-blue-400 hover:text-blue-300">Contact us</Link> for negotiable rates on volume orders.</p>
              </div>
              <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Country</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Prefix</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Setup</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Inbound/min</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {rates.map((r, i) => (
                      <tr key={i} className="hover:bg-navy-800/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-white font-medium">
                          {r.country_name}
                          <span className="text-slate-500 ml-1.5 text-xs">+{r.country_code}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-cyan-400 font-mono">{r.prefix}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[r.number_type] || 'bg-slate-700 text-slate-300'}`}>
                            {typeLabel[r.number_type] || r.number_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white text-right font-mono font-medium">${Number(r.monthly_price).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-right font-mono">
                          {Number(r.setup_price) > 0 ? <span className="text-slate-300">${Number(r.setup_price).toFixed(2)}</span> : <span className="text-green-400">Free</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300 text-right font-mono">${Number(r.per_min_price).toFixed(4)}</td>
                        <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell">
                          {r.features.split(',').map((f, j) => (
                            <span key={j} className="inline-block mr-1.5 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{f.trim()}</span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {/* ===== AVAILABLE NUMBERS TAB ===== */}
      {tab === 'inventory' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <select
              value={invCountry}
              onChange={e => setInvCountry(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name} (+{c.iso})</option>
              ))}
            </select>
            <select
              value={invType}
              onChange={e => setInvType(e.target.value)}
              className="px-4 py-3 rounded-xl bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="local">Local</option>
              <option value="toll_free">Toll-Free</option>
              <option value="national">National</option>
            </select>
            <input
              value={invAreaCode}
              onChange={e => setInvAreaCode(e.target.value)}
              placeholder="Area code (optional)"
              className="w-32 px-4 py-3 rounded-xl bg-navy-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={searchInventory}
              disabled={invLoading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {invLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {invLoading ? (
            <div className="p-10 text-center text-slate-400">
              <svg className="animate-spin w-6 h-6 mx-auto mb-3 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Searching available numbers in {invCountryName}...
            </div>
          ) : numbers.length === 0 ? (
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-10 text-center">
              <div className="text-3xl mb-3">📵</div>
              <p className="text-slate-400">No numbers available for {invCountryName} with the selected filters.</p>
              <p className="text-xs text-slate-600 mt-2">Try a different country or number type.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-sm text-slate-400">
                  Showing {numbers.length} of {invTotal} available numbers in <span className="text-white font-medium">{invCountryName}</span>
                </p>
                <p className="text-xs text-slate-600">Live inventory from carrier</p>
              </div>
              <div className="mb-4 bg-blue-900/20 border border-blue-800/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <span className="text-blue-400 text-sm">💰</span>
                <p className="text-xs text-blue-300">Need numbers in bulk? <Link href="/signup" className="underline text-blue-400 hover:text-blue-300">Contact us</Link> for negotiable rates on volume orders.</p>
              </div>

              <div className="grid gap-3">
                {numbers.map((n, i) => (
                  <div key={i} className="bg-navy-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-mono text-white font-medium tracking-wide">
                            {formatNumber(n.phone_number)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[n.number_type] || 'bg-slate-700 text-slate-300'}`}>
                            {typeLabel[n.number_type] || n.number_type}
                          </span>
                          {n.quickship && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-300 font-medium">Instant</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          {n.location && <span className="text-xs text-slate-500">{n.location}{n.state ? `, ${n.state}` : ''}</span>}
                          <div className="flex gap-1">
                            {n.features.map((f, j) => (
                              <span key={j} className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{f}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-mono font-bold text-lg">${n.monthly_price.toFixed(2)}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                        {n.setup_price > 0 ? (
                          <span className="text-xs text-slate-500">+ ${n.setup_price.toFixed(2)} setup</span>
                        ) : (
                          <span className="text-xs text-green-400">Free setup</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* CTA */}
      <div className="mt-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/20 border border-cyan-800/30 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Need a Virtual Number?</h3>
        <p className="text-sm text-slate-400 mb-4">
          Sign up and contact us to get your number activated. We support local, mobile, and toll-free numbers in 30+ countries.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="https://app.voxclouds.com/signup"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
            Sign Up Free
          </Link>
          <Link href="https://app.voxclouds.com/login"
            className="px-6 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 text-sm font-medium border border-slate-700 transition-colors">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
