export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 pb-28 text-center text-white">
      <section>
        <p className="text-lg text-neutral-400 sm:text-xl">Something awesome is coming soon...</p>
      </section>
      <div className="fixed inset-x-4 bottom-4 mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-neutral-950 p-3 text-left shadow-2xl shadow-black/50">
        <iframe
          title="I Wanna Be Yours by Arctic Monkeys"
          src="https://www.youtube-nocookie.com/embed/nyuo9-OjNNg?autoplay=1&controls=1&loop=1&playlist=nyuo9-OjNNg&playsinline=1&rel=0"
          className="size-16 shrink-0 rounded-lg border-0"
          allow="autoplay; encrypted-media"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">I WANNA BE YOURS</p>
          <p className="text-xs text-neutral-500">Arctic Monkeys</p>
        </div>
      </div>
    </main>
  )
}
