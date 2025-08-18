import films from '@/data/films.json';

export async function generateMetadata(props: { params: any }) {
  const params = await props.params
  return {
    title: `观影 | Wiley`
  }
}


export default async function FilmPage(props: { params: any }) {
  return (
    <div className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16'>
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
