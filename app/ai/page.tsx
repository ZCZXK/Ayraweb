import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AyraChat } from '@/components/ayra-chat'
import PortalShell, { PageHeader, PortalFooter } from '@/components/portal-shell'

export default async function AiPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <PortalShell active="/ai" userName={session.user.name} userImage={session.user.image ?? undefined}><div className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:px-8"><PageHeader eyebrow="AYRA ASSISTANT" title="Ask anything about your server." description="Get clear explanations about commands, permissions, setup, or everyday questions. Ayra provides guidance without changing your server." /><div className="mt-8"><AyraChat /></div></div><PortalFooter /></PortalShell>
}

