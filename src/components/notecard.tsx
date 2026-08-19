import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from '@/components/motion';
import type { NoteMeta } from '@/lib/notes';

// Notion Status select → 中文展示
const STATUS_LABELS: Record<string, string> = {
  Finished: '已读完',
  Reading: '在读',
  Want: '想读',
};

type NoteCardProps = {
  className?: string;
  index?: number;
  note: NoteMeta;
};

// 书籍卡片：左封面（竖版 2:3），右书籍元数据（书名/作者/日期/tags）
export function NoteCard({ className, index = 0, note }: NoteCardProps) {
  const statusLabel = STATUS_LABELS[note.status] ?? note.status;
  return (
    <FadeIn delay={index * 0.06}>
      <article
        key={note.id}
        className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out w-full flex"
      >
        {/* 左：书籍封面 */}
        <div className="relative w-24 sm:w-32 flex-shrink-0 aspect-[2/3]">
          {note.cover ? (
            // 页面在 /books/{id} 下，必须带 /posts/ 前缀才能命中 public/posts/cover/
            <Image src={`/posts/${note.cover}`} alt={`《${note.bookName}》封面`} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500" />
          )}
        </div>
        {/* 右：书籍元数据 */}
        <div className="flex flex-col justify-between p-4 min-w-0 flex-1">
          <div>
            <h1 className="text-base font-semibold leading-snug text-gray-900 dark:text-white">
              <Link href={`/books/${note.id}`}>{note.bookName}</Link>
            </h1>
            {/* 笔记标题与书名不同时，作为副标题展示 */}
            {note.title !== note.bookName && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{note.title}</p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1.5">
              {note.author}
            </p>
            {note.status && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {statusLabel}
              </p>
            )}
          </div>
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(note.date, 'yyyy-MM-dd')}
            </div>
          </div>
        </div>
      </article>
    </FadeIn>
  );
}
