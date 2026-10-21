const TRACK_URL = 'https://open.spotify.com/track/5XeFesFbtLpXzIVDNQP22n'

export default function Home() {
  return (
    <main className="landing">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Ayraweb home">ayraweb<span>.</span></a>
        <p className="status"><span /> Coming soon</p>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">A note from Ayraweb</p>
          <h1 id="hero-title">Something<br />beautiful<br /><em>is coming.</em></h1>
          <p className="description">We’re making a new home for Ayraweb. It won’t be long.</p>

          <a className="track-link" href={TRACK_URL} target="_blank" rel="noreferrer">
            <span className="play-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M9 6.7c0-.76.84-1.23 1.5-.84l8.8 5.18a1.1 1.1 0 0 1 0 1.91l-8.8 5.18c-.66.39-1.5-.08-1.5-.84V6.7Z" fill="currentColor" /></svg>
            </span>
            <span className="track-copy">
              <span className="track-label">Play while you wait · Spotify</span>
              <strong>I Wanna Be Yours <span>— Arctic Monkeys</span></strong>
            </span>
            <svg className="external-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 14 14 6M6.5 6H14v7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>

        <div className="record-stage" role="img" aria-label="A vinyl record for Ayraweb">
          <div className="record-disc">
            <div className="record-label"><span>a</span><i /></div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 Ayraweb</span>
        <span>See you soon.</span>
      </footer>
    </main>
  )
}
