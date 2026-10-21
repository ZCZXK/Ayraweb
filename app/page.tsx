'use client'

import { FormEvent, useState } from 'react'

const SPOTIFY_EMBED_URL = 'https://open.spotify.com/embed/track/5XeFesFbtLpXzIVDNQP22n?theme=1'

type SignupState = { kind: 'idle' | 'loading' | 'success' | 'error'; message: string }

export default function Home() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [signup, setSignup] = useState<SignupState>({ kind: 'idle', message: '' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (signup.kind === 'loading') return

    setSignup({ kind: 'loading', message: '' })
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, website }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Could not add you right now. Please try again.')
      }

      setEmail('')
      setConsent(false)
      setWebsite('')
      setSignup({ kind: 'success', message: 'You’re on the list. Thanks for being here.' })
    } catch (error) {
      setSignup({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Could not add you right now. Please try again.',
      })
    }
  }

  return (
    <main className="landing">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Ayraweb home">ayraweb<span>.</span></a>
        <p className="status"><span /> Coming soon</p>
      </header>

      <section className="main-content" id="top" aria-labelledby="hero-title">
        <p className="eyebrow">A note from Ayraweb</p>
        <h1 id="hero-title">Something<br /><em>beautiful</em> is coming.</h1>
        <p className="description">We’re making a new home for Ayraweb. Leave your email and we’ll let you know when it’s ready.</p>

        <form className="waitlist" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="waitlist-email">Email address</label>
          <div className="email-row">
            <input
              id="waitlist-email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={254}
              aria-describedby="waitlist-consent waitlist-status"
            />
            <button type="submit" disabled={!consent || signup.kind === 'loading'}>
              {signup.kind === 'loading' ? 'Joining…' : 'Join the waitlist'}
            </button>
          </div>
          <div className="consent-row">
            <input
              id="waitlist-consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              required
            />
            <label htmlFor="waitlist-consent">Send me occasional Ayraweb updates. Unsubscribe anytime.</label>
          </div>
          <div className="form-trap" aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
          </div>
          <p id="waitlist-status" className={`form-status ${signup.kind}`} aria-live="polite">{signup.message}</p>
        </form>

        <section className="music" aria-label="Music player">
          <p className="music-label">A song for the wait</p>
          <iframe
            title="I Wanna Be Yours by Arctic Monkeys — Spotify player"
            src={SPOTIFY_EMBED_URL}
            width="100%"
            height="80"
            loading="eager"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </section>
      </section>

      <footer className="footer">
        <span>© 2026 Ayraweb</span>
        <span>See you soon.</span>
      </footer>
    </main>
  )
}
