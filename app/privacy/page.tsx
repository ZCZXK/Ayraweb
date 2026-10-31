import type { Metadata } from 'next'
import { LegalPage } from '../../components/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy — Ayra',
  description: 'How Ayra processes Discord bot and website data.',
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <section>
        <h2>Data the bot stores</h2>
        <p>Ayra stores Discord server settings and identifiers, plus feature data needed to operate the bot. This can include user, server, channel, role, and message IDs; AFK reasons; giveaway entries; invite join and leave records; ticket metadata; and AutoMod event details.</p>
        <p>The bot database does not keep a general command-history log. Ticket subject/details and conversations are posted in Discord ticket channels. Moderation logs are posted to the channels configured by server admins. Those Discord messages follow the server’s settings and Discord’s own policies.</p>
      </section>
      <section>
        <h2>Use and service providers</h2>
        <p>Ayra uses this data to run requested bot features and configured server logs. The bot uses a local SQLite database on its host, rather than a separate database provider. Discord processes bot interactions, and Render hosts the bot service. We do not sell user data.</p>
        <p>The website uses Vercel Analytics in production and loads fonts from Google Fonts. Google handles font requests under its own policies, including <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s Privacy Policy</a>.</p>
        <p>When a social app requests a preview for an Ayra Discord invite link, the website may query Discord’s public Invite API for the invite’s current server name and icon. This server-side lookup uses the public invite code, does not send visitor account credentials to Discord, and may be cached by Vercel for up to five minutes.</p>
      </section>
      <section>
        <h2>Retention and deletion</h2>
        <p>The bot code has no automatic time-based deletion schedule. Closing a ticket removes its Discord channel but leaves ticket metadata in the database. Other records remain until cleared by a feature or the database is removed.</p>
        <p>The reviewed Render configuration uses a free service without a persistent disk, so its local database may be reset when the service is replaced or redeployed. No fixed retention period is promised.</p>
        <p>For a data question or deletion request, email <a href="mailto:flewd7560@gmail.com">flewd7560@gmail.com</a> or contact us through the <a href="https://discord.gg/GEPmvs57Yx" target="_blank" rel="noopener noreferrer">Ayra support server</a>. Messages already posted in Discord may need to be removed by a server moderator.</p>
      </section>
    </LegalPage>
  )
}
