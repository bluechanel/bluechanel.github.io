import { format } from 'date-fns';
import { resolveMentions } from '@/lib/page-links';
import { buildPostJsonLd, buildNoteJsonLd } from '@/lib/jsonld';
import { SITE_URL, absoluteUrl } from '@/lib/site';

/**
 * 「Markdown for Agents」文档构建器。
 *
 * 参照 Cloudflare Markdown for Agents 的响应结构，在构建时为每篇文章/读书笔记
 * 预生成一份干净的 Markdown 文档（由 /posts/[id]/index.md 路由导出、脚本拍平为 .md）：
 *
 *   ---
 *   <YAML frontmatter：title/description/image/url/date/tags/…>
 *   ---
 *
 *   <正文（清洗掉 Notion 工件与 Markdoc 标签，链接全部绝对化）>
 *
 *   > 署名引用块
 *
 *   ```json
 *   <与 HTML 页面同一来源的 JSON-LD 结构化数据>
 *   ```
 */

/** 文章/笔记的最小结构约束（posts.ts / notes.ts 的返回对象均天然满足） */
interface BaseDoc {
  id: string;
  date: Date | string;
  updateDate: Date | string;
  tags?: string[];
  /** 相对 public/posts/ 的封面路径；frontmatter 里存在空值（bare `cover:`），运行时可能是 null */
  cover?: string | null;
  readingTime?: number;
  content: string;
}

export interface PostDoc extends BaseDoc {
  title: string;
  description: string;
}

export interface NoteDoc extends BaseDoc {
  title: string;
  bookName?: string;
  author?: string;
  status?: string;
  bookUrl?: string;
}

/* ---------- 正文清洗 ---------- */

const FENCE_LINE = /^\s{0,3}(`{3,}|~{3,})/;
const FENCE_CLOSE_LINE = /^\s{0,3}(`{3,}|~{3,})\s*$/;

/**
 * 已知名称的 Notion 导出 XML 工件清理规则（只按名单删，不做通用 XML 剥离）：
 * - mention-page：未被 resolveMentions 解析的内链占位（目标尚未同步）
 * - unknown：bookmark / 外部对象嵌入，HTML 渲染时同样不可见
 * - database：空的 collection 嵌入
 * - page：保留可见文本，丢弃失效的 Notion URL
 */
const NOTION_XML_RULES: Array<[RegExp, string]> = [
  [/<mention-page\s+[^>]*\/?>/g, ''],
  [/<unknown\s+[^>]*\/?>/g, ''],
  [/<database\s+[^>]*>\s*<\/database>/g, ''],
  [/<page\s+url="[^"]*">(.*?)<\/page>/g, '$1'],
];

/** 单条围栏外文本行的清洗规则 */
function cleanLine(line: string): string {
  let out = line;

  // 1. Notion XML 工件
  for (const [re, replacement] of NOTION_XML_RULES) {
    out = out.replace(re, replacement);
  }

  // 2. Markdoc 标签（同步脚本只会产出 mark / details / summary 三种）：
  //    先把 {% summary %}X{%/summary %} 提取成粗体行（折叠语义对 Agent 无意义），
  //    再删除残余的 details/summary/mark 包裹符——纯删除操作不会破坏内部 markdown 语法。
  out = out.replace(/\{%\s*summary\s*%\}(.*?)\{%\s*\/summary\s*%\}/g, (_m, s: string) => `**${s.trim()}**`);
  out = out.replace(/\{%\s*\/?\s*(?:details|summary)\s*%\}/g, '');
  out = out.replace(/\{%\s*\/?\s*mark\b[^%]*%\}/g, '');

  return out;
}

/** markdown 链接/图片的 href 绝对化 */
function absolutizeHref(href: string, assetBase: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href; // http(s): mailto: tel: 等带协议的外链
  if (href.startsWith('//')) return href; // 协议相对
  if (href.startsWith('#')) return href; // 页内锚点
  if (href.startsWith('/')) return `${SITE_URL}${href}`; // 站内绝对路径（/posts/images/… 及 mention 解析出的内链）
  // 相对路径：Notion 同步的正文图片形如 images/<pageId>/<file>，相对文章页 URL
  return `${SITE_URL}${assetBase}/${href}`;
}

/** 把 ](href) 形式的链接/图片目标替换为绝对地址（含可选的 "title" 部分） */
function absolutizeMarkdownLinks(text: string, assetBase: string): string {
  return text.replace(/(\]\()([^()\s]+)([^)]*\))/g, (_m, open: string, href: string, rest: string) => {
    return `${open}${absolutizeHref(href, assetBase)}${rest}`;
  });
}

/**
 * 正文清洗管线（顺序固定）：
 * mention 内链解析 → Notion XML 清理 → Markdoc 标签重写 → 残余标签安全网
 * → 链接绝对化（fence 感知）→ 压缩多余空行
 */
