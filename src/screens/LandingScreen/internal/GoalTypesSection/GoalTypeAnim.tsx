'use client';

import * as A from './GoalTypeAnim.styles';
import type { GoalTypeKey } from '../../constants';

// Each card is a single sustained loop — no draw-in-and-vanish. Phase
// offsets and coprime cycle lengths keep the row visually de-synced.

const Master = () => (
  <A.Chip aria-hidden>
    <A.TreeStage>
      <A.TreeRow $w={92} $indent={0} />
      <A.TreeRow $w={62} $indent={14} />
      <A.TreeRow $w={80} $indent={6} />
      <A.TreeRow $w={50} $indent={20} />
      <A.Focus />
    </A.TreeStage>
  </A.Chip>
);

const Monetize = () => (
  <A.Chip aria-hidden>
    <A.BarsStage>
      <A.Bar $h={11} $delay={0} />
      <A.Bar $h={16} $delay={180} />
      <A.Bar $h={13} $delay={360} />
      <A.Bar $h={20} $delay={540} />
      <A.Bar $h={15} $delay={720} />
      <A.TargetLine />
    </A.BarsStage>
  </A.Chip>
);

const Pass = () => (
  <A.Chip aria-hidden>
    <A.Checklist>
      <A.QuizRow>
        <A.Bullet>
          <A.Tick $delay={0} />
        </A.Bullet>
        <A.RowLine $w={15} />
      </A.QuizRow>
      <A.QuizRow>
        <A.Bullet>
          <A.Tick $delay={1200} />
        </A.Bullet>
        <A.RowLine $w={13} />
      </A.QuizRow>
      <A.QuizRow>
        <A.Bullet>
          <A.Tick $delay={2400} />
        </A.Bullet>
        <A.RowLine $w={16} />
      </A.QuizRow>
    </A.Checklist>
  </A.Chip>
);

const Build = () => (
  <A.Chip aria-hidden>
    <A.BuildStage>
      <A.Block $w={20} $delay={0} />
      <A.Block $w={14} $delay={1400} />
      <A.Block $w={17} $delay={2800} />
    </A.BuildStage>
  </A.Chip>
);

const Fluency = () => (
  <A.Chip aria-hidden>
    <A.ChatStage>
      <A.BubbleLeft />
      <A.BubbleRight />
    </A.ChatStage>
  </A.Chip>
);

const REGISTRY: Record<GoalTypeKey, () => React.ReactElement> = {
  master: Master,
  monetize: Monetize,
  pass: Pass,
  build: Build,
  fluency: Fluency,
};

export const GoalTypeAnim = ({ type }: { type: GoalTypeKey }) => {
  const Anim = REGISTRY[type];
  return <Anim />;
};
