'use client';

import { useEffect } from 'react';

/**
 * Freeze page scrolling while an overlay is open, and restore the exact
 * scroll position when the last overlay closes.
 *
 * ── Why not `body { overflow: hidden }` ──────────────────────────────────
 * That is what `useDialog` used to do, and it is a **no-op in this app**.
 * Overflow set on `body` only reaches the viewport by CSS Overflow L3's
 * "viewport propagation" rule, which applies solely when the root element's
 * overflow is `visible` in both axes. `GlobalStyles` sets
 * `html { overflow-x: clip }` (to kill horizontal page scroll), so propagation
 * never happens and the page keeps scrolling behind every modal.
 *
 * Measured on the shipping build, with a trusted CDP key event and a control:
 *
 *   no overlay                      scrollY 200 -> 975   (probe scrolls)
 *   modal open, body overflow:hidden        200 -> 1003  (NOT locked)
 *   same + html overflow:hidden             200 -> 200   (locked — control)
 *
 * The control is what makes it conclusive: PageDown *is* blocked by a real
 * lock, so the middle row is the page genuinely moving behind an open modal.
 *
 * ── The technique ───────────────────────────────────────────────────────
 * Capture `scrollY`, pin `body` with `position: fixed; top: -Ypx`, and restore
 * on release. This does not depend on propagation at all, so it is correct
 * regardless of the root's overflow, and it also stops iOS rubber-banding.
 *
 * Ref-counted at module scope: nested overlays (an AlertDialog opened from
 * inside an already-open CourseShell panel) must not each restore
 * independently, or the inner one's cleanup would unlock while the outer is
 * still open and scroll would jump.
 *
 * Note `position: fixed` on body does NOT create a containing block for
 * `position: fixed` descendants — only transform/filter/perspective/contain/
 * will-change do — so portalled modals keep their viewport anchoring.
 */

let lockCount = 0;
let savedScrollY = 0;
let savedBody: Partial<CSSStyleDeclaration> = {};

const applyLock = (): void => {
  savedScrollY = window.scrollY;
  const s = document.body.style;
  savedBody = { position: s.position, top: s.top, left: s.left, right: s.right, width: s.width };
  s.position = 'fixed';
  s.top = `-${savedScrollY}px`;
  s.left = '0';
  s.right = '0';
  s.width = '100%';
};

const releaseLock = (): void => {
  const s = document.body.style;
  s.position = savedBody.position ?? '';
  s.top = savedBody.top ?? '';
  s.left = savedBody.left ?? '';
  s.right = savedBody.right ?? '';
  s.width = savedBody.width ?? '';
  // Clamp: an orientation change or a content change while locked can leave
  // the saved offset past the new end of the document, which would restore to
  // a blank region.
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - document.documentElement.clientHeight,
  );
  window.scrollTo(0, Math.min(savedScrollY, maxScroll));
};

/**
 * @param active Whether this consumer currently wants the page locked.
 */
export const useScrollLock = (active: boolean): void => {
  useEffect(() => {
    if (!active) return;
    lockCount += 1;
    if (lockCount === 1) applyLock();
    return () => {
      lockCount -= 1;
      if (lockCount === 0) releaseLock();
    };
  }, [active]);
};
