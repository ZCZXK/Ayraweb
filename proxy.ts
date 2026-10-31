import { NextRequest, NextResponse } from 'next/server'
import { getRedirectLinkByHost } from './lib/redirect-links'

const PREVIEW_CRAWLER = /discordbot|whatsapp|facebookexternalhit|facebot|twitterbot|slackbot|telegrambot|linkedinbot|skypeuripreview/i

export function proxy(request: NextRequest) {
  const link = getRedirectLinkByHost(request.nextUrl.hostname)

  if (link) {
    const userAgent = request.headers.get('user-agent') ?? ''

    if (request.method === 'GET' && PREVIEW_CRAWLER.test(userAgent)) {
      const forwardedHeaders = new Headers(request.headers)
      forwardedHeaders.set(
        'x-ayra-share-url',
        `https://${link.hostname}${request.nextUrl.pathname}`,
      )

      return NextResponse.rewrite(
        new URL(`/share/${link.slug}`, request.url),
        { request: { headers: forwardedHeaders } },
      )
    }

    return NextResponse.redirect(link.destination, 302)
  }

  return NextResponse.next()
}
