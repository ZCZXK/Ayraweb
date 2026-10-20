import { ArrowUpRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
          <span>AYRA</span>
          <span>EST. 2026</span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-24">
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.32em] text-white/40">A new signal is forming</p>
          <h1 className="max-w-4xl text-[clamp(4rem,14vw,11rem)] font-semibold leading-[0.82] tracking-[-0.09em] text-white">
            Something<br /><span className="text-white/35">beautiful</span><br />is coming.
          </h1>
          <div className="mt-12 flex max-w-md items-start justify-between gap-8 border-t border-white/10 pt-5 text-sm leading-6 text-white/50">
            <p>We are building a quieter, sharper place for what comes next.</p>
            <ArrowUpRight className="mt-1 size-4 shrink-0 text-white/70" />
          </div>
        </section>

        <footer className="flex items-end justify-between border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          <span>AYRA / PRIVATE BUILD</span>
          <span className="hidden sm:inline">COMING SOON</span>
        </footer>
      </div>

      <div className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-xs -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black/60 sm:bottom-6">
        <iframe title="I Wanna Be Yours" src="https://www.youtube-nocookie.com/embed/nyuo9-OjNNg?controls=1&playsinline=1&rel=0" className="block h-20 w-full border-0" allow="encrypted-media" />
      </div>
    </main>
  )
}
