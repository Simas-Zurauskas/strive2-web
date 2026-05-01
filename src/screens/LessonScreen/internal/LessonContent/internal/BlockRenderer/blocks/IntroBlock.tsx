import { LessonMarkdown } from '../LessonMarkdown';
import * as S from '../styles/section.styles';

export const IntroBlock = ({ content }: { content: string }) => (
  <S.IntroText>
    <LessonMarkdown>{content}</LessonMarkdown>
  </S.IntroText>
);
