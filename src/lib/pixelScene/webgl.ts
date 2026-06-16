import type { SceneFrame, SceneViewport } from "./types";

export type SceneBackend = {
  resize(viewport: SceneViewport): void;
  draw(frame: SceneFrame): void;
  destroy(): void;
};

type MountainLayer = {
  seed: number;
  scaleX: number;
  xOffset: number;
  heightMul: number;
  baseY: number;
  color: [number, number, number];
  parallax: number;
};

const MOUNTAIN_LAYERS: MountainLayer[] = [
  { seed: 0.0, scaleX: 3.0, xOffset: 0.0, heightMul: 1.45, baseY: 0.19, color: [0.149, 0.192, 0.302], parallax: 0.08 },
  { seed: 1.0, scaleX: 3.8, xOffset: 0.45, heightMul: 1.35, baseY: 0.15, color: [0.126, 0.158, 0.260], parallax: 0.13 },
  { seed: 2.0, scaleX: 4.8, xOffset: 1.1, heightMul: 1.20, baseY: 0.11, color: [0.106, 0.133, 0.220], parallax: 0.20 },
  { seed: 3.0, scaleX: 6.0, xOffset: 1.8, heightMul: 1.05, baseY: 0.08, color: [0.082, 0.101, 0.178], parallax: 0.32 },
  { seed: 4.0, scaleX: 7.4, xOffset: 2.6, heightMul: 0.90, baseY: 0.055, color: [0.062, 0.075, 0.140], parallax: 0.48 },
  { seed: 5.0, scaleX: 9.2, xOffset: 3.4, heightMul: 0.74, baseY: 0.03, color: [0.043, 0.051, 0.094], parallax: 0.72 },
];

