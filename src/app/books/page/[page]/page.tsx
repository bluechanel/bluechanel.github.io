import douban from "@/data/douban.json";
import { getPaginatedNotesData, getSortedNotesData } from "@/lib/notes";
import { NoteCard } from "@/components/notecard";
import { Pagination } from "@/components/pagination";
import { Info } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    return {
      title: `读书 | Wiley`,
      description: "读书笔记与最近在看的书",
    };
  }

  // 第 1 页的规范地址是 /books，这里复用相同标题避免重复
  if (pageNumber === 1) {
    return {
      title: `读书 | Wiley`,
      description: "读书笔记与最近在看的书",
    };
  }

  return {
    title: `读书 | 第${pageNumber}页 | Wiley`,
    description: `读书笔记第${pageNumber}页`,
  };
}

// 生成所有可能的页面路径（1..N；第 1 页与 /books 内容相同）
export async function generateStaticParams() {
  const allNotesData = getSortedNotesData();
  const NOTES_PER_PAGE = 9;
  const totalPages = Math.ceil(allNotesData.length / NOTES_PER_PAGE);

  const paths = [];
  // 第 1 页规范地址是 /books，这里 /books/page/1 渲染同样的第 1 页内容（分页组件不链接到它）。
  // 必须至少生成一个参数，否则 output:export 会报「missing generateStaticParams」
  for (let i = 1; i <= totalPages; i++) {
    paths.push({ page: i.toString() });
  }
  return paths;
}

export default async function BooksPage({ params }: PageProps) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);

  // 验证页码
  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const { notes: paginatedNotes, totalPages, currentPage } = getPaginatedNotesData(pageNumber, 9);

  // 页码超出范围返回 404
  if (pageNumber > totalPages) {
    notFound();
  }

  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 max-w-md">
          <div className="flex items-center justify-center w-8 h-8 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-950 rounded-full border border-gray-50 dark:border-gray-950">
            <Info />
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            已读{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {douban.books.readCount}
            </span>{" "}
            本书
            <a
              href={douban.books.collectUrl}
              target="_blank"
              className="ml-1 text-blue-500 hover:underline"
            >
              (@ 豆瓣)
            </a>
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            读书笔记
          </h2>
          {paginatedNotes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {paginatedNotes.map((note, index) => (
                <NoteCard key={note.id} note={note} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              暂无读书笔记
            </p>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/books"
          />
        </div>
      </div>
    </div>
  );
}
