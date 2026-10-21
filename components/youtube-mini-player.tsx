'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'

const VIDEO_ID = 'nyuo9-OjNNg'
const IFRAME_API_URL = 'https://www.youtube.com/iframe_api'

type YouTubePlayer = {
  playVideo(): void
  pauseVideo(): void
  getPlayerState(): number
  destroy(): void
}

type YouTubePlayerEvent = { target: YouTubePlayer; data?: number }
type YouTubePlayerOptions = {
  width: number
  height: number
  videoId: string
  playerVars: { playsinline: 1; controls: 1; rel: 0; origin: string }
  events: {
    onReady: (event: YouTubePlayerEvent) => void
    onStateChange: (event: YouTubePlayerEvent) => void
    onError: () => void
  }
}

type YouTubeAPI = {
  Player: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer
  PlayerState: { PLAYING: number }
}

declare global {
  interface Window {
    YT?: YouTubeAPI
    onYouTubeIframeAPIReady?: () => void
    ayraYouTubeAPI?: YouTubeAPI
  }
}

let apiPromise: Promise<YouTubeAPI> | null = null

function loadYouTubeAPI(): Promise<YouTubeAPI> {
  if (window.ayraYouTubeAPI) return Promise.resolve(window.ayraYouTubeAPI)
  if (window.YT?.Player) {
    window.ayraYouTubeAPI = window.YT
    return Promise.resolve(window.YT)
  }
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady
    let settled = false

    const restoreCallback = () => {
      if (window.onYouTubeIframeAPIReady === onReady) window.onYouTubeIframeAPIReady = previousCallback
    }
    const fail = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      restoreCallback()
      apiPromise = null
      reject(new Error('YouTube player failed to load'))
    }
    const onReady = () => {
      if (settled) return
      if (!window.YT?.Player) {
        fail()
        return
      }
      settled = true
      window.clearTimeout(timeout)
      window.ayraYouTubeAPI = window.YT
      restoreCallback()
      try { previousCallback?.() } catch { /* Keep Ayra's player independent of other callbacks. */ }
      resolve(window.YT)
    }

    window.onYouTubeIframeAPIReady = onReady
    const timeout = window.setTimeout(fail, 20000)
    const script = document.createElement('script')
    script.src = IFRAME_API_URL
    script.async = true
    script.onerror = fail
    document.body.appendChild(script)
  })

  return apiPromise
}

type YouTubePlayerHostProps = {
  onReady: (player: YouTubePlayer) => void
  onPlaybackUpdate: (playing: boolean) => void
  onUnavailable: () => void
}

const YouTubePlayerHost = memo(function YouTubePlayerHost({ onReady, onPlaybackUpdate, onUnavailable }: YouTubePlayerHostProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const localPlayer = useRef<YouTubePlayer | null>(null)

  useEffect(() => {
    let active = true
    const mount = mountRef.current
    if (!mount) return

    loadYouTubeAPI()
      .then((api) => {
        if (!active) return
        const width = Math.max(200, Math.floor(mount.getBoundingClientRect().width))
        const player = new api.Player(mount, {
          width,
          height: 200,
          videoId: VIDEO_ID,
          playerVars: {
            playsinline: 1,
            controls: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (!active) {
                event.target.destroy()
                return
              }
              localPlayer.current = event.target
              onReady(event.target)
            },
            onStateChange: (event) => onPlaybackUpdate(event.data === api.PlayerState.PLAYING),
            onError: () => { if (active) onUnavailable() },
          },
        })
        localPlayer.current = player
      })
      .catch(() => { if (active) onUnavailable() })

    return () => {
      active = false
      localPlayer.current?.destroy()
      localPlayer.current = null
    }
  }, [onReady, onPlaybackUpdate, onUnavailable])

  return <div className="youtube-player-mount" ref={mountRef} aria-label="YouTube video player" />
})

export function YouTubeMiniPlayer() {
  const playerRef = useRef<YouTubePlayer | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  const handleReady = useCallback((player: YouTubePlayer) => {
    playerRef.current = player
    setIsReady(true)
  }, [])
  const handlePlaybackUpdate = useCallback((playing: boolean) => setIsPlaying(playing), [])
  const handleUnavailable = useCallback(() => setUnavailable(true), [])

  function togglePlayback() {
    if (!showPlayer) {
      setShowPlayer(true)
      return
    }
    const player = playerRef.current
    if (!player) return
    if (player.getPlayerState() === 1) player.pauseVideo()
    else player.playVideo()
  }

  return (
    <div className="music-player-reveal" data-reveal="up">
      <div className={`music-player glass-panel${isPlaying ? ' music-player--playing' : ''}`} role="group" aria-label="I Wanna Be Yours by Arctic Monkeys music player">
        <button
          className="music-play-button"
          type="button"
          onClick={togglePlayback}
          disabled={showPlayer && (!isReady || unavailable)}
          aria-label={!showPlayer ? 'Show the YouTube player for I Wanna Be Yours' : isPlaying ? 'Pause I Wanna Be Yours' : 'Play I Wanna Be Yours'}
        >
          <span className="music-record" aria-hidden="true"><span className="music-record-center" /></span>
          <svg className="music-control-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {isPlaying ? <><rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/></> : <path d="M8 5.9c0-.8.87-1.28 1.54-.84l9.2 6.1a1 1 0 0 1 0 1.68l-9.2 6.1A1 1 0 0 1 8 18.1V5.9Z"/>}
          </svg>
        </button>
        <div className="music-track-info">
          <strong>I Wanna Be Yours</strong>
          <span>Arctic Monkeys</span>
          {unavailable && <span className="music-track-error" role="status">YouTube unavailable</span>}
        </div>
        {showPlayer && <div className="music-player-embed">
          <YouTubePlayerHost onReady={handleReady} onPlaybackUpdate={handlePlaybackUpdate} onUnavailable={handleUnavailable} />
        </div>}
      </div>
    </div>
  )
}
