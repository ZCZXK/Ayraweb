# Ayraweb — Coming Soon

A compact, single-screen Next.js landing page for Vercel, with an email waitlist form and an embedded Spotify player. The Spotify controls play the track inside the page; no Spotify redirect is used for playback.

## Run locally

```sh
pnpm install
pnpm dev
```

## Enable the waitlist

Add these variables in Vercel Project Settings → Environment Variables:

- `MAILERLITE_API_KEY` — a MailerLite API token. Keep it server-side; never use a `NEXT_PUBLIC_` prefix.
- `MAILERLITE_GROUP_ID` — optional, to put Ayraweb signups into a dedicated MailerLite group. If omitted, subscribers are added to the account’s general list.

The form requires explicit consent and sends signups to MailerLite’s subscribers API. Do not commit API tokens to GitHub.

## Deploy to Vercel

Import `ZCZXK/Ayraweb` into Vercel and use the detected Next.js defaults. The build command is `pnpm build`.
