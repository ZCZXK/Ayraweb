import { createAuth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import LandingExperience from '@/components/landing-experience'

export const dynamic = 'force-dynamic'

export default async function SignInPage() {
  const auth = createAuth()
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/')
  return <LandingExperience />
}
