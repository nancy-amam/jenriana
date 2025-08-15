/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gateway.pinata.cloud'],
    // Or if you're using the newer remotePatterns (Next.js 12.3+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
}

module.exports = nextConfig