/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/SitCheck',     // z. B. '/archive-frontend'
  assetPrefix: '/SitCheck/', // muss identisch zum basePath sein
};

export default nextConfig;
