# Ayra Private Redirect Manager

- [x] **Owner-only Discord sign-in:** Sign in through Discord OAuth2 with the `identify` scope; only the configured owner Discord ID is allowed. Bind OAuth state to the initiating browser, validate Discord's issuer and the callback, keep the session in a signed HttpOnly/Secure cookie, and protect every management API with the same owner check. Do not expose OAuth credentials, owner identity configuration, or storage secrets in browser code or Git.

- [x] **Private redirect dashboard:** Provide a private page where the owner can create, edit, and delete Discord-invite redirects. Support short path links under `www.ayrabot.fun/go/{slug}` and custom `{slug}.ayrabot.fun` links when wildcard routing is available. Persist mappings in the connected private Vercel Blob store and reject invalid/reserved or duplicate slugs and non-HTTPS/non-Discord destinations.

- [x] **Preserve and enhance public shortcuts:** Keep `support.ayrabot.fun` and `snicker.ayrabot.fun` directing visitors to their current Discord invites. For shared invite URLs, render crawler-visible metadata using Discord's current server name and icon, plus concise approximate member and online counts when Discord provides them. Do not invent counts; ordinary visitors should still go directly to Discord.

- [x] **Private access and safe delivery:** Keep admin pages non-indexable and non-cacheable, verify same-origin writes, and deploy the implementation through the existing Ayraweb Vercel production project without disturbing the current homepage or legal pages.
