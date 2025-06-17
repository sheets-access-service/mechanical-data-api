/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',         // Optional but recommended
        hostname: 'avatar.vercel.sh',
        pathname: '/**',           // Optional, matches all paths
      },
    ],
  },
};

export default nextConfig;
