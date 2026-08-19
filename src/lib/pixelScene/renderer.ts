import { createCanvas2DBackend } from "./canvas2d";
import type { PixelSceneRenderer, SceneBackend, SceneViewport } from "./types";
import { createWebGLBackend } from "./webgl";

const MOBILE_MAX_WIDTH = 768;
const DESKTOP_BUFFER_W = 480;
const MOBILE_BUFFER_W = 320;

function computeViewport(canvas: HTMLCanvasElement): SceneViewport {
  // Use the canvas's own CSS box rather than innerWidth/innerHeight. The
  // canvas uses a stable svh box, so browser chrome changes do not alter the
  // render aspect or scale the scene.
  const cssWidth = canvas.clientWidth || window.innerWidth;
  const cssHeight = canvas.clientHeight || window.innerHeight;
  const isMobile = cssWidth <= MOBILE_MAX_WIDTH;
  const targetWidth = isMobile ? MOBILE_BUFFER_W : DESKTOP_BUFFER_W;
  const aspect = cssHeight / cssWidth;
  const bufferWidth = targetWidth;
  const bufferHeight = Math.max(1, Math.round(targetWidth * aspect));
  return {
    cssWidth,
    cssHeight,
    bufferWidth,
    bufferHeight,
    pixelScale: cssWidth / bufferWidth,
    isMobile,
  };
}

function readScroll(viewportHeight: number): number {
  return Math.min(1, Math.max(0, window.scrollY / Math.max(1, viewportHeight)));
}

export function createPixelSceneRenderer(
  canvas: HTMLCanvasElement,
  reducedMotion: boolean,
): PixelSceneRenderer {
  let backend: SceneBackend | null = null;
  let usingFallback = false;
  let viewport = computeViewport(canvas);
  let rafId: number | null = null;
  let running = false;
  let startTime = 0;
  let scrollViewportHeight = viewport.cssHeight;
  const scrollRef = { current: readScroll(scrollViewportHeight) };

  function applyCanvasSize() {
    canvas.width = viewport.bufferWidth;
    canvas.height = viewport.bufferHeight;
    // CSS (100dvh + object-fit: cover) owns the display size so the buffer is
    // never stretched when mobile browser chrome changes innerHeight.
  }

  function buildBackend() {
    applyCanvasSize();
    backend = createWebGLBackend(canvas, {
      isMobile: viewport.isMobile,
      reducedMotion,
    });
    if (!backend) {
      usingFallback = true;
      backend = createCanvas2DBackend(canvas);
    }
    backend?.resize(viewport);
  }

  function drawOnce(timeSeconds: number) {
    if (!backend) return;
    backend.draw({ viewport, time: timeSeconds, scroll: scrollRef.current });
  }

  function frame(now: number) {
    if (!running) return;
    if (startTime === 0) startTime = now;
    drawOnce((now - startTime) * 0.001);
    rafId = requestAnimationFrame(frame);
  }

  // --- listeners ---
  function onScroll() {
    scrollRef.current = readScroll(scrollViewportHeight);
    // In static modes a scroll still needs a redraw to reposition the scene.
    if (!running) drawOnce(0);
  }

  function onResize() {
    const nextViewport = computeViewport(canvas);
    // Mobile browser chrome changes innerHeight while scrolling (url bar /
    // bottom bar show·hide). Ignore height-only resizes entirely: the canvas
    // tracks a stable CSS viewport height + object-fit:cover, and re-buffering
    // would change the scene aspect and jitter the mountains.
    if (viewport.isMobile && nextViewport.isMobile && nextViewport.cssWidth === viewport.cssWidth) {
      return;
    }
    viewport = nextViewport;
    scrollViewportHeight = viewport.cssHeight;
    scrollRef.current = readScroll(scrollViewportHeight);
    applyCanvasSize();
    backend?.resize(viewport);
    if (!running) drawOnce(0);
  }

  function onVisibility() {
    if (document.hidden) stop();
    else if (!reducedMotion) start();
  }

  function onContextLost(e: Event) {
    e.preventDefault();
    stop();
    backend?.destroy();
    backend = null;
  }

  function onContextRestored() {
    buildBackend();
    if (reducedMotion) drawOnce(0);
    else start();
  }

  function start() {
    if (running || reducedMotion) return;
    running = true;
    startTime = 0;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // --- lifecycle ---
  buildBackend();
  drawOnce(0);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLost as EventListener);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  return {
    start() {
      if (reducedMotion || usingFallback) {
        drawOnce(0);
        return;
      }
      if (!document.hidden) start();
    },
    stop,
    resize: onResize,
    destroy() {
      stop();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost as EventListener);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      backend?.destroy();
      backend = null;
    },
  };
}
