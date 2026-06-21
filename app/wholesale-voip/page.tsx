import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Wholesale VoIP Routes & SIP Trunking — VoxClouds',
  description:
    'Premium A-Z wholesale voice termination and high-capacity SIP trunks. Competitive rates to 150+ countries for carriers, VoIP resellers, call centers, and ISPs.',
  keywords:
    'wholesale VoIP, SIP trunking, wholesale voice routes, VoIP reseller, A-Z termination, wholesale VoIP provider, SIP trunk provider, bulk voice minutes, wholesale SIP, voice termination, VoIP carrier, wholesale minutes, SIP trunk pricing, A-Z routes, international voice wholesale',
  alternates: { canonical: 'https://voxclouds.com/wholesale-voip' },
  robots: 'index, follow',
  authors: [{ name: 'VoxClouds' }],
  openGraph: {
    title: 'Wholesale VoIP Routes & SIP Trunking — VoxClouds',
    description:
      'High-capacity A-Z voice termination with competitive per-minute rates. SIP trunks for carriers, resellers, and call centers. 150+ countries, 99.9% uptime SLA.',
    url: 'https://voxclouds.com/wholesale-voip',
    siteName: 'VoxClouds',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://voxclouds.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesale VoIP Routes & SIP Trunking — VoxClouds',
    description:
      'A-Z termination to 150+ countries. High-capacity SIP trunks for carriers, resellers, and call centers.',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is wholesale VoIP termination?', acceptedAnswer: { '@type': 'Answer', text: 'Wholesale VoIP termination is a service where we route your outbound voice calls to their destination via our carrier network. You send us SIP traffic, we terminate it to landlines and mobiles in 150+ countries at competitive per-minute rates.' } },
    { '@type': 'Question', name: 'What are the minimum volume requirements?', acceptedAnswer: { '@type': 'Answer', text: 'There are no minimum volume requirements to get started. However, volume-based discounts are available for partners with consistent high traffic. Contact our sales team to discuss your traffic profile and get a custom rate deck.' } },
    { '@type': 'Question', name: 'Do you support CLI/ANI pass-through?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Full Caller ID presentation is supported on all routes. Your originating caller ID is delivered transparently to the end user. This is standard on all our wholesale routes.' } },
    { '@type': 'Question', name: 'What billing options are available?', acceptedAnswer: { '@type': 'Answer', text: 'We offer both prepaid and postpaid billing. Prepaid accounts can top up anytime. Postpaid with net-7 or net-15 terms is available for established partners after credit review. Per-second and per-minute billing increments are both supported.' } },
    { '@type': 'Question', name: 'How do I get started with wholesale VoIP?', acceptedAnswer: { '@type': 'Answer', text: 'Contact our sales team via WhatsApp or email with your traffic profile — expected volume, key destinations, and preferred billing terms. We will send you a competitive rate deck and SIP credentials within 24 hours.' } },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'VoxClouds Wholesale VoIP & SIP Trunking',
  serviceType: 'Wholesale VoIP Termination',
  description:
    'Premium A-Z wholesale voice termination and high-capacity SIP trunks for carriers, VoIP resellers, call centers, and ISPs. Routes to 150+ countries with 99.9% uptime SLA.',
  url: 'https://voxclouds.com/wholesale-voip',
  provider: {
    '@type': 'Organization',
    name: 'VoxClouds',
    url: 'https://voxclouds.com',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Worldwide',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Wholesale VoIP Plans',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'A-Z Wholesale Voice Termination',
          description: 'Bulk voice minutes to 150+ countries at competitive per-minute rates',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'SIP Trunking',
          description: 'High-capacity SIP trunks with unlimited concurrent calls',
        },
      },
    ],
  },
}

