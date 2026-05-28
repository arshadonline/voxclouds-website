import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Globe, Shield, Zap, Phone, Bot, Building2, Hash, TrendingUp, CheckCircle, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'VoxClouds — AI-Powered Voice Infrastructure for Global Business',
  description: 'Wholesale VoIP routes, Hosted PBX, Virtual DID numbers, and AI voice agents. 150+ countries, 99.9% uptime, Africa & Middle East specialists.',
}

const stats = [
  { value: '150+', label: 'Countries' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '500+', label: 'A-Z Routes' },
  { value: '24/7', label: 'Support' },
]

const services = [
  {
    icon: Globe,
    title: 'Wholesale A-Z Routes',
    desc: 'Carrier-grade voice termination to 150+ countries. CLI routes, LCR, and automatic failover for uninterrupted connectivity.',
    href: '/wholesale',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Building2,
    title: 'Hosted IP PBX',
    desc: 'Full-featured cloud phone system for businesses. Extensions, IVR, call queues, and voicemail from $29/month.',
    href: '/hosted-pbx',
    color: 'from-purple-500 to-blue-500',
  },
  {
    icon: Hash,
    title: 'DID Numbers',
    desc: 'Virtual phone numbers in 50+ countries. Establish local presence in UAE, UK, USA, Nigeria, Kenya and more.',
    href: '/did-numbers',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: Bot,
    title: 'AI Voice Agents',
    desc: 'SIP infrastructure optimized for AI platforms. Compatible with Retell AI, VAPI, Bland.ai, ElevenLabs and Synthflow.',
    href: '/ai-voice',
    color: 'from-orange-500 to-pink-500',
  },
]

const features = [
  {
    icon: Zap,
    title: 'Lowest Latency',
    desc: 'Direct peering with Tier-1 carriers and regional PoPs across Africa and the Middle East for sub-100ms call setup.',
  },
  {
    icon: Bot,
    title: 'AI Integration Ready',
    desc: 'Pre-configured SIP endpoints for every major AI voice platform. Get your AI agents calling in under 10 minutes.',
  },
  {
    icon: Globe,
    title: 'Africa & Middle East Expert',
    desc: 'Specialized routes to Nigeria, Kenya, UAE, Saudi Arabia, Ghana and 40+ more countries with local carrier relationships.',
  },
]

