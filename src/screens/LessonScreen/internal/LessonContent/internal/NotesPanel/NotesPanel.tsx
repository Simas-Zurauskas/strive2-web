'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { upsertLessonProgress } from '@/api/routes/course';
import * as S from './NotesPanel.styles';

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
  const lastSavedRef = useRef(initialNotes ?? '');

  // Reset when navigating to a different lesson
  useEffect(() => {
    setText(initialNotes ?? '');
    lastSavedRef.current = initialNotes ?? '';
    setSaveStatus('idle');
    if (initialNotes) setExpanded(true);
  }, [courseId, moduleIndex, lessonIndex, initialNotes]);

  const save = useCallback(
    (value: string) => {
      if (value === lastSavedRef.current) return;
      setSaveStatus('saving');
      upsertLessonProgress(courseId, moduleIndex, lessonIndex, { notes: value || null })
        .then(() => {
          lastSavedRef.current = value;
          setSaveStatus('saved');
        })
        .catch(() => setSaveStatus('idle'));
    },
    [courseId, moduleIndex, lessonIndex],
  );

  const handleChange = (value: string) => {
    setText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(value), 2000);
  };

  const handleBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    save(text);
  };

  return (
    <S.Container>
      <S.Header onClick={() => setExpanded((prev) => !prev)}>
        <S.Chevron $expanded={expanded}>&#9654;</S.Chevron>
        My Notes
        {saveStatus !== 'idle' && (
          <S.SaveStatus>{saveStatus === 'saving' ? 'Saving...' : 'Saved'}</S.SaveStatus>
        )}
      </S.Header>

      {expanded && (
        <S.Body>
          <S.Textarea
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="Type your notes here..."
          />
        </S.Body>
      )}
    </S.Container>
  );
};
