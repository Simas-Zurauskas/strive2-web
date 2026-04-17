'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { upsertLessonProgress } from '@/api/routes/course';
import { useUpsertProgress } from '@/hooks';
import * as S from './NotesPanel.styles';

const PencilIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11.5 1.5l3 3L5 14H2v-3z" />
    <path d="M9.5 3.5l3 3" />
  </svg>
);

const MAX_NOTES_LENGTH = 10_000;

const bodyVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1 },
};

const bodyTransition = {
  height: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  opacity: { duration: 0.2, ease: 'easeInOut' as const },
};

interface NotesPanelProps {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  initialNotes: string | null;
}

export const NotesPanel = ({ courseId, moduleIndex, lessonIndex, initialNotes }: NotesPanelProps) => {
  const [expanded, setExpanded] = useState(!!initialNotes);
  const [text, setText] = useState(initialNotes ?? '');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(initialNotes ?? '');
  const textRef = useRef(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const upsertProgress = useUpsertProgress();

  // Keep textRef in sync for use in cleanup effects
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // Sync state when lesson changes
  useEffect(() => {
    setText(initialNotes ?? ''); // eslint-disable-line react-hooks/set-state-in-effect -- sync state on prop change
    lastSavedRef.current = initialNotes ?? '';
    setSaveStatus('idle');
    if (initialNotes) setExpanded(true);
  }, [courseId, moduleIndex, lessonIndex, initialNotes]);

  // Flush pending save on lesson change or unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (savedClearRef.current) {
        clearTimeout(savedClearRef.current);
        savedClearRef.current = null;
      }
      if (textRef.current !== lastSavedRef.current) {
        // Fire-and-forget: cleanup closes over the OLD lesson IDs, so this
        // correctly flushes pending notes to the lesson the user was on.
        upsertLessonProgress({ courseId, moduleIndex, lessonIndex, data: {
          notes: textRef.current || null,
        } }).catch(() => {});
        lastSavedRef.current = textRef.current;
      }
    };
  }, [courseId, moduleIndex, lessonIndex]);

  const save = useCallback(
    (value: string) => {
      if (value === lastSavedRef.current) return;
      setSaveStatus('saving');
      upsertProgress.mutate(
        { courseId, moduleIndex, lessonIndex, data: { notes: value || null } },
        {
          onSuccess: () => {
            lastSavedRef.current = value;
            setSaveStatus('saved');
            if (savedClearRef.current) clearTimeout(savedClearRef.current);
            savedClearRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
          },
          onError: () => setSaveStatus('idle'),
        },
      );
    },
    [courseId, moduleIndex, lessonIndex, upsertProgress],
  );

  const handleChange = (value: string) => {
    if (value.length > MAX_NOTES_LENGTH) return;
    setText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(value), 800);
  };

  const handleBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    save(text);
  };

  const toggle = useCallback(() => {
    setExpanded((prev) => {
      if (!prev) setTimeout(() => textareaRef.current?.focus(), 350);
      return !prev;
    });
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + Shift + M
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  return (
    <S.Container>
      <S.Header>
        <S.Toggle onClick={toggle}>
          <PencilIcon />
          {expanded ? 'Hide notes' : text ? 'My notes' : 'Add a note'}
        </S.Toggle>
        {saveStatus !== 'idle' && (
          <S.SaveStatus>{saveStatus === 'saving' ? 'Saving...' : 'Saved'}</S.SaveStatus>
        )}
      </S.Header>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="notes-body"
            variants={bodyVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={bodyTransition}
            style={{ overflow: 'hidden', marginTop: '0.75rem' }}
          >
            <S.Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              maxLength={MAX_NOTES_LENGTH}
              placeholder="Type your notes here..."
            />
            <S.Footer>
              {text.length > MAX_NOTES_LENGTH * 0.9 ? (
                <S.CharCount $warn>
                  {text.length.toLocaleString()} / {MAX_NOTES_LENGTH.toLocaleString()}
                </S.CharCount>
              ) : (
                <span />
              )}
              <S.ShortcutHint>⌘⇧M</S.ShortcutHint>
            </S.Footer>
          </motion.div>
        )}
      </AnimatePresence>
    </S.Container>
  );
};
