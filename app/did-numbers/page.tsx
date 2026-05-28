import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'DID Virtual Phone Numbers — Local Presence Worldwide',
  description: 'Virtual DID phone numbers in UAE, UK, USA, Nigeria, Kenya, Saudi Arabia and 50+ countries. Local presence from $5/month. Instant activation.',
}

const countries = [
  { flag: '🇦🇪', name: 'United Arab Emirates', code: '+971', from: '$8/mo', popular: true },
  { flag: '🇬🇧', name: 'United Kingdom', code: '+44', from: '$5/mo', popular: true },
  { flag: '🇺🇸', name: 'United States', code: '+1', from: '$5/mo', popular: true },
  { flag: '🇳🇬', name: 'Nigeria', code: '+234', from: '$10/mo', popular: true },
  { flag: '🇰🇪', name: 'Kenya', code: '+254', from: '$8/mo', popular: true },
  { flag: '🇸🇦', name: 'Saudi Arabia', code: '+966', from: '$12/mo', popular: true },
  { flag: '🇬🇭', name: 'Ghana', code: '+233', from: '$8/mo', popular: false },
  { flag: '🇵🇰', name: 'Pakistan', code: '+92', from: '$7/mo', popular: false },
  { flag: '🇪🇬', name: 'Egypt', code: '+20', from: '$9/mo', popular: false },
  { flag: '🇿🇦', name: 'South Africa', code: '+27', from: '$7/mo', popular: false },
  { flag: '🇩🇪', name: 'Germany', code: '+49', from: '$5/mo', popular: false },
  { flag: '🇫🇷', name: 'France', code: '+33', from: '$5/mo', popular: false },
]

const benefits = [
  'Instant number activation',
  'Forward to any SIP, mobile or landline',
  'SMS-capable numbers available',
  'Keep existing numbers (number porting)',
  'Call recording included',
  'Webhook/API integration',
  'Bulk number purchase',
  'Geographic & toll-free options',
]

export default function DIDNumbersPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="section-label">DID Numbers</div>
            <h1 className="text-5xl sm:text-6xl font-bold mt-4 mb-6">
              <span className="text-gradient">Local Numbers,</span>
              <br />
              <span className="text-white">Global Presence</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Get virtual phone numbers in 50+ countries. Look local everywhere — forward calls to your team anywhere in the world.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary text-base px-8 py-4">Browse Numbers <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/contact" className="btn-secondary text-base px-8 py-4">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing highlight */}
      <section className="py-10 bg-brand-navy border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { v: '50+', l: 'Countries' },
              { v: 'From $5', l: 'Per month' },
              { v: 'Instant', l: 'Activation' },
              { v: '99.9%', l: 'Availability' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-gradient-cyan">{s.v}</div>
                <div className="text-sm text-gray-400 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto">Available Countries</div>
            <h2 className="text-3xl font-bold text-white mt-2">Popular Destinations</h2>
            <p className="text-gray-400 mt-3">Over 50 countries available. Contact us for full list.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {countries.map((c) => (
              <div key={c.name} className={`card flex items-center justify-between hover:border-cyan-400/30 transition-all cursor-pointer group ${c.popular ? 'border-cyan-400/20' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.code}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-cyan-400">{c.from}</div>
                  {c.popular && <div className="text-xs text-gray-500">popular</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">+ 40 more countries available</p>
            <Link href="/contact" className="btn-secondary mt-4 inline-flex">Request Full List <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label">Features</div>
              <h2 className="text-3xl font-bold text-white mt-2 mb-4">More Than Just a Number</h2>
              <p className="text-gray-400 mb-8">Every DID includes routing, analytics, and API access at no extra cost.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-8">
              <h3 className="text-lg font-semibold text-white mb-6">Pricing by Type</h3>
              <div className="space-y-4">
                {[
                  { type: 'Local Geographic', price: 'From $5/mo', desc: 'City or regional number' },
                  { type: 'National (Non-Geographic)', price: 'From $7/mo', desc: 'Nationwide numbers' },
                  { type: 'Toll-Free', price: 'From $10/mo', desc: '800, 888, 0800 numbers' },
                  { type: 'Mobile (SMS-capable)', price: 'From $8/mo', desc: 'Receive SMS messages' },
                  { type: 'Bulk (10+)', price: 'Custom pricing', desc: 'Volume discounts apply' },
                ].map((item) => (
                  <div key={item.type} className="flex items-center justify-between py-3 border-b border-brand-border last:border-0">
                    <div>
                      <div className="text-sm font-medium text-white">{item.type}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                    <div className="text-sm font-semibold text-cyan-400">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Phone className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Get Your Number Today</h2>
          <p className="text-gray-400 mb-8">Instant activation. No contracts. Cancel anytime.</p>
          <Link href="/contact" className="btn-primary px-8 py-4 text-base">Browse Numbers <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </>
  )
}
