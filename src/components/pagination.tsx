'use client';

import Link from 'next/link';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = '/posts' }: PaginationProps) {
  const getPageHref = (page: number) => {
    if (page === 1) return basePath;
    return `${basePath}/page/${page}`;
  };

  // 生成页码数组
  const getPageNumbers = () => {
    const delta = 2; // 当前页前后显示的页码数
    const range = [];
    const rangeWithDots = [];

    // 添加第一页
    range.push(1);

    // 计算中间范围
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // 添加最后一页
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // 添加省略号
    let lastPage = 0;
    for (const page of range) {
      if (page - lastPage === 2) {
        // 只差一个页码，不需要省略号
        rangeWithDots.push(lastPage + 1);
      } else if (page - lastPage !== 1) {
        // 差多个页码，添加省略号
        rangeWithDots.push('...');
      }
      rangeWithDots.push(page);
      lastPage = page;
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center space-x-2 mt-8" aria-label="分页导航">
      {/* 上一页 */}
      {currentPage > 1 && (
        <Link 
          href={getPageHref(currentPage - 1)} 
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          上一页
        </Link>
      )}

      {/* 页码 */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span 
              key={`ellipsis-${index}`} 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              ...
            </span>
          );
        }

        return (
          <Link
            key={page as number}
            href={getPageHref(page as number)}
            className={clsx(
              'px-3 py-2 rounded-md text-sm font-medium border',
              currentPage === page
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 border-blue-500 dark:border-blue-500'
                : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Link>
        );
      })}

      {/* 下一页 */}
      {currentPage < totalPages && (
        <Link 
          href={getPageHref(currentPage + 1)} 
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          下一页
        </Link>
      )}
    </nav>
  );
}