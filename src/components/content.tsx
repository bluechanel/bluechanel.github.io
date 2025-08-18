import Markdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import { codeToHtml } from 'shiki'


interface Props {
  children: string
  lang: string
}

async function CodeBlock(props: Props) {
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    theme: 'github-dark'
  })

  return <div className="text-base" dangerouslySetInnerHTML={{ __html: out }} />
}

const CustomTable: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = (props) => {
  return (
    <div className="overflow-x-auto">
      <table {...props} className="min-w-full" />
    </div>
  );
};


const CustomCodeComponent: Components['code'] = ({ className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const inline = !className || !match;
  // 如果是行内代码
  if (inline) {
    return (
      <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-gray-200 rounded px-1 py-0.5 font-normal" {...props}>
        {children}
      </code>
    );
  }

  // 如果是带语言标识的代码块
  if (match) {
    return (
      <CodeBlock lang={match[1]}>
        {[
          children
        ].join('\n')}
      </CodeBlock>
    );
  }
  
  // 如果是没有语言标识的代码块
  return (
    <div className="rounded-lg overflow-hidden">
        <pre {...props as React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>} className="bg-gray-900 text-black dark:text-white p-4 rounded-lg">
            <code>{children}</code>
        </pre>
    </div>
  );
};

export function PostContent({ content} : {content: string}) {
    return (
        <div className="prose prose-base prose-gray dark:prose-invert max-w-none p-4 [&_pre]:bg-transparent [&_pre]:p-0">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeRaw,
                  rehypeSanitize,
                  rehypeSlug
                ]}
                components={{
                  table: CustomTable,
                  code: CustomCodeComponent,
                  a: ({ href }) => <a className="text-blue-500 underline underline-offset-4 decoration-blue-500" href={href}>{href}</a>
                }}
              >
                {content}
              </Markdown>
        </div>
    )
}
