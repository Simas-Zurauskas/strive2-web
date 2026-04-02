'use client';

import { useMemo } from 'react';
import * as S from './ToolStatus.styles';

interface ToolStatusProps {
  status: 'thinking' | 'responding';
}

export const ToolStatus = ({ status }: ToolStatusProps) => {
  const label = status === 'thinking' ? 'Thinking...' : 'Responding...';

  const animatedChars = useMemo(() => {
    return label.split('').map((char, index) => (
      <S.AnimatedChar key={`${char}-${index}`} style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
        {char === ' ' ? '\u00A0' : char}
      </S.AnimatedChar>
    ));
  }, [label]);

  return (
    <S.Container>
      <S.Text>{animatedChars}</S.Text>
    </S.Container>
  );
};
