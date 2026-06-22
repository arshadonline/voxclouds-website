import type { Metadata, Viewport } from 'next'
import './globals.css'
import ChatWidgetLoader from '@/components/ChatWidgetLoader'

export const metadata: Metadata = {
  title: 'VoxClouds',
  description: 'International VoIP Platform',
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'VoxClouds',
  },
}
export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1,
  themeColor: '#060c1a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-334491476" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-334491476');
          gtag('config', 'G-HE1VG6RKXM');
        `}} />
      </head>
      <body className="min-h-screen bg-navy-950 text-slate-100 antialiased">
        {children}
        <ChatWidgetLoader />
      </body>
    </html>
  )
}
