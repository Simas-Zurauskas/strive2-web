'use client';

import {
  IntroBlock,
  SectionBlock,
  CodeBlock,
  MermaidBlock,
  CalloutBlock,
  SummaryBlock,
  QuizBlock,
  LinksBlock,
  ExerciseBlock,
  QuizSkeleton,
  ExerciseSkeleton,
} from './blocks';
import { LessonMarkdown } from './LessonMarkdown';
import * as S from './styles';
import type { ExerciseAttempt, LessonBlock, QuizResponse } from '@/api/types';

// ── Types ──────────────────────────────────────────────

interface PlaceholderBlock {
  id: string;
  type: 'quiz' | 'exercise';
  order: number;
}

interface BlockRendererProps {
  blocks: LessonBlock[];
  placeholders?: PlaceholderBlock[];
  progressData?: {
    quizResponses: QuizResponse[];
    exerciseAttempts: ExerciseAttempt[];
  };
  onQuizAnswer?: (response: { blockId: string; selectedOption: number; correct: boolean }) => void;
  onExerciseAttempt?: (attempt: { blockId: string; code: string; passed: boolean }) => void;
}

// ── Main renderer ──────────────────────────────────────

export const BlockRenderer = ({
  blocks,
  placeholders = [],
  progressData,
  onQuizAnswer,
  onExerciseAttempt,
}: BlockRendererProps) => {
  type RenderItem = { kind: 'block'; block: LessonBlock } | { kind: 'placeholder'; placeholder: PlaceholderBlock };
  const items: RenderItem[] = [
    ...blocks.map((block) => ({ kind: 'block' as const, block })),
    ...placeholders.map((placeholder) => ({ kind: 'placeholder' as const, placeholder })),
  ];
  const sorted = items.sort((a, b) => {
    const orderA = a.kind === 'block' ? a.block.order : a.placeholder.order;
    const orderB = b.kind === 'block' ? b.block.order : b.placeholder.order;
    return orderA - orderB;
  });

  const firstSectionItem = sorted.find((item) => item.kind === 'block' && item.block.type === 'section');
  const firstSectionId = firstSectionItem?.kind === 'block' ? firstSectionItem.block.id : null;

  const quizResponseMap = new Map((progressData?.quizResponses ?? []).map((r) => [r.blockId, r]));

  return (
    <>
      {sorted.map((item, index) => {
        const staggerStyle = { '--block-index': index } as React.CSSProperties;

        if (item.kind === 'placeholder') {
          return item.placeholder.type === 'quiz' ? (
            <QuizSkeleton key={item.placeholder.id} />
          ) : (
            <ExerciseSkeleton key={item.placeholder.id} />
          );
        }

        const block = item.block;
        let element: React.ReactNode;

        switch (block.type) {
          case 'intro':
            element = <IntroBlock content={block.content} />;
            break;
          case 'section': {
            element = <SectionBlock content={block.content} first={block.id === firstSectionId} />;
            break;
          }
          case 'code':
            element = <CodeBlock content={block.content} metadata={block.metadata} />;
            break;
          case 'mermaid':
            element = <MermaidBlock content={block.content} />;
            break;
          case 'callout':
            element = <CalloutBlock content={block.content} metadata={block.metadata} />;
            break;
          case 'quiz':
            element = (
              <QuizBlock
                blockId={block.id}
                metadata={block.metadata}
                savedResponse={quizResponseMap.get(block.id)}
                onAnswer={onQuizAnswer}
              />
            );
            break;
          case 'exercise':
            element = (
              <ExerciseBlock
                blockId={block.id}
                content={block.content}
                metadata={block.metadata}
                onAttempt={onExerciseAttempt}
              />
            );
            break;
          case 'links':
            element = <LinksBlock metadata={block.metadata} />;
            break;
          case 'summary':
            element = <SummaryBlock content={block.content} />;
            break;
          default:
            element = (
              <S.BlockWrapper>
                <LessonMarkdown>{block.content}</LessonMarkdown>
              </S.BlockWrapper>
            );
        }

        return (
          <div key={block.id} style={staggerStyle}>
            {element}
          </div>
        );
      })}
    </>
  );
};
