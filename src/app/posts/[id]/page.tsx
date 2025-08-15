import { getPostData, getAllPostIds } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// 这个函数会在构建时生成所有可能的文章路径
export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map(path => ({ id: path.params.id }));
}

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  let postData;

  try {
    postData = await getPostData(id);
  } catch (error) {
    // 如果找不到文章，显示 404 页面
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <article>
          <header className="mb-8 border-b pb-4">
            <h1 className="text-4xl font-extrabold text-gray-900">{postData.title}</h1>
            <div className="text-gray-500 mt-2">{postData.date.toDateString()}</div>
          </header>
          
          {/* 使用 prose 类来美化 markdown 输出 */}
          <div
            className="prose lg:prose-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
        </article>

        <div className="mt-12 pt-6 border-t">
            <Link href="/" className="text-blue-600 hover:underline">
                ← 返回首页
            </Link>
        </div>
      </div>
    </main>
  );
}
