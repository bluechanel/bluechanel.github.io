import type { Metadata } from 'next'
import { Head } from 'nextra/components'
import "./globals.css";
import { getPageMap } from 'nextra/page-map'
import type { FC, ReactNode } from 'react'
import { NextraTheme } from './_components/nextra-theme'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: {
    absolute: '',
    template: '%s - Nextra'
  }
}

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning >
      <Head faviconGlyph="✦" />
      <body style={{ margin: 0 }} className='bg-gray-100 dark:bg-gray-950'>
        <ThemeProvider>
          <NextraTheme pageMap={pageMap}>{children}</NextraTheme>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout;
