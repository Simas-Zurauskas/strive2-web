import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

// The container is a plain growing column. Each (auth) page owns its own
// padding and centring — the public landing page stretches full-width;
// the small-card auth screens (forgot/reset/verify/check-email) wrap
// themselves in a centred container.
export const Container = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
