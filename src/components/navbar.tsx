'use client'

import { useEffect, useState, type FC } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from "next/link";
import { usePathname } from "next/navigation"; // ① 引入

export const Navbar: FC<{ }> = ({ }) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname() // ② 获取当前路由路径

  const items = [
    {
      title: "首页",
      route: "/"
    },
    {
      title: "文章",
      route: "/posts"
    },
    {
      title: "读书",
      route: "/books"
    },
    {
      title: "观影",
      route: "/films"
    },
    {
      title: "开往",
      route: "https://www.travellings.cn/go.html"
    },
    {
      title: "关于",
      route: "https://about.wileyzhang.com/"
    }
  ]

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // 避免 SSR/CSR 不一致，第一次渲染不输出依赖 theme 的内容
    return null;
  }

  return (
      <div className="relative flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
        <div className="relative flex items-center space-x-6 bg-gray-50 dark:bg-gray-800 rounded-full shadow px-6 py-2">
          {items.map(item => {
            const isActive = pathname === item.route // ③ 刷新后自动根据路径判断
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

        <div className="absolute right-4 flex items-center space-x-3">
          {theme == "dark" ? (
            <button className="p-2 rounded-full bg-black" onClick={() => setTheme("light")}>
              <Sun />
            </button>
          ) : (
            <button className="p-2 rounded-full bg-white" onClick={() => setTheme("dark")}>
              <Moon />
            </button>
          )}
        </div>
      </div>
  )
}
