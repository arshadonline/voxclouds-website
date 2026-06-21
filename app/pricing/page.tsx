import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'VoIP Pricing — Cloud PBX & SIP Trunk Rates | VoxClouds',
  description:
    'Simple, transparent VoIP pricing. Free starter plan, Cloud PBX from $5/mo with unlimited extensions, and custom wholesale SIP trunk rates. No contracts, no hidden fees.',
  keywords:
    'VoIP pricing, cloud PBX pricing, cheap VoIP rates, business phone pricing, SIP trunk pricing, hosted PBX cost, virtual number pricing, international call rates, pay-as-you-go VoIP, wholesale VoIP rates',
  alternates: { canonical: 'https://voxclouds.com/pricing' },
  robots: 'index, follow',
  openGraph: {
    title: 'VoIP Pricing — Cloud PBX & SIP Trunk Rates | VoxClouds',
    description:
      'Free starter plan, $5/mo Cloud PBX with unlimited extensions, and custom wholesale SIP trunks. No contracts, cancel anytime.',
    url: 'https://voxclouds.com/pricing',
    siteName: 'VoxClouds',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://voxclouds.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoIP Pricing | VoxClouds',
    description: 'Transparent cloud PBX and SIP trunk pricing. Start free, upgrade anytime.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'VoxClouds Pricing',
  url: 'https://voxclouds.com/pricing',
  description: 'Pricing plans for VoxClouds cloud PBX, virtual numbers, and wholesale VoIP services.',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'Offer',
        position: 1,
        name: 'Starter',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free plan with 1 extension, browser softphone, and pay-per-minute calling.',
        eligibleCustomerType: 'https://schema.org/BusinessEntityType',
        priceValidUntil: '2027-12-31',
      },
      {
        '@type': 'Offer',
        position: 2,
        name: 'Cloud PBX',
        price: '5',
        priceCurrency: 'USD',
        description: 'Unlimited extensions, AI IVR in 70+ languages, virtual number included, call recording, priority support.',
        priceSpecification: {
          '@type': 'RecurringCharge',
          billingDuration: 'P1M',
        },
        priceValidUntil: '2027-12-31',
      },
      {
        '@type': 'Offer',
        position: 3,
        name: 'Wholesale / Reseller',
        description: 'Custom pricing for unlimited SIP trunks, A-Z termination, and dedicated account management.',
        priceCurrency: 'USD',
      },
    ],
  },
}

const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    sub: 'forever',
    highlight: false,
    badge: null,
    features: [
      '1 extension',
      'Browser softphone (WebRTC)',
      'Pay-per-minute outbound calling',
      'Free inbound calls',
      'Basic call logs',
      'Email support',
    ],
    cta: { label: 'Get Started Free', href: '/signup', style: 'secondary' },
  },
  {
    name: 'Cloud PBX',
    price: '$5',
    sub: 'per month',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited extensions',
      'AI IVR in 70+ languages',
      'US virtual number included (+1)',
      'Advanced CDR reports & analytics',
      'Call recording',
      'WebRTC browser softphone',
      'Free SIP-to-SIP internal calls',
      'Outbound campaign tools',
      'Priority support',
    ],
    cta: { label: 'Start Cloud PBX', href: '/signup', style: 'primary' },
  },
  {
    name: 'Wholesale / Reseller',
    price: 'Custom',
    sub: 'volume-based',
    highlight: false,
    badge: null,
    features: [
      'Unlimited SIP trunks',
      'A-Z termination routes',
      'Africa & Middle East specialist',
      'Dedicated account manager',
      'Volume discounts',
      'Custom billing & rate decks',
      'Dedicated uptime SLA (99.9%)',
      'Real-time CDR portal',
    ],
    cta: { label: 'WhatsApp Sales', href: 'https://wa.me/14158437100', style: 'secondary' },
  },
]

const rates = [
  { dest: 'USA & Canada', flag: '🇺🇸', rate: 'from $0.003' },
  { dest: 'Germany', flag: '🇩🇪', rate: 'from $0.006' },
  { dest: 'Australia', flag: '🇦🇺', rate: 'from $0.007' },
  { dest: 'India', flag: '🇮🇳', rate: 'from $0.025' },
  { dest: 'Pakistan', flag: '🇵🇰', rate: 'from $0.051' },
  { dest: 'South Africa', flag: '🇿🇦', rate: 'from $0.076' },
  { dest: 'Egypt', flag: '🇪🇬', rate: 'from $0.144' },
  { dest: 'UAE', flag: '🇦🇪', rate: 'from $0.175' },
  { dest: 'Kenya', flag: '🇰🇪', rate: 'from $0.101' },
  { dest: 'Nigeria', flag: '🇳🇬', rate: 'from $0.146' },
  { dest: 'UK', flag: '🇬🇧', rate: 'from $0.765' },
  { dest: 'Saudi Arabia', flag: '🇸🇦', rate: 'from $1.134' },
]

