'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, X, Zap } from 'lucide-react'

const solutions = [
  { name: 'Wholesale A-Z Routes', href: '/wholesale', desc: 'Global voice termination' },
  { name: 'Hosted IP PBX', href: '/hosted-pbx', desc: 'Cloud phone system' },
  { name: 'DID Numbers', href: '/did-numbers', desc: 'Virtual phone numbers' },
  { name: 'AI Voice Agents', href: '/ai-voice', desc: 'SIP for AI platforms' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-brand-dark/95 backdrop-blur-md border-b border-brand-border shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-cyan-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Vox<span className="text-cyan-400">Clouds</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Solutions dropdown */}
            <div className="relative" onMouseEnter={() => setSolutionsOpen(true)} onMouseLeave={() => setSolutionsOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                Solutions <ChevronDown className={`w-4 h-4 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>
              {solutionsOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-brand-border bg-brand-card shadow-card p-2">
                  {solutions.map((s) => (
                    <Link key={s.href} href={s.href}
                      className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                      <span className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{s.name}</span>
                      <span className="text-xs text-gray-500">{s.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/pricing" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all">Pricing</Link>
            <Link href="/contact" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all">Contact</Link>
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="https://billing.voxclouds.com" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Login
            </a>
            <a href="https://billing.voxclouds.com/signup/" target="_blank" rel="noopener noreferrer"
              className="btn-primary text-sm px-5 py-2">
              Sign Up
            </a>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-brand-dark/98 backdrop-blur-md border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Solutions</p>
            {solutions.map((s) => (
              <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                <span className="text-sm font-medium">{s.name}</span>
              </Link>
            ))}
            <div className="border-t border-brand-border my-2" />
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">Pricing</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">Contact</Link>
            <div className="pt-2 space-y-2">
              <a href="https://billing.voxclouds.com/signup/" target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center flex">Sign Up</a>
              <a href="https://billing.voxclouds.com" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full justify-center flex">Login</a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
