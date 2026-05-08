'use client';

import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './MentorChatAnimation.styles';

// Two scopes share the screen but only one is "active" at a time. The
// active panel is sharp, foregrounded, and shows a chat bubble typing
// in a scope-specific question. The inactive panel softens (lower
// opacity + slight blur) so the audience reads "this is the focused
// scope right now". Switching scopes triggers a quick crossfade rather
// than a hard cut.

const TICK_MS = 2400;

const LESSON_PROMPT = 'explain this differently';
const COURSE_PROMPT = 'what should I revisit?';

export const MentorChatAnimation = () => {
  const { prefersReduced } = useMotion();
  const [scope, setScope] = useState<'lesson' | 'course'>('lesson');

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(
      () => setScope((s) => (s === 'lesson' ? 'course' : 'lesson')),
      TICK_MS,
    );
    return () => clearInterval(id);
  }, [prefersReduced]);

  return (
    <S.Wrap aria-hidden>
      {/* ── Lesson scope panel ── */}
      <S.Panel $active={scope === 'lesson'}>
        <S.PanelHeader>
          <S.PanelEyebrow>Lesson scope</S.PanelEyebrow>
          <S.PanelHint>this lesson + nearby</S.PanelHint>
        </S.PanelHeader>
        <S.LessonPage>
          <S.PageRow $w={80} />
          <S.PageRow $w={94} $highlight={scope === 'lesson'} />
          <S.PageRow $w={62} />
          <S.PageRow $w={78} />
        </S.LessonPage>
        <S.Bubble $on={scope === 'lesson'}>
          <S.BubbleAvatar>L</S.BubbleAvatar>
          <S.BubbleText key={`L-${scope}`} $typing={scope === 'lesson'}>
            {LESSON_PROMPT}
          </S.BubbleText>
        </S.Bubble>
      </S.Panel>

      <S.Divider />

      {/* ── Course scope panel ── */}
      <S.Panel $active={scope === 'course'}>
        <S.PanelHeader>
          <S.PanelEyebrow>Course scope</S.PanelEyebrow>
          <S.PanelHint>whole outline + progress</S.PanelHint>
        </S.PanelHeader>
        <S.Outline>
          <S.OutRow $w={72} $highlight={scope === 'course'} />
          <S.OutRow $w={58} $indent />
          <S.OutRow $w={64} $indent $checked={scope === 'course'} />
          <S.OutRow $w={68} />
          <S.OutRow $w={50} $indent />
          <S.OutRow $w={60} />
        </S.Outline>
        <S.Bubble $on={scope === 'course'}>
          <S.BubbleAvatar>C</S.BubbleAvatar>
          <S.BubbleText key={`C-${scope}`} $typing={scope === 'course'}>
            {COURSE_PROMPT}
          </S.BubbleText>
        </S.Bubble>
      </S.Panel>
    </S.Wrap>
  );
};
