import Image from 'next/image'
import type { Metadata } from 'next'
import { getPublicDiscordOwnerProfile } from '@/lib/owner-profile-store'
import { ThemeToggle } from '@/components/theme-toggle'

const PORTFOLIO_URL = 'https://cf7yce.ayrabot.fun/'
const DISCORD_ID = '1508722326928359495'
const DISCORD_PROFILE_URL = `https://discord.com/users/${DISCORD_ID}`
const GITHUB_URL = 'https://github.com/cf7yce'
const AYRA_URL = 'https://www.ayrabot.fun/'
const SUPPORT_URL = 'https://discord.gg/GEPmvs57Yx'
const INVITE_URL = 'https://discord.com/oauth2/authorize?client_id=1489882067239047168&permissions=0&integration_type=0&scope=bot%20applications.commands'
const DESCRIPTION = 'Portfolio of cf7yce, an AI developer, Discord bot developer and web developer. Creator of Ayra, a Discord bot for moderation and community tools.'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'cf7yce | AI, Discord Bot & Web Developer',
  description: DESCRIPTION,
  alternates: { canonical: PORTFOLIO_URL },
  openGraph: {
    type: 'profile',
    url: PORTFOLIO_URL,
    siteName: 'cf7yce · Developer Portfolio',
    title: 'cf7yce | AI, Discord Bot & Web Developer',
    description: DESCRIPTION,
    images: [{ url: 'https://www.ayrabot.fun/opengraph-image', width: 1200, height: 630, alt: 'cf7yce developer portfolio and Ayra' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cf7yce | AI, Discord Bot & Web Developer',
    description: DESCRIPTION,
    images: ['https://www.ayrabot.fun/opengraph-image'],
  },
}

const FOCUS_AREAS = [
  {
    number: '01',
    kind: 'ai' as const,
    title: 'AI development',
    copy: 'Building AI-powered features and practical tools that make software more useful.',
  },
  {
    number: '02',
    kind: 'discord' as const,
    title: 'Discord bot development',
    copy: 'Creating community-focused bots for moderation, protection, support, and server utilities.',
  },
  {
    number: '03',
    kind: 'web' as const,
    title: 'Web development',
    copy: 'Crafting responsive websites with clear interfaces, considered details, and purposeful interactions.',
  },
  {
    number: '04',
    kind: 'build' as const,
    title: 'Product building',
    copy: 'Connecting the idea, experience, and functionality into one useful product.',
  },
]

const AYRA_FEATURES = ['Moderation', 'AutoMod', 'Anti-nuke protection', 'Support tickets', 'Invite tracking', 'Giveaways & polls', 'Server utilities']

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
}

function FocusIcon({ kind }: { kind: 'ai' | 'discord' | 'web' | 'build' }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.45, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  if (kind === 'ai') return <svg {...common}><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M5.99 5.99l2.12 2.12m7.78 7.78 2.12 2.12m0-12.02-2.12 2.12m-7.78 7.78-2.12 2.12"/><circle cx="12" cy="12" r="4.2"/><path d="M12 9.8v4.4m-2.2-2.2h4.4"/></svg>
  if (kind === 'discord') return <svg {...common}><path d="M7 7.5a14 14 0 0 1 3-.9l.45.9a11 11 0 0 1 3.1 0l.45-.9a14 14 0 0 1 3 .9c1.8 2.6 2.55 5.15 2.3 7.65a12 12 0 0 1-3.65 1.85l-.8-1.3c.5-.18.98-.42 1.42-.7-2.75 1.28-5.82 1.28-8.55 0 .44.28.91.52 1.42.7l-.8 1.3a12 12 0 0 1-3.65-1.85C4.95 12.65 5.7 10.1 7 7.5Z"/><path d="M9 12h.01M15 12h.01" strokeWidth="2.4"/></svg>
  if (kind === 'web') return <svg {...common}><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 8.5h17M7 6.5h.01M10 6.5h.01m1.5 6H16m-4.5 3H16"/></svg>
  return <svg {...common}><path d="M5 7h5l2 3h7M5 17h5l2-3h7"/><circle cx="5" cy="7" r="1.5"/><circle cx="5" cy="17" r="1.5"/><circle cx="19" cy="10" r="1.5"/><circle cx="19" cy="14" r="1.5"/></svg>
}