const testimonials = [
  {
    quote: "VoxClouds cut our international calling costs by 40% while improving call quality. Their Africa routes are unmatched.",
    name: "Ahmed Al-Rashid",
    title: "CTO, Gulf Connect",
    rating: 5,
  },
  {
    quote: "We integrated VoxClouds SIP trunks with our AI call center in under an hour. The API documentation is excellent.",
    name: "Chidera Okonkwo",
    title: "Head of Infrastructure, TechHub Lagos",
    rating: 5,
  },
  {
    quote: "Reliable, affordable, and their support team actually responds. Best VoIP provider we've worked with.",
    name: "Sarah Mitchell",
    title: "Operations Director, Global BPO",
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-cyan-glow" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Animated globe */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 hidden xl:block">
          <svg viewBox="0 0 600 600" className="w-full h-full">
            <defs>
              <radialGradient id="globeGrad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="300" cy="300" r="250" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />
            <circle cx="300" cy="300" r="200" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.2" />
            <circle cx="300" cy="300" r="150" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.15" />
            <ellipse cx="300" cy="300" rx="250" ry="100" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.2" />
            <ellipse cx="300" cy="300" rx="250" ry="50" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.15" />
            {/* Route lines */}
            <line x1="200" y1="200" x2="420" y2="350" stroke="#00d4ff" strokeWidth="1" className="route-line" />
            <line x1="150" y1="320" x2="400" y2="250" stroke="#00d4ff" strokeWidth="1" className="route-line" />
            <line x1="300" y1="150" x2="380" y2="400" stroke="#00d4ff" strokeWidth="1" className="route-line" />
            <line x1="250" y1="380" x2="450" y2="220" stroke="#00d4ff" strokeWidth="1" className="route-line" />
            {/* Nodes */}
            <circle cx="200" cy="200" r="4" fill="#00d4ff" className="map-node" />
            <circle cx="420" cy="350" r="4" fill="#00d4ff" className="map-node" style={{ animationDelay: '0.5s' }} />
            <circle cx="150" cy="320" r="4" fill="#00d4ff" className="map-node" style={{ animationDelay: '1s' }} />
            <circle cx="380" cy="180" r="4" fill="#00d4ff" className="map-node" style={{ animationDelay: '1.5s' }} />
            <circle cx="300" cy="420" r="4" fill="#00d4ff" className="map-node" style={{ animationDelay: '2s' }} />
            <circle cx="460" cy="280" r="4" fill="#00d4ff" className="map-node" style={{ animationDelay: '0.3s' }} />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="section-label mx-auto">
            <span className="glow-dot" />
            AI-Powered Voice Infrastructure
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 mt-4">
            <span className="text-gradient">Connect the World</span>
            <br />
            <span className="text-white">with AI-Powered</span>
            <br />
            <span className="text-gradient-cyan">Voice</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Wholesale Routes &bull; Hosted PBX &bull; Virtual Numbers &bull; AI Voice Agents
            <br />
            <span className="text-gray-500 text-base">Enterprise voice infrastructure for Africa, Middle East &amp; beyond</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact?type=sales" className="btn-secondary text-base px-8 py-4">
              <Phone className="w-4 h-4" /> Talk to Sales
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="card text-center py-5">
                <div className="text-3xl font-bold text-gradient-cyan mb-1">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto">Our Solutions</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient mt-2 mb-4">Everything Voice, One Platform</h2>
            <p className="text-gray-400 max-w-xl mx-auto">From wholesale termination to AI-powered voice agents — all on carrier-grade infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => (
              <Link key={svc.title} href={svc.href}
                className="card group hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-sm">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center mb-4`}>
                  <svc.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">{svc.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{svc.desc}</p>
                <span className="text-xs font-medium text-cyan-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why VoxClouds */}
      <section className="py-24 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto">Why VoxClouds</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">Built for Global Scale</h2>
            <p className="text-gray-400 max-w-xl mx-auto">We're not just another VoIP reseller. We're a specialized infrastructure provider focused on markets that matter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((f) => (
              <div key={f.title} className="text-center p-8 rounded-2xl border border-brand-border hover:border-cyan-400/30 transition-all bg-brand-card">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-400/20 border border-cyan-400/20 flex items-center justify-center mx-auto mb-6">
                  <f.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Trust items */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Tier-1 carrier peering',
              'ISO-grade security',
              'GDPR compliant',
              'API-first platform',
              '99.9% SLA backed',
              'No setup fees',
              'Pay-as-you-go',
              'Dedicated support',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 p-3 rounded-lg border border-brand-border bg-brand-dark/50">
                <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto">Testimonials</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient mt-2">Trusted by Global Businesses</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card flex flex-col gap-4">
                <div className="flex gap-1">
                  {Array(t.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-auto pt-4 border-t border-brand-border">
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-navy">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="gradient-border inline-block w-full">
            <div className="px-8 py-16 rounded-2xl" style={{ background: 'linear-gradient(135deg, #0d1b2e, #0a1628)' }}>
              <div className="section-label mx-auto mb-6">Get Started Today</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Power Your Business<br />
                <span className="text-gradient-cyan">with AI Voice?</span>
              </h2>
              <p className="text-gray-400 mb-10 max-w-lg mx-auto">
                Join hundreds of businesses using VoxClouds for reliable, affordable global voice communication.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary text-base px-8 py-4">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/pricing" className="btn-secondary text-base px-8 py-4">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
