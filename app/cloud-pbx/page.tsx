import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

/* ---------- metadata ---------- */
export const metadata: Metadata = {
  title: 'Cloud PBX — Hosted Business Phone System | VoxClouds',
  description:
    'Cloud PBX for businesses — fully hosted phone system with unlimited extensions, AI-powered IVR in 70+ languages, free internal calls, and browser-based softphone. No hardware needed. Start free, from $5/month. Perfect for SMEs, startups, and remote teams worldwide.',
  keywords:
    'cloud PBX, hosted PBX, business phone system, virtual PBX, cloud phone system, PBX for small business, hosted business phone, PBX without hardware, WebRTC softphone, AI IVR, auto attendant, unlimited extensions, call routing, cloud telephony, VoIP PBX, PBX Pakistan, PBX UAE, PBX India, PBX Africa',
  alternates: { canonical: 'https://voxclouds.com/cloud-pbx' },
  robots: 'index, follow',
  authors: [{ name: 'VoxClouds' }],
  openGraph: {
    title: 'Cloud PBX — Hosted Business Phone System | VoxClouds',
    description:
      'Fully hosted cloud PBX with unlimited extensions, AI IVR, and browser softphone. No desk phones required. Start in minutes.',
    url: 'https://voxclouds.com/cloud-pbx',
    siteName: 'VoxClouds',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://voxclouds.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud PBX — Hosted Business Phone System | VoxClouds',
    description: 'Browser-based cloud PBX with AI IVR, unlimited extensions, and zero hardware cost.',
  },
}

/* ---------- structured data ---------- */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'VoxClouds Cloud PBX',
  description:
    'Hosted cloud PBX solution with unlimited extensions, AI-powered IVR auto-attendant, browser-based WebRTC softphone, call routing, and real-time analytics. No hardware required.',
  url: 'https://voxclouds.com/cloud-pbx',
  brand: {
    '@type': 'Brand',
    name: 'VoxClouds',
  },
  offers: {
    '@type': 'Offer',
    price: '5.00',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    priceValidUntil: '2027-12-31',
    url: 'https://voxclouds.com/signup',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '130',
  },
  featureList: [
    'Browser-based WebRTC softphone',
    'Unlimited extensions',
    'AI-powered IVR auto-attendant',
    'Smart call routing',
    'Real-time CDR analytics',
    'Mobile-ready, no app required',
  ],
}

