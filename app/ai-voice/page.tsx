import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Bot, Zap, Code2, Phone, Building2, ShoppingCart, Stethoscope } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Voice Agent SIP Infrastructure',
  description: 'SIP trunking optimized for AI voice agents. Compatible with Retell AI, VAPI, Bland.ai, ElevenLabs, Synthflow. Low latency, high reliability.',
}

const platforms = [
  { name: 'Retell AI', color: 'from-blue-500 to-purple-500' },
  { name: 'VAPI', color: 'from-cyan-500 to-blue-500' },
  { name: 'Bland.ai', color: 'from-purple-500 to-pink-500' },
  { name: 'ElevenLabs', color: 'from-orange-500 to-red-500' },
  { name: 'Synthflow', color: 'from-green-500 to-cyan-500' },
  { name: 'Custom LLM', color: 'from-gray-500 to-gray-600' },
]

const steps = [
  {
    num: '01',
    title: 'Connect',
    desc: 'Add VoxClouds as your SIP provider in your AI platform. Copy our SIP server address and credentials — takes 2 minutes.',
    icon: Code2,
  },
  {
    num: '02',
    title: 'Configure',
    desc: 'Set your inbound and outbound numbers, configure webhooks, and test with our built-in call simulator.',
    icon: Zap,
  },
  {
    num: '03',
    title: 'Scale',
    desc: 'Go from 1 concurrent call to 10,000 with zero infrastructure changes. We handle global routing automatically.',
    icon: ArrowRight,
  },
]

const useCases = [
  { icon: Building2, title: 'Real Estate', desc: 'AI agents qualify leads, schedule viewings, and answer property FAQs 24/7.' },
  { icon: Stethoscope, title: 'Dental & Medical', desc: 'Appointment booking, reminders, and pre-visit questionnaires fully automated.' },
  { icon: Phone, title: 'Call Centers', desc: 'AI handles tier-1 support, escalates complex issues to human agents seamlessly.' },
  { icon: ShoppingCart, title: 'E-commerce', desc: 'Order status, returns, and customer service handled by AI at any hour.' },
]

const specs = [
  { label: 'Latency', value: '< 50ms to AI platform' },
  { label: 'Codecs', value: 'PCMU, PCMA, G.722' },
  { label: 'DTMF', value: 'RFC 2833 & SIP INFO' },
  { label: 'Concurrent calls', value: 'Unlimited (elastic)' },
  { label: 'Call recording', value: 'S3-compatible storage' },
  { label: 'Webhooks', value: 'Real-time call events' },
  { label: 'API', value: 'REST + WebSocket' },
  { label: 'Protocol', value: 'SIP over UDP/TCP/TLS' },
]

export default function AIVoicePage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-cyan-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="section-label"><Bot className="w-3 h-3" /> AI Voice Infrastructure</div>
            <h1 className="text-5xl sm:text-6xl font-bold mt-4 mb-6">
              <span className="text-gradient">SIP Infrastructure</span>
              <br />
              <span className="text-white">for AI Voice Agents</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              The missing link between your AI platform and real phone calls. Ultra-low latency SIP trunks optimized for AI voice agents — globally.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary text-base px-8 py-4">Get API Keys <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/contact" className="btn-secondary text-base px-8 py-4"><Code2 className="w-4 h-4" /> View Docs</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-16 bg-brand-navy border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-wider font-medium">Compatible with all major AI voice platforms</p>
          <div className="flex flex-wrap justify-center gap-4">
            {platforms.map((p) => (
              <div key={p.name} className="card px-6 py-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${p.color}`} />
                <span className="text-sm font-medium text-white">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto">How It Works</div>
            <h2 className="text-3xl font-bold text-white mt-2">From API Key to Live Calls in Minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="relative">
                <div className="card p-8 h-full">
                  <div className="text-5xl font-bold text-brand-border mb-4">{step.num}</div>
                  <step.icon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical specs */}
      <section className="py-24 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label">Technical Specs</div>
              <h2 className="text-3xl font-bold text-white mt-2 mb-4">Built for Developers</h2>
              <p className="text-gray-400 mb-8">Every detail optimized for AI voice — from codec selection to webhook timing.</p>
              <div className="space-y-3">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-3 border-b border-brand-border">
                    <span className="text-sm text-gray-400">{s.label}</span>
                    <span className="text-sm font-medium text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="section-label">Why VoxClouds for AI</div>
              <h2 className="text-3xl font-bold text-white mt-2 mb-8">The Right SIP Provider for AI</h2>
              <ul className="space-y-4">
                {[
                  { title: 'Lowest latency for Africa & Middle East', desc: 'Regional PoPs ensure your AI agent sounds natural with minimal echo or delay.' },
                  { title: 'Elastic concurrency', desc: 'Scale from 1 to 10,000 simultaneous AI calls with zero pre-provisioning.' },
                  { title: 'Real-time call events', desc: 'Webhooks fire within 50ms for call start, DTMF, hangup and recording events.' },
                  { title: 'Cost-effective at scale', desc: 'Pay-per-minute pricing means your AI agent costs go up only when calls do.' },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto">Use Cases</div>
            <h2 className="text-3xl font-bold text-white mt-2">AI Agents Changing Every Industry</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((u) => (
              <div key={u.title} className="card text-center hover:border-cyan-400/30 transition-all">
                <u.icon className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">{u.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-navy">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Bot className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to connect your AI agent?</h2>
          <p className="text-gray-400 mb-8">Get SIP credentials in under 2 minutes. Test calls included free.</p>
          <Link href="/contact" className="btn-primary px-8 py-4 text-base">Get API Keys <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </>
  )
}
