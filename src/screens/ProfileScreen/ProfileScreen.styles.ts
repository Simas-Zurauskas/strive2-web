import styled from 'styled-components';

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

export const Avatar = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.colors.tertiary};
  background: ${(p) => p.theme.colors.accent};
  color: var(--on-accent);
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
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
