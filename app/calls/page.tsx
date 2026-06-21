'use client'
import { useEffect, useState } from 'react'
import BottomNav from '@/components/BottomNav'

interface Cdr {
  uniqueid: string; callerid: string; callednum: string
  billseconds: number; callstart: string; debit: number; disposition: string
}

function fmtDuration(s: number) {
  if (!s) return '0s'
  const m = Math.floor(s / 60), sec = s % 60
  return m ? `${m}m ${sec}s` : `${sec}s`
}
function fmtDate(d: string) {
  return new Date(d).toLocaleString(undefined, { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
}

const dispositionBadge: Record<string, string> = {
  ANSWERED: 'bg-green-900/40 text-green-400',
  'NO ANSWER': 'bg-yellow-900/40 text-yellow-400',
  BUSY: 'bg-orange-900/40 text-orange-400',
  FAILED: 'bg-red-900/40 text-red-400',
}

export default function CallsPage() {
  const [cdrs, setCdrs] = useState<Cdr[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cdrs').then(r => r.json()).then(d => { setCdrs(d.cdrs || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-navy-950 max-w-sm mx-auto pb-24">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold text-white">Call History</h1>
        <p className="text-xs text-slate-400 mt-0.5">Last 50 calls</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500">Loading…</div>
      ) : !cdrs.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p className="text-sm">No call records yet</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60">
          {cdrs.map(c => (
            <div key={c.uniqueid} className="px-5 py-4 hover:bg-navy-800/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.callednum}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{fmtDate(c.callstart)}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dispositionBadge[c.disposition] || 'bg-slate-800 text-slate-400'}`}>
                    {c.disposition}
                  </span>
                  {c.billseconds > 0 && (
                    <p className="text-xs text-slate-400 mt-1">{fmtDuration(c.billseconds)}</p>
                  )}
                </div>
              </div>
              {Number(c.debit) > 0 && (
                <p className="text-xs text-slate-500 mt-1">Cost: ${Number(c.debit).toFixed(4)}</p>
              )}
            </div>
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  )
}
