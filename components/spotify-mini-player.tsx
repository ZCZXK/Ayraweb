'use client'

import { useEffect, useRef, useState } from 'react'

const TRACK_URI = 'spotify:track:5XeFesFbtLpXzIVDNQP22n'
const IFRAME_API_URL = 'https://open.spotify.com/embed/iframe-api/v1'

type PlaybackUpdate = { data: { isPaused: boolean } }

type SpotifyEmbedController = {
  resume(): void
  pause(): void
  addListener(event: 'playback_update', listener: (event: PlaybackUpdate) => void): void
  destroy(): void
}

type SpotifyIframeAPI = {
  createController(
    element: HTMLElement,
    options: { uri: string; width: string | number; height: number },
    callback: (controller: SpotifyEmbedController) => void,
  ): void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeAPI) => void
    ayraSpotifyIframeAPI?: SpotifyIframeAPI
  }
}

let spotifyApiPromise: Promise<SpotifyIframeAPI> | null = null

function loadSpotifyIframeAPI(): Promise<SpotifyIframeAPI> {
  if (window.ayraSpotifyIframeAPI) return Promise.resolve(window.ayraSpotifyIframeAPI)
  if (spotifyApiPromise) return spotifyApiPromise

  spotifyApiPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onSpotifyIframeApiReady
    let settled = false

    const restoreCallback = (callback: (api: SpotifyIframeAPI) => void) => {
      if (window.onSpotifyIframeApiReady === callback) window.onSpotifyIframeApiReady = previousCallback
    }

    const fail = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      restoreCallback(onReady)
      spotifyApiPromise = null
      reject(new Error('Spotify player failed to load'))
    }

    const onReady = (api: SpotifyIframeAPI) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      window.ayraSpotifyIframeAPI = api
      restoreCallback(onReady)
      try { previousCallback?.(api) } catch { /* Keep Ayra's player independent of other callbacks. */ }
      resolve(api)
    }

    window.onSpotifyIframeApiReady = onReady
    const timeout = window.setTimeout(fail, 15000)
    const script = document.createElement('script')
    script.src = IFRAME_API_URL
    script.async = true
    script.onerror = fail
    document.body.appendChild(script)
  })

  return spotifyApiPromise
}

export function SpotifyMiniPlayer() {
  const embedRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<SpotifyEmbedController | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let active = true
    const element = embedRef.current
    if (!element) return

    loadSpotifyIframeAPI()
      .then((api) => {
        if (!active) return
        api.createController(element, { uri: TRACK_URI, width: '100%', height: 80 }, (controller) => {
          if (!active) {
            controller.destroy()
            return
          }
          controllerRef.current = controller
          controller.addListener('playback_update', (event) => setIsPlaying(!event.data.isPaused))
          setIsReady(true)
        })
      })
      .catch(() => { if (active) setUnavailable(true) })

    return () => {
      active = false
      controllerRef.current?.destroy()
      controllerRef.current = null
    }
  }, [])

  function togglePlayback() {
    const controller = controllerRef.current
    if (!controller) return
    if (isPlaying) controller.pause()
    else controller.resume()
  }

  return (
    <div className={`music-player glass-panel${isPlaying ? ' music-player--playing' : ''}`} data-reveal="up" role="group" aria-label="I Wanna Be Yours by Arctic Monkeys music player">
      <button
        className="music-play-button"
        type="button"
        onClick={togglePlayback}
        disabled={!isReady}
        aria-label={isPlaying ? 'Pause I Wanna Be Yours' : 'Play I Wanna Be Yours'}
      >
        <span className="music-record" aria-hidden="true"><span className="music-record-center" /></span>
        <svg className="music-control-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {isPlaying ? <><rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/></> : <path d="M8 5.9c0-.8.87-1.28 1.54-.84l9.2 6.1a1 1 0 0 1 0 1.68l-9.2 6.1A1 1 0 0 1 8 18.1V5.9Z"/>}
        </svg>
      </button>
      <div className="music-track-info">
        <span className="music-track-label">On repeat</span>
        <strong>I Wanna Be Yours</strong>
        <span>Arctic Monkeys</span>
      </div>
      <div className="music-player-embed" aria-label="Spotify embedded player">
        {unavailable
          ? <span className="spotify-player-error" role="status">Spotify unavailable</span>
          : <div ref={embedRef} className="spotify-embed-mount" />}
      </div>
    </div>
  )
}
