import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === 'production' ? '/app_store/tool/devbox' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://ads.sealos.run/app_store/tool/devbox' : '',
  images: {
    unoptimized: true,
  },
}

export default withMDX(config)
