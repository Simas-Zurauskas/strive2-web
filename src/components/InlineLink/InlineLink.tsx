'use client';

import Link from 'next/link';
import * as S from './InlineLink.styles';

interface InlineLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  newTab?: boolean;
}

export const InlineLink = ({ href, newTab, children, ...rest }: InlineLinkProps) => {
  return (
    <S.StyledLink
      as={Link}
      href={href}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </S.StyledLink>
  );
};
