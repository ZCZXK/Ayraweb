import Image from 'next/image'
import type { Metadata } from 'next'
import { getPublicDiscordOwnerProfile } from '@/lib/owner-profile-store'
import { ThemeToggle } from '@/components/theme-toggle'

const PORTFOLIO_URL = 'https://cf7yce.ayrabot.fun/'
const DISCORD_ID = '1508722326928359495'
const GITHUB_URL = 'https://github.com/cf7yce'
const AYRA_URL = 'https://www.ayrabot.fun/'
const DESCRIPTION = 'Portfolio of cf7yce, creator of Ayra, a Discord bot for moderation, AutoMod, anti-nuke protection, tickets, and server tools.'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'cf7yce — Discord Bot Developer',
  description: DESCRIPTION,
  alternates: { canonical: PORTFOLIO_URL },
  openGraph: {
    type: 'profile',
    url: PORTFOLIO_URL,
    siteName: 'cf7yce',
    title: 'cf7yce — Discord Bot Developer',
    description: DESCRIPTION,
    images: [{ url: 'https://www.ayrabot.fun/opengraph-image', width: 1200, height: 630, alt: 'cf7yce, creator of Ayra' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cf7yce — Discord Bot Developer',
    description: DESCRIPTION,
    images: ['https://www.ayrabot.fun/opengraph-image'],
  },
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
}

export default async function PortfolioPage() {
  const profile = await getPublicDiscordOwnerProfile()

  return (
    <main className="site-shell portfolio-shell">
      <div className="aurora-layer" aria-hidden="true" />
      <header className="site-header portfolio-header">
        <a className="brand" href={AYRA_URL} aria-label="Ayra home">
          <Image src="/bot-icon.png" alt="" width={42} height={42} className="brand-icon" priority />
          <span className="brand-name">AYRA<span className="brand-period">.</span></span>
        </a>
        <nav className="main-nav" aria-label="Portfolio navigation">
          <a href="#work">Work</a><a href="#profile">Profile</a>
        </nav>
        <ThemeToggle />
        <a className="glass-button glass-button--small" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub <ArrowIcon /></a>
      </header>

      <section className="portfolio-hero" aria-labelledby="portfolio-title">
        <div className="portfolio-intro">
          <p className="eyebrow"><span className="eyebrow-line" /> DEVELOPER · AYRA CREATOR</p>
          <h1 id="portfolio-title">cf7yce<span className="hero-title-dot">.</span></h1>
          <p className="portfolio-lead">Building tools for Discord communities.</p>
          <p className="portfolio-description">I create and maintain Ayra, a multipurpose Discord bot with moderation, AutoMod and anti-nuke protection, tickets, invite tracking, giveaways, polls, and server utilities.</p>
          <div className="portfolio-actions">
            <a className="glass-button glass-button--primary" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">View GitHub <ArrowIcon /></a>
            <a className="glass-button glass-button--quiet" href={AYRA_URL}>Explore Ayra</a>
          </div>
        </div>

        <aside className="portfolio-profile glass-panel" id="profile" aria-label="Discord profile">
          <div className="portfolio-avatar-wrap">
            {profile?.avatarUrl
              ? <Image src={profile.avatarUrl} alt={`${profile.displayName}'s Discord avatar`} width={120} height={120} className="portfolio-avatar" unoptimized />
              : <div className="portfolio-avatar-placeholder" aria-hidden="true">c<span>.</span></div>}
          </div>
          <p className="portfolio-profile-label">DISCORD PROFILE</p>
          {profile ? (
            <>
              <h2 className="portfolio-display-name">{profile.displayName}</h2>
              <p className="portfolio-username">@{profile.username}</p>
            </>
          ) : (
            <>
              <h2 className="portfolio-display-name">Connect Discord</h2>
              <p className="portfolio-username">Sign in as the Ayra owner to show your current Discord name and avatar on this public profile.</p>
            </>
          )}
          <dl className="portfolio-details">
            <div><dt>Discord ID</dt><dd><code>{profile?.userId ?? DISCORD_ID}</code></dd></div>
            <div><dt>GitHub</dt><dd><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">cf7yce <ArrowIcon /></a></dd></div>
          </dl>
          {!profile && <a className="portfolio-connect" href="https://www.ayrabot.fun/api/auth/discord/login">Connect Discord profile <ArrowIcon /></a>}
        </aside>
      </section>

      <section className="portfolio-work" id="work" aria-labelledby="work-title">
        <div className="portfolio-work-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> SELECTED WORK</p>
          <h2 id="work-title">Ayra<span className="hero-title-dot">.</span></h2>
        </div>
        <article className="portfolio-project glass-panel">
          <div className="portfolio-project-mark"><Image src="/bot-icon.png" alt="Ayra bot icon" width={58} height={58} /></div>
          <div className="portfolio-project-copy">
            <p className="portfolio-project-kicker">DISCORD BOT</p>
            <h3>Tools for growing communities</h3>
            <p>Ayra brings moderation, community protection, support tickets, and server utilities into one Discord bot. The public site includes its command catalog and support links.</p>
          </div>
          <a className="portfolio-project-link" href={AYRA_URL} aria-label="Visit Ayra website">Visit Ayra <ArrowIcon /></a>
        </article>
      </section>

      <footer className="site-footer portfolio-footer">
        <span className="footer-brand">CF7YCE</span>
        <div className="footer-links"><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://discord.com/users/1508722326928359495" target="_blank" rel="noopener noreferrer">Discord</a><a href={AYRA_URL}>Ayra</a></div>
      </footer>
    </main>
  )
}
