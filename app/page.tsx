'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

export default function Home() {
  const playerRef = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const command = playing ? 'playVideo' : 'pauseVideo'
    playerRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), 'https://www.youtube-nocookie.com')
  }, [playing])

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-black text-white">
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-36 text-center">
        <h1 className="text-[clamp(3.5rem,14vw,10rem)] font-semibold leading-[0.86] tracking-[-0.1em] text-white">Something<br /><span className="text-white/35">beautiful</span><br />is coming.</h1>
      </section>

      <div className="fixed bottom-5 left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-xs -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[#111]/95 p-2.5 shadow-2xl shadow-black/70 backdrop-blur sm:bottom-6">
        <iframe ref={playerRef} title="I Wanna Be Yours audio" src="https://www.youtube-nocookie.com/embed/nyuo9-OjNNg?enablejsapi=1&controls=0&playsinline=1&rel=0&playlist=nyuo9-OjNNg,dX3k_QDnzHE" className="pointer-events-none absolute size-px opacity-0" allow="autoplay; encrypted-media" />
        <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? 'Pause music' : 'Play music'} className={`grid size-12 shrink-0 place-items-center rounded-full bg-white text-black transition hover:scale-105 ${playing ? 'animate-[spin_5s_linear_infinite]' : ''}`}>
          {playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="ml-0.5 size-4" fill="currentColor" />}
        </button>
        <div className="min-w-0 flex-1 text-left"><p className="truncate text-xs font-medium tracking-wide text-white">I WANNA BE YOURS</p><div className={`mt-2 flex h-3 items-end gap-0.5 ${playing ? 'music-bars' : 'opacity-25'}`} aria-hidden="true">{[6,10,7,12,8,11,6,9,5,8].map((height, index) => <span key={index} style={{ height }} className="w-0.5 rounded-full bg-white/70" />)}</div></div>
      </div>
    </main>
  )
}
