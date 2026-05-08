'use client';

import * as S from './index.styles';
import { OgCanvas } from '../../OgCanvas';

export const NotifSingleVariant: React.FC = () => (
  <OgCanvas id="og-notif-single" label="Notification — single hero">
    <S.Stage>
      {/* Subtle grain overlay */}
      <S.Grain />

      {/* Identity — top-left */}
      <S.Wordmark>Strive</S.Wordmark>
      <S.Eyebrow>One course, made for one</S.Eyebrow>

      {/* Hero notification — single, centered, oversized */}
      <S.HeroToast>
        <S.HeroIcon>
          <S.HeroIconLetter>S</S.HeroIconLetter>
        </S.HeroIcon>
        <S.HeroBody>
          <S.HeroTitle>Your course is ready.</S.HeroTitle>
          <S.HeroSub>5 modules &middot; 22 lessons &middot; built for you in 47 seconds.</S.HeroSub>
          <S.HeroActions>
            <S.ChipPrimary>Open course</S.ChipPrimary>
            <S.ChipGhost>Later</S.ChipGhost>
          </S.HeroActions>
        </S.HeroBody>
      </S.HeroToast>

      {/* Tagline — bottom-right */}
      <S.Tagline>Yours, by design.</S.Tagline>
    </S.Stage>
  </OgCanvas>
);