export function cleanBodyForAgents(raw: string, assetBase: string = '/posts'): string {
  // 1. 先解析 Notion 内链 <mention-page> → [标题](/posts/<slug>)；
  //    未解析的目标会在下方 XML 清理中被移除，不会泄漏到产物里
  const withMentionsResolved = resolveMentions(raw);

  let residualTags = 0;
  const cleanedPerLine = (line: string) => {
    let out = cleanLine(line);
    // 安全网：未知 {% %} 标签一律移除并告警——同步脚本将来新增标签类型时在这里显式暴露
    out = out.replace(/\{%[\s\S]*?%\}/g, () => {
      residualTags += 1;
      return '';
    });
    return out;
  };

  // 围栏状态机 + 行变换一次遍历完成
  let inFence = false;
  let fenceChar = '';
  const lines = withMentionsResolved.split('\n').map((line) => {
    if (!inFence) {
      const open = line.match(FENCE_LINE);
      if (open) {
        inFence = true;
        fenceChar = open[1][0];
        return line; // 开栏行原样保留
      }
      return absolutizeMarkdownLinks(cleanedPerLine(line), assetBase);
    }
    const close = line.match(FENCE_CLOSE_LINE);
    if (close && close[1][0] === fenceChar) {
      inFence = false;
    }
    return line; // 围栏内原样保留
  });

  if (residualTags > 0) {
    console.warn(
      `  ⚠ [agent-md] 清理后仍发现 ${residualTags} 个未知 {% %} 标签，已移除（同步脚本可能新增了标签类型，请补充清洗规则）`,
    );
  }

  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/* ---------- 组装 ---------- */

/** 正文若不以 ATX 一级标题开头，补插 # {title}（读书笔记自带 H1，博客文章多数没有） */
function ensureH1(body: string, title: string): string {
  const firstNonEmpty = body.split('\n').find((l) => l.trim() !== '');
  if (firstNonEmpty && /^#\s/.test(firstNonEmpty.trim())) return body;
  return `# ${title}\n\n${body}`;
}

/**
 * token 数粗估（对标 Cloudflare 的 x-markdown-tokens；静态托管无法发响应头，故写进 frontmatter）。
 * BPE 分词器对中文平均 ~1 token/字、拉丁字符约 ~4 chars/token；真实值随模型浮动 ±30% 左右，
 * 仅作体量提示用。
 */
export function estimateTokens(text: string): number {
  const cjk = (text.match(/[一-龥]/g) ?? []).length;
  return Math.ceil(cjk + (text.length - cjk) / 4);
}

type YamlValue = string | number | string[] | undefined;

/** 字符串统一走 JSON.stringify——JSON 双引号字符串即合法 YAML 双引号标量，中文/冒号/引号天然安全 */
function yamlScalar(v: NonNullable<YamlValue>): string {
  if (Array.isArray(v)) return `[${v.map((x) => JSON.stringify(x)).join(', ')}]`;
  if (typeof v === 'number') return String(v);
  return JSON.stringify(v);
}

/** 有序键值 → YAML frontmatter 块；无值字段整体省略（与 CF 规范一致） */
function frontmatter(entries: Array<[string, YamlValue]>): string {
  const rows = entries
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `${k}: ${yamlScalar(v as NonNullable<YamlValue>)}`);
  return `---\n${rows.join('\n')}\n---`;
}

/** gray-matter 对未加引号的日期给出 Date 对象、加引号的给出字符串，统一格式化为 yyyy-MM-dd */
function fmtDate(d: Date | string | undefined): string | undefined {
  if (!d) return undefined;
  return d instanceof Date ? format(d, 'yyyy-MM-dd') : String(d);
}

/** 博客文章 → 完整 Markdown 文档 */
export function buildPostMarkdown(post: PostDoc): string {
  const canonical = absoluteUrl(`/posts/${post.id}`);
  const body = ensureH1(cleanBodyForAgents(post.content), post.title);
  const jsonLd = buildPostJsonLd(post);

  const footer = `---\n\n> 本文由 WileyZhang 原创，首发于 [Wiley Blog](${canonical})。`;
  const jsonBlock = '```json\n' + JSON.stringify(jsonLd, null, 2) + '\n```';
  const payload = `${body}\n\n${footer}\n\n${jsonBlock}`;

  const fm = frontmatter([
    ['title', post.title],
    ['description', post.description],
    ['image', post.cover ? absoluteUrl(`/posts/${post.cover}`) : undefined],
    ['url', canonical],
    ['date', fmtDate(post.date)],
    ['updated', fmtDate(post.updateDate)],
    ['type', 'blog-post'],
    ['tags', post.tags],
    ['reading_time_minutes', post.readingTime],
    ['estimated_tokens', estimateTokens(payload)],
  ]);

  return `${fm}\n\n${payload}\n`;
}

/** 读书笔记 → 完整 Markdown 文档 */
export function buildNoteMarkdown(note: NoteDoc): string {
  const canonical = absoluteUrl(`/books/${note.id}`);
  const body = ensureH1(cleanBodyForAgents(note.content), note.title);
  const jsonLd = buildNoteJsonLd(note);
  const description = `《${note.bookName ?? ''}》${note.author ?? ''}的读书笔记`;

  const footer = `---\n\n> 本文由 WileyZhang 原创，首发于 [Wiley Blog](${canonical})。`;
  const jsonBlock = '```json\n' + JSON.stringify(jsonLd, null, 2) + '\n```';
  const payload = `${body}\n\n${footer}\n\n${jsonBlock}`;

  const fm = frontmatter([
    ['title', note.title],
    ['description', description],
    ['image', note.cover ? absoluteUrl(`/posts/${note.cover}`) : undefined],
    ['url', canonical],
    ['date', fmtDate(note.date)],
    ['updated', fmtDate(note.updateDate)],
    ['type', 'book-note'],
    ['book', note.bookName],
    ['author', note.author],
    ['status', note.status],
    ['douban_url', note.bookUrl || undefined],
    ['tags', note.tags],
    ['reading_time_minutes', note.readingTime],
    ['estimated_tokens', estimateTokens(payload)],
  ]);

  return `${fm}\n\n${payload}\n`;
}
