# Ayra Private Redirect Manager Plan

## Approach

Extend the existing Next.js App Router application in the `Ayraweb` repository and continue its Vercel/GitHub deployment. Do not create a second website or change the public landing-page design. Use the already provisioned private Vercel Blob store, Discord OAuth2 `identify` scope, the supplied owner Discord ID, and the registered callback `https://ayrabot.fun/api/auth/discord/callback`.

The owner dashboard will support Discord invite redirects by path (`https://www.ayrabot.fun/go/{slug}`) and custom subdomain (`https://{slug}.ayrabot.fun`). The wildcard DNS record already points to Vercel, and the verified wildcard domain is attached to the Ayraweb project. New mappings live only in private Blob JSON. Existing Support and Snicker routes stay compatible. Visitors receive direct 302 redirects; social-preview crawlers receive server-rendered metadata with the current Discord server name and icon, without member counts.

## Authentication and persistence

Use OAuth authorization-code flow with a short-lived, browser-bound signed `state` cookie, verify Discord's issuer, exchange the code server-side, and grant a session only when Discord returns the configured owner ID. Derive separate OAuth-state and session HMAC keys from the server-only Discord client secret with HKDF and distinct context labels. Use HttpOnly, Secure, SameSite=None cookies. Never put OAuth credentials or Blob tokens in browser code or Git. Require a valid session on the dashboard and every create, update, or delete API action. Validate same-origin mutations and accept only HTTPS Discord invite URLs.

Use `@vercel/blob` private `get` and `put` on the server, with Vercel's connected OIDC/store environment where available. Keep built-in Support and Snicker aliases as compatibility entries and prevent new slugs from colliding with protected routes or built-in names.

## Design

Reuse Ayra's existing minimalist aurora and liquid-glass visual language. Keep the admin interface compact and functional: clear owner-only login state, concise link rows, and small creation/edit controls. Do not add decorative stock imagery. Private admin pages and APIs must not be indexed or cached publicly.

## Main project structure

- `app/admin/redirects/` and `app/admin/login/`: owner-only dashboard and sign-in page.
- `app/api/auth/discord/`: OAuth start, callback, and logout handlers.
- `app/api/redirects/`: authenticated list/create/update/delete handlers.
- `app/go/[slug]/` and `app/api/resolve/[mode]/[slug]/`: direct redirect handlers.
- `app/share/[slug]/`: crawler-facing server-name and icon preview page.
- `lib/auth.ts` and `lib/redirect-store.ts`: signed sessions, slug validation, and private Blob persistence.
- `lib/discord-invite.ts`: public Invite API metadata for the current server name and icon only.
- `proxy.ts`: preserve fixed legacy routes, route social crawlers to HTML metadata, and rewrite wildcard aliases.
