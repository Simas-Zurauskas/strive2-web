'use client';

import { useEffect } from 'react';
import { useVisualViewport } from '@/hooks/useVisualViewport';

/**
 * Publishes live visual-viewport geometry as CSS custom properties on
 * <html>, so plain styled-components rules can react to the software
 * keyboard without any of them subscribing to React state:
 *
 *   --keyboard-inset          px of the layout viewport the keyboard covers
 *   --visual-viewport-height  px of viewport the user can actually see
 *
 * Both have static defaults in GlobalStyles (`0px` / `100dvh`), so SSR,
 * no-JS, and browsers without window.visualViewport all render correctly;
 * this component only ever refines the value.
 *
 * Mounted once in Registry. It returns null, so the per-frame updates
 * during the keyboard animation re-render this component alone and never
 * the app tree.
 */
export const ViewportInsetBootstrap = () => {
  const { inset, viewportHeight } = useVisualViewport();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--keyboard-inset', `${inset}px`);
    // 0 is the pre-measurement sentinel — leave the GlobalStyles default
    // (100dvh) in place rather than collapsing every shell to zero height.
    if (viewportHeight > 0) {
      root.style.setProperty('--visual-viewport-height', `${viewportHeight}px`);
    }
  }, [inset, viewportHeight]);

  // Separate effect so the properties are removed only on unmount, not on
  // every value change.
  useEffect(
    () => () => {
      const root = document.documentElement;
      root.style.removeProperty('--keyboard-inset');
      root.style.removeProperty('--visual-viewport-height');
    },
    [],
  );

  return null;
};
