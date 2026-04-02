import styled from 'styled-components';

export const Layout = styled.div`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 2rem;
  max-width: 720px;
  margin: 0 auto;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.muted};
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
`;

export const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;

  & + & {
    border-top: 1px solid ${(p) => p.theme.colors.border};
  }
`;

export const Label = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  min-width: 120px;
  flex-shrink: 0;
`;

export const Value = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

export const VerifiedBadge = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.success};
`;

export const UnverifiedBadge = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.error};
`;

export const ProviderTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

export const DangerZone = styled.section`
  border: 1px solid ${(p) => p.theme.colors.error};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const DangerTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.error};
  margin: 0 0 0.5rem 0;
`;

export const DangerText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1rem 0;
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const DangerButton = styled.button<{ $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: ${(p) => (p.$loading || p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$loading || p.disabled ? 0.6 : 1)};
  transition:
    opacity 0.15s,
    background 0.15s;
  background: ${(p) => p.theme.colors.error};
  color: #fff;
  border: 1px solid transparent;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

export const PasswordInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.error};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const LoadingText = styled.p`
  font-size: 1rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  padding: 4rem 0;
`;
