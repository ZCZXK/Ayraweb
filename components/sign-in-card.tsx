'use client'

import { useState } from 'react'
import { LogIn, ShieldCheck } from 'lucide-react'
import { signIn } from '@/lib/auth-client'

const iconUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-I4IuZkcMvLdncAGMhjRGHiGnRSmjKW.png'

export default function SignInCard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDiscordLogin() {
    setLoading(true)
    setError('')
    const result = await signIn.social({ provider: 'discord', callbackURL: `${window.location.origin}/` })
    if (result.error) {
      setError('Discord login could not be started. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-10 text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <section className="relative w-full max-w-md border border-border bg-card p-7 shadow-2xl sm:p-9" aria-labelledby="sign-in-title">
        <div className="flex items-center gap-3"><img src={iconUrl} alt="Ayra logo" className="size-11 rounded-xl object-cover ring-1 ring-white/10" /><div><p className="font-mono text-lg font-bold tracking-tight">ayra<span className="text-primary">.</span></p><p className="text-xs text-muted-foreground">Discord community assistant</p></div></div>
        <div className="mt-10"><p className="font-mono text-xs font-semibold tracking-[0.2em] text-primary">MEMBERS ONLY</p><h1 id="sign-in-title" className="mt-3 text-3xl font-bold tracking-tight">Welcome to Ayra.</h1><p className="mt-3 leading-7 text-muted-foreground">Sign in with Discord to explore the command center and manage your Ayra experience.</p></div>
        <button type="button" onClick={handleDiscordLogin} disabled={loading} className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"><LogIn className="size-4" />{loading ? 'Connecting to Discord…' : 'Continue with Discord'}</button>
        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
        <div className="mt-7 flex items-start gap-3 border-t border-border pt-5 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /><span>Ayra uses Discord OAuth. We never see your password.</span></div>
      </section>
    </main>
  )
}
