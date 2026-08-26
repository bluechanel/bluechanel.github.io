import { getNoteData, getAllNoteIds } from '@/lib/notes';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

import { Calculator, ExternalLink, Hourglass } from 'lucide-react';
import TableOfContents from '@/components/table-contents';
import { PostContent } from '@/components/content';
import { Comment } from '@/components/comment';
import ReadingProgress from '@/components/reading-progress';
import { FadeIn } from '@/components/motion';
import { buildNoteJsonLd } from '@/lib/jsonld';
import { absoluteUrl } from '@/lib/site';

// Notion Status select → 中文展示
const STATUS_LABELS: Record<string, string> = {
  Finished: '已读完',
  Reading: '在读',
  Want: '想读',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const note = await getNoteData(id);

  return {
    title: `${note.bookName}-WileyZhang`,
    description: `《${note.bookName}》${note.author}的读书笔记`,
    // 告知 Agent/LLM 本笔记的 Markdown 版本位置
    alternates: {
      types: {
        'text/markdown': absoluteUrl(`/books/${note.id}.md`),
      },
    },
  }
}

// 这个函数会在构建时生成所有可能的笔记路径
export async function generateStaticParams() {
  const paths = getAllNoteIds();
  return paths.map(path => ({ id: path.params.id }));
}


export default async function Note({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  let note;

  try {
    note = await getNoteData(id);
  } catch (error) {
    notFound();
  }
  const statusLabel = STATUS_LABELS[note.status] ?? note.status;
  const jsonLd = buildNoteJsonLd(note);

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
              {note.cover ? (
                // 页面在 /books/{id} 下，必须带 /posts/ 前缀才能命中 public/posts/cover/
                <Image src={`/posts/${note.cover}`} alt={`《${note.bookName}》封面`} className="object-cover" fill/>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500" />
              )}
            </div>
          </FadeIn>
          <div className="p-4">
            <FadeIn delay={0.1}>
              <header className="mb-4">
                <Link href="/books" className="text-sm text-blue-500 hover:underline">← 读书</Link>
                {/* 主标题 = 书名（bookName） */}
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 mt-2 text-gray-900 dark:text-white">
                  {note.bookName}
                </h1>
                {/* 笔记自己的标题与书名不同时，作为副标题 */}
                {note.title !== note.bookName && (
                  <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-3">
                    {note.title}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {note.author}
                  {note.carrier ? ` · ${note.carrier}` : ''}
                  {note.status ? ` · ${statusLabel}` : ''}
                </p>
                <div className='flex flex-row flex-wrap items-center'>
                  <div className="flex flex-row text-sm text-gray-500 dark:text-gray-400">
                    <Calculator className="w-4 h-4 mr-2" />
                    {format(note.date, 'yyyy-MM-dd')}
                  </div>
                  <div className="h-4 w-0.5 bg-gray-300 dark:bg-gray-600 mx-4"></div>
                  <div className="flex flex-row text-sm text-gray-500 dark:text-gray-400">
                    <Hourglass className="w-4 h-4 mr-2" />
                    {note.readingTime} min read
                  </div>
                  {note.bookUrl ? (
                    <>
                      <div className="h-4 w-0.5 bg-gray-300 dark:bg-gray-600 mx-4"></div>
                      <a
                        href={note.bookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-row text-sm text-blue-500 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        豆瓣页面
                      </a>
                    </>
                  ) : null}
                </div>
              </header>
            </FadeIn>
            <FadeIn delay={0.2}>
              <PostContent content={note.content} />
            </FadeIn>
            {/* 评论区（Giscus 按 pathname 分线程，/books/{uuid} 独立线程） */}
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
