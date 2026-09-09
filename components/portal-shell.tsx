'use client'

import type { ReactNode } from 'react'
import { Bot, BookOpen, ExternalLink, LayoutDashboard, Menu, UserRound, X, MessageSquare } from 'lucide-react'
import { useState } from 'react'

const iconUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-I4IuZkcMvLdncAGMhjRGHiGnRSmjKW.png'

const navigation = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/ai', label: 'Ask Ayra', icon: MessageSquare },
  { href: '/commands', label: 'Commands', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: UserRound },
]

export function PortalShell({ children, active, userName, userImage }: { children: ReactNode; active: string; userName: string; userImage?: string }) {
  const [open, setOpen] = useState(false)
  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2.5" aria-label="Ayra overview"><img src={iconUrl} alt="Ayra logo" className="size-9 rounded-xl object-cover ring-1 ring-white/10" /><span className="font-mono text-lg font-bold tracking-tight">ayra<span className="text-primary">.</span></span></a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Portal navigation">{navigation.map(({ href, label, icon: Icon }) => <a key={href} href={href} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${active === href ? 'bg-primary/10 font-semibold text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}><Icon className="size-4" />{label}</a>)}</nav>
        <div className="hidden items-center gap-3 md:flex"><div className="flex items-center gap-2 text-right"><div><p className="max-w-28 truncate text-xs font-medium">{userName}</p><p className="text-[10px] text-muted-foreground">Member</p></div>{userImage ? <img src={userImage} alt={`${userName}'s avatar`} className="size-8 rounded-full object-cover ring-2 ring-primary/20" /> : <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{userName.slice(0, 1).toUpperCase()}</span>}</div></div>
        <button type="button" className="rounded-lg border border-border p-2 md:hidden" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </div>
      {open && <nav className="border-t border-border bg-card px-4 py-3 md:hidden" aria-label="Mobile portal navigation">{navigation.map(({ href, label, icon: Icon }) => <a key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${active === href ? 'bg-primary/10 font-semibold text-primary' : 'text-muted-foreground'}`}><Icon className="size-4" />{label}</a>)}</nav>}
    </header>
    <div className="pointer-events-none fixed inset-0 -z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
    <main className="relative z-10">{children}</main>
  </div>
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end"><div><p className="font-mono text-xs font-semibold tracking-[0.2em] text-primary">{eyebrow}</p><h1 className="mt-3 text-balance font-mono text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{description}</p></div>{action}</div>
}

export function ExternalLinkButton({ href, children }: { href: string; children: ReactNode }) { return <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-secondary">{children}<ExternalLink className="size-3.5" /></a> }

export { navigation }

export function BotMark() { return <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary"><Bot className="size-5" /></span> }

export function UserMark({ userName, userImage }: { userName: string; userImage?: string }) { return userImage ? <img src={userImage} alt={`${userName}'s avatar`} className="size-16 rounded-2xl object-cover ring-2 ring-primary/25" /> : <span className="grid size-16 place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">{userName.slice(0, 1).toUpperCase()}</span> }

export function PortalFooter() { return <footer className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8"><div className="flex flex-col justify-between gap-3 border-t border-border pt-6 sm:flex-row"><span>Ayra · built for calmer Discord communities</span><a href="/" className="text-primary hover:underline">Back to overview</a></div></footer> }

export { iconUrl }

export default PortalShell

