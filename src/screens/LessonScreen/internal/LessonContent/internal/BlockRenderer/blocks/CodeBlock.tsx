'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
// prism-async-light loads grammars on demand and ships only the ones we register
// here as eager. Switching from the synchronous Prism build saves ~600KB
// uncompressed off the lesson-page bundle. Themes are lazy-loaded below.
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import * as S from '../styles/code.styles';

// Eagerly registered languages. PrismAsyncLight will fall back to dynamic-import
// for anything not in this list, so adding a new language doesn't require a code
// change — but the most common ones are pre-registered to avoid a network blip
// the first time a user opens a code block.
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('md', markdown);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('rs', rust);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('yml', yaml);

type PrismTheme = Record<string, React.CSSProperties>;

export const CodeBlock = ({ content, metadata }: { content: string; metadata: Record<string, unknown> | null }) => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<PrismTheme | undefined>(undefined);
  const { resolvedTheme } = useTheme();
  const language = (metadata?.language as string) ?? '';

  useEffect(() => setMounted(true), []);

  // Themes are dynamically imported so the un-needed one is not bundled. Both
  // are tiny (~5KB each) so the dynamic import is cheap; the win is letting the
  // bundler tree-shake the rest of `react-syntax-highlighter/dist/esm/styles`.
  useEffect(() => {
    if (!mounted) return;
    const isDark = resolvedTheme === 'dark';
    let cancelled = false;
    (async () => {
      const mod = isDark
        ? await import('react-syntax-highlighter/dist/esm/styles/prism/one-dark')
        : await import('react-syntax-highlighter/dist/esm/styles/prism/one-light');
      if (!cancelled) setTheme(mod.default as PrismTheme);
    })();
    return () => {
      cancelled = true;
    };
  }, [mounted, resolvedTheme]);

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
      <SyntaxHighlighter
        language={language || 'text'}
        style={theme ?? {}}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          fontSize: '0.8125em',
          lineHeight: 1.6,
          borderRadius: 0,
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-geist-mono, 'Geist Mono', 'SF Mono', 'Fira Code', monospace)",
          },
        }}
      >
        {content}
      </SyntaxHighlighter>
    </S.CodeContainer>
  );
};
