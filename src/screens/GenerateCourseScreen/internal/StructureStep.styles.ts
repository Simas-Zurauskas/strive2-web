import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
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
  top: 2rem;
  min-width: 0;
  max-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    position: static;
    max-height: none;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Title = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const ModulesWrapper = styled.div`
  position: relative;
`;

export const Modules = styled.div<{ $dimmed?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  padding: 0.625rem 1.25rem;
  border-radius: 2rem;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  font-size: 0.8125rem;
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
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  margin-bottom: 0.75rem;
`;

export const LessonList = styled.ol`
  list-style: none;
  counter-reset: lesson;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LessonItem = styled.li`
  counter-increment: lesson;
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;

  &::before {
    content: counter(lesson);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.border};
    font-size: 0.6875rem;
    font-weight: 700;
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
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const LessonDescription = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

export const StartFreshLink = styled.button`
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  margin-left: auto;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;
