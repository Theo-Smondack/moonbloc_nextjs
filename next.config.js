/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images : {
    domains:['s2.coinmarketcap.com']
  },
  typescript:{
    ignoreBuildErrors:false,
  }
}

module.exports = nextConfig
