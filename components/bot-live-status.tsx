'use client'

import { useEffect, useState } from 'react'

type DisplayStatus = 'online' | 'offline' | 'connecting' | 'unavailable'
type BotStats = {
  status: DisplayStatus
  guildCount: number | null
  memberCount: number | null
}

const INITIAL_STATE: BotStats = { status: 'connecting', guildCount: null, memberCount: null }
const POLL_INTERVAL = 15_000
const DEMO_PING_VALUES = ['23ms', '27ms', '35ms', '30ms'] as const
const DEMO_PING_INTERVAL = 1_800

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

  return validStatus
    && validCount(candidate.guildCount)
    && validCount(candidate.memberCount)
}

function statusLabel(status: DisplayStatus) {
  if (status === 'online') return 'Online'
  if (status === 'offline') return 'Offline'
  if (status === 'connecting') return 'Connecting'
  return 'Unavailable'
}

export function BotLiveStatus() {
  const [stats, setStats] = useState<BotStats>(INITIAL_STATE)
  const [demoPingIndex, setDemoPingIndex] = useState(0)

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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDemoPingIndex((current) => (current + 1) % DEMO_PING_VALUES.length)
    }, DEMO_PING_INTERVAL)
    return () => window.clearInterval(timer)
  }, [])

  const statusText = statusLabel(stats.status)
  const memberValue = stats.memberCount === null ? '—' : stats.memberCount.toLocaleString()
  const demoPingValue = DEMO_PING_VALUES[demoPingIndex]

  return (
    <section className={`bot-live-status bot-live-status--${stats.status}`} aria-label="Ayra live bot statistics">
      <div className="bot-live-status__heading">
        <div className="bot-live-status__heading-copy">
          <span className="bot-live-status__eyebrow">AYRA · LIVE STATUS</span>
          <span className="bot-live-status__caption">Bot health at a glance</span>
        </div>
        <span className="bot-live-status__live-badge">
          <span className="bot-live-status__indicator" aria-hidden="true" />
          Live
        </span>
      </div>

      <div className="bot-live-status__metrics" role="status" aria-live="polite" aria-atomic="true">
        <div className="bot-live-status__metric bot-live-status__metric--status">
          <span className="bot-live-status__label">Status</span>
          <span className="bot-live-status__value">{statusText}</span>
        </div>
        <div className="bot-live-status__metric">
          <span className="bot-live-status__label">Servers</span>
          <span className="bot-live-status__value">
            {stats.guildCount === null ? '—' : stats.guildCount.toLocaleString()}
          </span>
        </div>
        <div
          className="bot-live-status__metric"
          title={stats.memberCount === null ? undefined : 'Summed across servers; not unique people.'}
          aria-label={stats.memberCount === null
            ? 'Members unavailable'
            : `${memberValue} members, summed across servers and not unique people`}
        >
          <span className="bot-live-status__label">Members</span>
          <span className="bot-live-status__value">{memberValue}</span>
        </div>
        <div
          className="bot-live-status__metric bot-live-status__metric--ping"
          title="Rotating sample text only; this is not a measured Discord or bot latency."
          aria-label="Demo ping. Rotating sample numbers, not a live latency measurement."
        >
          <span className="bot-live-status__label">Demo ping</span>
          <span className="bot-live-status__value" aria-hidden="true">{demoPingValue}</span>
        </div>
      </div>
    </section>
  )
}
