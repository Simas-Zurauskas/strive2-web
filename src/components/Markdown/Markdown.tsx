import ReactMarkdown, { type Options as ReactMarkdownOptions } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface MarkdownProps extends ReactMarkdownOptions {
  math?: boolean;
}

const GFM_ONLY: ReactMarkdownOptions['remarkPlugins'] = [remarkGfm];
const GFM_AND_MATH: ReactMarkdownOptions['remarkPlugins'] = [remarkGfm, remarkMath];
// `output: 'htmlAndMathml'` (KaTeX default) keeps the MathML branch for screen readers.
const KATEX: ReactMarkdownOptions['rehypePlugins'] = [
  [rehypeKatex, { throwOnError: false, strict: 'ignore' }],
];

export const Markdown = ({ math = false, children, remarkPlugins, rehypePlugins, ...rest }: MarkdownProps) => (
  <ReactMarkdown
    remarkPlugins={remarkPlugins ?? (math ? GFM_AND_MATH : GFM_ONLY)}
    rehypePlugins={rehypePlugins ?? (math ? KATEX : undefined)}
    {...rest}
  >
    {children}
  </ReactMarkdown>
);
