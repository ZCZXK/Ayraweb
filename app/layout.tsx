import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ayraweb — Coming Soon',
  description: 'Something beautiful is coming. Stay for a song while Ayraweb takes shape.',
  icons: { icon: '/icon.svg' },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#100d0c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
