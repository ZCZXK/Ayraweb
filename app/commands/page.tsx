import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { BookOpen, Search } from 'lucide-react'
import PortalShell, { PageHeader, PortalFooter } from '@/components/portal-shell'
import { commandGroups, totalCommands } from '@/lib/command-catalog'

export default async function CommandsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <PortalShell active="/commands" userName={session.user.name} userImage={session.user.image ?? undefined}><div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:px-8"><PageHeader eyebrow="COMMAND CENTER" title="Every command, organized." description={`Browse Ayra’s ${totalCommands}+ commands by what you need to do.`} action={<div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground"><Search className="size-4" /> Browse catalog</div>} /><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{commandGroups.map((group) => <article key={group.name} className="rounded-2xl border border-border/80 bg-card/80 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40"><div className="flex items-start justify-between gap-4"><div><div className="mb-3 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><BookOpen className="size-4" /></div><h2 className="font-mono text-base font-bold">{group.name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{group.description}</p></div><span className="rounded-full bg-secondary px-2 py-1 font-mono text-[10px] text-muted-foreground">{group.commands.length}</span></div><div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">{group.commands.map((command) => <span key={command} className="rounded-md bg-secondary px-2.5 py-1.5 font-mono text-xs text-primary">/{command}</span>)}</div></article>)}</div></div><PortalFooter /></PortalShell>
}

