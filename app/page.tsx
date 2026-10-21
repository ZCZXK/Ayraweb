'use client'

import { useEffect, useRef, useState } from 'react'

type SpotifyPlaybackEvent = {
  data?: {
    isPaused?: boolean
  }
}

type SpotifyEmbedController = {
  togglePlay: () => void
  destroy: () => void
  addListener: (
    event: 'ready' | 'playback_update',
    callback: (event: SpotifyPlaybackEvent) => void,
  ) => void
}

type SpotifyIframeApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    callback: (controller: SpotifyEmbedController) => void,
  ) => void
}

declare global {
  interface Window {
    SpotifyIframeApi?: SpotifyIframeApi
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void
  }
}

const TRACK_URI = 'spotify:track:5XeFesFbtLpXzIVDNQP22n'
const TRACK_URL = 'https://open.spotify.com/track/5XeFesFbtLpXzIVDNQP22n'

export default function Home() {
  const embedRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<SpotifyEmbedController | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const [playerFailed, setPlayerFailed] = useState(false)

  useEffect(() => {
    const element = embedRef.current
    if (!element) return

    let cancelled = false

    const createPlayer = (api: SpotifyIframeApi) => {
      if (cancelled || controllerRef.current) return

      api.createController(
        element,
        { uri: TRACK_URI, width: '100%', height: 80 },
        (controller) => {
          if (cancelled) {
            controller.destroy()
            return
          }

          controllerRef.current = controller
          controller.addListener('ready', () => setPlayerReady(true))
          controller.addListener('playback_update', (event) => {
            if (typeof event.data?.isPaused === 'boolean') {
              setIsPlaying(!event.data.isPaused)
            }
          })
          setPlayerReady(true)
        },
      )
    }

    if (window.SpotifyIframeApi) {
      createPlayer(window.SpotifyIframeApi)
    } else {
      const previousReadyHandler = window.onSpotifyIframeApiReady
      const readyHandler = (api: SpotifyIframeApi) => {
        window.SpotifyIframeApi = api
        previousReadyHandler?.(api)
        createPlayer(api)
      }
      window.onSpotifyIframeApiReady = readyHandler

      let script = document.querySelector<HTMLScriptElement>(
        'script[data-spotify-iframe-api]',
      )
      if (!script) {
        script = document.createElement('script')
        script.src = 'https://open.spotify.com/embed/iframe-api/v1'
        script.async = true
        script.dataset.spotifyIframeApi = 'true'
        script.onerror = () => setPlayerFailed(true)
        document.body.appendChild(script)
      }
    }

    return () => {
      cancelled = true
      controllerRef.current?.destroy()
      controllerRef.current = null
    }
  }, [])

  const togglePlayback = () => {
    controllerRef.current?.togglePlay()
  }

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Ayraweb home">
          <span className="wordmark-mark">a</span>
          <span>ayraweb</span>
        </a>
        <span className="topbar-note"><span className="live-dot" /> A little something is on its way</span>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> A NEW CHAPTER, IN THE MAKING</p>
          <h1 id="hero-title">Something<br /><em>beautiful</em><br />is coming.</h1>
          <p className="hero-description">
            We’re making room for something good. Until the lights come on,
            stay for a song.
          </p>
          <div className="launch-note">
            <span className="launch-note-icon" aria-hidden="true">✳</span>
            <span>Made with care. Arriving soon.</span>
          </div>
        </div>

        <aside className="music-card" aria-label="Music player">
          <div className="player-heading">
            <span className="player-kicker">THE WAITING ROOM</span>
            <span className="player-live"><span className="live-dot" /> NOW PLAYING</span>
          </div>

          <div className="record-scene">
            <div className={`vinyl-record${isPlaying ? ' is-spinning' : ''}`} aria-hidden="true">
              <div className="vinyl-grooves" />
              <div className="vinyl-label">
                <span className="label-top">AYRAWEB · SIDE A</span>
                <span className="label-monogram">a</span>
                <span className="label-bottom">COMING SOON</span>
              </div>
              <span className="vinyl-hole" />
            </div>
            <div className="record-shadow" />
            <span className="spark spark-one" aria-hidden="true">✳</span>
            <span className="spark spark-two" aria-hidden="true">✦</span>
          </div>

          <div className="track-row">
            <button
              className="play-button"
              type="button"
              onClick={togglePlayback}
              disabled={!playerReady}
              aria-label={isPlaying ? 'Pause I Wanna Be Yours' : 'Play I Wanna Be Yours'}
              title={playerReady ? (isPlaying ? 'Pause track' : 'Play track') : 'Loading Spotify player'}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM15 5h3v14h-3z" fill="currentColor" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.8c0-.8.9-1.3 1.6-.9l10 6.2a1 1 0 0 1 0 1.7l-10 6.2c-.7.4-1.6-.1-1.6-.9V5.8Z" fill="currentColor" /></svg>
              )}
            </button>
            <div className="track-copy">
              <p className="track-title">I Wanna Be Yours</p>
              <p className="track-artist">Arctic Monkeys <span>·</span> AM</p>
            </div>
            <div className={`equalizer${isPlaying ? ' is-active' : ''}`} aria-hidden="true">
              {[1, 2, 3, 4, 5].map((bar) => <span key={bar} />)}
            </div>
          </div>

          <div className="spotify-embed-wrap">
            <div ref={embedRef} className="spotify-embed" aria-label="Official Spotify track player" />
          </div>
          <div className="player-footer">
            <span>{playerFailed ? 'Spotify did not load in this browser.' : playerReady ? 'Press play and take a breath.' : 'Waking up the record player…'}</span>
            <a href={TRACK_URL} target="_blank" rel="noreferrer">Open in Spotify <span aria-hidden="true">↗</span></a>
          </div>
        </aside>
      </section>

      <footer className="footer">
        <span>AYRAWEB © 2026</span>
        <span className="footer-center"><span className="footer-star">✳</span> See you soon</span>
        <span>MADE FOR WHAT’S NEXT</span>
      </footer>
    </main>
  )
}
