import { getPostData, getAllPostIds } from '@/lib/posts';
import { getAllNoteIds } from '@/lib/notes';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

import { Calculator, Clock, Hourglass } from 'lucide-react'
import TableOfContents from '@/components/table-contents';
import { PostContent } from '@/components/content';
import { Comment } from '@/components/comment';
import ReadingProgress from '@/components/reading-progress';
import { FadeIn } from '@/components/motion';
import { buildPostJsonLd } from '@/lib/jsonld';
import { absoluteUrl } from '@/lib/site';

// 读书笔记已迁到 /books/{id}，旧 URL /posts/{id} 需要静态重定向
const noteIdSet = () => new Set(getAllNoteIds().map((p) => p.params.id));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  let post;
  try {
    post = await getPostData(id);
  } catch {
    // 读书笔记：该路径只作为重定向页生成，metadata 用占位即可
    if (noteIdSet().has(id)) {
      return { title: '读书笔记', description: '读书笔记' };
    }
    return {};
  }

  return {
    title: `${post.title}-WileyZhang`,
    description: post.description,
    // 告知 Agent/LLM 本文的 Markdown 版本位置（Cloudflare "Markdown for Agents" 的静态等价物）
    alternates: {
      types: {
        'text/markdown': absoluteUrl(`/posts/${post.id}.md`),
      },
    },
  }
}

// 这个函数会在构建时生成所有可能的文章路径（含读书笔记的旧 URL 重定向页）
export async function generateStaticParams() {
  const paths = getAllPostIds();
  const notePaths = getAllNoteIds();
  return [
    ...paths.map(path => ({ id: path.params.id })),
    ...notePaths.map(path => ({ id: path.params.id })),
  ];
}


export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  let postData;

  try {
    postData = await getPostData(id);
  } catch (error) {
    // 博客里查不到 → 若是读书笔记，重定向到新位置 /books/{id}
    if (noteIdSet().has(id)) {
      redirect(`/books/${id}`);
    }
    notFound();
  }
  const jsonLd = buildPostJsonLd(postData);

  return (
    <>
      <ReadingProgress />
      <div className="max-w-6xl mx-auto px-4 flex gap-8">
        <article className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <FadeIn direction="none">
            <div className="relative h-64 sm:h-96 w-full">
              {postData.cover ? (
                <Image src={postData.cover} alt="文章封面" className="object-cover" fill/>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500" />
              )}
            </div>
          </FadeIn>
          <div className="p-4">
            <FadeIn delay={0.1}>
              <header className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {postData.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/posts/tag/${encodeURIComponent(tag)}`}
                      className="px-2 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  {postData.title}
                </h1>
                <div className='flex flex-row '>
                  <div className="flex flex-row text-sm text-gray-500 dark:text-gray-400">
                    <Calculator className="w-4 h-4 mr-2" />
                    {format(postData.date, 'yyyy-MM-dd')}
                  </div>
                  <div className="h-4 w-0.5 bg-gray-300 dark:bg-gray-600 mx-4"></div>
                  <div className="flex flex-row text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {format(postData.updateDate, 'yyyy-MM-dd')}
                  </div>
                  <div className="h-4 w-0.5 bg-gray-300 dark:bg-gray-600 mx-4"></div>
                  <div className="flex flex-row text-sm text-gray-500 dark:text-gray-400">
                    <Hourglass className="w-4 h-4 mr-2" />
                    {postData.readingTime} min read
                  </div>
                </div>
              </header>
            </FadeIn>
            <FadeIn delay={0.2}>
              <PostContent content={postData.content} />
            </FadeIn>
            {/* 评论区 */}
            <Comment />
          </div>
        </article>
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </>
  );
}
