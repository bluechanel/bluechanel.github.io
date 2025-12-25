import { getPaginatedPostsData, getSortedPostsData, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/postcard';
import { Pagination } from '@/components/pagination';
import { TagCloud } from '@/components/tag-cloud';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);
  
  if (isNaN(pageNumber) || pageNumber < 1) {
    return {
      title: `文章 | Wiley`,
      description: '一个专注于人工智能、大型语言模型开发和前沿技术见解的技术博客。分享在人工智能和大型语言模型方面的实践经验和深入分析。涉及的技术栈包括，LangGraph，RAG，Agent，MCP，Python，NextJS，LLM等',
    };
  }

  return {
    title: `文章 | 第${pageNumber}页 | Wiley`,
    description: `文章列表第${pageNumber}页 - 一个专注于人工智能、大型语言模型开发和前沿技术见解的技术博客。分享在人工智能和大型语言模型方面的实践经验和深入分析。涉及的技术栈包括，LangGraph，RAG，Agent，MCP，Python，NextJS，LLM等`,
  };
}

// 生成所有可能的页面路径
export async function generateStaticParams() {
  const allPostsData = getSortedPostsData();
  const POSTS_PER_PAGE = 9;
  const totalPages = Math.ceil(allPostsData.length / POSTS_PER_PAGE);
  
  // 生成页面参数，从第2页开始（第1页由 /posts 处理）
  const paths = [];
  for (let i = 2; i <= totalPages; i++) {
    paths.push({ page: i.toString() });
  }
  
  return paths;
}

export default async function PostsPage({ params }: PageProps) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);

  // 验证页码
  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const { posts: paginatedPosts, totalPages, currentPage } = getPaginatedPostsData(pageNumber, 9);
  const allTags = getAllTags();

  // 如果页码超出范围，返回404
  if (pageNumber > totalPages) {
    notFound();
  }

  return (
    <div className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16'>
      {/* 标签云 */}
      <div className="mb-8">
        <TagCloud tags={allTags} />
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {paginatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}