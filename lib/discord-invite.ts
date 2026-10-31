type DiscordInvite = {
  guild?: {
    id?: string
    name?: string
    icon?: string | null
  }
}

export type DiscordServerPreview = {
  name: string
  iconUrl: string
  guildId: string
}

const FALLBACK_ICON = 'https://ayrabot.fun/bot-icon.png'
const INVITE_HOSTS = new Set(['discord.gg', 'discord.com', 'www.discord.com'])

export function getDiscordInviteCode(destination: string) {
  try {
    const url = new URL(destination)
    if (url.protocol !== 'https:' || !INVITE_HOSTS.has(url.hostname.toLowerCase())) {
      return null
    }

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

export async function getDiscordServerPreview(destination: string): Promise<DiscordServerPreview | null> {
  const inviteCode = getDiscordInviteCode(destination)
  if (!inviteCode) return null

  try {
    const response = await fetch(
      `https://discord.com/api/v10/invites/${encodeURIComponent(inviteCode)}`,
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
      name: guild.name,
      guildId: guild.id,
      iconUrl,
    }
  } catch {
    return null
  }
}
