'use client';

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMutation } from '@tanstack/react-query';
import { executeCode, QuizResponseData, ExerciseAttemptData } from '@/api/routes/course';
import * as S from './blocks.styles';

const LazySandpackExercise = lazy(() =>
  import('./SandpackExercise').then((m) => ({ default: m.SandpackExercise })),
);

// ── Types ──────────────────────────────────────────────

interface LessonBlock {
  id: string;
  type: string;
  content: string;
  metadata: Record<string, unknown> | null;
  order: number;
}

// ── Individual block renderers ─────────────────────────

const IntroBlock = ({ content }: { content: string }) => (
  <S.IntroText>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </S.IntroText>
);

const SectionBlock = ({ content, first }: { content: string; first?: boolean }) => (
  <S.SectionContent $first={first}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </S.SectionContent>
);

const CodeBlock = ({ content, metadata }: { content: string; metadata: Record<string, unknown> | null }) => {
  const [copied, setCopied] = useState(false);
  const language = (metadata?.language as string) ?? '';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <S.CodeContainer>
      <S.CodeHeader>
        <S.CodeLanguage>{language || 'code'}</S.CodeLanguage>
        <S.CopyButton onClick={handleCopy}>{copied ? 'Copied' : 'Copy'}</S.CopyButton>
      </S.CodeHeader>
      <S.CodePre>
        <code>{content}</code>
      </S.CodePre>
    </S.CodeContainer>
  );
};

const cleanMermaidContent = (raw: string): string => {
  let cleaned = raw.trim();
  // Strip markdown code fences (```mermaid ... ``` or ``` ... ```)
  cleaned = cleaned.replace(/^```(?:mermaid)?\s*\n?/i, '').replace(/\n?```\s*$/,'');
  // Strip trailing semicolons on each line (some LLMs add them, mermaid can choke)
  cleaned = cleaned
    .split('\n')
    .map((line) => line.replace(/;\s*$/, ''))
    .join('\n');
  return cleaned.trim();
};

// Global init — mermaid.initialize must only be called once
let mermaidInitialized = false;

const initMermaid = async () => {
  const mermaid = (await import('mermaid')).default;
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'var(--font-body-sans, sans-serif)',
    });
    mermaidInitialized = true;
  }
  return mermaid;
};

const MermaidBlock = ({ content }: { content: string }) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const [renderState, setRenderState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [showCode, setShowCode] = useState(false);

  const cleaned = cleanMermaidContent(content);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      if (!codeRef.current) return;
      try {
        const mermaid = await initMermaid();
        await mermaid.run({ nodes: [codeRef.current] });
        if (!cancelled) setRenderState('success');
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : String(e);
        console.warn('[MermaidBlock] Render failed:', msg);
        setErrorMsg(msg);
        setRenderState('error');
      }
    };

    render();
    return () => { cancelled = true; };
  }, [cleaned]);

  if (renderState === 'error') {
    return (
      <S.CodeContainer>
        <S.CodeHeader>
          <S.CodeLanguage>diagram (render failed)</S.CodeLanguage>
        </S.CodeHeader>
        <S.CodePre>
          <code>{cleaned}</code>
        </S.CodePre>
        {errorMsg && (
          <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#ef4444', borderTop: '1px solid var(--border)' }}>
            {errorMsg}
          </div>
        )}
      </S.CodeContainer>
    );
  }

  return (
    <S.MermaidContainer>
      <S.MermaidDiagram>
        <pre ref={codeRef} className="mermaid">{cleaned}</pre>
      </S.MermaidDiagram>
      {renderState === 'success' && (
        <S.MermaidCodeToggle onClick={() => setShowCode((prev) => !prev)}>
          {showCode ? 'Hide source' : 'Show source'}
        </S.MermaidCodeToggle>
      )}
      {showCode && (
        <S.CodePre>
          <code>{cleaned}</code>
        </S.CodePre>
      )}
    </S.MermaidContainer>
  );
};

const CALLOUT_LABELS: Record<string, string> = {
  info: 'Note',
  tip: 'Tip',
  warning: 'Warning',
  important: 'Important',
};

const CALLOUT_ICONS: Record<string, string> = {
  info: '\u2139\uFE0F',
  tip: '\uD83D\uDCA1',
  warning: '\u26A0\uFE0F',
  important: '\u2757',
};

const CalloutBlock = ({ content, metadata }: { content: string; metadata: Record<string, unknown> | null }) => {
  const variant = (metadata?.variant as string) ?? 'info';

  // Key concept variant — centered pull-quote style
  if (variant === 'key_concept') {
    return (
      <S.KeyConceptContainer>
        <S.KeyConceptLabel>Key Concept</S.KeyConceptLabel>
        <S.KeyConceptQuote>{content}</S.KeyConceptQuote>
      </S.KeyConceptContainer>
    );
  }

  const calloutVariant = variant as 'info' | 'tip' | 'warning' | 'important';
  return (
    <S.CalloutContainer $variant={calloutVariant}>
      <S.CalloutLabel>
        <span role="img" aria-hidden="true">{CALLOUT_ICONS[calloutVariant]}</span>
        {CALLOUT_LABELS[calloutVariant] ?? 'Note'}
      </S.CalloutLabel>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </S.CalloutContainer>
  );
};

