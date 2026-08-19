import douban from "@/data/douban.json";
import { getPaginatedNotesData } from "@/lib/notes";
import { NoteCard } from "@/components/notecard";
import { Pagination } from "@/components/pagination";
import { Info } from "lucide-react";

export async function generateMetadata(props: { params: any }) {
  const params = await props.params;
  return {
    title: `读书 | Wiley`,
    description: "读书笔记与最近在看的书",
  };
}

export default async function BookPage(props: { params: any }) {
  const {
    notes: paginatedNotes,
    totalPages,
    currentPage,
  } = getPaginatedNotesData(1, 12);
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
