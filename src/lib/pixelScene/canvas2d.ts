import awan1 from "@/assets/pixelScene/awan1.png";
import awan2 from "@/assets/pixelScene/awan2.png";
import awan3 from "@/assets/pixelScene/awan3.png";
import awan4 from "@/assets/pixelScene/awan4.png";
import awan5 from "@/assets/pixelScene/awan5.png";
import awan6 from "@/assets/pixelScene/awan6.png";
import awan7 from "@/assets/pixelScene/awan7.png";
import awan8 from "@/assets/pixelScene/awan8.png";
import awan9 from "@/assets/pixelScene/awan9.png";
import awan10 from "@/assets/pixelScene/awan10.png";
import awan11 from "@/assets/pixelScene/awan11.png";
import awan12 from "@/assets/pixelScene/awan12.png";
import moonImage from "@/assets/pixelScene/moon.png";
import mount1 from "@/assets/pixelScene/mount1.png";
import mount2 from "@/assets/pixelScene/mount2.png";
import mount3 from "@/assets/pixelScene/mount3.png";
import mount4 from "@/assets/pixelScene/mount4.png";
import { pixelScenePalette as P } from "./palette";
import type { SceneBackend, SceneFrame, SceneViewport } from "./types";

const CLOUD_LAYERS = [
  // Far: dark, high, and almost still.
  {
    image: awan3,
    x: -0.9,
    y: 0.77,
    scale: 0.58,
    parallax: 0.05,
    speed: -0.005,
    bob: 0.006,
    phase: 0.2,
    opacity: 0.56,
  },
  {
    image: awan5,
    x: 0.2,
    y: 0.63,
    scale: 0.68,
    parallax: 0.06,
    speed: -0.006,
    bob: 0.005,
    phase: 2.1,
    opacity: 0.56,
  },
  {
    image: awan7,
    x: 1.05,
    y: 0.8,
    scale: 0.52,
    parallax: 0.05,
    speed: -0.005,
    bob: 0.004,
    phase: 4.4,
    opacity: 0.52,
  },
  {
    image: awan8,
    x: -0.15,
    y: 0.49,
    scale: 0.62,
    parallax: 0.07,
    speed: -0.007,
    bob: 0.006,
    phase: 5.3,
    opacity: 0.58,
  },
  // Mid: muted cloud banks on the outer sides of the hero.
  {
    image: awan1,
    x: -1.08,
    y: 0.32,
    scale: 0.82,
    parallax: 0.12,
    speed: -0.011,
    bob: 0.008,
    phase: 1.3,
    opacity: 0.72,
  },
  {
    image: awan2,
    x: 1.12,
    y: 0.4,
    scale: 0.76,
    parallax: 0.13,
    speed: -0.012,
    bob: 0.007,
    phase: 3.6,
    opacity: 0.7,
  },
  {
    image: awan4,
    x: -0.72,
    y: 0.08,
    scale: 0.7,
    parallax: 0.14,
    speed: -0.013,
    bob: 0.008,
    phase: 5.1,
    opacity: 0.7,
  },
  {
    image: awan6,
    x: 0.82,
    y: 0.04,
    scale: 0.78,
    parallax: 0.15,
    speed: -0.014,
    bob: 0.007,
    phase: 0.7,
    opacity: 0.72,
  },
  // Near: pale low mist, intentionally hidden in part by mountains.
  {
    image: awan9,
    x: -1.15,
    y: -0.48,
    scale: 1.1,
    parallax: 0.24,
    speed: -0.021,
    bob: 0.009,
    phase: 2.7,
    opacity: 0.68,
  },
  {
    image: awan10,
    x: -0.02,
    y: -0.62,
    scale: 1.18,
    parallax: 0.26,
    speed: -0.023,
    bob: 0.009,
    phase: 4.1,
    opacity: 0.66,
  },
  {
    image: awan11,
    x: 0.98,
    y: -0.42,
    scale: 1.04,
    parallax: 0.25,
    speed: -0.022,
    bob: 0.008,
    phase: 5.8,
    opacity: 0.66,
  },
  {
    image: awan12,
    x: 0.45,
    y: -0.78,
    scale: 1.2,
    parallax: 0.28,
    speed: -0.024,
    bob: 0.009,
    phase: 1.6,
    opacity: 0.62,
  },
] as const;

