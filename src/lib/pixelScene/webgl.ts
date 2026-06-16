import fragmentShaderMain from "./glsl/fragment.glsl?raw";
import moonShaderSource from "./glsl/moon.glsl?raw";
import mountainShaderSource from "./glsl/mountain.glsl?raw";
import skyShaderSource from "./glsl/sky.glsl?raw";
import vertexShaderSource from "./glsl/vertex.glsl?raw";

const fragmentShaderSource = fragmentShaderMain
  .replace("/*__SKY__*/", skyShaderSource)
  .replace("/*__MOON__*/", moonShaderSource)
  .replace("/*__MOUNTAIN__*/", mountainShaderSource);
import type { SceneFrame, SceneViewport } from "./types";

export type SceneBackend = {
  resize(viewport: SceneViewport): void;
  draw(frame: SceneFrame): void;
  destroy(): void;
};

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

/**
 * Create the WebGL backend. Returns null when WebGL is unavailable or the
 * program fails to compile/link so the caller can fall back to canvas2d.
 */
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

  const vs = compile(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[pixelScene] program link error:", gl.getProgramInfoLog(program));
    return null;
  }
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL useProgram is not a React hook.
  gl.useProgram(program);

  // Fullscreen quad (two triangles) created once.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const aPosition = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  const u = {
    resolution: gl.getUniformLocation(program, "u_resolution"),
    time: gl.getUniformLocation(program, "u_time"),
    scroll: gl.getUniformLocation(program, "u_scroll"),
    pixelGrid: gl.getUniformLocation(program, "u_pixelGrid"),
    motion: gl.getUniformLocation(program, "u_motion"),
    quality: gl.getUniformLocation(program, "u_quality"),
  };

  gl.uniform1f(u.pixelGrid, opts.isMobile ? 90.0 : 130.0);
  gl.uniform1f(u.quality, opts.isMobile ? 0.85 : 1.0);
  gl.uniform1f(u.motion, opts.reducedMotion ? 0.0 : 1.0);

  return {
    resize(viewport) {
      gl.viewport(0, 0, viewport.bufferWidth, viewport.bufferHeight);
      gl.uniform2f(u.resolution, viewport.bufferWidth, viewport.bufferHeight);
    },
    draw(frame) {
      gl.uniform1f(u.time, frame.time);
      gl.uniform1f(u.scroll, frame.scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    destroy() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    },
  };
}
