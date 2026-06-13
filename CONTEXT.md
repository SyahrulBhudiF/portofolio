# Portfolio Parallax Theme Context

## Supporting Docs

Read these before implementation:

1. [`docs/pixel-parallax-research.md`](docs/pixel-parallax-research.md) — research notes, source links, performance constraints, pixel-art canvas rules.
2. [`docs/pixel-parallax-implementation.md`](docs/pixel-parallax-implementation.md) — concrete file plan, renderer API, scene types, procedural object plan, migration checklist.
3. [`docs/pixel-parallax-shaders.md`](docs/pixel-parallax-shaders.md) — future WebGL/shader plan, GLSL object formulas, shader performance best practices, links.

## Goal

Build new portfolio background theme:

1. Top: space sky — stars + moon.
2. Middle: cloud layers.
3. Bottom: mountains.

Style: pixel-art / retro game diorama.

Chosen v1 direction: WebGL-first procedural pixel shader renderer. No hand-drawn sprites required now. Keep architecture sprite-ready so future sprite/texture assets can replace procedural objects without rewriting the scene system. Canvas 2D is fallback only, not primary path.

Current implementation is too manual:

- `src/components/StarBackground.tsx` creates random DOM stars.
- `src/components/CloudParallax.tsx` moves several PNG images with Framer Motion.
- `src/components/MountainSVG.tsx` renders static SVG layers.

Target implementation: one cohesive parallax scene rendered through WebGL on a single canvas. V1 uses procedural GLSL shaders for sky/stars/moon/clouds/mountains. Later versions can add sprite/texture atlas layers without changing the public component.

## Important Clarification

Shader is not only decorative backdrop gradient.

Shader/canvas should be responsible for:

- rendering objects: stars, moon, clouds, mountains
- moving/parallaxing objects based on scroll
- animating subtle ambient motion
- keeping DOM light

HTML content stays normal above it.

## Research Notes

Detailed research with links lives in [`docs/pixel-parallax-research.md`](docs/pixel-parallax-research.md). Summary below.

### Parallax Performance

Chrome guidance: avoid scroll-event repaint-heavy parallax like `background-position`. Prefer compositor-friendly transforms/CSS 3D for DOM parallax. For many visual layers or many objects, DOM becomes heavy.

Implication here:

- If using DOM: only few layers, transform-only.
- If using many stars/cloud pixels: canvas/WebGL better.

### Canvas vs WebGL

Canvas 2D is CPU raster. Good for simple sprites and moderate object counts.

WebGL is GPU pipeline. Better for:

- many repeated objects
- full-screen effects
- per-pixel shader effects
- compositing many layers
- animating without many DOM nodes

Implication here:

- Pixel-art scene can start with Canvas 2D if simple.
- WebGL shader better long-term for scalable animated background.
- Avoid overbuilding with Three.js unless 3D meshes needed.

### Shader Performance Rules

Good practices from shader perf examples:

- Pause RAF when scene offscreen.
- Pause/reduce work when document hidden.
- Respect `prefers-reduced-motion`.
- Avoid React state per frame.
- Store mutable animation data in refs.
- Only resize canvas on resize/DPR change.
- Cap DPR on mobile, e.g. `Math.min(devicePixelRatio, 1.5)`.
- Use lower FPS / fewer layers on mobile.
- Static shader: no RAF after initial render.

## Proposed Architecture

Create one scene component:

```txt
src/components/PixelParallaxScene.tsx
```

It owns one fixed fullscreen canvas behind page sections.

Decision: use fixed canvas + scroll/section uniforms. Scene changes per section through shader state, not by mounting separate canvases.

Section timeline intent:

- Home: strongest space/stars/moon presence.
- About: parallax continues naturally, moon can drift/fade until About area only.
- Later sections: reduce celestial objects; keep darker pixel sky/ambient depth so content remains readable.

Do not use a full document-height canvas unless fixed canvas + section uniforms cannot express the desired timeline.

```txt
Layout.astro
  <PixelParallaxScene client:load />
  <slot />
  <Navbar />
```

Canvas z-index below content:

```css
.pixel-parallax-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

main/content sections {
  position: relative;
  z-index: 1;
}
```

Need ensure body background transparent/dark enough.

## Scene Model

Use scroll progress `0..1` over full page.

Layer order, far to near:

1. Sky gradient / space color.
2. Stars.
3. Moon.
4. Distant cloud wisps.
5. Near clouds.
6. Distant mountains.
7. Near mountains.
8. Optional foreground haze/noise.

Each layer gets parallax factor:

```ts
type SceneLayer = {
  name: string;
  depth: number;        // lower = farther
  scrollFactor: number; // movement from scroll
  speed: number;        // ambient animation
  opacity: number;
};
```

Example:

