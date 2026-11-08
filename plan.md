

## Live Ayra bot status, server-count, and aggregate-member integration
- The public bot repository `cf7yce/Ayra` uses Node.js ES modules and discord.js 14.27; Railway starts it with `pnpm start`. Use the built-in `node:http` server, binding `0.0.0.0` on Railway's `PORT`, without adding a framework dependency.
- Serve a read-only `GET /api/stats` response with the actual online/starting/offline state, guild/server count, and summed member count across the cached guilds. Report online only when discord.js says the client is ready; return null counts before readiness or when member metadata is incomplete. The aggregate counts a person once per server, not as a unique-user total. Do not expose IDs, bot tokens, database contents or diagnostics.
- In Ayraweb, use a same-origin server route `/api/bot-stats` with a short timeout, `no-store` behavior, strict validation and an unavailable fallback. The homepage widget polls periodically, shows actual status, server count and aggregate member total, and clearly discloses that the member total is not unique. Never fabricate numbers; do not make direct browser requests to Railway.
- The original status/server endpoint is live. The new member-count extension is under test and publication. Ayraweb's member-count widget changes build successfully but await refreshed GitHub integration write access for `ZCZXK/Ayraweb` before publication.
