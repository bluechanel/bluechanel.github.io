/**
 * Markdown for Agents 产物拍平脚本（next build 之后运行）。
 *
 * Next 静态导出无法产出带扩展名的动态路径文件，路由 /posts/[id]/index.md
 * 导出为 out/posts/<slug>/index.md；这里统一改名为 out/posts/<slug>.md
 * （业界惯例形态，如 Anthropic Docs / Mintlify）。
 *
 * 安全约束：
 * - 只移动文件，目录非空时绝不删除（页面导出的 RSC sidecar 同目录共存）
 * - 移动数量与 content/ 下源文件数量强校验，不符则非零退出——
 *   把静态导出命名的静默回归变成响亮的 CI 失败
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const moved = { posts: 0, books: 0 };

for (const dir of ['posts', 'books']) {
  const base = path.join(root, 'out', dir);
  if (!fs.existsSync(base)) continue;

  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const src = path.join(base, entry.name, 'index.md');
    if (!fs.existsSync(src)) continue;

    fs.renameSync(src, path.join(base, `${entry.name}.md`));
    moved[dir] += 1;

    const dirPath = path.join(base, entry.name);
    if (fs.readdirSync(dirPath).length === 0) fs.rmdirSync(dirPath);
  }
}

const countMd = (dir) =>
  fs.existsSync(path.join(root, 'content', dir))
    ? fs.readdirSync(path.join(root, 'content', dir)).filter((f) => f.endsWith('.md')).length
    : 0;

const expectedPosts = countMd('posts');
const expectedBooks = countMd('notes'); // 读书笔记源文件在 content/notes

if (moved.posts !== expectedPosts || moved.books !== expectedBooks) {
  console.error(
    `✗ flatten-agent-md: 数量校验失败 —— 期望 posts=${expectedPosts}/books=${expectedBooks}，` +
      `实际移动 posts=${moved.posts}/books=${moved.books}。静态导出产物异常，构建中止。`,
  );
  process.exit(1);
}

console.log(`✓ flatten-agent-md: moved ${moved.posts} post + ${moved.books} note markdown files`);
