'use client';

import * as S from './Button.styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button = ({ variant = 'primary', loading = false, disabled, children, ...rest }: ButtonProps) => {
  return (
    <S.StyledButton $variant={variant} $loading={loading} disabled={disabled || loading} {...rest}>
      {children}
    </S.StyledButton>
  );
};
