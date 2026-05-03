'use client';

import { useCallback, useMemo, useState } from 'react';
import { CourseModule } from '@/api/types';
import { Card, Button, Badge, Eyebrow } from '@/components';
import { useJobManager } from '@/hooks/useJobManager';
import { plural } from '@/lib/strings';
import { ChatPanel } from './ChatPanel';
import { DepthContextChip } from './DepthContextChip';
import * as S from './StructureStep.styles';

interface StructureStepProps {
  courseId: string;
  modules: CourseModule[];
  /** Depth the learner picked at Step 3. Optional for legacy/in-flight cases. */
  selectedDepth?: string | null;
  /** Depth the recommender suggested. Absent on legacy courses (pre-depthPreviews). */
  recommendedDepth?: string | null;
  /** LLM-emitted overcommit risk; drives the chip's amber-strong variant. */
  overcommitRisk?: 'low' | 'moderate' | 'high';
  /** LLM-emitted undercommit risk; same role as overcommitRisk for the down-pick case. */
  undercommitRisk?: 'low' | 'moderate' | 'high';
  onStructureModified: () => void;
  onAccept: () => void;
  onBack: () => void;
}

export const StructureStep = ({
  courseId,
  modules,
  selectedDepth,
  recommendedDepth,
  overcommitRisk,
  undercommitRisk,
  onStructureModified,
  onAccept,
  onBack,
}: StructureStepProps) => {
  const totalLessons = useMemo(() => modules.reduce((sum, m) => sum + m.lessons.length, 0), [modules]);
  const [isModifying, setIsModifying] = useState(false);
  const { isJobRunningForCourse } = useJobManager();
  const showOverlay = isModifying || isJobRunningForCourse(courseId);

  const handleModifying = useCallback((active: boolean) => {
    setIsModifying(active);
  }, []);

  return (
    <S.Container>
      <S.Header>
        <Eyebrow>Structure</Eyebrow>
        <S.Title>Your Course Structure</S.Title>
        <S.Subtitle>
          Review the modules and lessons below. Use the chat to make changes &mdash; add or remove topics, reorder
          modules, adjust scope, or ask why something was included. When you&apos;re happy with it, accept to start learning.
        </S.Subtitle>
        <Badge variant="default">
          {modules.length} {plural({ count: modules.length, singular: 'module' })} &middot; {totalLessons} {plural({ count: totalLessons, singular: 'lesson' })}
        </Badge>
      </S.Header>

      <S.TwoColumn>
        <S.StructureColumn>
          <DepthContextChip
            courseId={courseId}
            selectedDepth={selectedDepth}
            recommendedDepth={recommendedDepth}
            overcommitRisk={overcommitRisk}
            undercommitRisk={undercommitRisk}
          />
          <S.ModulesWrapper>
            {showOverlay && (
              <S.ModifyingOverlay>
                <S.ModifyingSpinner />
                Updating structure...
              </S.ModifyingOverlay>
            )}
            <S.Modules $dimmed={showOverlay}>
              {modules.map((mod, i) => (
                <Card key={`${i}-${mod.name}`} header={`Module ${i + 1}: ${mod.name}`}>
                  <S.ModuleDescription>{mod.description}</S.ModuleDescription>
                  <S.LessonList>
                    {mod.lessons.map((lesson, j) => (
                      <S.LessonItem key={`${j}-${lesson.name}`}>
                        <S.LessonContent>
                          <S.LessonName>{lesson.name}</S.LessonName>
                          <S.LessonDescription>{lesson.description}</S.LessonDescription>
                        </S.LessonContent>
                      </S.LessonItem>
                    ))}
                  </S.LessonList>
                </Card>
              ))}
            </S.Modules>
          </S.ModulesWrapper>

          <S.Actions>
            <Button variant="secondary" type="button" onClick={onBack}>
              Back
            </Button>
            <Button type="button" onClick={onAccept} disabled={showOverlay}>
              Accept &amp; Start Learning
            </Button>
          </S.Actions>
        </S.StructureColumn>

        <S.ChatColumn>
          <ChatPanel courseId={courseId} onStructureModified={onStructureModified} onModifying={handleModifying} />
        </S.ChatColumn>
      </S.TwoColumn>
    </S.Container>
  );
};
