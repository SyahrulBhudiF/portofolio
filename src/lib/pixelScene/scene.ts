import type { SceneLayer } from "./types";

/**
 * Declarative layer config (far -> near). The WebGL v1 composes these inside a
 * single fragment shader, but keeping the config here means future sprite or
 * texture layers can be added without touching the React component.
 */
export const sceneLayers: SceneLayer[] = [
  { id: "sky", order: 0, parallax: 0, opacity: 1 },
  { id: "stars", order: 1, parallax: 0.06, opacity: 1 },
  { id: "moon", order: 2, parallax: 0.1, opacity: 1 },
  { id: "far-clouds", order: 3, parallax: 0.22, opacity: 0.55 },
  { id: "near-clouds", order: 4, parallax: 0.45, opacity: 0.85 },
  { id: "far-mountains", order: 5, parallax: 0.62, opacity: 1 },
  { id: "near-mountains", order: 6, parallax: 0.85, opacity: 1 },
];
