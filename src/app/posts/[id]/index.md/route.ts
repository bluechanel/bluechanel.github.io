// 文章的 Markdown for Agents 版本端点。
// 静态导出产物为 out/posts/<slug>/index.md，构建后由 scripts/flatten-agent-md.mjs
// 拍平为 out/posts/<slug>.md（GitHub Pages 无法按 Accept 头协商，故预生成约定 URL）。
// 形制参照 src/app/llms.txt/route.ts 的字面量目录先例。
export const dynamic = 'force-static';

import { getAllPostIds, getPostData } from '@/lib/posts';
import { buildPostMarkdown } from '@/lib/agent-md';

export async function generateStaticParams() {
  // 仅真实博客文章——读书笔记的旧 /posts/<uuid> 重定向桩不提供 .md
  return getAllPostIds().map((p) => ({ id: p.params.id }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return new Response(buildPostMarkdown(await getPostData(id)), {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
