'use client';

import { useMutation } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { executeCode } from '@/api/routes/course';
import { Button } from '@/components';
import { LessonMarkdown } from '../LessonMarkdown';
import * as S from '../styles';

export const ExerciseBlock = ({
  blockId,
  content,
  metadata,
  onAttempt,
}: {
  blockId: string;
  content: string;
  metadata: Record<string, unknown> | null;
  onAttempt?: (attempt: { blockId: string; code: string; passed: boolean }) => void;
}) => {
  const language = (metadata?.language as string) ?? '';
  const starterCode = (metadata?.starterCode as string) ?? '';
  const expectedOutput = (metadata?.expectedOutput as string) ?? '';
  const hasEditor = !!language && !!starterCode;
  const { resolvedTheme } = useTheme();

  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<InstanceType<typeof import('@codemirror/view').EditorView> | null>(null);
  const [output, setOutput] = useState<{ stdout: string | null; stderr: string | null; status: string } | null>(null);

  const executeMutation = useMutation({
    mutationFn: () => {
      const code = viewRef.current?.state.doc.toString() ?? starterCode;
      return executeCode({ code, language });
    },
    onSuccess: (data) => {
      setOutput({ stdout: data.stdout, stderr: data.stderr, status: data.status });

      const code = viewRef.current?.state.doc.toString() ?? starterCode;
      const passed = expectedOutput
        ? (data.stdout ?? '').trim() === expectedOutput.trim()
        : data.status === 'Accepted' && !data.stderr;
      onAttempt?.({ blockId, code, passed });
    },
    onError: (err) => {
      setOutput({ stdout: null, stderr: err instanceof Error ? err.message : 'Execution failed', status: 'Error' });
    },
    meta: { silent: true },
  });

  useEffect(() => {
    if (!hasEditor || !editorRef.current) return;

    // Destroy previous instance when theme changes
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }

    let destroyed = false;

    const init = async () => {
      const { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } =
        await import('@codemirror/view');
      const { EditorState } = await import('@codemirror/state');
      const { defaultKeymap, indentWithTab } = await import('@codemirror/commands');
      const { syntaxHighlighting, defaultHighlightStyle, indentOnInput, bracketMatching } =
        await import('@codemirror/language');

      let langExtension;
      try {
        switch (language.toLowerCase()) {
          case 'python': {
            const { python } = await import('@codemirror/lang-python');
            langExtension = python();
            break;
          }
          case 'javascript':
          case 'typescript': {
            const { javascript } = await import('@codemirror/lang-javascript');
            langExtension = javascript({ typescript: language.toLowerCase() === 'typescript' });
            break;
          }
          case 'java': {
            const { java } = await import('@codemirror/lang-java');
            langExtension = java();
            break;
          }
          case 'cpp':
          case 'c': {
            const { cpp } = await import('@codemirror/lang-cpp');
            langExtension = cpp();
            break;
          }
          case 'rust': {
            const { rust } = await import('@codemirror/lang-rust');
            langExtension = rust();
            break;
          }
          case 'sql': {
            const { sql } = await import('@codemirror/lang-sql');
            langExtension = sql();
            break;
          }
        }
      } catch {
        // Language extension not available
      }

      if (destroyed || !editorRef.current) return;

      const extensions = [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        indentOnInput(),
        bracketMatching(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        keymap.of([...defaultKeymap, indentWithTab]),
        EditorView.lineWrapping,
      ];

      if (resolvedTheme === 'dark') {
        const { oneDark } = await import('@codemirror/theme-one-dark');
        extensions.push(oneDark);
      }

      if (langExtension) extensions.push(langExtension);

      // Preserve current code if editor is being recreated (theme change)
      const currentDoc = viewRef.current?.state.doc.toString();

      const state = EditorState.create({
        doc: currentDoc ?? starterCode,
        extensions,
      });

      viewRef.current = new EditorView({
        state,
        parent: editorRef.current,
      });
    };

    init();

    return () => {
      destroyed = true;
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [hasEditor, language, starterCode, resolvedTheme]);

  return (
    <S.ExerciseContainer>
      <S.ExerciseHeader>
        <S.ExerciseHeaderIcon>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 2L2 5.5 5.5 9" />
            <path d="M10.5 7L14 10.5 10.5 14" />
          </svg>
        </S.ExerciseHeaderIcon>
        <S.ExerciseHeaderLabel>Try It Yourself</S.ExerciseHeaderLabel>
      </S.ExerciseHeader>
      <S.ExerciseContent>
        <LessonMarkdown>
          {expectedOutput ? content.replace(/\n*\*?\*?Expected output\*?\*?:?[\s\S]*$/i, '').trim() : content}
        </LessonMarkdown>
      </S.ExerciseContent>

      {hasEditor && (
        <>
          <S.ExerciseEditorWrapper ref={editorRef} />

          <S.ExerciseToolbar>
            <Button size="small" onClick={() => executeMutation.mutate()} loading={executeMutation.isPending}>
              Run
            </Button>
            <S.ToolbarInfo>{language}</S.ToolbarInfo>
          </S.ExerciseToolbar>

          {output && (
            <S.OutputPanel>
              <S.OutputHeader>
                Output
                {output.status !== 'Accepted' && <span>({output.status})</span>}
              </S.OutputHeader>
              <S.OutputBody $isError={!!output.stderr && !output.stdout}>
                {output.stdout || output.stderr || 'No output'}
              </S.OutputBody>
            </S.OutputPanel>
          )}

          {expectedOutput && output && (
            <S.ExpectedOutput>
              <strong>Expected output:</strong>
              <pre>{expectedOutput}</pre>
            </S.ExpectedOutput>
          )}
        </>
      )}
    </S.ExerciseContainer>
  );
};