const SummaryBlock = ({ content }: { content: string }) => {
  const items = content
    .split('\n')
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);

  return (
    <S.SummaryContainer>
      <S.SummaryTitle>Key Takeaways</S.SummaryTitle>
      <S.SummaryList>
        {items.map((item, i) => (
          <S.SummaryItem key={i}><ReactMarkdown remarkPlugins={[remarkGfm]}>{item}</ReactMarkdown></S.SummaryItem>
        ))}
      </S.SummaryList>
    </S.SummaryContainer>
  );
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const QuizBlock = ({
  blockId,
  metadata,
  savedResponse,
  onAnswer,
}: {
  blockId: string;
  metadata: Record<string, unknown> | null;
  savedResponse?: QuizResponseData;
  onAnswer?: (response: { blockId: string; selectedOption: number; correct: boolean }) => void;
}) => {
  const [selected, setSelected] = useState<number | null>(savedResponse?.selectedOption ?? null);
  const [confirmed, setConfirmed] = useState(savedResponse != null);

  const question = (metadata?.question as string) ?? '';
  const options = (metadata?.options as string[]) ?? [];
  const correctIndex = (metadata?.correctIndex as number) ?? 0;
  const explanation = (metadata?.explanation as string) ?? '';

  const getOptionState = (index: number): 'default' | 'selected' | 'correct' | 'incorrect' | 'dimmed' => {
    if (!confirmed) {
      return index === selected ? 'selected' : 'default';
    }
    if (index === correctIndex) return 'correct';
    if (index === selected) return 'incorrect';
    return 'dimmed';
  };

  const handleSelect = (index: number) => {
    if (confirmed) return;
    setSelected(index);
  };

  const handleConfirm = () => {
    if (selected === null || confirmed) return;
    setConfirmed(true);
    onAnswer?.({ blockId, selectedOption: selected, correct: selected === correctIndex });
  };

  return (
    <S.QuizContainer>
      <S.QuizHeader>Check your understanding</S.QuizHeader>
      <S.QuizQuestion>{question}</S.QuizQuestion>
      <S.QuizOptions>
        {options.map((option, i) => (
          <S.QuizOption
            key={i}
            $state={getOptionState(i)}
            onClick={() => handleSelect(i)}
          >
            <S.QuizOptionLetter $state={getOptionState(i)}>
              {OPTION_LETTERS[i]}
            </S.QuizOptionLetter>
            {option}
          </S.QuizOption>
        ))}
      </S.QuizOptions>
      {selected !== null && !confirmed && (
        <S.QuizConfirmButton onClick={handleConfirm}>
          Confirm Answer
        </S.QuizConfirmButton>
      )}
      {confirmed && explanation && (
        <S.QuizExplanation>{explanation}</S.QuizExplanation>
      )}
    </S.QuizContainer>
  );
};

const LinksBlock = ({ metadata }: { metadata: Record<string, unknown> | null }) => {
  const links = (metadata?.links as Array<{ title: string; url: string; description: string }>) ?? [];

  if (links.length === 0) return null;

  return (
    <S.LinksContainer>
      <S.LinksHeader>Further Reading</S.LinksHeader>
      <S.LinksList>
        {links.map((link, i) => (
          <S.LinkItem key={i} href={link.url} target="_blank" rel="noopener noreferrer">
            <S.LinkTitle>{link.title}</S.LinkTitle>
            {link.description && <S.LinkDescription>{link.description}</S.LinkDescription>}
          </S.LinkItem>
        ))}
      </S.LinksList>
    </S.LinksContainer>
  );
};