const quadVertex = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_uv = (a_position + 1.0) * 0.5;
}
`;

const noiseGlsl = `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

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

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  v += amp * noise(p); p = p * 2.02 + 11.0; amp *= 0.5;
  v += amp * noise(p); p = p * 2.03 + 7.0;  amp *= 0.5;
  v += amp * noise(p);
  return v;
}
`;

const backgroundFragment = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scroll;
uniform float u_pixelGrid;
uniform float u_motion;
varying vec2 v_uv;

const vec3 SKY_TOP   = vec3(0.012, 0.016, 0.051);
const vec3 SKY_MID   = vec3(0.035, 0.078, 0.169);
const vec3 SKY_LOW   = vec3(0.090, 0.098, 0.200);
const vec3 STAR      = vec3(0.937, 0.910, 1.000);
const vec3 STAR_DIM  = vec3(0.561, 0.612, 0.800);
const vec3 MOON_LIGHT  = vec3(0.953, 0.875, 0.667);
const vec3 MOON_SHADOW = vec3(0.616, 0.533, 0.380);
const vec3 CLOUD_LIGHT = vec3(0.784, 0.827, 0.949);
const vec3 CLOUD_MID   = vec3(0.498, 0.553, 0.741);
const vec3 CLOUD_DARK  = vec3(0.224, 0.267, 0.408);
const vec3 PURPLE      = vec3(0.486, 0.361, 1.000);

${noiseGlsl}

vec2 pixelate(vec2 uv, float grid) {
  return floor(uv * grid) / grid;
}

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
  if (fade <= 0.001) return col;
  vec2 p = pixelate(uv, u_pixelGrid * 1.2);
  vec2 c = vec2(0.78, 0.74 + u_scroll * 0.18);
  vec2 d = vec2((p.x - c.x) * aspect, p.y - c.y);
  float r = length(d);
  float disc = 1.0 - step(0.085, r);
  float cr = 0.0;
  cr += 1.0 - step(0.016, length(d - vec2(-0.02, 0.015)));
  cr += 1.0 - step(0.012, length(d - vec2(0.022, -0.01)));
  cr += 1.0 - step(0.010, length(d - vec2(0.005, 0.030)));
  vec3 moonCol = mix(MOON_LIGHT, MOON_SHADOW, clamp(cr, 0.0, 1.0) * 0.7);
  float halo = (1.0 - smoothstep(0.085, 0.17, r)) * 0.22;
  col = mix(col, MOON_LIGHT, halo * fade);
  return mix(col, moonCol, disc * fade);
}

vec3 drawClouds(vec3 col, vec2 uv, float aspect, float bandY, float depth, float grid, vec3 lit, vec3 mid, vec3 dark, float maxAlpha, float seed, float noiseScale, float stretch, float thresh, float bandW) {
  float drift = u_time * 0.012 * depth * u_motion;
  float y = uv.y + u_scroll * (0.35 * depth) - bandY;
  float cx = uv.x * aspect * 1.35;
  vec2 cuv = pixelate(vec2(cx + drift + u_scroll * depth + seed, y * stretch), grid);
  vec2 warp = vec2(fbm(cuv * (noiseScale * 0.42) + seed), fbm(cuv * (noiseScale * 0.42) + seed + 3.3));
  float n = fbm(cuv * noiseScale + warp * 0.62 + seed);
  float up = max(y, 0.0);
  float dn = max(-y, 0.0);
  float window = smoothstep(bandW, 0.0, up) * smoothstep(bandW * 0.72, 0.0, dn);
  float portrait = smoothstep(1.05, 0.65, aspect);
  float cloudThresh = thresh - portrait * 0.045;
  float body = smoothstep(cloudThresh, cloudThresh + 0.065, n);
  float mask = body * window;
  vec3 c = mix(dark, mid, step(cloudThresh + 0.025, n));
  c = mix(c, lit, step(cloudThresh + 0.13, n));
  return mix(col, c, clamp(mask, 0.0, 1.0) * (maxAlpha + portrait * 0.08));
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  vec3 col = drawSky(uv);
  col = drawStars(col, uv, aspect);
  col = drawMoon(col, uv, aspect);
  float upperCloudFade = smoothstep(0.18, 0.42, u_scroll);
  col = drawClouds(col, uv, aspect, 0.82, 0.28, 54.0, CLOUD_MID,   CLOUD_DARK, CLOUD_DARK, 0.52 * (0.6 + 0.4 * upperCloudFade), 19.7, 2.9, 2.0, 0.57, 0.115);
  col = drawClouds(col, uv, aspect, 0.60, 0.5,  60.0, CLOUD_LIGHT, CLOUD_MID,  CLOUD_DARK, 0.68, 47.3, 3.3, 2.2, 0.55, 0.16);
  col = drawClouds(col, uv, aspect, 0.47, 1.0,  84.0, CLOUD_LIGHT, CLOUD_MID,  CLOUD_DARK, 0.76, 88.1, 3.9, 2.05, 0.53, 0.20);
  float scrim = smoothstep(0.5, 0.18, abs(uv.y - 0.5)) * 0.18;
  col = mix(col, col * 0.55, scrim);
  float dth = (hash(floor(gl_FragCoord.xy)) - 0.5) * (1.5 / 255.0);
  gl_FragColor = vec4(col + dth, 1.0);
}
`;

const mountainFragment = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_seed;
uniform float u_scaleX;
uniform float u_xOffset;
uniform float u_heightMul;
uniform float u_baseY;
uniform vec3 u_color;
varying vec2 v_uv;

${noiseGlsl}

float ridge(float x, float seed) {
  float h = 0.0;
  h += max(0.0, 0.24 - abs(sin(x * 1.35 + seed * 2.7)) * 0.24);
  h += max(0.0, 0.15 - abs(sin(x * 2.40 + seed * 1.9)) * 0.15) * 0.68;
  h += max(0.0, 0.08 - abs(sin(x * 4.20 + seed * 5.1)) * 0.08) * 0.46;
  h += noise(vec2(x * 0.85, seed * 3.0)) * 0.055;
  return clamp(h, 0.0, 0.42);
}

