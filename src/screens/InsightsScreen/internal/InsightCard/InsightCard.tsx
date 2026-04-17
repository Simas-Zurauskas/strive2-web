'use client';

import { ArrowUpRight, Keyboard, Loader2, MousePointerClick } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useGradeInsightAnswer } from '@/hooks';
import { InlineCode } from './InlineCode';
import * as S from './InsightCard.styles';
import { RatingBar } from '../RatingBar/RatingBar';
import type { GradeResult, InsightQueueItem, InsightRating } from '@/api/types';

interface InsightCardProps {
  insight: InsightQueueItem;
  onRate: (rating: InsightRating, typedMatch?: number | null) => void;
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

export const InsightCard = ({
  insight,
  onRate,
  onSkip,
  onToggleMode,
  isRating,
}: InsightCardProps) => {
  // Parent remounts this component with key={insight.insightId} so state is
  // always fresh per card — no reset-on-change useEffect needed.
  const [revealed, setRevealed] = useState(false);
  const [typedValue, setTypedValue] = useState('');
  const [typedSubmitted, setTypedSubmitted] = useState(false);
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: gradeAnswer, isPending: isGrading } = useGradeInsightAnswer();

  // Auto-focus text input when entering typed-recall mode.
  useEffect(() => {
    if (insight.mode === 'typed-recall' && !typedSubmitted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [insight.mode, typedSubmitted]);

  // Space-to-reveal keyboard shortcut, only when not typing.
  useEffect(() => {
    if (insight.mode === 'typed-recall') return;
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
  }, [insight.mode, revealed]);

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = typedValue.trim();
    if (!trimmed) return;
    setTypedSubmitted(true);
    setRevealed(true);
    gradeAnswer(
      { insightId: insight.insightId, userAnswer: trimmed },
      {
        onSuccess: (result) => setGrade(result),
        // On failure the hook is silent; card still shows the canonical so
        // the user can self-grade via the rating buttons.
      },
    );
  };

  const handleRate = (rating: InsightRating) => {
    onRate(rating, grade?.score ?? null);
  };

  const lessonHref = insight.courseSlug
    ? `/course/${insight.courseSlug}/lesson/${insight.moduleIndex}/${insight.lessonIndex}#${insight.sourceBlockId}`
    : `/course/${insight.courseId}/lesson/${insight.moduleIndex}/${insight.lessonIndex}#${insight.sourceBlockId}`;

  const kindLabel = insight.kind === 'cloze' ? 'Cloze' : 'Q&A';

  return (
    <S.Card>
      <S.SourceRow>
        <S.SourceLink
          href={lessonHref}
          target="_blank"
          rel="noopener noreferrer"
          title={`${insight.courseName} · ${insight.lessonName}`}
        >
          {insight.courseName} · {insight.lessonName}
          <ArrowUpRight size={12} strokeWidth={2} />
        </S.SourceLink>
        <S.SourceBadges>
          <S.Badge $variant="kind">{kindLabel}</S.Badge>
          {insight.isNew && <S.Badge $variant="new">New</S.Badge>}
          {!insight.isNew && insight.box >= 2 && <S.Badge $variant="box">Box {insight.box}</S.Badge>}
          {/* Mode is a preference, not an action — segmented control is clearer
              than a generic toggle button and always shows both options. */}
          <S.ModeToggle role="group" aria-label="Interaction mode">
            <S.ModeOption
              type="button"
              $active={insight.mode === 'tap-reveal'}
              onClick={() => insight.mode === 'typed-recall' && onToggleMode()}
              disabled={insight.mode === 'tap-reveal'}
              title="Tap to reveal (easier)"
              aria-pressed={insight.mode === 'tap-reveal'}
            >
              <MousePointerClick size={12} strokeWidth={2} />
              Tap
            </S.ModeOption>
            <S.ModeOption
              type="button"
              $active={insight.mode === 'typed-recall'}
              onClick={() => insight.mode === 'tap-reveal' && onToggleMode()}
              disabled={insight.mode === 'typed-recall'}
              title="Typed recall (deeper practice)"
              aria-pressed={insight.mode === 'typed-recall'}
            >
              <Keyboard size={12} strokeWidth={2} />
              Typed
            </S.ModeOption>
          </S.ModeToggle>
        </S.SourceBadges>
      </S.SourceRow>

      <S.Prompt>
        {insight.kind === 'cloze' ? (
          <ClozePrompt prompt={insight.prompt} answer={insight.answer} revealed={revealed} />
        ) : (
          <InlineCode text={insight.prompt} />
        )}
      </S.Prompt>

      {/* Typed-mode primary row — the engaged path */}
      {insight.mode === 'typed-recall' && !typedSubmitted && (
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
      {insight.mode === 'tap-reveal' && !revealed && (
        <S.RevealDivider type="button" onClick={() => setRevealed(true)} autoFocus>
          <S.RevealLabel>Tap to reveal</S.RevealLabel>
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
            <S.AnswerLabel>{insight.kind === 'cloze' ? 'Blank was' : 'Answer'}</S.AnswerLabel>
            <S.AnswerText>
              <InlineCode text={insight.answer} />
            </S.AnswerText>
          </S.AnswerBlock>

          <RatingBar onRate={handleRate} disabled={isRating} />
        </>
      )}

      {/* Footer — tags on the left, Skip as an unobtrusive escape hatch on the right.
          Skip hides post-reveal since the user should rate at that point. */}
      {(insight.conceptTags.length > 0 || !revealed) && (
        <S.FooterRow>
          {insight.conceptTags.length > 0 ? (
            <S.TagRow>
              {insight.conceptTags.map((t) => (
                <S.Tag key={t}>{t}</S.Tag>
              ))}
            </S.TagRow>
          ) : (
            <span />
          )}
          {!revealed && (
            <S.SkipLink type="button" onClick={onSkip} title="Skip — come back tomorrow">
              Skip for now →
            </S.SkipLink>
          )}
        </S.FooterRow>
      )}
    </S.Card>
  );
};
