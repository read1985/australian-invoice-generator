import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Free Australian Invoice Generator — ATO Compliant Tax Invoices',
  description: 'Create professional, ATO-compliant tax invoices for your Australian business. Free invoice generator with GST calculation, ABN validation, and instant PDF download.',
  keywords: 'Australian invoice, tax invoice, ATO compliant, ABN, GST, invoice generator, Australia',
  openGraph: {
    title: 'Invoicely - Free Australian Tax Invoice Generator',
    description: 'Create professional, ATO-compliant tax invoices for your Australian business. Free invoice generator with GST calculation, ABN validation, and instant PDF download.',
    url: 'https://aussie-invoices.vercel.app',
    siteName: 'Invoicely',
    locale: 'en_AU',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}