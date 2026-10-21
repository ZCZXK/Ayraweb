import Image from 'next/image'

const INVITE_URL = 'https://discord.com/oauth2/authorize?client_id=1489882067239047168&permissions=0&integration_type=0&scope=bot%20applications.commands'
const SUPPORT_URL = 'https://discord.gg/GEPmvs57Yx'

const features = [
  { id: '01', icon: 'shield', title: 'Moderation', commands: ['/warn', '/mute', '/ban', '/slowmode'] },
  { id: '02', icon: 'ticket', title: 'Tickets', commands: ['/ticket', '/report'] },
  { id: '03', icon: 'grid', title: 'Server tools', commands: ['/serverinfo', '/membercount', '/roles'] },
  { id: '04', icon: 'spark', title: 'Community', commands: ['/giveaway', '/poll', '/remind'] },
]

function Icon({ name, className = '' }: { name: string; className?: string }) {
  const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  if (name === 'shield') return <svg {...common}><path d="M12 3.25 19 6v5.3c0 4.35-2.9 7.65-7 9.45-4.1-1.8-7-5.1-7-9.45V6l7-2.75Z"/><path d="m9 12 2 2 4-4"/></svg>
  if (name === 'ticket') return <svg {...common}><path d="M4 7.25A2.25 2.25 0 0 1 6.25 5h11.5A2.25 2.25 0 0 1 20 7.25v2a2.75 2.75 0 0 0 0 5.5v2A2.25 2.25 0 0 1 17.75 19H6.25A2.25 2.25 0 0 1 4 16.75v-2a2.75 2.75 0 0 0 0-5.5v-2Z"/><path d="M9 8.5v1M9 12v1M9 15.5v.01"/></svg>
  if (name === 'grid') return <svg {...common}><rect x="4" y="4" width="6" height="6" rx="1.3"/><rect x="14" y="4" width="6" height="6" rx="1.3"/><rect x="4" y="14" width="6" height="6" rx="1.3"/><rect x="14" y="14" width="6" height="6" rx="1.3"/></svg>
  if (name === 'spark') return <svg {...common}><path d="M12 3.5 14 9l5.5 2-5.5 2-2 5.5L10 13l-5.5-2L10 9l2-5.5Z"/><path d="m19 15 .85 2.15L22 18l-2.15.85L19 21l-.85-2.15L16 18l2.15-.85L19 15Z"/></svg>
  if (name === 'arrow') return <svg {...common}><path d="M7 17 17 7M8 7h9v9"/></svg>
  if (name === 'discord') return <svg {...common}><path d="M7 7.2a14 14 0 0 1 3-.9l.45.9a11 11 0 0 1 3.1 0l.45-.9a14 14 0 0 1 3 .9c1.8 2.6 2.55 5.15 2.3 7.65a12 12 0 0 1-3.65 1.85l-.8-1.3c.5-.18.98-.42 1.42-.7-2.75 1.28-5.82 1.28-8.55 0 .44.28.91.52 1.42.7l-.8 1.3a12 12 0 0 1-3.65-1.85C4.95 12.35 5.7 9.8 7 7.2Z"/><path d="M9 12h.01M15 12h.01" strokeWidth="2.4"/></svg>
  return <svg {...common}><path d="M5 7.5h14M5 12h9M5 16.5h6"/><path d="m16 15 2 2 4-4"/></svg>
}

export default function Home() {
  return (
    <main className="site-shell">
      <div className="aurora-layer" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Ayra home">
          <Image src="/bot-icon.png" alt="" width={42} height={42} className="brand-icon" priority />
          <span className="brand-name">AYRA<span className="brand-period">.</span></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#features">Features</a><a href="#reviews">Reviews</a><a href="#support">Support</a>
        </nav>
        <a className="glass-button glass-button--small" href={INVITE_URL} target="_blank" rel="noopener noreferrer"><Icon name="discord" /><span>Invite Ayra</span><Icon name="arrow" className="button-arrow" /></a>
      </header>

      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> Discord bot</p>
          <h1 id="hero-title">More order.<br /><em>More room</em> to grow.</h1>
          <p className="hero-description">Moderation, tickets, and community tools for Discord.</p>
          <div className="hero-actions">
            <a className="glass-button glass-button--primary" href={INVITE_URL} target="_blank" rel="noopener noreferrer"><Icon name="discord" /><span>Invite Ayra</span><Icon name="arrow" className="button-arrow" /></a>
            <a className="text-link" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">Support server <Icon name="arrow" className="inline-arrow" /></a>
          </div>
        </div>
        <div className="hero-art" aria-label="Ayra bot icon">
          <div className="art-orbit art-orbit--one" aria-hidden="true" /><div className="art-orbit art-orbit--two" aria-hidden="true" />
          <div className="icon-frame"><Image src="/bot-icon.png" alt="Ayra bot icon" width={176} height={176} className="hero-icon" priority /></div>
          <div className="icon-caption"><span className="caption-rule" /> AYRA · DISCORD BOT</div>
        </div>
      </section>

      <section className="section features-section" id="features" aria-labelledby="features-title">
        <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> Ayra</p><h2 id="features-title">Features</h2></div></div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card glass-panel" key={feature.id}>
              <div className="feature-topline"><span className="feature-index">{feature.id}</span><Icon name={feature.icon} className="feature-icon" /></div>
              <h3>{feature.title}</h3>
              <div className="command-list" aria-label={`${feature.title} commands`}>{feature.commands.map((command) => <code key={command}>{command}</code>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section reviews-section" id="reviews" aria-labelledby="reviews-title">
        <div className="review-mark" aria-hidden="true"><Icon name="quote" /></div>
        <div className="review-copy"><p className="eyebrow"><span className="eyebrow-line" /> Community</p><h2 id="reviews-title">Reviews</h2><p>No public reviews yet.</p></div>
        <div className="review-status glass-panel"><span className="status-dot" /> No reviews</div>
      </section>

      <section className="section support-section" id="support" aria-labelledby="support-title">
        <div className="support-copy"><p className="eyebrow"><span className="eyebrow-line" /> Support</p><h2 id="support-title">Need help?</h2><p>Use <code>/ticket</code> or join the support server.</p></div>
        <div className="support-actions"><a className="glass-button glass-button--primary" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer"><Icon name="discord" /><span>Support server</span><Icon name="arrow" className="button-arrow" /></a></div>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#home"><Image src="/bot-icon.png" alt="" width={28} height={28} /> AYRA</a>
        <div className="footer-links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">Support</a></div>
      </footer>
    </main>
  )
}
