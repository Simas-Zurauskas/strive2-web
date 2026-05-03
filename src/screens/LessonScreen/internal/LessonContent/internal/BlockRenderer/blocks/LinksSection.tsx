import { BookPlus } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import * as S from '../styles/links.styles';

export const LinksEmptyPlaceholder = ({
  onGenerate,
  disabled,
}: {
  onGenerate: () => void;
  disabled: boolean;
}) => (
  <S.LinksContainer>
    <S.LinksHeader>Further Reading</S.LinksHeader>
    <S.LinksGenerateRow>
      <span>No curated resources yet.</span>
      <S.LinksGenerateButton onClick={onGenerate} type="button" disabled={disabled}>
        <BookPlus size={14} />
        Generate resources
      </S.LinksGenerateButton>
    </S.LinksGenerateRow>
  </S.LinksContainer>
);

export const LinksBlockSkeleton = () => (
  <S.LinksContainer>
    <S.LinksHeader>Further Reading</S.LinksHeader>
    <S.LinksList>
      {[0, 1, 2].map((i) => (
        <S.LinksSkeletonRow key={i}>
          <Skeleton width="65%" height={14} borderRadius={4} />
          <Skeleton width="85%" height={12} borderRadius={4} />
        </S.LinksSkeletonRow>
      ))}
    </S.LinksList>
  </S.LinksContainer>
);
