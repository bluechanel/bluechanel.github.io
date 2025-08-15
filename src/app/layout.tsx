import "./globals.css";
import type { Metadata } from 'next'
import type { FC, ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    absolute: '',
    template: '%s - Nextra'
  }
}

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning >
      <body style={{ margin: 0 }} className='min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950'>
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
