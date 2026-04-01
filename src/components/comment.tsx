'use client'
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Giscus from '@giscus/react';

export function Comment() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full h-full">
      <Giscus
        id="comments"
        repo="bluechanel/bluechanel.github.io"
        repoId="R_kgDOPJbDvQ="
        category="Announcements"
        categoryId="DIC_kwDOPJbDvc4CtPDS"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={mounted && resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}
