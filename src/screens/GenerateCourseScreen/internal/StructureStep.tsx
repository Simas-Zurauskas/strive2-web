'use client';

import { useAnimation } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CourseModule } from '@/api/types';
import { Card, Button, Badge, Eyebrow, HelpAnchor } from '@/components';
import { useJobManager } from '@/hooks/useJobManager';
import { plural } from '@/lib/strings';
import { PANEL_CLOSE_TRANSITION, PANEL_OPEN_TRANSITION } from '@/theme/motionPresets';
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

  // Tablet drawer state. At desktop the chat is always visible as a
  // sticky right rail — we force `chatOpen=true` there so framer's
  // animate target stays at x:0% and doesn't translate the column
  // off-screen. At tablet the same ChatColumn becomes a fixed slide-in
  // drawer driven by user interaction (trigger / Esc / backdrop / drag).
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1025px)').matches : true,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  const [chatOpenTablet, setChatOpenTablet] = useState(false);
  const chatOpen = isDesktop ? true : chatOpenTablet;
  const setChatOpen = useCallback((next: boolean) => setChatOpenTablet(next), []);

  const chatControls = useAnimation();
  useEffect(() => {
    chatControls.start(
      chatOpen ? 'open' : 'closed',
      chatOpen ? PANEL_OPEN_TRANSITION : PANEL_CLOSE_TRANSITION,
    );
  }, [chatOpen, chatControls]);
  useEffect(() => {
    if (!chatOpenTablet || isDesktop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setChatOpenTablet(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chatOpenTablet, isDesktop]);

  return (
    <S.Container>
      <S.Header>
        <Eyebrow>
          Structure <HelpAnchor concept="modules-and-lessons" size="sm" />
        </Eyebrow>
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
            {/* Refine trigger lives on the action row — same eye-line as
                the primary "Accept" button so users see both at once.
                The help anchor / explainer of what the AI does lives
                INSIDE the panel header (mirrors the lesson mentor
                pattern), not next to this button. */}
            <S.RefineTrigger
              type="button"
              onClick={() => setChatOpen(true)}
              aria-label="Refine the structure by chatting with the AI"
              aria-expanded={chatOpen}
              aria-controls="structure-chat-drawer"
            >
              <Sparkles aria-hidden />
              Refine with AI
            </S.RefineTrigger>
            <Button type="button" onClick={onAccept} disabled={showOverlay}>
              Accept &amp; Start Learning
            </Button>
          </S.Actions>
        </S.StructureColumn>

        <S.ChatBackdrop
          $open={chatOpen}
          onClick={() => setChatOpen(false)}
          aria-hidden
        />
        <S.ChatColumn
          id="structure-chat-drawer"
          aria-hidden={false /* always interactive at desktop; tablet hides via translate */}
          aria-label="Refine course structure"
          initial={chatOpen ? 'open' : 'closed'}
          animate={chatControls}
          variants={{
            open: { x: '0%' },
            closed: { x: '100%' },
          }}
          /* Default fallback transition — open/close use the explicit
             durations passed via chatControls.start in the useEffect
             above (PANEL_OPEN/CLOSE_TRANSITION). */
          transition={PANEL_CLOSE_TRANSITION}
          drag="x"
          dragConstraints={{ left: 0, right: 480 }}
          dragElastic={0}
          dragMomentum={false}
          onDragEnd={(_e, info) => {
            if (info.offset.x > 100 || info.velocity.x > 400) {
              setChatOpen(false);
            } else {
              chatControls.start('open', PANEL_CLOSE_TRANSITION);
            }
          }}
        >
          {/* Header now lives INSIDE ChatPanel — eyebrow, help anchor,
              and the collapse chevron are all part of the panel chrome
              (matches the lesson mentor pattern). The drawer hosts only
              the chat panel and its motion props; no external chrome
              here. */}
          <ChatPanel
            courseId={courseId}
            onStructureModified={onStructureModified}
            onModifying={handleModifying}
            onClose={() => setChatOpen(false)}
          />
        </S.ChatColumn>
      </S.TwoColumn>
    </S.Container>
  );
};
