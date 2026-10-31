# Ayra — Discord bot website

A minimalist aurora landing page for Ayra with a saved light/dark theme, searchable and filterable slash commands, glass-style actions, and links to the bot’s legal pages.

## Run locally

```sh
pnpm install
pnpm dev
```

## Links

- Bot invite: application ID `1489882067239047168` (no elevated permissions requested by default)
- Support server: <https://discord.gg/GEPmvs57Yx>
- Email support: <mailto:flewd7560@gmail.com>
- Privacy: `/privacy`
- Terms: `/terms`

## Private redirect manager

On production, open `/admin/login` and sign in with the authorized Discord account. The owner can create, edit, copy, and delete Discord invite redirects as short paths (`www.ayrabot.fun/go/name`) or custom subdomains (`name.ayrabot.fun`). Link mappings are stored in the connected private Vercel Blob store; Support and Snicker remain built-in redirects.

The Vercel project must have `DISCORD_CLIENT_SECRET` and `DISCORD_ADMIN_USER_ID` configured for Production, and the Discord OAuth application must register `https://ayrabot.fun/api/auth/discord/callback`. The private Blob store `ayra-redirects` must remain connected to the `ayraweb` project. Do not put OAuth credentials or Blob tokens in this repository or client-side code.

Shared invite URLs use Discord’s public invite metadata for the server icon and approximate member/online counts when available. Human visitors are sent directly to the Discord invite.

## Image credit

The aurora background is by [Jonny Gios on Unsplash](https://unsplash.com/photos/a-green-and-purple-aurora-bore-in-the-night-sky-Y5HjCi2SLlE), used under the [Unsplash License](https://unsplash.com/license). The bot icon was supplied by the project owner.

## Deploy to Vercel

Import `ZCZXK/Ayraweb` into Vercel and use the detected Next.js defaults. The build command is `pnpm build`.
