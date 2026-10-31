import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { RedirectManager } from '@/components/redirect-manager'
import { getAdminSession } from '@/lib/auth'
import { listAllRedirects } from '@/lib/redirect-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Redirect manager — Ayra',
  robots: { index: false, follow: false, noarchive: true },
}

export default async function RedirectManagerPage() {
  if (!await getAdminSession()) redirect('/admin/login')
  const links = await listAllRedirects()
  return <RedirectManager initialLinks={links} />
}
