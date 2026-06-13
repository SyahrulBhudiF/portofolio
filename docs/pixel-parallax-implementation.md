# Pixel Parallax Implementation Guide

This doc is for future agents implementing `PixelParallaxScene`.

## Current Decision

Implement v1 as **WebGL-first procedural pixel shader renderer**.

No sprite assets required now.

Canvas 2D exists only as fallback if WebGL is unavailable or context is lost.

Structure must be **sprite-ready** so future moon/cloud/mountain sprites/textures can be added without rewriting the component. Future sprite priority is deferred.

## Files

Create:

```txt
src/components/PixelParallaxScene.tsx
src/lib/pixelScene/palette.ts
src/lib/pixelScene/types.ts
src/lib/pixelScene/scene.ts
src/lib/pixelScene/renderer.ts
src/lib/pixelScene/webgl.ts
src/lib/pixelScene/shaders.ts
src/lib/pixelScene/canvas2d.ts
```

Future only:

```txt
src/lib/pixelScene/sprites.ts
src/lib/pixelScene/atlas.ts
```

## Public Component

`PixelParallaxScene.tsx` should be small:

```tsx
import { useEffect, useRef } from "react";
import { createPixelSceneRenderer } from "@/lib/pixelScene/renderer";

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
```

## CSS

Add to global/components CSS:

```css
.pixel-parallax-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

Content sections must sit above:

```css
main,
section {
  position: relative;
  z-index: 1;
}
```

If section backgrounds hide the scene, use translucent backgrounds later.

## Renderer API

```ts
export type PixelSceneRenderer = {
  start(): void;
  stop(): void;
  resize(): void;
  destroy(): void;
};
```

Factory:

```ts
export function createPixelSceneRenderer(
  canvas: HTMLCanvasElement,
  options: PixelSceneOptions,
): PixelSceneRenderer;
```

## Core Types

```ts
export type RendererMode = "webgl" | "canvas2d";
export type LayerKind = "shader" | "sprite" | "procedural";

export type PixelSceneOptions = {
  mode: RendererMode;
  seed: number;
  reducedMotion: boolean;
};

export type SceneViewport = {
  cssWidth: number;
  cssHeight: number;
  bufferWidth: number;
  bufferHeight: number;
  pixelScale: number;
  isMobile: boolean;
};

export type SceneFrame = {
  viewport: SceneViewport;
  time: number;
  scroll: number;
};

export type Canvas2DSceneFrame = SceneFrame & {
  ctx: CanvasRenderingContext2D;
};

export type WebGLSceneFrame = SceneFrame & {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
};

export type SceneLayer = {
  id: string;
  order: number;
  parallax: number;
  opacity: number;
};

export type ProceduralObject = {
  kind: "procedural";
  id: string;
  layerId: string;
  draw: (frame: SceneFrame, object: ProceduralObject) => void;
};

export type SpriteObject = {
  kind: "sprite";
  id: string;
  layerId: string;
  spriteId: string;
  x: number;
  y: number;
  scale: number;
  parallax: number;
};

