import { createCanvas2DBackend } from "./canvas2d";
import type { PixelSceneOptions, PixelSceneRenderer, SceneViewport } from "./types";
import { type SceneBackend, createWebGLBackend } from "./webgl";

const MOBILE_MAX_WIDTH = 768;
const DESKTOP_BUFFER_W = 480;
const MOBILE_BUFFER_W = 320;

function computeViewport(): SceneViewport {
  const cssWidth = window.innerWidth;
  const cssHeight = window.innerHeight;
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

function readScroll(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

export function createPixelSceneRenderer(
  canvas: HTMLCanvasElement,
  options: PixelSceneOptions,
): PixelSceneRenderer {
  const { reducedMotion } = options;
  let backend: SceneBackend | null = null;
  let usingFallback = false;
  let viewport = computeViewport();
  let rafId: number | null = null;
  let running = false;
  let startTime = 0;
  const scrollRef = { current: readScroll() };

  function applyCanvasSize() {
    canvas.width = viewport.bufferWidth;
    canvas.height = viewport.bufferHeight;
    canvas.style.width = `${viewport.cssWidth}px`;
    canvas.style.height = `${viewport.cssHeight}px`;
  }

  function buildBackend() {
    applyCanvasSize();
    if (options.mode === "webgl") {
      backend = createWebGLBackend(canvas, {
        isMobile: viewport.isMobile,
        reducedMotion,
      });
    }
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
    scrollRef.current = readScroll();
    // In static modes a scroll still needs a redraw to reposition the scene.
    if (!running) drawOnce(0);
  }

  function onResize() {
    viewport = computeViewport();
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
