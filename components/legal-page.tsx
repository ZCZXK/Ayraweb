import Image from 'next/image'
import type { ReactNode } from 'react'
import { ScrollRevealObserver } from './scroll-reveal'
import { ThemeToggle } from './theme-toggle'

const SUPPORT_URL = 'https://discord.gg/GEPmvs57Yx'

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="site-shell">
      <ScrollRevealObserver />
      <div className="aurora-layer" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="/" aria-label="Ayra home">
          <Image src="/bot-icon.png" alt="" width={42} height={42} className="brand-icon" priority />
          <span className="brand-name">AYRA<span className="brand-period">.</span></span>
        </a>
        <nav className="main-nav" aria-label="Legal navigation">
          <a href="/">Home</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a>
        </nav>
        <ThemeToggle />
        <a className="glass-button glass-button--small" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">Support</a>
      </header>
      <article className="legal-content glass-panel" data-reveal="up">
        <p className="eyebrow"><span className="eyebrow-line" /> AYRA · LEGAL</p>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated October 21, 2026</p>
        <div className="legal-copy">{children}</div>
      </article>
      <footer className="site-footer" data-reveal="up" data-reveal-delay="100">
        <a className="footer-brand" href="/"><Image src="/bot-icon.png" alt="" width={28} height={28} /> AYRA</a>
        <div className="footer-links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">Support</a></div>
      </footer>
    </main>
  )
}
