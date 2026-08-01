'use client';

import { memo } from 'react';
import * as S from './CourseRoute.styles';
import { HERO_ROUTES } from '../../constants';

/**
 * The hero's visual: a charted course route — dotted trail through four
 * waypoint modules up to a summit — replacing the old browser-chrome
 * lesson mock (which sat ~70% empty white between typing cycles). This is
 * the product's core metaphor drawn literally: you name a destination,
 * Strive charts the path.
 *
 * `activeIdx` tracks the hero input's rotating placeholder, so the route's
 * module labels always belong to the example goal currently on screen.
 *
 * Pure SVG + CSS: the trail draws in via stroke-dashoffset and waypoints
 * fade in staggered (keyframes live in the styles file and collapse under
 * prefers-reduced-motion). No JS animation loop — unlike the old mock's
 * 55 ms typing interval, this costs nothing after the initial draw.
 * Decorative: aria-hidden, with an sr-only sentence carrying the meaning.
 */

// One gentle S-curve, top → bottom. ViewBox is 380×520.
const TRAIL_D = 'M 210 28 C 140 92 268 148 216 214 C 172 270 118 316 158 380 C 186 424 204 448 196 492';

// [x, y] per waypoint along TRAIL_D, plus which side its label sits on.
// Each x is the curve's own x at that y — solved by evaluating the cubic,
// not eyeballed, because a 2–3px drift reads as a seal that missed the
// trail. If you edit TRAIL_D, re-solve these rather than nudging them:
// waypoint 1 sits near the first segment's leftmost turn, where a small
// change in t barely moves y but visibly moves x.
const WAYPOINTS: { x: number; y: number; side: 'left' | 'right' }[] = [
  { x: 188.8, y: 76, side: 'right' },
  { x: 228.2, y: 172, side: 'left' },
  { x: 145.3, y: 322, side: 'right' },
  { x: 173.3, y: 404, side: 'left' },
];

const SUMMIT = { x: 196, y: 492 };

interface CourseRouteProps {
  activeIdx: number;
}

const CourseRouteImpl = ({ activeIdx }: CourseRouteProps) => {
  const route = HERO_ROUTES[activeIdx % HERO_ROUTES.length];

  return (
    <S.Frame>
      <S.SrOnly>
        Example course route: four modules — {route.waypoints.join(', ')} — leading to{' '}
        {route.summit}.
      </S.SrOnly>

      <S.RouteSvg viewBox="0 0 380 520" aria-hidden="true" focusable="false">
        {/* Start marker — static; the learner's position doesn't change
            between example goals. */}
        <S.StartLabel x={210} y={14} textAnchor="middle">
          YOU, TODAY
        </S.StartLabel>
        <S.StartDot cx={210} cy={28} r={5} />

        {/* A dashed line can't draw itself via its own dashoffset (the
            periodic dot pattern just crawls in place) — so the dotted
            trail is revealed through a MASK whose solid twin path draws
            start→summit. */}
        <defs>
          <mask id="course-route-draw">
            <S.MaskPath key={`mask-${activeIdx}`} d={TRAIL_D} pathLength={1} />
          </mask>
        </defs>

        {/* Keyed by the active goal: every rotation remounts the trail +
            waypoints, replaying the draw and the waypoint stagger. The
            cadence in HeroSection budgets for it — ~1.3s of show, ~4s of
            settled reading. */}
        <g key={activeIdx}>
          <S.Trail d={TRAIL_D} pathLength={1} mask="url(#course-route-draw)" />

          {WAYPOINTS.map((wp, i) => (
            <S.WaypointGroup key={`wp-${i}`} $index={i}>
              <S.WaypointRing cx={wp.x} cy={wp.y} r={9} />
              <S.WaypointCore cx={wp.x} cy={wp.y} r={3.5} />
              <S.WaypointIndex
                x={wp.side === 'right' ? wp.x + 22 : wp.x - 22}
                y={wp.y - 7}
                textAnchor={wp.side === 'right' ? 'start' : 'end'}
              >
                {`0${i + 1}`}
              </S.WaypointIndex>
              <S.WaypointLabel
                x={wp.side === 'right' ? wp.x + 22 : wp.x - 22}
                y={wp.y + 9}
                textAnchor={wp.side === 'right' ? 'start' : 'end'}
              >
                {route.waypoints[i]}
              </S.WaypointLabel>
            </S.WaypointGroup>
          ))}

          {/* Summit — flag + the destination line. */}
          <S.WaypointGroup key="summit" $index={4}>
            <S.SummitMast x1={SUMMIT.x} y1={SUMMIT.y} x2={SUMMIT.x} y2={SUMMIT.y - 26} />
            <S.SummitFlag
              points={`${SUMMIT.x},${SUMMIT.y - 26} ${SUMMIT.x + 17},${SUMMIT.y - 21} ${SUMMIT.x},${SUMMIT.y - 15}`}
            />
            <S.SummitBase cx={SUMMIT.x} cy={SUMMIT.y} r={4} />
            <S.SummitLabel x={SUMMIT.x} y={SUMMIT.y + 22} textAnchor="middle">
              {route.summit}
            </S.SummitLabel>
          </S.WaypointGroup>
        </g>
      </S.RouteSvg>
    </S.Frame>
  );
};

/* Memoised because the hero now re-renders on every typed character — ~40
   times per placeholder cycle, where before it re-rendered once. `activeIdx`
   only moves at the trough, so without this the whole SVG would reconcile
   at 20–40Hz for a tree that changes four times a minute. */
export const CourseRoute = memo(CourseRouteImpl);
