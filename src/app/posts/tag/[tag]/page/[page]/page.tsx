import { getPaginatedPostsByTag, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/postcard';
import { Pagination } from '@/components/pagination';
import { TagCloud } from '@/components/tag-cloud';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    tag: string;
    page: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { tag, page } = await params;
  const decodedTag = decodeURIComponent(tag);
  const pageNumber = parseInt(page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    return {
      title: `标签: ${decodedTag} | Wiley`,
      description: `查看所有标签为 "${decodedTag}" 的文章`,
    };
  }

  return {
    title: `标签: ${decodedTag} | 第${pageNumber}页 | Wiley`,
    description: `标签 "${decodedTag}" 的文章列表第${pageNumber}页`,
  };
}

// 生成所有可能的标签和页面路径
export async function generateStaticParams() {
  const allTags = getAllTags();
  const POSTS_PER_PAGE = 9;
  const paths: { tag: string; page: string }[] = [];

  allTags.forEach(({ tag, count }) => {
    const totalPages = Math.ceil(count / POSTS_PER_PAGE);

    // 生成页面参数，从第2页开始（第1页由 /posts/tag/[tag] 处理）
    for (let i = 2; i <= totalPages; i++) {
      paths.push({
        tag: encodeURIComponent(tag),
        page: i.toString(),
      });
    }
  });

  return paths;
}

export default async function TagPagePaginated({ params }: PageProps) {
  const { tag, page } = await params;
  const decodedTag = decodeURIComponent(tag);
  const pageNumber = parseInt(page, 10);

  // 验证页码
  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const { posts, totalPages, currentPage, totalPosts } = getPaginatedPostsByTag(
    decodedTag,
    pageNumber,
    9
  );
  const allTags = getAllTags();

  // 如果页码超出范围或没有找到文章，返回404
  if (pageNumber > totalPages || posts.length === 0) {
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
