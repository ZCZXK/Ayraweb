import Image from 'next/image'
import { ScrollRevealObserver } from '../components/scroll-reveal'
import { OwnerCard } from '../components/owner-card'
import { CommandSearch } from '../components/command-search'
import { ParticleField } from '../components/particle-field'
import { ThemeToggle } from '../components/theme-toggle'
import { allCommands } from '../data/command-catalog'

const INVITE_URL = 'https://discord.com/oauth2/authorize?client_id=1489882067239047168&permissions=0&integration_type=0&scope=bot%20applications.commands'
const SUPPORT_URL = 'https://discord.gg/GEPmvs57Yx'
const SUPPORT_EMAIL = 'support@ayrabot.fun'

function Icon({ name, className = '' }: { name: string; className?: string }) {
  const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  if (name === 'arrow') return <svg {...common}><path d="M7 17 17 7M8 7h9v9"/></svg>
  if (name === 'discord') return <svg {...common}><path d="M7 7.2a14 14 0 0 1 3-.9l.45.9a11 11 0 0 1 3.1 0l.45-.9a14 14 0 0 1 3 .9c1.8 2.6 2.55 5.15 2.3 7.65a12 12 0 0 1-3.65 1.85l-.8-1.3c.5-.18.98-.42 1.42-.7-2.75 1.28-5.82 1.28-8.55 0 .44.28.91.52 1.42.7l-.8 1.3a12 12 0 0 1-3.65-1.85C4.95 12.35 5.7 9.8 7 7.2Z"/><path d="M9 12h.01M15 12h.01" strokeWidth="2.4"/></svg>
  if (name === 'mail') return <svg {...common}><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4.5 7 7.5 5.5L19.5 7"/></svg>
  return <svg {...common}><path d="M5 7.5h14M5 12h9M5 16.5h6"/><path d="m16 15 2 2 4-4"/></svg>
}

export default function Home() {
  return (
    <main className="site-shell">
      <ScrollRevealObserver />
      <div className="aurora-layer" aria-hidden="true" />
      <ParticleField />
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Ayra home">
          <Image src="/bot-icon.png" alt="" width={42} height={42} className="brand-icon" priority />
          <span className="brand-name">AYRA<span className="brand-period">.</span></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#commands">Commands</a><a href="#reviews">Reviews</a><a href="#support">Support</a>
        </nav>
        <ThemeToggle />
        <a className="glass-button glass-button--small" href={INVITE_URL} target="_blank" rel="noopener noreferrer"><Icon name="discord" /><span>Invite Ayra</span><Icon name="arrow" className="button-arrow" /></a>
      </header>

      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-copy" data-reveal="left">
          <p className="eyebrow"><span className="eyebrow-line" /> Discord bot</p>
          <h1 id="hero-title">Ayra<span className="hero-title-dot">.</span></h1>
          <p className="hero-description">Moderation, tickets, and community tools.</p>
          <div className="hero-actions">
            <a className="glass-button glass-button--primary" href={INVITE_URL} target="_blank" rel="noopener noreferrer"><Icon name="discord" /><span>Invite Ayra</span><Icon name="arrow" className="button-arrow" /></a>
            <a className="glass-button glass-button--quiet" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer"><Icon name="discord" /><span>Support server</span><Icon name="arrow" className="button-arrow" /></a>
          </div>
        </div>
        <div className="hero-art" aria-label="Ayra bot icon" data-reveal="right" data-reveal-delay="100">
          <div className="art-orbit art-orbit--one" aria-hidden="true" /><div className="art-orbit art-orbit--two" aria-hidden="true" />
          <div className="icon-frame"><Image src="/bot-icon.png" alt="Ayra bot icon" width={176} height={176} className="hero-icon" priority /></div>
          <div className="icon-caption"><span className="caption-rule" /> AYRA · DISCORD BOT</div>
        </div>
      </section>

      <section className="section commands-section" id="commands" aria-labelledby="commands-title">
        <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> Ayra</p><h2 id="commands-title">Commands</h2></div></div>
        <CommandSearch commands={allCommands} />
      </section>

      <section className="section reviews-section" id="reviews" aria-labelledby="reviews-title" data-reveal="up">
        <div className="review-mark" aria-hidden="true"><Icon name="quote" /></div>
        <div className="review-copy"><p className="eyebrow"><span className="eyebrow-line" /> Community</p><h2 id="reviews-title">Reviews</h2><p>No public reviews yet.</p></div>
        <div className="review-status glass-panel"><span className="status-dot" /> No reviews</div>
      </section>

      <section className="section support-section" id="support" aria-labelledby="support-title" data-reveal="up">
        <div className="support-copy"><p className="eyebrow"><span className="eyebrow-line" /> Support</p><h2 id="support-title">Need help?</h2><p>Use <code>/ticket</code>, join the support server, or email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p></div>
        <div className="support-actions"><a className="glass-button glass-button--primary" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer"><Icon name="discord" /><span>Support server</span><Icon name="arrow" className="button-arrow" /></a><a className="glass-button glass-button--quiet" href={`mailto:${SUPPORT_EMAIL}`}><Icon name="mail" /><span>Email support</span></a></div>
      </section>

      <section className="section owner-section" id="owner" aria-label="Ayra owner portfolio" data-reveal="up">
        <p className="eyebrow"><span className="eyebrow-line" /> Owner</p>
        <OwnerCard />
      </section>

      <footer className="site-footer" data-reveal="up" data-reveal-delay="100">
        <a className="footer-brand" href="#home"><Image src="/bot-icon.png" alt="" width={28} height={28} /> AYRA</a>
        <div className="footer-links"><a href="#owner">Owner</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">Support</a><a href={`mailto:${SUPPORT_EMAIL}`}>Email</a></div>
      </footer>
    </main>
  )
}
