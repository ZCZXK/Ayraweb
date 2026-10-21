import { createAuth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import type { NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  return toNextJsHandler(createAuth()).GET(request)
}

export function POST(request: NextRequest) {
  return toNextJsHandler(createAuth()).POST(request)
}
