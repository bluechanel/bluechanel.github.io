import douban from "@/data/douban.json";
import { Info } from "lucide-react";

export async function generateMetadata(props: { params: any }) {
  const params = await props.params;
  return {
    title: `观影 | Wiley`,
    description: "观影，展示我的生活瞬间，记录我的生活。",
  };
}

export default async function FilmPage(props: { params: any }) {
  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
      <div className="flex items-center gap-3 max-w-md">
        <div className="flex items-center justify-center w-8 h-8 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-950 rounded-full border border-gray-50 dark:border-gray-950">
          <Info />
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-200">
          已看{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {douban.films.watchedCount}
          </span>{" "}
          部剧
          <a
            href={douban.films.collectUrl}
            target="_blank"
            className="ml-1 text-blue-500 hover:underline"
          >
            (@ 豆瓣)
          </a>
        </p>
      </div>
    </div>
  );
}
