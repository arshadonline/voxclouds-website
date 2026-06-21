import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Cheap International Calls to 150+ Countries — VoxClouds',
  description:
    'Make cheap international calls to Africa, Middle East, Pakistan, India and beyond from your browser. Lowest VoIP rates — call Pakistan from USA, call Nigeria cheap, call India cheap. No app download needed.',
  keywords:
    'cheap international calls, international calling rates, call Pakistan from USA, call Nigeria cheap, call India cheap, VoIP international calls, cheap calls to Africa, cheap international calling app, cheap calls to Middle East, international calling from browser, cheap VoIP calls, cheap calls to Pakistan, cheap calls to UAE, cheap calls to Saudi Arabia, cheap calls to Kenya, cheap calls to South Africa, cheap calls to Egypt',
  alternates: { canonical: 'https://voxclouds.com/international-calling' },
  robots: 'index, follow',
  authors: [{ name: 'VoxClouds' }],
  openGraph: {
    title: 'Cheap International Calls to 150+ Countries — VoxClouds',
    description:
      'Crystal clear VoIP calls at the lowest rates. Call Africa, Middle East, Pakistan, India and beyond from your browser. No app download.',
    url: 'https://voxclouds.com/international-calling',
    siteName: 'VoxClouds',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://voxclouds.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cheap International Calls to 150+ Countries — VoxClouds',
    description: 'Lowest VoIP rates to Pakistan, India, Nigeria, UAE and 150+ countries. Call from your browser.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'VoxClouds International Calling',
  serviceType: 'VoIP International Calling',
  description:
    'Cheap international VoIP calls to 150+ countries including Pakistan, India, Nigeria, UAE, Saudi Arabia, Kenya, South Africa and Egypt. Browser-based, no app download required.',
  url: 'https://voxclouds.com/international-calling',
  provider: {
    '@type': 'Organization',
    name: 'VoxClouds',
    url: 'https://voxclouds.com',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Worldwide',
  },
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0.003',
    highPrice: '1.35',
    priceCurrency: 'USD',
    offerCount: '150',
  },
}

const rates = [
  { country: 'USA & Canada', flag: '🇺🇸', rate: 'from $0.003', unit: '/min' },
  { country: 'Germany', flag: '🇩🇪', rate: 'from $0.006', unit: '/min' },
  { country: 'Australia', flag: '🇦🇺', rate: 'from $0.007', unit: '/min' },
  { country: 'India', flag: '🇮🇳', rate: 'from $0.025', unit: '/min' },
  { country: 'Pakistan', flag: '🇵🇰', rate: 'from $0.051', unit: '/min' },
  { country: 'South Africa', flag: '🇿🇦', rate: 'from $0.076', unit: '/min' },
  { country: 'Egypt', flag: '🇪🇬', rate: 'from $0.144', unit: '/min' },
  { country: 'UAE', flag: '🇦🇪', rate: 'from $0.175', unit: '/min' },
  { country: 'Kenya', flag: '🇰🇪', rate: 'from $0.101', unit: '/min' },
  { country: 'Nigeria', flag: '🇳🇬', rate: 'from $0.146', unit: '/min' },
  { country: 'UK', flag: '🇬🇧', rate: 'from $0.765', unit: '/min' },
  { country: 'Saudi Arabia', flag: '🇸🇦', rate: 'from $1.134', unit: '/min' },
]

