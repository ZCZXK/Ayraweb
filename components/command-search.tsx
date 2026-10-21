'use client'

import { useMemo, useState } from 'react'

type SearchCommand = { name: string; category: string }

export function CommandSearch({ commands }: { commands: SearchCommand[] }) {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState('')
  const [message, setMessage] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const matches = useMemo(() => {
    if (!normalizedQuery) return []
    return commands.filter(({ name, category }) => `${name} ${category}`.toLowerCase().includes(normalizedQuery))
  }, [commands, normalizedQuery])

  async function copyCommand(name: string) {
    try {
      await navigator.clipboard.writeText(name)
      setCopied(name)
      setMessage(`${name} copied`)
    } catch {
      setCopied('')
      setMessage('Clipboard unavailable')
    }
  }

  return (
    <div className="command-explorer">
      <label className="command-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.3" />
          <path d="m15.5 15.5 4.2 4.2" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setCopied(''); setMessage('') }}
          placeholder="Search commands"
          aria-label="Search Ayra commands by name or category"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      {normalizedQuery && (
        <div className="command-results" aria-label="Matching commands">
          {matches.length ? matches.map(({ name, category }) => (
            <button
              className="command-result"
              key={name}
              type="button"
              onClick={() => copyCommand(name)}
              aria-label={copied === name ? `Copied ${name}` : `Copy ${name}`}
            >
              <code>{name}</code>
              <span className="command-result-category">{category}</span>
              <span className="command-copy-label">{copied === name ? 'Copied' : 'Copy'}</span>
            </button>
          )) : <p className="command-empty">No matches</p>}
        </div>
      )}
      {message && <span className="command-search-feedback" role="status">{message}</span>}
    </div>
  )
}
