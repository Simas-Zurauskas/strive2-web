import * as S from '../styles/links.styles';

export const LinksBlock = ({ metadata }: { metadata: Record<string, unknown> | null }) => {
  const links = (metadata?.links as Array<{ title: string; url: string; description: string }>) ?? [];

  if (links.length === 0) {
    return (
      <S.LinksContainer>
        <S.LinksHeader>Further Reading</S.LinksHeader>
        <S.LinksEmptyState>
          We didn&apos;t find any high-quality external resources for this lesson — the lesson itself is the recommended source.
        </S.LinksEmptyState>
      </S.LinksContainer>
    );
  }

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
