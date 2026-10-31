import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, hasSameOrigin } from '@/lib/auth'
import { createManagedRedirect, listAllRedirects } from '@/lib/redirect-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
}

export async function GET() {
  if (!await getAdminSession()) return json({ error: 'Sign in required.' }, 401)
  try {
    return json({ links: await listAllRedirects() })
  } catch {
    return json({ error: 'The private redirect store is temporarily unavailable.' }, 503)
  }
}

export async function POST(request: NextRequest) {
  if (!await getAdminSession()) return json({ error: 'Sign in required.' }, 401)
  if (!hasSameOrigin(request)) return json({ error: 'Invalid request origin.' }, 403)

  try {
    const created = await createManagedRedirect(await request.json())
    return json({ link: created }, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save this redirect.'
    const clientError = /Use |That |Choose |Enter |limit of/i.test(message)
    return json({ error: clientError ? message : 'The redirect could not be saved.' }, clientError ? 400 : 503)
  }
}
