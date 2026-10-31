type DiscordInvite = {
  guild?: {
    id?: string
    name?: string
    icon?: string | null
  }
  approximate_member_count?: number
  approximate_presence_count?: number
}

export type DiscordServerPreview = {
  name: string
  iconUrl: string
  guildId: string
  memberCount?: number
  onlineCount?: number
}

const FALLBACK_ICON = 'https://ayrabot.fun/bot-icon.png'
const INVITE_HOSTS = new Set(['discord.gg', 'discord.com', 'www.discord.com'])
const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function getDiscordInviteCode(destination: string) {
  try {
    const url = new URL(destination)
    if (url.protocol !== 'https:' || !INVITE_HOSTS.has(url.hostname.toLowerCase())) return null
    if (url.username || url.password || url.port) return null

    const segments = url.pathname.split('/').filter(Boolean)
    const code = url.hostname.toLowerCase() === 'discord.gg'
      ? segments[0]
      : segments[0] === 'invite'
        ? segments[1]
        : null

    return code && /^[A-Za-z0-9-]{2,64}$/.test(code) ? code : null
  } catch {
    return null
  }
}

export function formatDiscordCounts(server: DiscordServerPreview | null | undefined) {
  if (!server) return ''
  const members = typeof server.memberCount === 'number'
    ? `~${compactNumber.format(server.memberCount)} members`
    : ''
  const online = typeof server.onlineCount === 'number'
    ? `~${compactNumber.format(server.onlineCount)} online`
    : ''
  return [members, online].filter(Boolean).join(' · ')
}

function formatServerName(name: string) {
  const cleaned = name.trim().replace(/^\/+/, '').trim()
  return cleaned ? cleaned.charAt(0).toLocaleUpperCase('en-US') + cleaned.slice(1) : name
}

export async function getDiscordServerPreview(destination: string): Promise<DiscordServerPreview | null> {
  const inviteCode = getDiscordInviteCode(destination)
  if (!inviteCode) return null

  try {
    const response = await fetch(
      `https://discord.com/api/v10/invites/${encodeURIComponent(inviteCode)}?with_counts=true`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'AyraWeb/1.0 (+https://ayrabot.fun)',
        },
        next: { revalidate: 300 },
      },
    )

    if (!response.ok) return null

    const invite = await response.json() as DiscordInvite
    const guild = invite.guild
    if (!guild?.id || !guild.name) return null

    let iconUrl = FALLBACK_ICON
    if (guild.icon) {
      const animated = guild.icon.startsWith('a_')
      const extension = animated ? 'webp' : 'png'
      const animatedParam = animated ? '&animated=true' : ''
      iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${extension}?size=512${animatedParam}`
    }

    return {
      name: formatServerName(guild.name),
      guildId: guild.id,
      iconUrl,
      memberCount: Number.isSafeInteger(invite.approximate_member_count) && (invite.approximate_member_count ?? -1) >= 0
        ? invite.approximate_member_count
        : undefined,
      onlineCount: Number.isSafeInteger(invite.approximate_presence_count) && (invite.approximate_presence_count ?? -1) >= 0
        ? invite.approximate_presence_count
        : undefined,
    }
  } catch {
    return null
  }
}