void main() {
  vec2 uv = v_uv;
  float px = floor(uv.x * 150.0) / 150.0;
  float py = floor(uv.y * 90.0) / 90.0;
  float portrait = smoothstep(1.05, 0.65, u_resolution.x / u_resolution.y);
  float h = u_baseY + portrait * 0.055 + ridge(px * u_scaleX + u_xOffset, u_seed) * u_heightMul * 0.24;
  float mtn = step(py, h);
  gl_FragColor = vec4(u_color * mtn, mtn);
}
`;

const displayFragment = `
precision mediump float;

uniform sampler2D u_texture;
uniform float u_yOffset;
uniform vec2 u_screenSize;
varying vec2 v_uv;

void main() {
  vec2 uv = v_uv;
  uv.y += u_yOffset / u_screenSize.y;
  gl_FragColor = texture2D(u_texture, uv);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
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

function createProgram(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string): WebGLProgram | null {
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

function createTexture(gl: WebGLRenderingContext, width: number, height: number): WebGLTexture | null {
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

function createFramebuffer(gl: WebGLRenderingContext, texture: WebGLTexture): WebGLFramebuffer | null {
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
  const gl = (canvas.getContext("webgl", {
    antialias: false,
    depth: false,
    stencil: false,
    alpha: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  }) || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

  if (!gl) return null;

  const backgroundProgram = createProgram(gl, quadVertex, backgroundFragment);
  const mountainProgram = createProgram(gl, quadVertex, mountainFragment);
  const displayProgram = createProgram(gl, quadVertex, displayFragment);
  if (!backgroundProgram || !mountainProgram || !displayProgram) return null;

  const buffer = gl.createBuffer();
  if (!buffer) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  const attrib = {
    background: gl.getAttribLocation(backgroundProgram, "a_position"),
    mountain: gl.getAttribLocation(mountainProgram, "a_position"),
    display: gl.getAttribLocation(displayProgram, "a_position"),
  };

  const backgroundUniform = {
    resolution: gl.getUniformLocation(backgroundProgram, "u_resolution"),
    time: gl.getUniformLocation(backgroundProgram, "u_time"),
    scroll: gl.getUniformLocation(backgroundProgram, "u_scroll"),
    pixelGrid: gl.getUniformLocation(backgroundProgram, "u_pixelGrid"),
    motion: gl.getUniformLocation(backgroundProgram, "u_motion"),
  };

  const mountainUniform = {
    resolution: gl.getUniformLocation(mountainProgram, "u_resolution"),
    seed: gl.getUniformLocation(mountainProgram, "u_seed"),
    scaleX: gl.getUniformLocation(mountainProgram, "u_scaleX"),
    xOffset: gl.getUniformLocation(mountainProgram, "u_xOffset"),
    heightMul: gl.getUniformLocation(mountainProgram, "u_heightMul"),
    baseY: gl.getUniformLocation(mountainProgram, "u_baseY"),
    color: gl.getUniformLocation(mountainProgram, "u_color"),
  };

  const displayUniform = {
    texture: gl.getUniformLocation(displayProgram, "u_texture"),
    yOffset: gl.getUniformLocation(displayProgram, "u_yOffset"),
    screenSize: gl.getUniformLocation(displayProgram, "u_screenSize"),
  };

  let viewport: SceneViewport | null = null;
  let backgroundTexture: WebGLTexture | null = null;
  let backgroundFramebuffer: WebGLFramebuffer | null = null;
  let mountainTextures: WebGLTexture[] = [];
  let mountainFramebuffers: WebGLFramebuffer[] = [];

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
    for (const texture of mountainTextures) gl.deleteTexture(texture);
    for (const framebuffer of mountainFramebuffers) gl.deleteFramebuffer(framebuffer);
    backgroundTexture = null;
    backgroundFramebuffer = null;
    mountainTextures = [];
    mountainFramebuffers = [];
  }

  function rebuildTextures(nextViewport: SceneViewport) {
    destroyTextures();
    backgroundTexture = createTexture(gl, nextViewport.bufferWidth, nextViewport.bufferHeight);
    if (!backgroundTexture) return false;
    backgroundFramebuffer = createFramebuffer(gl, backgroundTexture);
    if (!backgroundFramebuffer) return false;

    for (let i = 0; i < MOUNTAIN_LAYERS.length; i += 1) {
      const texture = createTexture(gl, nextViewport.bufferWidth, nextViewport.bufferHeight);
      if (!texture) return false;
      const framebuffer = createFramebuffer(gl, texture);
      if (!framebuffer) return false;
      mountainTextures.push(texture);
      mountainFramebuffers.push(framebuffer);
    }

    renderMountainLayers(nextViewport);
    return true;
  }

  function renderMountainLayers(currentViewport: SceneViewport) {
    gl.useProgram(mountainProgram);
    gl.uniform2f(mountainUniform.resolution, currentViewport.bufferWidth, currentViewport.bufferHeight);
    for (let i = 0; i < MOUNTAIN_LAYERS.length; i += 1) {
      const layer = MOUNTAIN_LAYERS[i];
      gl.bindFramebuffer(gl.FRAMEBUFFER, mountainFramebuffers[i]);
      gl.viewport(0, 0, currentViewport.bufferWidth, currentViewport.bufferHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(mountainUniform.seed, layer.seed);
      gl.uniform1f(mountainUniform.scaleX, layer.scaleX);
      gl.uniform1f(mountainUniform.xOffset, layer.xOffset);
      gl.uniform1f(mountainUniform.heightMul, layer.heightMul);
      gl.uniform1f(mountainUniform.baseY, layer.baseY);
      gl.uniform3f(mountainUniform.color, layer.color[0], layer.color[1], layer.color[2]);
      drawQuad(attrib.mountain);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function renderBackground(frame: SceneFrame) {
    if (!backgroundFramebuffer || !viewport) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, backgroundFramebuffer);
    gl.viewport(0, 0, viewport.bufferWidth, viewport.bufferHeight);
    gl.disable(gl.BLEND);
    gl.useProgram(backgroundProgram);
    gl.uniform2f(backgroundUniform.resolution, viewport.bufferWidth, viewport.bufferHeight);
    gl.uniform1f(backgroundUniform.time, frame.time);
    gl.uniform1f(backgroundUniform.scroll, frame.scroll);
    gl.uniform1f(backgroundUniform.pixelGrid, opts.isMobile ? 90.0 : 130.0);
    gl.uniform1f(backgroundUniform.motion, opts.reducedMotion ? 0.0 : 1.0);
    drawQuad(attrib.background);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function composite(frame: SceneFrame) {
    if (!viewport || !backgroundTexture) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, viewport.bufferWidth, viewport.bufferHeight);
    gl.clearColor(0.012, 0.016, 0.051, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
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
    for (let i = 0; i < MOUNTAIN_LAYERS.length; i += 1) {
      const layer = MOUNTAIN_LAYERS[i];
      gl.bindTexture(gl.TEXTURE_2D, mountainTextures[i]);
      gl.uniform1f(displayUniform.yOffset, -frame.scroll * layer.parallax * viewport.bufferHeight * 0.36);
      drawQuad(attrib.display);
    }
    gl.disable(gl.BLEND);
  }

  return {
    resize(nextViewport) {
      viewport = nextViewport;
      rebuildTextures(nextViewport);
    },
    draw(frame) {
      if (!viewport) return;
      renderBackground(frame);
      composite(frame);
    },
    destroy() {
      destroyTextures();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(backgroundProgram);
      gl.deleteProgram(mountainProgram);
      gl.deleteProgram(displayProgram);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    },
  };
}
