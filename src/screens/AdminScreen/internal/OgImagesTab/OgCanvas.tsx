'use client';

import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import { Button } from '@/components';
import * as S from './OgCanvas.styles';
import { OG_HEIGHT, OG_WIDTH } from './OgCanvas.styles';

interface OgCanvasProps {
  /** Used as the file slug when the PNG is downloaded. */
  id: string;
  /** Human label shown above the preview. */
  label: string;
  /** OG-card body. Sized inside a 1200×630 box at native scale. */
  children: React.ReactNode;
}

/**
 * Reusable wrapper for prototyping Open Graph images.
 *
 * Renders `children` inside a fixed 1200×630 canvas (the OG spec
 * recommendation), shown at half-scale for in-app preview, and exposes a
 * "Download PNG" button that captures the *unscaled* node — `style: {
 * transform: 'none' }` overrides the preview's `scale()` during capture so
 * the output PNG matches the final embed size on social platforms.
 *
 * Designs that need to use `next/image` should fall back to plain `<img>`
 * here — html-to-image walks DOM, and Next's image optimizer interferes
 * with predictable rendering at native size.
 */
export const OgCanvas: React.FC<OgCanvasProps> = ({ id, label, children }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const onDownload = async () => {
    if (!canvasRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(canvasRef.current, {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        // The displayed preview is `transform: scale(0.5)`; reset it so
        // html-to-image renders the node at full 1200×630.
        style: { transform: 'none', transformOrigin: 'top left' },
        // 1× is correct here — `width`/`height` already pin the output to
        // native OG dimensions. Bumping pixelRatio would 2x the file size
        // for no perceptible quality gain at the size social platforms
        // re-encode to.
        pixelRatio: 1,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('[OgCanvas] capture failed', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <S.Wrapper>
      <S.HeaderRow>
        <S.Label>{label}</S.Label>
        <S.Slug>{`${id}.png · ${OG_WIDTH}×${OG_HEIGHT}`}</S.Slug>
      </S.HeaderRow>
      <S.Frame>
        <S.Canvas ref={canvasRef}>{children}</S.Canvas>
      </S.Frame>
      <S.Footer>
        <Button type="button" onClick={onDownload} disabled={downloading}>
          {downloading ? 'Capturing…' : 'Download PNG'}
        </Button>
      </S.Footer>
    </S.Wrapper>
  );
};
