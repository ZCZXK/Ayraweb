

## Ayra status card and labeled ping demo
- The public bot repository `cf7yce/Ayra` uses Node.js ES modules and discord.js 14.27; Railway starts it with `pnpm start`. Use the built-in `node:http` server, binding `0.0.0.0` on Railway's `PORT`, without adding a framework dependency.
- The deployed `/api/stats` and same-origin `/api/bot-stats` endpoints serve actual status, server count, and aggregate member count. The aggregate counts memberships per server, not unique people.
- The homepage’s larger 2×2 glass status card is positioned directly below the About section and polls actual status/server/member values. The fourth tile cycles text examples such as `23ms` and is explicitly labeled “Demo ping”; it is illustrative only and must never be presented as real latency. The owner chose this demo so no GitHub account reconnection is required.
