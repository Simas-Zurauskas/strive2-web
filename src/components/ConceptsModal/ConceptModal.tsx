'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/Button';
import { markConceptViewed } from '@/hooks/useConceptViewed';
import { registerConceptModalListener } from '@/lib/conceptModalBus';
import * as S from './ConceptModal.styles';
import { CONCEPTS, type ConceptId } from './registry';

/**
 * Singleton ConceptModal — mounted once at the app root and opened via the
 * `conceptModalBus`. Each `<HelpAnchor>` calls `openConceptModal(id)` on
 * click; this component subscribes once and renders the matching entry from
 * the registry.
 *
 * On any close path (backdrop / Escape / "Got it") the per-concept "viewed"
 * flag is written, broadcast via the `useConceptViewed` event, and every
 * other anchor on the page stops pulsing.
 */
export const ConceptModal = () => {
  const [activeId, setActiveId] = useState<ConceptId | null>(null);

  useEffect(() => {
    return registerConceptModalListener((id) => setActiveId(id));
  }, []);

  const close = useCallback(() => {
    if (activeId) markConceptViewed(activeId);
    setActiveId(null);
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeId, close]);

  if (!activeId) return null;

  const concept = CONCEPTS[activeId];
  const Animation = concept.animation;

  return createPortal(
    <>
      <S.Backdrop onClick={close} />
      <S.Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby={`concept-title-${concept.id}`}
        aria-describedby={`concept-body-${concept.id}`}
      >
        <S.CloseBtn onClick={close} aria-label="Close">
          <X size={14} aria-hidden="true" />
        </S.CloseBtn>

        <S.AnimationSlot>{Animation ? <Animation /> : null}</S.AnimationSlot>

        <S.Content>
          <S.Eyebrow>{concept.eyebrow}</S.Eyebrow>
          <S.Title id={`concept-title-${concept.id}`}>{concept.title}</S.Title>
          <S.Body id={`concept-body-${concept.id}`}>
            {concept.body.map((p, i) => (
              <S.Paragraph key={i}>{p}</S.Paragraph>
            ))}
          </S.Body>
        </S.Content>

        <S.Footer>
          <Button onClick={close}>Got it</Button>
        </S.Footer>
      </S.Dialog>
    </>,
    document.body,
  );
};
