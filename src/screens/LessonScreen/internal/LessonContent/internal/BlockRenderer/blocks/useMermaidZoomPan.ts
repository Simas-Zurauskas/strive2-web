import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export const useMermaidZoomPan = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
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
  useEffect(() => {
    zoomRef.current = zoom;
    panRef.current = pan;
  });

  // Zoom toward the center of the viewport
  const zoomToCenter = useCallback((newZoom: number) => {
    const viewport = viewportRef.current;
    const curZoom = zoomRef.current;
    const curPan = panRef.current;
    if (!viewport || newZoom === curZoom) return;
    userInteracted.current = true;

    const vW = viewport.clientWidth;
    const vH = viewport.clientHeight;

    const cx = (vW / 2 - curPan.x) / curZoom;
    const cy = (vH / 2 - curPan.y) / curZoom;

    const newPan = {
      x: vW / 2 - cx * newZoom,
      y: vH / 2 - cy * newZoom,
    };

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

  return {
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
  };
};
