'use client';

import { useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import * as S from './FeatureBento.styles';
import { FeatureTile } from './FeatureTile';
import { BENTO_TILES } from '../../constants';

export const FeatureBento = () => {
  const { fadeUp } = useMotion();
  return (
    <S.Wrap>
      <S.Inner>
        <S.SectionHeader
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
        viewport={VIEWPORT_ONCE}
          transition={fadeUp.transition}
        >
          <S.Eyebrow>Under the hood</S.Eyebrow>
          <S.Heading>Everything the loop needs. None of the homework feel.</S.Heading>
        </S.SectionHeader>

        <S.Grid>
          {BENTO_TILES.map((tile, i) => (
            <FeatureTile key={tile.title} {...tile} index={i} />
          ))}
        </S.Grid>
      </S.Inner>
    </S.Wrap>
  );
};
