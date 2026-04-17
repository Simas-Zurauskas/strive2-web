import { Markdown } from '@/components';
import type { Options as ReactMarkdownOptions } from 'react-markdown';

// All AI-generated lesson markdown must flow through this wrapper so math
// (remark-math + rehype-katex) renders consistently across blocks.
export const LessonMarkdown = (props: ReactMarkdownOptions) => <Markdown math {...props} />;
