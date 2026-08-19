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

const quadVertex = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_uv = (a_position + 1.0) * 0.5;
}
`;

const spriteVertex = `#version 300 es
in vec2 a_position;
uniform vec2 u_center;
uniform vec2 u_size;
out vec2 v_uv;
void main() {
  gl_Position = vec4(u_center + a_position * u_size, 0.0, 1.0);
  v_uv = vec2((a_position.x + 1.0) * 0.5, (1.0 - a_position.y) * 0.5);
}
`;

const spriteFragment = `#version 300 es
precision highp float;
uniform sampler2D u_texture;
uniform float u_opacity;
in vec2 v_uv;
out vec4 outColor;
void main() {
  vec4 color = texture(u_texture, v_uv);
  if (color.a < 0.01 || dot(color.rgb, color.rgb) < 0.0005) discard;
  outColor = vec4(color.rgb, color.a * u_opacity);
}
`;

const backgroundFragment = `#version 300 es
precision highp float;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scroll;
uniform float u_pixelGrid;
uniform float u_motion;
in vec2 v_uv;
out vec4 outColor;

const vec3 SKY_TOP   = vec3(0.039, 0.024, 0.059);
const vec3 SKY_MID   = vec3(0.125, 0.082, 0.161);
const vec3 SKY_LOW   = vec3(0.212, 0.114, 0.255);
const vec3 STAR      = vec3(0.937, 0.910, 1.000);
const vec3 STAR_DIM  = vec3(0.561, 0.612, 0.800);
const vec3 MOON_LIGHT  = vec3(0.953, 0.875, 0.667);
const vec3 MOON_SHADOW = vec3(0.616, 0.533, 0.380);
const vec3 PURPLE      = vec3(0.486, 0.361, 1.000);

vec3 drawSky(vec2 uv) {
  float t = clamp(uv.y + u_scroll * 0.12, 0.0, 1.0);
  vec3 col = mix(SKY_LOW, SKY_MID, smoothstep(0.0, 0.6, t));
  col = mix(col, SKY_TOP, smoothstep(0.45, 1.0, t));
  col += PURPLE * 0.045 * smoothstep(0.4, 0.0, uv.y);
  return col;
}

vec3 drawStars(vec3 col, vec2 uv, float aspect) {
  vec2 suv = uv;
  suv.x *= aspect;
  suv.y += u_scroll * 0.06;
  float density = smoothstep(0.12, 0.7, uv.y);
  vec2 grid = vec2(120.0, 80.0);
  vec2 cell = floor(suv * grid);
  float rnd = hash(cell);
  float portrait = smoothstep(1.05, 0.65, aspect);
  float exists = step(mix(0.978, 0.970, portrait), rnd);
  vec2 local = fract(suv * grid);
  float starSize = mix(0.12, 0.16, portrait);
  float shape = step(abs(local.x - 0.5), starSize) * step(abs(local.y - 0.5), starSize);
  float twinkle = 0.6 + 0.4 * sin(u_time * 1.5 + rnd * 30.0) * u_motion;
  float s = exists * shape * twinkle * density;
  vec3 starCol = mix(STAR_DIM, STAR, rnd);
  return mix(col, starCol, clamp(s, 0.0, 1.0));
}

vec3 drawMoon(vec3 col, vec2 uv, float aspect) {
  float fade = 1.0 - smoothstep(0.14, 0.34, u_scroll);
  vec2 c = vec2(0.78, 0.74 + u_scroll * 0.18);
  vec2 d = vec2((uv.x - c.x) * aspect, uv.y - c.y);
  float halo = (1.0 - smoothstep(0.095, 0.18, length(d))) * 0.18;
  return mix(col, MOON_LIGHT, halo * fade);
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  vec3 col = drawSky(uv);
  col = drawStars(col, uv, aspect);

  float scrim = smoothstep(0.5, 0.18, abs(uv.y - 0.5)) * 0.18;
  col = mix(col, col * 0.55, scrim);
  float dth = (hash(floor(gl_FragCoord.xy)) - 0.5) * (1.5 / 255.0);
  outColor = vec4(col + dth, 1.0);
}
`;

const fillFragment = `#version 300 es
precision highp float;
uniform float u_fillTop;
in vec2 v_uv;
out vec4 outColor;
void main() {
  if (v_uv.y > u_fillTop) discard;
  outColor = vec4(0.141, 0.090, 0.208, 1.0);
}
`;

const displayFragment = `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform float u_yOffset;
uniform vec2 u_screenSize;
in vec2 v_uv;
out vec4 outColor;

