'use client';

import { useInView } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { easeOutSpring, useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import * as S from './SourcesSection.styles';
import { SOURCES_SECTION } from '../../constants';
import type { FileKind } from './SourcesSection.styles';

/**
 * "Bring your own material" — the second creation path, and the landing
 * spot for the documents announcement email's CTA
 * (`/?source=documents-email`).
 *
 * The section makes exactly one point: the material you already have
 * becomes a course. It makes it as a picture, not as prose — a pile of
 * files on one side, a seam, an outline on the other, and three flecks
 * that cross from one to the other while the lesson rows draw themselves
 * in. Formats, per-course caps, the pre-generation analysis, fidelity
 * levels and the privacy position all used to live here as running copy;
 * they are covered in the landing FAQ, the help centre and the blog, and
 * an earlier version of this section proved that repeating them here just
 * buries the idea. Three lines of copy is the design, not an oversight.
 *
 * WHY THE FILES ARE DRAWN AS FILES. The first version of this pile was
 * four landscape cards of ruled lines, and it read as "notes" or "cards" —
 * a viewer had to get to the filename to learn they were looking at
 * uploads. Each one is now the thing it actually is, in the vocabulary
 * every desktop already taught: a portrait page with a folded corner, a
 * thumbnail of its own contents, and a solid format band bottom-left. The
 * four cover the four shapes of material the product takes — a text
 * document, an office document, an image, a recording — and the link is
 * deliberately NOT drawn as a page, because it isn't one; it is drawn as a
 * browser window, which is the one picture of "a web page" that needs no
 * caption.
 *
 * NO FILENAMES. An earlier round set each page under its own name, on the
 * desktop-icon pattern. The format band already says what the thing is,
 * the names added a second text layer to a composition that is otherwise
 * wordless, and they were the only elements in it that could collide with
 * a neighbour. The bands do the recognising alone.
 *
 * WHAT IS BIGGEST IS THE ARGUMENT. The section's sentence is "material in,
 * course out", so the OUTLINE is the largest object on the plate and the
 * pile is a supporting cluster. One round had that backwards — the files
 * were the hero and the course a footnote beside them, which argued the
 * reverse of the copy. `Outline` now sets the height of the whole band;
 * see its note and `Inner` in the styles.
 *
 * CLAIMS DISCIPLINE for the mock. It is static, prop-less and stateless,
 * in the manner of `FeatureBento/FeatureTile.tsx`'s visual registry, and
 * `From your documents` is verbatim from `components/SourceProvenanceBadge`
 * — the product's own per-lesson provenance pill.
 * The four formats are real members of `SOURCE_DOCUMENT_EXTENSIONS`
 * (FileDropzone), so the pile cannot promise an upload the product would
 * reject. Module titles are illustrative — the same latitude the bento
 * mocks take — and the link uses an RFC 2606 reserved example domain so it
 * cannot read as a claim about a real site. Body text inside the pages is
 * ruled lines rather than words: nothing in the composition is meant to be
 * read, only recognised. Nothing here states a generation time, an outcome
 * or an efficacy figure.
 *
 * REDUCED MOTION. The picture is the argument, so it has to survive with
 * the motion switched off: every element then renders at its resting
 * position with an opacity fade only, the bloom and the three sparks stay
 * mounted but never leave `opacity: 0`, and the lesson rows start at full
 * width instead of drawing themselves. What is lost is the sense of
 * travel, not the idea.
 */

/* ── The page silhouette ───────────────────────────────────
   One 100×132 viewBox shared by all four thumbnails, so the pages stack
   like pages instead of like four different rectangles.

   The outline runs anticlockwise from the start of the cut and lets `Z`
   draw the diagonal back up to it. `FOLD` is left open on purpose: SVG
   closes an open path along that same diagonal to fill it — which is
   exactly the dog-ear triangle — but never strokes the closing segment,
   so the fold's two legs are drawn and the cut is not drawn twice. */
const PAGE = 'M72 1 H7 A6 6 0 0 0 1 7 V125 A6 6 0 0 0 7 131 H93 A6 6 0 0 0 99 125 V28 Z';
const FOLD = 'M72 1 V22 A6 6 0 0 0 78 28 H99';

/** Waveform for the recording. Centred on y=66, tallest bar 54 tall. */
const WAVE = [14, 26, 40, 22, 52, 34, 54, 26, 44, 18, 30];

/** Format band geometry — one row, widened for the four-letter label. */
const BAND_Y = 103;
const BAND_H = 18;

const FILES: {
  kind: FileKind;
  /** Extension shown on the band. A real `SOURCE_DOCUMENT_EXTENSIONS` member. */
  format: string;
  bandW: number;
  slot: 0 | 1 | 2 | 3;
  rot: number;
}[] = [
  { kind: 'pdf', format: 'PDF', bandW: 36, slot: 0, rot: -5 },
  { kind: 'doc', format: 'DOCX', bandW: 44, slot: 1, rot: 4 },
  { kind: 'image', format: 'PNG', bandW: 36, slot: 2, rot: -3 },
  { kind: 'audio', format: 'MP3', bandW: 36, slot: 3, rot: 5 },
];

/**
 * What each page shows above its format band. A text document is ruled
 * lines under a grey heading; an office document is the same page with its
 * heading in the format's own colour; an image is a picture; a recording
 * is a waveform. The last two are what stop the pile reading as "four
 * documents".
 */
const artFor = (kind: FileKind) => {
  switch (kind) {
    case 'pdf':
      return (
        <>
          <rect className="head" x="12" y="40" width="46" height="7" rx="3.5" />
          <rect className="rule" x="12" y="57" width="76" height="5" rx="2.5" />
          <rect className="rule" x="12" y="68" width="68" height="5" rx="2.5" />
          <rect className="rule" x="12" y="79" width="76" height="5" rx="2.5" />
          <rect className="rule" x="12" y="90" width="50" height="5" rx="2.5" />
        </>
      );
    case 'doc':
      return (
        <>
          <rect className="headTint" x="12" y="40" width="52" height="7" rx="3.5" />
          <rect className="rule" x="12" y="57" width="76" height="5" rx="2.5" />
          <rect className="rule" x="12" y="68" width="76" height="5" rx="2.5" />
          <rect className="rule" x="12" y="79" width="58" height="5" rx="2.5" />
        </>
      );
    case 'image':
      return (
        <>
          {/* The clip keeps the hills inside the well's rounded corners.
              The id is unique because `kind` is unique within FILES, and
              the section mounts once per page. */}
          <clipPath id="sources-image-well">
            <rect x="12" y="38" width="76" height="57" rx="6" />
          </clipPath>
          <rect className="well" x="12" y="38" width="76" height="57" rx="6" />
          <g clipPath="url(#sources-image-well)">
            <circle className="sun" cx="32" cy="55" r="7" />
            <path className="hill" d="M12 95 L36 62 L52 82 L64 70 L88 95 Z" />
          </g>
        </>
      );
    case 'audio':
      return (
        <>
          {WAVE.map((h, i) => (
            <rect
              key={i}
              className="bar"
              x={12 + i * 7.2}
              y={66 - h / 2}
              width="4"
              height={h}
              rx="2"
            />
          ))}
        </>
      );
  }
};

const OUTLINE: {
  module: string;
  rows: { w: number; sourced?: boolean; d: number }[];
}[] = [
  {
    module: 'Module 1 — Foundations',
    rows: [
      { w: 42, sourced: true, d: 0.9 },
      { w: 74, d: 0.98 },
      { w: 58, d: 1.06 },
    ],
  },
  {
    module: 'Module 2 — In practice',
    rows: [
      { w: 66, d: 1.14 },
      { w: 52, sourced: true, d: 1.22 },
      { w: 71, d: 1.3 },
    ],
  },
];

/**
 * Flecks of material crossing the seam. Both the spark's width and its
 * travel are expressed in percentages — the width against the stage, the
 * translate against the spark's own width (framer's `x: '%'` semantics) —
 * so the journey lands in the same place at 1024px as at 1600px without a
 * measured container. `dx` is therefore "how many of my own widths", i.e.
 * 4.5% × 840% ≈ 38% of the stage.
 */
const SPARKS: { left: string; top: string; w: number; dx: number; dy: number; d: number }[] = [
  { left: '30%', top: '22%', w: 4.5, dx: 840, dy: 66, d: 0.3 },
  { left: '25%', top: '54%', w: 3.6, dx: 1180, dy: -14, d: 0.42 },
  { left: '33%', top: '76%', w: 4, dx: 870, dy: -30, d: 0.54 },
];

/**
 * The sparks get their own curve rather than `easeOutSpring`. A spring
 * decelerates so hard that the whole crossing is over in the first third
 * of its duration — the flight has to be readable, not snappy — and the
 * four-stop opacity ramp needs explicit `times` so the fade-out lands on
 * arrival instead of a third of the way across.
 */
const SPARK_EASE = [0.33, 0, 0.2, 1] as const;
const SPARK_DURATION = 0.8;
const SPARK_FADE = [0, 0.16, 0.72, 1];

/** House `*word*` convention → the one italic-serif word in the headline. */
const renderHeading = (raw: string) =>
  raw.split(/(\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });

/**
 * The staged choreography's own length, and the pause between plays.
 *
 * The longest chain is the outline's last row rule (delay 1.30, duration
 * 0.5) at ~1.80s, so 1800 is the real running time rather than a padded
 * guess. Keep this in step with the last delay in OUTLINE: a stale value
 * either cuts the final rows off mid-draw or holds a finished picture.
 *
 * REST cut from 3000 to 1600 at review: three seconds of a finished, still
 * picture reads as the animation having stopped rather than as a beat
 * between passes. Total cycle is 3.4s against 5.0s.
 */
const CHOREOGRAPHY_MS = 1800;
const REST_MS = 1600;

export const SourcesSection = () => {
  const { fadeUp, prefersReduced } = useMotion();

  /**
   * The stage replays on a loop rather than running once.
   *
   * Implemented by remounting the stage under a changing `key` instead of
   * adding `repeat` to each transition: the pieces are staggered against
   * one another (files, chip, seam, sparks, outline rows), and per-element
   * repeats would each restart on their own clock and drift out of the
   * arrangement within a couple of passes. A remount replays the whole
   * arrangement from its first frame, so pass two is identical to pass one.
   *
   * Gated on visibility so an off-screen section is not animating, and off
   * entirely under reduced motion — there the picture renders finished and
   * stays that way.
   */
  const stageRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(stageRef, { amount: 0.4 });
  const [pass, setPass] = useState(0);

  useEffect(() => {
    if (prefersReduced || !inView) return;
    const id = setInterval(() => setPass((n) => n + 1), CHOREOGRAPHY_MS + REST_MS);
    return () => clearInterval(id);
  }, [prefersReduced, inView]);

  // One switch for the whole choreography: with reduced motion every delay
  // collapses to zero and every offset to its resting value, so the
  // composition simply fades up as a finished picture.
  const at = (t: number) => (prefersReduced ? 0 : t);
  const dur = prefersReduced ? 0.2 : undefined;

  return (
    <S.Wrap>
      <S.Inner ref={stageRef}>
        <S.Copy
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={VIEWPORT_ONCE}
          transition={fadeUp.transition}
        >
          <S.Eyebrow>{SOURCES_SECTION.eyebrow}</S.Eyebrow>
          <S.Heading>{renderHeading(SOURCES_SECTION.heading)}</S.Heading>
          <S.Lede>{SOURCES_SECTION.lede}</S.Lede>
          <S.SrOnly>
            Diagram: a pile of files — a PDF, a Word document, an image and an audio recording —
            alongside a linked page, passing through a seam and arriving as a course outline of
            modules and lessons.
          </S.SrOnly>
        </S.Copy>

        <S.Stage key={pass} aria-hidden="true">
          {/* In — the material, set down as a loose pile. */}
          <S.Pile>
            {FILES.map((file, i) => (
              <S.FileCard
                key={file.kind}
                $slot={file.slot}
                $kind={file.kind}
                initial={{
                  opacity: 0,
                  y: prefersReduced ? 0 : 20,
                  scale: prefersReduced ? 1 : 0.94,
                  rotate: prefersReduced ? file.rot : file.rot * 2.4,
                }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotate: file.rot }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: dur ?? 0.55, delay: at(0.06 + i * 0.09), ease: easeOutSpring }}
              >
                <S.Thumb viewBox="0 0 100 132" role="presentation">
                  <path className="page" d={PAGE} />
                  <path className="fold" d={FOLD} />
                  {artFor(file.kind)}
                  <rect
                    className="band"
                    x="12"
                    y={BAND_Y}
                    width={file.bandW}
                    height={BAND_H}
                    rx="5"
                  />
                  <text
                    className="bandInk"
                    x={12 + file.bandW / 2}
                    y={BAND_Y + BAND_H / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {file.format}
                  </text>
                </S.Thumb>
              </S.FileCard>
            ))}

            {/* The link, drawn as the browser it arrives in. */}
            <S.LinkCard
              initial={{
                opacity: 0,
                y: prefersReduced ? 0 : 20,
                scale: prefersReduced ? 1 : 0.94,
                rotate: prefersReduced ? 2 : 8,
              }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 2 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: dur ?? 0.55, delay: at(0.42), ease: easeOutSpring }}
            >
              <S.LinkChrome>
                <S.LinkDots>
                  <i />
                  <i />
                  <i />
                </S.LinkDots>
                <S.LinkBar>
                  <Globe aria-hidden />
                  <S.LinkUrl>example.org/handbook</S.LinkUrl>
                </S.LinkBar>
              </S.LinkChrome>
              <S.LinkBody>
                <S.LinkHead />
                <S.LinkRule $w={94} />
                <S.LinkRule $w={72} />
              </S.LinkBody>
            </S.LinkCard>
          </S.Pile>

          {/* The seam. `scale` rather than scaleX/scaleY on purpose — the
              line is 1px on its short axis in both orientations, so a
              uniform scale grows it outward from its centre whether it is
              standing (desktop) or lying down (mobile). */}
          <S.Seam>
            {/* The bloom and the sparks below stay mounted under reduced
                motion — they just never leave `opacity: 0`. `useReducedMotion`
                is always false during SSR, so branching on it *structurally*
                would hand a reduced-motion visitor a different DOM tree at
                hydration; holding the shape fixed and neutralising the target
                keeps that off the table. `initial` is likewise constant for
                the same reason. */}
            <S.SeamBloom
              initial={{ opacity: 0, scale: 0.35 }}
              whileInView={prefersReduced ? { opacity: 0 } : { opacity: [0, 0.5, 0], scale: [0.35, 1.45] }}
              viewport={VIEWPORT_ONCE}
              transition={prefersReduced ? { duration: 0 } : { duration: 1.2, delay: 0.55, ease: 'easeOut' }}
            />
            <S.SeamLine
              initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.12 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: dur ?? 0.6, delay: at(0.4), ease: easeOutSpring }}
            />
            <S.SeamNode
              initial={{ opacity: 0, scale: prefersReduced ? 1 : 0, rotate: 45 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 45 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: dur ?? 0.45, delay: at(0.46), ease: easeOutSpring }}
            />
          </S.Seam>

          {/* Out — the course, upright and in order. */}
          <S.Outline
            initial={{ opacity: 0, y: prefersReduced ? 0 : 14, scale: prefersReduced ? 1 : 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: dur ?? 0.55, delay: at(0.6), ease: easeOutSpring }}
          >
            {OUTLINE.map((group) => (
              <S.OutlineGroup key={group.module}>
                <S.OutlineModule>{group.module}</S.OutlineModule>
                {group.rows.map((row) => (
                  <S.OutlineRow key={row.d}>
                    <S.RowBullet />
                    <S.RowRule
                      $w={row.w}
                      initial={{ opacity: 0, scaleX: prefersReduced ? 1 : 0 }}
                      whileInView={{ opacity: 1, scaleX: 1 }}
                      viewport={VIEWPORT_ONCE}
                      transition={{ duration: dur ?? 0.5, delay: at(row.d), ease: easeOutSpring }}
                    />
                    {row.sourced && (
                      <S.DocumentsPill
                        initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={VIEWPORT_ONCE}
                        transition={{ duration: dur ?? 0.4, delay: at(row.d + 0.16), ease: easeOutSpring }}
                      >
                        From your documents
                      </S.DocumentsPill>
                    )}
                  </S.OutlineRow>
                ))}
              </S.OutlineGroup>
            ))}
          </S.Outline>

          <S.SparkLayer>
            {SPARKS.map((spark) => (
              <S.Spark
                key={spark.left + spark.top}
                style={{ left: spark.left, top: spark.top, width: `${spark.w}%` }}
                initial={{ opacity: 0, x: '0%', y: 0, rotate: -12, scaleX: 0.6 }}
                whileInView={
                  prefersReduced
                    ? { opacity: 0 }
                    : {
                        opacity: [0, 1, 1, 0],
                        x: ['0%', `${spark.dx}%`],
                        y: [0, spark.dy],
                        rotate: [-12, 0],
                        scaleX: [0.6, 1],
                      }
                }
                viewport={VIEWPORT_ONCE}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : {
                        duration: SPARK_DURATION,
                        delay: spark.d,
                        ease: SPARK_EASE,
                        opacity: {
                          duration: SPARK_DURATION,
                          delay: spark.d,
                          times: SPARK_FADE,
                          ease: 'linear',
                        },
                      }
                }
              />
            ))}
          </S.SparkLayer>
        </S.Stage>
      </S.Inner>
    </S.Wrap>
  );
};
