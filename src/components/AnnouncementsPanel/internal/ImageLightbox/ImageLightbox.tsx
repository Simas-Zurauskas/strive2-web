'use client';

import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import { useScrollLock } from '@/hooks';
import * as S from './ImageLightbox.styles';

export interface LightboxImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ImageLightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
}

export const ImageLightbox = ({ image, onClose }: ImageLightboxProps) => {
  const open = image !== null;
  const closeRef = useRef<HTMLButtonElement>(null);

  // Ref-counted app-wide, so stacking this on top of the panel's own lock is
  // safe — the page stays frozen until BOTH release.
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Stop the panel's own Escape handler from also firing: one press
        // should dismiss one layer, not collapse the whole stack.
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [open, onClose]);

  // Move focus onto the dialog so a keyboard or screen-reader user is not
  // left behind on the thumbnail underneath.
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  const onScrimClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {image && (
        <S.Scrim
          onClick={onScrimClick}
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
        >
          <S.Frame
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          >
            <S.CloseButton
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close image"
            >
              <X />
            </S.CloseButton>
            <S.Stage>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 700px) 100vw, 1100px"
                priority
              />
            </S.Stage>
            <S.Caption>{image.alt}</S.Caption>
          </S.Frame>
        </S.Scrim>
      )}
    </AnimatePresence>
  );
};
