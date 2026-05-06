'use client';

import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './LiveLessonMock.styles';
import { HERO, LESSONS, type LessonBlock, type Token } from '../../constants';

const TYPE_INTERVAL_MS = 55;
const STAGE_TIMINGS = {
  typing_buffer_after_done: 600,
  fade_to_lesson: 320,
  block_stagger: 700,
  reset_after_blocks: 1800,
} as const;

type Stage = 'typing' | 'lesson';

const renderTokens = (tokens: Token[]) =>
  tokens.map((t, i) => (
    <S.Tok key={i} $kind={t.kind}>
      {t.text}
    </S.Tok>
  ));

const renderBlock = (block: LessonBlock, key: string | number) => {
  switch (block.kind) {
    case 'heading':
      return <S.SectionHeading key={key}>{block.text}</S.SectionHeading>;
    case 'prose':
      return <S.Prose key={key}>{block.text}</S.Prose>;
    case 'code':
      return (
        <S.CodeBlock key={key}>
          {block.lines.map((line, i) => (
            <S.CodeLine key={i}>{renderTokens(line)}</S.CodeLine>
          ))}
        </S.CodeBlock>
      );
    case 'callout':
      return (
        <S.CalloutCard key={key} $tone={block.tone}>
          {block.title && <S.CalloutTitle>{block.title}</S.CalloutTitle>}
          <S.CalloutBody $formula={block.tone === 'formula'}>{block.body}</S.CalloutBody>
          {block.gloss && <S.CalloutGloss>{block.gloss}</S.CalloutGloss>}
        </S.CalloutCard>
      );
    case 'quiz':
      return (
        <S.QuizCard key={key}>
          <S.QuizLabel>Quick check</S.QuizLabel>
          <S.QuizQuestion>{block.question}</S.QuizQuestion>
          <S.QuizOptions>
            {block.options.map((opt, i) => (
              <S.QuizOption key={i} $correct={opt.correct}>
                {opt.text}
              </S.QuizOption>
            ))}
          </S.QuizOptions>
        </S.QuizCard>
      );
  }
};

export const LiveLessonMock = () => {
  const { prefersReduced } = useMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(wrapperRef, { amount: 0.2 });
  const [goalIndex, setGoalIndex] = useState(0);
  const [typed, setTyped] = useState(prefersReduced ? HERO.goalRotations[0] : '');
  const [stage, setStage] = useState<Stage>(prefersReduced ? 'lesson' : 'typing');
  const lesson = LESSONS[goalIndex % LESSONS.length];
  const goal = HERO.goalRotations[goalIndex % HERO.goalRotations.length];
  const blockCount = lesson.blocks.length;
  const [visibleBlocks, setVisibleBlocks] = useState(prefersReduced ? blockCount : 0);

  // Stage 1: type out the current goal char-by-char. Stage 2/3: stream
  // real lesson blocks for that goal. When done, rotate to the next.
  useEffect(() => {
    if (prefersReduced) return;
    if (!inView) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Reset animation state at the start of every goal rotation. The cascade
    // is intentional and bounded — each goal change kicks off a fresh typing
    // → lesson sequence. Refactoring to keys would tear down the entire
    // mock frame on every rotation, which defeats the visual continuity.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStage('typing');
    setTyped('');
    setVisibleBlocks(0);

    let charIndex = 0;
    const tick = () => {
      if (cancelled) return;
      charIndex += 1;
      setTyped(goal.slice(0, charIndex));
      if (charIndex < goal.length) {
        timers.push(setTimeout(tick, TYPE_INTERVAL_MS));
      } else {
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            setStage('lesson');
            lesson.blocks.forEach((_, i) => {
              timers.push(
                setTimeout(() => {
                  if (cancelled) return;
                  setVisibleBlocks(i + 1);
                }, STAGE_TIMINGS.fade_to_lesson + i * STAGE_TIMINGS.block_stagger),
              );
            });
            timers.push(
              setTimeout(
                () => {
                  if (cancelled) return;
                  setGoalIndex((i) => i + 1);
                },
                STAGE_TIMINGS.fade_to_lesson +
                  blockCount * STAGE_TIMINGS.block_stagger +
                  STAGE_TIMINGS.reset_after_blocks,
              ),
            );
          }, STAGE_TIMINGS.typing_buffer_after_done),
        );
      }
    };
    timers.push(setTimeout(tick, TYPE_INTERVAL_MS));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [goal, lesson, blockCount, inView, prefersReduced]);

  return (
    <S.Frame ref={wrapperRef} role="presentation" aria-hidden="true">
      <S.FrameTopBar>
        <S.Dot />
        <S.Dot />
        <S.Dot />
      </S.FrameTopBar>
      <S.FrameBody>
        {stage === 'typing' && !prefersReduced ? (
          <S.GoalStage>
            <S.GoalLabel>Your goal</S.GoalLabel>
            <S.GoalInput>
              <span>{typed}</span>
              <S.Caret aria-hidden="true" />
            </S.GoalInput>
            <S.GoalHint>We&rsquo;ll build the curriculum from here.</S.GoalHint>
          </S.GoalStage>
        ) : (
          <S.LessonStage>
            <S.ModuleEyebrow>{lesson.module}</S.ModuleEyebrow>
            <S.LessonTitle>{lesson.lesson}</S.LessonTitle>
            <S.BlockList>
              {lesson.blocks.map((block, i) => (
                <S.BlockRow key={`${goalIndex}-${i}`} $visible={i < visibleBlocks}>
                  {renderBlock(block, i)}
                </S.BlockRow>
              ))}
            </S.BlockList>
          </S.LessonStage>
        )}
      </S.FrameBody>
    </S.Frame>
  );
};
