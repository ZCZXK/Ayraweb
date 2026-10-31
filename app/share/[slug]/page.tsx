import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { DiscordInvitePreview } from '@/components/discord-invite-preview'
import { getRedirectLinkBySlug } from '@/lib/redirect-links'
import { findManagedRedirectBySlug } from '@/lib/redirect-store'
import { createDiscordShareMetadata } from '@/lib/share-preview'

export const dynamic = 'force-dynamic'

type SharePageProps = {
  params: Promise<{ slug: string }>
}

function canonicalUrl(value: string | null, fallback: string) {
  try {
    const candidate = new URL(value ?? '')
    const expected = new URL(fallback)
    if (candidate.protocol === 'https:' && candidate.hostname.toLowerCase() === expected.hostname.toLowerCase()) {
      return candidate.toString()
    }
  } catch {
    // Fall back to a known Ayra short-link URL.
  }
  return fallback
}

async function findShareTarget(slug: string) {
  const legacy = getRedirectLinkBySlug(slug)
  if (legacy) return { destination: legacy.destination, fallback: `https://${legacy.hostname}/` }

  const managed = await findManagedRedirectBySlug(slug)
  if (!managed) return null
  const fallback = managed.mode === 'subdomain'
    ? `https://${managed.slug}.ayrabot.fun/`
    : `https://www.ayrabot.fun/go/${managed.slug}`
  return { destination: managed.destination, fallback }
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { slug } = await params
  const target = await findShareTarget(slug)
  if (!target) {
    return { title: 'Link not found | Ayra', robots: { index: false, follow: false } }
  }

  const shareUrl = canonicalUrl((await headers()).get('x-ayra-share-url'), target.fallback)
  return createDiscordShareMetadata(target.destination, shareUrl)
}

export default async function SharePreviewPage({ params }: SharePageProps) {
  const { slug } = await params
  const target = await findShareTarget(slug)
  if (!target) notFound()
  return <DiscordInvitePreview destination={target.destination} />
}
