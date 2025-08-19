import { getPostData, getAllPostIds } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';

import { Calculator, Clock, Hourglass } from 'lucide-react'
import TableOfContents from '@/components/table-contents';
import { PostContent } from '@/components/content';
import { Comment } from '@/components/comment';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const post = await getPostData(id);

  return {
    title: `${post.title}`
  }
}

// 这个函数会在构建时生成所有可能的文章路径
export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map(path => ({ id: path.params.id }));
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
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 flex gap-8">
      <article className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-64 sm:h-96 w-full">
          <Image src={postData.cover} alt="文章封面" className="object-cover" fill/>
        </div>
        <div className="p-4">
          <header className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {postData.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full text-sm hover:opacity-80 transition-opacity bg-blue-200 text-blue-800">
                  {tag}
                </span>
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
          <PostContent content={postData.content} />
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
  );
}
