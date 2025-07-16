import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VaultSync24 - Secure File Sharing',
  description: 'Secure file sharing with 24-hour temporary links. Upload files and share them safely with automatic expiration.',
  keywords: 'file sharing, secure upload, temporary links, file transfer, cloud storage',
  authors: [{ name: 'VaultSync24 Team' }],
  creator: 'VaultSync24',
  publisher: 'VaultSync24',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vaultsync24.vercel.app'),
  openGraph: {
    title: 'VaultSync24 - Secure File Sharing',
    description: 'Secure file sharing with 24-hour temporary links',
    url: 'https://vaultsync24.vercel.app',
    siteName: 'VaultSync24',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VaultSync24 - Secure File Sharing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VaultSync24 - Secure File Sharing',
    description: 'Secure file sharing with 24-hour temporary links',
    images: ['/og-image.png'],
    creator: '@vaultsync24',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VaultSync24" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  )
}