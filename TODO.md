# Ayra Private Redirect Manager

- [x] **Owner-only Discord sign-in:** Sign in through Discord OAuth2 with the `identify` scope; only the configured owner Discord ID is allowed. Bind OAuth state to the initiating browser, validate Discord's issuer and the callback, keep the session in a signed HttpOnly/Secure cookie, and protect every management API with the same owner check. Do not expose OAuth credentials, owner identity configuration, or storage secrets in browser code or Git.

- [x] **Private redirect dashboard:** Provide a private page where the owner can create, edit, and delete Discord-invite redirects. Support short path links under `www.ayrabot.fun/go/{slug}` and custom `{slug}.ayrabot.fun` links when wildcard routing is available. Persist mappings in the connected private Vercel Blob store and reject invalid/reserved or duplicate slugs and non-HTTPS/non-Discord destinations.

- [x] **Preserve public shortcuts and simple previews:** Keep `support.ayrabot.fun` and `snicker.ayrabot.fun` directing visitors to their current Discord invites. For shared invite URLs, render crawler-visible metadata using Discord's current server name and icon, without requesting or displaying member or online counts. Ordinary visitors should still go directly to Discord.

- [x] **Private access and safe delivery:** Keep admin pages non-indexable and non-cacheable, verify same-origin writes, and deploy the implementation through the existing Ayraweb Vercel production project without disturbing the current homepage or legal pages.

- [x] **Professional Ayra search description:** Replace the homepage's sale-focused search description with a concise, factual description of Ayra's Discord moderation, AutoMod/anti-nuke protection, support tickets, invite tracking, giveaways, polls, member tools, and server utilities. Keep the visible for-sale notice on the site but out of Google snippets.

- [x] **Search-friendly bot identity:** Add concise, crawlable homepage text explaining what Ayra is and the verified features it provides. Use the existing Ayra logo in a stable square favicon image with a circular appearance and link it from the homepage metadata. Do not add invented pricing, review scores, usage counts, or guarantees of Google AI Overview inclusion.

- [x] **Public crawler routes:** Serve `/robots.txt` and `/sitemap.xml` successfully on `www.ayrabot.fun`. Allow crawling of public pages, disallow `/admin` and `/api` paths including nested routes, and include only the homepage and public legal pages in the sitemap using canonical `www.ayrabot.fun` URLs.

- [x] **AdSense code and privacy disclosure:** Make the exact asynchronous AdSense code from the account visible in raw source on public site pages using publisher ID `ca-pub-9689577732033240`, preserve anonymous cross-origin mode, keep it off private admin pages, and disclose Google/third-party ad cookies with links to user controls in the Privacy Policy. Do not claim a consent platform or ad placements are configured.
