import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="w-full max-w-2xl">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800">我的博客</h1>
        <p className="text-gray-500 mt-2">欢迎来到我的技术与生活分享空间</p>
      </header>
    </div>
  );
}