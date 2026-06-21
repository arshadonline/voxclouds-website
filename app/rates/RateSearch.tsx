'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Rate {
  comment: string
  sell_rate: number
  prefix: string
}

export default function RateSearch() {
  const [search, setSearch] = useState('')
  const [rates, setRates] = useState<Rate[]>([])
  const [loading, setLoading] = useState(false)
  const [matchedNumber, setMatchedNumber] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!search.trim()) { setRates([]); setMatchedNumber(null); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/rates?search=${encodeURIComponent(search)}`)
        const data = await res.json()
        setRates(data.rates || [])
        setMatchedNumber(data.matched || null)
      } catch {
        setRates([])
      }
      setLoading(false)
    }, 300)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search])

  const landline = rates.filter(r =>
    !r.comment.toLowerCase().includes('cellular') &&
    !r.comment.toLowerCase().includes('mobile')
  )
  const mobile = rates.filter(r =>
    r.comment.toLowerCase().includes('cellular') ||
    r.comment.toLowerCase().includes('mobile')
  )

  function getCountryName() {
    if (rates.length === 0) return search
    const first = rates[0].comment
    return first.split(/[,]/)[0]
      .replace(/ Cellular.*/, '').replace(/ Mobile.*/, '')
      .replace(/ National.*/, '').replace(/ Proper.*/, '')
      .trim()
  }

  function formatRate(rate: number) {
    return `$${rate.toFixed(4)}`
  }

  return (
    <div>
      {/* Search Box */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by country or phone number... e.g. Pakistan, India, +1, 44"
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-navy-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-base"
          autoFocus
        />
      </div>

      {/* Number Match Banner */}
      {matchedNumber && rates.length > 0 && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-cyan-900/20 border border-cyan-800/30 flex items-center gap-3">
          <svg className="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <p className="text-sm text-cyan-300">
            <span className="font-mono font-medium">+{matchedNumber}</span> matches{' '}
            <span className="font-medium text-white">{getCountryName()}</span>
          </p>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="p-10 text-center text-slate-400">
          <svg className="animate-spin w-6 h-6 mx-auto mb-3 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Searching rates...
        </div>
      ) : !search.trim() ? (
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-10 text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-400 mb-2">Search for a country or enter a phone number</p>
          <p className="text-xs text-slate-600">Try: Pakistan, India, Italy, UK, USA, +44, 92, 91</p>
        </div>
      ) : rates.length === 0 ? (
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
          No rates found for &ldquo;{search}&rdquo;. Try a different country name or number.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Country Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{getCountryName()}</h2>
            <span className="text-xs text-slate-500">{rates.length} rate{rates.length !== 1 ? 's' : ''} found</span>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            {landline.length > 0 && (
              <div className="bg-navy-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Landline</span>
                </div>
                <p className="text-2xl font-bold text-white font-mono">
                  {formatRate(Math.min(...landline.map(r => r.sell_rate)))}
                </p>
                <p className="text-xs text-slate-500 mt-1">per minute</p>
              </div>
            )}
            {mobile.length > 0 && (
              <div className="bg-navy-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mobile</span>
                </div>
                <p className="text-2xl font-bold text-white font-mono">
                  {formatRate(Math.min(...mobile.map(r => r.sell_rate)))}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {mobile.length > 1 ? 'from, per minute' : 'per minute'}
                </p>
              </div>
            )}
          </div>

          {/* Detailed Rates Table */}
          {landline.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Landline Rates</h3>
              </div>
              <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Prefix</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Rate / min</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {landline.map((r, i) => (
                      <tr key={i} className="hover:bg-navy-800/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-cyan-400 font-mono">{r.prefix}</td>
                        <td className="px-4 py-3 text-sm text-slate-300">{r.comment}</td>
                        <td className="px-4 py-3 text-sm text-white text-right font-mono font-medium">{formatRate(r.sell_rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {mobile.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mobile / Cellular Rates</h3>
              </div>
              <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Prefix</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Rate / min</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {mobile.map((r, i) => (
                      <tr key={i} className="hover:bg-navy-800/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-cyan-400 font-mono">{r.prefix}</td>
                        <td className="px-4 py-3 text-sm text-slate-300">{r.comment}</td>
                        <td className="px-4 py-3 text-sm text-white text-right font-mono font-medium">{formatRate(r.sell_rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border border-blue-800/30 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Ready to call {getCountryName()}?</h3>
            <p className="text-sm text-slate-400 mb-4">
              Create your free account and start calling in under a minute. No app download needed.
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
      )}
    </div>
  )
}
