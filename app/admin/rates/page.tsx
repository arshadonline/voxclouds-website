'use client'
import { useState, useEffect, useRef } from 'react'

interface Rate {
  comment: string
  sell_rate: number
  cost_rate: number
  prefix: string
}

interface DestinationRates {
  country: string
  rates: Rate[]
}

export default function AdminRatesPage() {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<Rate[]>([])
  const [loading, setLoading] = useState(false)
  const [destinations, setDestinations] = useState<DestinationRates[]>([])
  const [copied, setCopied] = useState<string | false>(false)
  const [msgMode, setMsgMode] = useState<'whatsapp' | 'email'>('whatsapp')
  const [matchedNumber, setMatchedNumber] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!search.trim()) { setSearchResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/rates?search=${encodeURIComponent(search)}`)
        const data = await res.json()
        setSearchResults(data.rates || [])
        setMatchedNumber(data.matched || null)
      } catch {
        setSearchResults([])
      }
      setLoading(false)
    }, 300)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search])

  function getCountryName(rates: Rate[], fallback: string) {
    if (rates.length === 0) return fallback
    const first = rates[0].comment
    const parts = first.split(/[,]/)[0]
    return parts
      .replace(/ Cellular.*/, '')
      .replace(/ Mobile.*/, '')
      .replace(/ National.*/, '')
      .replace(/ Proper.*/, '')
      .trim()
  }

  function addDestination() {
    if (searchResults.length === 0) return
    const country = getCountryName(searchResults, search)
    // Don't add duplicates
    if (destinations.some(d => d.country.toLowerCase() === country.toLowerCase())) return
    setDestinations([...destinations, { country, rates: searchResults }])
    setSearch('')
    setSearchResults([])
    searchRef.current?.focus()
  }

  function removeDestination(country: string) {
    setDestinations(destinations.filter(d => d.country !== country))
  }

  // Split rates into landline / mobile for a set of rates
  function splitRates(rates: Rate[]) {
    const landline = rates.filter(r =>
      !r.comment.toLowerCase().includes('cellular') &&
      !r.comment.toLowerCase().includes('mobile')
    )
    const mobile = rates.filter(r =>
      r.comment.toLowerCase().includes('cellular') ||
      r.comment.toLowerCase().includes('mobile')
    )
    return { landline, mobile }
  }

  function marginPct(sell: number, cost: number) {
    if (!sell) return 0
    return ((sell - cost) / sell) * 100
  }

  function marginColor(pct: number) {
    if (pct >= 20) return 'text-green-400'
    if (pct >= 10) return 'text-yellow-400'
    return 'text-red-400'
  }

  function formatRate(rate: number) {
    return `$${rate.toFixed(4)}`
  }

  function generateWhatsApp() {
    if (destinations.length === 0) return ''

    let msg = 'VoxClouds Calling Rates\n'

    for (const dest of destinations) {
      const { landline, mobile } = splitRates(dest.rates)
      msg += `\n${dest.country}\n`

      if (landline.length > 0) {
        const rate = Math.min(...landline.map(r => r.sell_rate))
        msg += `  Landline: $${rate.toFixed(4)}/min\n`
      }
      if (mobile.length > 0) {
        const rate = Math.min(...mobile.map(r => r.sell_rate))
        msg += `  Mobile: from $${rate.toFixed(4)}/min\n`
      }
    }

    msg += '\nNo connection fees, no contracts.\nPer-second billing after first minute.\nAdd balance & call from browser: app.voxclouds.com'

    return msg
  }

  function generateEmail() {
    if (destinations.length === 0) return ''

    let msg = 'Hi,\n\nThank you for your interest in VoxClouds. Here are our calling rates:\n'

    for (const dest of destinations) {
      const { landline, mobile } = splitRates(dest.rates)
      msg += `\n${dest.country}:\n`

      if (landline.length > 0) {
        const rate = Math.min(...landline.map(r => r.sell_rate))
        msg += `  - Landline: $${rate.toFixed(4)}/min\n`
      }
      if (mobile.length > 0) {
        const minRate = Math.min(...mobile.map(r => r.sell_rate))
        const maxRate = Math.max(...mobile.map(r => r.sell_rate))
        if (minRate === maxRate) {
          msg += `  - Mobile: $${minRate.toFixed(4)}/min\n`
        } else {
          msg += `  - Mobile: $${minRate.toFixed(4)} - $${maxRate.toFixed(4)}/min\n`
        }
      }
    }

    msg += '\nKey features:\n'
    msg += '- No connection fees or contracts\n'
    msg += '- Per-second billing after the first minute\n'
    msg += '- Call from your browser at app.voxclouds.com\n'
    msg += '- HD voice quality with multiple international carriers\n'
    msg += '\nTo get started, create your free account and add balance:\nhttps://app.voxclouds.com/signup\n'
    msg += '\nBest regards,\nVoxClouds Team'

    return msg
  }

  function getMessage() {
    return msgMode === 'whatsapp' ? generateWhatsApp() : generateEmail()
  }

  async function handleCopy(type: string) {
    const text = getMessage()
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(false), 2000)
  }

  // Current search results split
  const { landline: searchLandline, mobile: searchMobile } = splitRates(searchResults)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Rate Lookup</h1>
          <p className="text-sm text-slate-400 mt-1">Search by country name or phone number, add multiple destinations</p>
        </div>
      </div>

      {/* Selected Destinations Tags */}
      {destinations.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Selected:</span>
          {destinations.map(d => (
            <span key={d.country}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/30 border border-blue-800/50 text-blue-300 text-sm">
              {d.country}
              <span className="text-xs text-blue-500">({d.rates.length})</span>
              <button onClick={() => removeDestination(d.country)}
                className="ml-1 text-blue-500 hover:text-red-400 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <button onClick={() => setDestinations([])}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors ml-2">
            Clear all
          </button>
        </div>
      )}

      {/* Search + Add */}
      <div className="mb-5 flex gap-2">
        <input
          ref={searchRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && searchResults.length > 0) addDestination() }}
          placeholder="Search country or phone number... e.g. Italy, +39559993..."
          className="flex-1 px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
          autoFocus
        />
        {searchResults.length > 0 && (
          <button onClick={addDestination}
            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shrink-0">
            + Add {getCountryName(searchResults, search)}
          </button>
        )}
      </div>

      {/* Number Match Banner */}
      {matchedNumber && searchResults.length > 0 && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-cyan-900/20 border border-cyan-800/30 flex items-center gap-3">
          <svg className="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <div>
            <p className="text-sm text-cyan-300">
              <span className="font-mono font-medium">+{matchedNumber}</span> matches <span className="font-medium text-white">{getCountryName(searchResults, '')}</span>
            </p>
          </div>
        </div>
      )}

      {/* Search Results Table */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Searching...</div>
      ) : search.trim() && searchResults.length === 0 ? (
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 mb-5">
          No rates found for &ldquo;{search}&rdquo;
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-4 mb-5">
          {searchLandline.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Landline</h2>
                <span className="text-xs text-slate-600">({searchLandline.length})</span>
              </div>
              <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Prefix</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Sell Rate</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Margin</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Margin %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {searchLandline.map((r, i) => {
                      const margin = r.sell_rate - r.cost_rate
                      const pct = marginPct(r.sell_rate, r.cost_rate)
                      return (
                        <tr key={i} className="hover:bg-navy-800/50 transition-colors">
                          <td className="px-4 py-3 text-sm text-cyan-400 font-mono">{r.prefix}</td>
                          <td className="px-4 py-3 text-sm text-slate-300">{r.comment}</td>
                          <td className="px-4 py-3 text-sm text-white text-right font-mono">{formatRate(r.sell_rate)}</td>
                          <td className="px-4 py-3 text-sm text-slate-400 text-right font-mono">{formatRate(r.cost_rate)}</td>
                          <td className="px-4 py-3 text-sm text-right font-mono">
                            <span className={marginColor(pct)}>{formatRate(margin)}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-mono">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              pct >= 20 ? 'bg-green-900/50 text-green-400' :
                              pct >= 10 ? 'bg-yellow-900/50 text-yellow-400' :
                              'bg-red-900/50 text-red-400'
                            }`}>
                              {pct.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {searchMobile.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mobile / Cellular</h2>
                <span className="text-xs text-slate-600">({searchMobile.length})</span>
              </div>
              <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Prefix</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Sell Rate</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Margin</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Margin %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {searchMobile.map((r, i) => {
                      const margin = r.sell_rate - r.cost_rate
                      const pct = marginPct(r.sell_rate, r.cost_rate)
                      return (
                        <tr key={i} className="hover:bg-navy-800/50 transition-colors">
                          <td className="px-4 py-3 text-sm text-cyan-400 font-mono">{r.prefix}</td>
                          <td className="px-4 py-3 text-sm text-slate-300">{r.comment}</td>
                          <td className="px-4 py-3 text-sm text-white text-right font-mono">{formatRate(r.sell_rate)}</td>
                          <td className="px-4 py-3 text-sm text-slate-400 text-right font-mono">{formatRate(r.cost_rate)}</td>
                          <td className="px-4 py-3 text-sm text-right font-mono">
                            <span className={marginColor(pct)}>{formatRate(margin)}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-mono">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              pct >= 20 ? 'bg-green-900/50 text-green-400' :
                              pct >= 10 ? 'bg-yellow-900/50 text-yellow-400' :
                              'bg-red-900/50 text-red-400'
                            }`}>
                              {pct.toFixed(1)}%
                            </span>
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
      ) : !search.trim() && destinations.length === 0 ? (
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          Type a country name or phone number to look up rates
        </div>
      ) : null}

      {/* Compose Message */}
      {destinations.length > 0 && (
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Message Preview</h3>
              <div className="flex bg-navy-800 rounded-lg p-0.5">
                <button onClick={() => setMsgMode('whatsapp')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    msgMode === 'whatsapp' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}>
                  WhatsApp
                </button>
                <button onClick={() => setMsgMode('email')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    msgMode === 'email' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}>
                  Email
                </button>
              </div>
            </div>
            <button onClick={() => handleCopy(msgMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                copied === msgMode ? 'bg-green-600 text-white' : 'bg-navy-800 text-slate-400 hover:text-white border border-slate-700'
              }`}>
              {copied === msgMode ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap bg-navy-800 rounded-xl p-4 font-sans leading-relaxed">
            {getMessage()}
          </pre>

          {/* Destination summary cards */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {destinations.map(dest => {
              const { landline, mobile } = splitRates(dest.rates)
              const landlineRate = landline.length > 0 ? Math.min(...landline.map(r => r.sell_rate)) : null
              const mobileRate = mobile.length > 0 ? Math.min(...mobile.map(r => r.sell_rate)) : null
              return (
                <div key={dest.country} className="bg-navy-950 border border-slate-800 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{dest.country}</h4>
                    <button onClick={() => removeDestination(dest.country)}
                      className="text-slate-600 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-1 text-xs">
                    {landlineRate !== null && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Landline</span>
                        <span className="text-white font-mono">${landlineRate.toFixed(4)}/min</span>
                      </div>
                    )}
                    {mobileRate !== null && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mobile</span>
                        <span className="text-white font-mono">from ${mobileRate.toFixed(4)}/min</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>{dest.rates.length} route{dest.rates.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