```ts
const layers = {
  stars: { scrollFactor: 0.05, speed: 0.02 },
  moon: { scrollFactor: 0.12, speed: 0.00 },
  farClouds: { scrollFactor: 0.28, speed: 0.03 },
  nearClouds: { scrollFactor: 0.45, speed: 0.05 },
  farMountains: { scrollFactor: 0.62, speed: 0.00 },
  nearMountains: { scrollFactor: 0.85, speed: 0.00 },
};
```

Moon rule: visible from Home through About only. It should drift slowly upward/sideways and fade out after About, instead of staying visible across the full page.

## Rendering Strategy

### Fallback Only — Procedural Canvas 2D Pixel Renderer

Pros:

- Fast to implement.
- Easy pixel shapes.
- No GLSL complexity.
- Good enough for portfolio if object count moderate.

How:

- `<canvas>` with 2D context.
- Disable smoothing:

```ts
ctx.imageSmoothingEnabled = false;
```

- Draw at low internal resolution, upscale with CSS:

```ts
const pixelScale = isMobile ? 3 : 2;
canvas.width = Math.floor(width / pixelScale);
canvas.height = Math.floor(height / pixelScale);
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
```

- Draw blocky stars, moon, clouds, mountain polygons.
- Generate every object from deterministic code/noise. No image drawing required.
- Keep object/layer APIs compatible with future sprite renderers.

V1 procedural objects:

- Stars: seeded random grid, square pixels, optional plus clusters.
- Moon: distance-field circle with procedural crater masks.
- Clouds: generated block clusters/metaballs/noise blobs with stepped colors.
- Mountains: jagged ridge from 1D noise, layered silhouettes.
- Dither/noise: checker/hash pattern for retro texture.

Cons:

- CPU work every frame.
- Complex shader-like effects harder.
- Procedural shapes can look generic unless tuned.

### Chosen V1 — WebGL Fragment Shader Scene

Detailed shader guidance lives in [`docs/pixel-parallax-shaders.md`](docs/pixel-parallax-shaders.md).

Pros:

- True shader scene.
- GPU handles full-screen rendering.
- Easy procedural stars/noise/cloud masks.
- One draw call possible.

How:

- Fullscreen quad.
- Fragment shader receives uniforms:

```glsl
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scroll;
uniform float u_dpr;
uniform float u_motion;
```

- Use functions:

```glsl
float hash(vec2 p);
float noise(vec2 p);
float pixelGrid(vec2 uv, float size);
float starField(vec2 uv, float scroll);
float moon(vec2 uv, float scroll);
float cloudLayer(vec2 uv, float scroll, float depth);
float mountainLayer(vec2 uv, float scroll, float depth);
```

- Pixel style by quantizing UV:

```glsl
vec2 pixelate(vec2 uv, float pixels) {
  return floor(uv * pixels) / pixels;
}
```

Cons:

- More complex to debug.
- Textures/sprites need WebGL texture setup.

### Recommendation

Start WebGL-first to avoid later renderer refactor. Keep Canvas 2D as fallback only.

Design renderer abstraction:

```ts
type RendererMode = "webgl" | "canvas2d";
type LayerKind = "shader" | "sprite" | "procedural";
```

Fallback/evolution rules:

- V1: WebGL procedural fragment shader primary.
- Canvas 2D fallback only when WebGL unavailable/context lost.
- Future sprites: add sprite/texture atlas layers without changing scene/component contract.
- `prefers-reduced-motion` -> render static frame, no RAF.
- mobile -> keep parallax but lighter: lower framebuffer resolution, fewer noise octaves, lower FPS cap, subtler cloud drift.

## Pixel-Art Direction

Visual rules:

- Low internal resolution, upscale crisp.
- No smooth gradients on objects; use stepped bands/dither.
- Stars are square pixels or plus-shaped clusters.
- Moon is blocky circle using thresholded distance + dither craters.
- Clouds are merged rounded block clusters, not soft blurred blobs.
- Mountains are jagged polygon silhouettes with 2-3 color bands.
- Palette: use dark blue-black night base with controlled purple accents, not full purple wash. Reason: easier to blend with current polished portfolio sections while keeping retro identity.

Possible palette:

```ts
const palette = {
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
};
```

## Interaction Model

Inputs:

- scroll progress
- viewport size
- time
- reduced motion
- pointer optional, very subtle only desktop

Do not bind React state to frame loop.

Use refs:

```ts
const scrollRef = useRef(0);
const timeRef = useRef(0);
const rafRef = useRef<number | null>(null);
```

Scroll update:

```ts
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollRef.current = max > 0 ? window.scrollY / max : 0;
}
```

Frame loop:

```ts
function frame(now: number) {
  draw({ time: now * 0.001, scroll: scrollRef.current });
  rafRef.current = requestAnimationFrame(frame);
}
```

Pause conditions:

- `document.hidden`
- canvas not visible via IntersectionObserver if not fixed
- reduced motion
- component unmounted

## Integration Plan

