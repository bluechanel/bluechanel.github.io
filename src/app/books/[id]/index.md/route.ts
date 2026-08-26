// 读书笔记的 Markdown for Agents 版本端点。
// 静态导出产物为 out/books/<uuid>/index.md，构建后由 scripts/flatten-agent-md.mjs
// 拍平为 out/books/<uuid>.md。
export const dynamic = 'force-static';

import { getAllNoteIds, getNoteData } from '@/lib/notes';
import { buildNoteMarkdown } from '@/lib/agent-md';

export async function generateStaticParams() {
  return getAllNoteIds().map((p) => ({ id: p.params.id }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return new Response(buildNoteMarkdown(await getNoteData(id)), {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
