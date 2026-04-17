import { Info, Lightbulb, TriangleAlert, OctagonAlert } from 'lucide-react';
import { useTheme } from 'styled-components';
import { LessonMarkdown } from '../LessonMarkdown';
import * as S from '../styles';

const VARIANTS = {
  info: { label: 'Note', icon: Info, colorKey: 'muted' },
  tip: { label: 'Tip', icon: Lightbulb, colorKey: 'tertiary' },
  warning: { label: 'Warning', icon: TriangleAlert, colorKey: 'warning' },
  important: { label: 'Important', icon: OctagonAlert, colorKey: 'error' },
} as const;

export const CalloutBlock = ({ content, metadata }: { content: string; metadata: Record<string, unknown> | null }) => {
  const theme = useTheme();
  const variant = (metadata?.variant as string) ?? 'info';

  if (variant === 'key_concept') {
    return (
      <S.KeyConceptContainer>
        <S.KeyConceptLabel>Key Concept</S.KeyConceptLabel>
        <S.KeyConceptQuote>{content}</S.KeyConceptQuote>
      </S.KeyConceptContainer>
    );
  }

  const v = VARIANTS[variant as keyof typeof VARIANTS] ?? VARIANTS.info;
  const color = theme.colors[v.colorKey as keyof typeof theme.colors];
  const Icon = v.icon;

  return (
    <S.CalloutContainer $color={color}>
      <S.CalloutLabel $color={color}>
        <Icon />
        {v.label}
      </S.CalloutLabel>
      <LessonMarkdown>{content}</LessonMarkdown>
    </S.CalloutContainer>
  );
};