const MOUNTAIN_LAYERS = [
  { image: mount4, parallax: 0.7, scale: 0.3 },
  { image: mount3, parallax: 0.8, scale: 0.2 },
  { image: mount2, parallax: 0.9, scale: 0.1 },
  { image: mount1, parallax: 1, scale: 0 },
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
  const clouds = CLOUD_LAYERS.map(({ image }) => {
    const cloud = new Image();
    cloud.src = image.src;
    return cloud;
  });
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

      const drawCloudRange = (start: number, end: number) => {
        for (let i = start; i < end; i += 1) {
          const cloud = clouds[i];
          if (!cloud.complete || cloud.naturalWidth === 0) continue;
          const layer = CLOUD_LAYERS[i];
          const cloudBaseSize = v.isMobile
            ? h * 0.06
            : Math.min(h * 0.13, Math.max(h * 0.09, w * 0.065));
          const height = Math.ceil(cloudBaseSize * layer.scale);
          const width = height * 2;
          const centerX = ((((layer.x + frame.time * layer.speed + 1.4) % 2.8) + 2.8) % 2.8) - 1.4;
          const x = Math.round(((centerX + 1) * w - width) * 0.5);
          const centerY =
            layer.y +
            (i >= 8 && !v.isMobile ? 0.18 : 0) +
            Math.sin(frame.time * 0.16 + layer.phase) * layer.bob -
            scroll * layer.parallax * 0.36;
          const y = Math.round((1 - centerY) * h * 0.5 - height * 0.5);
          ctx.globalAlpha = layer.opacity;
          ctx.drawImage(cloud, x, y, width, height);
          ctx.globalAlpha = 1;
        }
      };

      drawCloudRange(0, 8);

      // moon (fades out by ~34% scroll)
      const fade = 1 - Math.min(1, Math.max(0, (scroll - 0.14) / 0.2));
      if (fade > 0.01) {
        ctx.globalAlpha = fade;
        const size = Math.round(h * (v.isMobile ? 0.14 : 0.18));
        const mx = Math.round(w * 0.78 - size * 0.5);
        const my = Math.round(h * ((v.isMobile ? 0.36 : 0.26) - scroll * 0.18) - size * 0.5);
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

      const drawMountainRange = (start: number, end: number) => {
        for (let i = start; i < end; i += 1) {
          const mountain = mountains[i];
          if (!mountain.complete || mountain.naturalWidth === 0) continue;
          const layer = MOUNTAIN_LAYERS[i];
          const assetAspect = 1600 / 640;
          const minimumHeight = Math.ceil(h * (v.isMobile ? 0.43 : 0.6));
          const width = Math.ceil(Math.max(w * 1.04, minimumHeight * assetAspect));
          const height = Math.ceil(width / assetAspect);
          const x = Math.round((w - width) * 0.5);
          const y = Math.round(
            h - height - (v.isMobile ? 0 : scroll * layer.parallax * h),
          );
          ctx.drawImage(mountain, x, y, width, height);
          ctx.globalAlpha = 1;
        }
      };

      drawMountainRange(0, 2);
      drawCloudRange(8, CLOUD_LAYERS.length);
      drawMountainRange(2, MOUNTAIN_LAYERS.length);

      // Keep the mobile mountain horizon visible while sections scroll over it.
      const fillHeight = v.isMobile ? 0 : Math.round(h * scroll);
      ctx.fillStyle = P.mountainFill;
      ctx.fillRect(0, h - fillHeight, w, fillHeight);
    },
    destroy() {
      vp = null;
      lastFrame = null;
      moon.onload = null;
      for (const cloud of clouds) cloud.onload = null;
      for (const mountain of mountains) mountain.onload = null;
    },
  } satisfies SceneBackend;

  const redraw = () => {
    if (lastFrame) backend.draw(lastFrame);
  };
  moon.onload = redraw;
  for (const cloud of clouds) cloud.onload = redraw;
  for (const mountain of mountains) mountain.onload = redraw;

  return backend;
}
