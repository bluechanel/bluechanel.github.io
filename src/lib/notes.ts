import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { calculateReadingTime } from '@/lib/posts';

// notes 文件夹的路径（读书笔记，与博客 posts/ 分开存放）
const notesDirectory = path.join(process.cwd(), 'content', 'notes');

// 定义读书笔记元数据的接口
export interface NoteFrontMatter {
  title: string; // 笔记自己的标题（正文第一个 H1）
  bookName: string; // 书名（Notion "Book Name"）
  author: string;
  status: string; // 阅读状态：Finished / Reading / Want 等
  carrier: string; // 载体：PC / Kindle / 纸质等
  date: Date; // 阅读日期
  updateDate: Date;
  bookUrl: string; // 豆瓣 subject 链接
  cover: string;
  tags: string[];
}

export interface NoteMeta extends NoteFrontMatter {
  id: string;
  readingTime: number;
}

// 私有辅助函数，用于解析单个 markdown 文件，提取元数据和内容
function parseNoteFile(fileName: string) {
  const id = fileName.replace(/\.md$/, '');
  const fullPath = path.join(notesDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);
  const data = matterResult.data as NoteFrontMatter;

  const readingTime = calculateReadingTime(matterResult.content);

  const metaData: NoteMeta = {
    id,
    ...data,
    readingTime,
  };

  return {
    metaData,
    content: matterResult.content,
  };
}

export function getSortedNotesData(): NoteMeta[] {
  // 目录不存在（还没有任何笔记）时直接返回空，避免 readdirSync 抛错
  if (!fs.existsSync(notesDirectory)) return [];

  const fileNames = fs.readdirSync(notesDirectory);
  const allNotesData = fileNames.map((fileName) => {
    const { metaData } = parseNoteFile(fileName);
    return metaData;
  });

  // 根据阅读日期降序排序
  return allNotesData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPaginatedNotesData(page: number, notesPerPage: number = 9) {
  const allNotes = getSortedNotesData();
  const totalNotes = allNotes.length;
  const totalPages = Math.ceil(totalNotes / notesPerPage);

  // 确保页码在有效范围内
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const startIndex = (page - 1) * notesPerPage;
  const paginatedNotes = allNotes.slice(startIndex, startIndex + notesPerPage);

  return {
    notes: paginatedNotes,
    totalPages,
    currentPage: page,
    totalNotes,
  };
}

export function getAllNoteIds() {
  if (!fs.existsSync(notesDirectory)) return [];

  const fileNames = fs.readdirSync(notesDirectory);
  return fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/\.md$/, ''),
    },
  }));
}

export async function getNoteData(id: string): Promise<NoteMeta & { content: string }> {
  const fileName = `${id}.md`;
  const { metaData, content } = parseNoteFile(fileName);

  return {
    ...metaData,
    content,
  };
}
