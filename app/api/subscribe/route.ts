import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ error: 'Request not allowed.' }, { status: 403 })
    }

    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const consent = body.consent === true
    const honeypot = typeof body.website === 'string' ? body.website.trim() : ''

    // Quietly accept automated honeypot submissions without forwarding them.
    if (honeypot) return NextResponse.json({ ok: true })
    if (!email || email.length > 254 || !emailPattern.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }
    if (!consent) {
      return NextResponse.json({ error: 'Please consent to receive Ayraweb updates.' }, { status: 400 })
    }

    const apiKey = process.env.MAILERLITE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'The waitlist is being set up. Please try again soon.' },
        { status: 503 },
      )
    }

    const groupId = process.env.MAILERLITE_GROUP_ID?.trim()
    const payload: { email: string; groups?: string[] } = { email }
    if (groupId) payload.groups = [groupId]

    const mailerLiteResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    if (!mailerLiteResponse.ok) {
      console.error('MailerLite rejected a waitlist submission', mailerLiteResponse.status)
      if (mailerLiteResponse.status === 422) {
        return NextResponse.json({ error: 'That email could not be added. Please check it and try again.' }, { status: 400 })
      }
      return NextResponse.json({ error: 'We could not add you right now. Please try again shortly.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'We could not add you right now. Please try again shortly.' }, { status: 400 })
  }
}
