import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BOT_STATS_URL = 'https://ayra-production-8db1.up.railway.app/api/stats'
const UNAVAILABLE = { status: 'unavailable', guildCount: null } as const

function json(body: typeof UNAVAILABLE | { status: 'online' | 'offline' | 'starting'; guildCount: number | null }) {
  return NextResponse.json(body, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  })
}

function isBotStats(value: unknown): value is { status: 'online' | 'offline' | 'starting'; guildCount: number | null } {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  const candidate = value as Record<string, unknown>
  const validStatus = candidate.status === 'online' || candidate.status === 'offline' || candidate.status === 'starting'
  const validGuildCount = candidate.guildCount === null
    || (typeof candidate.guildCount === 'number' && Number.isInteger(candidate.guildCount) && candidate.guildCount >= 0)

  return validStatus && validGuildCount
}

export async function GET() {
  try {
    const response = await fetch(BOT_STATS_URL, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4_000),
    })

    if (!response.ok) return json(UNAVAILABLE)

    const payload: unknown = await response.json()
    if (!isBotStats(payload)) return json(UNAVAILABLE)
    return json({ status: payload.status, guildCount: payload.guildCount })
  } catch {
    return json(UNAVAILABLE)
  }
}
