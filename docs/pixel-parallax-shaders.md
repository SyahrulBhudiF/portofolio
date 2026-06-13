# Pixel Parallax Shader Notes

Use this for the chosen V1 renderer: WebGL-first procedural pixel shader. Canvas 2D is fallback only.

## Source Links / Best Practices

### WebGL fundamentals

- WebGL shaders and GLSL: https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
- WebGL fundamentals: https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html
- WebGL animation: https://webglfundamentals.org/webgl/lessons/webgl-animation.html
- MDN basic WebGL animation: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Basic_2D_animation_example

### WebGL / shader performance

- MDN WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- Emscripten Optimizing WebGL: https://emscripten.org/docs/optimizing/Optimizing-WebGL.html
- WebGL cross-platform issues: https://webglfundamentals.org/webgl/lessons/webgl-cross-platform-issues.html
- Apple OpenGL ES shader best practices: https://developer.apple.com/library/archive/documentation/3DDrawing/Conceptual/OpenGLES_ProgrammingGuide/BestPracticesforShaders/BestPracticesforShaders.html
- OpenGL Wiki GLSL optimizations: https://wikis.khronos.org/opengl/GLSL_Optimizations
- NVIDIA OpenGL ES programming tips: https://docs.nvidia.com/jetson/archives/r35.4.1/DeveloperGuide/text/SD/Graphics/GraphicsProgramming/OpenglEsProgrammingTips.html
- Paper Shaders performance: https://paper-design-shaders.mintlify.app/guides/performance
- React Bits WebGL perf PR / pause RAF offscreen: https://github.com/DavidHDev/react-bits/pull/908

### Procedural shader references

- Boreal Starry Night WebGL/ShaderToy: https://github.com/BrutPitt/BorealStarryNight
- Shadertoy 2D Clouds: https://www.shadertoy.com/view/4tdSWr
- Shadertoy Clouds: https://www.shadertoy.com/view/XslGRr
- Shadertoy Mountains: https://www.shadertoy.com/view/4slGD4
- OneShader random mountains: https://oneshader.net/shader/e0d363a2f4

## Decision

Implement shader first.

V1 is **WebGL-first procedural pixel shader renderer**.

Canvas 2D is fallback only if:

- WebGL unavailable.
- WebGL context lost and restore fails.
- Static/debug fallback needed.

Reason: user explicitly prefers GPU now to avoid Canvas -> WebGL refactor later.

## Locked V1 Choices

- One fixed fullscreen WebGL canvas.
- One WebGL context.
- One primary fullscreen fragment shader/program for v1.
- Scene changes per section via scroll/section uniforms.
- Moon visible from Home through About only, then drift/fade out.
- Mobile keeps parallax, but lighter: lower framebuffer, fewer noise octaves, lower FPS/subtler drift.
- Palette: dark blue-black night base with subtle purple accents.
- Clouds: pixel/blocky, not soft mist.
- Canvas 2D fallback only.
- Old visual components should stop mounting, but source files stay.
- Future sprite priority is deferred.

Recommended palette:

```glsl
const vec3 SKY_TOP = vec3(0.012, 0.016, 0.051);    // #03040d
const vec3 SKY_MID = vec3(0.035, 0.078, 0.169);    // #09142b
const vec3 SKY_LOW = vec3(0.090, 0.098, 0.200);    // #171933
const vec3 STAR = vec3(0.937, 0.910, 1.000);       // #efe8ff
const vec3 STAR_DIM = vec3(0.561, 0.612, 0.800);   // #8f9ccc
const vec3 MOON_LIGHT = vec3(0.953, 0.875, 0.667); // #f3dfaa
const vec3 MOON_SHADOW = vec3(0.616, 0.533, 0.380);// #9d8861
const vec3 CLOUD_LIGHT = vec3(0.784, 0.827, 0.949);// #c8d3f2
const vec3 CLOUD_MID = vec3(0.498, 0.553, 0.741);  // #7f8dbd
const vec3 CLOUD_DARK = vec3(0.224, 0.267, 0.408); // #394468
const vec3 PURPLE_ACCENT = vec3(0.486, 0.361, 1.0);// #7c5cff
const vec3 MOUNTAIN_FAR = vec3(0.149, 0.192, 0.302);// #26314d
const vec3 MOUNTAIN_MID = vec3(0.106, 0.133, 0.220);// #1b2238
const vec3 MOUNTAIN_NEAR = vec3(0.043, 0.051, 0.094);// #0b0d18
```

## Shader Renderer Goal

Same public scene contract across primary/fallback renderers:

```ts
type RendererMode = "webgl" | "canvas2d";
```

`PixelParallaxScene` should not change if fallback renderer is used. Only renderer factory decides primary/fallback.

```ts
createPixelSceneRenderer(canvas, { mode: "webgl", seed, reducedMotion })
```

## Mental Model

WebGL renderer draws one fullscreen quad. Fragment shader computes color for every pixel.

Input uniforms:

```glsl
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scroll;
uniform float u_pixelGrid;
uniform float u_motion;
uniform float u_quality;
```

Fragment order:

```glsl
vec3 color = drawSky(uv);
color = drawStars(color, uv, u_scroll, u_time);
color = drawMoon(color, uv, u_scroll);
color = drawClouds(color, uv, u_scroll, u_time);
color = drawMountains(color, uv, u_scroll);
outColor = vec4(color, 1.0);
```