Detailed implementation guide lives in [`docs/pixel-parallax-implementation.md`](docs/pixel-parallax-implementation.md).

Replace these over time:

- `StarBackground.tsx` -> remove after new scene covers About sky.
- `CloudParallax.tsx` -> remove after cloud layer exists in scene.
- `MountainSVG.tsx` -> remove after mountain layer exists in scene.

New files for V1:

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

Future sprite/texture files:

```txt
src/lib/pixelScene/sprites.ts
src/lib/pixelScene/atlas.ts
```

Keep one public component small. Move renderer internals to `src/lib/pixelScene`.

## Implementation Sketch

```tsx
export default function PixelParallaxScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = createPixelSceneRenderer(canvas, {
      mode: "webgl",
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });

    renderer.start();
    return () => renderer.destroy();
  }, []);

  return <canvas ref={canvasRef} className="pixel-parallax-scene" aria-hidden="true" />;
}
```

Renderer API:

```ts
type PixelSceneRenderer = {
  start(): void;
  stop(): void;
  resize(): void;
  destroy(): void;
};
```

## Procedural Object Notes

### Stars

Procedural grid cells:

- quantize UV into star cells
- hash cell id
- if hash above threshold, draw square star
- twinkle via slow sine, only opacity change

### Moon

- position in sky layer
- distance field circle, then pixelated UV
- craters from hash/noise masks
- scroll factor smaller than clouds

### Clouds

- use noise threshold in horizontally stretched UV
- quantize before noise for pixel chunks
- multiple layers with different scale/speed
- alpha mask hard-edged or 2-3 stepped opacity levels

### Mountains

- use 1D value noise over x to create ridge line
- fill below ridge
- multiple layers with different heights/colors
- quantize x/y for jagged pixel effect

## Sprite-Ready Structure

V1 uses no sprite textures, but layer contracts must make sprites easy later.

Use scene objects like this:

```ts
type SceneObject =
  | {
      kind: "procedural";
      id: string;
      layer: string;
      draw: ProceduralDrawFn;
      parallax: number;
    }
  | {
      kind: "sprite";
      id: string;
      layer: string;
      spriteId: string;
      x: number;
      y: number;
      scale: number;
      parallax: number;
    };
```

Renderer should not care whether moon/cloud/mountain is procedural or sprite. It should iterate layer objects and call matching draw path.

Future sprite examples:

- Replace procedural moon with `spriteId: "moon-main"`.
- Replace near procedural clouds with `cloud-a`, `cloud-b`, `cloud-c` sprite variants.
- Keep far clouds procedural for cheap atmospheric depth.
- Replace near mountain ridge with tiled mountain sprite chunks.

Important: no hardcoded `drawMoon()` calls inside component. Put object list in scene config so object implementation can be swapped.

## Performance Budget

Target:

- Desktop: 60 FPS possible.
- Mobile: 30 FPS acceptable.
- No frame loop when reduced motion.
- No layout thrash.
- No per-star DOM.
- No React re-render per frame.

Constraints:

- One canvas.
- One RAF owner.
- One scroll listener passive.
- WebGL framebuffer resolution low/capped for pixel-art.
- DPR capped / render scale controlled.
- Shader uniforms updated once per frame only.
- Sprite-ready but no sprite asset loading in V1.

## Risks

- Fullscreen fragment shader can become GPU-heavy if noise is too complex or framebuffer too large.
- Procedural clouds can look generic without tuning.
- WebGL context loss/restoration must be handled.
- Future sprites need atlas/loading pipeline, but architecture should already support object kind swapping.
- Fixed canvas behind whole page needs careful z-index with sections.
- Pixel aesthetic can conflict with existing polished/gradient sections unless background colors updated.

## Migration Order

1. Add `PixelParallaxScene` behind current content, no removals.
2. Implement optimized WebGL procedural fragment shader renderer.
3. Add Canvas 2D fallback only for WebGL unavailable/context lost.
4. Keep scene object/layer config sprite-ready.
5. Remove `StarBackground`, `CloudParallax`, `MountainSVG` usage after visual approval.
6. Tune section backgrounds to let scene show through.
7. Later optional: add sprite atlas for moon/cloud/mountain hero objects.
8. Run `npm run build` and `npm run check`.

## Decisions / Remaining Questions

Resolved:

1. Scene uses fixed fullscreen WebGL canvas with scroll/section uniforms; scene changes per section in shader.
2. Moon appears from Home through About only, drifting/fading naturally instead of staying global.
3. Mobile keeps parallax but lighter: lower resolution, fewer noise octaves, lower FPS/subtler drift.
4. Palette is dark blue-black night base with subtle purple accents.
5. Cloud style is pixel/blocky, not misty/noise-soft.
6. Old visual components are not mounted in the page after WebGL scene integration, but source files are not deleted.
7. Future sprite priority is intentionally deferred; decide later after procedural WebGL v1 exists.

Remaining: none for WebGL v1 implementation.
