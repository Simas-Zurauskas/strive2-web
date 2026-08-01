#!/usr/bin/env node
/**
 * Mobile-quality static audit — the regression gate for 012-mobile-ecp.
 *
 *   yarn check:mobile            report violations, exit 1 if any
 *   yarn check:mobile --json     machine-readable output
 *
 * Rules
 *   R1  no-unguarded-hover            `:hover` outside a hover-capability guard
 *       R1a simple        `&:hover { … }`
 *       R1b combined      `&:hover, &:focus { … }`  (must be SPLIT, never blind-wrapped)
 *       R1c interpolated  `${Wrap}:hover & { … }`
 *   R2  no-raw-vh                     `100vh` sizing without a `dvh` companion
 *   R3  no-static-touch-action-none   `touch-action: none` in a static stylesheet
 *   R4  fixed-surface-needs-safe-area  fixed + edge-anchored without `--safe-area-*`
 *
 * Allowlist: scripts/mobile-audit.allow.json. Every entry needs a `reason`.
 *
 * ── The bug this file exists to not repeat ──────────────────────────────
 * A `${…}` interpolation contains literal `{` and `}`. A naive brace-depth
 * tracker consumes those as CSS braces, so a `${media.hover}` guard frame is
 * pushed and popped by the interpolation's own delimiters before the CSS block
 * it guards ever opens — every guard silently becomes a no-op and the rule
 * degenerates into `grep -c ':hover'`. Interpolations are therefore consumed
 * atomically, before any brace bookkeeping. See the R1 scanner below.
 */
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const JSON_OUT = process.argv.includes('--json');

const ALLOW_PATH = join(HERE, 'mobile-audit.allow.json');
const allow = existsSync(ALLOW_PATH) ? JSON.parse(readFileSync(ALLOW_PATH, 'utf8')) : {};

const files = execSync(`find src -name '*.ts' -o -name '*.tsx'`, { cwd: ROOT, encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean)
  .sort();

/** Blank out comments so prose never counts as code. Newlines are preserved
 *  so reported line numbers stay accurate.
 *
 *  - Block comments: the /* … *\/ form, used by both JS and CSS.
 *  - Line comments: only when the trimmed line STARTS with `//`. Stripping
 *    every `//` would corrupt CSS values such as `url(https://…)`; a
 *    line-initial `//` is unambiguously a JS comment.
 *
 *  Without the line-comment pass, a doc comment that merely *mentions*
 *  `:hover` or `media.hover` is scanned as source — which is exactly what the
 *  Phase 4 mixin documentation in theme.ts tripped. */
const stripComments = (src) => {
  const noBlocks = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  return noBlocks
    .split('\n')
    .map((l) => (l.trimStart().startsWith('//') ? ' '.repeat(l.length) : l))
    .join('\n');
};

const isAllowed = (rule, file, line) =>
  (allow[rule] || []).some(
    (e) => file.endsWith(e.file) && (!e.match || line.includes(e.match)),
  );

const violations = { R1a: [], R1b: [], R1c: [], R2: [], R3: [], R4: [] };
const push = (rule, file, lineNo, text) => {
  const bucket = rule.startsWith('R1') ? 'R1' : rule;
  if (isAllowed(bucket, file, text)) return;
  violations[rule].push({ file, line: lineNo, text: text.trim().slice(0, 110) });
};

for (const file of files) {
  const raw = readFileSync(join(ROOT, file), 'utf8');
  const src = stripComments(raw);
  const lines = src.split('\n');
  const rawLines = raw.split('\n');
  const lineAt = (n) => (rawLines[n - 1] || '').trim();

  // ── R1 ────────────────────────────────────────────────────────────────
  // Brace-depth stack; a frame is guarded if it or any ancestor was opened
  // by a `media.hover` interpolation or a literal `@media (hover: hover)`.
  {
    const stack = [{ guarded: false }];
    let pendingGuard = false;
    let line = 1;

    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      if (ch === '\n') {
        line++;
        continue;
      }

      // Consume a whole `${ … }` interpolation as ONE token. See header note.
      if (ch === '$' && src[i + 1] === '{') {
        let depth = 0;
        let j = i + 1;
        for (; j < src.length; j++) {
          if (src[j] === '{') depth++;
          else if (src[j] === '}') {
            depth--;
            if (depth === 0) break;
          } else if (src[j] === '\n') line++;
        }
        if (/media\.hover/.test(src.slice(i, j + 1))) pendingGuard = true;
        // `${Wrap}:hover &` — parent-driven hover, wrap the whole rule.
        if (src.slice(j + 1, j + 7) === ':hover') {
          if (!stack[stack.length - 1].guarded) push('R1c', file, line, lineAt(line));
          i = j + 6;
          continue;
        }
        i = j;
        continue;
      }

      if (ch === '@' && /^@media\s*\(\s*hover:\s*hover/.test(src.slice(i, i + 40))) {
        pendingGuard = true;
      }

      if (ch === '{') {
        stack.push({ guarded: stack[stack.length - 1].guarded || pendingGuard });
        pendingGuard = false;
        continue;
      }
      if (ch === '}') {
        if (stack.length > 1) stack.pop();
        continue;
      }

      if (ch === ':' && src.startsWith(':hover', i)) {
        if (!stack[stack.length - 1].guarded) {
          // R1b: the same selector LIST also carries :focus / :focus-within.
          // Blind-wrapping these kills the focus style on touch, so they are
          // reported separately and must be split by hand.
          //
          // The list is read from the end of the previous declaration (`;`,
          // `{` or `}`) up to this rule's opening `{` — NOT just the current
          // line. A list like
          //     &:hover::before,
          //     &:has(:focus-visible)::before {
          // spans two lines, and a single-line test misses it: that is exactly
          // how P35Weighted.styles.ts:139 was first misfiled as R1a.
          const openIdx = src.indexOf('{', i);
          const selStart = Math.max(
            src.lastIndexOf(';', i),
            src.lastIndexOf('{', i - 1),
            src.lastIndexOf('}', i),
          );
          const selectorList = openIdx === -1 ? '' : src.slice(selStart + 1, openIdx);
          if (/:focus/.test(selectorList)) push('R1b', file, line, lineAt(line));
          else push('R1a', file, line, lineAt(line));
        }
        i += 5;
      }
    }
  }

  // ── R2 ────────────────────────────────────────────────────────────────
  // `100vh` in a height-ish declaration needs a `dvh` companion declaring the
  // same property, on an adjacent line (the Hero11Route.styles.ts pattern).
  lines.forEach((text, idx) => {
    if (!/\b100vh\b/.test(text)) return;
    const prop = text.match(/(min-height|max-height|height|minHeight|maxHeight)/);
    if (!prop) return;
    // Window is deliberately wide: the house pattern puts the `dvh` companion
    // on the next line, but an explanatory comment routinely sits between the
    // two (Hero11Route.styles.ts:31-34 has a 2-line comment). Comments are
    // already blanked by stripBlockComments, so a wide window costs nothing.
    const near = lines.slice(Math.max(0, idx - 3), idx + 7).join('\n');
    if (new RegExp(`${prop[1]}[^\\n]*dvh`).test(near)) return;
    push('R2', file, idx + 1, lineAt(idx + 1));
  });

  // ── R3 ────────────────────────────────────────────────────────────────
  lines.forEach((text, idx) => {
    if (/touch-action\s*:\s*none/.test(text)) push('R3', file, idx + 1, lineAt(idx + 1));
  });

  // ── R4 ────────────────────────────────────────────────────────────────
  // Per tagged-template block: `position: fixed` + an edge anchor must be
  // accompanied by a `--safe-area-*` reference somewhere in the same template.
  // Static by necessity: under emulation `env(safe-area-inset-*)` resolves to
  // 0px, so no runtime probe can tell `max(1rem, var(--safe-area-bottom))`
  // from a plain `1rem`.
  for (const tpl of tagged(src)) {
    if (!/position:\s*fixed/.test(tpl.body)) continue;
    if (!/(^|\n)\s*(bottom|top|left|right)\s*:/.test(tpl.body)) continue;
    if (/--safe-area-/.test(tpl.body)) continue;
    push('R4', file, tpl.line, lineAt(tpl.line));
  }
}

/** Extract tagged template literals (styled.x`…`, styled(X)`…`, css`…`,
 *  createGlobalStyle`…`) with their start line, handling nested `${}` and
 *  escaped backticks. */
function tagged(src) {
  const out = [];
  const re = /(styled\.[A-Za-z0-9_]+|styled\([^)]*\)|css|createGlobalStyle|keyframes)\s*`/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const start = re.lastIndex;
    let i = start;
    let depth = 0;
    for (; i < src.length; i++) {
      const c = src[i];
      if (c === '\\') {
        i++;
        continue;
      }
      if (c === '$' && src[i + 1] === '{') {
        depth++;
        i++;
        continue;
      }
      if (c === '}' && depth > 0) {
        depth--;
        continue;
      }
      if (c === '`' && depth === 0) break;
    }
    out.push({
      body: src.slice(start, i),
      line: src.slice(0, m.index).split('\n').length,
    });
    re.lastIndex = i + 1;
  }
  return out;
}

