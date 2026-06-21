import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import DIDRateSearch from './rates/DIDRateSearch'

/* ---------- SEO metadata ---------- */
export const metadata: Metadata = {
  title: 'Virtual Phone Numbers — USA, UK & 50+ Countries | VoxClouds',
  description:
    'Buy virtual phone numbers from USA, UK, Canada, UAE, and 50+ countries. Get a US DID number instantly, receive calls anywhere, use for WhatsApp Business verification. No hardware needed.',
  keywords:
    'virtual phone number, virtual number USA, DID number, buy virtual number, USA phone number online, virtual number for WhatsApp, business phone number, toll-free number, international DID, local virtual number, US virtual number, virtual number UK, virtual number Canada',
  alternates: { canonical: 'https://voxclouds.com/virtual-numbers' },
  robots: 'index, follow',
  authors: [{ name: 'VoxClouds' }],
  openGraph: {
    title: 'Virtual Phone Numbers — USA, UK & 50+ Countries | VoxClouds',
    description:
      'Get local and toll-free numbers from USA, UK, and 50+ countries. Receive calls anywhere through your browser. Instant activation.',
    url: 'https://voxclouds.com/virtual-numbers',
    siteName: 'VoxClouds',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://voxclouds.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Phone Numbers — Buy USA & International DIDs | VoxClouds',
    description:
      'Local and toll-free numbers from 50+ countries. Instant activation, SMS capable, WhatsApp-ready.',
  },
}

const faqs = [
  { q: 'What is a virtual phone number?', a: 'A virtual phone number (DID) is a telephone number not tied to a specific phone line or device. Calls to this number are routed over the internet to your VoxClouds account, where you can answer them from any browser or SIP device, anywhere in the world.' },
  { q: 'How much do virtual numbers cost?', a: 'Virtual phone numbers start from $5/month depending on the country and number type. There are no setup fees for most numbers. You can browse current pricing and availability on our rate card or live inventory search.' },
  { q: 'Can I use a virtual number for WhatsApp Business?', a: 'Yes. SMS-capable virtual numbers can be used for WhatsApp Business API verification. Choose an SMS-enabled number during signup and use it to verify your WhatsApp Business account.' },
  { q: 'How fast is number activation?', a: 'Most virtual numbers are activated instantly — within minutes of purchase. No paperwork, no waiting periods. Some countries may require address verification, which typically takes 1-2 business days.' },
  { q: 'Can I port my existing number to VoxClouds?', a: 'Yes. Number porting is available for most US, UK, and international numbers. Submit a port-in request from your dashboard. The process typically takes 3-5 business days depending on the carrier.' },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is a virtual phone number?', acceptedAnswer: { '@type': 'Answer', text: 'A virtual phone number (DID) is a telephone number not tied to a specific phone line or device. Calls to this number are routed over the internet to your VoxClouds account, where you can answer them from any browser or SIP device, anywhere in the world.' } },
    { '@type': 'Question', name: 'How much do virtual numbers cost?', acceptedAnswer: { '@type': 'Answer', text: 'Virtual phone numbers start from $5/month depending on the country and number type. There are no setup fees for most numbers. You can browse current pricing and availability on our rate card or live inventory search.' } },
    { '@type': 'Question', name: 'Can I use a virtual number for WhatsApp Business?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. SMS-capable virtual numbers can be used for WhatsApp Business API verification. Choose an SMS-enabled number during signup and use it to verify your WhatsApp Business account.' } },
    { '@type': 'Question', name: 'How fast is number activation?', acceptedAnswer: { '@type': 'Answer', text: 'Most virtual numbers are activated instantly — within minutes of purchase. No paperwork, no waiting periods. Some countries may require address verification, which typically takes 1-2 business days.' } },
    { '@type': 'Question', name: 'Can I port my existing number to VoxClouds?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Number porting is available for most US, UK, and international numbers. Submit a port-in request from your dashboard. The process typically takes 3-5 business days depending on the carrier.' } },
  ],
}

