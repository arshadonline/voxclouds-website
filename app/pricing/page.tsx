import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing — VoxClouds VoIP Services',
  description: 'Simple, transparent pricing for wholesale VoIP, hosted PBX, DID numbers and AI voice infrastructure. No hidden fees.',
}

const pbxPlans = [
  { name: 'Starter', price: 29, ext: 5, did: 1, cta: 'Start Free Trial', highlight: false },
  { name: 'Business', price: 79, ext: 20, did: 3, cta: 'Start Free Trial', highlight: true },
  { name: 'Enterprise', price: 149, ext: 50, did: 10, cta: 'Get Started', highlight: false },
  { name: 'Call Center', price: 299, ext: 100, did: 'Unlimited', cta: 'Contact Sales', highlight: false },
]

const pbxFeatures = [
  ['SIP Extensions', '5', '20', '50', '100'],
  ['DID Numbers', '1', '3', '10', 'Unlimited'],
  ['IVR / Auto Attendant', '✓', '✓', '✓', '✓'],
  ['Call Queues', '—', '✓', '✓', '✓'],
  ['Voicemail to Email', '✓', '✓', '✓', '✓'],
  ['Call Recording', '—', '✓', '✓', '✓'],
  ['Live Analytics', '—', '✓', '✓', '✓'],
  ['API Access', '—', '—', '✓', '✓'],
  ['CRM Integration', '—', '—', '✓', '✓'],
  ['Dedicated Support', '—', '—', '✓', '24/7 NOC'],
]

const faqs = [
  { q: 'Is there a setup fee?', a: 'No setup fees on any plan. Your first month is prorated so you only pay for days used.' },
  { q: 'Can I keep my existing number?', a: 'Yes. We support number porting from most carriers. The process takes 3-10 business days.' },
  { q: 'What\'s the minimum commitment?', a: 'Month-to-month on all plans. No contracts, cancel anytime. Annual plans get 2 months free.' },
  { q: 'Do wholesale rates include all destinations?', a: 'Yes. Our A-Z rate deck covers 150+ countries. Special pricing is available for high-volume Africa and Middle East routes.' },
  { q: 'Can I use VoxClouds with my existing PBX?', a: 'Absolutely. Our SIP trunks work with Asterisk, FreeSWITCH, 3CX, Cisco, and any SIP-compliant system.' },
  { q: 'How do I connect an AI agent?', a: 'We provide SIP credentials that work with Retell AI, VAPI, Bland.ai, ElevenLabs and Synthflow. Full documentation available after signup.' },
]

export default function PricingPage() {
  return (
    <>
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-label mx-auto">Pricing</div>
          <h1 className="text-5xl sm:text-6xl font-bold mt-4 mb-6">
            <span className="text-gradient">Simple, Transparent</span>
            <br />
            <span className="text-white">Pricing</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">No hidden fees. No surprise bills. Pay only for what you use.</p>
        </div>
      </section>

      {/* Wholesale pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white">Wholesale Voice Termination</h2>
            <p className="text-gray-400 mt-2">Pay-per-minute. No monthly commitment required.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { tier: 'Starter', rate: '$0.008/min', vol: 'Any volume', badge: '' },
              { tier: 'Business', rate: '$0.006/min avg', vol: '10,000+ min/mo', badge: 'Popular' },
              { tier: 'Enterprise', rate: 'Custom', vol: '100,000+ min/mo', badge: 'Best Value' },
            ].map((p) => (
              <div key={p.tier} className={`card text-center ${p.badge === 'Popular' ? 'border-cyan-400/50 shadow-cyan' : ''}`}>
                {p.badge && (
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-xs font-semibold text-white mb-3">
                    {p.badge}
                  </div>
                )}
                <div className="text-2xl font-bold text-white mb-1">{p.rate}</div>
                <div className="text-sm text-cyan-400 font-medium mb-1">{p.tier}</div>
                <div className="text-xs text-gray-500 mb-4">{p.vol}</div>
                <Link href="/contact" className={`text-sm py-2 px-4 rounded-lg font-medium block transition-all ${p.badge === 'Popular' ? 'btn-primary justify-center' : 'btn-secondary justify-center'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">Rates shown are averages. Destination-specific pricing available on request.</p>
        </div>
      </section>

      {/* PBX pricing table */}
      <section className="py-20 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white">Hosted PBX Plans</h2>
            <p className="text-gray-400 mt-2">All plans include free setup and 14-day trial.</p>
          </div>

          {/* Mobile: cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:hidden mb-8">
            {pbxPlans.map((p) => (
              <div key={p.name} className={`card ${p.highlight ? 'border-cyan-400/50' : ''}`}>
                <div className="text-cyan-400 font-semibold text-sm mb-1">{p.name}</div>
                <div className="text-2xl font-bold text-white">${p.price}<span className="text-sm text-gray-400">/mo</span></div>
                <Link href="/contact" className="btn-primary mt-4 justify-center text-sm w-full">{p.cta}</Link>
              </div>
            ))}
          </div>

          {/* Desktop: comparison table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-4 px-4 text-sm text-gray-400 font-medium w-48">Feature</th>
                  {pbxPlans.map((p) => (
                    <th key={p.name} className="py-4 px-4 text-center">
                      <div className={`rounded-xl p-4 ${p.highlight ? 'bg-gradient-to-b from-blue-600/20 to-cyan-400/10 border border-cyan-400/30' : 'bg-brand-card border border-brand-border'}`}>
                        <div className="text-sm text-cyan-400 font-semibold">{p.name}</div>
                        <div className="text-2xl font-bold text-white mt-1">${p.price}<span className="text-sm text-gray-400 font-normal">/mo</span></div>
                        <Link href="/contact" className={`mt-3 text-xs py-1.5 px-3 rounded-lg font-medium block text-center transition-all ${p.highlight ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' : 'border border-brand-border text-gray-300 hover:text-white hover:border-cyan-400/50'}`}>
                          {p.cta}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pbxFeatures.map(([feature, ...vals]) => (
                  <tr key={feature} className="border-t border-brand-border/50">
                    <td className="py-3 px-4 text-sm text-gray-400">{feature}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="py-3 px-4 text-center text-sm">
                        {v === '✓' ? <CheckCircle className="w-4 h-4 text-cyan-400 mx-auto" /> :
                         v === '—' ? <span className="text-gray-600">—</span> :
                         <span className="text-white font-medium">{v}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white">Add-ons & DID Numbers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { item: 'Additional DID Number', price: 'from $5/mo' },
              { item: 'Toll-Free Number', price: 'from $10/mo' },
              { item: 'Additional Extension', price: '$3/mo each' },
              { item: 'Call Recording Storage', price: '$0.002/min' },
              { item: 'SMS (per message)', price: '$0.01/SMS' },
              { item: 'AI Agent SIP Trunk', price: 'from $0.006/min' },
            ].map((a) => (
              <div key={a.item} className="card flex items-center justify-between">
                <span className="text-sm text-gray-300">{a.item}</span>
                <span className="text-sm font-semibold text-cyan-400">{a.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-brand-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-label mx-auto"><HelpCircle className="w-3 h-3" /> FAQ</div>
            <h2 className="text-2xl font-bold text-white mt-2">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="card">
                <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
          <p className="text-gray-400 mb-8">Our sales team responds within 2 hours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary px-8 py-4">Talk to Sales <ArrowRight className="w-4 h-4" /></Link>
            <a href="mailto:sales@voxclouds.com" className="btn-secondary px-8 py-4">sales@voxclouds.com</a>
          </div>
        </div>
      </section>
    </>
  )
}
