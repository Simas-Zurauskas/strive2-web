'use client';

import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from '../styles';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

const cleanMermaidContent = (raw: string): string => {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:mermaid)?\s*\n?/i, '').replace(/\n?```\s*$/, '');
  cleaned = cleaned
    .split('\n')
    .map((line) => line.replace(/;\s*$/, ''))
    .join('\n');
  return cleaned.trim();
};

const getMermaidThemeVars = (isDark: boolean) =>
  isDark
    ? {
        primaryColor: '#2a3833',
        primaryTextColor: '#d5d0cb',
        primaryBorderColor: '#4a8a72',
        secondaryColor: '#332d24',
        secondaryTextColor: '#d5d0cb',
        secondaryBorderColor: '#8a7245',
        tertiaryColor: '#302d2a',
        tertiaryTextColor: '#d5d0cb',
        tertiaryBorderColor: '#4a4543',
        lineColor: '#4a4543',
        textColor: '#d5d0cb',
        mainBkg: '#2a3833',
        nodeBorder: '#4a8a72',
        clusterBkg: '#232120',
        clusterBorder: '#3a3735',
        titleColor: '#d5d0cb',
        edgeLabelBackground: '#1a1816',
        noteBkgColor: '#302d2a',
        noteTextColor: '#d5d0cb',
        noteBorderColor: '#4a4543',
        // Mindmap / pie branch colors
        cScale0: '#2a3833',
        cScale1: '#332d24',
        cScale2: '#302d2a',
        cScale3: '#2a2f38',
        cScale4: '#33292a',
        cScale5: '#2d332a',
        cScale6: '#302a33',
        cScale7: '#2a3330',
        cScaleLabel0: '#d5d0cb',
        cScaleLabel1: '#d5d0cb',
        cScaleLabel2: '#d5d0cb',
        cScaleLabel3: '#d5d0cb',
        cScaleLabel4: '#d5d0cb',
        cScaleLabel5: '#d5d0cb',
        cScaleLabel6: '#d5d0cb',
        cScaleLabel7: '#d5d0cb',
        cScalePeer0: '#4a8a72',
        cScalePeer1: '#8a7245',
        cScalePeer2: '#4a4543',
        cScalePeer3: '#5a7088',
        cScalePeer4: '#88555a',
        cScalePeer5: '#5a8855',
        cScalePeer6: '#7a5a88',
        cScalePeer7: '#558878',
      }
    : {
        primaryColor: '#e2ede7',
        primaryTextColor: '#0f172a',
        primaryBorderColor: '#2c5545',
        secondaryColor: '#f0e8d8',
        secondaryTextColor: '#0f172a',
        secondaryBorderColor: '#96793e',
        tertiaryColor: '#f0eeec',
        tertiaryTextColor: '#0f172a',
        tertiaryBorderColor: '#dfd9d3',
        lineColor: '#c4bdb5',
        textColor: '#0f172a',
        mainBkg: '#e2ede7',
        nodeBorder: '#2c5545',
        clusterBkg: '#ffffff',
        clusterBorder: '#dfd9d3',
        titleColor: '#0f172a',
        edgeLabelBackground: '#faf9f7',
        noteBkgColor: '#ffffff',
        noteTextColor: '#0f172a',
        noteBorderColor: '#dfd9d3',
        // Mindmap / pie branch colors
        cScale0: '#e2ede7',
        cScale1: '#f0e8d8',
        cScale2: '#f0eeec',
        cScale3: '#dde7f0',
        cScale4: '#f0e2e4',
        cScale5: '#e4f0e2',
        cScale6: '#eae2f0',
        cScale7: '#e2f0ec',
        cScaleLabel0: '#0f172a',
        cScaleLabel1: '#0f172a',
        cScaleLabel2: '#0f172a',
        cScaleLabel3: '#0f172a',
        cScaleLabel4: '#0f172a',
        cScaleLabel5: '#0f172a',
        cScaleLabel6: '#0f172a',
        cScaleLabel7: '#0f172a',
      };

export const MermaidBlock = ({ content }: { content: string }) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [renderState, setRenderState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const { resolvedTheme } = useTheme();

  // Zoom & pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const baseZoom = useRef(1);
  const basePan = useRef({ x: 0, y: 0 });
  const userInteracted = useRef(false);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  // Keep refs in sync with state (for event handlers that can't use state directly)
  zoomRef.current = zoom;
  panRef.current = pan;

  const cleaned = cleanMermaidContent(content);

  // Zoom toward the center of the viewport
  const zoomToCenter = useCallback((newZoom: number) => {
    const viewport = viewportRef.current;
    const curZoom = zoomRef.current;
    const curPan = panRef.current;
    if (!viewport || newZoom === curZoom) return;
    userInteracted.current = true;

    const vW = viewport.clientWidth;
    const vH = viewport.clientHeight;

    // Content point currently at viewport center
    const cx = (vW / 2 - curPan.x) / curZoom;
    const cy = (vH / 2 - curPan.y) / curZoom;

    // Adjust pan so the same content point stays at viewport center
    const newPan = {
      x: vW / 2 - cx * newZoom,
      y: vH / 2 - cy * newZoom,
    };

    // Update refs immediately so rapid calls don't use stale values
    zoomRef.current = newZoom;
    panRef.current = newPan;

    setZoom(newZoom);
    setPan(newPan);
  }, []);

  const handleZoomIn = useCallback(() => {
    const step = baseZoom.current * ZOOM_STEP;
    zoomToCenter(Math.min(zoomRef.current + step, MAX_ZOOM));
  }, [zoomToCenter]);

  const handleZoomOut = useCallback(() => {
    const step = baseZoom.current * ZOOM_STEP;
    zoomToCenter(Math.max(zoomRef.current - step, MIN_ZOOM));
  }, [zoomToCenter]);

  const handleReset = useCallback(() => {
    userInteracted.current = false;
    setZoom(baseZoom.current);
    setPan(basePan.current);
  }, []);

  // Drag to pan
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      userInteracted.current = true;
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      panStart.current = { ...pan };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pan],
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Wheel to zoom (toward center)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const step = baseZoom.current * ZOOM_STEP;
      const delta = e.deltaY > 0 ? -step : step;
      const newZoom = Math.min(Math.max(zoomRef.current + delta, MIN_ZOOM), MAX_ZOOM);
      zoomToCenter(newZoom);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [zoomToCenter]);

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

          // Read SVG dimensions and calculate fit to center in viewport
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
              // SVG has viewBox — use intrinsic dimensions for fit calculation
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
              // No viewBox (width="100%") — SVG handles its own width, just center vertically
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

          // Persistent ResizeObserver — recalculates when viewport dimensions change
          const viewport = viewportRef.current;
          if (viewport) {
            ro = new ResizeObserver(() => calcFit());
            ro.observe(viewport);
          }
          // Retry calcFit after delays to catch SVG rendering completing
          // (on initial load, SVG content may not be painted when observer first fires)
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
  }, [cleaned, resolvedTheme]);

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
