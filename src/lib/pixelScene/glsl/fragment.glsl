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

/*__SKY__*/
/*__MOON__*/
/*__MOUNTAIN__*/

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;

  vec3 col = drawSky(uv);
  col = drawStars(col, uv, aspect);
  col = drawMoon(col, uv, aspect);
  float upperCloudFade = smoothstep(0.18, 0.42, u_scroll);
  // top wisps sparse; mid/near puffs reduced and rounder.
  col = drawClouds(col, uv, aspect, 0.82, 0.28, 54.0, CLOUD_MID,   CLOUD_DARK, CLOUD_DARK, 0.52 * (0.6 + 0.4 * upperCloudFade), 19.7, 2.9, 2.0, 0.57, 0.115);
  col = drawClouds(col, uv, aspect, 0.60, 0.5,  60.0, CLOUD_LIGHT, CLOUD_MID,  CLOUD_DARK, 0.68, 47.3, 3.3, 2.2, 0.55, 0.16);
  col = drawClouds(col, uv, aspect, 0.47, 1.0,  84.0, CLOUD_LIGHT, CLOUD_MID,  CLOUD_DARK, 0.76, 88.1, 3.9, 2.05, 0.53, 0.20);
  float portraitLift = smoothstep(1.05, 0.65, aspect) * 0.055;
  col = drawMountains(col, uv, 0.16 + portraitLift, 4.0, 0.10, MTN_FAR);
  col = drawMountains(col, uv, 0.09 + portraitLift, 6.0, 0.14, MTN_MID);
  col = drawMountains(col, uv, 0.02 + portraitLift, 9.0, 0.18, MTN_NEAR);

  float scrim = smoothstep(0.5, 0.18, abs(uv.y - 0.5)) * 0.28;
  col = mix(col, col * 0.45, scrim);

  float dth = (hash(floor(gl_FragCoord.xy)) - 0.5) * (1.5 / 255.0);
  col += dth;

  gl_FragColor = vec4(col, 1.0);
}
