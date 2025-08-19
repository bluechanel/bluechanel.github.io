import films from '@/data/films.json';
import { Info } from 'lucide-react'

export async function generateMetadata(props: { params: any }) {
  const params = await props.params
  return {
    title: `观影 | Wiley`
  }
}


export default async function FilmPage(props: { params: any }) {
  return (
    <div className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16'>
      <div className="flex items-center gap-3 max-w-md">
        <div className="flex items-center justify-center w-8 h-8 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-950 rounded-full border border-gray-50 dark:border-gray-950">
            <Info />
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-200">
            已看 <span className="font-semibold text-blue-600 dark:text-blue-400">507</span> 部剧
            <a href="https://movie.douban.com/people/155507928/collect" target="_blank" className="ml-1 text-blue-500 hover:underline">(@ 豆瓣)</a>
        </p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-2'>
        {films.read.map((film) => (
          <div key={film.name} className='p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1'>
              <a href={film.describe} target="_blank" rel="noopener noreferrer">
                  <h2 className="text-lg font-bold text-black dark:text-white hover:underline mb-3 truncate">{film.name}</h2>
              </a>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  📅 <span className="font-medium">开始日期：</span>{new Date(film.date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
              </p>

              <div className="flex flex-wrap gap-2">
                  {film.tags.map((tag) => (
                      <span key={`${film.name}-${tag}`} className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {tag}
                      </span>
                  ))}
              </div>
          </div>
        ))}
      </div>
    </div>
  )
}
