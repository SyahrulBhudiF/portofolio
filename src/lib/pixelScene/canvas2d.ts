import gunug1 from "@/assets/pixelScene/gunug1.png";
import gunug2 from "@/assets/pixelScene/gunug2.png";
import gunug3 from "@/assets/pixelScene/gunug3.png";
import gunug4 from "@/assets/pixelScene/gunug4.png";
import gunug5 from "@/assets/pixelScene/gunug5.png";
import moonImage from "@/assets/pixelScene/moon.png";
import { pixelScenePalette as P } from "./palette";
import type { SceneBackend, SceneFrame, SceneViewport } from "./types";

const MOUNTAIN_LAYERS = [
  { image: gunug5, parallax: 0.08 },
  { image: gunug4, parallax: 0.16 },
  { image: gunug3, parallax: 0.28 },
  { image: gunug2, parallax: 0.44 },
  { image: gunug1, parallax: 0.64 },
] as const;

// Deterministic hash so the fallback scene is stable across redraws.
function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Static Canvas 2D fallback used when WebGL is unavailable or context is lost.
 * Intentionally simple: sky gradient + blocky stars + moon + mountain bands.
 * It does not animate (draw is idempotent for a given viewport/scroll).
 */
export function createCanvas2DBackend(canvas: HTMLCanvasElement): SceneBackend | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;
  const moon = new Image();
  const mountains = MOUNTAIN_LAYERS.map(({ image }) => {
    const mountain = new Image();
    mountain.src = image.src;
    return mountain;
  });
  moon.src = moonImage.src;
  let vp: SceneViewport | null = null;
  let lastFrame: SceneFrame | null = null;

  const backend = {
    resize(viewport) {
      vp = viewport;
    },
    draw(frame: SceneFrame) {
      lastFrame = frame;
      const v = vp ?? frame.viewport;
      const w = v.bufferWidth;
      const h = v.bufferHeight;
      const scroll = frame.scroll;

      // sky gradient
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, P.skyTop);
      g.addColorStop(0.55, P.skyMid);
      g.addColorStop(1, P.skyLow);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // stars (top portion only)
      ctx.fillStyle = P.star;
      const cols = 70;
      const rows = 40;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (hash(i, j) > 0.978) {
            const sx = Math.floor((i / cols) * w);
            const sy = Math.floor((j / rows) * h * 0.6);
            ctx.fillRect(sx, sy, 2, 2);
          }
        }
      }

      // moon (fades out by ~34% scroll)
      const fade = 1 - Math.min(1, Math.max(0, (scroll - 0.14) / 0.2));
      if (fade > 0.01) {
        ctx.globalAlpha = fade;
        const size = Math.round(h * 0.18);
        const mx = Math.round(w * 0.78 - size * 0.5);
        const my = Math.round(h * (0.26 - scroll * 0.18) - size * 0.5);
        if (moon.complete && moon.naturalWidth > 0) {
          ctx.drawImage(moon, mx, my, size, size);
        } else {
          ctx.fillStyle = P.moonLight;
          ctx.beginPath();
          ctx.arc(mx + size * 0.5, my + size * 0.5, size * 0.48, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Mountain sprites, far (gunug5) to near (gunug1).
      for (let i = 0; i < mountains.length; i += 1) {
        const mountain = mountains[i];
        if (!mountain.complete || mountain.naturalWidth === 0) continue;
        const layer = MOUNTAIN_LAYERS[i];
        const height = Math.ceil(h * (v.isMobile ? 0.36 : 0.6));
        const width = Math.ceil(height * (1580 / 530));
        const x = Math.round((w - width) * 0.5);
        const y = Math.round(h - height - scroll * layer.parallax * h * 0.18);
        ctx.drawImage(mountain, x, y, width, height);
      }
    },
    destroy() {
      vp = null;
      lastFrame = null;
      moon.onload = null;
      for (const mountain of mountains) mountain.onload = null;
    },
  } satisfies SceneBackend;

  const redraw = () => {
    if (lastFrame) backend.draw(lastFrame);
  };
  moon.onload = redraw;
  for (const mountain of mountains) mountain.onload = redraw;

  return backend;
}
