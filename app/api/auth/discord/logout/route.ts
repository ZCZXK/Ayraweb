import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, hasSameOrigin, SESSION_COOKIE, STATE_COOKIE } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })

  const response = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  for (const name of [SESSION_COOKIE, STATE_COOKIE]) {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 0,
    })
  }
  return response
}
