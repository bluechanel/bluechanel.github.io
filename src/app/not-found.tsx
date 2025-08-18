import Link from 'next/link'
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
 
export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-xl">
            <Image src="/404.svg" alt="404 Illustration" width={400} height={400} className="mb-8" />
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            抱歉，您访问的页面不存在。
            </p>
            <a href="/" 
              className="flex items-center justify-center px-6 py-3 rounded-lg text-black dark:text-white transition">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>返回首页</span>
            </a>
        </div>
    </section>
  )
}