import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.ayrabot.fun/' },
    { url: 'https://cf7yce.ayrabot.fun/' },
    { url: 'https://cookies.ayrabot.fun/' },
    { url: 'https://policy.ayrabot.fun/' },
    { url: 'https://terms.ayrabot.fun/' },
  ]
}
