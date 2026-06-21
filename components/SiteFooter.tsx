import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">VoxClouds</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Cloud business phone system and international VoIP platform. Trusted by businesses worldwide.
            </p>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-slate-200 mb-3">Solutions</p>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/cloud-pbx" className="hover:text-white transition-colors">Cloud PBX</Link></li>
              <li><Link href="/virtual-numbers" className="hover:text-white transition-colors">Virtual Numbers</Link></li>
              <li><Link href="/wholesale-voip" className="hover:text-white transition-colors">Wholesale Routes</Link></li>
              <li><Link href="/international-calling" className="hover:text-white transition-colors">International Calling</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-slate-200 mb-3">Company</p>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><a href="mailto:sales@voxclouds.com" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-slate-200 mb-3">Contact Us</p>
            <p className="text-slate-400 mb-3">Enterprise voice solutions for your business.</p>
            <a href="https://wa.me/14158437100" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              +1 (415) 843-7100 — WhatsApp
            </a>
            <p className="text-slate-500 text-xs mt-1">Drop a WhatsApp message for instant reply</p>
            <a href="mailto:sales@voxclouds.com" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mt-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              sales@voxclouds.com
            </a>
            <a href="tel:+14158437100" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mt-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +1 (415) 843-7100
            </a>
            <p className="mt-4 text-slate-500 text-xs">
              Serving businesses in Pakistan, UAE, Saudi Arabia, Nigeria, Kenya, South Africa, India, Egypt, and 140+ more countries.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} VoxClouds. All rights reserved.</p>
          <p>Cloud PBX &bull; Virtual Numbers &bull; Wholesale VoIP &bull; International Calling</p>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-4 max-w-3xl mx-auto leading-relaxed">
          All rates, plans, and features are subject to change without prior notice. Services are provided under a fair use policy. Prepaid balances are non-refundable. Service availability may vary by region. By using VoxClouds you agree to our terms of service.
        </p>
      </div>
    </footer>
  )
}
