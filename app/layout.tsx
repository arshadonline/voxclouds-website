import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-HE1VG6RKXM" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HE1VG6RKXM');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-navy-950 text-slate-100 antialiased">
        {children}
        <ChatWidgetLoader />
      </body>
    </html>
  )
}
