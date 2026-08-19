import Image from 'next/image';
import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import PhotoGalleryWithLightbox from '@/components/gallary';
import photos from '@/data/gallay.json';
import { Photo } from "@/types/photo";
import { FadeIn } from '@/components/motion';
const liveImages: Photo[] = photos.slice(0, 3);

export default function Home() {
  const allPostsData = getSortedPostsData().slice(0, 3);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <FadeIn>
        <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
          <Image src="/avatar.png" alt="头像" width={128} height={128} />
          <div>
            <h2 className="text-2xl font-bold mb-3">Hi，我是 Wiley 👋</h2>
            <p className="mb-4">一名热爱技术与创作的开发者，专注 AI 应用开发与知识管理。喜欢写作、电影和一切有趣的事物。</p>
            <Link href="/about" className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">了解更多</Link>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-row items-center justify-between mt-6">
            <h2 className="text-xl font-bold mb-6">最新文章</h2>
            <Link href="/posts" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">查看更多</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {allPostsData.map((post, index) => (
              <FadeIn key={post.id} delay={0.15 + index * 0.06}>
                <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
                  <div className="relative h-48 w-full">
                    {post.cover ? (
                      <Image src={`/posts/${post.cover}`} alt="封面图片" fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500" />
                    )}
                  </div>
                  <div className="p-4">
                    <Link href={`/posts/${post.id}`} className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2">{post.title}</Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.2}>
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-row items-center justify-between mt-6">
            <h2 className="text-xl font-bold mb-6">生活瞬间</h2>
            <Link href="/gallary" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">查看更多</Link>
          </div>
          <PhotoGalleryWithLightbox photos={liveImages} />
        </section>
      </FadeIn>
    </div>
  );
}
