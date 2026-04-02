import styled from 'styled-components';

const Container = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 2rem;
`;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <Container>{children}</Container>;
}
