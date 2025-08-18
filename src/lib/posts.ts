import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// posts 文件夹的路径
const postsDirectory = path.join(process.cwd(), 'content');

// 定义文章元数据的接口
interface PostFrontMatter {
  date: Date;
  title: string;
  description: string;
  updateDate: Date;
  tags: string[];
  cover: string;
}

// 计算阅读时间的函数
function calculateReadingTime(content: string): number {
  const chineseAndEnglishChars = content.match(/[\u4e00-\u9fa5]|\b\w+\b/g) || [];
  const count = chineseAndEnglishChars.length;
  const speed = 300; // 假设每分钟阅读 300 个字/词
  return Math.ceil(count / speed);
}

// 私有辅助函数，用于解析单个 markdown 文件，提取元数据和内容
function parsePostFile(fileName: string) {
  const id = fileName.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);
  const data = matterResult.data as PostFrontMatter;

  const readingTime = calculateReadingTime(matterResult.content);

  const metaData = {
    id,
    ...data,
    readingTime,
  };

  return {
    metaData,
    content: matterResult.content,
  };
}

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // 对于列表页，我们只需要元数据
    const { metaData } = parsePostFile(fileName);
    return metaData;
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
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id: string) {
  const fileName = `${id}.md`;
  const { metaData, content } = parsePostFile(fileName);

  // 组合元数据和 HTML 内容
  return {
    ...metaData,
    content
  };
}
