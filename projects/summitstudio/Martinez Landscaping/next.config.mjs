/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // The site currently ships with local placeholder photography in
    // /public/images. If you later serve client photos from a CDN or DAM,
    // whitelist the host here, e.g.:
    // remotePatterns: [{ protocol: 'https', hostname: 'cdn.martinezlandscaping.com' }],
  },
};

export default nextConfig;
