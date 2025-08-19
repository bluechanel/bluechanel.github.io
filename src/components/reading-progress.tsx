"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; // 已经滚动的高度
      const docHeight = document.documentElement.scrollHeight; // 文档总高度
      const winHeight = window.innerHeight; // 窗口高度
      const totalScroll = docHeight - winHeight;
      const scrollPercent = (scrollTop / totalScroll) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
      <div
        className="h-1 bg-blue-500 dark:bg-blue-400 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
