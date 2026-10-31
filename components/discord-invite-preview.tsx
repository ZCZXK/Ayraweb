import Image from 'next/image'
import { getDiscordServerPreview } from '@/lib/discord-invite'

export async function DiscordInvitePreview({ destination }: { destination: string }) {
  const server = await getDiscordServerPreview(destination)
  const serverName = server?.name ?? 'Discord server'
  const iconUrl = server?.iconUrl ?? 'https://ayrabot.fun/bot-icon.png'

  return (
    <main className="share-preview-page">
      <section className="share-preview-card">
        <Image src={iconUrl} alt={`${serverName} server icon`} width={96} height={96} unoptimized />
        <p className="share-preview-eyebrow">Discord invite</p>
        <h1>Join {serverName}</h1>
        <p>Open this invite to join the server.</p>
        <a href={destination} rel="noreferrer">Open invite</a>
      </section>
    </main>
  )
}