const faqs = [
  {
    q: 'Do I need hardware or a physical phone?',
    a: 'No hardware required. VoxClouds works entirely in your browser via WebRTC. You can make and receive calls from any desktop or mobile browser without installing anything. SIP devices and IP phones are also supported if you prefer them.',
  },
  {
    q: 'Can I keep my existing phone number?',
    a: 'Yes. Number porting is available for most US, UK, and international numbers. Submit a port-in request from your dashboard and we will handle the transfer, typically within 3–5 business days.',
  },
  {
    q: 'What audio codecs are supported?',
    a: 'VoxClouds supports G.711 (ulaw/alaw), G.729, and Opus. G.711 is used by default for maximum compatibility and lowest latency. G.729 is available for low-bandwidth connections.',
  },
  {
    q: 'Is there a minimum commitment or contract?',
    a: 'None at all. VoxClouds is month-to-month. You can upgrade, downgrade, or cancel at any time with no cancellation fees. The Starter plan is completely free with no expiry.',
  },
  {
    q: 'How do I add calling credit to my account?',
    a: 'Credit can be added online through your account dashboard using a debit/credit card (Visa, Mastercard) or via bank transfer. Credit is applied instantly for card payments.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Visa, Mastercard, and bank transfers. Card payments are processed instantly. We also support LemonSqueezy for international payments. Minimum top-up is $5.',
  },
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

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SiteHeader />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            No hidden fees. No contracts. Pay only for what you use — from a free softphone account to enterprise-grade SIP trunking.
          </p>
        </div>
      </section>

      {/* ===== Pricing Tiers ===== */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl px-8 py-10 ${
                  tier.highlight
                    ? 'bg-navy-900 border-2 border-blue-500/60 shadow-lg shadow-blue-600/10'
                    : 'bg-navy-900 border border-slate-800'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full tracking-wider">
                    {tier.badge}
                  </div>
                )}
                <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${tier.highlight ? 'text-blue-400' : 'text-slate-400'}`}>
                  {tier.name}
                </p>
                <p className="text-4xl font-extrabold text-white">
                  {tier.price}
                  {tier.price !== 'Free' && tier.price !== 'Custom' && (
                    <span className="text-lg font-normal text-slate-400">/mo</span>
                  )}
                </p>
                <p className="mt-1 text-sm text-slate-500">{tier.sub}</p>

                <ul className="mt-7 flex-1 space-y-3 text-sm text-slate-300">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {tier.cta.href.startsWith('mailto') ? (
                    <a
                      href={tier.cta.href}
                      className={`inline-flex items-center justify-center w-full font-semibold px-6 py-3.5 rounded-xl transition-colors ${
                        tier.cta.style === 'primary'
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200'
                      }`}
                    >
                      {tier.cta.label}
                    </a>
                  ) : (
                    <Link
                      href={tier.cta.href}
                      className={`inline-flex items-center justify-center w-full font-semibold px-6 py-3.5 rounded-xl transition-colors ${
                        tier.cta.style === 'primary'
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200'
                      }`}
                    >
                      {tier.cta.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            All plans include free SIP-to-SIP internal calls and SSL-encrypted signaling.
          </p>
        </div>
      </section>

      {/* ===== Calling Rates ===== */}
      <section className="py-20 bg-navy-900/50 border-y border-slate-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Sample Calling Rates</h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto">
              Pay-as-you-go per-minute rates. No monthly minimums. Rates shown per minute, billed per minute.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rates.map((r) => (
              <div key={r.dest} className="flex items-center justify-between bg-navy-800 border border-slate-700/50 rounded-xl px-5 py-4">
                <span className="flex items-center gap-3 text-slate-200 text-sm font-medium">
                  <span className="text-xl">{r.flag}</span>
                  {r.dest}
                </span>
                <span className="text-blue-400 font-bold text-sm tabular-nums">{r.rate}/min</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Rates are indicative and may vary by route and destination type (mobile vs. fixed).{' '}
            <Link href="/international-calling" className="text-blue-400 hover:text-blue-300 underline">
              View full rate deck
            </Link>
          </p>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="bg-navy-900 border border-slate-800 rounded-xl px-6 py-5">
                <h3 className="text-base font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-y border-slate-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mt-4 text-lg text-slate-400">
            Sign up free in 30 seconds. No credit card required. Upgrade anytime.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              Start Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="https://wa.me/14158437100" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Disclaimers */}
      <section className="py-10 border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-xs text-slate-500 leading-relaxed">
          <p><strong className="text-slate-400">* Rates Disclaimer:</strong> All calling rates shown are per-minute charges billed in one-minute increments. Rates are subject to change without prior notice. Actual charges may vary depending on destination, carrier, and call type (landline vs. mobile). A connection fee may apply on certain routes. Visit your account dashboard for the most up-to-date rate sheet.</p>
          <p><strong className="text-slate-400">* Fair Use Policy:</strong> VoxClouds services are intended for normal business and personal communication use. Unlimited extensions and internal calling are subject to a fair use policy. Excessive usage patterns inconsistent with normal business or personal communication may result in service suspension or termination. VoxClouds reserves the right to monitor usage patterns to ensure quality of service for all customers.</p>
          <p><strong className="text-slate-400">* Service Terms:</strong> VoxClouds reserves the right to modify, update, or discontinue any service, feature, pricing plan, or calling rate at any time without prior notice. Prepaid balances are non-refundable. Service availability and call quality may vary by region and are provided on an &quot;as-is&quot; basis. The 99.9% uptime SLA applies to Wholesale, Enterprise, and Cloud PBX plans. By using VoxClouds services, you agree to our Terms of Service and Acceptable Use Policy.</p>
          <p><strong className="text-slate-400">* Number Availability:</strong> Virtual phone number availability varies by country and region. Not all number types are available in all locations. Number porting timelines are estimates and may vary by carrier. Monthly number fees apply regardless of usage.</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