/* ---------- feature data ---------- */
const features = [
  {
    title: 'Browser-Based Softphone',
    desc: 'Make and receive calls directly from any modern browser using WebRTC. No desk phones, no SIP clients, no app installs. Your laptop or phone is your office phone.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Unlimited Extensions',
    desc: 'Add as many extensions as your team needs in the accountNumber-N format (e.g. 10045-1, 10045-2). Each gets its own DID or shares a main number — your choice.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'AI-Powered IVR',
    desc: 'Deploy a professional auto-attendant in minutes. Choose from Microsoft neural AI voices for natural-sounding greetings and multi-level call menus — no recording studio needed.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Smart Call Routing',
    desc: 'Route inbound calls by time-of-day, department, or caller ID. Set business hours, after-hours voicemail, ring groups, and failover destinations — all from the dashboard.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: 'Real-Time Analytics',
    desc: 'View live call detail records (CDRs), monitor call costs per extension, track inbound vs outbound volumes, and export reports — all in real time from the admin panel.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Mobile Ready',
    desc: 'Since everything runs in the browser, your cloud PBX works on any device — Android, iPhone, tablet, or desktop. No native app required, no MDM policies to worry about.',
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
]

/* ---------- why-choose items ---------- */
const whyItems = [
  { label: 'Zero Hardware Cost', desc: 'No PBX boxes, no IP phones, no wiring. Your existing devices are enough.' },
  { label: 'Setup in Minutes', desc: 'Sign up, get a virtual number, add extensions, and start calling — same day.' },
  { label: 'Scale Instantly', desc: 'Add or remove extensions in seconds. No vendor calls, no waiting.' },
  { label: '99.9% Uptime SLA', desc: 'Redundant infrastructure with carrier-grade reliability for your business phone system.' },
  { label: 'Enterprise Features at Startup Price', desc: 'IVR, call routing, analytics — features usually reserved for large enterprises, at pay-as-you-go rates.' },
]

/* ---------- FAQs ---------- */
const faqs = [
  { q: 'What is a Cloud PBX?', a: 'A Cloud PBX (Private Branch Exchange) is a business phone system hosted in the cloud instead of on-site hardware. It provides all the features of a traditional PBX — extensions, call routing, voicemail, auto-attendant — but runs entirely over the internet. No physical phone equipment needed.' },
  { q: 'How much does VoxClouds Cloud PBX cost?', a: 'VoxClouds offers a free starter plan with 1 extension and pay-as-you-go calling. The full Cloud PBX plan starts at $5/month per virtual number and includes unlimited extensions, AI IVR, and free internal calls. No contracts or setup fees.' },
  { q: 'Do I need special hardware or IP phones?', a: 'No. VoxClouds runs entirely in your web browser using WebRTC technology. You can make and receive calls from any desktop, laptop, tablet, or smartphone browser. Standard SIP devices and IP phones are also supported if you prefer them.' },
  { q: 'Can I use Cloud PBX for a team in multiple countries?', a: 'Absolutely. Add extensions for team members anywhere in the world. All internal calls between extensions are free regardless of location. Get virtual numbers in 60+ countries so each office has a local presence.' },
  { q: 'How quickly can I set up a Cloud PBX?', a: 'You can sign up, get a virtual number, add extensions, and make your first call in under 10 minutes. No technician visits, no hardware installation, no configuration files to edit.' },
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

/* ---------- how it works ---------- */
const steps = [
  { step: '01', title: 'Sign Up', desc: 'Create a VoxClouds account in under 2 minutes. No credit card needed to get started.' },
  { step: '02', title: 'Get a Virtual Number', desc: 'Pick a US, UK, or local DID number from 60+ countries. Your business gets a real phone number instantly.' },
  { step: '03', title: 'Add Extensions', desc: 'Create extensions for each team member or department. Assign IVR menus and routing rules right from the dashboard.' },
  { step: '04', title: 'Start Calling', desc: 'Open the browser softphone and make or receive calls immediately. No downloads, no hardware, no waiting.' },
]

/* ---------- page ---------- */
export default function CloudPbxPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <SiteHeader />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-blue-600/10 rounded-full blur-[130px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-600/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-sm text-cyan-400 mb-8">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            No hardware required &mdash; runs entirely in your browser
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Cloud PBX for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Modern Businesses
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A fully hosted business phone system with unlimited extensions, AI-powered IVR, and a
            browser-based softphone. Manage everything from your dashboard — no desk phones,
            no on-site PBX boxes, no IT headaches.
          </p>

          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            {['No hardware cost', 'Browser softphone (WebRTC)', 'AI IVR auto-attendant', 'Unlimited extensions', '99.9% uptime SLA'].map(item => (
              <li key={item} className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-cyan-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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

      {/* ===== Key Features Grid ===== */}
      <section className="py-24 bg-navy-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Everything Your Business Phone System Needs
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              VoxClouds Cloud PBX packs enterprise telephony features into a simple, browser-based platform — at a price any business can afford.
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

      {/* ===== Why Choose VoxClouds Cloud PBX ===== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Why Choose VoxClouds<br className="hidden sm:block" /> Cloud PBX?
              </h2>
              <p className="mt-4 text-slate-400 text-lg leading-relaxed">
                Traditional PBX systems cost thousands in hardware and require dedicated IT support.
                VoxClouds flips the model — you get a fully featured hosted PBX that runs in any browser,
                scales with a click, and costs a fraction of legacy systems.
              </p>
              <div className="mt-8 space-y-5">
                {whyItems.map(item => (
                  <div key={item.label} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5">
                      <svg className="w-3.5 h-3.5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{item.label}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-8 space-y-6">
              <h3 className="text-xl font-bold text-white">Compare Cloud PBX vs Traditional PBX</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 font-medium pb-3">Feature</th>
                      <th className="text-center text-cyan-400 font-semibold pb-3">VoxClouds</th>
                      <th className="text-center text-slate-500 font-medium pb-3">Traditional PBX</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {[
                      ['Hardware required', 'None', 'Expensive'],
                      ['Setup time', 'Minutes', 'Days/weeks'],
                      ['Scaling', 'Instant', 'Vendor dependent'],
                      ['AI IVR', 'Built-in', 'Add-on cost'],
                      ['Remote access', 'Any browser', 'VPN required'],
                      ['Upfront cost', '$0', '$1,000–$10,000+'],
                    ].map(([feature, ours, theirs]) => (
                      <tr key={feature}>
                        <td className="py-3 text-slate-400">{feature}</td>
                        <td className="py-3 text-center text-white font-medium">{ours}</td>
                        <td className="py-3 text-center text-slate-500">{theirs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="py-24 bg-navy-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Get Your Cloud PBX Running in 4 Steps
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
              From sign-up to first call in under 10 minutes — no engineers required.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%-1rem)] w-8 h-px bg-slate-700 z-10" />
                )}
                <div className="bg-navy-800 border border-slate-700/50 rounded-2xl p-6">
                  <span className="text-4xl font-extrabold text-blue-600/40">{s.step}</span>
                  <h3 className="text-lg font-semibold text-white mt-3 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Target Markets ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-800 border border-slate-700/50 rounded-3xl px-8 py-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Built for Businesses Across the Globe
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
              VoxClouds Cloud PBX is especially popular with businesses in{' '}
              <span className="text-white font-medium">Africa</span>,{' '}
              <span className="text-white font-medium">Middle East</span>,{' '}
              <span className="text-white font-medium">Pakistan</span>,{' '}
              <span className="text-white font-medium">India</span>, and the{' '}
              <span className="text-white font-medium">UAE</span> — markets where reliable, affordable
              business telephony has historically been hard to access. Whether you need a virtual PBX for a
              Karachi call center, a hosted phone system for a Dubai startup, or a cloud phone system for a
              Lagos SME, VoxClouds has you covered.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Pakistan', 'UAE', 'Nigeria', 'India', 'Kenya', 'Saudi Arabia', 'South Africa', 'Egypt', 'Bangladesh', 'Ghana'].map(country => (
                <span key={country} className="bg-navy-700 border border-slate-600/50 text-slate-300 text-sm px-3 py-1.5 rounded-full">
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 bg-navy-900/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
              Everything you need to know about VoxClouds Cloud PBX.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map(faq => (
              <div
                key={faq.q}
                className="bg-navy-900 border border-slate-800 rounded-2xl p-6"
              >
                <h3 className="text-white font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-navy-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-6">
            No hardware. No contracts. Cancel anytime.
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Switch to a Smarter Business Phone System?
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
            Get started for free today. Add extensions, configure your IVR, and make your first call — all without spending a cent on hardware.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
            >
              Start Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="https://wa.me/14158437100" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Log in to your dashboard
            </Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
