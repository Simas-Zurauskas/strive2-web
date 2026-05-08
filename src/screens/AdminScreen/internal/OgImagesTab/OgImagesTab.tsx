'use client';

import * as S from './OgImagesTab.styles';
import { NotifSingleVariant } from './variants/V52_NotifSingle';

/**
 * Open Graph image lab — V52 selected.
 *
 * Earlier iteration cycles produced ~57 candidate variants; the
 * "Notification — single hero" direction (V52) was the keeper. The
 * remaining variant folders have been pruned. To explore a new
 * direction in the future, drop a fresh folder under `variants/` and
 * import it here.
 */
export const OgImagesTab: React.FC = () => {
  return (
    <S.TabWrapper>
      <S.Intro>
        <S.IntroTitle>Open Graph image</S.IntroTitle>
        <S.IntroText>
          The 1200×630 OG canvas below is scaled to 50% for preview. The download button
          captures the unscaled node — output PNG is print-ready for social meta tags.
        </S.IntroText>
      </S.Intro>

      <NotifSingleVariant />
    </S.TabWrapper>
  );
};