const features = [
  {
    title: 'HD Voice Quality',
    desc: 'Wideband audio codecs deliver crystal-clear calls that sound better than a traditional landline.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    title: 'No Hidden Fees',
    desc: 'Transparent per-minute billing. No monthly minimums, no surprises on your invoice. Pay only for what you use.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Pay-As-You-Go',
    desc: 'Top up your balance anytime. Use what you need, when you need it. Unused credit never expires.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    title: 'Browser-Based',
    desc: 'Dial from your browser — no app download, no SIP phone, no hardware. Works on desktop and mobile.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    title: 'Real-Time Call Logs',
    desc: 'Detailed CDR reports with duration, cost, and destination for every call. Export any time.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: '24/7 Support',
    desc: 'Round-the-clock technical support for all customers. Email, chat, and priority support available.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
]

const popularRoutes = [
  { from: 'USA', to: 'Pakistan', flag: '🇺🇸→🇵🇰', desc: 'The most popular diaspora calling route. Call family in Karachi, Lahore, or Islamabad for just $0.051/min.' },
  { from: 'UK', to: 'Nigeria', flag: '🇬🇧→🇳🇬', desc: 'Connect with Lagos, Abuja, and Port Harcourt at $0.146/min. HD voice across this high-traffic corridor.' },
  { from: 'USA', to: 'India', flag: '🇺🇸→🇮🇳', desc: 'Call Mumbai, Delhi, Bangalore, and 700+ Indian cities at $0.025/min with crystal-clear quality.' },
  { from: 'UAE', to: 'South Asia', flag: '🇦🇪→🌏', desc: 'Expats in Dubai and Abu Dhabi calling Pakistan, India, and Bangladesh at competitive VoIP rates.' },
  { from: 'UK', to: 'Kenya', flag: '🇬🇧→🇰🇪', desc: 'Reach Nairobi, Mombasa, and beyond at $0.101/min. Reliable routes with 99.9% uptime for business and personal calls.' },
  { from: 'USA', to: 'Egypt', flag: '🇺🇸→🇪🇬', desc: 'Call Cairo and Alexandria at $0.144/min. Ideal for Egyptian diaspora and businesses with Middle East operations.' },
]

const faqs = [
  { q: 'How do I make international calls with VoxClouds?', a: 'Sign up for a free account, add calling credit via card or bank transfer, and dial any international number from the browser-based softphone. No app download or hardware needed.' },
  { q: 'What countries can I call?', a: 'VoxClouds supports calls to 150+ countries worldwide including USA, UK, Canada, Pakistan, India, Nigeria, UAE, Saudi Arabia, Egypt, Kenya, South Africa, Germany, Australia, and many more.' },
  { q: 'Are rates the same for mobile and landline?', a: 'Rates may vary between landline and mobile destinations. Mobile rates are typically higher. Log in to your dashboard for the complete rate sheet with exact per-route pricing.' },
  { q: 'Does my calling credit expire?', a: 'No. Your prepaid calling credit never expires. Top up any amount, any time, and use it whenever you need to make calls.' },
  { q: 'Can I call from my phone browser?', a: 'Yes. The VoxClouds softphone works in any modern browser — desktop, Android, or iPhone. No app installation needed. Just open your browser, log in, and dial.' },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function InternationalCallingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <SiteHeader />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-green-600/10 border border-green-500/20 rounded-full px-4 py-1.5 text-sm text-green-400 mb-8">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Rates from $0.003/min — 150+ countries covered
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Cheap International Calls to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              150+ Countries
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Crystal clear VoIP calls at the lowest rates. Call Africa, Middle East, Pakistan, India and beyond
            directly from your browser — no app download, no contracts, no hidden fees.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              Start Calling Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#rates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              View All Rates
            </a>
          </div>

          <p className="mt-4 text-sm text-slate-500">No credit card required &bull; Free account &bull; Top up when you need it</p>
        </div>
      </section>

      {/* ===== Rates Table ===== */}
      <section id="rates" className="py-20 bg-navy-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Sample International Calling Rates</h2>
            <p className="mt-4 text-slate-400 text-lg">
              Some of our most popular destinations. Save up to 90% vs traditional carriers.
            </p>
          </div>

          <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-navy-800 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Destination</span>
              <span className="text-center">Rate</span>
              <span className="text-right">vs. Traditional</span>
            </div>
            {rates.map((r, i) => (
              <div
                key={r.country}
                className={`grid grid-cols-3 items-center px-6 py-4 ${
                  i < rates.length - 1 ? 'border-b border-slate-800' : ''
                } hover:bg-navy-800/50 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.flag}</span>
                  <span className="font-medium text-slate-200">{r.country}</span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-green-400">{r.rate}</span>
                  <span className="text-slate-500 text-sm">{r.unit}</span>
                </div>
                <div className="text-right text-sm text-slate-400">
                  <span className="text-green-400 font-semibold">Save vs carriers</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            Rates shown are for standard landline/mobile termination. Prices subject to change.{' '}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 underline">
              Sign up
            </Link>{' '}
            to see full rate deck for all 150+ countries.
          </p>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Why Choose VoxClouds for International Calls</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need for reliable, affordable international calling — no hardware, no complexity.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div
                key={f.title}
                className="bg-navy-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-600/10 flex items-center justify-center mb-4 group-hover:bg-cyan-600/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="py-20 bg-navy-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">How to Make Cheap International Calls</h2>
            <p className="mt-4 text-slate-400 text-lg">Four steps and you are calling the world.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Sign Up',
                desc: 'Create a free VoxClouds account in under 30 seconds. No credit card required to get started.',
              },
              {
                step: '02',
                title: 'Add Credit',
                desc: 'Top up your balance with any amount. Pay via card or bank transfer. Credit never expires.',
              },
              {
                step: '03',
                title: 'Dial from Browser',
                desc: 'Open the VoxClouds dialpad in your browser, enter the international number with country code, and call.',
              },
              {
                step: '04',
                title: 'Save up to 90%',
                desc: 'Pay per minute at wholesale rates — up to 90% cheaper than traditional carriers and mobile networks.',
              },
            ].map(item => (
              <div key={item.step} className="bg-navy-800 border border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold text-base mb-4">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Popular Routes ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Popular International Calling Routes</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              Millions of minutes carried monthly on these high-demand diaspora and business corridors.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map(route => (
              <div
                key={`${route.from}-${route.to}`}
                className="bg-navy-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-colors"
              >
                <div className="text-3xl mb-3">{route.flag}</div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {route.from} → {route.to}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{route.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 bg-navy-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="mt-4 text-slate-400 text-lg">Everything you need to know about international calling with VoxClouds.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-navy-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors">
                <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-y border-slate-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Start Making Cheap International Calls Today
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Join thousands of users across the diaspora and business world who trust VoxClouds for
            affordable, crystal-clear international calls.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              Create Free Account
            </Link>
            <a
              href="https://wa.me/14158437100" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Serving callers in USA, UK, UAE, Saudi Arabia, and 100+ countries calling Africa, South Asia &amp; Middle East.
          </p>
        </div>
      </section>

      {/* Rate Disclaimer */}
      <section className="py-8 border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-xs text-slate-500 leading-relaxed">
          <p><strong className="text-slate-400">* Rates Disclaimer:</strong> All rates shown are per-minute charges for landline destinations unless otherwise noted. Mobile rates may be higher. Rates are subject to change without prior notice. A connection fee may apply on certain routes. Visit your account dashboard for the most current rates and a complete destination list.</p>
          <p><strong className="text-slate-400">* Fair Use Policy:</strong> Calling services are subject to a fair use policy. Excessive usage patterns inconsistent with normal communication may result in service suspension. VoxClouds reserves the right to update rates, terms, and policies at any time without notice.</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
