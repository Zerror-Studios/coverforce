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
        source: "/commercial-api",
        destination: "/developers",
        permanent: true,
      },
      {
        source: "/for-brokers-agents",
        destination: "/solutions/brokers",
        permanent: true,
      },
      {
        source: "/for-peos",
        destination: "/solutions/brokers",
        permanent: true,
      },
      {
        source: "/quote-bind-platform",
        destination: "/product/quote-bind",
        permanent: true,
      },
      {
        source: "/embedded-commercial",
        destination: "/developers",
        permanent: true,
      },
      {
        source: "/brokers",
        destination: "/solutions/brokers",
        permanent: true,
      },
      {
        source: "/peos",
        destination: "/solutions/brokers",
        permanent: true,
      },
      {
        source: "/carrier-partners",
        destination: "/solutions/carrier",
        permanent: true,
      },
      {
        source: "/products/:path*",
        destination: "/product/quote-bind",
        permanent: true,
      },
      // Old CoverForce website archive paths (specific before catch-all)
      {
        source: "/old-coverforce-website/old-home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/old-coverforce-website/for-brokers-agents",
        destination: "/solutions/brokers",
        permanent: true,
      },
      {
        source: "/old-coverforce-website/quote-bind-platform",
        destination: "/product/quote-bind",
        permanent: true,
      },
      {
        source: "/old-coverforce-website/for-peos",
        destination: "/solutions/brokers",
        permanent: true,
      },
      {
        source: "/old-coverforce-website/carrier-partners",
        destination: "/solutions/carrier",
        permanent: true,
      },
      {
        source: "/old-coverforce-website/commercial-api",
        destination: "/developers",
        permanent: true,
      },
      {
        source: "/old-coverforce-website/:path*",
        destination: "/",
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
