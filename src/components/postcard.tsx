import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from '@/components/motion';

type PostCardProps = {
    className?: string;
    index?: number;
    post: {
        id: string;
        title: string;
        description: string;
        date: Date;
        updateDate: Date;
        tags: string[];
        cover: string;
        readingTime: number;
    };
};

export function PostCard({ className, index = 0, post }: PostCardProps) {
    return (
        <FadeIn delay={index * 0.06}>
            <article key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out w-full max-w-sm justify-self-start">
                <div className="relative h-48 w-full">
                    {post.cover ? (
                        <Image src={`/posts/${post.cover}`} alt="封面图片" fill className="object-cover" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500" />
                    )}
                </div>
                <div className="px-4 py-2">
                    {/* tag 只占一行：flex 默认不换行 + overflow-hidden 裁剪超出的 tag */}
                    <div className="flex gap-2 mb-2 overflow-hidden">
                        {post.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/posts/tag/${encodeURIComponent(tag)}`}
                                className="whitespace-nowrap text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                    <h1 className="h-12 line-clamp-2 text-base font-semibold mb-2 leading-snug text-gray-900 dark:text-white">
                        <Link href={`/posts/${post.id}`}>{post.title}</Link>
                    </h1>
                    <div className="group relative h-12 overflow-hidden">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{post.description}</p>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {format(post.updateDate, 'yyyy-MM-dd')}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {post.readingTime} min
                        </div>
                    </div>
                </div>
            </article>
        </FadeIn>
    )
}
