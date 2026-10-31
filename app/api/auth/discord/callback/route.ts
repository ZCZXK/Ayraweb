import { NextRequest, NextResponse } from 'next/server'
import {
  createSessionToken,
  DISCORD_CALLBACK_URL,
  DISCORD_CLIENT_ID,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  STATE_COOKIE,
  verifyOAuthState,
} from '@/lib/auth'

export const dynamic = 'force-dynamic'

const OWNER_HOME = 'https://www.ayrabot.fun/admin/redirects'
const LOGIN_PAGE = 'https://www.ayrabot.fun/admin/login'

type TokenResponse = { access_token?: string; token_type?: string }
type DiscordUser = { id?: string }

function finish(url: string, clearState = true) {
  const response = NextResponse.redirect(url, 303)
  if (clearState) {
    response.cookies.set(STATE_COOKIE, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 0,
    })
  }
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const stateCookie = request.cookies.get(STATE_COOKIE)?.value
  const returnedState = params.get('state')

  if (params.get('iss') !== 'https://discord.com' || !verifyOAuthState(stateCookie, returnedState)) {
    return finish(`${LOGIN_PAGE}?error=invalid`)
  }
  if (params.has('error')) return finish(`${LOGIN_PAGE}?error=denied`)

  const code = params.get('code')
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  const ownerId = process.env.DISCORD_ADMIN_USER_ID
  if (!code || !clientSecret || !ownerId) return finish(`${LOGIN_PAGE}?error=unavailable`)

  try {
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_CALLBACK_URL,
      }),
      cache: 'no-store',
    })
    if (!tokenResponse.ok) return finish(`${LOGIN_PAGE}?error=exchange`)

    const tokens = await tokenResponse.json() as TokenResponse
    if (!tokens.access_token || tokens.token_type?.toLowerCase() !== 'bearer') {
      return finish(`${LOGIN_PAGE}?error=exchange`)
    }

    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokens.access_token}`, Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!userResponse.ok) return finish(`${LOGIN_PAGE}?error=identity`)

    const user = await userResponse.json() as DiscordUser
    if (!user.id || user.id !== ownerId) return finish(`${LOGIN_PAGE}?error=unauthorized`)

    const response = finish(OWNER_HOME)
    response.cookies.set(SESSION_COOKIE, createSessionToken(user.id), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    })
    return response
  } catch {
    return finish(`${LOGIN_PAGE}?error=unavailable`)
  }
}
