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
      }
    ],
  },
  async redirects() {
    return [
      {
        source: "/solutions/developers",
        destination: "/developers",
        permanent: true,
      },
      // Legacy pages from the previous site (still indexed in search)
      {
        source: "/company",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/for-peos",
        destination: "/solutions/brokers",
        permanent: true,
      },
      {
        source: "/products/:path*",
        destination: "/product/quote-bind",
        permanent: true,
      },
      {
        source: "/blog/page",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/page/1",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
