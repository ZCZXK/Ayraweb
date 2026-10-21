# Ayra — Discord bot website

A minimalist, aurora-backed landing page for the Ayra Discord bot. The page uses the icon supplied by the project owner, liquid-glass invite buttons, documented command categories, and a truthful review section. It contains no fabricated usage statistics or testimonials.

## Run locally

```sh
pnpm install
pnpm dev
```

## Public destinations and permissions

- Bot application ID: `1489882067239047168`
- The invite link requests no elevated permissions by default. Server owners should review and grant only the permissions the bot needs.
- The previously published support-server invite has expired. The page directs users to Ayra’s documented `/ticket` and `/report` commands instead.

## Image credit

The aurora background is by [Jonny Gios on Unsplash](https://unsplash.com/photos/a-green-and-purple-aurora-bore-in-the-night-sky-Y5HjCi2SLlE), used under the [Unsplash License](https://unsplash.com/license). The bot icon was supplied by the project owner.

## Deploy to Vercel

Import `ZCZXK/Ayraweb` into Vercel and use the detected Next.js defaults. The build command is `pnpm build`.
