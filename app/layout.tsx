import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://ayrabot.fun'),
  title: 'Ayra — Discord Bot',
  description: 'Ayra brings moderation, member support, and everyday server tools together for Discord communities.',
  icons: { icon: '/bot-icon.png' },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1f5f2' },
    { media: '(prefers-color-scheme: dark)', color: '#05070a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try { const root = document.documentElement; if (localStorage.getItem('ayra-theme') === 'light') root.dataset.theme = 'light'; if (location.pathname === '/' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) { root.classList.add('home-loading'); const finish = () => window.setTimeout(() => root.classList.remove('home-loading'), 700); if (document.readyState === 'complete') finish(); else window.addEventListener('load', finish, { once: true }); window.setTimeout(() => root.classList.remove('home-loading'), 4000); } } catch {}" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Pacifico&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
