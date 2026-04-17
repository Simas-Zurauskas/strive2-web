import { LessonMarkdown } from '../LessonMarkdown';
import * as S from '../styles';

export const SectionBlock = ({ content, first }: { content: string; first?: boolean }) => (
  <S.SectionContent $first={first}>
    <LessonMarkdown>{content}</LessonMarkdown>
  </S.SectionContent>
);
