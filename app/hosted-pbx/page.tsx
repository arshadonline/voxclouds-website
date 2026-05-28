import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, PhoneCall, Users, Settings, BarChart3, Voicemail, GitBranch } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hosted IP PBX — Cloud Phone System',
  description: 'Full-featured cloud PBX for businesses. Extensions, IVR, call queues, voicemail, and analytics. From $29/month. Start free trial today.',
}

const features = [
  { icon: PhoneCall, title: 'SIP Extensions', desc: 'Connect any SIP phone, softphone or mobile app. Unlimited devices per user.' },
  { icon: GitBranch, title: 'IVR / Auto Attendant', desc: 'Multi-level IVR with text-to-speech and custom audio prompts.' },
  { icon: Users, title: 'Call Queues', desc: 'ACD queues with hold music, position announcements and overflow rules.' },
  { icon: Voicemail, title: 'Voicemail to Email', desc: 'Receive voicemail recordings directly to your inbox as MP3 attachments.' },
  { icon: BarChart3, title: 'Live Analytics', desc: 'Real-time dashboards showing active calls, wait times and agent stats.' },
  { icon: Settings, title: 'Web Admin Panel', desc: 'Manage everything from a clean browser-based admin portal.' },
]

const plans = [
  { name: 'Starter', price: 29, ext: 5, features: ['5 extensions', '1 DID number', 'IVR', 'Voicemail', 'Web portal'] },
  { name: 'Business', price: 79, ext: 20, features: ['20 extensions', '3 DID numbers', 'Call queues', 'Live stats', 'Priority support'], highlight: true },
  { name: 'Enterprise', price: 149, ext: 50, features: ['50 extensions', '10 DID numbers', 'Advanced IVR', 'API access', '24/7 support'] },
  { name: 'Call Center', price: 299, ext: 100, features: ['100 extensions', 'Unlimited DIDs', 'Wallboard', 'CRM integration', 'Dedicated NOC'] },
]

const useCases = [
  { title: 'Real Estate', desc: 'Route leads to agents, record calls, manage multiple offices under one system.' },
  { title: 'Medical Clinics', desc: 'HIPAA-friendly call handling, appointment reminders, on-call routing.' },
  { title: 'Call Centers', desc: 'Agent queues, supervisor monitoring, real-time wallboards and SLA tracking.' },
  { title: 'Remote Teams', desc: 'Connect staff across countries on one phone system with no hardware.' },
]

export default function HostedPBXPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="section-label">Hosted PBX</div>
            <h1 className="text-5xl sm:text-6xl font-bold mt-4 mb-6">
              <span className="text-gradient">Enterprise PBX</span>
              <br />
              <span className="text-white">in the Cloud</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              A full-featured business phone system with no hardware required. Extensions, IVR, queues, analytics — all managed from your browser.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary text-base px-8 py-4">Start Free Trial <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/pricing" className="btn-secondary text-base px-8 py-4">See Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto">Features</div>
            <h2 className="text-3xl font-bold text-white mt-2">Everything Your Business Needs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:border-cyan-400/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-400/20 border border-cyan-400/20 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto">Pricing</div>
            <h2 className="text-3xl font-bold text-white mt-2">Plans for Every Business Size</h2>
            <p className="text-gray-400 mt-3">All plans include free setup. Upgrade or downgrade anytime.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`card relative flex flex-col ${plan.highlight ? 'border-cyan-400/50 shadow-cyan' : ''}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-xs font-semibold text-white whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <div className="text-cyan-400 font-semibold text-sm mb-1">{plan.name}</div>
                  <div className="text-3xl font-bold text-white">${plan.price}<span className="text-sm text-gray-400 font-normal">/mo</span></div>
                  <div className="text-xs text-gray-500 mt-1">Up to {plan.ext} extensions</div>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`text-sm text-center py-2.5 px-4 rounded-lg font-medium transition-all ${plan.highlight ? 'btn-primary justify-center' : 'btn-secondary justify-center'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto">Use Cases</div>
            <h2 className="text-3xl font-bold text-white mt-2">Built for Your Industry</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((u) => (
              <div key={u.title} className="card text-center">
                <h3 className="font-semibold text-white mb-2">{u.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-navy">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Start your free 14-day trial</h2>
          <p className="text-gray-400 mb-8">No credit card required. Full features. Setup in under 5 minutes.</p>
          <Link href="/contact" className="btn-primary px-8 py-4 text-base">Start Free Trial <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </>
  )
}
