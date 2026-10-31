import type { Metadata } from 'next'
import { getDiscordServerPreview } from '@/lib/discord-invite'

export async function createDiscordShareMetadata(destination: string, shareUrl: string): Promise<Metadata> {
  const server = await getDiscordServerPreview(destination)
  const title = server ? `Join ${server.name} on Discord` : 'Join this Discord server'
  const description = server
    ? `Join ${server.name} on Discord.`
    : 'Open this invite to join the Discord server.'
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
