'use client';

import * as S from './Button.styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'default' | 'small';
  loading?: boolean;
}

export const Button = ({ variant = 'primary', size = 'default', loading = false, disabled, children, ...rest }: ButtonProps) => {
  return (
    <S.StyledButton $variant={variant} $size={size} $loading={loading} disabled={disabled || loading} {...rest}>
      <S.Content $loading={loading}>{children}</S.Content>
      {loading && <S.Spinner $variant={variant} $size={size} />}
    </S.StyledButton>
  );
};
