import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import AyraHome from '@/components/ayra-home'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <AyraHome userName={session.user.name} userImage={session.user.image ?? undefined} />
}
