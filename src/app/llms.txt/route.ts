export const dynamic = 'force-static';

import { getSortedPostsData } from '@/lib/posts';
import { getSortedNotesData } from '@/lib/notes';
import { absoluteUrl } from '@/lib/site';

/**
 * llms.txt：面向 LLM/Agent 的全站索引。
 * 每个条目的主链接直接指向该内容的 Markdown 版本（/posts/<slug>.md、/books/<uuid>.md，
 * 由 index.md 路由 + 拍平脚本在构建时生成），HTML 页面链接作为括注的次选给出。
 */
export async function GET() {
  const posts = await getSortedPostsData();
  const notes = await getSortedNotesData();

  let llms = `# Wiley Blog | AI/LLM developer blog

## 介绍(Introduction)

一个专注于人工智能、大型语言模型开发和前沿技术见解的技术博客。分享在人工智能和大型语言模型方面的实践经验和深入分析。涉及的技术栈包括，LangGraph，RAG，Agent，MCP，Python，NextJS，LLM等。

每个条目的链接均为该内容的完整 Markdown 文档（含 frontmatter 元数据与 JSON-LD 结构化数据），可直接抓取使用；括注的 HTML 链接是对应的网页版本。

## 文章(Posts)
`;

  for (const post of posts) {
    llms += `\n- [${post.title}](${absoluteUrl(`/posts/${post.id}.md`)}): ${post.description}（HTML: ${absoluteUrl(`/posts/${post.id}`)}）`;
  }

  if (notes.length) {
    llms += `\n\n## 读书笔记(Notes)\n`;
    for (const note of notes) {
      llms += `\n- [${note.title}](${absoluteUrl(`/books/${note.id}.md`)}): 《${note.bookName}》 by ${note.author}（${note.status}）（HTML: ${absoluteUrl(`/books/${note.id}`)}）`;
    }
  }

  return new Response(`${llms}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
