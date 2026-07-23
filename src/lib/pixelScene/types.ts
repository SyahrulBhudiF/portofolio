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

export type SceneBackend = {
  resize(viewport: SceneViewport): void;
  draw(frame: SceneFrame): void;
  destroy(): void;
};

export type PixelSceneRenderer = {
  start(): void;
  stop(): void;
  resize(): void;
  destroy(): void;
};
