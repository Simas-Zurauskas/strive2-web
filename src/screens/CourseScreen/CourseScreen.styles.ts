import styled from 'styled-components';

export const Layout = styled.div`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: none;
    font-size: 0.875rem;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

export const Meta = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

export const Goal = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const Modules = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.surface};
    border-color: ${(p) => p.theme.colors.border};
  }

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
  flex: 1;
  min-width: 0;
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

export const EmptyState = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  padding: 2rem 0;
`;
