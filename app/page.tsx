import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { discordGuild } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import ServerDashboard from '@/components/server-dashboard'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const guilds = await db.select({ id: discordGuild.id, name: discordGuild.name, memberCount: discordGuild.memberCount }).from(discordGuild).where(eq(discordGuild.userId, session.user.id))
  return <ServerDashboard userName={session.user.name} userImage={session.user.image ?? undefined} guilds={guilds} />
}
