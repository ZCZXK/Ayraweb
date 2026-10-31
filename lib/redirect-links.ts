export type RedirectLink = {
  slug: string
  hostname: string
  destination: string
}

export const REDIRECT_LINKS: Record<string, RedirectLink> = {
  support: {
    slug: 'support',
    hostname: 'support.ayrabot.fun',
    destination: 'https://discord.gg/GEPmvs57Yx',
  },
  snicker: {
    slug: 'snicker',
    hostname: 'snicker.ayrabot.fun',
    destination: 'https://discord.gg/h9PA5Upekj',
  },
}

export function getRedirectLinkBySlug(slug: string) {
  return REDIRECT_LINKS[slug] ?? null
}

export function getRedirectLinkByHost(hostname: string) {
  const normalizedHostname = hostname.toLowerCase()
  return Object.values(REDIRECT_LINKS).find(
    (link) => link.hostname === normalizedHostname,
  ) ?? null
}
