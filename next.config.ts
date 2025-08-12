import nextra from 'nextra'


const isProduction = process.env.NODE_ENV === 'production';
const repositoryName = 'test-blog'; // <--- 替换成你的仓库名！

const withNextra = nextra({})

export default withNextra({
  output: 'export',
    // 2. 设置基础路径
  basePath: isProduction ? `/${repositoryName}` : '',

  // 3. 设置资源前缀
  assetPrefix: isProduction ? `/${repositoryName}/` : '',

  // 4. Next.js 13.4+ 需要这个来正确处理图片路径
  images: {
    unoptimized: true,
  },
  reactStrictMode: true
})
