/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera pasta .next/standalone — container menor (~200MB vs ~1GB)
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  turbopack: {},
};

export default nextConfig;
