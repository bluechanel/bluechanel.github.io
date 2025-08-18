import Image from 'next/image';
import { getSortedPostsData } from '@/lib/posts';

const liveImages = [
  {
    href: "https://i.postimg.cc/BvsWQXp6/Untitled.jpg",
    desc: "🐼遥望远方的熊猫"
  },
  {
    href: "https://i.postimg.cc/MHvMLr1Z/6-A02-A11-B-DACC-4542-9-BC2-7-A165-D8-DAA2-E.jpg",
    desc: "💮平安桥天主教堂的玉兰花"
  },
  {
    href: "https://i.postimg.cc/6qg2xLhr/Untitled2.jpg",
    desc: "🏔昆仑山脉的冰川"
  },
]

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
        <Image src="/avatar.png" alt="头像" width={128} height={128} />
        <div>
          <h2 className="text-2xl font-bold mb-3">Hi，我是 Wiley 👋</h2>
          <p className="mb-4">一名热爱技术与创作的开发者，专注 AI 应用开发与知识管理。喜欢写作、电影和一切有趣的事物。</p>
          <a href="https://about.wileyzhang.com/" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">查看更多</a>
        </div>
      </section>


      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-row items-center justify-between mt-6">
          <h2 className="text-xl font-bold mb-6">最新文章</h2>
          <a href="/posts" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">查看更多文章</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {allPostsData.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
              <div className="relative h-48 w-full">
                <Image src={`/posts/${post.cover}`} alt="封面图片" fill className="object-cover" />
              </div>
              <div className="p-4">
                <a href={`/posts/${post.id}`} className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2">{post.title}</a>
              </div>
            </article>
          ))}
        </div>

      </section>


      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6">生活瞬间</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {liveImages.map((image, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className='relative w-full h-48'>
                <Image src={image.href} alt="生活照片" fill sizes="100vw" className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{image.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>

  );
}