/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    // Puppeteer / Chromium / Sharp need Node.js native modules — keep out of webpack
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium", "sharp", "@neondatabase/serverless", "@prisma/adapter-neon"],
  },
}

export default nextConfig
