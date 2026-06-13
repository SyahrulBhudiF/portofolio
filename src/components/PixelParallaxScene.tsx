import { useEffect, useRef } from "react";
import { createPixelSceneRenderer } from "@/lib/pixelScene/renderer";

/**
 * Single fixed fullscreen WebGL pixel-art parallax background.
 * Renders sky/stars/moon/clouds/mountains procedurally and parallaxes on scroll.
 * Canvas 2D is used only as a fallback when WebGL is unavailable/lost.
 */
export default function PixelParallaxScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = createPixelSceneRenderer(canvas, {
      mode: "webgl",
      seed: 1337,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });

    renderer.start();
    return () => renderer.destroy();
  }, []);

  return <canvas ref={canvasRef} className="pixel-parallax-scene" aria-hidden="true" />;
}
