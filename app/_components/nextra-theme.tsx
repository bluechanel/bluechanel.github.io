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
      <div className='flex'>
        <Sidebar pageMap={pageMap} />
        {children}
      </div>
      <Footer />
    </>
  )
}