export default async function PortfolioPage() {
  const profile = await getPublicDiscordOwnerProfile()

  return (
    <main className="site-shell portfolio-shell">
      <div className="aurora-layer" aria-hidden="true" />
      <header className="site-header portfolio-header">
        <a className="portfolio-brand" href="#home" aria-label="cf7yce home">cf7yce<span>.</span></a>
        <nav className="portfolio-nav" aria-label="Portfolio navigation">
          <a href="#about">About</a><a href="#focus">Focus</a><a href="#work">Work</a><a href="#contact">Contact</a>
        </nav>
        <ThemeToggle />
        <a className="glass-button glass-button--small portfolio-header-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub <ArrowIcon /></a>
      </header>

      <section className="portfolio-hero" id="home" aria-labelledby="portfolio-title">
        <div className="portfolio-intro">
          <p className="eyebrow"><span className="eyebrow-line" /> INDEPENDENT DEVELOPER · AYRA CREATOR</p>
          <h1 id="portfolio-title">cf7yce<span className="hero-title-dot">.</span></h1>
          <p className="portfolio-role">AI Developer <span>·</span> Discord Bot Developer <span>·</span> Web Developer</p>
          <p className="portfolio-description">I build practical products across AI, Discord communities, and the web. My current featured project is Ayra, a multipurpose Discord bot for community tools.</p>
          <div className="portfolio-actions">
            <a className="glass-button glass-button--primary" href="#work">Explore my work <ArrowIcon /></a>
            <a className="glass-button glass-button--quiet" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub profile</a>
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
              <h2 className="portfolio-display-name">Discord profile</h2>
              <p className="portfolio-username">The owner’s Discord name and avatar appear here after private verification.</p>
            </>
          )}
          <dl className="portfolio-details">
            <div><dt>Discord ID</dt><dd><a href={DISCORD_PROFILE_URL} target="_blank" rel="noopener noreferrer"><code>{profile?.userId ?? DISCORD_ID}</code><ArrowIcon /></a></dd></div>
            <div><dt>GitHub</dt><dd><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">cf7yce <ArrowIcon /></a></dd></div>
          </dl>
          {profile && <a className="portfolio-connect" href={DISCORD_PROFILE_URL} target="_blank" rel="noopener noreferrer">Open Discord profile <ArrowIcon /></a>}
        </aside>
      </section>

      <section className="portfolio-about portfolio-section" id="about" aria-labelledby="about-title">
        <div className="portfolio-section-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> A LITTLE ABOUT ME</p>
          <h2 id="about-title">Ideas into useful software.</h2>
        </div>
        <div className="portfolio-about-copy">
          <p>I’m cf7yce, a developer working across AI, Discord bots, and web development. I enjoy shaping ideas into useful tools with a clear purpose and a thoughtful experience.</p>
          <p>Ayra is my featured project: a Discord bot that brings community moderation, protection, support, and server utilities together in one place.</p>
        </div>
      </section>

      <section className="portfolio-focus portfolio-section" id="focus" aria-labelledby="focus-title">
        <div className="portfolio-section-heading portfolio-focus-heading">
          <div><p className="eyebrow"><span className="eyebrow-line" /> AREAS OF FOCUS</p><h2 id="focus-title">What I work on.</h2></div>
          <p>Different parts of building digital products, connected by a focus on usefulness.</p>
        </div>
        <div className="portfolio-focus-grid">
          {FOCUS_AREAS.map((area) => (
            <article className="portfolio-focus-card glass-panel" key={area.number}>
              <div className="portfolio-focus-top"><span className="portfolio-focus-icon"><FocusIcon kind={area.kind} /></span><span className="portfolio-focus-number">{area.number}</span></div>
              <h3>{area.title}</h3>
              <p>{area.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="portfolio-work portfolio-section" id="work" aria-labelledby="work-title">
        <div className="portfolio-section-heading portfolio-work-heading">
          <div><p className="eyebrow"><span className="eyebrow-line" /> FEATURED PROJECT</p><h2 id="work-title">Made for communities.</h2></div>
          <p>One project, shaped around the tools Discord communities use every day.</p>
        </div>
        <article className="portfolio-project glass-panel">
          <div className="portfolio-project-mark"><Image src="/bot-icon.png" alt="Ayra bot icon" width={64} height={64} /></div>
          <div className="portfolio-project-copy">
            <p className="portfolio-project-kicker">DISCORD BOT · COMMUNITY TOOLS</p>
            <h3>Ayra</h3>
            <p>Ayra brings moderation, AutoMod and anti-nuke protection, support tickets, invite tracking, giveaways, polls, and server utilities into one multipurpose bot.</p>
            <div className="portfolio-project-tags" aria-label="Ayra features">
              {AYRA_FEATURES.map((feature) => <span key={feature}>{feature}</span>)}
            </div>
            <p className="portfolio-stack"><span>Website stack</span> Next.js · TypeScript · Tailwind CSS · Vercel</p>
          </div>
          <div className="portfolio-project-actions">
            <a className="portfolio-project-link" href={AYRA_URL}>Visit Ayra <ArrowIcon /></a>
            <a className="portfolio-project-link" href={INVITE_URL} target="_blank" rel="noopener noreferrer">Invite bot <ArrowIcon /></a>
            <a className="portfolio-project-link portfolio-project-link--muted" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">Support server <ArrowIcon /></a>
          </div>
        </article>
      </section>

      <section className="portfolio-contact glass-panel" id="contact" aria-labelledby="contact-title">
        <div><p className="eyebrow"><span className="eyebrow-line" /> GET IN TOUCH</p><h2 id="contact-title">Have an idea in mind?</h2><p>Connect with me on Discord or explore my GitHub profile.</p></div>
        <div className="portfolio-contact-actions">
          <a className="glass-button glass-button--primary" href={DISCORD_PROFILE_URL} target="_blank" rel="noopener noreferrer">Discord <ArrowIcon /></a>
          <a className="glass-button glass-button--quiet" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub <ArrowIcon /></a>
        </div>
      </section>

      <footer className="site-footer portfolio-footer">
        <a className="footer-brand portfolio-footer-brand" href="#home">CF7YCE<span>.</span></a>
        <div className="footer-links"><a href="#about">About</a><a href="#focus">Focus</a><a href="#work">Work</a><a href={AYRA_URL}>Ayra</a><a href={DISCORD_PROFILE_URL} target="_blank" rel="noopener noreferrer">Discord</a><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a></div>
      </footer>
    </main>
  )
}
