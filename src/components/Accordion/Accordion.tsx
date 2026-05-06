'use client';

import { useId, useState, type ReactNode } from 'react';
import * as S from './Accordion.styles';

interface AccordionItemProps {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem = ({
  question,
  children,
  defaultOpen = false,
}: AccordionItemProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const headingId = useId();
  const panelId = useId();
  return (
    <S.Item>
      <S.Trigger
        type="button"
        id={headingId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <S.TriggerLabel>{question}</S.TriggerLabel>
        <S.TriggerIcon aria-hidden="true">{open ? '–' : '+'}</S.TriggerIcon>
      </S.Trigger>
      <S.Body id={panelId} role="region" aria-labelledby={headingId} $open={open}>
        <S.BodyClip>
          <S.BodyInner>{children}</S.BodyInner>
        </S.BodyClip>
      </S.Body>
    </S.Item>
  );
};

interface AccordionProps {
  children: ReactNode;
}

export const Accordion = ({ children }: AccordionProps) => <S.Root>{children}</S.Root>;
