'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import * as S from '../styles/code.styles';

export const CodeBlock = ({ content, metadata }: { content: string; metadata: Record<string, unknown> | null }) => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const language = (metadata?.language as string) ?? '';

  useEffect(() => setMounted(true), []); // eslint-disable-line react-hooks/set-state-in-effect -- hydration detection

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const theme = mounted && resolvedTheme === 'dark' ? oneDark : oneLight;

  return (
    <S.CodeContainer>
      <S.CodeHeader>
        <S.CodeLanguage>{language || 'code'}</S.CodeLanguage>
        <S.CopyButton onClick={handleCopy}>{copied ? 'Copied' : 'Copy'}</S.CopyButton>
      </S.CodeHeader>
      <SyntaxHighlighter
        language={language || 'text'}
        style={theme}
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
