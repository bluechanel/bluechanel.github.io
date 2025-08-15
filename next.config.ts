import type { NextConfig } from 'next';


const isProduction = process.env.NODE_ENV === 'production';
const repositoryName = 'test-blog'; // <--- 替换成你的仓库名！

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProduction ? `/${repositoryName}` : '',
  assetPrefix: isProduction ? `/${repositoryName}/` : '',
    images: {
    unoptimized: true,
  },
  reactStrictMode: true
};

export default nextConfig;
