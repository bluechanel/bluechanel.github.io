import React from 'react';
import clsx from 'clsx'; // 导入 clsx


interface FooterProps {
  className?: string;
}

export function  Footer({ className }: FooterProps) {
    // 使用 clsx 来合并 class
  const finalClasses = clsx(
    // 基础样式
    'flex items-center justify-center px-4 py-2 font-semibold rounded-md transition-colors',
    className 
  );
  return (
    <footer className={finalClasses}>
      Powered by Nextra {new Date().getFullYear()}
    </footer>
  )
}
