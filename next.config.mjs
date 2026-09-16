/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Every route is statically renderable, so the site can also be exported to
  // plain files for a static host by uncommenting the line below.
  // output: 'export',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // CSS Modules otherwise emit a separate render-blocking stylesheet per
    // component chunk; 'loose' merges them so a page costs fewer round trips.
    cssChunking: 'loose',
  },
};

export default nextConfig;
