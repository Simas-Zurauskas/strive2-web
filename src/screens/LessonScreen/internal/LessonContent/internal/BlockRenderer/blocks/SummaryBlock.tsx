import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as S from '../styles';

export const SummaryBlock = ({ content }: { content: string }) => {
  const items = content
    .split('\n')
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);

  return (
    <S.SummaryContainer>
      <S.SummaryHeader>
        <S.SummaryIcon>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M4.1 4.1l1.05 1.05M10.85 10.85l1.05 1.05M11.9 4.1l-1.05 1.05M5.15 10.85l-1.05 1.05" />
            <circle cx="8" cy="8" r="2.5" />
          </svg>
        </S.SummaryIcon>
        <S.SummaryTitle>Key Takeaways</S.SummaryTitle>
      </S.SummaryHeader>
      <S.SummaryList>
        {items.map((item, i) => (
          <S.SummaryItem key={i}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{item}</ReactMarkdown>
          </S.SummaryItem>
        ))}
      </S.SummaryList>
    </S.SummaryContainer>
  );
};
