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
    // component chunk; merging them costs fewer round trips per page. The
    // installed Next.js version only accepts `boolean | 'strict'` here —
    // `true` is the current name for the old 'loose' merge behaviour this
    // was set for; the invalid string silently broke the dev server's CSS
    // pipeline (assets 404ing, HMR throwing "[object Event]").
    cssChunking: true,
  },
};

export default nextConfig;
