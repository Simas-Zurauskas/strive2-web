'use client';

import { useMotion } from '@/theme/motionPresets';
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
          transition={fadeUp.transition}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        >
          <S.Eyebrow>Built for real learning</S.Eyebrow>
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
