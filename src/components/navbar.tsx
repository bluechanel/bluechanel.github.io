"use client";

import { useEffect, useState, type FC } from "react";
import { Sun, Moon, Search } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export const Navbar: FC<{}> = ({}) => {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();

    // State for preventing hydration mismatch with next-themes
    const [mounted, setMounted] = useState(false);
    // State for tracking scroll position
    const [isScrolled, setIsScrolled] = useState(false);
    // State for search modal
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    // State for forcing re-render of search component
    const [searchKey, setSearchKey] = useState(0);
    // State for tracking Google CSE loading
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const items = [
        { title: "首页", route: "/" },
        { title: "文章", route: "/posts" },
        { title: "读书", route: "/books" },
        { title: "观影", route: "/films" },
        { title: "相册", route: "/gallary" },
        { title: "开往", route: "https://www.travellings.cn/go.html" },
        { title: "关于", route: "https://about.wileyzhang.com/" },
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
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // 当搜索框打开时，锁定 body 滚动并确保 Google CSE 正确加载
    useEffect(() => {
        if (isSearchOpen) {
            // 锁定 body 滚动
            document.body.style.overflow = "hidden";
            // 设置加载状态
            setIsSearchLoading(true);
            // 增加 key 以强制重新渲染搜索组件
            setSearchKey((prev) => prev + 1);

            if (typeof window !== "undefined") {
                // 等待 Google CSE 脚本加载完成并手动渲染
                const initSearch = () => {
                    const goog = (window as any).google;
                    if (goog?.search?.cse?.element) {
                        try {
                            // 清空容器
                            const container = document.getElementById(
                                `search-container-${searchKey + 1}`,
                            );
                            if (container) {
                                container.innerHTML = "";

                                // 手动渲染 Google CSE
                                goog.search.cse.element.render({
                                    div: `search-container-${searchKey + 1}`,
                                    tag: "search",
                                });

                                // 等待渲染完成
                                const waitForInput = (attempts = 0) => {
                                    const searchBox =
                                        container.querySelector(".gsc-input");
                                    if (searchBox) {
                                        setIsSearchLoading(false);
                                        (searchBox as HTMLInputElement).focus();
                                    } else if (attempts < 20) {
                                        setTimeout(
                                            () => waitForInput(attempts + 1),
                                            100,
                                        );
                                    } else {
                                        setIsSearchLoading(false);
                                    }
                                };
                                waitForInput();
                            }
                        } catch (error) {
                            console.error("Google CSE 渲染失败:", error);
                            setIsSearchLoading(false);
                        }
                    } else if ((window as any).__gcse) {
                        // 如果存在 __gcse 对象，尝试触发回调
                        setTimeout(initSearch, 100);
                    } else {
                        // 继续等待 CSE 脚本加载
                        setTimeout(initSearch, 100);
                    }
                };

                // 延迟一点以确保 DOM 已更新
                setTimeout(initSearch, 50);
            }
        } else {
            // 恢复 body 滚动
            document.body.style.overflow = "";

            // 清除 Google CSE 添加的 URL hash
            if (
                typeof window !== "undefined" &&
                window.location.hash.includes("gsc.")
            ) {
                window.history.replaceState(
                    null,
                    "",
                    window.location.pathname + window.location.search,
                );
            }
        }

        return () => {
            // 清理：恢复 body 滚动
            document.body.style.overflow = "";
        };
    }, [isSearchOpen]);

    // On initial render, return null to avoid hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        // 1. 修改了根元素：从 div 改为 nav，并应用了 sticky 定位和动态样式
        <nav
            className={clsx(
                "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
                // 根据 isScrolled 状态动态添加毛玻璃效果
                isScrolled
                    ? "bg-gray-100/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50"
                    : "bg-transparent",
            )}
        >
            {/* 2. 添加了一个容器来控制 navbar 内容的最大宽度和居中 */}
            <div className="max-w-6xl mx-auto px-4 lg:px-8">
                {/* 3. 使用 flex 布局来居中导航项并放置主题切换按钮 */}
                <div className="relative flex items-center justify-center h-16">
                    {/* 您的导航链接部分，现在有了动态背景 */}
                    <div
                        className={clsx(
                            "relative flex items-center space-x-6 transition-colors duration-300",
                            // 当未滚动时，显示胶囊背景；滚动后，背景消失以融入毛玻璃效果
                            !isScrolled
                                ? "bg-gray-50 dark:bg-gray-800 rounded-full shadow px-6 py-2"
                                : "px-6 py-2",
                        )}
                    >
                        {items.map((item) => {
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
                            );
                        })}
                    </div>

                    {/* 搜索按钮和主题切换按钮 */}
                    <div className="absolute right-0 flex items-center space-x-2">
                        {/* 搜索按钮 */}
                        <button
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="搜索"
                        >
                            <Search
                                className={clsx(
                                    "h-5 w-5",
                                    theme === "dark"
                                        ? "text-gray-100"
                                        : "text-gray-900",
                                )}
                            />
                        </button>

                        {/* 主题切换按钮 */}
                        {theme === "dark" ? (
                            <button
                                className="p-2 rounded-full hover:bg-gray-700"
                                onClick={() => setTheme("light")}
                            >
                                <Sun className="h-5 w-5 text-gray-100" />
                            </button>
                        ) : (
                            <button
                                className="p-2 rounded-full hover:bg-gray-200"
                                onClick={() => setTheme("dark")}
                            >
                                <Moon className="h-5 w-5 text-gray-900" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 搜索弹出框 */}
            {isSearchOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-20"
                    onClick={() => setIsSearchOpen(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            setIsSearchOpen(false);
                        }
                    }}
                >
                    <div
                        className="w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-full">
                            {/* Loading 状态 */}
                            {isSearchLoading && (
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                                        <span className="text-gray-600 dark:text-gray-400">
                                            正在加载搜索...
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Google CSE 完整搜索 - 添加滚动容器 */}
                            <div
                                className={clsx(
                                    "p-4 overflow-y-auto flex-1 overscroll-contain",
                                    isSearchLoading && "hidden",
                                )}
                                onWheel={(e) => {
                                    // 阻止滚动传播到父元素
                                    e.stopPropagation();
                                }}
                            >
                                <div
                                    id={`search-container-${searchKey}`}
                                    key={searchKey}
                                ></div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex-shrink-0">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    按 ESC 键关闭
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
