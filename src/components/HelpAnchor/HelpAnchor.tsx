'use client';

import { useReducedMotion } from 'framer-motion';
import { CONCEPTS, type ConceptId } from '@/components/ConceptsModal/registry';
import { useConceptViewed } from '@/hooks/useConceptViewed';
import { openConceptModal } from '@/lib/conceptModalBus';
import * as S from './HelpAnchor.styles';

interface HelpAnchorProps {
  concept: ConceptId;
  /**
   * `inline` — anchor sits in normal flow next to the term it explains.
   * `floating` — caller positions an absolutely-positioned wrapper (e.g. over
   * a hero animation). Defaults to inline.
   */
  variant?: 'inline' | 'floating';
  /** 18 px (`sm`) for tight rows; 22 px (`md`) elsewhere. Default `md`. */
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Small "?" button. Pulses softly and continuously while the concept is
 * unviewed (skipped under `prefers-reduced-motion`). The pulse only stops
 * when the user opens the modal and dismisses it (any close path —
 * "Got it" / Escape / backdrop click — flips the viewed flag).
 *
 * Hover/focus do NOT stop the pulse: if the user mouses past the anchor
 * without engaging, we want it to keep inviting them. The pulse is the
 * teaching layer; not pulsing == we already taught it.
 */
export const HelpAnchor = ({
  concept,
  variant = 'inline',
  size = 'md',
  className,
}: HelpAnchorProps) => {
  const [viewed] = useConceptViewed(concept);
  const prefersReduced = useReducedMotion() ?? false;
  const pulsing = !viewed && !prefersReduced;

  const entry = CONCEPTS[concept];

  return (
    <S.Wrap $variant={variant} className={className}>
      <S.Ring $active={pulsing} />
      <S.Button
        type="button"
        $active={pulsing}
        $size={size}
        aria-label={`Learn about ${entry.title}`}
        onClick={() => openConceptModal(concept)}
      >
        ?
      </S.Button>
    </S.Wrap>
  );
};
