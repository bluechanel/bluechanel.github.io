/**
 * 站点级常量与 URL 工具。
 * 域名此前硬编码散落在 sitemap / robots / llms.txt / layout / 两个详情页里，统一收敛到这里。
 */
export const SITE_URL = 'https://wileyzhang.com';

/** 把站内路径拼成绝对 URL（Agent 消费的 Markdown 版本要求全绝对链接） */
export function absoluteUrl(p: string): string {
  return `${SITE_URL}${p.startsWith('/') ? '' : '/'}${p}`;
}
