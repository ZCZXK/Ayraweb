import { NextRequest, NextResponse } from 'next/server'
import { getRedirectLinkByHost } from './lib/redirect-links'

const PREVIEW_CRAWLER = /discordbot|whatsapp|facebookexternalhit|facebot|twitterbot|slackbot|telegrambot|linkedinbot|skypeuripreview/i
const RESERVED_SUBDOMAINS = new Set([
  'admin', 'api', 'assets', 'cdn', 'contact', 'favicon', 'ftp', 'go', 'mail', 'privacy',
  'robots', 'share', 'sitemap', 'snicker', 'smtp', 'status', 'subdomain', 'support', 'terms', 'www',
])
const DOMAIN_SUFFIX = '.ayrabot.fun'
const VALID_ALIAS = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isPreviewCrawler(request: NextRequest) {
  return request.method === 'GET' && PREVIEW_CRAWLER.test(request.headers.get('user-agent') ?? '')
}

function rewriteToShare(request: NextRequest, slug: string, shareUrl: string) {
  const forwardedHeaders = new Headers(request.headers)
  forwardedHeaders.set('x-ayra-share-url', shareUrl)
  return NextResponse.rewrite(
    new URL(`/share/${encodeURIComponent(slug)}`, request.url),
    { request: { headers: forwardedHeaders } },
  )
}

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase()
  const isCrawler = isPreviewCrawler(request)
  const legacyLink = getRedirectLinkByHost(hostname)

  if (legacyLink) {
    if (isCrawler) {
      const shareUrl = `https://${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`
      return rewriteToShare(request, legacyLink.slug, shareUrl)
    }
    return NextResponse.redirect(legacyLink.destination, 302)
  }

  if (hostname === 'www.ayrabot.fun' && request.nextUrl.pathname.startsWith('/go/')) {
    const slug = request.nextUrl.pathname.split('/')[2] ?? ''
    if (isCrawler && VALID_ALIAS.test(slug)) {
      const shareUrl = `https://${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`
      return rewriteToShare(request, slug, shareUrl)
    }
    return NextResponse.next()
  }

  if (hostname.endsWith(DOMAIN_SUFFIX) && hostname !== `ayrabot.fun`) {
    const slug = hostname.slice(0, -DOMAIN_SUFFIX.length)
    if (
      slug &&
      !slug.includes('.') &&
      !RESERVED_SUBDOMAINS.has(slug) &&
      VALID_ALIAS.test(slug)
    ) {
      if (isCrawler) {
        const shareUrl = `https://${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`
        return rewriteToShare(request, slug, shareUrl)
      }

      return NextResponse.rewrite(
        new URL(`/api/resolve/subdomain/${encodeURIComponent(slug)}`, request.url),
      )
    }
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate')
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
    return response
  }

  return NextResponse.next()
}
