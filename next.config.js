// ─────────────────────────────────────────────────────
// File:    next.config.js
// Agent:   @Frontend_Engineer
// Sprint:  1
// Note:    Running as custom Express server on cPanel Passenger.
//          No static export — Next.js handles SSR/CSR via the server.
// ─────────────────────────────────────────────────────

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Images are processed by Sharp on upload and served as WebP.
  // next/image optimization is disabled to avoid runtime CPU usage on shared hosting.
  images: {
    unoptimized: true,
  },

  // Trailing slash for cleaner Apache/Passenger routing
  trailingSlash: false,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Allow images to be served from the same domain
  env: {
    STORE_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'Jun 3D Studio',
    STORE_DOMAIN: process.env.NEXT_PUBLIC_API_URL || 'https://jun3d-studio.store',
  },
};

module.exports = nextConfig;
