import { Footer } from '@/components';
import * as S from './layout.styles';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <S.Wrapper>
      <S.Container>{children}</S.Container>
      <Footer />
    </S.Wrapper>
  );
}
