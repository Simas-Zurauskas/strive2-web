// Module-level bus for opening the ConceptModal singleton from anywhere
// (HelpAnchor instances, in particular). Mirrors creditModalBus's shape.
//
// Why not React Context: the same anchor lives at many depths across the
// app, including server-component-rendered surfaces that hand off to
// 'use client' children. A bus avoids forcing every parent layout to
// expose a provider.

import type { ConceptId } from '@/components/ConceptsModal/registry';

type Listener = (id: ConceptId) => void;

let currentListener: Listener | null = null;

export const registerConceptModalListener = (listener: Listener): (() => void) => {
  currentListener = listener;
  return () => {
    if (currentListener === listener) currentListener = null;
  };
};

export const openConceptModal = (id: ConceptId): void => {
  currentListener?.(id);
};
