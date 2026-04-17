import * as S from './layout.styles';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <S.Container>{children}</S.Container>;
}
