import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
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

// Highlighted excerpt of the user's submitted goal — italic-serif treatment
// matches DepthContextChip / wizard chrome elsewhere.
export const GoalEcho = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;

  strong {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-style: italic;
    font-weight: 500;
    color: ${(p) => p.theme.colors.foreground};
  }
`;

// Single-column list of horizontal rows. 5 goal types in a 2-col grid
// produced an orphan card; rows scan top-to-bottom in one beat and let
// the description column take full width.
export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

// Border weight, selected color, and hover treatment match DepthStep so
// the wizard reads as one consistent vocabulary across steps. Selection
// uses the tertiary/gold accent (DepthStep convention), not the green
// accent — gold is the established "this is your active choice" token.
export const Row = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid
    ${(p) => (p.$selected ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  background: ${(p) => (p.$selected ? p.theme.colors.tertiaryMuted : p.theme.colors.surface)};
  text-align: left;
  cursor: ${(p) => (p.$selected ? 'default' : 'pointer')};
  transition:
    border-color 0.15s ease,
    background 0.18s ease,
    transform 0.15s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: ${(p) => (p.$selected ? p.theme.colors.tertiary : p.theme.colors.muted)};
    transform: ${(p) => (p.$selected ? 'none' : 'translateY(-1px)')};
    box-shadow: ${(p) => (p.$selected ? 'none' : 'var(--shadow-lift)')};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

// Title row inlines the Recommended Badge so the badge sits next to the
// label it qualifies, not floating at the row's corner.
export const RowHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
`;

// Smaller than DepthStep's CardLabel (1.375rem) — DepthStep has 3 large
// cards with 1.75rem padding where serif-display sizing earns its room;
// PurposeStep has 5 dense rows where the title needs to read as a
// section identifier, not a hero.
export const RowTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0;
`;

export const RowDescription = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.4;
  margin: 0;
`;

// Tertiary-gold caption: how this choice actually reshapes the course.
// Mirrors the server-side GOAL_TYPE_STRUCTURE_GUIDANCE so the user sees
// a concrete contract before committing.
export const RowTilt = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.tertiary};
  line-height: 1.4;
  margin: 0;
  font-style: italic;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 0.5rem;
`;