void main() {
  vec2 uv = v_uv;
  uv.y += u_yOffset / u_screenSize.y;
  outColor = texture(u_texture, uv);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[pixelScene] shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexSrc: string,
  fragmentSrc: string,
): WebGLProgram | null {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSrc);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[pixelScene] program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createTexture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
): WebGLTexture | null {
  const texture = gl.createTexture();
  if (!texture) return null;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

function createFramebuffer(
  gl: WebGL2RenderingContext,
  texture: WebGLTexture,
): WebGLFramebuffer | null {
  const framebuffer = gl.createFramebuffer();
  if (!framebuffer) return null;
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (!ok) {
    gl.deleteFramebuffer(framebuffer);
    return null;
  }
  return framebuffer;
}

export function createWebGLBackend(
  canvas: HTMLCanvasElement,
  opts: { isMobile: boolean; reducedMotion: boolean },
): SceneBackend | null {
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    depth: false,
    stencil: false,
    alpha: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });

  if (!gl) return null;

  const backgroundProgram = createProgram(gl, quadVertex, backgroundFragment);
  const fillProgram = createProgram(gl, quadVertex, fillFragment);
  const displayProgram = createProgram(gl, quadVertex, displayFragment);
  const spriteProgram = createProgram(gl, spriteVertex, spriteFragment);
  if (!backgroundProgram || !fillProgram || !displayProgram || !spriteProgram) return null;

  const buffer = gl.createBuffer();
  if (!buffer) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const attrib = {
    background: gl.getAttribLocation(backgroundProgram, "a_position"),
    fill: gl.getAttribLocation(fillProgram, "a_position"),
    display: gl.getAttribLocation(displayProgram, "a_position"),
    sprite: gl.getAttribLocation(spriteProgram, "a_position"),
  };

  const backgroundUniform = {
    resolution: gl.getUniformLocation(backgroundProgram, "u_resolution"),
    time: gl.getUniformLocation(backgroundProgram, "u_time"),
    scroll: gl.getUniformLocation(backgroundProgram, "u_scroll"),
    pixelGrid: gl.getUniformLocation(backgroundProgram, "u_pixelGrid"),
    motion: gl.getUniformLocation(backgroundProgram, "u_motion"),
  };

  const fillUniform = {
    fillTop: gl.getUniformLocation(fillProgram, "u_fillTop"),
  };

  const displayUniform = {
    texture: gl.getUniformLocation(displayProgram, "u_texture"),
    yOffset: gl.getUniformLocation(displayProgram, "u_yOffset"),
    screenSize: gl.getUniformLocation(displayProgram, "u_screenSize"),
  };

  const spriteUniform = {
    texture: gl.getUniformLocation(spriteProgram, "u_texture"),
    center: gl.getUniformLocation(spriteProgram, "u_center"),
    size: gl.getUniformLocation(spriteProgram, "u_size"),
    opacity: gl.getUniformLocation(spriteProgram, "u_opacity"),
  };

  let viewport: SceneViewport | null = null;
  let lastFrame: SceneFrame | null = null;
  let backgroundTexture: WebGLTexture | null = null;
  let backgroundFramebuffer: WebGLFramebuffer | null = null;
  const cloudTextures = CLOUD_LAYERS.map(() => createTexture(gl, 1, 1));
  const cloudReady = CLOUD_LAYERS.map(() => false);
  const mountainTextures = MOUNTAIN_LAYERS.map(() => createTexture(gl, 1, 1));
  const mountainReady = MOUNTAIN_LAYERS.map(() => false);
  const moonTexture = createTexture(gl, 1, 1);
  const images: HTMLImageElement[] = [];
  let alive = true;
  let moonReady = false;

  function bindQuad(attribLocation: number) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(attribLocation);
    gl.vertexAttribPointer(attribLocation, 2, gl.FLOAT, false, 0, 0);
  }

  function drawQuad(attribLocation: number) {
    bindQuad(attribLocation);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function destroyTextures() {
    if (backgroundTexture) gl.deleteTexture(backgroundTexture);
    if (backgroundFramebuffer) gl.deleteFramebuffer(backgroundFramebuffer);
    backgroundTexture = null;
    backgroundFramebuffer = null;
  }

  function rebuildTextures(nextViewport: SceneViewport) {
    destroyTextures();
    backgroundTexture = createTexture(gl, nextViewport.bufferWidth, nextViewport.bufferHeight);
    if (!backgroundTexture) return false;
    backgroundFramebuffer = createFramebuffer(gl, backgroundTexture);
    if (!backgroundFramebuffer) return false;

    return true;
  }

  function renderBackground(frame: SceneFrame) {
    if (!backgroundFramebuffer || !viewport) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, backgroundFramebuffer);
    gl.viewport(0, 0, viewport.bufferWidth, viewport.bufferHeight);
    gl.disable(gl.BLEND);
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook.
    gl.useProgram(backgroundProgram);
    gl.uniform2f(backgroundUniform.resolution, viewport.bufferWidth, viewport.bufferHeight);
    gl.uniform1f(backgroundUniform.time, frame.time);
    gl.uniform1f(backgroundUniform.scroll, frame.scroll);
    gl.uniform1f(backgroundUniform.pixelGrid, viewport.isMobile ? 90.0 : 130.0);
    gl.uniform1f(backgroundUniform.motion, opts.reducedMotion ? 0.0 : 1.0);
    drawQuad(attrib.background);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function drawMoon(frame: SceneFrame) {
    if (!viewport || !moonTexture || !moonReady) return;
    const opacity = 1 - Math.min(1, Math.max(0, (frame.scroll - 0.14) / 0.2));
    if (opacity <= 0) return;
    const aspect = viewport.bufferWidth / viewport.bufferHeight;
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook.
    gl.useProgram(spriteProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, moonTexture);
    gl.uniform1i(spriteUniform.texture, 0);
    const size = viewport.isMobile ? 0.14 : 0.18;
    const y = viewport.isMobile ? 0.64 : 0.74;
    gl.uniform2f(spriteUniform.center, 0.56, (y + frame.scroll * 0.18) * 2 - 1);
    gl.uniform2f(spriteUniform.size, size / aspect, size);
    gl.uniform1f(spriteUniform.opacity, opacity);
    drawQuad(attrib.sprite);
  }

  function composite(frame: SceneFrame) {
    if (!viewport || !backgroundTexture) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, viewport.bufferWidth, viewport.bufferHeight);
    gl.clearColor(0.012, 0.016, 0.051, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook.
    gl.useProgram(displayProgram);
    gl.uniform2f(displayUniform.screenSize, viewport.bufferWidth, viewport.bufferHeight);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(displayUniform.texture, 0);

    gl.disable(gl.BLEND);
    gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
    gl.uniform1f(displayUniform.yOffset, 0);
    drawQuad(attrib.display);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const drawCloudRange = (start: number, end: number) => {
      // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook.
      gl.useProgram(spriteProgram);
      gl.uniform1i(spriteUniform.texture, 0);
      for (let i = start; i < end; i += 1) {
        if (!cloudReady[i] || !cloudTextures[i]) continue;
        const layer = CLOUD_LAYERS[i];
        const aspect = viewport.bufferWidth / viewport.bufferHeight;
        const cloudBaseSize = viewport.isMobile
          ? 0.06
          : Math.min(0.13, Math.max(0.09, aspect * 0.065));
        const halfHeight = cloudBaseSize * layer.scale;
        const halfWidth = (halfHeight * 2) / aspect;
        const x = ((((layer.x + frame.time * layer.speed + 1.4) % 2.8) + 2.8) % 2.8) - 1.4;
        const y =
          layer.y +
          (i >= 8 && !viewport.isMobile ? 0.18 : 0) +
          Math.sin(frame.time * 0.16 + layer.phase) * layer.bob -
          frame.scroll * layer.parallax * 0.36;
        gl.bindTexture(gl.TEXTURE_2D, cloudTextures[i]);
        gl.uniform2f(spriteUniform.center, x, y);
        gl.uniform2f(spriteUniform.size, halfWidth, halfHeight);
        gl.uniform1f(spriteUniform.opacity, layer.opacity);
        drawQuad(attrib.sprite);
      }
    };
    const drawMountainRange = (start: number, end: number) => {
      // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook.
      gl.useProgram(spriteProgram);
      gl.uniform1i(spriteUniform.texture, 0);
      for (let i = start; i < end; i += 1) {
        if (!mountainReady[i] || !mountainTextures[i]) continue;
        const layer = MOUNTAIN_LAYERS[i];
        const aspect = viewport.bufferWidth / viewport.bufferHeight;
        const assetAspect = 1600 / 640;
        const minimumHeight = viewport.isMobile ? 0.43 : 0.6;
        const halfWidth = Math.max(1.04, (minimumHeight * assetAspect) / aspect);
        const halfHeight = (halfWidth * aspect) / assetAspect;
        const yOffset =
          Math.round(frame.scroll * layer.parallax * 2 * viewport.bufferHeight) /
          viewport.bufferHeight;
        gl.bindTexture(gl.TEXTURE_2D, mountainTextures[i]);
        gl.uniform2f(spriteUniform.center, 0, -1 + halfHeight + yOffset);
        gl.uniform2f(spriteUniform.size, halfWidth, halfHeight);
        gl.uniform1f(spriteUniform.opacity, 1);
        drawQuad(attrib.sprite);
      }
    };

    drawCloudRange(0, 8);
    drawMoon(frame);
    drawMountainRange(0, 2);
    drawCloudRange(8, CLOUD_LAYERS.length);
    drawMountainRange(2, MOUNTAIN_LAYERS.length);

    // Mountain 1's bottom edge rises from the viewport bottom by `scroll`.
    // Keep the fill empty at the hero start; it only appears in the exposed gap.
    const fillTop = frame.scroll;
    gl.disable(gl.BLEND);
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook.
    gl.useProgram(fillProgram);
    gl.uniform1f(fillUniform.fillTop, fillTop);
    drawQuad(attrib.fill);
  }

  for (let i = 0; i < CLOUD_LAYERS.length; i += 1) {
    const texture = cloudTextures[i];
    if (!texture) continue;
    const image = new Image();
    images.push(image);
    image.onload = () => {
      if (!alive) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      cloudReady[i] = true;
      if (lastFrame) composite(lastFrame);
    };
    image.src = CLOUD_LAYERS[i].image.src;
  }

  for (let i = 0; i < MOUNTAIN_LAYERS.length; i += 1) {
    const texture = mountainTextures[i];
    if (!texture) continue;
    const image = new Image();
    images.push(image);
    image.onload = () => {
      if (!alive) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      mountainReady[i] = true;
      if (lastFrame) composite(lastFrame);
    };
    image.src = MOUNTAIN_LAYERS[i].image.src;
  }

  if (moonTexture) {
    const image = new Image();
    images.push(image);
    image.onload = () => {
      if (!alive) return;
      gl.bindTexture(gl.TEXTURE_2D, moonTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      moonReady = true;
      if (lastFrame) composite(lastFrame);
    };
    image.src = moonImage.src;
  }

  return {
    resize(nextViewport) {
      viewport = nextViewport;
      rebuildTextures(nextViewport);
    },
    draw(frame) {
      if (!viewport) return;
      lastFrame = frame;
      renderBackground(frame);
      composite(frame);
    },
    destroy() {
      alive = false;
      for (const image of images) image.onload = null;
      lastFrame = null;
      destroyTextures();
      for (const texture of [...cloudTextures, ...mountainTextures]) {
        if (texture) gl.deleteTexture(texture);
      }
      if (moonTexture) gl.deleteTexture(moonTexture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(backgroundProgram);
      gl.deleteProgram(displayProgram);
      gl.deleteProgram(spriteProgram);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    },
  };
}
