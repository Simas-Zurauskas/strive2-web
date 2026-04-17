'use client';

import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { getMermaidThemeVars } from './mermaidTheme';
import { useMermaidZoomPan } from './useMermaidZoomPan';
import * as S from '../styles';

const cleanMermaidContent = (raw: string): string => {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:mermaid)?\s*\n?/i, '').replace(/\n?```\s*$/, '');
  cleaned = cleaned
    .split('\n')
    .map((line) => line.replace(/;\s*$/, ''))
    .join('\n');
  return cleaned.trim();
};

export const MermaidBlock = ({ content }: { content: string }) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const [renderState, setRenderState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const { resolvedTheme } = useTheme();

  const {
    viewportRef,
    zoom,
    pan,
    baseZoom,
    basePan,
    userInteracted,
    zoomRef,
    panRef,
    isDragging,
    setZoom,
    setPan,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    MIN_ZOOM,
    MAX_ZOOM,
  } = useMermaidZoomPan();

  const cleaned = cleanMermaidContent(content);

  // Mermaid render
  useEffect(() => {
    let cancelled = false;
    let ro: ResizeObserver | undefined;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const node = codeRef.current;
    if (!node) return;

    node.removeAttribute('data-processed');
    node.innerHTML = '';
    node.textContent = cleaned;
    setRenderState('loading');
    userInteracted.current = false;

    const render = async () => {
      const mermaid = (await import('mermaid')).default;
      const isDark = resolvedTheme === 'dark';

      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        fontFamily: 'var(--font-body-sans, sans-serif)',
        themeVariables: getMermaidThemeVars(isDark),
        flowchart: { useMaxWidth: false },
        sequence: { useMaxWidth: false },
        mindmap: { useMaxWidth: false },
      });

      try {
        await mermaid.run({ nodes: [node] });
        if (!cancelled) {
          setRenderState('success');

          const calcFit = () => {
            if (cancelled) return;
            const svg = node.querySelector('svg');
            const viewport = viewportRef.current;
            if (!svg || !viewport) return;

            const vW = viewport.clientWidth;
            const vH = viewport.clientHeight;
            if (vW === 0 || vH === 0) return;

            let fit: number;
            let offsetX: number;
            let offsetY: number;

            const viewBox = svg.getAttribute('viewBox');
            if (viewBox) {
              const parts = viewBox.split(/[\s,]+/);
              const svgW = parseFloat(parts[2]) || 0;
              const svgH = parseFloat(parts[3]) || 0;
              if (!svgW || !svgH) return;

              const padding = 48;
              const contentW = svgW + padding;
              const contentH = svgH + padding;
              fit = Math.min(vW / contentW, vH / contentH, 1);
              offsetX = (vW - contentW * fit) / 2;
              offsetY = (vH - contentH * fit) / 2;
            } else {
              const svgH = svg.clientHeight || 300;
              fit = 1;
              offsetX = 0;
              offsetY = Math.max((vH - svgH) / 2, 0);
            }

            baseZoom.current = fit;
            basePan.current = { x: offsetX, y: offsetY };

            if (!userInteracted.current) {
              zoomRef.current = fit;
              panRef.current = { x: offsetX, y: offsetY };
              setZoom(fit);
              setPan({ x: offsetX, y: offsetY });
            }
          };

          const viewport = viewportRef.current;
          if (viewport) {
            ro = new ResizeObserver(() => calcFit());
            ro.observe(viewport);
          }
          const t1 = setTimeout(() => calcFit(), 100);
          const t2 = setTimeout(() => calcFit(), 500);
          timers.push(t1, t2);
        }
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : String(e);
        console.warn('[MermaidBlock] Render failed:', msg);
        setErrorMsg(msg);
        setRenderState('error');
      }
    };

    render();
    return () => {
      cancelled = true;
      ro?.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [cleaned, resolvedTheme]); // eslint-disable-line react-hooks/exhaustive-deps

  if (renderState === 'error') {
    return (
      <S.CodeContainer>
        <S.CodeHeader>
          <S.CodeLanguage>diagram (render failed)</S.CodeLanguage>
        </S.CodeHeader>
        <S.CodePre>
          <code>{cleaned}</code>
        </S.CodePre>
        {errorMsg && (
          <div
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.75rem',
              color: '#ef4444',
              borderTop: '1px solid var(--border)',
            }}
          >
            {errorMsg}
          </div>
        )}
      </S.CodeContainer>
    );
  }

  return (
    <S.MermaidContainer>
      <S.MermaidViewport
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        $dragging={isDragging.current}
      >
        <S.MermaidCanvas
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <pre ref={codeRef} className="mermaid">
            {cleaned}
          </pre>
        </S.MermaidCanvas>
      </S.MermaidViewport>
      <S.MermaidToolbar>
        <S.MermaidToolbarButton onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out">
          <Minus size={14} />
        </S.MermaidToolbarButton>
        <S.MermaidZoomLabel>{Math.round((zoom / baseZoom.current) * 100)}%</S.MermaidZoomLabel>
        <S.MermaidToolbarButton onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">
          <Plus size={14} />
        </S.MermaidToolbarButton>
        <S.MermaidToolbarButton onClick={handleReset} aria-label="Reset view">
          <RotateCcw size={14} />
        </S.MermaidToolbarButton>
      </S.MermaidToolbar>
    </S.MermaidContainer>
  );
};
