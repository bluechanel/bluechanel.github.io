import { getSortedPostsData } from '@/lib/posts';
import { PostCard } from '@/components/postcard';

export async function generateMetadata(props: { params: any }) {
  const params = await props.params
  return {
    title: `文章 | Wiley`,
    description: '一个专注于人工智能、大型语言模型开发和前沿技术见解的技术博客。分享在人工智能和大型语言模型方面的实践经验和深入分析。涉及的技术栈包括，LangGraph，RAG，Agent，MCP，Python，NextJS，LLM等',
  }
}

export default function Posts() {
  const allPostsData = getSortedPostsData();

  return (
    <div className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16'>
        <div className="flex flex-row lg:flex-row gap-4">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {allPostsData.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    </div>
  );
}