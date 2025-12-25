import { getPaginatedPostsByTag, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/postcard';
import { Pagination } from '@/components/pagination';
import { TagCloud } from '@/components/tag-cloud';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `标签: ${decodedTag} | Wiley`,
    description: `查看所有标签为 "${decodedTag}" 的文章`,
  };
}

// 生成所有可能的标签路径
export async function generateStaticParams() {
  const allTags = getAllTags();

  return allTags.map(({ tag }) => ({
    tag: encodeURIComponent(tag),
  }));
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const { posts, totalPages, currentPage, totalPosts } = getPaginatedPostsByTag(decodedTag, 1, 9);
  const allTags = getAllTags();

  // 如果没有找到该标签的文章，返回404
  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16'>
      {/* 标签云 */}
      <div className="mb-8">
        <TagCloud tags={allTags} currentTag={decodedTag} />
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          标签: <span className="text-blue-600 dark:text-blue-400">{decodedTag}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          共找到 {totalPosts} 篇文章
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/posts/tag/${tag}`}
      />
    </div>
  );
}