// ── Report ──────────────────────────────────────────────────────────────
const LABEL = {
  R1a: 'R1a no-unguarded-hover / simple      `&:hover { … }`',
  R1b: 'R1b no-unguarded-hover / combined    `&:hover, &:focus` — SPLIT BY HAND',
  R1c: 'R1c no-unguarded-hover / interpolated `${X}:hover &`',
  R2: 'R2  no-raw-vh                        `100vh` without a `dvh` companion',
  R3: 'R3  no-static-touch-action-none      `touch-action: none` in a stylesheet',
  R4: 'R4  fixed-surface-needs-safe-area    fixed + edge anchor, no `--safe-area-*`',
};

const total = Object.values(violations).reduce((n, v) => n + v.length, 0);

if (JSON_OUT) {
  console.log(JSON.stringify({ total, violations }, null, 2));
} else {
  for (const [rule, list] of Object.entries(violations)) {
    const filesTouched = new Set(list.map((v) => v.file)).size;
    console.log(`\n##### ${LABEL[rule]}`);
    console.log(`      ${list.length} violation(s) across ${filesTouched} file(s)`);
    const byFile = new Map();
    for (const v of list) {
      if (!byFile.has(v.file)) byFile.set(v.file, []);
      byFile.get(v.file).push(v);
    }
    for (const [f, hits] of [...byFile.entries()].sort((a, b) => b[1].length - a[1].length)) {
      console.log(`  ${relative('src', f) === f ? f : f}  (${hits.length})`);
      for (const h of hits) console.log(`      ${h.line}: ${h.text}`);
    }
  }
  const allowCount = Object.values(allow).reduce((n, v) => n + v.length, 0);
  console.log(`\n=== TOTAL ${total} violation(s); ${allowCount} allowlisted ===`);
}

process.exit(total === 0 ? 0 : 1);
