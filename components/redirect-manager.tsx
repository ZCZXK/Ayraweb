'use client'

import { FormEvent, useState } from 'react'
import type { RedirectRow, RedirectMode } from '@/lib/redirect-store'

type ApiResponse = { link?: RedirectRow; links?: RedirectRow[]; error?: string }

export function RedirectManager({ initialLinks }: { initialLinks: RedirectRow[] }) {
  const [links, setLinks] = useState(initialLinks)
  const [slug, setSlug] = useState('')
  const [mode, setMode] = useState<RedirectMode>('path')
  const [destination, setDestination] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function resetForm() {
    setSlug('')
    setMode('path')
    setDestination('')
    setEditing(null)
  }

  function startEdit(link: RedirectRow) {
    setSlug(link.slug)
    setMode(link.mode)
    setDestination(link.destination)
    setEditing(link.slug)
    setError('')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(editing ? `/api/redirects/${encodeURIComponent(editing)}` : '/api/redirects', {
        method: editing ? 'PATCH' : 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, mode, destination }),
      })
      const result = await response.json() as ApiResponse
      if (!response.ok || !result.link) throw new Error(result.error ?? 'Unable to save this redirect.')

      if (editing) {
        setLinks((current) => current.map((link) => link.slug === editing ? result.link! : link))
        setMessage('Redirect updated.')
      } else {
        setLinks((current) => [...current, result.link!])
        setMessage('Redirect created.')
      }
      resetForm()
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to save this redirect.')
    } finally {
      setBusy(false)
    }
  }

  async function deleteLink(link: RedirectRow) {
    if (!window.confirm(`Delete ${link.url}? Anyone using it will no longer be redirected.`)) return
    setError('')
    setMessage('')
    try {
      const response = await fetch(`/api/redirects/${encodeURIComponent(link.slug)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      })
      const result = await response.json() as ApiResponse
      if (!response.ok) throw new Error(result.error ?? 'Unable to delete this redirect.')
      setLinks((current) => current.filter((item) => item.slug !== link.slug))
      if (editing === link.slug) resetForm()
      setMessage('Redirect deleted.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete this redirect.')
    }
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      setMessage('Link copied.')
      setError('')
    } catch {
      setError('Could not copy the link. Select and copy it instead.')
    }
  }

  async function logout() {
    const response = await fetch('/api/auth/discord/logout', {
      method: 'POST',
      credentials: 'same-origin',
    })
    if (response.ok) window.location.assign('/admin/login')
    else setError('Could not sign out. Please refresh and try again.')
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="admin-brand" href="/">
          <span className="admin-brand-mark">A</span>
          <span>Ayra <small>LINKS</small></span>
        </a>
        <button className="admin-logout" type="button" onClick={logout}>Sign out</button>
      </header>

      <div className="admin-content">
        <div className="admin-heading">
          <p className="eyebrow">OWNER DASHBOARD</p>
          <h1>Redirects</h1>
          <p>Create compact links for Discord invites. Only your Discord account can manage these links.</p>
        </div>

        <section className="admin-panel admin-create-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">NEW LINK</p>
              <h2>{editing ? 'Edit redirect' : 'Create a redirect'}</h2>
            </div>
            {editing && <button className="admin-text-button" type="button" onClick={resetForm}>Cancel edit</button>}
          </div>
          <form className="admin-form" onSubmit={submit}>
            <label>
              <span>Link name</span>
              <input
                autoComplete="off"
                maxLength={40}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                placeholder="community"
                required
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
              <small>Lowercase letters, numbers, and single hyphens.</small>
            </label>
            <label>
              <span>Link type</span>
              <select value={mode} onChange={(event) => setMode(event.target.value as RedirectMode)}>
                <option value="path">Short path</option>
                <option value="subdomain">Custom subdomain</option>
              </select>
              <small>{mode === 'path' ? 'www.ayrabot.fun/go/name' : 'name.ayrabot.fun'}</small>
            </label>
            <label className="admin-destination-field">
              <span>Discord invite URL</span>
              <input
                autoComplete="off"
                inputMode="url"
                placeholder="https://discord.gg/example"
                required
                type="url"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              />
              <small>Only secure Discord invite links are accepted.</small>
            </label>
            <button className="glass-button glass-button--primary admin-submit" disabled={busy} type="submit">
              {busy ? 'Saving…' : editing ? 'Save changes' : 'Create link'}
            </button>
          </form>
          {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}
          {message && <p className="admin-message" role="status">{message}</p>}
        </section>

        <section className="admin-links-section">
          <div className="admin-list-heading">
            <div>
              <p className="eyebrow">LINKS</p>
              <h2>Your redirects <span>{links.length}</span></h2>
            </div>
          </div>
          <div className="admin-link-list">
            {links.map((link) => (
              <article className="admin-link-row" key={link.slug}>
                <div className="admin-link-main">
                  <div className="admin-link-title">
                    <span className={`admin-link-type admin-link-type--${link.mode}`}>{link.mode === 'path' ? 'PATH' : 'SUBDOMAIN'}</span>
                    {link.builtIn && <span className="admin-link-system">BUILT IN</span>}
                  </div>
                  <a className="admin-link-url" href={link.url} target="_blank" rel="noreferrer">{link.url}</a>
                  <span className="admin-link-destination">{link.destination}</span>
                </div>
                <div className="admin-link-actions">
                  <button type="button" onClick={() => void copyLink(link.url)}>Copy</button>
                  {!link.builtIn && <button type="button" onClick={() => startEdit(link)}>Edit</button>}
                  {!link.builtIn && <button className="admin-delete-button" type="button" onClick={() => void deleteLink(link)}>Delete</button>}
                </div>
              </article>
            ))}
            {links.length === 0 && <p className="admin-empty">No redirects yet. Create your first short link above.</p>}
          </div>
        </section>

        <p className="admin-footnote">Invite previews use Discord’s current server icon and approximate counts when available.</p>
      </div>
    </main>
  )
}
