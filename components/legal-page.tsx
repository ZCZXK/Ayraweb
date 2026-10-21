import Image from 'next/image'
import type { ReactNode } from 'react'

const SUPPORT_URL = 'https://discord.gg/GEPmvs57Yx'

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="site-shell">
      <div className="aurora-layer" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="/" aria-label="Ayra home">
          <Image src="/bot-icon.png" alt="" width={42} height={42} className="brand-icon" priority />
          <span className="brand-name">AYRA<span className="brand-period">.</span></span>
        </a>
        <nav className="main-nav" aria-label="Legal navigation">
          <a href="/">Home</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a>
        </nav>
        <a className="glass-button glass-button--small" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">Support</a>
      </header>
      <article className="legal-content glass-panel">
        <p className="eyebrow"><span className="eyebrow-line" /> AYRA · LEGAL</p>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated October 21, 2026</p>
        <div className="legal-copy">{children}</div>
      </article>
      <footer className="site-footer">
        <a className="footer-brand" href="/"><Image src="/bot-icon.png" alt="" width={28} height={28} /> AYRA</a>
        <div className="footer-links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">Support</a></div>
      </footer>
    </main>
  )
}
