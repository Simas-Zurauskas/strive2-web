'use client';

import { useMotion } from '@/theme/motionPresets';
import * as S from './FeatureBento.styles';
import type { BentoVisual } from '../../constants';
import type { ReactNode } from 'react';

// Curriculum example targets the largest USER_BASE segment by share —
// Marketing & Sales (Monetiser persona, ~10.8% per wiki/working/USER_BASE.md).
// Same visual structure as before (3 modules, 5 lesson lines, last
// collapsed) so the tile dimensions don't shift.
const WIZARD_TREE: ReactNode = (
  <>
    <S.InputsLabel>Inputs</S.InputsLabel>
    <S.InputChips>
      <S.InputChip>
        <S.ChipDot />
        Beginner
      </S.InputChip>
      <S.InputChip>
        <S.ChipDot />
        1 hr / day
      </S.InputChip>
      <S.InputChip>
        <S.ChipDot />
        Practical, not theoretical
      </S.InputChip>
    </S.InputChips>
    <S.FlowConnector>becomes</S.FlowConnector>
    <S.TreeWrap>
      <S.TreeModule $expanded>Module 1 — Audience &amp; creative</S.TreeModule>
      <S.TreeLesson>Hooking the right scroller</S.TreeLesson>
      <S.TreeLesson>Lifestyle shots vs studio shots</S.TreeLesson>
      <S.TreeLesson>Writing a 6-second hook</S.TreeLesson>
      <S.TreeModule $expanded>Module 2 — Targeting &amp; budget</S.TreeModule>
      <S.TreeLesson>Lookalikes vs interest stacks</S.TreeLesson>
      <S.TreeLesson>Daily budget basics</S.TreeLesson>
      <S.TreeModule>Module 3 — Scaling what works</S.TreeModule>
    </S.TreeWrap>
  </>
);

const STREAMING_BLOCKS: ReactNode = (
  <S.StreamCard>
    <S.StreamEyebrow>Section 2 — Key idea</S.StreamEyebrow>
    <S.StreamHeading>Why caching the query matters</S.StreamHeading>
    <S.StreamProse>
      Re-fetching on every render bills you twice and ships stale data
      <S.StreamCaret />
    </S.StreamProse>
  </S.StreamCard>
);

const CODE_SNIPPET: ReactNode = (
  <S.CodeCard>
    <S.CodeLine>
      <S.CodeTok $kind="kw">function</S.CodeTok>
      <S.CodeTok $kind="plain"> </S.CodeTok>
      <S.CodeTok $kind="fn">greet</S.CodeTok>
      <S.CodeTok $kind="plain">(name: </S.CodeTok>
      <S.CodeTok $kind="kw">string</S.CodeTok>
      <S.CodeTok $kind="plain">) {'{'}</S.CodeTok>
    </S.CodeLine>
    <S.CodeLine>
      <S.CodeTok $kind="plain">{'  '}</S.CodeTok>
      <S.CodeTok $kind="kw">return</S.CodeTok>
      <S.CodeTok $kind="plain"> </S.CodeTok>
      <S.CodeTok $kind="str">{'`Hello, ${name}`'}</S.CodeTok>
      <S.CodeTok $kind="plain">;</S.CodeTok>
    </S.CodeLine>
    <S.CodeLine>
      <S.CodeTok $kind="plain">{'}'}</S.CodeTok>
    </S.CodeLine>
  </S.CodeCard>
);

const MATH_VISUAL: ReactNode = (
  <S.MathCard>
    <S.MathLabel>Quadratic roots</S.MathLabel>
    <span>
      x = (−b ± √(b<S.Sup>2</S.Sup> − 4ac)) ⁄ 2a
    </span>
  </S.MathCard>
);

// 12 bars, hand-tuned heights so it reads as a real waveform, not random.
const WAVE_HEIGHTS = [22, 38, 60, 88, 72, 95, 70, 50, 78, 55, 32, 18];

const NARRATION_VISUAL: ReactNode = (
  <S.NarrationCard>
    <S.VoiceAvatar aria-hidden="true">A</S.VoiceAvatar>
    <S.VoiceMeta>
      <S.VoiceName>Aurora</S.VoiceName>
      <S.VoiceLabel>1 of 6 voices</S.VoiceLabel>
    </S.VoiceMeta>
    <S.Waveform aria-hidden="true">
      {WAVE_HEIGHTS.map((h, i) => (
        <S.WaveBar key={i} $h={h} />
      ))}
    </S.Waveform>
  </S.NarrationCard>
);

const RECALL_VISUAL: ReactNode = (
  <S.RecallFront>
    <S.RecallEyebrow>Card 2 of 4 — Day 7</S.RecallEyebrow>
    <S.RecallQuestion>What does sin(2θ) imply about projectile range?</S.RecallQuestion>
    <S.RecallHint>Tap to reveal</S.RecallHint>
  </S.RecallFront>
);

const VISUAL: Record<BentoVisual, ReactNode> = {
  'wizard-tree': WIZARD_TREE,
  'streaming-blocks': STREAMING_BLOCKS,
  code: CODE_SNIPPET,
  math: MATH_VISUAL,
  narration: NARRATION_VISUAL,
  recall: RECALL_VISUAL,
};

interface FeatureTileProps {
  size: 'hero' | 'standard';
  title: string;
  body: string;
  visual: BentoVisual;
  index: number;
}

const renderTitle = (raw: string) => {
  const parts = raw.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
};

export const FeatureTile = ({ size, title, body, visual, index }: FeatureTileProps) => {
  const { prefersReduced } = useMotion();
  const isHero = size === 'hero';
  const TitleEl = isHero ? S.HeroTileTitle : S.TileTitle;
  // Cap stagger at 360ms total per spec — 6 tiles × 60ms = 360ms.
  const delay = prefersReduced ? 0 : Math.min(index * 0.06, 0.36);
  return (
    <S.Tile
      $hero={isHero}
      initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <TitleEl>{renderTitle(title)}</TitleEl>
      <S.TileBody>{body}</S.TileBody>
      <S.VisualSlot $hero={isHero}>{VISUAL[visual]}</S.VisualSlot>
    </S.Tile>
  );
};
