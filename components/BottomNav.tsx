'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const tabs = [
  { href: '/dialpad', label: 'Dialpad', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )},
  { href: '/calls', label: 'Calls', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )},
  { href: '/support', label: 'Support', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )},
  { href: '/account', label: 'Account', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )},
]

export default function BottomNav() {
  const path = usePathname()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    function check() {
      fetch('/api/tickets').then(r => r.ok ? r.json() : null).then(d => {
        if (d?.tickets) {
          setUnread(d.tickets.reduce((sum: number, t: { unread_customer: number }) => sum + (t.unread_customer || 0), 0))
        }
      }).catch(() => {})
    }
    check()
    const interval = setInterval(check, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-navy-900 border-t border-slate-800 flex">
      {tabs.map(tab => {
        const active = path.startsWith(tab.href)
        return (
          <Link key={tab.href} href={tab.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors relative
              ${active ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
            <span className="relative">
              {tab.icon}
              {tab.href === '/support' && unread > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </span>
            <span className="font-medium">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
