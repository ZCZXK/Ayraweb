import { NextRequest, NextResponse } from 'next/server'

const SUPPORT_HOST = 'support.ayrabot.fun'
const DISCORD_INVITE = 'https://discord.gg/GEPmvs57Yx'

export function proxy(request: NextRequest) {
  if (request.nextUrl.hostname.toLowerCase() === SUPPORT_HOST) {
    return NextResponse.redirect(DISCORD_INVITE, 302)
  }

  return NextResponse.next()
}
