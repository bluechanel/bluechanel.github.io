import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16'>
        <div className="flex flex-row lg:flex-row gap-4">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {allPostsData.map((post) => (
                    <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
                        <div className="relative h-48 w-full">
                                <img src={`/posts/${post.cover}`} alt="封面图片" className="h-full w-full object-cover" />
                        </div>
                        <div className="px-4 py-2">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {post.tags.map((tag) => (
                                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-blue-200 text-blue-800">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="h-12 line-clamp-2 text-base font-semibold mb-2 leading-snug text-gray-900 dark:text-white">
                                <a href={`/posts/${post.id}`}>{post.title}</a>
                            </h1>
                            <div className="group relative h-12 overflow-hidden">
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{post.description}</p>
                            </div>
                            <div className='flex flex-row justify-between'>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {post.updateDate.toDateString()}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {post.readingTime} min
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    </div>
  );
}