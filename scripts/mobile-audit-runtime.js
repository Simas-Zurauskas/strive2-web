/**
 * Browser-injectable mobile audit probe for 012-mobile-ecp.
 *
 * Paste as the `function` argument of a Chrome DevTools MCP
 * `evaluate_script` call, with the page emulated as e.g.
 *   viewport: "390x844x3,mobile,touch"
 *
 * Returns a single JSON object; the numbers in it are the evidence pasted
 * into PROGRESS.md rows. Never edit this file to make a number look good —
 * change the app, re-run, paste the new number.
 */
() => {
  const vw = document.documentElement.clientWidth;
  const out = { path: location.pathname, vw, vh: document.documentElement.clientHeight };

  out.mq = {
    hoverNone: matchMedia('(hover: none)').matches,
    pointerCoarse: matchMedia('(pointer: coarse)').matches,
  };

  // ── R1: hover rules that apply on a hover-incapable device ──────────
  let hoverTotal = 0;
  let hoverGuarded = 0;
  let activeRules = 0;
  let focusVisibleRules = 0;
  let totalRules = 0;
  const unguardedSel = [];
  const walk = (list, guarded) => {
    for (const r of list) {
      // NB: in Chrome a CSSStyleRule also exposes an (empty) .cssRules for
      // nested CSS — test selectorText/conditionText BEFORE recursing, or
      // every style rule is skipped and the counts silently read zero.
      if (r.conditionText !== undefined || r.media) {
        const t = r.conditionText || (r.media && r.media.mediaText) || '';
        walk(r.cssRules || [], guarded || /hover\s*:\s*hover/.test(t));
        continue;
      }
      if (r.selectorText) {
        totalRules++;
        if (r.selectorText.includes(':active')) activeRules++;
        if (r.selectorText.includes(':focus-visible')) focusVisibleRules++;
        if (r.selectorText.includes(':hover')) {
          hoverTotal++;
          if (guarded) hoverGuarded++;
          else unguardedSel.push(r.selectorText.slice(0, 80));
        }
      }
      if (r.cssRules && r.cssRules.length) walk(r.cssRules, guarded);
    }
  };
  for (const ss of document.styleSheets) {
    try {
      walk(ss.cssRules, false);
    } catch (e) {
      /* cross-origin sheet — skip */
    }
  }
  out.rules = { total: totalRules, active: activeRules, focusVisible: focusVisibleRules };
  // `unguardedNonAllowlisted` is the gate field. A bare `unguarded === 0` is
  // unsatisfiable: `thinScrollbar`'s `::-webkit-scrollbar-thumb:hover` is
  // deliberately allowlisted (scrollbars don't exist on touch) and is consumed
  // at 16 sites, so it mounts on almost every route.
  const HOVER_ALLOW = [/::-webkit-scrollbar/, /\[data-sonner-/];
  const stillBad = unguardedSel.filter((s) => !HOVER_ALLOW.some((re) => re.test(s)));
  out.hover = {
    total: hoverTotal,
    unguarded: hoverTotal - hoverGuarded,
    unguardedNonAllowlisted: stillBad.length,
    sample: stillBad.slice(0, 20),
  };

  // ── R2: horizontal overflow ─────────────────────────────────────────
  const over = [];
  document.querySelectorAll('*').forEach((el) => {
    if (el.closest('[aria-hidden="true"]')) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.right > vw + 1) {
      over.push({ tag: el.tagName, cls: String(el.className || '').slice(0, 55), right: Math.round(r.right) });
    }
  });
  out.overflow = { scrollW: document.documentElement.scrollWidth, clientW: vw, count: over.length, sample: over.slice(0, 8) };

  // ── R3: tap targets ─────────────────────────────────────────────────
  const SEL = 'a[href],button,input,select,textarea,[role="button"]';
  const small = [];
  document.querySelectorAll(SEL).forEach((el) => {
    if (el.closest('[aria-hidden="true"]')) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.width < 44 || r.height < 44) {
      small.push({
        t: el.tagName,
        l: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 28),
        w: +r.width.toFixed(0),
        h: +r.height.toFixed(0),
        c: String(el.className || '').split(' ')[0].slice(0, 45),
      });
    }
  });
  // Full list, not count + sample(30). The baseline on `/` is already 25, so a
  // 30-cap truncates the first authed route and makes "record the exact
  // remaining list" impossible — and `under44 ⊆ allowlist` is not a predicate
  // you can evaluate against an integer.
  out.tapTargets = { count: small.length, list: small };

  // ── R4: tap-highlight inheritance ───────────────────────────────────
  const TRANSPARENT = /rgba\(0,\s*0,\s*0,\s*0\)|transparent/;
  out.tapHighlight = { root: getComputedStyle(document.documentElement).webkitTapHighlightColor };
  const leaks = [];
  document.querySelectorAll('[role="button"],label,summary,[tabindex],a,button').forEach((el) => {
    const v = getComputedStyle(el).webkitTapHighlightColor;
    if (v && !TRANSPARENT.test(v)) leaks.push({ tag: el.tagName, role: el.getAttribute('role'), v });
  });
  out.tapHighlight.leakCount = leaks.length;
  out.tapHighlight.sample = leaks.slice(0, 10);

  // ── R5: fixed surfaces — ADVISORY ONLY, NOT A GATE ──────────────────
  // Under Chrome emulation `env(safe-area-inset-*)` resolves to 0px, so this
  // cannot distinguish `padding-bottom: max(1rem, var(--safe-area-bottom))`
  // from a plain `padding-bottom: 1rem` — any surface that already had bottom
  // padding passes with zero safe-area work done. It also never sees the
  // left/right insets that matter in landscape. Safe-area coverage is asserted
  // by the STATIC rule R4 in scripts/mobile-audit.mjs. This field is kept only
  // to surface bottom-anchored surfaces with no padding at all.
  const fixedNoSafeArea = [];
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const touchesBottom = Math.abs(r.bottom - window.innerHeight) < 2;
    if (touchesBottom && parseFloat(cs.paddingBottom) === 0) {
      fixedNoSafeArea.push({ tag: el.tagName, cls: String(el.className || '').split(' ')[0].slice(0, 45) });
    }
  });
  out.bottomFixedWithoutPadding = fixedNoSafeArea;

  // ── R6: horizontal scrollers without overscroll containment ─────────
  const chainers = [];
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    if (!/auto|scroll/.test(cs.overflowX)) return;
    if (el.scrollWidth <= el.clientWidth) return;
    if (!/contain|none/.test(cs.overscrollBehaviorX)) {
      chainers.push({ tag: el.tagName, cls: String(el.className || '').split(' ')[0].slice(0, 45), obx: cs.overscrollBehaviorX });
    }
  });
  out.overscrollChainers = chainers;

  return out;
};
