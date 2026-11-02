import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.ayrabot.fun'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/privacy` },
    { url: `${SITE_URL}/terms` },
  ]
}
