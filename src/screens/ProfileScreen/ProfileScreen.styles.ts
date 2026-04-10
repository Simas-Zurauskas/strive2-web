import styled from 'styled-components';

// ── Layout ────────────────────────────────────────────

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 2rem;
  max-width: 720px;
  margin: 0 auto;

  ${(p) => p.theme.media.mobile} {
    padding: 1.25rem;
  }
`;

// ── Profile header ────────────────────────────────────

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2rem;

  ${(p) => p.theme.media.mobile} {
    flex-direction: column;
    text-align: center;
  }
`;

export const Avatar = styled.div<{ $hasImage?: boolean }>`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const ProfileName = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProfileEmail = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

export const ProfileMeta = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const VerifiedBadge = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.success};
`;

export const UnverifiedBadge = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.error};
`;

// ── Stats grid ────────────────────────────────────────

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  margin-bottom: 0.25rem;
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 500;
`;

// ── Section ───────────────────────────────────────────

export const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1rem 0;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0;

  & + & {
    border-top: 1px solid ${(p) => p.theme.colors.border};
  }
`;

export const Label = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
`;

export const Value = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

export const ProviderTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.1875rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

// ── Verification banner ───────────────────────────────

export const VerificationBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border: 1px solid ${(p) => p.theme.colors.warning};
  border-radius: 12px;
  margin-bottom: 1.5rem;
  background: ${(p) => p.theme.colors.surface};

  ${(p) => p.theme.media.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const VerificationText = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Danger zone ───────────────────────────────────────

export const DangerZone = styled.section`
  border: 1px solid ${(p) => p.theme.colors.error};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const DangerTitle = styled.h2`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
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
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.8125rem;
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
