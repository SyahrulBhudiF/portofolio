float mountainHeight(float x, float scale) {
  float h = noise(vec2(x * scale, 0.0)) * 0.5;
  h += noise(vec2(x * scale * 2.1, 5.0)) * 0.28;
  h += noise(vec2(x * scale * 4.3, 9.0)) * 0.14;
  return h;
}

vec3 drawMountains(vec3 col, vec2 uv, float baseY, float scale, float par, vec3 mtnCol) {
  float x = pixelate(vec2(uv.x, 0.0), 150.0).x;
  float h = baseY + mountainHeight(x + 3.1, scale) * 0.22 + u_scroll * par;
  float py = floor(uv.y * 90.0) / 90.0;
  float m = step(py, h);
  return mix(col, mtnCol, m);
}
