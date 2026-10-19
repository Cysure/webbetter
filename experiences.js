/* Web Better — one WebGL experience per section.
   Every layer draws on its own transparent canvas over a visible CSS fallback,
   renders only while on screen, and is started by main.js after a real frame. */
(() => {
  const DPR = Math.min(window.devicePixelRatio || 1, 1.75);
  const SMALL = innerWidth < 700;

  /* ---------------- shared helpers ---------------- */
  function compile(gl, vs, fs) {
    const sh = (t, src) => {
      const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src.slice(0, 200));
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name.replace('[0]', '')] = gl.getUniformLocation(p, info.name); }
    return { p, u };
  }
  function fit(canvas, scale) {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * DPR * scale)), h = Math.max(1, Math.round(r.height * DPR * scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; return true; }
    return false;
  }
  const onScreen = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; };

  // one global pointer, read by every layer
  const P = { x: innerWidth / 2, y: innerHeight / 2, vx: 0, vy: 0, down: false, last: 0 };
  addEventListener('pointermove', e => { P.vx = e.clientX - P.x; P.vy = e.clientY - P.y; P.x = e.clientX; P.y = e.clientY; P.last = performance.now(); }, { passive: true });
  addEventListener('pointerdown', () => { P.down = true; });
  addEventListener('pointerup', () => { P.down = false; });

  const NOISE = `
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), u.x), u.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 1.7; a *= .5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
`;
  const QUAD_VS = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

  /* A full-canvas fragment shader layer with mouse, hover, scroll and time. */
  function shaderLayer(canvas, body, opts = {}) {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' });
    if (!gl) return null;
    let prog;
    try {
      prog = compile(gl, QUAD_VS, `precision highp float;
uniform vec2 uRes; uniform float uTime, uScroll, uHover; uniform vec2 uMouse;
${NOISE}
${body}`);
    } catch (e) { console.warn(opts.name, e); return null; }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog.p, 'a');
    const m = [0, 0]; let hover = 0;
    return {
      render(time, scroll) {
        fit(canvas, opts.scale || .5);
        const r = canvas.getBoundingClientRect();
        const inside = P.x >= r.left && P.x <= r.right && P.y >= r.top && P.y <= r.bottom;
        // mouse in the shader's own space: centred, units of canvas height
        const tx = inside ? (P.x - r.left - r.width / 2) / r.height : m[0] * .98;
        const ty = inside ? -(P.y - r.top - r.height / 2) / r.height : m[1] * .98;
        m[0] += (tx - m[0]) * .07; m[1] += (ty - m[1]) * .07;
        hover += ((inside ? 1 : 0) - hover) * .05;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(prog.p);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(prog.u.uRes, canvas.width, canvas.height);
        gl.uniform1f(prog.u.uTime, time);
        if (prog.u.uScroll) gl.uniform1f(prog.u.uScroll, scroll);
        if (prog.u.uHover) gl.uniform1f(prog.u.uHover, hover);
        if (prog.u.uMouse) gl.uniform2f(prog.u.uMouse, m[0], m[1]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        canvas.classList.add('live');
      }
    };
  }

  /* ---------------- 01 Design: liquid chrome metaballs ---------------- */
  const DESIGN = `
float smin(float a, float b, float k){ float h = clamp(.5 + .5 * (b - a) / k, 0., 1.); return mix(b, a, h) - k * h * (1. - h); }
float map(vec3 p0){
  vec3 p = p0;
  float t = uTime * .55;
  p.xy *= rot(uScroll * 1.6);
  p.xz *= rot(t * .3 + uScroll * 2.2);
  float d = length(p - vec3(sin(t) * .78, cos(t * .8) * .4, 0.)) - .58;
  d = smin(d, length(p - vec3(cos(t * .7) * .88, sin(t * 1.1) * .52, sin(t * .6) * .35)) - .44, .5);
  d = smin(d, length(p - vec3(-sin(t * .9) * .68, -cos(t * .5) * .62, cos(t) * .3)) - .4, .5);
  d = smin(d, length(p - vec3(sin(t * 1.3) * .32, sin(t * .4) * .85, -cos(t * .7) * .4)) - .32, .5);
  float dm = mix(9., length(p0 - vec3(uMouse * 3.4, .55)) - .36, uHover);
  d = smin(d, dm, .6);
  d += .008 * sin(p.x * 7. + uTime * 2.) * sin(p.y * 7. - uTime) * sin(p.z * 7.);
  return d;
}
vec3 normal(vec3 p){ vec2 e = vec2(.0015, 0.);
  return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx))); }
void main(){
  vec2 uv = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  vec3 ro = vec3(0., 0., 3.5), rd = normalize(vec3(uv, -1.7));
  float t = 0., d = 1., glow = 0.;
  for (int i = 0; i < 72; i++) {
    vec3 p = ro + rd * t; d = map(p);
    glow += .014 / (1. + d * d * 35.);
    if (d < .002 || t > 8.) break;
    t += d * .9;
  }
  vec3 bg = mix(vec3(.0, .03, .1), vec3(.0, .14, .36), smoothstep(1.3, -.3, length(uv - vec2(.1, .15))));
  bg += .05 * fbm(uv * 3. + uTime * .05);
  vec3 col = bg + vec3(.1, .45, 1.) * glow * .32;
  if (d < .01) {
    vec3 p = ro + rd * t, n = normal(p), r = reflect(rd, n);
    float fr = pow(1. - max(dot(n, -rd), 0.), 3.);
    vec3 env = mix(vec3(0., .05, .2), vec3(.3, .7, 1.), smoothstep(-.4, .8, r.y));
    env += smoothstep(.86, .99, sin(r.x * 3. + r.y * 5. + uTime * .3)) * .6;
    env += vec3(.7, .9, 1.) * pow(max(dot(r, normalize(vec3(.5, .8, .6))), 0.), 48.) * 2.2;
    vec3 irid = .5 + .5 * cos(6.2831 * (fr * 1.4 + vec3(.55, .62, .74) + uTime * .04 + p.y * .3));
    col = env * .85 + irid * fr * .75;
    col *= mix(vec3(1.), vec3(.55, .78, 1.25), .35);
  }
  col *= 1. - .35 * dot(uv * .8, uv * .8);
  gl_FragColor = vec4(col, 1.);
}`;

  /* ---------------- 02 Websites & apps: corridor of interfaces ---------------- */
  const TUNNEL = `
float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
void main(){
  vec2 p = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  p -= uMouse * .08;
  p *= rot(sin(uTime * .15) * .02);
  float r = max(abs(p.x), abs(p.y)) + 1e-3;
  bool sx = abs(p.x) > abs(p.y);
  float side = sx ? (p.x > 0. ? 0. : 1.) : (p.y > 0. ? 2. : 3.);
  float u = sx ? p.y / abs(p.x) : p.x / abs(p.y);
  float depth = .3 / r;
  float z = depth + uTime * .25 + uScroll * 2.5;
  vec2 g = vec2(u * 1.4 + side * 11.3, z * .9);
  vec2 id = floor(g), f = fract(g) - .5;
  float h = hash(id + side * 7.);
  float card = sdRB(f, vec2(.41, .34), .07);
  float inside = smoothstep(.02, 0., card);
  float border = smoothstep(.03, 0., abs(card));
  float ry = (f.y + .34) / .68;
  float lines = step(fract(ry * 5.), .36) * step(f.x + .3, .25 + .45 * h) * inside * step(.15, ry) * step(ry, .7);
  float head = step(.8, ry) * inside;
  float lit = step(.86, fract(h * 17.31));
  float show = step(.45, h);
  vec3 c = (vec3(.01, .035, .1) * inside + vec3(0., .3, .8) * border * .55 + vec3(.15, .5, 1.) * lines * .22 + vec3(0., .2, .5) * head * .3) * show;

  c += step(.95, h) * inside * mix(vec3(0., .3, .7), vec3(.16, .6, 1.), f.x + .5) * .45;
  float scan = pow(.5 + .5 * sin(z * 1.3 - uTime * 3.), 14.);

  c *= smoothstep(7., 1.2, depth) * .7;
  c += vec3(0., .25, .7) * min(.012 / r, .5) * smoothstep(.45, 0., r);
  c += vec3(.0, .02, .06);
  c *= 1. - .3 * dot(p, p);
  gl_FragColor = vec4(c, 1.);
}`;

  /* ---------------- 03 SEO: the rank skyline ---------------- */
  const CITY = `
float sdBox(vec3 p, vec3 b){ vec3 q = abs(p) - b; return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.); }
vec2 gM; float gRise;
float H(vec2 c){
  float n = noise(c * .23 + vec2(uTime * .06, 0.));
  float h = .2 + 1.7 * n * n + .35 * noise(c * .9);
  float dm = length(c + .5 - gM);
  h += 2.6 * exp(-dm * dm * .07) * uHover;
  if (c.x == 0. && c.y == 0.) h = 4.6;
  return h * gRise;
}
float map(vec3 p){
  vec2 c = floor(p.xz); vec2 q = mod(p.xz, 1.) - .5;
  float h = H(c);
  float d = sdBox(vec3(q.x, p.y - h * .5, q.y), vec3(.34, h * .5, .34));
  return min(d, p.y);
}
vec3 normal(vec3 p){ vec2 e = vec2(.002, 0.);
  return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx))); }
void main(){
  vec2 uv = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  float a = uTime * .04 + uScroll * 1.2 + uMouse.x * .35;
  vec3 ro = vec3(sin(a) * 11., 7. - uScroll * 1.6 + uMouse.y * 2., cos(a) * 11.);
  vec3 ta = vec3(0., 1.4, 0.);
  vec3 fw = normalize(ta - ro), rt = normalize(cross(fw, vec3(0., 1., 0.))), up = cross(rt, fw);
  vec3 rd = normalize(fw * 1.6 + rt * uv.x + up * uv.y);
  vec3 md = normalize(fw * 1.6 + rt * uMouse.x + up * uMouse.y);
  gM = ro.xz + md.xz * (-ro.y / min(md.y, -.05));
  gRise = mix(.25, 1., smoothstep(-.6, .4, uScroll));
  float t = 0., d = 1.;
  for (int i = 0; i < 110; i++) {
    vec3 p = ro + rd * t; d = map(p);
    if (d < .002 || t > 40.) break;
    t += min(d, .3) * .95;
  }
  vec3 sky = mix(vec3(0., .02, .07), vec3(0., .12, .3), smoothstep(-.2, .5, rd.y) * (1. - smoothstep(.2, .9, rd.y)));
  vec3 col = sky;
  if (t < 40.) {
    vec3 p = ro + rd * t, n = normal(p);
    vec2 c = floor(p.xz);
    float h = H(c);
    vec3 L = normalize(vec3(.6, .9, .3));
    float dif = max(dot(n, L), 0.) * .6 + .25;
    if (p.y < .01) {
      vec2 gq = abs(mod(p.xz, 1.) - .5);
      float line = smoothstep(.47, .5, max(gq.x, gq.y));
      col = vec3(0., .02, .06) + vec3(0., .25, .7) * line * .5;
      float dm = length(p.xz - gM);
      col += vec3(.1, .5, 1.) * exp(-dm * dm * .5) * uHover * .6;
    } else {
      float k = clamp(p.y / 4.6, 0., 1.);
      col = mix(vec3(0., .07, .22), vec3(0., .36, .8), k) * dif;
      float win = step(.55, fract(p.y * 7.)) * step(.6, hash(c + floor(p.y * 7.)));
      col += vec3(.2, .6, 1.) * win * .25 * step(abs(n.y), .5);
      float top = step(.5, n.y) * smoothstep(h - .05, h, p.y);
      col += vec3(.2, .7, 1.) * top * (.5 + k);
      if (c.x == 0. && c.y == 0.) col += vec3(.2, .6, 1.) * (.7 + .15 * sin(uTime * .8)) * (.4 + top);
      col += vec3(.1, .4, 1.) * pow(1. - max(dot(n, -rd), 0.), 4.) * .5;
    }
    col = mix(col, sky, 1. - exp(-t * .05));
  }
  col *= 1. - .3 * dot(uv, uv);
  gl_FragColor = vec4(col, 1.);
}`;

  /* ---------------- Contact: black hole ---------------- */
  const HOLE = `
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  float t = uTime * .12;
  // deep navy base with a soft light rising from the horizon as you scroll in
  vec3 col = mix(vec3(.004, .02, .06), vec3(0., .05, .14), smoothstep(1., 0., uv.y));
  float rise = mix(.75, .35, uScroll);
  float glow = exp(-pow((uv.y - (1. - rise)) * 3.2, 2.)) * smoothstep(1.1, 0., abs(p.x) * .9);
  col += vec3(0., .22, .55) * glow * .55;
  // two slow light pools
  vec2 a = vec2(sin(t) * .5, -.15 + cos(t * .8) * .08);
  vec2 b = vec2(cos(t * .7) * .55, -.25 + sin(t * .6) * .06);
  col += vec3(0., .3, .8) * exp(-dot(p - a, p - a) * 4.) * .16;
  col += vec3(.1, .5, 1.) * exp(-dot(p - b, p - b) * 5.) * .1;
  // gentle cursor light
  col += vec3(.1, .45, 1.) * exp(-dot(p - uMouse, p - uMouse) * 9.) * .12 * uHover;
  // fine perspective grid on the lower half, fading into the distance
  if (p.y < -.05) {
    float z = .35 / (-p.y + .02);
    vec2 g = vec2(p.x * z, z + uScroll * 3.);
    vec2 f = abs(fract(g) - .5);
    float line = smoothstep(.485, .5, max(f.x, f.y));
    col += vec3(.1, .45, 1.) * line * .16 * smoothstep(9., 1.5, z);
  }
  col += (hash(gl_FragCoord.xy + floor(uTime * 6.)) - .5) * .012;
  gl_FragColor = vec4(col, 1.);
}`;

  /* ---------------- 04 GEO: point globe with citation arcs ---------------- */
  function geoGlobe(canvas, labelsHost) {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) return null;
    const VS = `
attribute vec3 aPos; attribute float aK; attribute float aT;
uniform float uRotY, uTilt, uAsp, uS, uPx, uTime;
uniform vec3 uHub;
varying float vA; varying vec3 vC; varying float vT; varying float vK;
vec3 ry(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 rx(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
void main(){
  vec3 p = rx(ry(aPos, uRotY), uTilt);
  float d = 3.3 - p.z;
  gl_Position = vec4(p.x * uS / uAsp, p.y * uS, 0., d);
  float face = smoothstep(-.35, .55, p.z);
  float hubD = dot(normalize(aPos), uHub);
  float wave = pow(.5 + .5 * sin(hubD * 18. - uTime * 1.1), 14.) * smoothstep(-.2, .9, hubD) * .6;
  vT = aT; vK = aK;
  if (aK < .5) {             // ocean dot
    vC = vec3(.1, .3, .7); vA = .22 * face;
    gl_PointSize = uPx * 1.1 * (3.3 / d);
  } else if (aK < 1.5) {     // land dot
    vC = mix(vec3(.1, .45, 1.), vec3(.6, .9, 1.), wave);
    vA = (.55 + wave * .8) * face;
    gl_PointSize = uPx * (1.5 + wave) * (3.3 / d);
  } else if (aK < 2.5) {     // arc vertex
    vC = vec3(.35, .75, 1.); vA = face * .9 + .1;
  } else if (aK < 3.5) {     // engine endpoint
    vC = vec3(.6, .85, 1.); vA = face;
    gl_PointSize = uPx * 5. * (3.3 / d);
  } else {                   // hub
    vC = vec3(1.); vA = 1.;
    gl_PointSize = uPx * (9. + 1.5 * sin(uTime * 1.5)) * (3.3 / d);
  }
}`;
    const FS = `
precision highp float;
uniform float uTime, uMode;
varying float vA; varying vec3 vC; varying float vT; varying float vK;
void main(){
  if (uMode > .5) {
    float head = fract(uTime * .16 + floor(vT) * .17);
    float t = fract(vT);
    float pulse = exp(-pow((t - head) * 9., 2.)) * step(t, head + .02);
    float a = (.14 + pulse * 1.4) * vA;
    gl_FragColor = vec4(vC * a, a);
    return;
  }
  vec2 c = gl_PointCoord - .5; float r = dot(c, c);
  if (r > .25) discard;
  float a = smoothstep(.25, 0., r) * vA;
  gl_FragColor = vec4(vC * a, a);
}`;
    let prog;
    try { prog = compile(gl, VS, FS); } catch (e) { console.warn('globe', e); return null; }

    // lat/lon -> unit vector
    const ll = (lat, lon) => { const la = lat * Math.PI / 180, lo = lon * Math.PI / 180; return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]; };
    // cheap 3D value noise for continent-like clumps
    const h3 = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
    const vn = (x, y, z) => {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
      const s = t => t * t * (3 - 2 * t), u = s(xf), v = s(yf), w = s(zf);
      const L = (a, b, t) => a + (b - a) * t;
      return L(L(L(h3(xi, yi, zi), h3(xi + 1, yi, zi), u), L(h3(xi, yi + 1, zi), h3(xi + 1, yi + 1, zi), u), v),
               L(L(h3(xi, yi, zi + 1), h3(xi + 1, yi, zi + 1), u), L(h3(xi, yi + 1, zi + 1), h3(xi + 1, yi + 1, zi + 1), u), v), w);
    };
    const pos = [], kind = [], tt = [];
    const N = SMALL ? 4200 : 9000, ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = ga * i;
      const x = Math.cos(th) * rad, z = Math.sin(th) * rad;
      const n = vn(x * 2.2 + 3, y * 2.2 + 1, z * 2.2 + 7) * .65 + vn(x * 5 + 9, y * 5, z * 5) * .35;
      const land = n > .5;
      if (!land && Math.random() > .35) continue;
      pos.push(x, y, z); kind.push(land ? 1 : 0); tt.push(0);
    }
    const hub = ll(46.8, 8.2);                 // Switzerland — webbetter.ch
    const engines = [
      { name: 'CHATGPT', at: ll(37.8, -122.4) }, { name: 'PERPLEXITY', at: ll(40.7, -74) },
      { name: 'GEMINI', at: ll(1.35, 103.8) }, { name: 'COPILOT', at: ll(47.6, -122.3) },
      { name: 'CLAUDE', at: ll(-33.9, 151.2) }, { name: 'AI OVERVIEWS', at: ll(35.7, 139.7) }
    ];
    const pointCount = pos.length / 3;
    engines.forEach(e => { pos.push(...e.at); kind.push(3); tt.push(0); });
    pos.push(...hub); kind.push(4); tt.push(0);
    const allPoints = pos.length / 3;
    // arcs: great circle with altitude, as line segments
    const slerp = (a, b, t) => {
      const d = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
      const s = Math.sin(d) || 1e-6, k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s;
      return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
    };
    const SEG = 80;
    engines.forEach((e, ei) => {
      for (let i = 0; i < SEG; i++) {
        for (const j of [i, i + 1]) {
          const t = j / SEG, v = slerp(e.at, hub, t), alt = 1 + .32 * Math.sin(Math.PI * t);
          pos.push(v[0] * alt, v[1] * alt, v[2] * alt); kind.push(2); tt.push(ei + Math.min(t, .999));
        }
      }
    });
    const lineStart = allPoints, lineCount = pos.length / 3 - allPoints;
    const mk = (name, arr, size) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW); return { b, loc: gl.getAttribLocation(prog.p, name), size }; };
    const A = [mk('aPos', pos, 3), mk('aK', kind, 1), mk('aT', tt, 1)];

    // labels follow their engines
    const labels = engines.map(e => { const el = document.createElement('span'); el.className = 'geo-label mono'; el.textContent = e.name; labelsHost.appendChild(el); return el; });
    const hubLabel = document.createElement('span'); hubLabel.className = 'geo-label hub mono'; hubLabel.textContent = 'WEBBETTER.CH'; labelsHost.appendChild(hubLabel);

    // drag to spin, with inertia
    let rotY = -.9, vel = .0025, dragging = false, lx = 0, tilt = .42, ttilt = .42;
    const host = canvas.parentElement;
    host.addEventListener('pointerdown', e => { dragging = true; lx = e.clientX; host.setPointerCapture?.(e.pointerId); });
    host.addEventListener('pointermove', e => {
      if (dragging) { const dx = e.clientX - lx; lx = e.clientX; vel = dx * .0009; rotY += dx * .006; }
      const r = canvas.getBoundingClientRect(); ttilt = .42 + ((e.clientY - r.top) / r.height - .5) * .5;
    });
    addEventListener('pointerup', () => { dragging = false; });

    const ry = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [c * p[0] + s * p[2], p[1], -s * p[0] + c * p[2]]; };
    const rx = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0], c * p[1] - s * p[2], s * p[1] + c * p[2]]; };
    let lastScroll = 0;
    return {
      render(time, scroll) {
        fit(canvas, 1);
        const asp = canvas.width / canvas.height, S = 2.35 * Math.min(1, asp / 1.1);
        if (!dragging) { rotY += vel; vel += (.0011 - vel) * .02; }
        rotY += (scroll - lastScroll) * 2.2; lastScroll = scroll;
        tilt += (ttilt - tilt) * .05;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
        gl.useProgram(prog.p);
        A.forEach(a => { gl.bindBuffer(gl.ARRAY_BUFFER, a.b); gl.enableVertexAttribArray(a.loc); gl.vertexAttribPointer(a.loc, a.size, gl.FLOAT, false, 0, 0); });
        gl.uniform1f(prog.u.uRotY, rotY); gl.uniform1f(prog.u.uTilt, tilt);
        gl.uniform1f(prog.u.uAsp, asp); gl.uniform1f(prog.u.uS, S);
        gl.uniform1f(prog.u.uPx, DPR * (SMALL ? 1.4 : 1.6)); gl.uniform1f(prog.u.uTime, time);
        gl.uniform3f(prog.u.uHub, hub[0], hub[1], hub[2]);
        gl.uniform1f(prog.u.uMode, 0); gl.drawArrays(gl.POINTS, 0, allPoints);
        gl.uniform1f(prog.u.uMode, 1); gl.drawArrays(gl.LINES, lineStart, lineCount);
        // project labels
        const r = canvas.getBoundingClientRect();
        const place = (el, v, lift) => {
          const p = rx(ry(v, rotY), tilt), d = 3.3 - p[2] * lift;
          const x = (p[0] * lift * S / asp / d * .5 + .5) * r.width, y = (.5 - p[1] * lift * S / d * .5) * r.height;
          el.style.transform = `translate(${x}px, ${y}px)`;
          el.style.opacity = p[2] > -.05 ? 1 : 0;
        };
        engines.forEach((e, i) => place(labels[i], e.at, 1.06));
        place(hubLabel, hub, 1.08);
        canvas.classList.add('live');
      }
    };
  }

  /* ---------------- Clients: real-time fluid (WebGL2) ---------------- */
  function fluid(canvas) {
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) return null;
    gl.getExtension('OES_texture_float_linear');
    const VS = `#version 300 es
in vec2 aPos; out vec2 vUv, vL, vR, vT, vB; uniform vec2 uTexel;
void main(){ vUv = aPos * .5 + .5; vL = vUv - vec2(uTexel.x, 0.); vR = vUv + vec2(uTexel.x, 0.); vT = vUv + vec2(0., uTexel.y); vB = vUv - vec2(0., uTexel.y); gl_Position = vec4(aPos, 0., 1.); }`;
    const H = `#version 300 es
precision highp float; in vec2 vUv, vL, vR, vT, vB; out vec4 o;`;
    const FS = {
      splat: H + `uniform sampler2D uTarget; uniform float uAspect, uRadius; uniform vec3 uColor; uniform vec2 uPoint;
void main(){ vec2 p = vUv - uPoint; p.x *= uAspect; vec3 s = exp(-dot(p, p) / uRadius) * uColor; o = vec4(texture(uTarget, vUv).xyz + s, 1.); }`,
      advect: H + `uniform sampler2D uVel, uSrc; uniform vec2 uTexel; uniform float uDt, uDiss;
void main(){ vec2 c = vUv - uDt * texture(uVel, vUv).xy * uTexel; o = texture(uSrc, c) / (1. + uDiss * uDt); }`,
      curl: H + `uniform sampler2D uVel;
void main(){ float L = texture(uVel, vL).y, R = texture(uVel, vR).y, T = texture(uVel, vT).x, B = texture(uVel, vB).x; o = vec4(.5 * (R - L - T + B), 0., 0., 1.); }`,
      vort: H + `uniform sampler2D uVel, uCurl; uniform float uCurlK, uDt;
void main(){ float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x, T = texture(uCurl, vT).x, B = texture(uCurl, vB).x, C = texture(uCurl, vUv).x;
  vec2 f = .5 * vec2(abs(T) - abs(B), abs(R) - abs(L)); f /= length(f) + 1e-4; f *= uCurlK * C; f.y *= -1.;
  vec2 v = texture(uVel, vUv).xy + f * uDt; o = vec4(clamp(v, -1000., 1000.), 0., 1.); }`,
      div: H + `uniform sampler2D uVel;
void main(){ float L = texture(uVel, vL).x, R = texture(uVel, vR).x, T = texture(uVel, vT).y, B = texture(uVel, vB).y;
  vec2 C = texture(uVel, vUv).xy; if (vL.x < 0.) L = -C.x; if (vR.x > 1.) R = -C.x; if (vT.y > 1.) T = -C.y; if (vB.y < 0.) B = -C.y;
  o = vec4(.5 * (R - L + T - B), 0., 0., 1.); }`,
      clear: H + `uniform sampler2D uTex; uniform float uVal; void main(){ o = uVal * texture(uTex, vUv); }`,
      press: H + `uniform sampler2D uP, uDiv;
void main(){ float L = texture(uP, vL).x, R = texture(uP, vR).x, T = texture(uP, vT).x, B = texture(uP, vB).x, d = texture(uDiv, vUv).x;
  o = vec4((L + R + B + T - d) * .25, 0., 0., 1.); }`,
      grad: H + `uniform sampler2D uP, uVel;
void main(){ float L = texture(uP, vL).x, R = texture(uP, vR).x, T = texture(uP, vT).x, B = texture(uP, vB).x;
  vec2 v = texture(uVel, vUv).xy - vec2(R - L, T - B); o = vec4(v, 0., 1.); }`,
      show: H + `uniform sampler2D uDye;
void main(){ vec3 c = texture(uDye, vUv).rgb; float a = clamp(max(c.r, max(c.g, c.b)) * 1.15, 0., .92); c = min(c, vec3(a)); o = vec4(c, a); }`
    };
    let P2;
    try { P2 = Object.fromEntries(Object.entries(FS).map(([k, f]) => [k, compile(gl, VS, f)])); } catch (e) { console.warn('fluid', e); return null; }
    const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const fbo = (w, h) => {
      const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fb, w, h };
    };
    const dbl = (w, h) => { let a = fbo(w, h), b = fbo(w, h); return { get r() { return a; }, get w() { return b; }, swap() { const t = a; a = b; b = t; }, W: w, H: h }; };
    let vel, dye, pres, divg, curl, simW, simH;
    const alloc = () => {
      const asp = canvas.width / canvas.height;
      const s = 128, d = SMALL ? 384 : 640;
      simW = Math.round(asp >= 1 ? s * asp : s); simH = Math.round(asp >= 1 ? s : s / asp);
      const dw = Math.round(asp >= 1 ? d * asp : d), dh = Math.round(asp >= 1 ? d : d / asp);
      vel = dbl(simW, simH); dye = dbl(dw, dh); pres = dbl(simW, simH); divg = fbo(simW, simH); curl = fbo(simW, simH);
    };
    const run = (prog, target, setU) => {
      gl.useProgram(prog.p);
      const loc = gl.getAttribLocation(prog.p, 'aPos');
      gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      let unit = 0;
      const tex = (name, t) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t.tex); gl.uniform1i(prog.u[name], unit++); };
      setU(prog.u, tex);
      if (target) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb); gl.viewport(0, 0, target.w, target.h); }
      else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const PAL = [[0, .35, .75], [.16, .66, 1], [0, .09, .26], [.05, .45, .95]];
    const splat = (x, y, dx, dy, col, radius = .0028) => {
      const asp = canvas.width / canvas.height;
      run(P2.splat, vel.w, (u, tex) => { tex('uTarget', vel.r); gl.uniform1f(u.uAspect, asp); gl.uniform2f(u.uPoint, x, y); gl.uniform3f(u.uColor, dx, dy, 0); gl.uniform1f(u.uRadius, radius); }); vel.swap();
      run(P2.splat, dye.w, (u, tex) => { tex('uTarget', dye.r); gl.uniform1f(u.uAspect, asp); gl.uniform2f(u.uPoint, x, y); gl.uniform3f(u.uColor, col[0], col[1], col[2]); gl.uniform1f(u.uRadius, radius); }); dye.swap();
    };
    let lastT = 0, lx = -1, ly = -1, lastScrollY = scrollY, auto = 0;
    return {
      render(time) {
        if (fit(canvas, .5) || !vel) alloc();
        const dt = Math.min(.033, Math.max(.008, time - lastT)); lastT = time;
        gl.disable(gl.BLEND);
        const r = canvas.getBoundingClientRect();
        // pointer splats (anywhere over the section, cards included)
        const x = (P.x - r.left) / r.width, y = 1 - (P.y - r.top) / r.height;
        if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
          if (lx >= 0) {
            const dx = (x - lx) * 5000, dy = (y - ly) * 5000;
            if (Math.abs(dx) + Math.abs(dy) > 1) splat(x, y, dx * .6, dy * .6, PAL[(time * 2 | 0) % PAL.length].map(c => c * .18));
          }
          lx = x; ly = y;
        } else lx = -1;
        // scroll stirs from the sides; slow drifting emitter keeps it alive
        const sv = scrollY - lastScrollY; lastScrollY = scrollY;
        if (false && Math.abs(sv) > 2) { const side = (time * 3 | 0) % 2; splat(side ? .04 : .96, .2 + Math.random() * .6, (side ? 1 : -1) * Math.min(Math.abs(sv), 60) * 25, -sv * 18, PAL[(time | 0) % PAL.length].map(c => c * .28), .006); }
        auto += dt;
        if (false && auto > .12) { auto = 0; const ex = .5 + .38 * Math.sin(time * .41), ey = .5 + .32 * Math.sin(time * .67 + 1); splat(ex, ey, Math.cos(time * .41) * 220, Math.cos(time * .67) * 260, PAL[1].map(c => c * .07), .004); }

        const texel = (t) => [1 / t.W, 1 / t.H];
        const st = texel(vel);
        const setT = (u) => gl.uniform2f(u.uTexel, st[0], st[1]);
        run(P2.curl, curl, (u, tex) => { setT(u); tex('uVel', vel.r); });
        run(P2.vort, vel.w, (u, tex) => { setT(u); tex('uVel', vel.r); tex('uCurl', curl); gl.uniform1f(u.uCurlK, 22); gl.uniform1f(u.uDt, dt); }); vel.swap();
        run(P2.div, divg, (u, tex) => { setT(u); tex('uVel', vel.r); });
        run(P2.clear, pres.w, (u, tex) => { setT(u); tex('uTex', pres.r); gl.uniform1f(u.uVal, .8); }); pres.swap();
        for (let i = 0; i < 18; i++) { run(P2.press, pres.w, (u, tex) => { setT(u); tex('uP', pres.r); tex('uDiv', divg); }); pres.swap(); }
        run(P2.grad, vel.w, (u, tex) => { setT(u); tex('uP', pres.r); tex('uVel', vel.r); }); vel.swap();
        run(P2.advect, vel.w, (u, tex) => { setT(u); tex('uVel', vel.r); tex('uSrc', vel.r); gl.uniform1f(u.uDt, dt); gl.uniform1f(u.uDiss, .25); }); vel.swap();
        run(P2.advect, dye.w, (u, tex) => { setT(u); tex('uVel', vel.r); tex('uSrc', dye.r); gl.uniform1f(u.uDt, dt); gl.uniform1f(u.uDiss, 1.6); }); dye.swap();
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); gl.clear(gl.COLOR_BUFFER_BIT);
        run(P2.show, null, (u, tex) => { const dt2 = [1 / dye.W, 1 / dye.H]; gl.uniform2f(u.uTexel, dt2[0], dt2[1]); tex('uDye', dye.r); });
        canvas.classList.add('live');
      }
    };
  }

  /* ---------------- Insights: liquid hover card ---------------- */
  function hoverCards(canvas, posts) {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) return null;
    const VS = `
attribute vec2 aUv; uniform vec2 uPos, uSize, uRes, uVel; uniform float uShow; varying vec2 vUv;
void main(){
  vUv = aUv;
  vec2 l = (aUv - .5) * uSize * (.55 + .45 * uShow);
  l.x -= uVel.x * sin(aUv.y * 3.14159) * 1.8;
  l.y -= uVel.y * sin(aUv.x * 3.14159) * 1.8;
  l += uVel * .4 * (aUv.y - .5);
  vec2 p = uPos + l;
  gl_Position = vec4(p / uRes * 2. - 1., 0., 1.) * vec4(1., -1., 1., 1.);
}`;
    const FS = `
precision highp float; varying vec2 vUv; uniform sampler2D uTex; uniform vec2 uVel; uniform float uShow, uTime;
float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
void main(){
  vec2 uv = vUv;
  float sp = length(uVel);
  uv += vec2(sin(uv.y * 18. + uTime * 5.), cos(uv.x * 14. + uTime * 4.)) * .002 * min(sp * .05, 1.);
  vec2 sh = uVel * .0008;
  vec3 c = vec3(texture2D(uTex, uv + sh).r, texture2D(uTex, uv).g, texture2D(uTex, uv - sh).b);
  float m = smoothstep(.004, -.004, sdRB(vUv - .5, vec2(.5), .05));
  float a = m * uShow;
  gl_FragColor = vec4(c * a, a);
}`;
    let prog;
    try { prog = compile(gl, VS, FS); } catch (e) { console.warn('hover', e); return null; }
    const G = 24, uv = [];
    for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
      const a = [x / G, y / G], b = [(x + 1) / G, y / G], c = [x / G, (y + 1) / G], d = [(x + 1) / G, (y + 1) / G];
      uv.push(...a, ...b, ...c, ...b, ...d, ...c);
    }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog.p, 'aUv');
    // build one texture per post from a 2D canvas drawing
    const draw = (kind, title, tag) => {
      const c = document.createElement('canvas'); c.width = 640; c.height = 448; const x = c.getContext('2d');
      const g = x.createRadialGradient(320, 200, 20, 320, 224, 460);
      if (kind === 'geo') { g.addColorStop(0, '#2aa8ff'); g.addColorStop(.45, '#0058be'); g.addColorStop(1, '#001742'); }
      else if (kind === 'seo') { g.addColorStop(0, '#0f3a2a'); g.addColorStop(1, '#05080f'); }
      else { g.addColorStop(0, '#9fd8ff'); g.addColorStop(.5, '#2a7fe0'); g.addColorStop(1, '#001742'); }
      x.fillStyle = g; x.fillRect(0, 0, 640, 448);
      x.strokeStyle = 'rgba(255,255,255,.1)'; for (let i = 0; i < 640; i += 40) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 448); x.stroke(); }
      for (let i = 0; i < 448; i += 40) { x.beginPath(); x.moveTo(0, i); x.lineTo(640, i); x.stroke(); }
      x.fillStyle = 'rgba(255,255,255,.95)'; x.font = '800 150px Manrope, sans-serif'; x.textBaseline = 'middle';
      x.fillText(tag, 40, 250);
      x.font = '500 22px "JetBrains Mono", monospace'; x.fillStyle = 'rgba(255,255,255,.75)';
      x.fillText(title.toUpperCase().slice(0, 40), 44, 64);
      if (kind === 'seo') { x.strokeStyle = '#3ddc97'; x.lineWidth = 6; x.beginPath(); x.moveTo(40, 400); x.bezierCurveTo(250, 390, 380, 300, 600, 110); x.stroke(); }
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };
    const texes = new Map();
    posts.forEach(p => {
      const kind = p.dataset.art.includes('geo') ? 'geo' : p.dataset.art.includes('seo') ? 'seo' : 'design';
      const tag = kind === 'geo' ? 'GEO' : kind === 'seo' ? 'CWV' : 'UX';
      texes.set(p, () => draw(kind, p.querySelector('h3').textContent, tag));
    });
    let current = null, show = 0, target = 0, px = P.x, py = P.y, vx = 0, vy = 0, cleared = true;
    posts.forEach(p => {
      p.addEventListener('pointerenter', () => { const t = texes.get(p); if (typeof t === 'function') texes.set(p, t()); current = texes.get(p); target = 1; });
      p.addEventListener('pointerleave', () => { target = 0; });
    });
    return {
      render(time) {
        show += (target - show) * .12;
        if (show < .002 && target === 0) { if (!cleared) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); cleared = true; } return; }
        cleared = false;
        fit(canvas, 1);
        const nx = px + (P.x - px) * .16, ny = py + (P.y - py) * .16;
        vx += ((nx - px) - vx) * .3; vy += ((ny - py) - vy) * .3; px = nx; py = ny;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(prog.p);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.bindTexture(gl.TEXTURE_2D, current);
        gl.uniform2f(prog.u.uPos, px * DPR, py * DPR); gl.uniform2f(prog.u.uSize, 340 * DPR, 238 * DPR);
        gl.uniform2f(prog.u.uRes, canvas.width, canvas.height); gl.uniform2f(prog.u.uVel, vx * DPR, vy * DPR);
        gl.uniform1f(prog.u.uShow, show); gl.uniform1f(prog.u.uTime, time);
        gl.drawArrays(gl.TRIANGLES, 0, G * G * 6);
        canvas.classList.add('live');
      }
    };
  }

  /* ---------------- Footer: liquid wordmark ---------------- */
  function liquidWordmark(canvas, wordmark) {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    let prog;
    try {
      prog = compile(gl, QUAD_VS, `precision highp float;
uniform vec2 uRes, uMouse; uniform float uTime, uReveal, uHover; uniform sampler2D uTex;
${NOISE}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes; uv.y = 1. - uv.y;
  vec2 asp = vec2(uRes.x / uRes.y, 1.);
  vec2 d = (uv - uMouse) * asp; float r = length(d);
  float wave = sin(r * 38. - uTime * 7.) * exp(-r * 5.) * uHover;
  vec2 off = normalize(d + 1e-5) / asp * wave * .01;

  float split = (.004 + abs(wave) * .012);
  vec4 cr = texture2D(uTex, uv + off + vec2(split, 0.));
  vec4 cg = texture2D(uTex, uv + off);
  vec4 cb = texture2D(uTex, uv + off - vec2(split, 0.));
  vec4 c = vec4(cr.r, cg.g, cb.b, max(cg.a, max(cr.a, cb.a)));
  float n = fbm(uv * vec2(14., 5.));
  float th = uReveal * 1.35 - (1. - uv.y) * .35;
  float m = smoothstep(n - .04, n + .04, th);
  float edge = smoothstep(.05, 0., abs(n - th)) * step(.01, c.a);
  c *= m;
  c.rgb += vec3(.16, .66, 1.) * edge * .9; c.a = max(c.a, edge * .9 * cg.a);
  gl_FragColor = c;
}`);
    } catch (e) { console.warn('wordmark', e); return null; }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog.p, 'a');
    const tex = gl.createTexture();
    const paint = () => {
      fit(canvas, 1);
      const r = wordmark.getBoundingClientRect();
      const c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height;
      const x = c.getContext('2d'); x.scale(c.width / r.width, c.height / r.height);
      const letters = [...wordmark.querySelectorAll('.wl')];
      const saved = letters.map(l => l.style.transform); letters.forEach(l => { l.style.transform = 'none'; });
      letters.forEach(l => {
        const cs = getComputedStyle(l), lr = l.getBoundingClientRect();
        x.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        x.fillStyle = cs.color; x.textBaseline = 'alphabetic';
        const m = x.measureText(l.textContent);
        const asc = m.fontBoundingBoxAscent || parseFloat(cs.fontSize) * .8, desc = m.fontBoundingBoxDescent || parseFloat(cs.fontSize) * .2;
        const base = lr.top - r.top + (lr.height - (asc + desc)) / 2 + asc;
        x.fillText(l.textContent, lr.left - r.left, base);
      });
      letters.forEach((l, i) => { l.style.transform = saved[i]; });
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    let painted = false, hover = 0;
    const m = [.5, .5];
    const repaint = () => { painted = false; };
    addEventListener('resize', repaint);
    new MutationObserver(repaint).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', repaint);
    return {
      render(time, reveal) {
        if (!painted) { paint(); painted = true; }
        const r = canvas.getBoundingClientRect();
        const inside = P.x > r.left - 80 && P.x < r.right + 80 && P.y > r.top - 120 && P.y < r.bottom + 60;
        hover += ((inside ? 1 : 0) - hover) * .06;
        m[0] += ((P.x - r.left) / r.width - m[0]) * .12; m[1] += ((P.y - r.top) / r.height - m[1]) * .12;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(prog.p);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform2f(prog.u.uRes, canvas.width, canvas.height); gl.uniform2f(prog.u.uMouse, m[0], m[1]);
        gl.uniform1f(prog.u.uTime, time); gl.uniform1f(prog.u.uReveal, reveal); gl.uniform1f(prog.u.uHover, hover);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        canvas.classList.add('live');
      }
    };
  }


  /* ---------------- Contact tiles: four scenes, one context ---------------- */
  const TILE_HEAD = `precision highp float;
uniform vec2 uOrigin, uRes, uMouse; uniform float uTime, uReveal, uHover, uDpr;
${NOISE}
float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
float bayer2(vec2 a){ a = floor(a); return fract(dot(a, vec2(.5, a.y * .75))); }
float bayer4(vec2 a){ return bayer2(.5 * a) * .25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(.5 * a) * .25 + bayer2(a); }
vec4 finish(vec3 col, vec2 uv){
  vec2 c = uv - .5;
  float edge = smoothstep(.5, .3, abs(c.x)) * smoothstep(.5, .3, abs(c.y));
  float row = floor(uv.y * 26.);
  float th = uv.x * .55 + hash(vec2(row, 3.)) * .45;
  float k = uReveal * 1.25;
  float vis = smoothstep(th - .06, th + .06, k);
  col *= vis * edge * (.85 + uHover * .25);
  float a = clamp(max(col.r, max(col.g, col.b)) * 1.15, 0., 1.);
  return vec4(min(col, vec3(a)), a);
}
`;
  const TILES = {
    design: `
float gyroid(vec3 p){ return dot(sin(p), cos(p.yzx)); }
float map(vec3 p){
  p.xz *= rot(uTime * .3 + uMouse.x * 1.5); p.yz *= rot(uTime * .2 - uMouse.y * 1.5);
  float sph = length(p) - .82;
  float g = abs(gyroid(p * 4.4 + uTime * .4)) / 4.4 - .03;
  return max(sph, g) * .8;
}
vec3 nrm(vec3 p){ vec2 e = vec2(.002, 0.); return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx))); }
void main(){
  vec2 uv = (gl_FragCoord.xy - uOrigin) / uRes, p = (uv - .5) * vec2(uRes.x / uRes.y, 1.);
  vec3 ro = vec3(0., 0., 2.7), rd = normalize(vec3(p, -1.35));
  float t = 0., d = 1., gw = 0.;
  for (int i = 0; i < 64; i++) { d = map(ro + rd * t); gw += .008 / (1. + d * d * 80.); if (d < .002 || t > 5.) break; t += d; }
  vec3 col = vec3(0., .3, .8) * gw * .35;
  if (d < .01) {
    vec3 q = ro + rd * t, n = nrm(q);
    float fr = pow(1. - max(dot(n, -rd), 0.), 2.);
    float dif = max(dot(n, normalize(vec3(.4, .8, .6))), 0.);
    col = mix(vec3(0., .16, .45), vec3(.55, .85, 1.), clamp(fr * .9 + dif * .35, 0., 1.));
    col += vec3(.8, .95, 1.) * pow(max(dot(reflect(rd, n), normalize(vec3(.4, .8, .6))), 0.), 30.) * .8;
  }
  gl_FragColor = finish(col, uv);
}`,
    geo: `
void main(){
  vec2 uv = (gl_FragCoord.xy - uOrigin) / uRes, p = (uv - .5) * vec2(uRes.x / uRes.y, 1.);
  p -= uMouse * .12;
  float r = length(p), a = atan(p.y, p.x);
  vec3 col = vec3(0.);
  float rings = smoothstep(.006, 0., abs(fract(r * 6. - uTime * .25) - .5) - .47) * smoothstep(.75, .1, r);
  col += vec3(0., .3, .75) * rings * .35;
  float sweep = mod(a - uTime * 1.4, 6.2831);
  col += vec3(.1, .5, 1.) * exp(-sweep * 2.2) * smoothstep(.72, .05, r) * .55;
  for (int i = 0; i < 9; i++) {
    float fi = float(i), ang = fi * .698 + .3;
    vec2 dir = vec2(cos(ang), sin(ang));
    float along = dot(p, dir), across = abs(dot(p, vec2(-dir.y, dir.x)));
    float ray = smoothstep(.006, 0., across) * step(0., along) * smoothstep(.62, .1, along);
    col += vec3(.1, .4, .9) * ray * .35;
    for (int j = 0; j < 3; j++) {
      float ph = fract(uTime * (.35 + fi * .03) + fi * .37 + float(j) * .33);
      vec2 dp = dir * (.62 * (1. - ph));
      col += vec3(.5, .85, 1.) * exp(-dot(p - dp, p - dp) * 2400.) * 1.6;
    }
    vec2 node = dir * .62;
    float hit = exp(-pow(mod(ang - uTime * 1.4, 6.2831), 2.) * 6.);
    col += vec3(.4, .8, 1.) * exp(-dot(p - node, p - node) * 900.) * (.6 + hit * 2.);
  }
  float core = exp(-r * r * 140.);
  col += vec3(.6, .9, 1.) * core * (1.2 + .4 * sin(uTime * 4.)) + vec3(0., .3, .9) * exp(-r * 9.) * .5;
  col += vec3(.3, .7, 1.) * smoothstep(.006, 0., abs(r - .085)) * (.6 + uHover);
  gl_FragColor = finish(col, uv);
}`,
    web: `
float ol(float d, float w){ return smoothstep(w, 0., abs(d)); }
float fillIn(float d){ return smoothstep(.002, -.002, d); }
void main(){
  vec2 uv = (gl_FragCoord.xy - uOrigin) / uRes;
  vec2 q = (uv - .5) * vec2(uRes.x / uRes.y, 1.);
  float w = 1.4 * uDpr / uRes.y;
  float cyc = fract(uTime * .1);
  float prog = max(smoothstep(0., .6, cyc) * (1. - smoothstep(.9, 1., cyc)), uHover);
  #define V(k) smoothstep(k, k + .1, prog)
  vec3 line = vec3(.25, .65, 1.), col = vec3(0.);
  float frame = sdRB(q - vec2(-.1, .02), vec2(.5, .36), .03);
  col += line * ol(frame, w) * V(0.) + vec3(0., .08, .2) * fillIn(frame) * V(0.) * .5;
  col += line * ol(sdRB(q - vec2(-.1, .32), vec2(.5, .0), .0), w) * V(.05) * .6;
  float hero = sdRB(q - vec2(-.1, .16), vec2(.42, .1), .02);
  col += mix(vec3(0., .3, .75), vec3(.2, .65, 1.), uv.x) * fillIn(hero) * V(.15) * .55 + line * ol(hero, w) * V(.15);
  for (int i = 0; i < 3; i++) { float fi = float(i);
    col += line * .7 * fillIn(sdRB(q - vec2(-.42 + fi * .02, -.01 - fi * .055), vec2(.1 - fi * .025, .008), .008)) * V(.3 + fi * .05); }
  for (int i = 0; i < 3; i++) { float fi = float(i);
    float cd = sdRB(q - vec2(-.38 + fi * .28, -.22), vec2(.12, .08), .015);
    col += line * ol(cd, w) * V(.45 + fi * .06) + vec3(0., .1, .25) * fillIn(cd) * V(.45 + fi * .06) * .6; }
  float ph = sdRB(q - vec2(.5, -.05), vec2(.12, .26), .035);
  col += line * ol(ph, w) * V(.65) * 1.2 + vec3(0., .06, .16) * fillIn(ph) * V(.65);
  for (int i = 0; i < 3; i++) { float fi = float(i);
    col += vec3(0., .3, .75) * fillIn(sdRB(q - vec2(.5, .1 - fi * .12), vec2(.085, .045), .015)) * V(.72 + fi * .05) * .7; }
  gl_FragColor = finish(col, uv);
}`,
    seo: `
float hgt(vec2 x){
  float h = fbm(x * .35) * 1.6;
  vec2 pk = x - vec2(0., uTime * 1.2 + 14.);
  pk.y = mod(pk.y + 10., 20.) - 10.;
  h += 3.2 * exp(-dot(pk, pk) * .18);
  return h * (.6 + uHover * .6);
}
void main(){
  vec2 uv = (gl_FragCoord.xy - uOrigin) / uRes, p = (uv - .5) * vec2(uRes.x / uRes.y, 1.);
  vec3 ro = vec3(uMouse.x * 2., 2.6 + uMouse.y, uTime * 1.2);
  vec3 rd = normalize(vec3(p.x, p.y - .28, 1.));
  float t = .5; vec3 pos = ro; bool hit = false;
  for (int i = 0; i < 70; i++) { pos = ro + rd * t; float d = pos.y - hgt(pos.xz); if (d < .01) { hit = true; break; } t += max(d * .45, .04); if (t > 30.) break; }
  vec3 sky = vec3(0., .2, .55) * exp(-abs(p.y - .02) * 18.) * .35;
  vec3 col = sky;
  if (hit) {
    vec2 g = abs(fract(pos.xz * vec2(1., .5)) - .5);
    float line = smoothstep(.45, .5, max(g.x, g.y));
    float hh = hgt(pos.xz);
    col = mix(vec3(0., .4, .9), vec3(.5, .9, 1.), clamp(hh / 3., 0., 1.)) * line;
    col *= exp(-t * .09);
  }
  gl_FragColor = finish(col, uv);
}`
  };

  function tiles(canvas, slots) {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    const progs = {};
    try { Object.entries(TILES).forEach(([k, src]) => { progs[k] = compile(gl, QUAD_VS, TILE_HEAD + src); }); }
    catch (e) { console.warn('tiles', e); return null; }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const state = slots.map(el => ({ el, kind: el.dataset.g, hover: 0, m: [0, 0] }));
    return {
      render(time, reveals) {
        fit(canvas, 1);
        const cr = canvas.getBoundingClientRect(), sx = canvas.width / cr.width, sy = canvas.height / cr.height;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.disable(gl.SCISSOR_TEST);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.SCISSOR_TEST);
        state.forEach((s, i) => {
          const r = s.el.getBoundingClientRect();
          if (r.width < 2 || r.bottom < 0 || r.top > innerHeight) return;
          const x = (r.left - cr.left) * sx, w = r.width * sx, h = r.height * sy, y = canvas.height - (r.bottom - cr.top) * sy;
          const inside = P.x > r.left && P.x < r.right && P.y > r.top && P.y < r.bottom;
          s.hover += ((inside ? 1 : 0) - s.hover) * .08;
          const tx = inside ? (P.x - r.left) / r.width - .5 : 0, ty = inside ? .5 - (P.y - r.top) / r.height : 0;
          s.m[0] += (tx - s.m[0]) * .08; s.m[1] += (ty - s.m[1]) * .08;
          const pr = progs[s.kind];
          gl.scissor(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
          gl.useProgram(pr.p);
          const loc = gl.getAttribLocation(pr.p, 'a');
          gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
          gl.uniform2f(pr.u.uOrigin, x, y); gl.uniform2f(pr.u.uRes, w, h);
          gl.uniform1f(pr.u.uTime, time + i * 7.3); gl.uniform1f(pr.u.uReveal, reveals[i]);
          gl.uniform1f(pr.u.uHover, s.hover); gl.uniform2f(pr.u.uMouse, s.m[0], s.m[1]);
          gl.uniform1f(pr.u.uDpr, sx);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        });
        gl.disable(gl.SCISSOR_TEST);
        canvas.classList.add('live');
      }
    };
  }

  /* ---------------- Type window: live scene seen through giant letters ---------------- */
  function typeWindow(canvas, lines) {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    let prog;
    try {
      prog = compile(gl, QUAD_VS, `precision highp float;
uniform vec2 uRes, uMouse, uFocus; uniform float uTime, uFill, uZoom, uFade; uniform sampler2D uTex;
${NOISE}
vec3 scene(vec2 p, vec2 mp){
  // domain-warped liquid light in the logo blues
  vec2 q = vec2(fbm(p * 1.4 + uTime * .08), fbm(p * 1.4 + vec2(5.2, 1.3) - uTime * .06));
  vec2 m = p - mp;
  q += .35 * exp(-dot(m, m) * 3.) * vec2(sin(uTime * 2.), cos(uTime * 2.));
  float f = fbm(p * 1.8 + q * 2.6 + uTime * .05);
  vec3 c = mix(vec3(0., .05, .2), vec3(0., .35, .78), smoothstep(.2, .7, f));
  c = mix(c, vec3(.18, .68, 1.), smoothstep(.55, .85, f));
  float caust = pow(abs(sin(f * 22. + uTime)), 18.);
  c += vec3(.6, .9, 1.) * caust * .25;
  c += vec3(1.) * pow(smoothstep(.75, 1., f), 3.) * .6;
  return c;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes; uv.y = 1. - uv.y;
  // zoom toward a point inside a letter stroke
  vec2 tuv = uFocus + (uv - uFocus) / uZoom;
  vec2 asp = vec2(uRes.x / uRes.y, 1.);
  vec2 m = (uv - uMouse) * asp;
  float ripple = exp(-dot(m, m) * 18.) * .012;
  vec4 t = texture2D(uTex, tuv + m * ripple);
  float ink = t.a;
  vec2 p = (uv - .5) * asp * 2.;
  vec3 sc = scene(p * (1. + (uZoom - 1.) * .02), (uMouse - .5) * asp * 2.);
  // fill: solid brand blue dissolves into the live scene
  float n = fbm(uv * vec2(9., 4.) + 3.);
  float k = smoothstep(n - .08, n + .08, uFill * 1.25 - uv.x * .15);
  float edge = smoothstep(.07, 0., abs(n - (uFill * 1.25 - uv.x * .15))) * step(.001, uFill) * step(uFill, .99);
  vec3 solid = vec3(0., .345, .745);
  vec3 col = mix(solid, sc, k) + vec3(.5, .85, 1.) * edge;
  float a = ink * uFade;
  gl_FragColor = vec4(col * a, a);
}`);
    } catch (e) { console.warn('type', e); return null; }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog.p, 'a');
    const tex = gl.createTexture();
    let focus = [.5, .5], painted = false;
    const paint = () => {
      fit(canvas, 1);
      const W = canvas.width, H = canvas.height;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d');
      const narrow = W / H < 1;
      let size = Math.min(W / (narrow ? 5.6 : 7.4), H / (lines.length * 1.05));
      x.font = `800 ${size}px Manrope, sans-serif`;
      const widest = Math.max(...lines.map(l => x.measureText(l).width));
      size *= Math.min(1, (W * .9) / widest);
      x.font = `800 ${size}px Manrope, sans-serif`;
      x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff';
      if ('letterSpacing' in x) x.letterSpacing = `${-size * .05}px`;
      const lh = size * .95, top = H / 2 - (lines.length - 1) * lh / 2;
      lines.forEach((l, i) => x.fillText(l, W / 2, top + i * lh));
      // find a solid stroke pixel near the centre to zoom through
      const d = x.getImageData(0, 0, W, H).data;
      let best = null, bd = 1e9;
      for (let yy = 0; yy < H; yy += 4) for (let xx = 0; xx < W; xx += 4) {
        if (d[(yy * W + xx) * 4 + 3] > 250) {
          // prefer pixels deep inside a stroke
          const ok = [[6, 0], [-6, 0], [0, 6], [0, -6]].every(([a, b]) => d[(((yy + b) * W) + xx + a) * 4 + 3] > 250);
          if (!ok) continue;
          const dd = (xx - W / 2) ** 2 + (yy - H / 2) ** 2;
          if (dd < bd) { bd = dd; best = [xx / W, yy / H]; }
        }
      }
      if (best) focus = best;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    addEventListener('resize', () => { painted = false; });
    const m = [.5, .5];
    return {
      render(time, prog01) {
        if (!painted) { paint(); painted = true; }
        else fit(canvas, 1) && (painted = false);
        const r = canvas.getBoundingClientRect();
        m[0] += ((P.x - r.left) / r.width - m[0]) * .08; m[1] += ((P.y - r.top) / r.height - m[1]) * .08;
        // 0-.15 settle, .15-.55 fill, .6-1 zoom through the letter
        const fill = Math.min(1, Math.max(0, (prog01 - .12) / .4));
        const z = Math.max(0, (prog01 - .58) / .42);
        const zoom = 1 + Math.pow(z, 3) * 70;
        const fade = 1 - Math.max(0, (prog01 - .94) / .06);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(prog.p);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform2f(prog.u.uRes, canvas.width, canvas.height); gl.uniform2f(prog.u.uMouse, m[0], m[1]);
        gl.uniform2f(prog.u.uFocus, focus[0], focus[1]);
        gl.uniform1f(prog.u.uTime, time); gl.uniform1f(prog.u.uFill, fill); gl.uniform1f(prog.u.uZoom, zoom); gl.uniform1f(prog.u.uFade, fade);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        canvas.classList.add('live');
        return zoom;
      }
    };
  }


  /* ---------------- Stand out: white type that fills with an Alpine aurora ---------------- */
  function imageType(canvas, lines) {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    let prog;
    try {
      prog = compile(gl, QUAD_VS, `precision highp float;
uniform vec2 uRes, uMouse; uniform float uTime, uIn, uFill, uScale, uOpen, uPar; uniform sampler2D uTex;
${NOISE}
float ridge(float x, float seed, float amp, float freq){
  float h = 0., a = amp, f = freq;
  for (int i = 0; i < 5; i++) { float n = noise(vec2(x * f + seed, seed * 1.7)); h += a * (1. - abs(n * 2. - 1.)); a *= .5; f *= 2.1; }
  return h;
}
vec3 alps(vec2 uv){
  // uv: 0..1, y up. Parallax: farther layers move less with scroll and pointer.
  vec2 m = (uMouse - .5) * vec2(1., -1.);
  vec3 col = mix(vec3(.02, .16, .42), vec3(.0, .03, .12), uv.y);
  // stars
  vec2 sg = floor(uv * vec2(260., 140.));
  float st = hash(sg);
  col += step(.992, st) * (.4 + .6 * hash(sg + 3.)) * smoothstep(.35, .8, uv.y) * (.7 + .3 * sin(uTime * 2. + st * 40.));
  // aurora curtains
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float x = uv.x + m.x * .02 * (fi + 1.);
    float base = .62 + fi * .07 + .07 * fbm(vec2(x * 1.6 + fi * 3., uTime * .05 + fi)) - uPar * .05;
    float d = uv.y - base;
    float curtain = exp(-max(d, 0.) * (9. - fi * 2.)) * smoothstep(-.015, .01, d);
    float rays = .55 + .45 * noise(vec2(x * 40. + fi * 9., uTime * .3));
    vec3 ac = mix(vec3(.1, .9, .85), vec3(.2, .55, 1.), fi * .5);
    col += ac * curtain * rays * (.9 - fi * .15);
  }
  // moon glow
  vec2 mp = vec2(.78, .78);
  col += vec3(.6, .8, 1.) * exp(-length((uv - mp) * vec2(1.6, 1.)) * 18.) * .9 + vec3(.2, .4, .9) * exp(-length(uv - mp) * 4.) * .15;
  // three mountain ranges, nearer ones move more
  float horizon = .34;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float par = (fi + 1.) * (.04 * uPar + m.x * .015);
    float h = horizon + ridge(uv.x * (1. + fi * .35) + par + fi * 4.1, fi * 2.3 + 1., .16 - fi * .035, 1.6 + fi * .6) - fi * .06 - uPar * fi * .03;
    if (uv.y < h) {
      float shade = mix(.1, .03, fi / 2.);
      vec3 rock = mix(vec3(.08, .26, .6), vec3(.03, .1, .28), fi / 2.);
      float snow = smoothstep(h - .09 + fi * .02, h - .004, uv.y) * smoothstep(.15, .6, noise(vec2(uv.x * 18., uv.y * 9.)));
      col = rock + vec3(.75, .9, 1.) * snow * (.95 - fi * .25) + vec3(.2, .55, 1.) * shade * 2. * smoothstep(h - .2, h, uv.y);
    }
  }
  // lake with reflection below the horizon
  float lake = .2 - uPar * .04;
  if (uv.y < lake) {
    vec2 r = vec2(uv.x + .004 * sin(uv.y * 160. + uTime * 1.5), 2. * lake - uv.y);
    vec3 refl = mix(vec3(.0, .03, .09), vec3(.0, .0, .02), r.y);
    for (int i = 0; i < 2; i++) { float fi = float(i);
      float base = .62 + fi * .07 + .07 * fbm(vec2(r.x * 1.6 + fi * 3., uTime * .05 + fi));
      float d = r.y - base; refl += mix(vec3(.1, .9, .85), vec3(.2, .55, 1.), fi * .5) * exp(-max(d, 0.) * 9.) * smoothstep(-.015, .01, d) * .3; }
    col = refl * .8 + vec3(.02, .1, .26);
  }
  return col;
}
void main(){
  vec2 frag = gl_FragCoord.xy / uRes;
  vec2 uv = vec2(frag.x, 1. - frag.y);
  // type texture, gently scaled about the centre
  vec2 tuv = .5 + (uv - .5) / uScale;
  tuv.y += (1. - uIn) * .04;
  float ink = texture2D(uTex, tuv).a * uIn;
  vec2 px = 2.2 / uRes;
  float inner = min(min(texture2D(uTex, tuv + vec2(px.x, 0.)).a, texture2D(uTex, tuv - vec2(px.x, 0.)).a),
                    min(texture2D(uTex, tuv + vec2(0., px.y)).a, texture2D(uTex, tuv - vec2(0., px.y)).a));
  float rim = clamp(ink - inner * uIn, 0., 1.);
  // fill rises from the bottom with a soft, wavy edge
  float wave = .025 * sin(uv.x * 9. + uTime * 1.4) + .015 * sin(uv.x * 23. - uTime);
  float line = 1. - uFill * 1.15 + wave;
  float img = smoothstep(line - .02, line + .02, uv.y);
  float glowEdge = smoothstep(.035, 0., abs(uv.y - line)) * step(.001, uFill) * step(uFill, .999);
  vec3 scene = alps(vec2(frag.x, frag.y));
  vec3 letter = mix(vec3(1.), scene * 1.25, img) + vec3(.4, .85, 1.) * glowEdge * .8 + vec3(.85, .93, 1.) * rim * img * .7;
  // the opening: a soft circle grows until the full image owns the screen
  vec2 asp = vec2(uRes.x / uRes.y, 1.);
  float open = smoothstep(uOpen * 1.25 - .08, uOpen * 1.25, length((uv - .5) * asp) * .9);
  open = uOpen > .001 ? 1. - open : 0.;
  float a = max(ink, open);
  vec3 col = mix(letter, scene, open * (1. - ink * (1. - img)));
  gl_FragColor = vec4(col * a, a);
}`);
    } catch (e) { console.warn('imageType', e); return null; }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog.p, 'a');
    const tex = gl.createTexture();
    let painted = false;
    const paint = () => {
      const W = canvas.width, H = canvas.height;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d');
      let size = Math.min(W / 6.2, H / (lines.length * 1.25));
      x.font = `800 ${size}px Manrope, sans-serif`;
      const widest = Math.max(...lines.map(l => x.measureText(l).width));
      size *= Math.min(1, (W * .86) / widest);
      x.font = `800 ${size}px Manrope, sans-serif`;
      if ('letterSpacing' in x) x.letterSpacing = `${-size * .045}px`;
      x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff';
      const lh = size * .98, top = H / 2 - (lines.length - 1) * lh / 2;
      lines.forEach((l, i) => x.fillText(l, W / 2, top + i * lh));
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    addEventListener('resize', () => { painted = false; });
    const m = [.5, .5];
    return {
      render(time, sp) {
        if (fit(canvas, 1) || !painted) { paint(); painted = true; }
        const r = canvas.getBoundingClientRect();
        m[0] += ((P.x - r.left) / r.width - m[0]) * .05; m[1] += ((P.y - r.top) / r.height - m[1]) * .05;
        const clamp = (v) => Math.min(1, Math.max(0, v));
        const ease = x => x * x * (3 - 2 * x);
        const inn = ease(clamp(sp / .12));
        const fill = ease(clamp((sp - .14) / .4));
        const scale = 1 + ease(clamp((sp - .55) / .3)) * .12;
        const open = ease(clamp((sp - .78) / .2));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(prog.p);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform2f(prog.u.uRes, canvas.width, canvas.height); gl.uniform2f(prog.u.uMouse, m[0], m[1]);
        gl.uniform1f(prog.u.uTime, time); gl.uniform1f(prog.u.uIn, inn); gl.uniform1f(prog.u.uFill, fill);
        gl.uniform1f(prog.u.uScale, scale); gl.uniform1f(prog.u.uOpen, open); gl.uniform1f(prog.u.uPar, sp);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        canvas.classList.add('live');
      }
    };
  }

  /* ---------------- Development: particles reassemble desktop, tablet, phone, API ---------------- */
  function deviceMorph(canvas) {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    const N = SMALL ? 5200 : 11000;
    // each shape is a list of weighted primitives; points are sampled across them by weight
    const shape = build => {
      const prims = []; let total = 0;
      const seg = (a, b, br = 1, k = 1) => { const w = Math.hypot(b[0] - a[0], b[1] - a[1], (b[2] || 0) - (a[2] || 0)) * k; prims.push({ t: 0, a, b, br, w }); total += w; };
      const fill = (x, y, w, h, br = .35, k = .9, z = 0) => { const wt = w * h * 9 * k; prims.push({ t: 1, x, y, fw: w, fh: h, z, br, w: wt }); total += wt; };
      const box = (x, y, w, h, r = 0, br = 1, k = 1, z = 0) => {   // rounded rectangle outline
        const pts = [], n = r > 0 ? 6 : 1;
        const corner = (cx, cy, a0) => { for (let i = 0; i <= n; i++) { const a = a0 + i / n * Math.PI / 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]); } };
        corner(x + w - r, y + h - r, 0); corner(x + r, y + h - r, Math.PI / 2); corner(x + r, y + r, Math.PI); corner(x + w - r, y + r, Math.PI * 1.5);
        for (let i = 0; i < pts.length; i++) seg(pts[i], pts[(i + 1) % pts.length], br, k);
      };
      const ring = (cx, cy, r, br = 1, k = 1) => { const n = 28; for (let i = 0; i < n; i++) { const a = i / n * 6.283, b = (i + 1) / n * 6.283; seg([cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0], [cx + Math.cos(b) * r, cy + Math.sin(b) * r, 0], br, k); } };
      build({ seg, fill, box, ring });
      const out = new Float32Array(N * 4);
      for (let i = 0; i < N; i++) {
        let pick = Math.random() * total, p = prims[0];
        for (const q of prims) { pick -= q.w; if (pick <= 0) { p = q; break; } }
        const k = Math.random();
        if (p.t === 0) { out[i * 4] = p.a[0] + (p.b[0] - p.a[0]) * k; out[i * 4 + 1] = p.a[1] + (p.b[1] - p.a[1]) * k; out[i * 4 + 2] = (p.a[2] || 0) + ((p.b[2] || 0) - (p.a[2] || 0)) * k; }
        else { out[i * 4] = p.x + Math.random() * p.fw; out[i * 4 + 1] = p.y + Math.random() * p.fh; out[i * 4 + 2] = p.z; }
        out[i * 4 + 3] = p.br;
      }
      return out;
    };
    const desktop = shape(({ seg, fill, box }) => {
      box(-1.25, -.5, 2.5, 1.56, .06, 1, 1.4);                 // lid
      box(-1.16, -.42, 2.32, 1.38, .02, .5, .7);               // screen
      fill(-1.08, .82, .12, .07, .9); for (let i = 0; i < 4; i++) seg([.35 + i * .18, .855, 0], [.47 + i * .18, .855, 0], .7, 1.2);
      fill(-1.04, .5, 1.05, .1, .9, 1.3); fill(-1.04, .34, .8, .1, .9, 1.3); fill(-1.04, .16, .5, .055, .6);
      fill(-1.04, 0, .34, .1, 1, 1.4);                          // button
      box(.1, -.02, .96, .66, .03, .8); fill(.14, .02, .88, .58, .22, .7);
      for (let i = 0; i < 3; i++) box(-1.04 + i * .72, -.36, .64, .28, .02, .6, .8);
      // keyboard deck in perspective, towards the viewer
      const D = -.56;
      seg([-1.25, -.5, 0], [-1.45, D, -1.15], 1, 1.2); seg([1.25, -.5, 0], [1.45, D, -1.15], 1, 1.2);
      seg([-1.45, D, -1.15], [1.45, D, -1.15], 1, 1.4); seg([-1.25, -.5, 0], [1.25, -.5, 0], .8, 1);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) { const z = -.14 - r * .17, x = -1.05 + c * .18 + r * .02; seg([x, D + .01, z], [x + .13, D + .01, z], .45, .7); }
      seg([-.32, D, -.85], [.32, D, -.85], .6); seg([-.32, D, -1.08], [.32, D, -1.08], .6);
    });
    const tablet = shape(({ seg, fill, box }) => {
      box(-.72, -.98, 1.44, 1.96, .1, 1, 1.4); box(-.64, -.88, 1.28, 1.76, .03, .45, .6);
      fill(-.56, .7, .3, .07, .9); seg([.3, .735, 0], [.56, .735, 0], .7);
      fill(-.56, .2, 1.12, .42, .25, .8); box(-.56, .2, 1.12, .42, .02, .8);
      fill(-.56, .06, .7, .07, .9, 1.3);
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { box(-.56 + i * .58, -.42 - j * .36, .54, .3, .02, .6, .8); fill(-.5 + i * .58, -.2 - j * .36, .3, .04, .7); }
      fill(-.04, -.95, .08, .02, .8);
    });
    const phone = shape(({ seg, fill, box, ring }) => {
      box(-.44, -.92, .88, 1.84, .15, 1, 1.5); fill(-.1, .79, .2, .04, 1);
      fill(-.34, .6, .4, .06, .9, 1.3);
      fill(-.34, .18, .68, .34, .3, .9); box(-.34, .18, .68, .34, .03, .8);
      for (let i = 0; i < 4; i++) { ring(-.27, .02 - i * .17, .045, .8, .6); fill(-.18, .01 - i * .17, .36, .03, .7); }
      seg([-.34, -.72, 0], [.34, -.72, 0], .5); for (let i = 0; i < 4; i++) fill(-.27 + i * .17, -.82, .05, .05, 1);
    });
    const api = shape(({ seg, ring, fill }) => {
      const nodes = [[0, 0, .22], [-.95, .55, .13], [-1.05, -.45, .13], [.95, .6, .13], [1.05, -.4, .13], [0, .88, .1], [0, -.85, .1], [-.5, -.05, .07], [.5, .08, .07]];
      const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 5], [3, 5], [2, 6], [4, 6], [7, 0], [8, 0], [1, 7], [4, 8]];
      for (const [a, b] of edges) {
        const A = nodes[a], B = nodes[b], d = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / d, uy = (B[1] - A[1]) / d;
        seg([A[0] + ux * A[2], A[1] + uy * A[2], 0], [B[0] - ux * B[2], B[1] - uy * B[2], 0], .55, 1.1);
      }
      nodes.forEach(([x, y, r], i) => { ring(x, y, r, 1, 1.6); if (i === 0) { ring(x, y, r * .62, .7, 1); fill(-.07, -.07, .14, .14, 1, 2); } });
    });
    let prog;
    try {
      prog = compile(gl, `attribute vec4 p0, p1, p2, p3; attribute vec3 rn;
uniform vec4 uW; uniform float uTime, uMix, uAspect, uSize; uniform vec2 uRot;
varying float vB; varying float vT;
void main(){
  vec4 P = p0 * uW.x + p1 * uW.y + p2 * uW.z + p3 * uW.w;
  vec3 pos = P.xyz;
  pos += (rn - .5) * uMix * vec3(1.6, 1.2, 1.4);
  pos += vec3(sin(uTime * .7 + rn.x * 6.28), cos(uTime * .6 + rn.y * 6.28), sin(uTime * .5 + rn.z * 6.28)) * .008;
  float cy = cos(uRot.x), sy = sin(uRot.x); pos.xz = mat2(cy, -sy, sy, cy) * pos.xz;
  float cx = cos(uRot.y), sx = sin(uRot.y); pos.yz = mat2(cx, -sx, sx, cx) * pos.yz;
  float z = pos.z + 3.4;
  vec2 pr = pos.xy / z * 2.15; pr.x /= uAspect;
  gl_Position = vec4(pr, 0., 1.);
  gl_PointSize = uSize * (.55 + P.w * .7) * (3.4 / z) * (.7 + rn.z * .6);
  vB = P.w * (.82 + .18 * sin(uTime * 2.2 + rn.x * 40.)) * (1. - uMix * .35);
  vT = rn.y;
}`, `precision mediump float; varying float vB; varying float vT;
void main(){
  float d = length(gl_PointCoord - .5);
  float a = smoothstep(.5, .08, d) * vB * .85;
  vec3 c = mix(vec3(.05, .38, 1.), vec3(.55, .88, 1.), clamp(vB * .9 + vT * .25, 0., 1.));
  gl_FragColor = vec4(c * a, a);
}`);
    } catch (e) { console.warn('deviceMorph', e); return null; }
    const rnd = new Float32Array(N * 3); for (let i = 0; i < rnd.length; i++) rnd[i] = Math.random();
    const bufs = [['p0', desktop, 4], ['p1', tablet, 4], ['p2', phone, 4], ['p3', api, 4], ['rn', rnd, 3]].map(([name, data, size]) => {
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return { b, size, loc: gl.getAttribLocation(prog.p, name) };
    });
    const rot = [0, 0];
    return {
      render(time, s) {
        if (!onScreen(canvas)) return;
        fit(canvas, 1);
        const r = canvas.getBoundingClientRect();
        const inside = P.x >= r.left && P.x <= r.right && P.y >= r.top && P.y <= r.bottom;
        const mx = inside ? (P.x - r.left) / r.width - .5 : 0, my = inside ? (P.y - r.top) / r.height - .5 : 0;
        rot[0] += (Math.sin(time * .25) * .16 + mx * .7 - rot[0]) * .05;
        rot[1] += (-.12 + Math.cos(time * .2) * .05 + my * .35 - rot[1]) * .05;
        const w = [0, 1, 2, 3].map(k => Math.max(0, 1 - Math.abs(s - k)));
        const f = s - Math.floor(s);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
        gl.useProgram(prog.p);
        for (const B of bufs) { gl.bindBuffer(gl.ARRAY_BUFFER, B.b); gl.enableVertexAttribArray(B.loc); gl.vertexAttribPointer(B.loc, B.size, gl.FLOAT, false, 0, 0); }
        gl.uniform4f(prog.u.uW, w[0], w[1], w[2], w[3]);
        gl.uniform1f(prog.u.uTime, time);
        gl.uniform1f(prog.u.uMix, Math.pow(4 * f * (1 - f), 2.2));
        gl.uniform1f(prog.u.uAspect, r.width / Math.max(1, r.height));
        gl.uniform1f(prog.u.uSize, (SMALL ? 2.6 : 2.2) * DPR);
        gl.uniform2f(prog.u.uRot, rot[0], rot[1]);
        gl.drawArrays(gl.POINTS, 0, N);
        canvas.classList.add('live');
      }
    };
  }

  /* ---------------- Development: a circuit board that lights up under the pointer ---------------- */
  const CIRCUIT = `
void main(){
  vec2 px = gl_FragCoord.xy;
  vec2 m = (uMouse + vec2(.5 * uRes.x / uRes.y, .5)) * uRes.y;
  float cell = 30.;                                     // ~60 CSS px at half resolution
  vec2 g = px / cell + vec2(0., uScroll * 3.);
  vec2 id = floor(g), f = fract(g);
  float h = hash(id);
  float lh = smoothstep(.045, .0, abs(f.y - .5)) * step(.3, h) * step(h, .66);
  float lv = smoothstep(.045, .0, abs(f.x - .5)) * step(.66, h);
  float via = smoothstep(.14, .09, length(f - .5)) * step(.9, fract(h * 13.7)) * step(.3, h);
  float tr = max(max(lh, lv), via);
  float ph = pow(fract(g.x * .06 - uTime * .25 + hash(vec2(id.y, 1.)) * 7.), 26.);
  float pv = pow(fract(g.y * .06 - uTime * .25 + hash(vec2(id.x, 2.)) * 7.), 26.);
  float pulse = lh * ph + lv * pv;
  float lens = smoothstep(cell * 7., 0., length(px - m)) * uHover;
  float fy = gl_FragCoord.y / uRes.y;
  float a = (tr * (.07 + lens * .45) + pulse * (.45 + lens * .4)) * smoothstep(0., .18, fy) * smoothstep(1., .82, fy);
  vec3 c = mix(vec3(0., .34, .75), vec3(.16, .66, 1.), clamp(pulse + lens * .3, 0., 1.));
  gl_FragColor = vec4(c * a, a);
}`;

  window.WBX = {
    deviceMorph,
    circuit: c => shaderLayer(c, CIRCUIT, { name: 'circuit', scale: SMALL ? .6 : .5 }),
    onScreen,
    design: c => shaderLayer(c, DESIGN, { name: 'design', scale: SMALL ? .55 : .5 }),
    tunnel: c => shaderLayer(c, TUNNEL, { name: 'tunnel', scale: .6 }),
    city: c => shaderLayer(c, CITY, { name: 'city', scale: SMALL ? .5 : .45 }),
    hole: c => shaderLayer(c, HOLE, { name: 'hole', scale: .6 }),
    geoGlobe, fluid, hoverCards, liquidWordmark, tiles, typeWindow, imageType
  };
})();