const features = [
  {
    title: 'A-Z Termination',
    desc: 'Premium voice routes to 150+ countries worldwide. Direct interconnects with tier-1 carriers for the lowest latency and best call completion rates.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'High Capacity',
    desc: 'Unlimited concurrent call channels with no hard limits. Scale from a handful of simultaneous calls to thousands during peak traffic without any pre-provisioning.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'CLI / ANI Pass-through',
    desc: "Full Caller ID presentation on all routes. Your customers' caller ID is delivered transparently so end-users always see the correct originating number.",
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    title: 'Real-Time CDR',
    desc: 'Detailed call detail records available instantly. Download full CDR exports, monitor live traffic, and generate billing reports for your own customers.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Redundant Network',
    desc: 'Geo-redundant infrastructure with automatic failover. 99.9% uptime SLA backed by multiple carrier interconnects and geographically distributed PoPs.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Flexible Billing',
    desc: 'Choose prepaid or postpaid billing to suit your cash flow. Custom rate decks, per-second billing options, and volume discounts available for high-traffic partners.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
]

const audiences = [
  {
    title: 'VoIP Resellers',
    desc: 'White-label wholesale routes with your own rate deck. Full CDR access lets you bill your customers accurately and profitably.',
    icon: '📡',
  },
  {
    title: 'Telecom Carriers',
    desc: 'Carrier-grade interconnects with high ASR and ACD. Direct peering available for high-volume traffic exchange.',
    icon: '🏗️',
  },
  {
    title: 'Call Centers',
    desc: 'Unlimited concurrent channels mean no bottlenecks during campaign peaks. CLI pass-through keeps your agents identifiable to customers.',
    icon: '🎧',
  },
  {
    title: 'ISPs Adding Voice',
    desc: 'Bundle voice services into your existing broadband offering. Simple SIP integration requires no new hardware or complex deployments.',
    icon: '🌐',
  },
]

const faqs = [
  { q: 'What is wholesale VoIP termination?', a: 'Wholesale VoIP termination is a service where we route your outbound voice calls to their destination via our carrier network. You send us SIP traffic, we terminate it to landlines and mobiles in 150+ countries at competitive per-minute rates.' },
  { q: 'What are the minimum volume requirements?', a: 'There are no minimum volume requirements to get started. However, volume-based discounts are available for partners with consistent high traffic. Contact our sales team to discuss your traffic profile and get a custom rate deck.' },
  { q: 'Do you support CLI/ANI pass-through?', a: 'Yes. Full Caller ID presentation is supported on all routes. Your originating caller ID is delivered transparently to the end user. This is standard on all our wholesale routes.' },
  { q: 'What billing options are available?', a: 'We offer both prepaid and postpaid billing. Prepaid accounts can top up anytime. Postpaid with net-7 or net-15 terms is available for established partners after credit review. Per-second and per-minute billing increments are both supported.' },
  { q: 'How do I get started with wholesale VoIP?', a: 'Contact our sales team via WhatsApp or email with your traffic profile — expected volume, key destinations, and preferred billing terms. We will send you a competitive rate deck and SIP credentials within 24 hours.' },
]

const specs = [
  { label: 'Signaling Protocol', value: 'SIP (RFC 3261)' },
  { label: 'Transport', value: 'UDP / TCP / TLS' },
  { label: 'Audio Codecs', value: 'G.711 (alaw/ulaw), G.729' },
  { label: 'Fax', value: 'T.38 pass-through' },
  { label: 'Media Encryption', value: 'SRTP (RFC 3711)' },
  { label: 'DTMF', value: 'RFC 2833 / SIP INFO' },
  { label: 'Concurrent Channels', value: 'Unlimited' },
  { label: 'Uptime SLA', value: '99.9%' },
]

export default function WholesaleVoipPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <SiteHeader />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-cyan-600/8 rounded-full blur-[140px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-600/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-sm text-cyan-400 mb-8">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Carrier-grade infrastructure — 150+ countries
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Wholesale VoIP Routes &amp;{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">SIP Trunking</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Premium A-Z voice termination with competitive per-minute rates. High-capacity SIP trunks built for carriers, VoIP resellers, and call centers that demand reliability at scale.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/14158437100" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
              WhatsApp Sales for Pricing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Stats Bar ===== */}
      <section className="border-y border-slate-800/60 bg-navy-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '150+', label: 'Countries' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: 'Unlimited', label: 'Concurrent calls' },
              { value: '<50ms', label: 'Average latency' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything You Need to Terminate Traffic</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              Enterprise-grade wholesale features designed for high-volume voice operators.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div
                key={f.title}
                className="bg-navy-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors group">
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

      {/* ===== Who It's For ===== */}
      <section className="py-24 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Who It&apos;s For</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              Our wholesale platform is purpose-built for voice-heavy operators who need scale, reliability, and transparent pricing.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map(a => (
              <div
                key={a.title}
                className="bg-navy-800 border border-slate-700/50 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition-colors">
                <div className="text-4xl mb-4">{a.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{a.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Technical Specs ===== */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Technical Specifications</h2>
            <p className="mt-4 text-slate-400 text-lg">
              Open-standard SIP with full codec and encryption support — integrates with any compliant softswitch or IP-PBX.
            </p>
          </div>
          <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex items-center justify-between px-6 py-4 ${i < specs.length - 1 ? 'border-b border-slate-800' : ''}`}>
                <span className="text-sm font-medium text-slate-400">{spec.label}</span>
                <span className="text-sm font-semibold text-white text-right">{spec.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">
            Custom codec profiles and dedicated SIP trunks available for high-volume accounts. Ask our team for details.
          </p>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 bg-navy-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              Common questions about our wholesale VoIP and SIP trunking services.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-navy-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border-y border-slate-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Discuss Custom Pricing?</h2>
          <p className="mt-4 text-lg text-slate-400">
            Wholesale rates are volume-based. Share your traffic profile and destination mix with our sales team and we will send you a competitive rate deck within 24 hours.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/14158437100" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
              WhatsApp +1 (415) 843-7100
            </a>
            <a
              href="mailto:sales@voxclouds.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
              Email sales@voxclouds.com
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
