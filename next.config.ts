/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["gateway.pinata.cloud"],
    // Or if you're using the newer remotePatterns (Next.js 12.3+)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
        port: "",
        pathname: "/ipfs/**",
        
      },
    ],
    
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint checks during build
  },
  experimental: {
    // Disable async params to maintain backward compatibility
    dynamicIO: false,
  },
  //  typescript: {
  //   ignoreBuildErrors: true,
  // },
};

module.exports = nextConfig;
