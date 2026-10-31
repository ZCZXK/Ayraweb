import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Owner sign in — Ayra',
  robots: { index: false, follow: false, noarchive: true },
}

const ERROR_COPY: Record<string, string> = {
  invalid: 'Sign-in could not be verified. Please try again.',
  denied: 'Discord sign-in was cancelled.',
  exchange: 'Discord could not complete sign-in. Please try again.',
  identity: 'Discord could not verify the account.',
  unauthorized: 'This Discord account is not allowed to manage Ayra links.',
  unavailable: 'Owner sign-in is temporarily unavailable.',
}

type LoginPageProps = { searchParams: Promise<{ error?: string }> }

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await getAdminSession()) redirect('/admin/redirects')
  const { error } = await searchParams

  return (
    <main className="admin-auth-shell">
      <section className="admin-auth-card">
        <Image src="/bot-icon.png" alt="Ayra" width={54} height={54} priority />
        <p className="eyebrow">PRIVATE AREA</p>
        <h1>Ayra links</h1>
        <p className="admin-auth-copy">Sign in with the owner Discord account to manage redirects.</p>
        {error && <p className="admin-message admin-message--error" role="alert">{ERROR_COPY[error] ?? ERROR_COPY.invalid}</p>}
        <a className="glass-button glass-button--primary admin-auth-button" href="/api/auth/discord/login">
          Continue with Discord
        </a>
        <a className="admin-back-link" href="/">Back to Ayra</a>
      </section>
    </main>
  )
}
