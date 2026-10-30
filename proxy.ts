import { NextRequest, NextResponse } from 'next/server'

const REDIRECTS: Record<string, string> = {
  'support.ayrabot.fun': 'https://discord.gg/GEPmvs57Yx',
  'snicker.ayrabot.fun': 'https://discord.gg/h9PA5Upekj',
}

export function proxy(request: NextRequest) {
  const destination = REDIRECTS[request.nextUrl.hostname.toLowerCase()]

  if (destination) {
    return NextResponse.redirect(destination, 302)
  }

  return NextResponse.next()
}
