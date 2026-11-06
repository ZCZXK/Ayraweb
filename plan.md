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


## Owner portfolio and separate policy subdomains

Continue the existing Next.js App Router application and its Vercel/GitHub production project. The requested hostname `cf7yce.ayrabot.fun` is a syntactically valid DNS label (letters and numbers are allowed), so use it rather than the fallback `wasted.ayrabot.fun`. Attach explicit Vercel project domains for `cf7yce.ayrabot.fun`, `cookies.ayrabot.fun`, `policy.ayrabot.fun`, and `terms.ayrabot.fun`, reusing the already verified wildcard DNS/certificate. Preserve `support.ayrabot.fun`, `snicker.ayrabot.fun`, and private short links.

Extend `proxy.ts` host routing so the portfolio and policy hosts resolve to dedicated public Next routes before the generic short-link fallback. Reserve all four host labels in the redirect manager's slug validator. Redirect legacy `www.ayrabot.fun/privacy` and `/terms` entry points to their canonical subdomain URLs. The portfolio page at `cf7yce.ayrabot.fun` identifies the creator as `cf7yce`, shows Discord ID `1508722326928359495`, links to the GitHub profile `github.com/cf7yce`, and uses only known Ayra work and facts, not invented projects, credentials, or statistics.

Discord user identity is retrieved only through the existing Discord OAuth `identify` flow after the API verifies the configured owner ID. Extend the successful owner callback to save the verified username, global display name, avatar hash, and user ID in the existing private Vercel Blob store. The portfolio renders only these explicitly requested public fields and a Discord CDN avatar; until the owner completes that sign-in, display the known ID/username and a clear Connect Discord link rather than fabricating an avatar or display name. Never expose OAuth credentials, session tokens, or Blob credentials to the browser.

Separate the existing Ayra-specific privacy notice (`policy.ayrabot.fun`) from a dedicated Google AdSense/cookie disclosure (`cookies.ayrabot.fun`), and serve Ayra's terms at `terms.ayrabot.fun`. The Ayra privacy page retains bot data practices and explains/links to the separate website advertising-cookie notice. Keep the cookie page factual about the AdSense loader, possible advertising cookies, third-party partners and controls; do not claim that ads, a CMP, or legal compliance have been configured. Add route-specific page metadata and canonical URLs for the portfolio and each policy host, and update the sitemap to list the canonical public host URLs. Reuse the existing minimalist aurora, glass-panel, and typography system.

Project structure changes: `app/(public)/portfolio/page.tsx` owns the profile; `app/(public)/cookies/page.tsx` owns the Google/AdSense cookie disclosure; existing privacy and terms pages remain Ayra policy content; `lib/owner-profile-store.ts` persists the verified identity privately; `proxy.ts` maps the custom hosts; `public/manus-routes.json` lists all public application routes while excluding APIs/assets/private admin pages.


Google's publisher guidance supports disclosing Google and third-party advertising cookies, prior-visit ad personalization, and opt-out controls; Google also states personalized AdSense ads in the EEA, UK and Switzerland require an appropriately certified CMP. The page must describe the current site integration without claiming a CMP is in place. Sources: https://support.google.com/adsense/answer/1348695?hl=en ; https://policies.google.com/technologies/ads?hl=en-US ; https://support.google.com/adsense/answer/13554116?hl=en .


## Expanded cf7yce developer portfolio

Expand the existing personal page into a complete, responsive portfolio while retaining Ayra's aurora/glass palette with a clearer personal wordmark and stronger type hierarchy. Present the owner with the requested roles—AI developer, Discord bot developer, and web developer—plus a concise first-person introduction. Add clear navigation, an About section, capability cards across those three areas, a featured Ayra project with verified features and links, a project-stack description only where source confirms it, and a contact/social section linking to the public GitHub and Discord profiles. Make the page useful on mobile and visually distinct from Ayra's bot marketing homepage.

Do not invent years of experience, client names, awards, reviews, revenue, usage statistics, proficiency percentages, certifications, or projects. Ayra is the only verified featured project unless the owner supplies more. Keep the existing verified Discord OAuth profile-sync behavior: render the real username/display name/avatar only after the owner-only `identify` flow returns the configured ID. Keep the known Discord ID and clear sign-in path when profile data is not synced. Add route-specific title, description, canonical and social metadata that match the expanded role focus.


Public portfolio research note (2026-11-06): The public profile https://github.com/cf7yce has no public repositories listed; the GitHub public API endpoint https://api.github.com/users/cf7yce/repos?per_page=100 returned an empty list. Keep Ayra as the only featured project until the owner provides more public work.
