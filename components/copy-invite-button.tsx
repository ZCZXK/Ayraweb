'use client'

import { useState } from 'react'

export function CopyInviteButton({ inviteUrl }: { inviteUrl: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setState('copied')
    } catch {
      setState('error')
    }
  }

  const label = state === 'copied' ? 'Invite copied' : state === 'error' ? 'Copy unavailable' : 'Copy invite'

  return (
    <button className="text-link copy-invite" type="button" onClick={copyInvite} aria-label={label}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="8" y="8" width="11.5" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </svg>
      <span>{label}</span>
    </button>
  )
}
