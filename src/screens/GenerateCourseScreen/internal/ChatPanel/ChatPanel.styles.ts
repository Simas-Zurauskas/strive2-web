import styled from 'styled-components';

// Outer chrome for the course-creation chat — a rounded card embedded
// in the structure-step two-column layout. The chat innards live in
// the shared `<Chat>` component (`@/components/Chat`).

export const Container = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  background: ${(p) => p.theme.colors.background};
  height: 100%;
  min-height: 0;
  overflow: hidden;
`;
