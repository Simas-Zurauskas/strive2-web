'use client';

import styled from 'styled-components';
import { OgCanvas } from '../../OgCanvas';
import { OG, SERIF } from '../ogTones';

/**
 * V87 — The Stroke, on the plate. Simas's pick from round six, moved to
 * the house green: letterpress double rules and masthead in cream over a
 * lit deep-green ground, "anything" carried by the gold italic and the
 * drawn stroke.
 */

const Ground = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(90% 65% at 50% 0%, rgba(245, 241, 230, 0.09), transparent 58%),
    radial-gradient(130% 100% at 50% 128%, rgba(0, 0, 0, 0.34), transparent 60%),
    linear-gradient(168deg, ${OG.plate} 0%, ${OG.plateDeep} 82%);
`;

const CREAM = '#f5f1e6';

const TopRules = styled.div`
  position: absolute;
  left: 88px;
  right: 88px;
  top: 64px;
  border-top: 2px solid rgba(245, 241, 230, 0.82);
  padding-top: 5px;
  border-bottom: 1px solid rgba(245, 241, 230, 0.35);
  height: 0;
  box-sizing: content-box;
`;

const Masthead = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 96px;
  text-align: center;
  font-family: ${SERIF};
  font-style: italic;
  font-size: 56px;
  font-weight: 500;
  color: ${CREAM};
`;

const BottomRules = styled.div`
  position: absolute;
  left: 88px;
  right: 88px;
  bottom: 64px;
  border-bottom: 2px solid rgba(245, 241, 230, 0.82);
  padding-bottom: 5px;
  border-top: 1px solid rgba(245, 241, 230, 0.35);
  height: 0;
  box-sizing: content-box;
`;

const Centre = styled.div`
  position: absolute;
  inset: 120px 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Line = styled.h1`
  margin: 0;
  max-width: 900px;
  font-family: ${SERIF};
  font-size: 76px;
  line-height: 1.18;
  letter-spacing: -0.018em;
  font-weight: 700;
  color: ${CREAM};
  text-shadow: 0 2px 26px rgba(0, 0, 0, 0.28);
`;

const Any = styled.span`
  position: relative;
  white-space: nowrap;
  font-style: italic;
  font-weight: 500;
  color: #d8bc7e;

  svg {
    position: absolute;
    left: -2%;
    bottom: -18px;
    width: 104%;
    height: 24px;
  }
`;

export const UnderlineVariant: React.FC = () => (
  <OgCanvas id="og-underline" label="V87 — The Stroke, green">
    <Ground>
      <TopRules />
      <Masthead>Strive</Masthead>
      <Centre>
        <Line>
          A real course on{' '}
          <Any>
            anything
            <svg viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M 4 14 C 80 6, 210 4, 296 10"
                fill="none"
                stroke="#d8bc7e"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </Any>
          <br />
          you want to learn.
        </Line>
      </Centre>
      <BottomRules />
    </Ground>
  </OgCanvas>
);
