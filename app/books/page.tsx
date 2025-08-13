import books from '../../data/books.json';

export async function generateMetadata(props: { params: any }) {
  const params = await props.params
  return {
    title: `Posts Tagged with`
  }
}


export default async function BookPage(props: { params: any }) {
  return (
    <div className='flex flex-col'>
        <h2 className="text-xl font-bold py-2 text-black dark:text-white">📖 在读</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {books.reading.map((book) => (
              <div key={book.link} className="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                  <a href={book.link} target="_blank" rel="noopener noreferrer">
                      <h2 className="text-lg font-bold hover:underline mb-2 text-black dark:text-white">{book.name}</h2>
                  </a>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">👤 作者：{book.author}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">📅 开始日期：{book.date}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">💻 阅读方式：{book.carrier}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                      {book.tags.map((tag) => (
                          <span key={`${book.name}-${tag}`} className="inline-block text-xs px-2 py-1 rounded-full  dark:text-white">
                              {tag}
                          </span>
                      ))}
                  </div>
              </div>
          ))}
      </div>
        <h2 className="text-xl font-bold py-2 text-black dark:text-white">📚 想读</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {books.toRead.map((book, index) => (
              <div key={`toread-${index}`} className="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                  <a href={book.link} target="_blank" rel="noopener noreferrer">
                      <h2 className="text-lg font-bold hover:underline mb-2 text-black dark:text-white">{book.name}</h2>
                  </a>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">👤 作者：{book.author}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">📅 开始日期：{book.date}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">💻 阅读方式：{book.carrier}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                      {book.tags.map((tag) => (
                          <span key={`${book.name}-${tag}`} className="inline-block text-xs px-2 py-1 rounded-full  dark:text-white">
                              {tag}
                          </span>
                      ))}
                  </div>
              </div>
          ))}
      </div>
        <h2 className="text-xl font-bold py-2 text-black dark:text-white">✅ 已读</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {books.Finished.map((book, index) => (
              <div key={`finished-${index}`} className="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                  <a href={book.link} target="_blank" rel="noopener noreferrer">
                      <h2 className="text-lg font-bold hover:underline mb-2 text-black dark:text-white">{book.name}</h2>
                  </a>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">👤 作者：{book.author}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">📅 开始日期：{book.date}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">💻 阅读方式：{book.carrier}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                      {book.tags.map((tag) => (
                          <span key={`${book.name}-${tag}`} className="inline-block text-xs px-2 py-1 rounded-full  dark:text-white">
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
