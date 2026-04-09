'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import * as S from './LessonHero.styles';

interface LessonHeroProps {
  heroImage: string | null;
  eyebrowText: string;
  lessonName: string;
  isBookmarked: boolean;
  hasContent: boolean;
  isGenerating: boolean;
  showSkeleton: boolean;
  onToggleBookmark: () => void;
}

export const LessonHero = ({
  heroImage,
  eyebrowText,
  lessonName,
  isBookmarked,
  hasContent,
  isGenerating,
  showSkeleton,
  onToggleBookmark,
}: LessonHeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Skeleton while generating/loading
  if (!heroImage && showSkeleton) {
    return (
      <S.ImageContainer>
        <Skeleton height={380} borderRadius={0} />
      </S.ImageContainer>
    );
  }

  // No image — title with inline bookmark
  if (!heroImage) {
    return (
      <S.TitleRow>
        <S.TitleArea>
          <S.Eyebrow>{eyebrowText}</S.Eyebrow>
          <S.Title>{lessonName}</S.Title>
        </S.TitleArea>
        {hasContent && (
          <S.BookmarkButtonInline
            $active={isBookmarked}
            onClick={onToggleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
          >
            <Star size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
          </S.BookmarkButtonInline>
        )}
      </S.TitleRow>
    );
  }

  // Image + title below
  return (
    <S.HeroWrapper>
      <S.ImageContainer>
        {!imageLoaded && <Skeleton height={380} borderRadius={0} />}
        <S.Image src={heroImage} alt="" onLoad={() => setImageLoaded(true)} $loaded={imageLoaded} />
        {isGenerating && (
          <S.ImageActions>
            <S.GeneratingDot />
          </S.ImageActions>
        )}
      </S.ImageContainer>

      <S.TitleRow>
        <S.TitleArea>
          <S.Eyebrow>{eyebrowText}</S.Eyebrow>
          <S.Title>{lessonName}</S.Title>
        </S.TitleArea>
        {hasContent && (
          <S.BookmarkButtonInline
            $active={isBookmarked}
            onClick={onToggleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
          >
            <Star size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
          </S.BookmarkButtonInline>
        )}
      </S.TitleRow>
    </S.HeroWrapper>
  );
};
