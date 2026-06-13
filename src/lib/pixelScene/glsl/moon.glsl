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
