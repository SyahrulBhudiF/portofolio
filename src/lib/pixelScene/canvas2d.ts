import { pixelScenePalette as P } from "./palette";
import type { SceneBackend } from "./webgl";
import type { SceneFrame, SceneViewport } from "./types";

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
  let vp: SceneViewport | null = null;

  const px = (c: [number, number, number]) =>
    `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;

  return {
    resize(viewport) {
      vp = viewport;
    },
    draw(frame: SceneFrame) {
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
        ctx.fillStyle = P.moonLight;
        const mx = w * 0.78;
        const my = h * (0.26 - scroll * 0.18);
        const r = h * 0.085;
        ctx.beginPath();
        ctx.arc(mx, my, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // mountain bands (far -> near)
      const bands: Array<[string, number, number]> = [
        [P.mountainFar, 0.78, 4.0],
        [P.mountainMid, 0.86, 6.0],
        [P.mountainNear, 0.93, 9.0],
      ];
      for (const [color, baseY, scale] of bands) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 2) {
          const n = hash(Math.floor((x / w) * scale * 8), 0) * 0.12;
          const y = (baseY - n) * h;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      }
    },
    destroy() {
      vp = null;
    },
  } satisfies SceneBackend;
}
