import 'server-only'

import { get, put } from '@vercel/blob'
import { getDiscordInviteCode } from '@/lib/discord-invite'
import { REDIRECT_LINKS } from '@/lib/redirect-links'

export type RedirectMode = 'path' | 'subdomain'

export type ManagedRedirect = {
  slug: string
  mode: RedirectMode
  destination: string
  createdAt: string
}

export type RedirectRow = ManagedRedirect & {
  url: string
  builtIn: boolean
}

const STORAGE_PATH = 'redirect-manager/links.json'
const MAX_LINKS = 250
const RESERVED_SLUGS = new Set([
  'admin', 'api', 'assets', 'cdn', 'contact', 'favicon', 'ftp', 'go', 'mail', 'privacy',
  'robots', 'share', 'sitemap', 'snicker', 'smtp', 'status', 'subdomain', 'support', 'terms',
  'www', '_next',
])

function linkUrl(link: Pick<ManagedRedirect, 'slug' | 'mode'>) {
  return link.mode === 'subdomain'
    ? `https://${link.slug}.ayrabot.fun`
    : `https://www.ayrabot.fun/go/${link.slug}`
}

function isValidSlug(value: unknown): value is string {
  return typeof value === 'string' &&
    value.length >= 2 && value.length <= 40 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

function parseStoredLinks(value: unknown): ManagedRedirect[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const valid: ManagedRedirect[] = []

  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const entry = item as Record<string, unknown>
    if (
      !isValidSlug(entry.slug) ||
      (entry.mode !== 'path' && entry.mode !== 'subdomain') ||
      typeof entry.destination !== 'string' ||
      typeof entry.createdAt !== 'string' ||
      RESERVED_SLUGS.has(entry.slug) ||
      seen.has(entry.slug)
    ) continue

    const code = getDiscordInviteCode(entry.destination)
    if (!code) continue
    seen.add(entry.slug)
    valid.push({
      slug: entry.slug,
      mode: entry.mode,
      destination: `https://discord.gg/${code}`,
      createdAt: entry.createdAt,
    })
  }

  return valid.slice(0, MAX_LINKS)
}

async function readCustomRedirects(fresh = false): Promise<ManagedRedirect[]> {
  const blob = await get(STORAGE_PATH, { access: 'private', useCache: !fresh })
  if (!blob || blob.statusCode !== 200 || !blob.stream) return []

  try {
    const contents = await new Response(blob.stream).text()
    return parseStoredLinks(JSON.parse(contents))
  } catch {
    throw new Error('The private redirect store could not be read')
  }
}

async function writeCustomRedirects(links: ManagedRedirect[]) {
  await put(STORAGE_PATH, JSON.stringify(links), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: 'application/json; charset=utf-8',
  })
}

export function normalizeRedirectDraft(input: unknown): Omit<ManagedRedirect, 'createdAt'> {
  if (!input || typeof input !== 'object') throw new Error('Enter a link and a Discord invite URL.')
  const draft = input as Record<string, unknown>
  const slug = typeof draft.slug === 'string' ? draft.slug.trim() : ''
  const mode = draft.mode
  const destination = typeof draft.destination === 'string' ? draft.destination.trim() : ''

  if (!isValidSlug(slug)) {
    throw new Error('Use 2–40 lowercase letters or numbers, separated by single hyphens.')
  }
  if (RESERVED_SLUGS.has(slug) || Object.hasOwn(REDIRECT_LINKS, slug)) {
    throw new Error('That link name is reserved.')
  }
  if (mode !== 'path' && mode !== 'subdomain') {
    throw new Error('Choose either a short path or a subdomain.')
  }

  const code = getDiscordInviteCode(destination)
  if (!code) throw new Error('Use a valid HTTPS Discord invite link.')

  return { slug, mode, destination: `https://discord.gg/${code}` }
}

export async function listAllRedirects(): Promise<RedirectRow[]> {
  const builtIns: RedirectRow[] = Object.values(REDIRECT_LINKS).map((entry) => ({
    slug: entry.slug,
    mode: 'subdomain',
    destination: entry.destination,
    createdAt: 'Built in',
    url: linkUrl({ slug: entry.slug, mode: 'subdomain' }),
    builtIn: true,
  }))
  const custom = await readCustomRedirects()
  return [...builtIns, ...custom.map((entry) => ({ ...entry, url: linkUrl(entry), builtIn: false }))]
}

export async function findManagedRedirect(slug: string, mode: RedirectMode) {
  const links = await readCustomRedirects()
  return links.find((link) => link.slug === slug && link.mode === mode) ?? null
}

export async function findManagedRedirectBySlug(slug: string) {
  const links = await readCustomRedirects()
  return links.find((link) => link.slug === slug) ?? null
}

export async function createManagedRedirect(input: unknown) {
  const draft = normalizeRedirectDraft(input)
  const links = await readCustomRedirects(true)
  if (Object.values(REDIRECT_LINKS).some((item) => item.slug === draft.slug) || links.some((item) => item.slug === draft.slug)) {
    throw new Error('That link name is already in use.')
  }
  if (links.length >= MAX_LINKS) throw new Error(`The redirect limit of ${MAX_LINKS} links has been reached.`)

  const created: ManagedRedirect = { ...draft, createdAt: new Date().toISOString() }
  await writeCustomRedirects([...links, created])
  return { ...created, url: linkUrl(created), builtIn: false }
}

export async function updateManagedRedirect(originalSlug: string, input: unknown) {
  const draft = normalizeRedirectDraft(input)
  const links = await readCustomRedirects(true)
  const index = links.findIndex((item) => item.slug === originalSlug)
  if (index < 0) return null
  if (
    links.some((item, i) => i !== index && item.slug === draft.slug) ||
    Object.values(REDIRECT_LINKS).some((item) => item.slug === draft.slug)
  ) throw new Error('That link name is already in use.')

  const updated: ManagedRedirect = { ...draft, createdAt: links[index].createdAt }
  const next = [...links]
  next[index] = updated
  await writeCustomRedirects(next)
  return { ...updated, url: linkUrl(updated), builtIn: false }
}

export async function deleteManagedRedirect(slug: string) {
  const links = await readCustomRedirects(true)
  const next = links.filter((item) => item.slug !== slug)
  if (next.length === links.length) return false
  await writeCustomRedirects(next)
  return true
}
