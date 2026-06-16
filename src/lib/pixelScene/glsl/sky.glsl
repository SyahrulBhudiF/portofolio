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

// Stylized pixel-art cloud: sparse domain-warped fbm blobs, banded shading,
// rounded puffy silhouette with a soft natural taper.
vec3 drawClouds(
  vec3 col, vec2 uv, float aspect, float bandY, float depth, float grid,
  vec3 lit, vec3 mid, vec3 dark, float maxAlpha,
  float seed, float noiseScale, float stretch, float thresh, float bandW
) {
  float drift = u_time * 0.012 * depth * u_motion;
  float y = uv.y + u_scroll * (0.35 * depth) - bandY;
  float cx = uv.x * aspect * 1.35;

  vec2 cuv = pixelate(vec2(cx + drift + u_scroll * depth + seed, y * stretch), grid);

  // Domain warp -> organic, rounder blob edges without grain.
  vec2 warp = vec2(
    fbm(cuv * (noiseScale * 0.42) + seed),
    fbm(cuv * (noiseScale * 0.42) + seed + 3.3)
  );
  float n = fbm(cuv * noiseScale + warp * 0.62 + seed);

  // Rounded asymmetric window: soft top, not-too-flat bottom.
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
