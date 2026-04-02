'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as S from './CourseSidebar.styles';

interface Module {
  name: string;
  description: string;
  lessons?: { name: string; description: string }[];
}

interface CourseSidebarProps {
  courseId: string;
  courseName: string;
  modules: Module[];
  currentModuleIndex: number;
  currentLessonIndex: number;
  onNavigate: (moduleIndex: number, lessonIndex: number) => void;
  onCollapse: () => void;
}

export const CourseSidebar = ({
  courseId,
  courseName,
  modules,
  currentModuleIndex,
  currentLessonIndex,
  onNavigate,
  onCollapse,
}: CourseSidebarProps) => {
  const router = useRouter();

  // All modules start expanded; current module is always expanded
  const [expandedModules, setExpandedModules] = useState<Set<number>>(() => {
    return new Set(modules.map((_, i) => i));
  });

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
  let completedCount = 0; // Placeholder — will track generated lessons later

  return (
    <S.Container>
      <S.Header>
        <S.BackLink onClick={() => router.push(`/course/${courseId}`)}>
          &larr; <S.CourseName>{courseName || 'Course'}</S.CourseName>
        </S.BackLink>
        <S.CollapseButton onClick={onCollapse} aria-label="Collapse sidebar">
          &#10094;
        </S.CollapseButton>
      </S.Header>

      <S.Tree>
        {modules.map((mod, mi) => {
          const expanded = expandedModules.has(mi);
          const lessons = mod.lessons ?? [];

          return (
            <div key={mi}>
              <S.ModuleHeader $expanded={expanded} onClick={() => toggleModule(mi)}>
                <S.Chevron $expanded={expanded}>&#9654;</S.Chevron>
                <S.ModuleLabel>
                  {mi + 1}. {mod.name}
                </S.ModuleLabel>
              </S.ModuleHeader>

              {expanded && (
                <S.LessonList>
                  {lessons.map((lesson, li) => {
                    const isActive = mi === currentModuleIndex && li === currentLessonIndex;

                    return (
                      <S.LessonItem
                        key={li}
                        $active={isActive}
                        onClick={() => onNavigate(mi, li)}
                      >
                        <S.LessonDot $active={isActive} />
                        <S.LessonName>{lesson.name}</S.LessonName>
                      </S.LessonItem>
                    );
                  })}
                </S.LessonList>
              )}
            </div>
          );
        })}
      </S.Tree>

      <S.Footer>
        {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
      </S.Footer>
    </S.Container>
  );
};