const ExerciseBlock = ({
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
  const executionEnv = (metadata?.executionEnvironment as string) ?? 'judge0';

  if (executionEnv === 'sandpack') {
    const files = (metadata?.files as Array<{ path: string; content: string }>) ?? [];
    const template = (metadata?.template as 'vanilla' | 'react' | 'vue' | 'svelte' | 'angular') ?? 'vanilla';
    const activeFile = metadata?.activeFile as string | undefined;

    return (
      <S.ExerciseContainer>
        <S.ExerciseHeader>Try it yourself</S.ExerciseHeader>
        <S.ExerciseContent>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </S.ExerciseContent>
        <Suspense fallback={<S.SkeletonBody><S.SkeletonCodeBlock /></S.SkeletonBody>}>
          <LazySandpackExercise
            files={files}
            template={template}
            activeFile={activeFile}
            onComplete={(filesSnapshot) => {
              onAttempt?.({ blockId, code: filesSnapshot, passed: true });
            }}
          />
        </Suspense>
      </S.ExerciseContainer>
    );
  }

  const language = (metadata?.language as string) ?? '';
  const starterCode = (metadata?.starterCode as string) ?? '';
  const expectedOutput = (metadata?.expectedOutput as string) ?? '';
  const hasEditor = !!language && !!starterCode;

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

      // Persist attempt
      const code = viewRef.current?.state.doc.toString() ?? starterCode;
      const passed = expectedOutput
        ? (data.stdout ?? '').trim() === expectedOutput.trim()
        : data.status === 'Accepted' && !data.stderr;
      onAttempt?.({ blockId, code, passed });
    },
    onError: (err) => {
      setOutput({ stdout: null, stderr: err instanceof Error ? err.message : 'Execution failed', status: 'Error' });
    },
  });

  // Initialize CodeMirror
  useEffect(() => {
    if (!hasEditor || !editorRef.current || viewRef.current) return;

    let destroyed = false;

    const init = async () => {
      const { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } = await import('@codemirror/view');
      const { EditorState } = await import('@codemirror/state');
      const { defaultKeymap, indentWithTab } = await import('@codemirror/commands');
      const { syntaxHighlighting, defaultHighlightStyle, indentOnInput, bracketMatching } = await import('@codemirror/language');
      const { oneDark } = await import('@codemirror/theme-one-dark');

      // Load language support
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
        // Language extension not available — editor works without syntax highlighting
      }

      if (destroyed || !editorRef.current) return;

      const extensions = [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        indentOnInput(),
        bracketMatching(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        oneDark,
        keymap.of([...defaultKeymap, indentWithTab]),
        EditorView.lineWrapping,
      ];

      if (langExtension) extensions.push(langExtension);

      const state = EditorState.create({
        doc: starterCode,
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
  }, [hasEditor, language, starterCode]);

  return (
    <S.ExerciseContainer>
      <S.ExerciseHeader>Try it yourself</S.ExerciseHeader>
      <S.ExerciseContent>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {expectedOutput ? content.replace(/\n*\*?\*?Expected output\*?\*?:?[\s\S]*$/i, '').trim() : content}
        </ReactMarkdown>
      </S.ExerciseContent>

      {hasEditor && (
        <>
          <S.ExerciseEditorWrapper ref={editorRef} />

          <S.ExerciseToolbar>
            <S.RunButton
              onClick={() => executeMutation.mutate()}
              $running={executeMutation.isPending}
              disabled={executeMutation.isPending}
            >
              {executeMutation.isPending ? 'Running...' : 'Run'}
            </S.RunButton>
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

// ── Skeleton placeholders ─────────────────────────────

const QuizSkeleton = () => (
  <S.QuizContainer>
    <S.QuizHeader>Check your understanding</S.QuizHeader>
    <S.SkeletonBody>
      <S.SkeletonLine $width="70%" />
      <S.SkeletonOption />
      <S.SkeletonOption />
      <S.SkeletonOption />
    </S.SkeletonBody>
  </S.QuizContainer>
);

const ExerciseSkeleton = () => (
  <S.ExerciseContainer>
    <S.ExerciseHeader>Try it yourself</S.ExerciseHeader>
    <S.SkeletonBody>
      <S.SkeletonLine $width="85%" />
      <S.SkeletonLine $width="60%" />
      <S.SkeletonCodeBlock />
    </S.SkeletonBody>
  </S.ExerciseContainer>
);

// ── Main renderer ──────────────────────────────────────

interface PlaceholderBlock {
  id: string;
  type: 'quiz' | 'exercise';
  order: number;
}

interface BlockRendererProps {
  blocks: LessonBlock[];
  placeholders?: PlaceholderBlock[];
  progressData?: {
    quizResponses: QuizResponseData[];
    exerciseAttempts: ExerciseAttemptData[];
  };
  onQuizAnswer?: (response: { blockId: string; selectedOption: number; correct: boolean }) => void;
  onExerciseAttempt?: (attempt: { blockId: string; code: string; passed: boolean }) => void;
}

export const BlockRenderer = ({ blocks, placeholders = [], progressData, onQuizAnswer, onExerciseAttempt }: BlockRendererProps) => {
  let firstSectionSeen = false;

  // Merge real blocks with placeholders, sort by order
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

  // Build lookup for saved quiz responses by blockId
  const quizResponseMap = new Map(
    (progressData?.quizResponses ?? []).map((r) => [r.blockId, r]),
  );

  return (
    <>
      {sorted.map((item, index) => {
        const staggerStyle = { '--block-index': index } as React.CSSProperties;

        if (item.kind === 'placeholder') {
          return item.placeholder.type === 'quiz'
            ? <QuizSkeleton key={item.placeholder.id} />
            : <ExerciseSkeleton key={item.placeholder.id} />;
        }

        const block = item.block;
        let element: React.ReactNode;

        switch (block.type) {
          case 'intro':
            element = <IntroBlock content={block.content} />;
            break;
          case 'section': {
            const isFirst = !firstSectionSeen;
            firstSectionSeen = true;
            element = <SectionBlock content={block.content} first={isFirst} />;
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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
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
