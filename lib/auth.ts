import 'server-only'

import { createHmac, hkdfSync, randomBytes, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const DISCORD_CLIENT_ID = '1489882067239047168'
export const DISCORD_CALLBACK_URL = 'https://ayrabot.fun/api/auth/discord/callback'
export const SESSION_COOKIE = '__Host-ayra-manager-session'
export const STATE_COOKIE = '__Host-ayra-manager-state'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
export const STATE_MAX_AGE_SECONDS = 60 * 10

const AUTH_KEY_SALT = Buffer.from('ayrabot.fun/redirect-manager/v1', 'utf8')

function deriveKey(purpose: 'session' | 'oauth-state') {
  const secret = process.env.DISCORD_CLIENT_SECRET
  if (!secret) throw new Error('Discord OAuth is not configured')

  return Buffer.from(
    hkdfSync(
      'sha256',
      Buffer.from(secret, 'utf8'),
      AUTH_KEY_SALT,
      Buffer.from(`ayra:${purpose}`, 'utf8'),
      32,
    ),
  )
}

function sign(value: string, purpose: 'session' | 'oauth-state') {
  return createHmac('sha256', deriveKey(purpose)).update(value).digest('base64url')
}

function constantTimeEqual(left: string, right: string) {
  const leftBytes = Buffer.from(left)
  const rightBytes = Buffer.from(right)
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes)
}

export function createOAuthState() {
  const state = randomBytes(32).toString('base64url')
  return { state, cookieValue: `${state}.${sign(state, 'oauth-state')}` }
}

export function verifyOAuthState(cookieValue: string | undefined, returnedState: string | null) {
  if (!cookieValue || !returnedState) return false
  const separator = cookieValue.lastIndexOf('.')
  if (separator < 1) return false

  const state = cookieValue.slice(0, separator)
  const signature = cookieValue.slice(separator + 1)
  return state === returnedState && constantTimeEqual(signature, sign(state, 'oauth-state'))
}

export function createSessionToken(userId: string) {
  if (!process.env.DISCORD_ADMIN_USER_ID || userId !== process.env.DISCORD_ADMIN_USER_ID) {
    throw new Error('This Discord account is not authorized')
  }

  const payload = Buffer.from(JSON.stringify({
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  })).toString('base64url')

  return `${payload}.${sign(payload, 'session')}`
}

export function verifySessionToken(token: string | undefined) {
  if (!token || !process.env.DISCORD_ADMIN_USER_ID) return null
  const separator = token.lastIndexOf('.')
  if (separator < 1) return null

  const payload = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  if (!constantTimeEqual(signature, sign(payload, 'session'))) return null

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      sub?: unknown
      exp?: unknown
    }
    if (
      decoded.sub !== process.env.DISCORD_ADMIN_USER_ID ||
      typeof decoded.exp !== 'number' ||
      decoded.exp <= Math.floor(Date.now() / 1000)
    ) return null

    return { userId: decoded.sub, expiresAt: decoded.exp }
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}

export function hasSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false

  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}
