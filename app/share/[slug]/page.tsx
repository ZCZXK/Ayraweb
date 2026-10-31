import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getDiscordServerPreview } from '@/lib/discord-invite'
import { getRedirectLinkBySlug } from '@/lib/redirect-links'

type SharePageProps = {
  params: Promise<{ slug: string }>
}

function getCanonicalUrl(value: string | null, hostname: string) {
  const fallback = `https://${hostname}/`
  if (!value) return fallback

  try {
    const candidate = new URL(value)
    if (
      candidate.protocol === 'https:' &&
      candidate.hostname.toLowerCase() === hostname.toLowerCase()
    ) {
      return candidate.toString()
    }
  } catch {
    // Use the known Ayra short-link host when the incoming URL is invalid.
  }

  return fallback
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { slug } = await params
  const link = getRedirectLinkBySlug(slug)
  if (!link) {
    return {
      title: 'Link not found | Ayra',
      robots: { index: false, follow: false },
    }
  }

  const server = await getDiscordServerPreview(link.destination)
  const title = server ? `Join ${server.name} on Discord` : 'Join this Discord server'
  const description = server
    ? `You're invited to join ${server.name} on Discord.`
    : 'Open this invitation to join the Discord server.'
  const shareUrl = getCanonicalUrl(
    (await headers()).get('x-ayra-share-url'),
    link.hostname,
  )
  const image = server?.iconUrl ?? 'https://ayrabot.fun/bot-icon.png'

  return {
    metadataBase: new URL(shareUrl),
    title,
    description,
    alternates: { canonical: shareUrl },
    robots: { index: false, follow: false },
    openGraph: {
      type: 'website',
      siteName: 'Ayra',
      url: shareUrl,
      title,
      description,
      images: [{ url: image, width: 512, height: 512, alt: server ? `${server.name} Discord server icon` : 'Ayra' }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [image],
    },
  }
}

export default async function SharePreviewPage({ params }: SharePageProps) {
  const { slug } = await params
  const link = getRedirectLinkBySlug(slug)
  if (!link) notFound()

  const server = await getDiscordServerPreview(link.destination)
  const serverName = server?.name ?? 'Discord server'
  const iconUrl = server?.iconUrl ?? 'https://ayrabot.fun/bot-icon.png'

  return (
    <main className="share-preview-page">
      <section className="share-preview-card">
        <img src={iconUrl} alt={`${serverName} server icon`} width={112} height={112} />
        <p className="share-preview-eyebrow">Discord invitation</p>
        <h1>Join {serverName}</h1>
        <p>Open the invitation to view and join this Discord server.</p>
        <a href={link.destination} rel="noreferrer">Open Discord invite</a>
      </section>
    </main>
  )
}
