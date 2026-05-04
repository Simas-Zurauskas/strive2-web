import { PageLayout } from '@/components';
import { SkeletonBlock } from '@/screens/HomeScreen/internal/_skeleton/skeleton.styles';
import * as S from '../RecallScreen.styles';

/**
 * Skeleton mirrors the active-session layout (compact title + queue
 * progress + recall card chrome). Holds the eventual shape so when the
 * queue resolves the layout doesn't shift.
 */
export const RecallLoadingShell = () => (
  <PageLayout>
    <S.ContentWrap>
      <S.PageHeader aria-hidden>
        <SkeletonBlock $h="0.75rem" $w="6rem" />
        <div style={{ height: '0.625rem' }} />
        <SkeletonBlock $h="2.5rem" $w="70%" />
        <div style={{ height: '0.875rem' }} />
        <SkeletonBlock $h="1rem" $w="55%" />
      </S.PageHeader>

      <S.CardArea>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <SkeletonBlock $h="0.6875rem" $w="6.5rem" />
            <SkeletonBlock $h="0.6875rem" $w="5rem" />
          </div>
          <SkeletonBlock $h="4px" $w="100%" $radius="var(--radius-pill)" />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.75rem',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--surface)',
            minHeight: '15rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <SkeletonBlock $h="1.25rem" $w="40%" $radius="var(--radius-pill)" />
            <SkeletonBlock $h="1.5rem" $w="6rem" $radius="var(--radius-pill)" />
          </div>
          <SkeletonBlock $h="1.5rem" $w="100%" />
          <SkeletonBlock $h="1.5rem" $w="80%" />
          <SkeletonBlock $h="2.75rem" $w="100%" $radius="var(--radius-lg)" />
        </div>
      </S.CardArea>
    </S.ContentWrap>
  </PageLayout>
);
