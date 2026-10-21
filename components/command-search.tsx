'use client'

import { useMemo, useState } from 'react'

type SearchCommand = { name: string; category: string }

export function CommandSearch({ commands }: { commands: SearchCommand[] }) {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState('')
  const [message, setMessage] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  const groups = useMemo(() => {
    const filtered = normalizedQuery
      ? commands.filter(({ name, category }) => `${name} ${category}`.toLowerCase().includes(normalizedQuery))
      : commands
    const grouped = new Map<string, string[]>()
    for (const { name, category } of filtered) {
      const entries = grouped.get(category) ?? []
      entries.push(name)
      grouped.set(category, entries)
    }
    return Array.from(grouped, ([category, names]) => ({ category, names }))
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
      {groups.length ? (
        <div className="command-catalog" aria-label="Ayra slash commands">
          {groups.map(({ category, names }) => (
            <section className="command-group glass-panel" key={category} aria-label={category}>
              <h3>{category}</h3>
              <div className="command-list">
                {names.map((name) => (
                  <button
                    className="command-chip"
                    key={name}
                    type="button"
                    onClick={() => copyCommand(name)}
                    aria-label={copied === name ? `Copied ${name}` : `Copy ${name}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : <p className="command-empty">No matches</p>}
      {message && <span className="command-search-feedback" role="status">{message}</span>}
    </div>
  )
}
