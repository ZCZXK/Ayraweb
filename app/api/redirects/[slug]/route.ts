import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, hasSameOrigin } from '@/lib/auth'
import { deleteManagedRedirect, updateManagedRedirect } from '@/lib/redirect-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ slug: string }> }

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  if (!await getAdminSession()) return json({ error: 'Sign in required.' }, 401)
  if (!hasSameOrigin(request)) return json({ error: 'Invalid request origin.' }, 403)

  try {
    const { slug } = await params
    const updated = await updateManagedRedirect(slug, await request.json())
    if (!updated) return json({ error: 'Redirect not found.' }, 404)
    return json({ link: updated })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update this redirect.'
    const clientError = /Use |That |Choose |Enter |limit of/i.test(message)
    return json({ error: clientError ? message : 'The redirect could not be updated.' }, clientError ? 400 : 503)
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!await getAdminSession()) return json({ error: 'Sign in required.' }, 401)
  if (!hasSameOrigin(request)) return json({ error: 'Invalid request origin.' }, 403)

  try {
    const { slug } = await params
    const deleted = await deleteManagedRedirect(slug)
    if (!deleted) return json({ error: 'Redirect not found.' }, 404)
    return json({ ok: true })
  } catch {
    return json({ error: 'The redirect could not be deleted.' }, 503)
  }
}
