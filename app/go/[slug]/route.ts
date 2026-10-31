import { NextRequest, NextResponse } from 'next/server'
import { findManagedRedirect } from '@/lib/redirect-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ slug: string }> }

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { slug } = await params
  const link = await findManagedRedirect(slug, 'path')
  if (!link) return new NextResponse('Short link not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  return NextResponse.redirect(link.destination, {
    status: 302,
    headers: { 'Cache-Control': 'no-store' },
  })
}
