import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://voxclouds.com'),
  title: {
    default: 'VoxClouds — AI-Powered Voice Infrastructure for Global Business',
    template: '%s | VoxClouds',
  },
  description: 'Wholesale VoIP routes, Hosted PBX, Virtual DID numbers, and AI voice agents. Connecting Africa, Middle East and the world with enterprise-grade voice infrastructure.',
  keywords: ['wholesale VoIP', 'SIP trunking', 'hosted PBX', 'DID numbers', 'AI voice agents', 'VoIP Africa', 'VoIP Middle East', 'voice infrastructure'],
  authors: [{ name: 'VoxClouds' }],
  creator: 'VoxClouds',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://voxclouds.com',
    siteName: 'VoxClouds',
    title: 'VoxClouds — AI-Powered Voice Infrastructure',
    description: 'Enterprise wholesale VoIP, Hosted PBX, DID numbers and AI voice agents for global business.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoxClouds — AI-Powered Voice Infrastructure',
    description: 'Enterprise wholesale VoIP, Hosted PBX, DID numbers and AI voice agents.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'VoxClouds',
              url: 'https://voxclouds.com',
              logo: 'https://voxclouds.com/logo.svg',
              description: 'AI-Powered Voice Infrastructure for Global Business',
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'sales@voxclouds.com',
                contactType: 'sales',
              },
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="bg-brand-dark text-white antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
