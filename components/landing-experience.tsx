'use client'

import { useEffect, useState } from 'react'
import { Headphones, LogIn, Music2, Pause, Play, Volume2 } from 'lucide-react'
import { signIn } from '@/lib/auth-client'

export default function LandingExperience() {
  const [phase, setPhase] = useState<'intro' | 'loading' | 'login'>('intro')
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setPhase('loading'), 2400)
    const loginTimer = window.setTimeout(() => setPhase('login'), 4300)
    return () => { window.clearTimeout(loadingTimer); window.clearTimeout(loginTimer) }
  }, [])

  return <main className="relative flex min-h-screen overflow-hidden bg-[#030406] text-slate-100">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(210,218,232,0.1),transparent_30%),linear-gradient(115deg,rgba(255,255,255,0.035),transparent_30%)]" />
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12">
      <header className="flex items-center justify-between"><div className="font-mono text-sm tracking-[0.35em] text-slate-400">AYRA / 2026</div><div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500"><span className="size-1.5 rounded-full bg-slate-300 shadow-[0_0_16px_rgba(226,232,240,0.9)]" /> private portal</div></header>
      <section className="flex flex-1 items-center justify-center pb-28 pt-16 text-center">
        {phase !== 'login' ? <div className="animate-[fade-in_1.2s_ease-out]"><p className="font-mono text-[10px] uppercase tracking-[0.55em] text-slate-500">discord intelligence</p><h1 className="mt-5 bg-gradient-to-b from-white via-slate-300 to-slate-600 bg-clip-text font-mono text-7xl font-bold tracking-[-0.12em] text-transparent drop-shadow-[0_0_32px_rgba(226,232,240,0.18)] sm:text-9xl">ayra</h1><div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />{phase === 'loading' && <p className="mt-6 animate-pulse font-mono text-[10px] uppercase tracking-[0.35em] text-slate-500">Preparing your portal</p>}</div> : <div className="w-full max-w-md animate-[fade-in_0.8s_ease-out]"><p className="font-mono text-xs uppercase tracking-[0.35em] text-slate-500">welcome to ayra</p><h1 className="mt-5 font-mono text-5xl font-bold tracking-[-0.08em] text-slate-100 sm:text-6xl">Enter the portal.</h1><p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-slate-400">Manage your Discord servers, view live bot data, and keep every community moving.</p><button onClick={() => signIn.social({ provider: 'discord', callbackURL: '/' })} className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-slate-100 px-5 font-semibold text-slate-950 transition hover:bg-white"><LogIn className="size-4" /> Continue with Discord</button><p className="mt-4 text-xs text-slate-600">Your Discord password is never shared with Ayra.</p></div>}
      </section>
      <MusicPanel playing={playing} onToggle={() => setPlaying(!playing)} />
    </div>
  </main>
}

function MusicPanel({ playing, onToggle }: { playing: boolean; onToggle: () => void }) { return <aside className="fixed inset-x-4 bottom-4 z-20 mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:bottom-6"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-slate-300"><Music2 className="size-5" /></span><div className="min-w-0 flex-1 text-left"><p className="truncate text-sm font-medium text-slate-200">I WANNA BE YOURS</p><p className="text-xs text-slate-500">Music panel · paused by default</p></div><button onClick={onToggle} className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-slate-300 transition hover:bg-white/15" aria-label={playing ? 'Pause music' : 'Play music'}>{playing ? <Pause className="size-4" /> : <Play className="size-4" />}</button><Volume2 className="hidden size-4 text-slate-600 sm:block" /><Headphones className="hidden size-4 text-slate-600 sm:block" /></aside> }
