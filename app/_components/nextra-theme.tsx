import type { PageMapItem } from 'nextra'
import type { FC, ReactNode } from 'react'
import { Footer } from './footer'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'

export const NextraTheme: FC<{
  children: ReactNode
  pageMap: PageMapItem[]
}> = ({ children, pageMap }) => {
  return (
    <>
      <Navbar pageMap={pageMap} />
      <div className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16'>
        {/* <Sidebar pageMap={pageMap} /> */}
        {children}
      </div>
      <Footer className="w-full h-24 bg-gray-100 dark:bg-gray-950 px-4"/>
    </>
  )
}
