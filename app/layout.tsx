import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ayra — Discord Bot',
  description: 'Ayra brings moderation, member support, and everyday server tools together for Discord communities.',
  icons: { icon: '/bot-icon.png' },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#05070a',
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
