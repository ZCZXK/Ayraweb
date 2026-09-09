'use client'

import { Bot, ChevronRight, Loader2, RotateCcw, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'

type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string }

const suggestions = ['What does /profile do?', 'How do I use /iq?', 'What permissions does /ban need?']

export function AyraChat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(value?: string) {
    const text = (value ?? input).trim()
    if (!text || isLoading) return
    const userMessage = { id: crypto.randomUUID(), role: 'user' as const, text }
    setInput('')
    setError('')
    setMessages((current) => [...current, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || typeof data.answer !== 'string') throw new Error(data.error || 'Ayra could not answer right now.')
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', text: data.answer }])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ayra could not answer right now.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl shadow-black/20" aria-label="Ayra assistant">
      <header className="flex items-center justify-between border-b border-border/80 bg-secondary/30 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
            <Sparkles className="size-[18px]" />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-card" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2"><p className="truncate text-sm font-semibold">Ask Ayra</p><span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">ONLINE</span></div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">Discord command intelligence</p>
          </div>
        </div>
        <button type="button" onClick={() => { setMessages([]); setError('') }} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Clear conversation"><RotateCcw className="size-4" /></button>
      </header>

      <div className="flex min-h-72 max-h-[28rem] flex-col gap-4 overflow-y-auto p-4 sm:p-5">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Bot className="size-6" /></span>
            <p className="mt-4 text-sm font-semibold">What can I help you with?</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">Get clear answers about commands, permissions, and server setup.</p>
            <div className="mt-6 flex w-full max-w-md flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void submit(suggestion)} className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/40 px-3 py-2 text-left text-xs text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{suggestion}<ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" /></button>)}
            </div>
          </div>
        ) : (
          messages.map((message) => <div key={message.id} className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${message.role === 'user' ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md border border-border/80 bg-secondary/70'}`}><div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">{message.role === 'user' ? 'You' : 'Ayra'}</div><div className="whitespace-pre-wrap">{message.text}</div></div></div>)
        )}
        {isLoading && <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground"><span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary"><Loader2 className="size-3.5 animate-spin" /></span> Ayra is thinking…</div>}
        {error && <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive">{error}</p>}
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void submit() }} className="border-t border-border/80 bg-secondary/20 p-3 sm:p-4">
        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/70 p-1.5 pl-3 transition-colors focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10">
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about an Ayra command…" className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground" aria-label="Ask Ayra a question" />
          <button type="submit" disabled={!input.trim() || isLoading} className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message">{isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}</button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground/70">Ayra provides guidance only — it never changes your server from this chat.</p>
      </form>
    </section>
  )
}
