import { SkeletonBlock } from '@/screens/HomeScreen/internal/_skeleton/skeleton.styles';
import * as S from '../ModuleQuizScreen.styles';

interface QuizLoadingShellProps {
  onBack: () => void;
  backLabel: string;
}

/**
 * Skeleton shown while the course is hydrating or quiz content is fetching.
 * Mirrors the lean Landing layout (eyebrow → title → description → meta
 * line → CTA) so the moment data lands the layout doesn't shift. The
 * back link stays interactive in case the load is slow.
 */
export const QuizLoadingShell = ({ onBack, backLabel }: QuizLoadingShellProps) => (
  <S.Container>
    <S.Content>
      <S.TopRail>
        <S.BackLink onClick={onBack}>
          <S.BackIcon />
          {backLabel}
        </S.BackLink>
      </S.TopRail>

      <S.HeaderSection>
        <SkeletonBlock $h="0.75rem" $w="9rem" />
        <SkeletonBlock $h="2.25rem" $w="80%" />
      </S.HeaderSection>

      <SkeletonBlock $h="0.875rem" $w="60%" />

      <SkeletonBlock $h="2.625rem" $w="9.5rem" $radius="var(--radius-md)" />
    </S.Content>
  </S.Container>
);
