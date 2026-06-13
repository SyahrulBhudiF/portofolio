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

export type PixelSceneRenderer = {
  start(): void;
  stop(): void;
  resize(): void;
  destroy(): void;
};
