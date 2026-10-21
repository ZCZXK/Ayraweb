import { getCloudflareContext } from '@opennextjs/cloudflare'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

type HyperdriveEnvironment = {
  HYPERDRIVE?: {
    connectionString: string
  }
}

function getConnectionString() {
  try {
    const env = getCloudflareContext().env as unknown as HyperdriveEnvironment
    const connectionString = env.HYPERDRIVE?.connectionString
    if (connectionString) return connectionString
  } catch {
    // Next.js development outside the Workers runtime uses DATABASE_URL below.
  }

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('Database is not configured. Bind Cloudflare Hyperdrive or set DATABASE_URL for local development.')
  }

  return connectionString
}

export function createPool() {
  return new Pool({
    connectionString: getConnectionString(),
    max: 1,
    maxUses: 1,
  })
}

export function createDb() {
  return drizzle(createPool(), { schema })
}
