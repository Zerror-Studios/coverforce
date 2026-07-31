/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    // Webflow uploads are often multi‑MB; default optimizer timeout is 7s.
    imgOptTimeoutInSeconds: 30,
  },
  images: {
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "uploads-ssl.webflow.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/solutions/developers",
        destination: "/developers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
