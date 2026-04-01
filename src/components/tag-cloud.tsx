'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface Tag {
  tag: string;
  count: number;
}

interface TagCloudProps {
  tags: Tag[];
  currentTag?: string;
}

export function TagCloud({ tags, currentTag }: TagCloudProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleTags = tags.slice(0, 8);
  const extraTags = tags.slice(8);

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        {/* "全部"标签 */}
        <Link
          href="/posts"
          className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
            !currentTag
              ? 'bg-blue-600 dark:bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          全部
        </Link>

        {visibleTags.map(({ tag, count }) => {
          const isActive = currentTag === tag;
          return (
            <Link
              key={tag}
              href={`/posts/tag/${encodeURIComponent(tag)}`}
              className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-600 dark:bg-blue-600 text-white'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
              }`}
            >
              #{tag}
            </Link>
          );
        })}

        {/* Animated extra tags */}
        <AnimatePresence>
          {showAll && extraTags.map(({ tag, count }, index) => {
            const isActive = currentTag === tag;
            return (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
              >
                <Link
                  href={`/posts/tag/${encodeURIComponent(tag)}`}
                  className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 dark:bg-blue-600 text-white'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                  }`}
                >
                  #{tag}
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* 显示更多/收起按钮 */}
        {tags.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
          >
            {showAll ? '收起 ↑' : `更多 (${tags.length - 8}) ↓`}
          </button>
        )}
      </div>
    </div>
  );
}
