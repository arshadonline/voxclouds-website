import Link from 'next/link'
import { Zap, Mail, MessageCircle, Globe } from 'lucide-react'

const links = {
  Solutions: [
    { name: 'Wholesale Routes', href: '/wholesale' },
    { name: 'Hosted PBX', href: '/hosted-pbx' },
    { name: 'DID Numbers', href: '/did-numbers' },
    { name: 'AI Voice Agents', href: '/ai-voice' },
  ],
  Company: [
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Client Portal', href: 'https://billing.voxclouds.com' },
    { name: 'PBX Portal', href: 'https://pbx.voxclouds.com' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'AUP', href: '#' },
    { name: 'SLA', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-navy mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">Vox<span className="text-cyan-400">Clouds</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mb-6">
              AI-Powered Voice Infrastructure for Global Business. Connecting Africa, Middle East and the world with enterprise-grade VoIP.
            </p>
            <div className="flex flex-col gap-3">
              <a href="mailto:sales@voxclouds.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                <Mail className="w-4 h-4" /> sales@voxclouds.com
              </a>
              <a href="https://wa.me/message/voxclouds" className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp Sales
              </a>
              <span className="flex items-center gap-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" /> 150+ Countries Covered
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{group}</h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2024 VoxClouds. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span className="glow-dot" />
            <span className="text-xs text-gray-500 ml-2">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
