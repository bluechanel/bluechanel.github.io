import books from "@/data/books.json";
import douban from "@/data/douban.json";
import { Info } from "lucide-react";
import { FadeIn } from "@/components/motion";

export async function generateMetadata(props: { params: any }) {
  const params = await props.params;
  return {
    title: `读书 | Wiley`,
    description: "最近在看的书",
  };
}

export default async function BookPage(props: { params: any }) {
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
        <h2 className="text-xl font-bold py-2 text-black dark:text-white">
          📖 在读
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.reading.map((book, index) => (
            <FadeIn key={book.link} delay={index * 0.06}>
              <div className="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                <a href={book.link} target="_blank" rel="noopener noreferrer">
                  <h2 className="text-lg font-bold hover:underline mb-2 text-black dark:text-white">
                    {book.name}
                  </h2>
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  👤 作者：{book.author}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  📅 开始日期：
                  {new Date(book.date).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  💻 阅读方式：{book.carrier}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={`${book.name}-${tag}`}
                      className="inline-block text-xs px-2 py-1 rounded-full  dark:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <h2 className="text-xl font-bold py-2 text-black dark:text-white">
          📚 想读
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.toRead.map((book, index) => (
            <FadeIn key={`toread-${index}`} delay={index * 0.06}>
              <div className="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                <a href={book.link} target="_blank" rel="noopener noreferrer">
                  <h2 className="text-lg font-bold hover:underline mb-2 text-black dark:text-white">
                    {book.name}
                  </h2>
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  👤 作者：{book.author}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  📅 开始日期：
                  {new Date(book.date).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  💻 阅读方式：{book.carrier}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={`${book.name}-${tag}`}
                      className="inline-block text-xs px-2 py-1 rounded-full  dark:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <h2 className="text-xl font-bold py-2 text-black dark:text-white">
          ✅ 已读
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.Finished.map((book, index) => (
            <FadeIn key={`finished-${index}`} delay={index * 0.06}>
              <div className="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                <a href={book.link} target="_blank" rel="noopener noreferrer">
                  <h2 className="text-lg font-bold hover:underline mb-2 text-black dark:text-white">
                    {book.name}
                  </h2>
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  👤 作者：{book.author}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  📅 开始日期：
                  {new Date(book.date).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  💻 阅读方式：{book.carrier}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={`${book.name}-${tag}`}
                      className="inline-block text-xs px-2 py-1 rounded-full  dark:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
