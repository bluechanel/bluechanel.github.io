export const dynamic = 'force-static';
import { getSortedPostsData } from "@/lib/posts";


export async function GET() {
      // 您的网站的根 URL
  const baseUrl = 'https://wileyzhang.com';

  // 获取所有博客文章
  const posts = await getSortedPostsData();

  // 为每篇文章创建一个 sitemap 条目
  const postInfo = posts.map(post => ({
    postName: post.title,
    url: `${baseUrl}/posts/${post.id}`,
    description: post.description,
  }));
  let llms = `# Wiley Blog | AI/LLM developer blog 
## 介绍(Introduction) \n
一个专注于人工智能、大型语言模型开发和前沿技术见解的技术博客。分享在人工智能和大型语言模型方面的实践经验和深入分析。涉及的技术栈包括，LangGraph，RAG，Agent，MCP，Python，NextJS，LLM等 \n
## 文章(Posts) \n
  `
  postInfo.forEach(post => {
    llms += `
- [${post.postName}](${post.url}): ${post.description} \n
    `
  })
  return new Response(llms);
}