/* ---------- Schema.org Product JSON-LD ---------- */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'VoxClouds Virtual Phone Numbers',
  description:
    'Local and toll-free virtual phone numbers from USA, UK, Canada, UAE, and 50+ countries. Instant activation, SMS capable, browser-based receiving.',
  url: 'https://voxclouds.com/virtual-numbers',
  brand: {
    '@type': 'Brand',
    name: 'VoxClouds',
  },
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '5.00',
    highPrice: '24.99',
    priceCurrency: 'USD',
    offerCount: '50',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '94',
  },
}

/* ---------- data ---------- */

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      </svg>
    ),
    title: 'USA Virtual Numbers',
    desc: 'Get local area-code numbers or nationwide toll-free numbers (800/888/877). Perfect for US presence without a US office.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: 'International DIDs',
    desc: 'Direct Inward Dialing numbers from 50+ countries. UK, Canada, UAE, India, Nigeria, Germany, Australia, and many more.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Instant Activation',
    desc: 'Your number is live in minutes — no paperwork, no waiting periods. Start receiving calls the moment you sign up.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: 'SMS Capable',
    desc: 'Send and receive SMS messages on supported numbers. Manage texts right from your VoxClouds dashboard.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: 'Number Porting',
    desc: 'Already have a business number? Port it to VoxClouds and keep using it with our cloud infrastructure. No customer disruption.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'WhatsApp Business',
    desc: 'Use a virtual number for WhatsApp Business API verification. Get a dedicated SMS-capable number for your WhatsApp setup.',
  },
]

const useCases = [
  {
    title: 'Remote & Distributed Teams',
    desc: 'Give every region a local presence number. Your support team in Pakistan answers calls that ring in as a New York number — customers never notice the difference.',
    icon: '🌍',
  },
  {
    title: 'Call Centers & BPOs',
    desc: 'Provision dozens of inbound DID numbers in minutes. Route calls to agents, set up IVR queues, and monitor all lines from one dashboard.',
    icon: '🎧',
  },
  {
    title: 'International Businesses',
    desc: 'Operate in multiple markets without local offices. Get dedicated numbers per country and manage them all under one VoxClouds account.',
    icon: '✈️',
  },
  {
    title: 'Startups Wanting a US Presence',
    desc: 'A US phone number builds instant credibility with American customers and investors — even if your team is based anywhere in the world.',
    icon: '🚀',
  },
]

/* ---------- page ---------- */

export default function VirtualNumbersPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <SiteHeader />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-blue-600/10 rounded-full blur-[130px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-8">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Numbers available in 50+ countries — instant activation
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Virtual Phone Numbers for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Global Business
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Get local and toll-free numbers from USA, UK, and 50+ countries. Receive calls
            anywhere in the world through your browser — no SIM card, no hardware, no setup fee.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              Get Your Virtual Number
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#rates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              View Pricing & Numbers
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Features grid ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything You Need in a Virtual Number</h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            From US local numbers to international DIDs, VoxClouds gives you full control over
            your business phone numbers from a single dashboard.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-navy-900 border border-slate-800/60 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Pricing & Available Numbers ===== */}
      <section className="bg-navy-900 border-y border-slate-800/60 py-20" id="rates">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Pricing & Available Numbers</h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
              Browse our rate card or search live inventory to find available numbers in your country.
            </p>
          </div>

          <DIDRateSearch />
        </div>
      </section>

      {/* ===== Use Cases ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Who Uses Virtual Numbers?</h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Whether you&apos;re a startup, a BPO, or a multinational team — virtual numbers let you
            establish local credibility without local offices.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {useCases.map((u) => (
            <div
              key={u.title}
              className="flex gap-5 bg-navy-900 border border-slate-800/60 rounded-2xl p-6 hover:border-blue-500/30 transition-colors"
            >
              <span className="text-3xl mt-0.5 shrink-0" aria-hidden="true">{u.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{u.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{u.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Common questions about virtual phone numbers and DIDs.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-navy-900 border border-slate-800/60 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-navy-900 border-t border-slate-800/60 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-6">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Numbers available now
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Get Your Virtual Number Today
          </h2>
          <p className="mt-4 text-slate-400 text-lg leading-relaxed">
            Sign up in minutes. Pick your country, choose a number, and start receiving calls
            from anywhere in the world — through your browser.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              Create Free Account
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#rates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              Browse Available Numbers
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
