/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://backend-sa-redweb-production.up.railway.app/api/:path*',
      },
    ];
  },
  images: {
    domains: ['backend-sa-redweb-production.up.railway.app'],
  },
};

module.exports = nextConfig;
