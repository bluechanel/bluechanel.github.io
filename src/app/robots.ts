import { MetadataRoute } from 'next';
import { SITE_URL as baseUrl } from '@/lib/site';

export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {

  return {
    rules: [
      {
        // 适用于所有爬虫
        userAgent: '*', 
        // 允许访问所有页面
        allow: '/', 
        // 禁止访问 /admin 和 /private 开头的页面
        disallow: ['/admin/', '/private/'], 
      },
    ],
    // 指定站点地图文件的位置
    sitemap: `${baseUrl}/sitemap.xml`, 
  };
}