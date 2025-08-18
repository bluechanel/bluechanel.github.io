import "./globals.css";
import type { Metadata } from 'next'
import type { FC, ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    absolute: '',
    template: ''
  },
  icons: {
    icon: '/favicon.png',
  },
}

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning >
      <body className='flex-1 w-full max-w-6xl mx-auto px-4 lg:px-8 min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950'>
        <ThemeProvider>
          <Navbar />
          <main className='flex-1'>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout;
