export const dynamic = 'force-static';
import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wiley Blog | AI/LLM developer blog',
    short_name: 'Wiley Blog',
    description: 'wiley blog - AI/LLM developer blog Prompt, FastChat, Vllm, Docker, Langchain, Langgraph, Airflow, RAG, Notion',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    categories: ['AI', 'Blog'],
    lang: "zh",
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}