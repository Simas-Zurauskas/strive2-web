'use client';

import { Bookmark, BookmarkCheck, ImagePlus } from 'lucide-react';
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
  canRegenerateHero: boolean;
  onToggleBookmark: () => void;
  onRegenerateHero: () => void;
}

export const LessonHero = ({
  heroImage,
  eyebrowText,
  lessonName,
  isBookmarked,
  hasContent,
  isGenerating,
  showSkeleton,
  canRegenerateHero,
  onToggleBookmark,
  onRegenerateHero,
}: LessonHeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Skeleton while generating/loading — keep the title visible
  if (!heroImage && showSkeleton) {
    return (
      <S.HeroWrapper>
        <S.ImageContainer>
          <Skeleton height={380} borderRadius={0} />
        </S.ImageContainer>
        <S.TitleRow>
          <S.TitleArea>
            <S.EyebrowRow>
              <S.Eyebrow>{eyebrowText}</S.Eyebrow>
              {isGenerating && <S.GeneratingDot />}
            </S.EyebrowRow>
            <S.Title>{lessonName}</S.Title>
          </S.TitleArea>
        </S.TitleRow>
      </S.HeroWrapper>
    );
  }

  // No image — title with inline bookmark
  if (!heroImage) {
    return (
      <S.TitleRow>
        <S.TitleArea>
          <S.EyebrowRow>
            <S.Eyebrow>{eyebrowText}</S.Eyebrow>
            {isGenerating && <S.GeneratingDot />}
            {hasContent && (
              <S.BookmarkButtonInline
                $active={isBookmarked}
                onClick={onToggleBookmark}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
              >
                {isBookmarked ? (
                  <BookmarkCheck strokeWidth={1.75} fill="currentColor" />
                ) : (
                  <Bookmark strokeWidth={1.75} />
                )}
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </S.BookmarkButtonInline>
            )}
          </S.EyebrowRow>
          <S.Title>{lessonName}</S.Title>
          {canRegenerateHero && (
            <S.GenerateButton onClick={onRegenerateHero} type="button">
              <ImagePlus size={14} />
              Generate hero image
            </S.GenerateButton>
          )}
        </S.TitleArea>
      </S.TitleRow>
    );
  }

  // Image + title below
  return (
    <S.HeroWrapper>
      <S.ImageContainer>
        {!imageLoaded && <Skeleton height={380} borderRadius={0} />}
        <S.Image src={heroImage} alt="" onLoad={() => setImageLoaded(true)} $loaded={imageLoaded} />
      </S.ImageContainer>

      <S.TitleRow>
        <S.TitleArea>
          <S.EyebrowRow>
            <S.Eyebrow>{eyebrowText}</S.Eyebrow>
            {isGenerating && <S.GeneratingDot />}
            {hasContent && (
              <S.BookmarkButtonInline
                $active={isBookmarked}
                onClick={onToggleBookmark}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
              >
                {isBookmarked ? (
                  <BookmarkCheck strokeWidth={1.75} fill="currentColor" />
                ) : (
                  <Bookmark strokeWidth={1.75} />
                )}
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </S.BookmarkButtonInline>
            )}
          </S.EyebrowRow>
          <S.Title>{lessonName}</S.Title>
        </S.TitleArea>
      </S.TitleRow>
    </S.HeroWrapper>
  );
};
