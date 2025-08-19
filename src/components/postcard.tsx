import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';

type PostCardProps = {
    className?: string;
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

export function  PostCard({className, post }: PostCardProps) {
    return (
        <article key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
            <div className="relative h-48 w-full">
                <Image src={`/posts/${post.cover}`} alt="封面图片" fill className="object-cover" />
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
                        {format(post.updateDate, 'yyyy-MM-dd')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {post.readingTime} min
                    </div>
                </div>
            </div>
        </article>
    )
}
