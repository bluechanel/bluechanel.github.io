import React from 'react';
import clsx from 'clsx'; // 导入 clsx
import Image from 'next/image';


interface FooterProps {
  className?: string;
}

export function  Footer({ className }: FooterProps) {
    // 使用 clsx 来合并 class
  const finalClasses = clsx(
    // 基础样式
    'w-full h-24 bg-gray-100 dark:bg-gray-950 px-4 py-2 rounded-md transition-colors',
    className 
  );
  return (
    <footer className={finalClasses}>
      <div className="max-w-6xl mx-auto h-full flex flex-col sm:flex-row justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
            © 2020-{new Date().getFullYear()} Wiley's Blog
        </div>
        <div className="mt-2 sm:mt-0 flex flex-row items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300 px-4">扫码关注:</span>
            <Image src="/wechat.png" alt="微信公众号" width={24} height={24} className="h-24 w-auto" />
        </div>
    </div>
    </footer>
  )
}
