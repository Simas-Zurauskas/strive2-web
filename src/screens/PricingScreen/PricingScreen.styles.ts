import styled, { css } from 'styled-components';

export const Layout = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.header`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(2rem, 4vw, 2.75rem);
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const Subtitle = styled.p`
  color: ${(p) => p.theme.colors.muted};
  font-size: 1rem;
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.55;
`;

export const CadenceToggle = styled.div`
  display: inline-flex;
  align-self: center;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 9999px;
  padding: 0.25rem;
`;

export const CadenceBtn = styled.button<{ $active: boolean }>`
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;

  ${(p) =>
    p.$active &&
    css`
      background: ${p.theme.colors.background};
      color: ${p.theme.colors.foreground};
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    `}
`;

export const SavingsChip = styled.span`
  margin-left: 0.4rem;
  font-size: 0.7rem;
  background: ${(p) => p.theme.colorsLib.green}15;
  color: ${(p) => p.theme.colors.success};
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div<{ $highlighted?: boolean }>`
  position: relative;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 12px;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${(p) =>
    p.$highlighted &&
    css`
      border-color: ${p.theme.colors.accent};
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
    `}
`;

export const HighlightRibbon = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(p) => p.theme.colors.accent};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
  white-space: nowrap;
`;

export const PlanName = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const PlanDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  /* Pin the block to the height of the longest description (~8 lines at the
     narrow 4-column card width) so the price row below is vertically aligned
     across cards. Below 4 columns the cards stack and the min-height becomes
     harmless slack. */
  min-height: 12em;
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
`;

export const Price = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
  font-variant-numeric: tabular-nums;
`;

export const PriceMeta = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  white-space: nowrap;
`;

export const AllowanceBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.75rem 0;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  flex: 1;
`;

export const AllowanceNumber = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
`;

export const AllowanceMultiplier = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.muted};
  margin-left: 0.1rem;
`;

export const AllowanceUnit = styled.div`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.01em;
`;

export const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TopupsSection = styled.section`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const TopupsTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const FaqSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FaqTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.75rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0 0 0.5rem 0;
`;

export const FaqItem = styled.details`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  padding: 1rem 1.25rem;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: ${(p) => p.theme.colors.foreground};
  }

  p {
    margin: 0.75rem 0 0 0;
    color: ${(p) => p.theme.colors.muted};
    line-height: 1.55;
    font-size: 0.9375rem;
  }
`;
