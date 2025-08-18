'use client'

import { useEffect, useState, type FC } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx';


export const Navbar: FC<{ }> = ({ }) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // State for preventing hydration mismatch with next-themes
  const [mounted, setMounted] = useState(false);
  // State for tracking scroll position
  const [isScrolled, setIsScrolled] = useState(false);

  const items = [
    { title: "首页", route: "/" },
    { title: "文章", route: "/posts" },
    { title: "读书", route: "/books" },
    { title: "观影", route: "/films" },
    { title: "开往", route: "https://www.travellings.cn/go.html" },
    { title: "关于", route: "https://about.wileyzhang.com/" }
  ];

  // Effect for mounting and preventing hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect for tracking scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // On initial render, return null to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    // 1. 修改了根元素：从 div 改为 nav，并应用了 sticky 定位和动态样式
    <nav className={clsx(
      'sticky top-0 z-50 w-full transition-all duration-300 ease-in-out',
      // 根据 isScrolled 状态动态添加毛玻璃效果
      isScrolled 
        ? 'bg-gray-100/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50'
        : 'bg-transparent'
    )}>
      {/* 2. 添加了一个容器来控制 navbar 内容的最大宽度和居中 */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* 3. 使用 flex 布局来居中导航项并放置主题切换按钮 */}
        <div className="relative flex items-center justify-center h-16">
          
          {/* 您的导航链接部分，现在有了动态背景 */}
          <div className={clsx(
              'relative flex items-center space-x-6 transition-colors duration-300',
              // 当未滚动时，显示胶囊背景；滚动后，背景消失以融入毛玻璃效果
              !isScrolled 
                ? 'bg-gray-50 dark:bg-gray-800 rounded-full shadow px-6 py-2'
                : 'px-6 py-2'
            )}>
            {items.map(item => {
              const isActive = pathname === item.route;
              return (
                <Link
                  key={item.title}
                  id={`link-${item.route}`}
                  href={item.route}
                  className={`relative pb-1 transition-colors duration-300 ${
                    isActive
                      ? "text-green-500"
                      : "text-gray-700 dark:text-gray-300 hover:text-green-500"
                  }`}
                >
                  {item.title}
                </Link>
              )
            })}
          </div>

          {/* 您的主题切换按钮 */}
          <div className="absolute right-0 flex items-center">
            {theme === "dark" ? (
              <button className="p-2 rounded-full hover:bg-gray-700" onClick={() => setTheme("light")}>
                <Sun className="h-5 w-5 text-gray-100" />
              </button>
            ) : (
              <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => setTheme("dark")}>
                <Moon className="h-5 w-5 text-gray-900" />
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}