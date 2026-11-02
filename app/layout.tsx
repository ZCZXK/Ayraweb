import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import AdSenseLoader from '../components/adsense-loader'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ayrabot.fun'),
  title: 'Ayra — Discord Bot',
  description: 'Ayra is a Discord bot for moderation, AutoMod and anti-nuke protection, support tickets, invite tracking, giveaways, polls, member tools, and server utilities.',
  icons: { icon: '/ayra-favicon.png', shortcut: '/ayra-favicon.png', apple: '/ayra-favicon.png' },
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
        <script dangerouslySetInnerHTML={{ __html: "try { const root = document.documentElement; if (localStorage.getItem('ayra-theme') === 'light') root.dataset.theme = 'light'; if (location.pathname === '/' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) { root.classList.add('home-loading'); const finish = () => root.classList.remove('home-loading'); if (document.readyState === 'complete') finish(); else window.addEventListener('load', finish, { once: true }); window.setTimeout(finish, 3000); } } catch {}" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Kaushan+Script&family=Manrope:wght@400;500;600;700;800&family=Pacifico&display=swap" rel="stylesheet" />
        <AdSenseLoader />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