export type SceneObject = ProceduralObject | SpriteObject;
```

Important: v1 primarily uses shader/uniform composition, but keep `SceneObject` union so sprites/textures fit later.

## Scene Config

Do not hardcode renderer details in React component.

Use config:

```ts
export const sceneLayers: SceneLayer[] = [
  { id: "sky", order: 0, parallax: 0, opacity: 1 },
  { id: "stars", order: 1, parallax: 0.04, opacity: 1 },
  { id: "moon", order: 2, parallax: 0.1, opacity: 1 },
  { id: "far-clouds", order: 3, parallax: 0.22, opacity: 0.65 },
  { id: "near-clouds", order: 4, parallax: 0.45, opacity: 0.85 },
  { id: "far-mountains", order: 5, parallax: 0.62, opacity: 1 },
  { id: "near-mountains", order: 6, parallax: 0.85, opacity: 1 },
];
```

Then object list:

```ts
export function createSceneObjects(seed: number): SceneObject[] {
  return [
    createSkyObject(),
    createStarsObject(seed),
    createMoonObject(seed),
    createCloudLayerObject(seed, "far-clouds"),
    createCloudLayerObject(seed + 1, "near-clouds"),
    createMountainLayerObject(seed, "far-mountains"),
    createMountainLayerObject(seed + 1, "near-mountains"),
  ];
}
```

Future sprite replacement should be data/config-driven: add a sprite object/texture layer without changing `PixelParallaxScene`.

## WebGL Drawing Rules

### Pixel Scale / Framebuffer

Use fixed low framebuffer resolution. Do not render at full DPR.

Example:

```ts
const targetWidth = isMobile ? 320 : 480;
const aspect = cssHeight / cssWidth;
canvas.width = targetWidth;
canvas.height = Math.round(targetWidth * aspect);
canvas.style.width = `${cssWidth}px`;
canvas.style.height = `${cssHeight}px`;
gl.viewport(0, 0, canvas.width, canvas.height);
```

CSS keeps it crisp:

```css
.pixel-parallax-scene {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

### Shader Setup

Compile/link once. Cache uniform locations. Create fullscreen quad once. Per frame only update uniforms and draw.

Required uniforms:

```glsl
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scroll;
uniform float u_pixelGrid;
uniform float u_quality;
uniform float u_motion;
```

### Scroll Progress

```ts
function readScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}
```

Use ref, not React state.

### Animation Loop

```ts
function frame(now: number) {
  draw(now * 0.001, scrollRef.current);
  if (!reducedMotion) rafId = requestAnimationFrame(frame);
}
```

If reduced motion: draw once after resize/scroll or draw static frame.

## Procedural Shader Notes

### Stars

Use grid/hash stars in fragment shader. No per-star JS objects required for v1. Twinkle from `sin(u_time + hash(cell))`.

### Moon

Use distance field circle on pixelated UV. Craters are smaller procedural circles/hash masks.

### Clouds

Use pixelated value noise or cheap FBM with hard thresholds. Keep octaves low. Far clouds can be purely noise; near clouds may later become texture sprites.

### Mountains

Use 1D noise over `uv.x` to create ridge. Fill below ridge with `step()`. Layer multiple ridges with different parallax/depth colors.

## Performance Checklist

Required:

- one canvas
- one WebGL program for v1
- one fullscreen draw call per frame
- one RAF
- passive scroll listener
- no React state in RAF
- no DOM generated stars/clouds/mountains
- cleanup all listeners/RAF/WebGL resources
- `visibilitychange` pauses/resumes
- `prefers-reduced-motion` respected
- framebuffer resolution capped
- context loss/restoration handled
- shader compiled once, never per frame

Optional later:

- texture atlas for sprites
- multiple quality presets
- WebGL2 upgrade

## Locked V1 Choices

- One fixed fullscreen WebGL canvas.
- Scene changes per section via scroll/section uniforms.
- Moon visible from Home through About only, then drift/fade out.
- Mobile keeps parallax, but lighter: lower framebuffer, fewer noise octaves, lower FPS/subtler drift.
- Palette: dark blue-black night base with subtle purple accents.
- Clouds: pixel/blocky, not soft mist.
- Old visual components should stop mounting, but source files stay.

Recommended palette constants:

```ts
export const pixelScenePalette = {
  skyTop: "#03040d",
  skyMid: "#09142b",
  skyLow: "#171933",
  star: "#efe8ff",
  starDim: "#8f9ccc",
  moonLight: "#f3dfaa",
  moonShadow: "#9d8861",
  cloudLight: "#c8d3f2",
  cloudMid: "#7f8dbd",
  cloudDark: "#394468",
  purpleAccent: "#7c5cff",
  mountainFar: "#26314d",
  mountainMid: "#1b2238",
  mountainNear: "#0b0d18",
} as const;
```

## Migration Checklist

After `PixelParallaxScene` looks acceptable:

- Add to `src/layouts/Layout.astro`.
- Stop mounting `StarBackground` in `src/components/content/About.astro`, but do not delete the source file.
- Stop mounting `CloudParallax` in `src/components/content/Project.astro`, but do not delete the source file.
- Stop mounting `MountainSVG` in `src/components/content/Experience.astro`, but do not delete the source file.
- Tune section backgrounds opacity.
- Run `npm run build`.
- Run `npm run check`.
