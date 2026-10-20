'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Pause, Play } from 'lucide-react'

export default function Home() {
  const playerRef = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const command = playing ? 'playVideo' : 'pauseVideo'
    playerRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), 'https://www.youtube-nocookie.com')
  }, [playing])

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
          <span>AYRA</span><span>EST. 2026</span>
        </header>
        <section className="flex flex-1 flex-col justify-center py-24">
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.32em] text-white/40">A new signal is forming</p>
          <h1 className="max-w-4xl text-[clamp(4rem,14vw,11rem)] font-semibold leading-[0.82] tracking-[-0.09em] text-white">Something<br /><span className="text-white/35">beautiful</span><br />is coming.</h1>
          <div className="mt-12 flex max-w-md items-start justify-between gap-8 border-t border-white/10 pt-5 text-sm leading-6 text-white/50"><p>We are building a quieter, sharper place for what comes next.</p><ArrowUpRight className="mt-1 size-4 shrink-0 text-white/70" /></div>
        </section>
        <footer className="flex items-end justify-between border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35"><span>AYRA / PRIVATE BUILD</span><span className="hidden sm:inline">COMING SOON</span></footer>
      </div>

      <div className="fixed bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/90 p-2 pr-5 shadow-2xl shadow-black/60 backdrop-blur sm:bottom-6">
        <iframe ref={playerRef} title="I Wanna Be Yours audio" src="https://www.youtube-nocookie.com/embed/nyuo9-OjNNg?enablejsapi=1&controls=0&playsinline=1&rel=0" className="pointer-events-none absolute size-px opacity-0" allow="autoplay; encrypted-media" />
        <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? 'Pause I Wanna Be Yours' : 'Play I Wanna Be Yours'} className={`grid size-14 shrink-0 place-items-center rounded-full border border-white/20 bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.14)] transition hover:scale-105 ${playing ? 'animate-[spin_5s_linear_infinite]' : ''}`}>
          {playing ? <Pause className="size-5" fill="currentColor" /> : <Play className="ml-1 size-5" fill="currentColor" />}
        </button>
        <div className="min-w-0 text-left"><p className="whitespace-nowrap text-sm font-medium text-white">I WANNA BE YOURS</p><p className="text-xs text-white/40">Arctic Monkeys</p></div>
      </div>
    </main>
  )
}
