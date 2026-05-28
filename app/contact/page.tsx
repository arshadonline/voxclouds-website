import type { Metadata } from 'next'
import { Mail, MessageCircle, Clock, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us — VoxClouds Sales & Support',
  description: 'Get in touch with VoxClouds. Sales inquiries, technical support, and partnership opportunities. Response within 2 hours.',
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'VoxClouds Contact',
      description: 'Contact VoxClouds for sales and support',
      url: 'https://voxclouds.com/contact',
    }),
  },
}

const contactInfo = [
  { icon: Mail, title: 'Email Sales', value: 'sales@voxclouds.com', href: 'mailto:sales@voxclouds.com', desc: 'For pricing and new accounts' },
  { icon: MessageCircle, title: 'WhatsApp', value: 'Chat on WhatsApp', href: 'https://wa.me/message/voxclouds', desc: 'Quick replies, business hours' },
  { icon: Clock, title: 'Response Time', value: 'Within 2 hours', href: null, desc: 'Business days, 9am–6pm UTC' },
  { icon: Globe, title: 'Coverage', value: '150+ Countries', href: null, desc: 'Africa, Middle East & worldwide' },
]

const services = [
  'Wholesale A-Z Routes',
  'Hosted PBX',
  'DID Numbers',
  'AI Voice Agent SIP',
  'Custom/Enterprise',
  'Technical Support',
]

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-label mx-auto">Contact Us</div>
          <h1 className="text-5xl font-bold mt-4 mb-4">
            <span className="text-gradient">Let&apos;s Talk</span>
          </h1>
          <p className="text-xl text-gray-400">Our team responds within 2 hours on business days.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact form */}
            <div className="card p-8">
              <h2 className="text-xl font-bold text-white mb-6">Send us a message</h2>
              {/* Static form - works via Formspree or similar on Cloudflare Pages */}
              <form action="https://formspree.io/f/voxclouds" method="POST" className="space-y-5">
                <input type="hidden" name="_subject" value="New VoxClouds inquiry" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name *</label>
                    <input type="text" name="name" required placeholder="John Smith"
                      className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Company</label>
                    <input type="text" name="company" placeholder="Acme Corp"
                      className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Email *</label>
                    <input type="email" name="email" required placeholder="john@company.com"
                      className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone / WhatsApp</label>
                    <input type="tel" name="phone" placeholder="+1 234 567 8900"
                      className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Service Interested In</label>
                  <select name="service"
                    className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-colors">
                    <option value="">Select a service...</option>
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Monthly Call Volume (approx)</label>
                  <select name="volume"
                    className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-colors">
                    <option value="">Select range...</option>
                    <option>Under 10,000 minutes/mo</option>
                    <option>10,000 – 100,000 minutes/mo</option>
                    <option>100,000 – 1M minutes/mo</option>
                    <option>1M+ minutes/mo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Message *</label>
                  <textarea name="message" required rows={4} placeholder="Tell us about your needs, destinations, volumes..."
                    className="w-full px-4 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
                  Send Message
                </button>
                <p className="text-xs text-gray-500 text-center">We typically respond within 2 business hours.</p>
              </form>
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Get in touch</h2>
                <p className="text-gray-400 text-sm">Whether you need wholesale rates, a hosted PBX, or SIP infrastructure for your AI agent — we're here to help.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((c) => (
                  <div key={c.title} className="card">
                    <c.icon className="w-6 h-6 text-cyan-400 mb-3" />
                    <div className="text-xs text-gray-500 mb-1">{c.title}</div>
                    {c.href ? (
                      <a href={c.href} className="text-sm font-medium text-white hover:text-cyan-400 transition-colors">{c.value}</a>
                    ) : (
                      <div className="text-sm font-medium text-white">{c.value}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">{c.desc}</div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a href="https://wa.me/message/voxclouds"
                className="flex items-center gap-4 p-5 rounded-2xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors">Chat on WhatsApp</div>
                  <div className="text-xs text-gray-400">Fastest way to reach our sales team</div>
                </div>
              </a>

              {/* What to expect */}
              <div className="card">
                <h3 className="text-sm font-semibold text-white mb-4">What happens after you submit?</h3>
                <ul className="space-y-3">
                  {[
                    'Our team reviews your requirements',
                    'We send a custom rate sheet within 2 hours',
                    'Free test account setup if needed',
                    'Onboarding call to get you connected',
                  ].map((s, i) => (
                    <li key={s} className="flex items-start gap-3 text-sm text-gray-400">
                      <span className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
