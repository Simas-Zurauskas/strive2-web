import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: 1fr;
  }
`;

export const StructureColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
`;

export const ChatColumn = styled.div`
  position: sticky;
  top: calc(56px + 1.5rem);
  align-self: start;
  min-width: 0;
  height: calc(100vh - 56px - 1.5rem - 7rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  ${(p) => p.theme.media.tabletLarge} {
    position: static;
    height: 500px;
    overflow: visible;
  }
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 0 0.25rem;
`;

export const ChatPanelSlot = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
`;

export const Title = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.5rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.025em;
  line-height: 1.1;

  ${(p) => p.theme.media.tablet} {
    font-size: 1.75rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
`;

export const ModulesWrapper = styled.div`
  position: relative;
`;

export const Modules = styled.div<{ $dimmed?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  opacity: ${(p) => (p.$dimmed ? 0.5 : 1)};
  transition: opacity 0.3s ease;
  pointer-events: ${(p) => (p.$dimmed ? 'none' : 'auto')};
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const ModifyingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: var(--shadow-pop);
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const ModifyingSpinner = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.colors.border};
  border-top-color: ${(p) => p.theme.colors.accent};
  animation: ${spin} 0.6s linear infinite;
`;

export const ModuleDescription = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

export const LessonList = styled.ol`
  list-style: none;
  counter-reset: lesson;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const LessonItem = styled.li`
  counter-increment: lesson;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;

  &::before {
    content: counter(lesson);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.background};
    border: 1px solid ${(p) => p.theme.colors.border};
    font-size: 0.6875rem;
    font-weight: 600;
    color: ${(p) => p.theme.colors.muted};
    margin-top: 1px;
  }
`;

export const LessonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const LessonName = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const LessonDescription = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  position: sticky;
  bottom: 0;
  background: ${(p) => p.theme.colors.background};
  padding: 0.5rem 1rem 1.25rem;
  margin: 0 -1rem;
  z-index: 2;
  box-shadow: 0 -8px 16px ${(p) => p.theme.colors.background};
`;
