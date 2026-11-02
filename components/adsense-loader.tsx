'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

const ADSENSE_SCRIPT_URL =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9689577732033240'

export default function AdSenseLoader() {
  const pathname = usePathname()
  const isPrivateRoute =
    pathname === '/admin' ||
    pathname?.startsWith('/admin/') ||
    pathname === '/api' ||
    pathname?.startsWith('/api/')

  if (isPrivateRoute) return null

  return (
    <Script
      id="google-adsense"
      src={ADSENSE_SCRIPT_URL}
      async
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  )
}
