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

  // ── Pointer tracking (pan + pinch) ──────────────────────────────────
  // Active pointers are tracked by id so a second finger can be recognised.
  // Without this there was no pinch path at all: zoom was reachable only via
  // ctrl+wheel and the 28x28 toolbar buttons, which on a phone meant a
  // diagram effectively could not be zoomed.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStartDist = useRef(0);
  const pinchStartZoom = useRef(1);

  const distance = () => {
    const pts = [...pointers.current.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  };

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      userInteracted.current = true;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 2) {
        // Second finger down — switch from pan to pinch.
        isDragging.current = false;
        pinchStartDist.current = distance();
        pinchStartZoom.current = zoomRef.current;
        return;
      }

      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      panStart.current = { ...panRef.current };
      // Capture on the VIEWPORT, not e.target. e.target is whatever SVG node
      // happened to be under the finger, and mermaid re-renders that subtree —
      // a captured node being replaced mid-gesture silently drops the stream.
      viewportRef.current?.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size >= 2) {
        const d = distance();
        if (pinchStartDist.current > 0 && d > 0) {
          const next = Math.min(
            Math.max(pinchStartZoom.current * (d / pinchStartDist.current), MIN_ZOOM),
            MAX_ZOOM,
          );
          zoomToCenter(next);
        }
        return;
      }

      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
    },
    [zoomToCenter],
  );

  const handlePointerUp = useCallback((e?: React.PointerEvent) => {
    if (e) pointers.current.delete(e.pointerId);
    else pointers.current.clear();
    if (pointers.current.size < 2) pinchStartDist.current = 0;
    if (pointers.current.size === 0) isDragging.current = false;
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
