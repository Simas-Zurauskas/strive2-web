import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as S from '../styles';

export const IntroBlock = ({ content }: { content: string }) => (
  <S.IntroText>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </S.IntroText>
);
