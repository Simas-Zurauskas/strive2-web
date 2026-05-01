import styled from 'styled-components';

/**
 * Hand-off button styling — intentionally distinct from the muted
 * tool-badge row: this is a CTA, not a status indicator. Sits below the
 * assistant bubble in the same vertical flow but reads as an action
 * the learner can take.
 *
 * Visual hierarchy: surface background + accent-tinted border so it
 * pops vs the bubble while still feeling like part of the message
 * (not a floating modal-level CTA).
 */

export const HandoffButton = styled.button`
  /* Reset button defaults so we can compose freely. */
  all: unset;
  box-sizing: border-box;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.875rem;
  align-self: flex-start;

  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.3;

  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.1s ease;

  &:hover {
    /* Subtle accent-tinted background on hover. accentMuted is the
       already-defined low-alpha accent overlay used elsewhere for
       hover/selected affordances; reusing it keeps the visual
       language consistent with the rest of the app. */
    background: ${(p) => p.theme.colors.accentMuted};
    border-color: ${(p) => p.theme.colors.accent};
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const HandoffLabel = styled.span`
  /* Cap label width on narrow viewports — server-side label is
     ≤50 chars but a long word can still overflow on phones. */
  max-width: 18rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
