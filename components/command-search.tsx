'use client'

import { useMemo, useState } from 'react'

type SearchCommand = { name: string; category: string }
const ALL_CATEGORIES = 'All categories'

export function CommandSearch({ commands }: { commands: SearchCommand[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL_CATEGORIES)
  const [copied, setCopied] = useState('')
  const [message, setMessage] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  const categories = useMemo(() => Array.from(new Set(commands.map(({ category: name }) => name))), [commands])
  const groups = useMemo(() => {
    const filtered = commands.filter(({ name, category: commandCategory }) => {
      const matchesQuery = !normalizedQuery || `${name} ${commandCategory}`.toLowerCase().includes(normalizedQuery)
      const matchesCategory = category === ALL_CATEGORIES || commandCategory === category
      return matchesQuery && matchesCategory
    })
    const grouped = new Map<string, string[]>()
    for (const { name, category: commandCategory } of filtered) {
      const entries = grouped.get(commandCategory) ?? []
      entries.push(name)
      grouped.set(commandCategory, entries)
    }
    return Array.from(grouped, ([groupName, names]) => ({ category: groupName, names }))
  }, [commands, category, normalizedQuery])

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
      <div className="command-controls">
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
        <label className="command-filter">
          <span className="sr-only">Filter commands by category</span>
          <select value={category} onChange={(event) => { setCategory(event.target.value); setCopied(''); setMessage('') }}>
            <option>{ALL_CATEGORIES}</option>
            {categories.map((name) => <option key={name}>{name}</option>)}
          </select>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>
        </label>
      </div>
      {groups.length ? (
        <div className="command-catalog" aria-label="Ayra slash commands">
          {groups.map(({ category: groupName, names }) => (
            <section className="command-group glass-panel" key={groupName} aria-label={groupName}>
              <h3>{groupName}</h3>
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
