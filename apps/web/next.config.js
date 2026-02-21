/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@pethaven/shared', '@pethaven/ui'],
};

module.exports = nextConfig;
