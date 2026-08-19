import { getSortedPostsData } from '@/lib/posts';
import { getSortedNotesData } from '@/lib/notes';

export interface PageLink {
  url: string;
  title: string;
}

/** 把 uuid 统一成 8-4-4-4-12 连字符小写形式（Notion mention 里常是无连字符的 32 位 hex） */
function formatUuid(raw: string): string | null {
  const hex = raw.replace(/[^0-9a-f]/gi, '').toLowerCase();
  if (hex.length !== 32) return null;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * 构建「Notion 页面 UUID → 博客文章/笔记链接」映射。
 * - 文章：frontmatter 的 pageId（同步脚本写入）→ 文件名 slug，URL 为 /posts/<slug>
 * - 读书笔记：仍用 uuid 文件名，id 即 uuid，URL 为 /books/<uuid>
 */
export function getPageLinkMap(): Record<string, PageLink> {
  const map: Record<string, PageLink> = {};
  for (const post of getSortedPostsData()) {
    if (post.pageId) {
      const uuid = formatUuid(post.pageId);
      if (uuid) map[uuid] = { url: `/posts/${post.id}`, title: post.title };
    }
  }
  for (const note of getSortedNotesData()) {
    const uuid = formatUuid(note.id);
    if (uuid) map[uuid] = { url: `/books/${note.id}`, title: note.title };
  }
  return map;
}

/** markdown 链接文本里的括号/方括号转义，防止破坏 [标题](url) 结构 */
function escapeLabel(text: string): string {
  return text.replace(/[\[\]()]/g, (c) => `\\${c}`);
}

// Notion mention：<mention-page url="https://app.notion.com/p/<uuid>"/>
const MENTION_RE =
  /<mention-page\s+url=["'][^"']*?\/p\/([0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}|[0-9a-fA-F]{32})["']\s*\/?>/gi;

/**
 * 把 Notion 导出的 <mention-page> 解析成站内 markdown 链接 [标题](/posts/<slug>)。
 * 目标文章/笔记已同步 → 解析为链接；
 * 未同步 → 保留原样并 console.warn（目标同步后下次构建自动解析，无需重同步源文）。
 */
export function resolveMentions(content: string): string {
  const map = getPageLinkMap();
  const unresolved: string[] = [];
  const resolved = content.replace(MENTION_RE, (match, rawUuid: string) => {
    const uuid = formatUuid(rawUuid);
    const target = uuid ? map[uuid] : undefined;
    if (target) return `[${escapeLabel(target.title)}](${target.url})`;
    if (uuid && !unresolved.includes(uuid)) unresolved.push(uuid);
    return match;
  });
  if (unresolved.length) {
    console.warn(
      `  ⚠ [mention] 以下目标文章/笔记尚未同步，内链保留原样（同步后自动解析）:\n    ` +
        unresolved.join('\n    '),
    );
  }
  return resolved;
}
