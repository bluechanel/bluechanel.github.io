import React from 'react';
import clsx from 'clsx'; // 导入 clsx

type BlogMetadata = {
    title?: string;
    description?: string;
    date?: string;
    updateDate?: string;
    tags?: [];
    cover?: string;
};

export type { BlogMetadata };

type PostCardProps = {
    className?: string;
    post: {
        route: string;
        frontMatter: BlogMetadata;
    };
    readMore?: string;
};

export function  PostCard({ className, post, readMore }: PostCardProps) {
    // 使用 clsx 来合并 class
  const finalClasses = clsx(
    // 基础样式
    'g-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out',
    className 
  );
  return (
    <article className={finalClasses}>
        <div className="relative h-48 w-full">
            <img src={post.frontMatter.cover} alt="封面图片" className="h-full w-full object-cover" />
        </div>
        <div className="px-4 py-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {post.frontMatter.tags?post.frontMatter.tags.map((tag) => (
                    <span key={`${post.frontMatter.title}-${tag}`} className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {tag}
                    </span>
                )): <span>无标签</span>}
            </div>
            <h1 className="h-12 line-clamp-2 text-base font-semibold mb-2 leading-snug text-gray-900 dark:text-white">
                <a href={post.route.replace("/content", "/posts")} >{post.frontMatter.title}</a>
            </h1>
            <div className="group relative h-12 overflow-hidden">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{post.frontMatter.description}</p>
            </div>
            <div className='flex flex-row justify-between'>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {post.frontMatter.date}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {/* {post.frontMatter.readingTime? post.frontMatter.readingTime.text: 1} min */}
                </div>
            </div>
        </div>
    </article>
  )
}
