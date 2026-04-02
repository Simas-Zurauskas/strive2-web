import styled from 'styled-components';

export const Container = styled.div`
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;

  @media (max-width: 640px) {
    padding: 1.25rem 1rem;
  }
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 1023px) {
    display: none;
  }
`;

export const SidebarToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  flex-shrink: 0;
  font-size: 0.875rem;

  &:hover {
    background: ${(p) => p.theme.colors.surface};
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const Breadcrumb = styled.div`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const BreadcrumbSeparator = styled.span`
  color: ${(p) => p.theme.colors.border};
`;

export const HeroImage = styled.img`
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  max-height: 280px;
  aspect-ratio: 16 / 9;
`;

export const HeroImageSkeleton = styled.div`
  width: 100%;
  border-radius: 12px;
  aspect-ratio: 16 / 9;
  max-height: 280px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${(p) => p.theme.colors.background}40 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

export const Description = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
`;

export const Placeholder = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1rem;
  border-radius: 12px;
  border: 1px dashed ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
`;

export const PlaceholderText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  line-height: 1.5;
`;

export const GeneratingText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.accent};
  text-align: center;
  font-weight: 500;
`;

export const GenerateOptions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;

  input[type='checkbox'] {
    accent-color: ${(p) => p.theme.colors.accent};
    cursor: pointer;
  }

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const StreamingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.accent};
  font-weight: 500;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.accent};
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
`;

export const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  margin-top: auto;
`;

export const NavButton = styled.button<{ $hidden?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  visibility: ${(p) => (p.$hidden ? 'hidden' : 'visible')};

  &:hover {
    background: ${(p) => p.theme.colors.surface};
  }
`;
