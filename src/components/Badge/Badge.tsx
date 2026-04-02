'use client';

import * as S from './Badge.styles';

interface BadgeProps {
  variant?: 'default' | 'accent' | 'success' | 'warning';
  children: React.ReactNode;
}

export const Badge = ({ variant = 'default', children }: BadgeProps) => {
  return <S.StyledBadge $variant={variant}>{children}</S.StyledBadge>;
};
