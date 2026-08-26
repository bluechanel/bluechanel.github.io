import { SITE_URL } from '@/lib/site';

/**
 * 结构化数据（JSON-LD）的统一构造。
 * HTML 页面内嵌的 <script type="application/ld+json"> 与 Agent 版 Markdown 尾部的
 * ```json 块共用同一构造函数，保证两种表示不会漂移。
 */

/** 文章/笔记的最小结构（posts.ts / notes.ts 的返回对象均满足；notes 无 description） */
interface PostLike {
  id: string;
  title: string;
  description?: string;
  date: Date | string;
  updateDate: Date | string;
  cover?: string | null;
}

const AUTHOR = [{
  '@type': 'Person',
  name: 'WileyZhang',
  url: `${SITE_URL}/about`,
}];

/** 博客文章 → schema.org BlogPosting */
export function buildPostJsonLd(post: PostLike) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updateDate, // 最后修改时间
    author: AUTHOR,
    // cover 是相对 public/posts/ 的路径，结构化数据里必须是绝对 URL
    ...(post.cover ? { image: `${SITE_URL}/posts/${post.cover}` } : {}),
    ...(post.description ? { description: post.description } : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/posts/${post.id}`,
    },
  };
}

/** 读书笔记 → schema.org Article（about 指向书目；headline 沿用页面展示的书名） */
export function buildNoteJsonLd(note: PostLike & { bookName?: string; author?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: note.bookName ?? note.title,
    datePublished: note.date,
    dateModified: note.updateDate,
    author: AUTHOR,
    ...(note.cover ? { image: `${SITE_URL}/posts/${note.cover}` } : {}),
    ...(note.bookName
      ? {
          about: {
            '@type': 'Book',
            name: note.bookName,
            author: note.author,
          },
        }
      : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/books/${note.id}`,
    },
  };
}
