import { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import { getSortedNotesData } from '@/lib/notes';
import { SITE_URL as baseUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // 获取所有博客文章
  const posts = await getSortedPostsData();

  // 为每篇文章创建一个 sitemap 条目
  const postUrls = posts.map(post => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.updateDate),
    changeFrequency: 'weekly' as const, // 或者 'daily', 'monthly', 'yearly', 'always', 'never'
    priority: 0.8,
  }));

  // 读书笔记
  const notes = await getSortedNotesData();
  const noteUrls = notes.map(note => ({
    url: `${baseUrl}/books/${note.id}`,
    lastModified: new Date(note.updateDate),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  
  // 静态页面的 URL
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
        url: `${baseUrl}/films`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
    }
  ];

  // 合并静态页面、读书笔记和动态生成的文章页面
  return [
    ...staticUrls,
    ...noteUrls,
    ...postUrls
  ];
}