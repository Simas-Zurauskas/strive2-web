'use client';

import { useCallback, useMemo, useState } from 'react';
import { CourseModule } from '@/api/types';
import { Card, Button, Badge } from '@/components';
import { useJobManager } from '@/hooks/useJobManager';
import { ChatPanel } from './ChatPanel';
import * as S from './StructureStep.styles';

interface StructureStepProps {
  courseId: string;
  modules: CourseModule[];
  onStructureModified: () => void;
  onAccept: () => void;
  onStartFresh: () => void;
  onBack: () => void;
}

export const StructureStep = ({
  courseId,
  modules,
  onStructureModified,
  onAccept,
  onStartFresh,
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
        <S.Title>Your Course Structure</S.Title>
        <S.Subtitle>
          <Badge variant="default">
            {modules.length} module{modules.length !== 1 ? 's' : ''} &middot; {totalLessons} lesson
            {totalLessons !== 1 ? 's' : ''}
          </Badge>
        </S.Subtitle>
      </S.Header>

      <S.TwoColumn>
        <S.StructureColumn>
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
              Looks good
            </Button>
            <S.StartFreshLink type="button" onClick={onStartFresh}>
              Start fresh
            </S.StartFreshLink>
          </S.Actions>
        </S.StructureColumn>

        <S.ChatColumn>
          <ChatPanel
            courseId={courseId}
            onStructureModified={onStructureModified}
            onModifying={handleModifying}
          />
        </S.ChatColumn>
      </S.TwoColumn>
    </S.Container>
  );
};
