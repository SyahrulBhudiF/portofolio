# Pixel Parallax Research Notes

Context: portfolio background theme, fully procedural pixel-art Canvas 2D v1, sprite-ready later.

## Source Links

### Canvas 2D Performance

- MDN — Optimizing canvas: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
- web.dev — Improving HTML5 Canvas performance: https://web.dev/articles/canvas-performance
- web.dev — OffscreenCanvas: https://web.dev/articles/offscreen-canvas
- Chrome modern guidance — efficient background processing: https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/guides/performance/efficient-background-processing/guide.md

### Pixel-Art Canvas

- MDN — Crisp pixel art look with `image-rendering`: https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look
- CSS-Tricks — Keep pixelated images pixelated: https://css-tricks.com/keep-pixelated-images-pixelated-as-they-scale/
- Sharp canvases: https://soledadpenades.com/posts/2024/sharp-canvases/

### Procedural Generation

- Procedural sky texture / value noise: https://www.ojambo.com/javascript-procedural-sky-texture
- Procedural terrain / Perlin noise: https://sakimyto.com/en/blog/perlin-noise-terrain
- Terrain generation concepts: https://lumitree.art/blog/terrain-generation

### Future WebGL / Shader Direction

- MDN — WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- Paper Shaders performance: https://paper-design-shaders.mintlify.app/guides/performance
- React Bits WebGL perf PR: https://github.com/DavidHDev/react-bits/pull/908

## Findings

## 1. Canvas 2D is right for v1

Canvas 2D is simpler than WebGL and enough for:

- low-res pixel-art background
- stars
- moon
- blocky clouds
- mountain silhouettes
- scroll parallax

Performance risk comes from drawing too many pixels/objects at full viewport resolution. Avoid that by rendering to a low internal resolution and upscaling.

## 2. Pixel art requires low-res + nearest-neighbor upscale

Canvas has two sizes:

- internal bitmap size: actual drawing resolution
- CSS size: displayed size

For pixel art, keep internal small and CSS full viewport.

Required CSS:

```css
.pixel-parallax-scene {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

Required canvas setup:

```ts
ctx.imageSmoothingEnabled = false;
```

Avoid fractional scaling where possible. For responsive fullscreen backgrounds, exact integer scaling may not always happen, but low-res + `image-rendering: pixelated` is good enough.

## 3. Use procedural generation for no-asset v1

Because no hand-drawn sprite work now, v1 should generate objects from code:

- stars: seeded random points/grid cells
- moon: blocky circle + procedural crater circles
- clouds: grouped block circles / value noise threshold
- mountains: 1D noise ridge line, fill below
- dither: hash/checker pattern

Procedural does not mean random every render. Use deterministic seed so scene stays stable.

## 4. Scroll must not cause React re-render

Bad:

```ts
setScroll(window.scrollY);
```

Good:

```ts
scrollRef.current = window.scrollY / maxScroll;
```

Draw loop reads refs. React state is only for setup, never per frame.

## 5. Pause aggressively

Animation should pause/reduce work when:

- `document.hidden`
- `prefers-reduced-motion: reduce`
- component unmounted
- optional: canvas/section offscreen if not fixed

For fixed full-page background, IntersectionObserver is less useful because canvas is always visible. But `document.visibilitychange` and reduced motion are required.

## 6. OffscreenCanvas is optional, not v1

OffscreenCanvas can move rendering to worker, but adds complexity. Do not use in v1.

Add later only if:

- canvas draw causes input jank
- scene grows expensive
- mobile perf bad after low-res tuning

## 7. Future WebGL is optional

WebGL helps if:

- procedural noise becomes expensive in Canvas 2D
- many sprite instances/layers are needed
- shader effects/dithering become complex

Do not start there. Lock art direction first with Canvas 2D.

## Implementation Implications

- One canvas only.
- One RAF owner.
- Passive scroll listener.
- Resize observer/window resize only updates canvas dimensions.
- Low internal resolution buckets:
  - mobile: ~240x135 or 320x180
  - desktop: ~480x270 or 640x360
- Generate static scene data once per size/seed, not per frame.
- Per frame only:
  - clear
  - draw sky
  - draw precomputed stars with twinkle
  - draw procedural layers with scroll offsets

## Main Risk

Procedural clouds. Stars/moon/mountains are easy. Clouds need tuning to avoid looking like random blobs.

Mitigation:

- Use cluster-based cloud objects first, not heavy noise.
- Each cloud = 5-12 blocky circles/rects.
- Use 2-3 color bands.
- Add slow horizontal drift.
- Later replace near clouds with sprites if desired.
