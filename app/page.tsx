import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'VoxClouds — Cloud Business Phone System | Free Internal Calls, Virtual Numbers & Cloud PBX',
  description:
    'Complete cloud phone system for global businesses. Free unlimited internal calls, virtual numbers in 60+ countries, AI-powered IVR in 70+ languages, outbound campaign tools, and 24/7 instant support. Trusted by SMEs, IT companies, and telecom operators worldwide. Start free — no hardware needed.',
  keywords:
    'cloud PBX, business phone system, virtual phone number, VoIP provider, hosted PBX, cloud phone system, SIP trunking, free internal calls, international calling, IVR system, virtual number USA, virtual number UK, virtual number UAE, cloud telephony, auto attendant, WebRTC softphone, DID number, business VoIP, SIP trunk provider, wholesale VoIP, VoIP for business, cloud communications platform, UCaaS, unified communications, cheap international calls, HD voice calls, multi language IVR, AI voice assistant, outbound campaign manager, cloud contact center, VoIP Africa, VoIP Middle East, VoIP Pakistan, VoIP India, VoIP Nigeria, VoIP UK, VoIP Canada, best VoIP provider 2026, best cloud phone system, affordable business phone',
  alternates: { canonical: 'https://voxclouds.com' },
  robots: 'index, follow',
  authors: [{ name: 'VoxClouds' }],
  openGraph: {
    title: 'VoxClouds — Cloud Business Phone System | Free Calls, Virtual Numbers & PBX',
    description:
      'Complete cloud phone system with free internal calls, virtual numbers in 60+ countries, AI-powered IVR in 70+ languages, and 24/7 support. Start free — no hardware, no contracts.',
    url: 'https://voxclouds.com',
    siteName: 'VoxClouds',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://voxclouds.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoxClouds — Cloud Business Phone System',
    description: 'Free internal calls, virtual numbers in 60+ countries, AI IVR in 70+ languages, and 24/7 support. The modern cloud phone system for global businesses.',
  },
}

/* ---------- structured data ---------- */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VoxClouds',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Cloud business phone system with free internal calls, virtual phone numbers in 60+ countries, AI-powered IVR in 70+ languages, outbound campaign tools, and 24/7 instant support. Built for SMEs, IT companies, telecom operators, and enterprises.',
  url: 'https://voxclouds.com',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free starter plan with browser softphone and pay-as-you-go calling',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '156',
  },
  featureList: 'Cloud PBX, Free Internal Calls, Virtual Phone Numbers, AI-Powered IVR, Outbound Campaign Manager, Multi-Language Support, WebRTC Softphone, SIP Trunking, Wholesale VoIP Routes, 24/7 Support',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is VoxClouds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VoxClouds is a cloud-based business phone system (Cloud PBX) that provides virtual phone numbers, free unlimited internal calls, AI-powered IVR in 70+ languages, and outbound campaign tools — all accessible from a web browser. No hardware, SIM cards, or app downloads needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are internal calls free on VoxClouds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, all SIP-to-SIP internal calls between extensions are completely free — unlimited minutes, no expiry, no hidden costs. Your team can call each other across offices, cities, or countries at zero cost. Only outbound calls to external phone numbers are billed at competitive pay-as-you-go rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'What languages does VoxClouds IVR support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VoxClouds AI-powered IVR supports 70+ languages including English, Urdu, Arabic, Hindi, Spanish, French, German, Portuguese, Turkish, Chinese, Japanese, and many more. Each language offers both male and female natural-sounding voice options for professional customer greetings and call routing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I run outbound calling campaigns with VoxClouds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. VoxClouds includes a built-in outbound campaign manager that helps sales teams reach prospects efficiently. Upload your contact list, choose a language and voice, and manage your outreach at scale. Campaigns support both live-agent and automated IVR modes with real-time analytics.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is VoxClouds suitable for small businesses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. VoxClouds is designed for businesses of every size — from solo entrepreneurs and startups to IT companies, telecom operators, and large enterprises. Start free with a browser-based softphone, and scale to unlimited extensions as your team grows. No contracts, no hardware needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly can I get started?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can sign up and make your first call in under 3 minutes. No hardware to install, no technician visits, no contracts. Choose a virtual number from 60+ countries, set up your AI IVR greeting, and start communicating globally from your browser.',
      },
    },
  ],
}

/* ---------- page ---------- */

