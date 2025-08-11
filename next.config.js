/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('pdf-parse');
    }
    return config;
  },
};

module.exports = nextConfig;