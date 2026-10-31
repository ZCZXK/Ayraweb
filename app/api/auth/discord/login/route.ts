import { NextResponse } from 'next/server'
import {
  createOAuthState,
  DISCORD_CALLBACK_URL,
  DISCORD_CLIENT_ID,
  STATE_COOKIE,
  STATE_MAX_AGE_SECONDS,
} from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { state, cookieValue } = createOAuthState()
  const authorizeUrl = new URL('https://discord.com/oauth2/authorize')
  authorizeUrl.searchParams.set('client_id', DISCORD_CLIENT_ID)
  authorizeUrl.searchParams.set('redirect_uri', DISCORD_CALLBACK_URL)
  authorizeUrl.searchParams.set('response_type', 'code')
  authorizeUrl.searchParams.set('scope', 'identify')
  authorizeUrl.searchParams.set('state', state)

  const response = NextResponse.redirect(authorizeUrl)
  response.cookies.set(STATE_COOKIE, cookieValue, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: STATE_MAX_AGE_SECONDS,
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}
