import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// posts 文件夹的路径
const postsDirectory = path.join(process.cwd(), 'content');

export function getSortedPostsData() {
  // 获取 /posts 目录下的所有文件名
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // 移除 ".md" 后缀，作为文章 id
    const id = fileName.replace(/\.md$/, '');

    // 读取 markdown 文件内容
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 使用 gray-matter 解析元数据
    const matterResult = matter(fileContents);

    // 组合数据
    return {
      id,
      ...(matterResult.data as { date: Date; title: string; description: string; updateDate: Date; tags: string[]; cover: string }),
    };
  });

  // 根据日期降序排序
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // 返回一个包含 params 对象的数组
  // 格式必须是: [{ params: { id: '...' } }, ...]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // 解析元数据
  const matterResult = matter(fileContents);

  // 将 markdown 转换为 HTML
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content); 
  const contentHtml = processedContent.toString();

  // 组合数据
  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: Date; title: string; description: string; updateDate: Date; tags: string[]; cover: string }),
  };
}