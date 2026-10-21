# Ayraweb on Cloudflare Workers

This project uses Next.js server rendering, Better Auth, and PostgreSQL. Deploy it to **Cloudflare Workers with the OpenNext adapter**, not as a static Pages export. A static export cannot serve the authentication API or the signed-in pages.

## Requirements

- A Cloudflare account and a Worker name/domain for the site.
- Node.js 22 or newer and pnpm.
- A PostgreSQL database with the Better Auth tables represented by `lib/db/schema.ts`.
- A Cloudflare Hyperdrive configuration pointing to that PostgreSQL database.
- A Discord OAuth application for sign-in.

## Configure the project

1. Install dependencies with `pnpm install`.
2. In Cloudflare, create a Hyperdrive configuration that points to your PostgreSQL database. Copy its Hyperdrive ID into `wrangler.jsonc`, replacing `REPLACE_WITH_CLOUDFLARE_HYPERDRIVE_ID`.
3. In the Cloudflare dashboard, open the `ayraweb` Worker settings and add these runtime values:
   - `BETTER_AUTH_URL`: the canonical public site origin, such as `https://ayra.example.com` (no trailing slash).
   - `BETTER_AUTH_SECRET`: a long, random secret.
   - `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`: credentials from your Discord OAuth application. Store the secret values as Worker secrets.
4. Set the Discord OAuth redirect URL to `${BETTER_AUTH_URL}/api/auth/callback/discord`. Add the same public site origin as an authorized redirect/origin in the Discord application where required.
5. If the database does not already have the Better Auth schema, create the tables defined in `lib/db/schema.ts` before enabling sign-in. For local development, copy `.env.example` to `.env.local` and fill in the PostgreSQL URL and Discord credentials. The OpenNext Worker build/preview also needs `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` set to a PostgreSQL connection string. Do not commit `.env.local` or `.dev.vars`.

The Worker reads PostgreSQL through the `HYPERDRIVE` binding. `DATABASE_URL` is only a fallback for local Next.js development; do not put production database credentials in the repository or in public variables.

## Preview and deploy

Authenticate Wrangler once with `pnpm exec wrangler login`. Then run:

```sh
pnpm install
pnpm run preview
```

`preview` builds the OpenNext Worker and runs it locally using the Cloudflare Workers runtime. It needs a valid Hyperdrive binding and `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` for the local binding emulator.

When the preview is ready, deploy with:

```sh
pnpm run deploy
```

The deploy command builds the app and deploys the Worker with `--keep-vars` so runtime variables and secrets configured in the Cloudflare dashboard are preserved. After deployment, attach your custom domain to the `ayraweb` Worker in Cloudflare if you are not using its `workers.dev` URL.

For ordinary Next.js development, use `pnpm dev`. Copy `.dev.vars.example` to `.dev.vars` for OpenNext's local Worker environment selector. To regenerate Cloudflare binding types after changing `wrangler.jsonc`, run `pnpm run cf-typegen`.

## Runtime notes

The OpenNext adapter runs the existing App Router pages, API route handlers, and server-rendered auth pages on Workers. Database pools are created per request and use Hyperdrive's connection string in Cloudflare. The local development path falls back to `DATABASE_URL`.

References: [Cloudflare OpenNext adapter](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/), [OpenNext Cloudflare setup](https://opennext.js.org/cloudflare/get-started), [Cloudflare Hyperdrive with node-postgres](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/node-postgres/).
