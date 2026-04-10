import styled from 'styled-components';

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 2rem;

  ${(p) => p.theme.media.tablet} {
    padding: 1.5rem 1.25rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

// ── Tabs ────────────────────────────────────────────

export const TopTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  margin-bottom: 1.25rem;
`;

export const TopTab = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0;
  border: none;
  background: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  border-bottom: 2px solid ${(p) => (p.$active ? p.theme.colors.accent : 'transparent')};
  margin-bottom: -1px;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

// ── Illustrator ─────────────────────────────────────

export const Preview = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;

  svg {
    width: 300px;
    height: 300px;
    max-width: 100%;
  }
`;

export const EmptyPreview = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const CodeBlock = styled.pre`
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.75rem;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
  margin: 0;
`;
