'use client';

import { ArrowUpRight, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HelpAnchor } from '@/components';
import { useGradeRecallAnswer } from '@/hooks';
import { useMotion } from '@/theme/motionPresets';
import { InlineCode } from './InlineCode';
import * as S from './RecallCard.styles';
import { RatingBar } from '../RatingBar/RatingBar';
import type { GradeResult, RecallQueueItem, RecallRating } from '@/api/types';

interface RecallCardProps {
  card: RecallQueueItem;
  /** True when this card is reappearing in-session after a previous Again. */
  isRetry?: boolean;
  onRate: (rating: RecallRating) => void;
  onSkip: () => void;
  isRating?: boolean;
}

const CLOZE_RE = /\{\{\s*blank\s*\}\}/i;

/** Render a cloze prompt with the blank either hidden or revealed. */
const ClozePrompt = ({
  prompt,
  answer,
  revealed,
}: {
  prompt: string;
  answer: string;
  revealed: boolean;
}) => {
  const parts = prompt.split(CLOZE_RE);
  if (parts.length === 1) return <InlineCode text={prompt} />;
  return (
    <>
      <InlineCode text={parts[0]} />
      <S.BlankSlot $revealed={revealed}>
        {revealed ? <InlineCode text={answer} /> : ' '}
      </S.BlankSlot>
      <InlineCode text={parts.slice(1).join('')} />
    </>
  );
};

export const RecallCard = ({ card, isRetry, onRate, onSkip, isRating }: RecallCardProps) => {
  // Parent remounts this component with key={card.recallCardId} so state
  // is always fresh per card.
  const [revealed, setRevealed] = useState(false);
  const [typedValue, setTypedValue] = useState('');
  const [typedSubmitted, setTypedSubmitted] = useState(false);
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { prefersReduced } = useMotion();
  const { mutate: gradeAnswer } = useGradeRecallAnswer();

  // Space/Enter reveals when not already revealed, not focused in the
  // typed input, and not currently waiting for the AI to grade a typed
  // answer. Enter inside the input submits the typed answer (handled by
  // the form below).
  useEffect(() => {
    if (revealed || typedSubmitted) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      )
        return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setRevealed(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [revealed, typedSubmitted]);

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = typedValue.trim();
    if (!trimmed) return;
    // Mark submitted but DO NOT reveal yet — wait for the AI verdict so
    // the user doesn't see the canonical answer next to their (possibly
    // wrong) input before the system has actually evaluated it.
    setTypedSubmitted(true);
    gradeAnswer(
      { recallCardId: card.recallCardId, userAnswer: trimmed },
      {
        onSuccess: (result) => {
          setGrade(result);
          setRevealed(true);
        },
        onError: () => {
          // Grader unreachable — fall back to revealing without a
          // verdict so the user can still self-grade.
          setRevealed(true);
        },
      },
    );
  };

  const lessonHref = card.courseSlug
    ? `/course/${card.courseSlug}/lesson/${card.moduleIndex}/${card.lessonIndex}#${card.sourceBlockId}`
    : `/course/${card.courseId}/lesson/${card.moduleIndex}/${card.lessonIndex}#${card.sourceBlockId}`;

  const motionProps = prefersReduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.12 },
      }
    : {
        initial: { opacity: 0, y: 14, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.985 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

  return (
    <S.Stack>
      {/* Lesson breadcrumb — small muted line outside the card so the
          prompt is the first weighted element the eye lands on. */}
      <S.Breadcrumb>
        <S.CourseTag title={card.courseName}>{card.courseName}</S.CourseTag>
        <S.BreadcrumbSep aria-hidden>/</S.BreadcrumbSep>
        <S.LessonLink
          href={lessonHref}
          target="_blank"
          rel="noopener noreferrer"
          title={`${card.courseName} · ${card.lessonName}`}
        >
          <span>{card.lessonName}</span>
          <ArrowUpRight size={11} strokeWidth={2} />
        </S.LessonLink>
        {isRetry && (
          <S.RetryBadge title="You marked this Again — give it another try">
            ↻ retry
          </S.RetryBadge>
        )}
      </S.Breadcrumb>

      <S.Card {...motionProps}>
        <S.Prompt>
          {card.kind === 'cloze' ? (
            <ClozePrompt prompt={card.prompt} answer={card.answer} revealed={revealed} />
          ) : (
            <InlineCode text={card.prompt} />
          )}
        </S.Prompt>

        {!revealed && !typedSubmitted && (
          <>
            {/* Optional typed-recall input. Always visible — typing
                yields a graded check; clicking Reveal skips the typing.
                No mode toggle. */}
            <S.TypedForm onSubmit={handleTypedSubmit}>
              <S.TypedInput
                ref={inputRef}
                type="text"
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                placeholder="Try it from memory…"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Try it from memory"
              />
              <S.TypedSubmit type="submit" disabled={!typedValue.trim()} title="Check answer (Enter)">
                Check
              </S.TypedSubmit>
            </S.TypedForm>

            <S.OrDivider aria-hidden>
              <S.OrLabel>or</S.OrLabel>
            </S.OrDivider>

            <S.RevealRow>
              <S.RevealButton type="button" onClick={() => setRevealed(true)} autoFocus>
                Reveal answer
              </S.RevealButton>
              <S.SkipButton type="button" onClick={onSkip} title="Skip — come back tomorrow">
                Skip
              </S.SkipButton>
            </S.RevealRow>
          </>
        )}

        {/* Assessing state — typed answer submitted, AI grading in
            flight. Holds back the canonical answer + rating bar so the
            user doesn't perceive a pre-judgment. */}
        {!revealed && typedSubmitted && (
          <S.Assessing aria-live="polite">
            <S.AssessingHeader>
              <Loader2 size={14} className="spin" strokeWidth={2.5} />
              Marking your answer
            </S.AssessingHeader>
            <S.AssessingYourAnswer>
              you typed <S.YourAnswerQuoted>{typedValue}</S.YourAnswerQuoted>
            </S.AssessingYourAnswer>
          </S.Assessing>
        )}

        {revealed && (
          <>
            {/* Cloze reveals the answer inline in the prompt; restating it
                in a separate block is duplication. Only QA cards need a
                dedicated answer panel below. */}
            {card.kind !== 'cloze' && (
              <S.AnswerBlock>
                <S.AnswerLabel>Answer</S.AnswerLabel>
                <S.AnswerText>
                  <InlineCode text={card.answer} />
                </S.AnswerText>
              </S.AnswerBlock>
            )}

            {typedSubmitted && (
              <S.Verdict $verdict={grade?.verdict ?? null}>
                <S.VerdictRow>
                  {grade && (
                    <S.VerdictStatus $verdict={grade.verdict}>
                      {grade.verdict === 'correct'
                        ? 'Correct'
                        : grade.verdict === 'partial'
                          ? 'Partial'
                          : 'Incorrect'}
                    </S.VerdictStatus>
                  )}
                  <S.YourAnswer>
                    you typed <S.YourAnswerQuoted>{typedValue}</S.YourAnswerQuoted>
                  </S.YourAnswer>
                </S.VerdictRow>
                {grade?.feedback && <S.VerdictFeedback>{grade.feedback}</S.VerdictFeedback>}
              </S.Verdict>
            )}

            <S.RatingLabel>
              How well did you recall? <HelpAnchor concept="recall-ratings" size="sm" />
            </S.RatingLabel>
            <RatingBar box={card.box} onRate={onRate} disabled={isRating} />
          </>
        )}
      </S.Card>
    </S.Stack>
  );
};
