'use client';

import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/Button';
import { useDialog } from '@/hooks';
import { markConceptViewed } from '@/hooks/useConceptViewed';
import { registerConceptModalListener } from '@/lib/conceptModalBus';
import * as S from './ConceptModal.styles';
import { CONCEPTS, type ConceptId } from './registry';

const renderInlineBold = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );

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

  // Focus trap + scroll lock + Esc + return-focus, all in one hook.
  // Capture-and-restore on overflow (M10) is now handled inside useDialog.
  const dialogRef = useDialog<HTMLDivElement>({ open: !!activeId, onClose: close });

  if (!activeId) return null;

  const concept = CONCEPTS[activeId];
  const Animation = concept.animation;

  return createPortal(
    <>
      <S.Backdrop onClick={close} />
      <S.Dialog
        ref={dialogRef}
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
              <S.Paragraph key={i}>{renderInlineBold(p)}</S.Paragraph>
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
