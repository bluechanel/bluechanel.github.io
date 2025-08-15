import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-50">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800">我的博客</h1>
          <p className="text-gray-500 mt-2">欢迎来到我的技术与生活分享空间</p>
        </header>

        <section>
          <h2 className="text-3xl font-semibold mb-6 border-b pb-2 text-gray-700">最新文章</h2>
          <ul className="space-y-4">
            {allPostsData.map(({ id, date, title }) => (
              <li key={id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Link href={`/posts/${id}`} className="text-2xl font-bold text-blue-600 hover:underline">
                  {title}
                </Link>
                <br />
                <small className="text-gray-500">{date.toDateString()}</small>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}