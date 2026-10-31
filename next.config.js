/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Permite deploy independente da pasta /vendas se necessário
  basePath: '',
  trailingSlash: false,
}

module.exports = nextConfig
