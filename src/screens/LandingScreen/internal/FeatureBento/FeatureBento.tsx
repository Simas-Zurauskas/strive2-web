'use client';

import * as S from './FeatureBento.styles';
import { FeatureTile } from './FeatureTile';
import { BENTO_TILES } from '../../constants';

export const FeatureBento = () => (
  <S.Wrap>
    <S.Inner>
      <S.SectionHeader>
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
