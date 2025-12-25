import { getPaginatedPostsData, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/postcard';
import { Pagination } from '@/components/pagination';
import { TagCloud } from '@/components/tag-cloud';

export async function generateMetadata(props: { params: any }) {
  const params = await props.params
  return {
    title: `文章 | Wiley`,
    description: '一个专注于人工智能、大型语言模型开发和前沿技术见解的技术博客。分享在人工智能和大型语言模型方面的实践经验和深入分析。涉及的技术栈包括，LangGraph，RAG，Agent，MCP，Python，NextJS，LLM等',
  }
}

export default function Posts() {
  const { posts: paginatedPosts, totalPages, currentPage } = getPaginatedPostsData(1, 9);
  const allTags = getAllTags();

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