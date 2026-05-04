'use client';

import { ArrowUpRight, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useGradeRecallAnswer } from '@/hooks';
import { InlineCode } from './InlineCode';
import * as S from './RecallCard.styles';
import { RatingBar } from '../RatingBar/RatingBar';
import type { GradeResult, RecallQueueItem, RecallRating } from '@/api/types';

interface RecallCardProps {
  card: RecallQueueItem;
  onRate: (args: { rating: RecallRating; typedMatch?: number | null }) => void;
  onSkip: () => void;
  onToggleMode: () => void;
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
  // Fallback for malformed cloze (no marker) — just show the prompt.
  if (parts.length === 1) return <InlineCode text={prompt} />;
  return (
    <>
      <InlineCode text={parts[0]} />
      <S.BlankSlot $revealed={revealed}>
        {revealed ? <InlineCode text={answer} /> : '\u00A0'}
      </S.BlankSlot>
      <InlineCode text={parts.slice(1).join('')} />
    </>
  );
};

export const RecallCard = ({
  card,
  onRate,
  onSkip,
  onToggleMode,
  isRating,
}: RecallCardProps) => {
  // Parent remounts this component with key={card.recallCardId} so state is
  // always fresh per card — no reset-on-change useEffect needed.
  const [revealed, setRevealed] = useState(false);
  const [typedValue, setTypedValue] = useState('');
  const [typedSubmitted, setTypedSubmitted] = useState(false);
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: gradeAnswer, isPending: isGrading } = useGradeRecallAnswer();

  // Auto-focus text input when entering typed-recall mode.
  useEffect(() => {
    if (card.mode === 'typed-recall' && !typedSubmitted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [card.mode, typedSubmitted]);

  // Space-to-reveal keyboard shortcut, only when not typing.
  useEffect(() => {
    if (card.mode === 'typed-recall') return;
    if (revealed) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setRevealed(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [card.mode, revealed]);

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = typedValue.trim();
    if (!trimmed) return;
    setTypedSubmitted(true);
    setRevealed(true);
    gradeAnswer(
      { recallCardId: card.recallCardId, userAnswer: trimmed },
      {
        onSuccess: (result) => setGrade(result),
        // On failure the hook is silent; card still shows the canonical so
        // the user can self-grade via the rating buttons.
      },
    );
  };

  const handleRate = (rating: RecallRating) => {
    onRate({ rating, typedMatch: grade?.score ?? null });
  };

  const lessonHref = card.courseSlug
    ? `/course/${card.courseSlug}/lesson/${card.moduleIndex}/${card.lessonIndex}#${card.sourceBlockId}`
    : `/course/${card.courseId}/lesson/${card.moduleIndex}/${card.lessonIndex}#${card.sourceBlockId}`;

  return (
    <S.Card>
      <S.SourceRow>
        <S.SourceMeta>
          <S.SourceCourse title={card.courseName}>{card.courseName}</S.SourceCourse>
          <S.SourceLink
            href={lessonHref}
            target="_blank"
            rel="noopener noreferrer"
            title={`${card.courseName} · ${card.lessonName}`}
          >
            <span>{card.lessonName}</span>
            <ArrowUpRight size={12} strokeWidth={2} />
          </S.SourceLink>
        </S.SourceMeta>
        <S.SourceBadges>
          {/* Mode is a preference, not an action — segmented control is clearer
              than a generic toggle button and always shows both options. */}
          <S.ModeToggle role="group" aria-label="Interaction mode">
            <S.ModeOption
              type="button"
              $active={card.mode === 'tap-reveal'}
              onClick={() => card.mode === 'typed-recall' && onToggleMode()}
              disabled={card.mode === 'tap-reveal'}
              title="Tap to reveal (easier)"
              aria-pressed={card.mode === 'tap-reveal'}
            >
              Tap
            </S.ModeOption>
            <S.ModeOption
              type="button"
              $active={card.mode === 'typed-recall'}
              onClick={() => card.mode === 'tap-reveal' && onToggleMode()}
              disabled={card.mode === 'typed-recall'}
              title="Typed recall (deeper practice)"
              aria-pressed={card.mode === 'typed-recall'}
            >
              Typed
            </S.ModeOption>
          </S.ModeToggle>
        </S.SourceBadges>
      </S.SourceRow>

      <S.Prompt>
        {card.kind === 'cloze' ? (
          <ClozePrompt prompt={card.prompt} answer={card.answer} revealed={revealed} />
        ) : (
          <InlineCode text={card.prompt} />
        )}
      </S.Prompt>

      {/* Typed-mode primary row — the engaged path */}
      {card.mode === 'typed-recall' && !typedSubmitted && (
        <S.TypedRow onSubmit={handleTypedSubmit}>
          <S.TypedInput
            ref={inputRef}
            type="text"
            value={typedValue}
            onChange={(e) => setTypedValue(e.target.value)}
            placeholder="Type your answer…"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <S.TypedSubmit type="submit" disabled={!typedValue.trim()}>
            Check
          </S.TypedSubmit>
        </S.TypedRow>
      )}

      {/* Tap-mode reveal — quiet divider affordance, not a CTA */}
      {card.mode === 'tap-reveal' && !revealed && (
        <S.RevealDivider type="button" onClick={() => setRevealed(true)} autoFocus>
          <S.RevealLabel>Reveal</S.RevealLabel>
        </S.RevealDivider>
      )}

      {/* Revealed — verdict (if typed), answer, rating bar */}
      {revealed && (
        <>
          {typedSubmitted && (
            <S.VerdictPanel $verdict={grade?.verdict ?? null}>
              <S.VerdictHeader>
                <S.YourAnswer>Your answer: &ldquo;{typedValue}&rdquo;</S.YourAnswer>
                {isGrading && (
                  <S.GradingSpinner>
                    <Loader2 size={12} className="spin" strokeWidth={2.5} />
                    Grading…
                  </S.GradingSpinner>
                )}
                {!isGrading && grade && (
                  <S.VerdictPill $verdict={grade.verdict}>
                    {grade.verdict === 'correct' ? 'Correct' : grade.verdict === 'partial' ? 'Partial' : 'Incorrect'}
                  </S.VerdictPill>
                )}
              </S.VerdictHeader>
              {!isGrading && grade && <S.VerdictFeedback>{grade.feedback}</S.VerdictFeedback>}
            </S.VerdictPanel>
          )}

          <S.AnswerBlock>
            <S.AnswerLabel>{card.kind === 'cloze' ? 'Blank was' : 'Answer'}</S.AnswerLabel>
            <S.AnswerText>
              <InlineCode text={card.answer} />
            </S.AnswerText>
          </S.AnswerBlock>

          <RatingBar onRate={handleRate} disabled={isRating} />
        </>
      )}

      <S.FooterRow>
        <S.FooterBadges>
          {card.isNew && <S.Badge $variant="new">New</S.Badge>}
          {!card.isNew && card.box >= 2 && <S.Badge $variant="box">Box {card.box}</S.Badge>}
        </S.FooterBadges>
        {!revealed && (
          <S.SkipLink type="button" onClick={onSkip} title="Skip — come back tomorrow">
            Skip
          </S.SkipLink>
        )}
      </S.FooterRow>
    </S.Card>
  );
};
