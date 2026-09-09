'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Bot, ChevronRight, Loader2, RotateCcw, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'

const suggestions = ['What does /config do?', 'Show moderation commands', 'How do I set up Ayra?']

export function AyraChat() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })
  const isLoading = status === 'submitted' || status === 'streaming'

  async function submit(value?: string) {
    const text = (value ?? input).trim()
    if (!text || isLoading) return
    setInput('')
    await sendMessage({ text })
  }

  return (
    <div className="border border-border bg-card shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary"><Sparkles className="size-4" /></span>
          <div><p className="text-sm font-semibold">Ask Ayra</p><p className="text-xs text-muted-foreground">Command guidance, instantly</p></div>
        </div>
        <button type="button" onClick={() => setMessages([])} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Clear conversation"><RotateCcw className="size-4" /></button>
      </div>
      <div className="flex min-h-64 max-h-[25rem] flex-col gap-3 overflow-y-auto p-4 sm:p-5">
        {messages.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center py-6 text-center"><Bot className="size-8 text-primary" /><p className="mt-3 font-medium">What can I help you find?</p><p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">Ask about any Ayra command or how to configure your server.</p><div className="mt-5 flex flex-wrap justify-center gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => submit(suggestion)} className="inline-flex items-center gap-1.5 border border-border bg-secondary px-2.5 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">{suggestion}<ChevronRight className="size-3" /></button>)}</div></div> : messages.map((message) => <div key={message.id} className={`max-w-[92%] border border-border p-3 text-sm leading-6 ${message.role === 'user' ? 'self-end bg-primary text-primary-foreground' : 'bg-secondary'}`}><div className="mb-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] opacity-70">{message.role === 'user' ? 'You' : 'Ayra'}</div><div>{message.parts.map((part, index) => part.type === 'text' ? <span key={`${message.id}-${index}`}>{part.text}</span> : null)}</div></div>)}
        {isLoading && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="size-4 animate-spin text-primary" /> Ayra is thinking…</div>}
        {error && <p className="text-xs leading-5 text-destructive">{error.message || 'Ayra could not respond right now. Please try again.'} Refresh the page and retry.</p>}
      </div>
      <form onSubmit={(event) => { event.preventDefault(); void submit() }} className="flex gap-2 border-t border-border p-3 sm:p-4"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); void submit() } }} placeholder="Ask about a command…" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground" aria-label="Ask Ayra a question" /><button type="submit" disabled={!input.trim() || isLoading} className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message"><Send className="size-4" /></button></form>
    </div>
  )
}
