'use client';

import { useEffect, useState } from 'react';

type Heading = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  className?: string;
};

export default function TableOfContents({ className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 获取所有标题元素（h1-h3）
    const elements = Array.from(document.querySelectorAll('.prose h1, .prose h2, .prose h3'));
    const headingElements = elements.map((element) => ({
      id: element.id,
      text: element.textContent || '',
      level: parseInt(element.tagName[1]),
    }));
    setHeadings(headingElements);

    // 设置 Intersection Observer 来监听标题元素的可见性
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -80% 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`${className} sticky top-24 max-h-[calc(100vh-8rem)] overflow-auto`}>
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">目录</h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${heading.level === 1 ? '' : heading.level === 2 ? 'ml-4' : 'ml-8'} transition-colors duration-200 border-l-2 ${activeId === heading.id ? 'border-blue-600 dark:border-blue-400' : 'border-transparent'}`}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 text-sm hover:text-blue-600 dark:hover:text-blue-400 pl-3 ${activeId === heading.id
                ? 'text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-gray-400'
                }`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  const headerOffset = 100; // header高度加上一些额外空间
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}