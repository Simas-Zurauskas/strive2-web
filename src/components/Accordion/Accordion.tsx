'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import * as S from './Accordion.styles';

interface AccordionItemProps {
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem = ({ question, children, defaultOpen = false }: AccordionItemProps) => {
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
        $open={open}
      >
        <S.TriggerLabel>{question}</S.TriggerLabel>
        <S.TriggerIcon $open={open} aria-hidden="true">
          <ChevronDown size={18} />
        </S.TriggerIcon>
      </S.Trigger>
      <S.Body id={panelId} role="region" aria-labelledby={headingId} $open={open}>
        {children}
      </S.Body>
    </S.Item>
  );
};

interface AccordionProps {
  children: React.ReactNode;
}

export const Accordion = ({ children }: AccordionProps) => <div>{children}</div>;
