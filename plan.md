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

## Search appearance refinement

Keep the public homepage focused on Ayra rather than the domain sale: use a concise, professional title and description describing only verified Discord bot features, and add a brief visible About section with those same features in crawlable text. Keep the domain-sale notice visible to people but exclude it from Google snippets with the supported `data-nosnippet` attribute on a `section`. Use Ayra's existing mark to create a stable square PNG favicon with transparent corners around a circular field, and reference it through Next.js metadata. Publish `/robots.txt` and `/sitemap.xml` for the `www.ayrabot.fun` canonical origin; allow public pages while disallowing private `/admin/` and `/api/` paths, and list only the homepage and legal pages in the sitemap. Do not add claims about unverified pricing, ratings, or user counts, and do not promise AI Overview inclusion; follow Google's regular SEO fundamentals.

The relevant implementation files are `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/robots.ts`, `app/sitemap.ts`, and `public/ayra-favicon.png`.

## AdSense integration

Load the supplied publisher script from the shared Next.js layout on public routes only, not owner-only `/admin` pages. Update `/privacy` with a factual disclosure of AdSense cookies, third-party ad vendors, and available user controls. Do not add ad slots, claim the consent platform is configured, or change AdSense account settings; flag Google's regional certified-CMP requirement when relevant.

Verification refinement: Render the literal AdSense `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9689577732033240" crossorigin="anonymous">` from `app/(public)/layout.tsx` as server-rendered markup, so it is present verbatim in page source for Google verification. Keep admin and API routes outside this public route group; route-group moves must not change public URLs.
