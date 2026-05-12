import { PageLayout } from '@/components';
import { SkeletonBlock } from '@/screens/HomeScreen/internal/_skeleton/skeleton.styles';
import * as S from '../RecallScreen.styles';

/**
 * Skeleton mirrors the active-session layout — session strip on top,
 * breadcrumb, big card with prompt and reveal-row placeholders. Holds
 * the eventual shape so layout doesn't shift when the queue resolves.
 */
export const RecallLoadingShell = () => (
  <PageLayout>
    <S.ActiveWrap aria-hidden>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <SkeletonBlock $h="0.875rem" $w="9rem" />
          <SkeletonBlock $h="0.75rem" $w="6rem" />
        </div>
        <SkeletonBlock $h="6px" $w="100%" $radius="var(--radius-pill)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <SkeletonBlock $h="0.75rem" $w="14rem" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            padding: '2rem',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--surface)',
            minHeight: '18rem',
          }}
        >
          <SkeletonBlock $h="1.625rem" $w="92%" />
          <SkeletonBlock $h="1.625rem" $w="70%" />
          <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.25rem' }}>
            <SkeletonBlock $h="52px" $w="100%" $radius="var(--radius-lg)" />
            <SkeletonBlock $h="52px" $w="5rem" $radius="var(--radius-lg)" />
          </div>
        </div>
      </div>
    </S.ActiveWrap>
  </PageLayout>
);
