'use client'
import Giscus from '@giscus/react';

export function  Comment() {
  return (
    <div className="w-full h-full">
      <Giscus
        id="comments"
        repo="bluechanel/bluechanel.github.io"
        repoId="R_kgDOPJbDvQ="
        category="Announcements"
        categoryId="DIC_kwDOPJbDvc4CtPDS"
        mapping="pathname"
        // term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        // theme="light"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}