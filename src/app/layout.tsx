import "./globals.css";
import type { Metadata } from 'next'
import type { FC, ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: {
    absolute: '',
    template: '%s - Nextra'
  }
}

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning >
      <body style={{ margin: 0 }} className='bg-gray-100 dark:bg-gray-950'>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout;
