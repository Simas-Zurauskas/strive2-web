import * as S from '../KbScreen.styles';

interface KbBreadcrumbProps {
  trail: ({ label: string; href: string } | { label: string; current: true })[];
}

export const KbBreadcrumb = ({ trail }: KbBreadcrumbProps) => (
  <S.Breadcrumb aria-label="Breadcrumb">
    {trail.map((item, idx) => {
      const isLast = idx === trail.length - 1;
      const key = `${idx}-${item.label}`;
      return (
        <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          {'href' in item ? (
            <S.BreadcrumbLink href={item.href}>{item.label}</S.BreadcrumbLink>
          ) : (
            <S.BreadcrumbCurrent aria-current="page">{item.label}</S.BreadcrumbCurrent>
          )}
          {!isLast && <S.BreadcrumbDivider aria-hidden="true">/</S.BreadcrumbDivider>}
        </span>
      );
    })}
  </S.Breadcrumb>
);
