'use client';

import styled, { keyframes } from 'styled-components';

// Per-card cycle lengths are deliberately coprime so the five chips never
// march in unison once they've all entered the viewport.

export const Chip = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: ${(p) => p.theme.colors.tertiaryMuted};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  box-shadow: var(--shadow-card-soft);
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: var(--space-1);
  overflow: hidden;

  @media (prefers-reduced-motion: reduce) {
    & * {
      animation: none !important;
    }
  }
`;

// ── Master: knowledge tree + traveling focus ───────────────────────────
const masterScan = keyframes`
  0%, 22%   { transform: translateY(0px); }
  25%, 47%  { transform: translateY(7px); }
  50%, 72%  { transform: translateY(14px); }
  75%, 100% { transform: translateY(21px); }
`;

export const TreeStage = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  padding-left: 7px;
`;

export const TreeRow = styled.span<{ $w: number; $indent: number }>`
  display: block;
  height: 2px;
  width: ${(p) => p.$w}%;
  margin-left: ${(p) => p.$indent}%;
  border-radius: 1px;
  background: currentColor;
  opacity: 0.42;
`;

export const Focus = styled.span`
  position: absolute;
  left: 1px;
  top: 5px;
  width: 2px;
  height: 4px;
  border-radius: 1px;
  background: currentColor;
  animation: ${masterScan} 4400ms cubic-bezier(0.65, 0.05, 0.35, 0.95) infinite alternate;
`;

// ── Monetize: live bar oscillation ─────────────────────────────────────
const barOsc = keyframes`
  0%, 100% { transform: scaleY(0.32); }
  50%      { transform: scaleY(1); }
`;

export const BarsStage = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2px;
  padding: 4px 4px 6px;
`;

export const Bar = styled.span<{ $h: number; $delay: number }>`
  display: block;
  width: 3px;
  height: ${(p) => p.$h}px;
  border-radius: 1.5px 1.5px 0 0;
  background: currentColor;
  transform-origin: bottom center;
  animation: ${barOsc} 2400ms cubic-bezier(0.45, 0, 0.55, 1) ${(p) => p.$delay}ms
    infinite;
`;

export const TargetLine = styled.span`
  position: absolute;
  left: 4px;
  right: 4px;
  bottom: 18px;
  height: 1px;
  background: currentColor;
  opacity: 0.28;
`;

// ── Pass: progressively filling checklist ──────────────────────────────
const checkOn = keyframes`
  0%, 4%    { opacity: 0; transform: scale(0.4); }
  10%, 88%  { opacity: 1; transform: scale(1); }
  96%, 100% { opacity: 0; transform: scale(0.6); }
`;

export const Checklist = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 0 4px;
`;

export const QuizRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 7px;
`;

export const Bullet = styled.span`
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1px solid currentColor;
  flex-shrink: 0;
  opacity: 0.6;
`;

export const Tick = styled.span<{ $delay: number }>`
  position: absolute;
  inset: 1px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0;
  transform-origin: center;
  animation: ${checkOn} 4800ms cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms
    infinite;
`;

export const RowLine = styled.span<{ $w: number }>`
  display: block;
  height: 2px;
  width: ${(p) => p.$w}px;
  border-radius: 1px;
  background: currentColor;
  opacity: 0.42;
`;

// ── Build: pipeline of work flowing upward ─────────────────────────────
const flowUp = keyframes`
  0%       { transform: translateY(15px); opacity: 0; }
  10%      { opacity: 1; }
  90%      { opacity: 1; }
  100%     { transform: translateY(-15px); opacity: 0; }
`;

export const BuildStage = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

export const Block = styled.span<{ $w: number; $delay: number }>`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${(p) => p.$w}px;
  height: 4px;
  margin-left: ${(p) => -p.$w / 2}px;
  margin-top: -2px;
  border-radius: 1.5px;
  background: currentColor;
  animation: ${flowUp} 4200ms linear ${(p) => p.$delay}ms infinite;
`;

// ── Fluency: alternating dialogue bubbles ──────────────────────────────
const bubblePulse = keyframes`
  0%, 100% { opacity: 0.32; transform: scale(0.94); }
  50%      { opacity: 1; transform: scale(1); }
`;

export const ChatStage = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

export const BubbleLeft = styled.span`
  position: absolute;
  left: 1px;
  top: 4px;
  width: 19px;
  height: 11px;
  border: 1.5px solid currentColor;
  border-radius: 6px 6px 6px 1.5px;
  transform-origin: bottom left;
  animation: ${bubblePulse} 2800ms cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

export const BubbleRight = styled.span`
  position: absolute;
  right: 1px;
  bottom: 4px;
  width: 19px;
  height: 11px;
  border: 1.5px solid currentColor;
  border-radius: 6px 6px 1.5px 6px;
  transform-origin: top right;
  animation: ${bubblePulse} 2800ms cubic-bezier(0.4, 0, 0.6, 1) 1400ms infinite;
`;
