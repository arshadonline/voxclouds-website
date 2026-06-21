import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">VoxClouds</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <Link href="/cloud-pbx" className="hover:text-white transition-colors">Cloud PBX</Link>
          <Link href="/virtual-numbers" className="hover:text-white transition-colors">Virtual Numbers</Link>
          <Link href="/international-calling" className="hover:text-white transition-colors">Calling</Link>
          <Link href="/wholesale-voip" className="hover:text-white transition-colors">Wholesale</Link>
          <Link href="/rates" className="hover:text-white transition-colors">Rates</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block">Login</Link>
          <Link href="/signup" className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors">Sign Up Free</Link>
        </div>
      </div>
    </header>
  )
}
