import { NextRequest, NextResponse } from 'next/server'
import { findManagedRedirect, type RedirectMode } from '@/lib/redirect-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ mode: string; slug: string }> }

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { mode, slug } = await params
  if (mode !== 'subdomain') return new NextResponse('Short link not found', { status: 404 })

  const link = await findManagedRedirect(slug, mode as RedirectMode)
  if (!link) return new NextResponse('Short link not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  return NextResponse.redirect(link.destination, {
    status: 302,
    headers: { 'Cache-Control': 'no-store' },
  })
}
