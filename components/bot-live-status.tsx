'use client'

import { useEffect, useState } from 'react'

type DisplayStatus = 'online' | 'offline' | 'connecting' | 'unavailable'
type BotStats = { status: DisplayStatus; guildCount: number | null; memberCount: number | null }

const INITIAL_STATE: BotStats = { status: 'connecting', guildCount: null, memberCount: null }
const POLL_INTERVAL = 60_000

function isBotStats(value: unknown): value is {
  status: 'online' | 'offline' | 'starting' | 'unavailable'
  guildCount: number | null
  memberCount: number | null
} {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  const candidate = value as Record<string, unknown>
  const validStatus = candidate.status === 'online'
    || candidate.status === 'offline'
    || candidate.status === 'starting'
    || candidate.status === 'unavailable'
  const validCount = (count: unknown) => count === null
    || (typeof count === 'number' && Number.isSafeInteger(count) && count >= 0)

  return validStatus && validCount(candidate.guildCount) && validCount(candidate.memberCount)
}

function statusLabel(status: DisplayStatus) {
  if (status === 'online') return 'Online'
  if (status === 'offline') return 'Offline'
  if (status === 'connecting') return 'Connecting'
  return 'Unavailable'
}

export function BotLiveStatus() {
  const [stats, setStats] = useState<BotStats>(INITIAL_STATE)

  useEffect(() => {
    let active = true
    let timeoutId: ReturnType<typeof setTimeout>
    let controller: AbortController | undefined

    const refresh = async () => {
      controller = new AbortController()

      try {
        const response = await fetch('/api/bot-stats', {
          cache: 'no-store',
          signal: controller.signal,
        })
        const payload: unknown = response.ok ? await response.json() : null

        if (!active) return
        if (!isBotStats(payload)) {
          setStats({ status: 'unavailable', guildCount: null, memberCount: null })
        } else {
          setStats({
            status: payload.status === 'starting' ? 'connecting' : payload.status,
            guildCount: payload.guildCount,
            memberCount: payload.memberCount,
          })
        }
      } catch {
        if (active) setStats({ status: 'unavailable', guildCount: null, memberCount: null })
      } finally {
        if (active) timeoutId = setTimeout(refresh, POLL_INTERVAL)
      }
    }

    void refresh()

    return () => {
      active = false
      clearTimeout(timeoutId)
      controller?.abort()
    }
  }, [])

  const statusText = statusLabel(stats.status)

  return (
    <section className="bot-live-status" aria-label="Ayra live status">
      <div className="bot-live-status__heading">
        <span className="bot-live-status__eyebrow">Live bot status</span>
        <span className={`bot-live-status__indicator bot-live-status__indicator--${stats.status}`} aria-hidden="true" />
      </div>
      <div className="bot-live-status__details" role="status" aria-live="polite" aria-atomic="true">
        <span className="bot-live-status__state">{statusText}</span>
        <span className="bot-live-status__divider" aria-hidden="true" />
        <span className="bot-live-status__count">
          {stats.guildCount === null
            ? 'Server count unavailable'
            : `${stats.guildCount.toLocaleString()} Discord ${stats.guildCount === 1 ? 'server' : 'servers'}`}
        </span>
        <span className="bot-live-status__divider" aria-hidden="true" />
        <span
          className="bot-live-status__count"
          title={stats.memberCount === null ? undefined : 'Summed across servers; not unique people.'}
          aria-label={stats.memberCount === null
            ? 'Member count unavailable'
            : `${stats.memberCount.toLocaleString()} members, summed across servers and not unique people`}
        >
          {stats.memberCount === null
            ? 'Members unavailable'
            : `${stats.memberCount.toLocaleString()} members`}
        </span>
      </div>
    </section>
  )
}
