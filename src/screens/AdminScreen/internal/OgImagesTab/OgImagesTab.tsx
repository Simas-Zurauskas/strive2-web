'use client';

import * as S from './OgImagesTab.styles';
import { UnderlineVariant } from './variants/V87_Underline';

/**
 * Open Graph image lab — V87 selected ("The Stroke, green").
 *
 * The keeper of the 2026-08-01 cycle: letterpress double rules and a
 * cream masthead wordmark over the lit deep-green plate, the line
 * "A real course on anything you want to learn." with "anything" in
 * gold italic under a drawn gold stroke. Every other candidate from
 * rounds two through six (V52–V92) has been pruned — see
 * `wiki-strive/notes/WORKING/011-landing/PROGRESS.md` for the round
 * history and what was rejected (landing motifs, app-UI mocks,
 * pure-type minimal, low-brand graphical).
 *
 * To explore a new direction, drop a fresh folder under `variants/` and
 * import it here. Shared OG-fixed tones live in `variants/ogTones.ts`.
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

      <UnderlineVariant />
    </S.TabWrapper>
  );
};
