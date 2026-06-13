precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scroll;
uniform float u_pixelGrid;
uniform float u_motion;
uniform float u_quality;

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
const vec3 MTN_FAR  = vec3(0.149, 0.192, 0.302);
const vec3 MTN_MID  = vec3(0.106, 0.133, 0.220);
const vec3 MTN_NEAR = vec3(0.043, 0.051, 0.094);

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
  v += amp * noise(p) * u_quality;
  return v;
}

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
  float exists = step(0.978, rnd);
  vec2 local = fract(suv * grid);
  float shape = step(abs(local.x - 0.5), 0.12) * step(abs(local.y - 0.5), 0.12);
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

vec3 drawClouds(
  vec3 col, vec2 uv, float aspect, float bandY, float depth, float grid,
  vec3 lit, vec3 mid, vec3 dark, float maxAlpha
) {
  float drift = u_time * 0.012 * depth * u_motion;
  float y = uv.y + u_scroll * (0.35 * depth) - bandY;
  float cx = uv.x * aspect * 1.5;

  vec2 cuv = pixelate(vec2(cx + drift + u_scroll * depth, y * 3.0), grid);
  float n = fbm(cuv * 4.0);

  float band = smoothstep(0.16, 0.0, abs(y));
  float mask = step(0.52, n) * band;
  vec3 c = mix(dark, mid, step(0.52, n));
  c = mix(c, lit, step(0.64, n));
  return mix(col, c, clamp(mask, 0.0, 1.0) * maxAlpha);
}

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

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;

  vec3 col = drawSky(uv);
  col = drawStars(col, uv, aspect);
  col = drawMoon(col, uv, aspect);
  col = drawClouds(col, uv, aspect, 0.62, 0.5, 60.0, CLOUD_MID, CLOUD_DARK, CLOUD_DARK, 0.5);
  col = drawClouds(col, uv, aspect, 0.50, 1.0, 84.0, CLOUD_LIGHT, CLOUD_MID, CLOUD_DARK, 0.82);
  col = drawMountains(col, uv, 0.20, 4.0, 0.10, MTN_FAR);
  col = drawMountains(col, uv, 0.13, 6.0, 0.14, MTN_MID);
  col = drawMountains(col, uv, 0.06, 9.0, 0.18, MTN_NEAR);

  float scrim = smoothstep(0.5, 0.18, abs(uv.y - 0.5)) * 0.28;
  col = mix(col, col * 0.45, scrim);

  float dth = (hash(floor(gl_FragCoord.xy)) - 0.5) * (1.5 / 255.0);
  col += dth;

  gl_FragColor = vec4(col, 1.0);
}
