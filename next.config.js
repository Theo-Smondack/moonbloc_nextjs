/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images : {
    domains:['assets.coingecko.com']
  },
  typescript:{
    ignoreBuildErrors:false,
  }
}

module.exports = nextConfig
