/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["gateway.pinata.cloud"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
        port: "",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        port: "",
        pathname: "/**",
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
   typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
