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

export type PixelScenePalette = typeof pixelScenePalette;

/** Parse "#rrggbb" into normalized [r, g, b] floats for canvas2d / debug. */
export function hexToRgb01(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
