import 'server-only'

import { get, put } from '@vercel/blob'

const STORAGE_PATH = 'owner-profile/discord.json'

export type DiscordOwnerProfileInput = {
  id: string
  username: string
  globalName: string | null
  avatarHash: string | null
}

export type PublicOwnerProfile = {
  userId: string
  username: string
  displayName: string
  avatarUrl: string | null
}

type StoredOwnerProfile = DiscordOwnerProfileInput & { updatedAt: string }

function validText(value: unknown, max: number): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= max
}

function validAvatarHash(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(value)
}

export async function saveDiscordOwnerProfile(input: DiscordOwnerProfileInput) {
  const ownerId = process.env.DISCORD_ADMIN_USER_ID
  if (
    !ownerId || input.id !== ownerId || !/^\d{17,20}$/.test(input.id) ||
    !validText(input.username, 32) ||
    (input.globalName !== null && !validText(input.globalName, 64)) ||
    (input.avatarHash !== null && !validAvatarHash(input.avatarHash))
  ) return false

  const stored: StoredOwnerProfile = { ...input, updatedAt: new Date().toISOString() }
  try {
    await put(STORAGE_PATH, JSON.stringify(stored), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: 'application/json; charset=utf-8',
    })
    return true
  } catch {
    return false
  }
}

export async function getPublicDiscordOwnerProfile(): Promise<PublicOwnerProfile | null> {
  const ownerId = process.env.DISCORD_ADMIN_USER_ID
  if (!ownerId) return null

  try {
    const blob = await get(STORAGE_PATH, { access: 'private', useCache: false })
    if (!blob || blob.statusCode !== 200 || !blob.stream) return null
    const stored = JSON.parse(await new Response(blob.stream).text()) as Partial<StoredOwnerProfile>
    if (
      stored.id !== ownerId || !/^\d{17,20}$/.test(stored.id) ||
      !validText(stored.username, 32) ||
      (stored.globalName !== null && !validText(stored.globalName, 64)) ||
      (stored.avatarHash !== null && !validAvatarHash(stored.avatarHash))
    ) return null

    const avatarUrl = stored.avatarHash
      ? `https://cdn.discordapp.com/avatars/${stored.id}/${stored.avatarHash}.${stored.avatarHash.startsWith('a_') ? 'gif' : 'png'}?size=256`
      : null

    return {
      userId: stored.id,
      username: stored.username,
      displayName: stored.globalName || stored.username,
      avatarUrl,
    }
  } catch {
    return null
  }
}
