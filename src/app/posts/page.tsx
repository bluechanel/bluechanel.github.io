import { getSortedPostsData } from '@/lib/posts';
import Image from 'next/image';
import { format } from 'date-fns';
import { PostCard } from '@/components/postcard';

export async function generateMetadata(props: { params: any }) {
  const params = await props.params
  return {
    title: `文章 | Wiley`
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