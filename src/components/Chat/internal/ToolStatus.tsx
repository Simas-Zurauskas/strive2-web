'use client';

import * as S from './ToolStatus.styles';

interface ToolStatusProps {
  status: 'thinking' | 'responding';
}

// Three-dot typing indicator. The sequential dot offsets are the
// well-known typing-bubble pattern; we left-align the indicator so it
// sits where the assistant's message will land in the conversation
// flow (assistant messages are full-width plain prose — see
// ChatMessage.styles — so the dots don't sit inside a bubble either).
export const ToolStatus = ({ status }: ToolStatusProps) => {
  const label = status === 'thinking' ? 'Thinking' : 'Responding';
  return (
    <S.Container role="status" aria-label={label}>
      <S.Dot style={{ animationDelay: '0ms' }} />
      <S.Dot style={{ animationDelay: '160ms' }} />
      <S.Dot style={{ animationDelay: '320ms' }} />
    </S.Container>
  );
};