## Pixel-Art Shader Technique

Pixel-art is made by quantizing UV before shape tests:

```glsl
vec2 pixelate(vec2 uv, float grid) {
  return floor(uv * grid) / grid;
}
```

Use pixelated UV for objects:

```glsl
vec2 p = pixelate(uv, u_pixelGrid);
```

Avoid smooth antialiasing for object edges. Prefer `step()` and 2-3 band colors.

## Procedural Objects in GLSL

### Hash

```glsl
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
```

### Value Noise

```glsl
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
```

### Stars

Grid-cell stars:

```glsl
vec2 cell = floor(uv * vec2(120.0, 70.0));
float rnd = hash(cell);
float exists = step(0.985, rnd);
vec2 local = fract(uv * vec2(120.0, 70.0));
float shape = step(abs(local.x - 0.5), 0.08) * step(abs(local.y - 0.5), 0.08);
float twinkle = 0.7 + 0.3 * sin(u_time * 2.0 + rnd * 20.0);
float star = exists * shape * twinkle;
```

### Moon

Distance field circle:

```glsl
float circle(vec2 p, vec2 center, float radius) {
  return 1.0 - step(radius, distance(p, center));
}

float moon = circle(p, vec2(0.78, 0.22 + u_scroll * 0.04), 0.08);
float crater = circle(p, vec2(0.75, 0.20 + u_scroll * 0.04), 0.018);
vec3 moonColor = mix(moonLight, moonShadow, crater * 0.6);
color = mix(color, moonColor, moon);
```

### Clouds

Pixelated noise threshold:

```glsl
vec2 cloudUv = pixelate(uv * vec2(2.5, 1.0), 90.0);
cloudUv.x += u_time * 0.015;
cloudUv.x += u_scroll * depth;
float n = noise(cloudUv * 4.0);
float cloudA = step(0.55, n);
float cloudB = step(0.48, n) * 0.45;
```

For pixel style, keep thresholds hard. Avoid blur.

### Mountains

1D ridge from noise:

```glsl
float ridgeNoise(float x) {
  return noise(vec2(x, 0.0));
}

float ridge = 0.72 + ridgeNoise(p.x * 5.0 + u_scroll * 0.2) * 0.12;
float mountain = step(ridge, p.y);
color = mix(color, mountainColor, mountain);
```

## Best Practices for This Project

### Keep shader simple

Fullscreen fragment shader runs for every pixel. Expensive code multiplies by screen pixel count.

Do:

- low render resolution / pixel grid
- simple hash/value noise
- few noise octaves
- `step`/`mix` instead of complex branch trees
- one fullscreen draw call
- uniform updates only once per frame

Avoid:

- many `sin`, `pow`, `exp`, `log` calls in hot paths
- deep nested loops
- high octave FBM clouds on mobile
- recompiling shader on props/state changes
- allocating buffers/textures per frame
- reading pixels from GPU

### Precision

Use explicit precision in fragment shader:

```glsl
precision mediump float;
```

Use `highp` only where needed for coordinate/time accuracy. Mobile GPUs benefit from lower precision when acceptable.

### Branching

Prefer branchless masks:

```glsl
float mask = step(edge, value);
color = mix(color, target, mask);
```

Avoid large dynamic `if/else` inside fragment shader. Small uniform-based branches can be okay, but do not rely on it for mobile.

### Device Pixel Ratio

Do not blindly render at full DPR. Cap resolution.

```ts
const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
```

For pixel-art shader, prefer lower framebuffer resolution + CSS upscale.

### RAF / lifecycle

- Start RAF only when needed.
- Stop RAF on unmount.
- Stop/pause on `document.hidden`.
- If `prefers-reduced-motion`, draw static frame only.
- Do not update React state per frame.

### Context loss

Handle WebGL context loss:

```ts
canvas.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  renderer.stop();
});

canvas.addEventListener("webglcontextrestored", () => {
  renderer.recreate();
  renderer.start();
});
```

### Cross-platform

Do not assume desktop GPU capability. Test:

- low-end Android
- Safari/iOS
- Firefox
- reduced motion
- tab hidden/resume

## WebGL File Shape

Future files:

```txt
src/lib/pixelScene/webgl.ts
src/lib/pixelScene/shaders.ts
```

`shaders.ts`:

```ts
export const vertexShaderSource = `...`;
export const fragmentShaderSource = `...`;
```

`webgl.ts`:

```ts
export function createWebGLRenderer(canvas, options): PixelSceneRenderer {
  // compile shaders once
  // create fullscreen quad once
  // cache uniform locations
  // update u_time/u_scroll/u_resolution per frame
  // drawArrays TRIANGLES
}
```

## WebGL-First Acceptance Gate

Before removing old visual components, WebGL v1 must prove:

1. Stable FPS on desktop and mobile at capped framebuffer resolution.
2. Clouds read as intentional pixel clouds, not random blobs.
3. Palette works behind current sections.
4. Reduced motion renders static frame.
5. Hidden tab pauses RAF.
6. WebGL context loss has fallback/recovery path.

Implementation formulas should stay deterministic:

- normalized coordinates
- seed/hash-based procedural shapes
- layer parallax values
- palette constants
