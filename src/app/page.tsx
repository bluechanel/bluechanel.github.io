import Image from 'next/image';

export default function Home() {

  return (
          <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
            <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
              <Image src="/avatar.png" alt="头像" width={128} height={128} />
              <div>
                <h2 className="text-2xl font-bold mb-3">Hi，我是 Jon 👋</h2>
                <p className="mb-4">一名热爱技术与创作的开发者，专注 AI 应用开发与知识管理。喜欢写作、电影和一切有趣的事物。</p>
                <a href="/about" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">查看更多</a>
              </div>
            </section>


            <section className="container mx-auto px-4 py-8">
              <h2 className="text-xl font-bold mb-6">最新文章</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <article className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
                  <h3 className="text-lg font-semibold mb-2">文章标题 1</h3>
                  <p className="text-sm text-gray-500 mb-3">2025-08-12</p>
                  <p className="mb-4">这里是一段文章摘要，让读者快速了解内容……</p>
                  <a href="/posts/post-1" className="text-blue-500 hover:underline">阅读全文 →</a>
                </article>

              </div>
              <div className="mt-6">
                <a href="/posts" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">查看更多文章</a>
              </div>
            </section>


            <section className="container mx-auto px-4 py-8">
              <h2 className="text-xl font-bold mb-6">生活瞬间</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <img src="/life/photo1.jpg" alt="生活照片1" className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">周末在公园散步时，看到的晚霞 🌇</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <img src="/life/photo2.jpg" alt="生活照片2" className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">最近做的咖啡 ☕，味道不错</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <img src="/life/photo3.jpg" alt="生活照片3" className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">深夜写代码的样子 💻</p>
                  </div>
                </div>

              </div>
            </section>

          </div>

  );
}