import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as S from '../styles';

export const SectionBlock = ({ content, first }: { content: string; first?: boolean }) => (
  <S.SectionContent $first={first}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </S.SectionContent>
);
