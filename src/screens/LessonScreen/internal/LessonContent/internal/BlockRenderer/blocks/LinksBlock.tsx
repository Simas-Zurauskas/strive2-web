import * as S from '../styles';

export const LinksBlock = ({ metadata }: { metadata: Record<string, unknown> | null }) => {
  const links = (metadata?.links as Array<{ title: string; url: string; description: string }>) ?? [];

  if (links.length === 0) return null;

  return (
    <S.LinksContainer>
      <S.LinksHeader>Further Reading</S.LinksHeader>
      <S.LinksList>
        {links.map((link, i) => (
          <S.LinkItem key={i} href={link.url} target="_blank" rel="noopener noreferrer">
            <S.LinkTitle>{link.title}</S.LinkTitle>
            {link.description && <S.LinkDescription>{link.description}</S.LinkDescription>}
          </S.LinkItem>
        ))}
      </S.LinksList>
    </S.LinksContainer>
  );
};
