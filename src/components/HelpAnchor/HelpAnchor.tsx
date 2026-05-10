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
 * unviewed, with a periodic horizontal "wiggle" — a quick damped shake
 * (≈ 320 ms) every 4 s — to draw the eye without disturbing the text
 * baseline. The pulse only stops when the user opens the modal and
 * dismisses it (any close path flips the viewed flag). Both motion layers
 * are suppressed under `prefers-reduced-motion`.
 *
 * Why a horizontal wiggle, not a vertical bounce: this anchor sits inline
 * inside text rows (eyebrows, captions, sentences). A vertical hop reads as
 * the icon "jumping out of the line" and makes line-height look unstable.
 * A short horizontal shake stays on the baseline and reads instantly as
 * "calling attention" — same pattern Linear / Stripe / Apple use for inline
 * hint elements.
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
    <S.Wrap $variant={variant} $active={pulsing} className={className}>
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
