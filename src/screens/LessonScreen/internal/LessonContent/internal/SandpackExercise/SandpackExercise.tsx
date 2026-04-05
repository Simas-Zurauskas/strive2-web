'use client';

import { useState, useMemo } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './SandpackExercise.styles';

interface FileEntry {
  path: string;
  content: string;
}

type SandpackTemplate = 'vanilla' | 'react' | 'vue' | 'svelte' | 'angular';

interface SandpackExerciseProps {
  files: FileEntry[];
  template: SandpackTemplate;
  activeFile?: string;
  onComplete?: (filesSnapshot: string) => void;
}

const SandpackToolbar = ({
  template,
  onComplete,
}: {
  template: string;
  onComplete?: (filesSnapshot: string) => void;
}) => {
  const [completed, setCompleted] = useState(false);
  const { sandpack } = useSandpack();

  const handleComplete = () => {
    if (completed) return;
    setCompleted(true);

    // Snapshot all files from the editor
    const currentFiles: Record<string, string> = {};
    for (const path of Object.keys(sandpack.files)) {
      currentFiles[path] = sandpack.files[path].code;
    }
    onComplete?.(JSON.stringify(currentFiles));
  };

  return (
    <S.Toolbar>
      <S.CompleteButton onClick={handleComplete} $completed={completed} disabled={completed}>
        {completed ? 'Completed' : 'Mark as complete'}
      </S.CompleteButton>
      <S.TemplateLabel>{template}</S.TemplateLabel>
    </S.Toolbar>
  );
};

export const SandpackExercise = ({ files, template: templateProp, activeFile, onComplete }: SandpackExerciseProps) => {
  const { hexColors } = useAppTheme();

  // Convert array-of-objects to Record<path, content> for Sandpack
  const filesRecord = useMemo(
    () => Object.fromEntries(files.map((f) => [f.path, f.content])),
    [files],
  );

  // Auto-detect framework from file extensions/content when template seems wrong
  const template = useMemo((): SandpackTemplate => {
    if (templateProp !== 'vanilla') return templateProp;
    // Detect framework from file patterns when vanilla is set
    if (files.some((f) => f.path.endsWith('.vue'))) return 'vue';
    if (files.some((f) => f.path.endsWith('.svelte'))) return 'svelte';
    if (files.some((f) => /<[A-Z]/.test(f.content) || f.path.endsWith('.jsx') || f.path.endsWith('.tsx'))) return 'react';
    return 'vanilla';
  }, [templateProp, files]);

  const sandpackTheme = useMemo(
    () => ({
      colors: {
        surface1: hexColors.background,
        surface2: hexColors.surface,
        surface3: hexColors.border,
        clickable: hexColors.muted,
        base: hexColors.foreground,
        disabled: hexColors.muted,
        hover: hexColors.surface,
        accent: hexColors.accent,
        error: hexColors.error,
        errorSurface: hexColors.surface,
      },
      font: {
        body: 'var(--font-geist-sans, sans-serif)',
        mono: "var(--font-geist-mono, 'Geist Mono', monospace)",
        size: '13px',
        lineHeight: '1.6',
      },
    }),
    [hexColors],
  );

  return (
    <S.Wrapper>
      <SandpackProvider
        template={template}
        theme={sandpackTheme}
        files={filesRecord}
        options={{
          activeFile: activeFile || files[0]?.path,
          visibleFiles: Object.keys(filesRecord),
        }}
      >
        <SandpackLayout>
          <SandpackCodeEditor
            showLineNumbers
            showTabs={Object.keys(files).length > 1}
            wrapContent
            style={{ minHeight: '300px', maxHeight: '500px' }}
          />
          <SandpackPreview
            showOpenInCodeSandbox={false}
            showRefreshButton
            style={{ minHeight: '300px', maxHeight: '500px' }}
          />
        </SandpackLayout>
        <SandpackToolbar template={template} onComplete={onComplete} />
      </SandpackProvider>
    </S.Wrapper>
  );
};
