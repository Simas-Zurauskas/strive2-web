import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50%      { opacity: 1;    transform: scale(1.15); }
`;

export const Container = styled.button`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  text-align: left;
  cursor: pointer;
  width: 100%;
  font: inherit;
  color: inherit;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${(p) => p.theme.colors.accentMuted};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const HeaderIcon = styled.span`
  font-size: 1.125rem;
  line-height: 1;
`;

export const HeaderTitle = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
`;

export const PulseDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.warning};
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const CountBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

export const BigCount = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 2.75rem;
  font-weight: 700;
  line-height: 1;
  color: ${(p) => p.theme.colors.accent};
`;

export const CountLabel = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  font-weight: 500;
`;

export const CourseAttribution = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.3;
`;

export const PromptTeaser = styled.div`
  font-size: 0.8125rem;
  font-style: italic;
  color: ${(p) => p.theme.colors.foreground};
  background: ${(p) => p.theme.colors.accentMuted};
  border-left: 2px solid ${(p) => p.theme.colors.accent};
  padding: 0.625rem 0.75rem;
  border-radius: 0 6px 6px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CTA = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.accent};
  margin-top: 0.125rem;
`;

export const CTAArrow = styled.span`
  transition: transform 0.15s;

  ${Container}:hover & {
    transform: translateX(3px);
  }
`;
