const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL}/:path*`, // The :path parameter is used here so will not be automatically passed in the query
      },
    ];
  },
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  experimental: {
    scrollRestoration: false,
  },
};

module.exports = withContentlayer(nextConfig);
