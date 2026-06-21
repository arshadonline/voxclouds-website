import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import RateSearch from './RateSearch'

export const metadata: Metadata = {
  title: 'International Calling Rates — 150+ Countries | VoxClouds',
  description:
    'Search VoxClouds international calling rates for 150+ countries. Competitive VoIP rates to Pakistan, India, Nigeria, UK, USA, UAE and more. Pay-as-you-go billing.',
  keywords:
    'international calling rates, VoIP rates, cheap calls rates, call rate lookup, calling rates to Pakistan, calling rates to India, calling rates to Nigeria, calling rates to UK, VoIP rate search, international phone rates, cheap VoIP rates, calling rates by country, per minute calling rates',
  alternates: { canonical: 'https://voxclouds.com/rates' },
  robots: 'index, follow',
  openGraph: {
    title: 'International Calling Rates — 150+ Countries | VoxClouds',
    description:
      'Search our calling rates for 150+ countries. Competitive VoIP rates with transparent pay-as-you-go billing.',
    url: 'https://voxclouds.com/rates',
    siteName: 'VoxClouds',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://voxclouds.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'International Calling Rates | VoxClouds',
    description: 'Search calling rates for 150+ countries. Competitive pay-as-you-go VoIP rates.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'VoxClouds International Calling Rates',
  url: 'https://voxclouds.com/rates',
  description: 'Search international calling rates for 150+ countries. Competitive VoIP rates with transparent billing.',
  mainEntity: {
    '@type': 'ItemList',
    name: 'International Calling Rates',
    description: 'VoIP calling rates by country and destination',
  },
  publisher: {
    '@type': 'Organization',
    name: 'VoxClouds',
    url: 'https://voxclouds.com',
  },
}

export default function RatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="min-h-screen bg-navy-950">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-800/60">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/10" />
          <div className="max-w-5xl mx-auto px-4 py-16 sm:py-20 relative">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center leading-tight">
              International Calling Rates
            </h1>
            <p className="mt-4 text-lg text-slate-400 text-center max-w-2xl mx-auto">
              Search our rates for 150+ countries. Enter a country name or phone number to find your rate instantly.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Transparent billing
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Per-second billing
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No contracts
              </div>
            </div>
          </div>
        </section>

        {/* Rate Search */}
        <section className="max-w-4xl mx-auto px-4 py-10">
          <RateSearch />
        </section>

        {/* Info Section */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Pay As You Go</h3>
              <p className="text-sm text-slate-400">
                No monthly fees or subscriptions for calling. Just add balance and call. You only pay for the minutes you use.
              </p>
            </div>
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Call From Browser</h3>
              <p className="text-sm text-slate-400">
                No app download needed. Sign up, add balance, and start calling directly from your web browser in seconds.
              </p>
            </div>
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">HD Voice Quality</h3>
              <p className="text-sm text-slate-400">
                Crystal clear calls powered by multiple Tier-1 carriers. Automatic route optimization for the best quality.
              </p>
            </div>
          </div>

          {/* FAQ for SEO */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-navy-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-white font-medium mb-2">How are calls billed?</h3>
                <p className="text-sm text-slate-400">
                  Calls are billed per minute. Rates vary by destination and call type (landline vs mobile). You pay only for the minutes you use — no monthly minimums or subscriptions required.
                </p>
              </div>
              <div className="bg-navy-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-white font-medium mb-2">Why are mobile rates higher than landline?</h3>
                <p className="text-sm text-slate-400">
                  Mobile termination rates are set by each country&apos;s mobile operators and are typically higher than landline rates. This is an industry-wide standard, not specific to VoxClouds.
                </p>
              </div>
              <div className="bg-navy-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-white font-medium mb-2">Can I search by phone number?</h3>
                <p className="text-sm text-slate-400">
                  Yes! Enter a full or partial phone number (with or without the + sign) and we&apos;ll show you the exact rate for that destination. For example, entering &quot;92&quot; will show Pakistan rates.
                </p>
              </div>
              <div className="bg-navy-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-white font-medium mb-2">How do I get started?</h3>
                <p className="text-sm text-slate-400">
                  Create a free account at app.voxclouds.com, add balance via credit card or bank transfer, and start calling from your browser immediately. No app download or special equipment needed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
