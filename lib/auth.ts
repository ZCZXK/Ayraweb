import { betterAuth } from 'better-auth'
import { createPool } from '@/lib/db'

export function createAuth() {
  const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
  const extraTrustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? []

  return betterAuth({
    database: createPool(),
    baseURL,
    secret: process.env.BETTER_AUTH_SECRET,
    socialProviders: {
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      },
    },
    trustedOrigins: [...new Set([baseURL, 'http://localhost:3000', ...extraTrustedOrigins])],
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    ...(process.env.NODE_ENV === 'development'
      ? { advanced: { defaultCookieAttributes: { sameSite: 'none' as const, secure: true } } }
      : {}),
  })
}
