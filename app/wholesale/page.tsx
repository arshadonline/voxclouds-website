import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Globe, Zap, Shield, TrendingUp, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wholesale A-Z Voice Termination',
  description: 'Carrier-grade A-Z voice termination to 150+ countries. CLI routes, LCR, automatic failover. Specialized in Africa and Middle East. Starting at $0.006/min.',
}

const features = [
  'CLI (Calling Line Identification) routes',
  'Least Cost Routing (LCR) engine',
  'Automatic failover & redundancy',
  'Real-time call analytics dashboard',
  'SIP & H.323 support',
  'G.711, G.729, G.722 codecs',
  'Fraud detection & monitoring',
  'White-label options available',
]

const coverage = [
  { region: 'West Africa', countries: 'Nigeria, Ghana, Senegal, Ivory Coast, Cameroon' },
  { region: 'East Africa', countries: 'Kenya, Tanzania, Uganda, Ethiopia, Rwanda' },
  { region: 'North Africa', countries: 'Egypt, Morocco, Algeria, Tunisia, Libya' },
  { region: 'Gulf / GCC', countries: 'UAE, Saudi Arabia, Qatar, Kuwait, Bahrain' },
  { region: 'Levant', countries: 'Jordan, Lebanon, Iraq, Palestine' },
  { region: 'Global', countries: 'USA, UK, Germany, France, India, Pakistan + 100 more' },
]

const plans = [
  {
    name: 'Starter',
    price: '$0.008',
    unit: '/min',
    desc: 'Pay as you go',
    features: ['All destinations', 'SIP connectivity', 'Basic dashboard', 'Email support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Business',
    price: '$0.006',
    unit: '/min avg',
    desc: 'Volume discount',
    features: ['All destinations', 'LCR routing', 'Advanced analytics', 'Priority support', 'Dedicated trunk'],
    cta: 'Start Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    desc: 'High volume',
    features: ['Custom rates by destination', 'Dedicated routes', 'SLA guarantee', '24/7 NOC support', 'White-label options'],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export default function WholesalePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-cyan-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="section-label">Wholesale Termination</div>
            <h1 className="text-5xl sm:text-6xl font-bold mt-4 mb-6">
              <span className="text-gradient">Global A-Z Voice</span>
              <br />
              <span className="text-white">Termination</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Carrier-grade voice termination to 150+ countries with CLI routes, automatic failover, and industry-leading rates for Africa and the Middle East.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary text-base px-8 py-4">
                Get API Access <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact?type=rates" className="btn-secondary text-base px-8 py-4">
                Request Rate Sheet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-brand-navy border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { v: '150+', l: 'Countries' },
              { v: '500+', l: 'A-Z Routes' },
              { v: '99.9%', l: 'Uptime SLA' },
              { v: '<100ms', l: 'Post-Dial Delay' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl font-bold text-gradient-cyan">{s.v}</div>
                <div className="text-sm text-gray-400 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label">Features</div>
              <h2 className="text-3xl font-bold text-white mt-2 mb-4">Enterprise-Grade Voice Routing</h2>
              <p className="text-gray-400 mb-8">Our routing platform handles millions of minutes daily with intelligent LCR and real-time monitoring.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Globe, title: 'Global Reach', desc: '150+ countries on one SIP trunk' },
                { icon: Zap, title: 'Low Latency', desc: 'Sub-100ms post-dial delay' },
                { icon: Shield, title: 'Fraud Protection', desc: 'Real-time anomaly detection' },
                { icon: TrendingUp, title: 'LCR Engine', desc: 'Auto-route to best price/quality' },
              ].map((item) => (
                <div key={item.title} className="card text-center p-5">
                  <item.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <div className="text-sm font-semibold text-white mb-1">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-24 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto">Coverage</div>
            <h2 className="text-3xl font-bold text-white mt-2">Africa & Middle East Specialists</h2>
            <p className="text-gray-400 mt-3">Direct carrier relationships for the best rates and quality where it matters most.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverage.map((c) => (
              <div key={c.region} className="card">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-white text-sm">{c.region}</span>
                </div>
                <p className="text-xs text-gray-400">{c.countries}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto">Pricing</div>
            <h2 className="text-3xl font-bold text-white mt-2">Simple, Transparent Pricing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`card relative flex flex-col ${plan.highlight ? 'border-cyan-400/50 shadow-cyan' : ''}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-400 mb-1">{plan.desc}</div>
                  <div className="text-4xl font-bold text-white">{plan.price}<span className="text-lg text-gray-400 font-normal">{plan.unit}</span></div>
                  <div className="text-lg font-semibold text-cyan-400 mt-1">{plan.name}</div>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={plan.highlight ? 'btn-primary justify-center' : 'btn-secondary justify-center'}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-navy">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8">Connect in minutes. No setup fees. Test with $10 free credit.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary px-8 py-4">Get API Access <ArrowRight className="w-4 h-4" /></Link>
            <a href="mailto:sales@voxclouds.com" className="btn-secondary px-8 py-4"><Phone className="w-4 h-4" /> Talk to Sales</a>
          </div>
        </div>
      </section>
    </>
  )
}
