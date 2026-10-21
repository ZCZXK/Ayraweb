import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

initOpenNextCloudflareForDev()

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '**/*': [
      './node_modules/pg-cloudflare/dist/**',
      './node_modules/pg-cloudflare/esm/**',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
