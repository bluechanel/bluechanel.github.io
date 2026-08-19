/**
 * Notion 内容格式的渲染注册表
 *
 * 同步脚本 (scripts/sync-notion.mjs) 会把 Notion 导出的 HTML 工件转换成 Markdoc 标签，
 * 渲染层通过 mark 标签读取后映射到统一色板：
 *
 *   - 彩色文字  <span color="red">     → {% mark color="red" %}
 *   - 高亮背景  <span color="red_bg">  → {% mark bg="red" %}
 *   - 下划线    <span underline="true">→ {% mark underline="true" %}
 *
 * 想调整颜色/样式，只需改下面这两个色板，无需改动同步脚本和组件。
 */

/** Notion 官方文字颜色 */
export const NOTION_TEXT_COLORS: Record<string, string> = {
  default: '#37352F',
  gray: '#9B9A97',
  brown: '#64473A',
  orange: '#D9730D',
  yellow: '#DFAB01',
  green: '#0F7B6C',
  blue: '#0B6E99',
  purple: '#6940A5',
  pink: '#AD1A72',
  red: '#E03E3E',
};

/** 背景色使用半透明色值，浅色/深色主题下都清晰可读 */
export const NOTION_BG_COLORS: Record<string, string> = {
  default: 'rgba(55, 53, 47, 0.15)',
  gray: 'rgba(155, 154, 151, 0.18)',
  brown: 'rgba(100, 71, 58, 0.18)',
  orange: 'rgba(217, 115, 13, 0.18)',
  yellow: 'rgba(223, 171, 1, 0.18)',
  green: 'rgba(15, 123, 108, 0.18)',
  blue: 'rgba(11, 110, 153, 0.18)',
  purple: 'rgba(105, 64, 165, 0.18)',
  pink: 'rgba(173, 26, 114, 0.18)',
  red: 'rgba(224, 62, 62, 0.18)',
};

/** 去掉 Notion 的背景后缀（red_bg / red_background → red） */
function stripBgSuffix(name: string): string {
  return name.replace(/_(bg|background)$/, '');
}

/** 解析 Notion 文字颜色 → CSS 色值 */
export function notionTextColor(name?: string): string | undefined {
  if (!name) return undefined;
  return NOTION_TEXT_COLORS[stripBgSuffix(name)];
}

/** 解析 Notion 背景颜色 → CSS 色值 */
export function notionBgColor(name?: string): string | undefined {
  if (!name) return undefined;
  return NOTION_BG_COLORS[stripBgSuffix(name)];
}
