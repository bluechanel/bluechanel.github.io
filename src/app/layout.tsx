import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import type { FC, ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";


export const metadata: Metadata = {
  metadataBase: new URL('https://wileyzhang.com'),
  icons: {
    icon: '/favicon.png',
  },
  title: {
    template: '%s | Wiley Blog',
    default: 'Wiley Blog | AI/LLM developer blog'
  },
  description: '一个专注于人工智能、大型语言模型开发和前沿技术见解的技术博客。分享在人工智能和大型语言模型方面的实践经验和深入分析。涉及的技术栈包括，LangGraph，RAG，Agent，MCP，Python，NextJS，LLM等',
  keywords: ['AI', 'LLM', 'Machine Learning', 'Artificial Intelligence', 'Developer Blog', 'Technical Writing', 'Programming'],
  authors: [{ name: 'Wiley Zhang' }],
  creator: 'Wiley Zhang',
  publisher: 'Wiley Zhang',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://wileyzhang.com',
    title: 'Wiley Blog | AI/LLM developer blog',
    description: '一个专注于人工智能、大型语言模型开发和前沿技术见解的技术博客。分享在人工智能和大型语言模型方面的实践经验和深入分析。涉及的技术栈包括，LangGraph，RAG，Agent，MCP，Python，NextJS，LLM等',
    siteName: 'Wiley Blog',
    images: [
      {
        url: 'https://wileyzhang.com/cover.png',
        width: 1200,
        height: 630,
        alt: 'Wiley Blog | AI/LLM developer blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wiley Blog | AI/LLM developer blog',
    description: '一个专注于人工智能、大型语言模型开发和前沿技术见解的技术博客。分享在人工智能和大型语言模型方面的实践经验和深入分析。涉及的技术栈包括，LangGraph，RAG，Agent，MCP，Python，NextJS，LLM等',
    creator: '@wileyzhang',
  },
  alternates: {
    canonical: 'https://wileyzhang.com',
  },
  verification: {
    google: 'm9WkslZ46bN3h4BjbYDbDkPOTvaTuDgVtZnUez_AXPc',
  },
};


const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning >
      <GoogleAnalytics gaId="G-9QC19VEKH0" />
      <body className='flex-1 w-full max-w-6xl mx-auto px-4 lg:px-8 min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950'>
        <ThemeProvider>
          <Navbar />
          <main className='flex-1'>{children}</main>
          <Footer className="mt-10"/>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout;