export default async function HomePage() {
  const session = await getSession()
  if (session) {
    redirect(session.type === -1 ? '/admin' : '/dialpad')
  }

  const features = [
    {
      title: 'Cloud PBX',
      desc: 'Complete hosted phone system with unlimited extensions, smart call routing, ring groups, auto-attendant, and voicemail. Replace expensive on-premise hardware with a cloud PBX that works from any browser.',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Free Internal Calls',
      desc: 'All SIP-to-SIP calls between your team are 100% free — unlimited, forever. Your office in London can talk to your team in Dubai, Lagos, or Lahore at zero cost. No per-minute charges for internal communication.',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Virtual Phone Numbers',
      desc: 'Get local, mobile, and toll-free numbers from USA (+1), UK (+44), Canada, UAE, and 60+ countries. Receive calls from anywhere in the world directly in your browser. Instant activation, no paperwork.',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      title: 'Multi-Language AI IVR',
      desc: 'Professional auto-attendant with natural AI voices in 70+ languages — English, Urdu, Arabic, Hindi, Spanish, French, German, Chinese, and more. Greet every caller in their language. Male and female voices available.',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
    },
    {
      title: 'WebRTC Browser Softphone',
      desc: 'Make and receive HD calls directly from your browser — desktop, tablet, or mobile. No app downloads, no SIP phones, no hardware. Just open your browser and start calling worldwide.',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Outbound Campaign Manager',
      desc: 'Reach prospects at scale with built-in outbound calling tools. Upload contacts, choose a language and voice, and manage sales campaigns with live-agent or IVR mode. Real-time analytics and response tracking.',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
    {
      title: 'Instant 24/7 Support',
      desc: 'Get help whenever you need it. Live chat, WhatsApp, email, and ticket support around the clock. Our team resolves issues in minutes, not days. Dedicated account managers for enterprise clients.',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Wholesale VoIP Routes',
      desc: 'Premium A-Z voice termination with direct interconnects. CLI passthrough, low latency, and competitive rates for Africa, Middle East, and South Asia. Built for carriers, resellers, and BPOs.',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Custom & White-Label Solutions',
      desc: 'White-label cloud PBX, custom voice integrations, branded customer portals, and API access. We build tailored communication solutions for SMEs, IT companies, telecom operators, and enterprises.',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  const stats = [
    { value: '60+', label: 'Countries with virtual numbers' },
    { value: '70+', label: 'Languages supported' },
    { value: '99.9%', label: 'Uptime guarantee' },
    { value: '24/7', label: 'Instant support' },
  ]

  const industries = [
    {
      title: 'SMEs & Startups',
      desc: 'Replace expensive phone lines with a professional cloud PBX. Get a US/UK number, unlimited extensions, AI receptionist, and free internal calls — all for under $5/month. Scale as you grow.',
      icon: '🏢',
    },
    {
      title: 'IT & SaaS Companies',
      desc: 'Embed voice into your product with our APIs. White-label the platform, build custom integrations, or use AI voice assistants to streamline customer support and onboarding calls.',
      icon: '💻',
    },
    {
      title: 'Telecom Operators & Resellers',
      desc: 'A-Z wholesale termination, SIP trunking with failover, and white-label portal for your customers. Premium CLI routes for Africa, Middle East, and South Asia at carrier-grade quality.',
      icon: '📡',
    },
    {
      title: 'Call Centers & BPOs',
      desc: 'Multi-agent setup with CDR analytics, real-time monitoring, outbound campaign tools, and multi-language IVR for inbound support. Scale from 5 to 5,000 agents.',
      icon: '🎧',
    },
    {
      title: 'E-Commerce & Retail',
      desc: 'Local presence numbers in every market you sell. AI IVR handles order inquiries 24/7 in the customer\'s language. Reduce support costs with automated voice workflows.',
      icon: '🛒',
    },
    {
      title: 'Remote & Distributed Teams',
      desc: 'Give every team member their own extension. Free unlimited calls between offices in London, Dubai, Lagos, Lahore, or anywhere. One dashboard, one bill, global coverage.',
      icon: '🌍',
    },
  ]

  const languages = [
    'English', 'Urdu', 'Arabic', 'Hindi', 'Spanish', 'French', 'German',
    'Portuguese', 'Turkish', 'Chinese', 'Japanese', 'Italian', 'Dutch',
    'Swedish', 'Polish', 'Russian', 'Korean', 'Thai', 'Vietnamese', 'Indonesian',
  ]

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100">
      {/* Schema.org structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <SiteHeader />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-green-600/10 border border-green-500/20 rounded-full px-4 py-1.5 text-sm text-green-400 mb-8">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Free Internal Calls — Talk to your team worldwide at $0
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Your Complete Cloud Phone System for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Global Business</span>
          </h1>

          <p className="mt-4 text-lg text-slate-400 font-medium">
            Cloud PBX &bull; Free Internal Calls &bull; Virtual Numbers in 60+ Countries &bull; AI IVR in 70+ Languages &bull; 24/7 Support
          </p>

          <p className="mt-4 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Everything your business needs to communicate globally — from virtual numbers in the USA, UK, and UAE to AI-powered IVR that greets callers in their language.
            Free internal calls, instant setup, no hardware required. Trusted by SMEs, IT companies &amp; telecom operators worldwide.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
              Start Free — No Credit Card
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/rates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
              View Call Rates
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Stats Bar ===== */}
      <section className="border-y border-slate-800/60 bg-navy-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">One Platform. Every Communication Feature Your Business Needs.</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-3xl mx-auto">
              From free internal calls and AI-powered IVR to virtual numbers and wholesale routes — VoxClouds is the only cloud phone system you need.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-navy-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors group">
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

      {/* ===== Free Internal Calls Highlight ===== */}
      <section className="py-20 bg-gradient-to-r from-green-600/5 to-cyan-600/5 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-600/10 border border-green-500/20 rounded-full px-4 py-1.5 text-sm text-green-400 mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                Always Free
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Free Unlimited Internal Calls — Forever</h2>
              <p className="mt-4 text-slate-400 text-lg leading-relaxed">
                Every SIP-to-SIP call between your team members is completely free. No per-minute charges, no limits, no hidden costs. Your office in New York can talk to your team in London, Dubai, Lagos, or Lahore — all day, every day — at zero cost.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Unlimited free calls between all extensions',
                  'Works across offices, cities, and countries',
                  'HD voice quality on every internal call',
                  'No per-minute billing — truly free, forever',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-8 text-center">
              <div className="text-6xl font-extrabold text-green-400 mb-2">$0</div>
              <p className="text-xl text-white font-semibold">Internal Calls</p>
              <p className="text-slate-400 mt-2">Between all team extensions</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-navy-800 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">Unlimited</p>
                  <p className="text-slate-500">Minutes</p>
                </div>
                <div className="bg-navy-800 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">HD</p>
                  <p className="text-slate-500">Voice Quality</p>
                </div>
                <div className="bg-navy-800 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">Global</p>
                  <p className="text-slate-500">Office-to-Office</p>
                </div>
                <div className="bg-navy-800 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">Forever</p>
                  <p className="text-slate-500">No Expiry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Multi-Language Support ===== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">AI Voice Support in 70+ Languages</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-3xl mx-auto">
              Greet every caller in their native language with natural-sounding AI voices. Professional IVR greetings and voice menus
              in Urdu, Arabic, Hindi, Spanish, French, German, and dozens more — with male and female voice options.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {languages.map(lang => (
              <span key={lang} className="px-4 py-2 bg-navy-900 border border-slate-800 rounded-full text-sm text-slate-300 hover:border-blue-500/30 transition-colors">
                {lang}
              </span>
            ))}
            <span className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-sm text-blue-400 font-medium">
              + 50 more languages
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">🎙️</div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered IVR</h3>
              <p className="text-sm text-slate-400">Greet callers in their language with natural AI voices. Smart call routing based on caller input. Set up in minutes — no recording studio needed.</p>
            </div>
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-semibold text-white mb-2">Outbound Campaigns</h3>
              <p className="text-sm text-slate-400">Reach prospects in their preferred language. Upload contacts, select voice and language, and manage outreach campaigns with real-time response tracking.</p>
            </div>
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">👫</div>
              <h3 className="text-lg font-semibold text-white mb-2">Male & Female Voices</h3>
              <p className="text-sm text-slate-400">Every language comes with both male and female voice options. Choose the voice that best represents your brand and resonates with your audience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Built for Every Industry ===== */}
      <section className="py-24 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Built for Every Industry</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-3xl mx-auto">
              Whether you&apos;re an SME in Karachi, an IT company in Berlin, a telecom operator in Lagos, or a remote team across 10 countries — VoxClouds scales with you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map(u => (
              <div key={u.title} className="bg-navy-800 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
                <div className="text-3xl mb-4">{u.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{u.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Up and Running in 3 Minutes</h2>
            <p className="mt-4 text-slate-400 text-lg">No hardware. No contracts. No technical setup required.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Sign Up Free', desc: 'Create your account in 30 seconds. No credit card required. Your cloud phone system is ready instantly.' },
              { step: '02', title: 'Get Your Number', desc: 'Choose a virtual number from USA, UK, or 60+ countries. Your number is active in minutes.' },
              { step: '03', title: 'Set Up AI IVR', desc: 'Pick a language, choose a voice, and your AI receptionist is live. Professional greetings in 70+ languages.' },
              { step: '04', title: 'Start Calling', desc: 'Open your browser and make your first call. Add team members, set up extensions, and go global.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold text-lg mb-5">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section id="pricing" className="py-24 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">Pay only for what you use. No contracts, no hidden fees, cancel anytime.</p>

          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-navy-900 border border-slate-800 rounded-2xl px-8 py-10 text-left">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Starter</p>
              <p className="text-4xl font-extrabold text-white">Free</p>
              <p className="mt-1 text-slate-400 text-sm">forever — no credit card</p>
              <ul className="mt-6 text-sm text-slate-300 space-y-3">
                {['Browser-based softphone', 'Free internal SIP calls', 'Pay-as-you-go outbound', 'CDR call history', 'Ticket support'].map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="mt-8 inline-flex items-center justify-center w-full bg-navy-800 hover:bg-navy-700 border border-slate-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Get Started Free
              </Link>
            </div>

            <div className="bg-navy-900 border border-blue-500/30 rounded-2xl px-8 py-10 text-left relative">
              <div className="absolute -top-3 right-6 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
              <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Cloud PBX</p>
              <p className="text-4xl font-extrabold text-white">$5<span className="text-lg font-normal text-slate-400">/mo</span></p>
              <p className="mt-1 text-slate-400 text-sm">per virtual number</p>
              <ul className="mt-6 text-sm text-slate-300 space-y-3">
                {['Virtual number (USA, UK, 60+ countries)', 'Unlimited extensions', 'AI IVR in 70+ languages', 'Free unlimited internal calls', 'Outbound campaign tools', 'Real-time CDR analytics', '24/7 priority support'].map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="mt-8 inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Start with Cloud PBX
              </Link>
            </div>

            <div className="bg-navy-900 border border-cyan-500/30 rounded-2xl px-8 py-10 text-left relative">
              <div className="absolute -top-3 right-6 bg-cyan-500 text-navy-950 text-xs font-bold px-3 py-1 rounded-full">ENTERPRISE</div>
              <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2">Wholesale / Custom</p>
              <p className="text-4xl font-extrabold text-white">Custom</p>
              <p className="mt-1 text-slate-400 text-sm">volume-based pricing</p>
              <ul className="mt-6 text-sm text-slate-300 space-y-3">
                {['A-Z wholesale termination', 'White-label platform', 'Custom voice integrations', 'Dedicated account manager', 'SIP trunking with failover', 'API access', 'Custom rate decks'].map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="https://wa.me/14158437100" target="_blank" rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ for AEO ===== */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {[
              {
                q: 'What is VoxClouds?',
                a: 'VoxClouds is a cloud-based business phone system (Cloud PBX) that provides virtual phone numbers in 60+ countries, free unlimited internal calls, AI-powered IVR in 70+ languages, and outbound campaign tools — all accessible from a web browser. No hardware, SIM cards, or app downloads needed.',
              },
              {
                q: 'Are internal calls really free?',
                a: 'Yes, all SIP-to-SIP internal calls between your extensions are completely free — unlimited minutes, no expiry, no hidden costs. Your team can call each other across any country at zero cost. Only outbound calls to external phone numbers are billed at competitive pay-as-you-go rates.',
              },
              {
                q: 'What languages does the AI IVR support?',
                a: 'Our AI-powered IVR supports 70+ languages including English, Urdu, Arabic, Hindi, Spanish, French, German, Portuguese, Turkish, Chinese, Japanese, Italian, Dutch, and many more. Each language offers both male and female natural-sounding voice options for professional call handling.',
              },
              {
                q: 'Can I run outbound calling campaigns?',
                a: 'Yes. VoxClouds includes a built-in outbound campaign manager for sales teams. Upload your contact list, choose a language and voice, and manage your outreach at scale. Campaigns support live-agent and IVR modes with real-time analytics and response tracking.',
              },
              {
                q: 'Is VoxClouds suitable for small businesses?',
                a: 'Absolutely. VoxClouds is designed for businesses of every size — from solo entrepreneurs and startups to IT companies, telecom operators, and large enterprises. Start free with a browser-based softphone, add a virtual number for $5/month, and scale to unlimited extensions as your team grows.',
              },
              {
                q: 'How quickly can I get started?',
                a: 'You can sign up and make your first call in under 3 minutes. No hardware to install, no technician visits, no contracts. Choose a virtual number from 60+ countries, set up your AI IVR greeting, and start communicating globally from your browser.',
              },
            ].map(faq => (
              <div key={faq.q} className="bg-navy-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-y border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Upgrade Your Business Communications?</h2>
          <p className="mt-4 text-lg text-slate-400">
            Join businesses across 60+ countries who trust VoxClouds for reliable, affordable cloud telephony.
            Free internal calls, AI IVR in 70+ languages, virtual numbers, and 24/7 support — starting at $0/month.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
              Start Free — No Credit Card
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a href="https://wa.me/14158437100" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
              WhatsApp Sales Team
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
