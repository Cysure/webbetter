/* Web Better — WebGL layers.
   1. Ribbons: liquid ribbons in the logo's blues (hero + contact).
   2. Logo field: the WB mark assembled from particles, scrubbed by scroll.
   Both draw on transparent canvases over a visible fallback, and are only
   started by main.js after a real animation frame has been observed. */
(() => {
  const DPR = Math.min(window.devicePixelRatio || 1, 1.75);

  function makeGL(canvas) {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' });
    if (!gl) return null;
    return gl;
  }
  function program(gl, vs, fs) {
    const sh = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
  function fit(canvas, scale) {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * DPR * scale)), h = Math.max(1, Math.round(r.height * DPR * scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; return true; }
    return false;
  }
  const visible = el => { const r = el.getBoundingClientRect(); return r.bottom > -50 && r.top < innerHeight + 50; };

  /* ---------------- Ribbons ---------------- */
  const RIB_VS = `attribute vec2 a; void main(){ gl_Position = vec4(a,0.,1.); }`;
  const RIB_FS = `
precision highp float;
uniform vec2 uRes; uniform float uTime, uScroll, uGain, uCount; uniform vec2 uMouse;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - .5) * asp, uv.y - .5);
  float t = uTime * .32 + uScroll * 1.6;
  vec3 col = vec3(0.); float a = 0.;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    if (fi >= uCount) break;
    vec2 md = p - uMouse;
    float bend = .11 * exp(-dot(md, md) * 5.) * sign(md.y + .0001);
    float yc = -.16 + fi * .06
      + .17 * sin(p.x * (1.05 + fi * .16) + t + fi * 1.7)
      + .05 * sin(p.x * 3.1 - t * 1.3 + fi * 2.3) + bend;
    float w = .03 + .018 * sin(p.x * 1.7 + fi * 1.3 + t * .7) + .01 * fi * .5;
    float d = (p.y - yc) / w;
    float band = smoothstep(1., .72, abs(d));
    float twist = .5 + .5 * cos(p.x * 3.6 + t * 1.4 + fi * 2.1 + d * 1.1);
    float spec = pow(twist, 7.);
    vec3 c = mix(vec3(0., .07, .22), vec3(0., .34, .76), twist);
    c = mix(c, vec3(.17, .67, 1.), spec);
    c += spec * .45;
    float edge = smoothstep(0., .12, uv.x) * smoothstep(1., .88, uv.x);
    float al = band * (.5 + .5 * twist) * edge * uGain;
    col = c * al + col * (1. - al);
    a = al + a * (1. - al);
  }
  gl_FragColor = vec4(col, a);
}`;

  function ribbons(canvas, opts = {}) {
    const gl = makeGL(canvas); if (!gl) return null;
    let prog;
    try { prog = program(gl, RIB_VS, RIB_FS); } catch (e) { console.warn(e); return null; }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    const U = n => gl.getUniformLocation(prog, n);
    const u = { res: U('uRes'), time: U('uTime'), scroll: U('uScroll'), mouse: U('uMouse'), gain: U('uGain'), count: U('uCount') };
    const mouse = [0, 0], target = [0, 0];
    const host = opts.host || canvas.parentElement;
    host.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      target[0] = ((e.clientX - r.left) / r.width - .5) * (r.width / r.height);
      target[1] = .5 - (e.clientY - r.top) / r.height;
    });
    host.addEventListener('pointerleave', () => { target[0] = 0; target[1] = 2; });
    target[1] = 2; mouse[1] = 2;
    const count = innerWidth < 700 ? 4 : (opts.count || 5);
    return {
      render(time, scroll) {
        if (!visible(canvas)) return;
        fit(canvas, opts.scale || .6);
        mouse[0] += (target[0] - mouse[0]) * .08; mouse[1] += (target[1] - mouse[1]) * .08;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform1f(u.time, time); gl.uniform1f(u.scroll, scroll);
        gl.uniform2f(u.mouse, mouse[0], mouse[1]);
        gl.uniform1f(u.gain, opts.gain || 1); gl.uniform1f(u.count, count);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        canvas.classList.add('live');
      }
    };
  }

  /* ---------------- Logo particle field ---------------- */
  const P_VS = `
attribute vec3 aTarget; attribute vec3 aScatter; attribute vec3 aColor; attribute float aSeed;
uniform float uTime, uProgress, uAspect, uScale, uPx; uniform vec2 uMouse;
varying vec3 vColor; varying float vAlpha;
float ease(float x){ return x < .5 ? 4.*x*x*x : 1. - pow(-2.*x + 2., 3.) / 2.; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
void main(){
  float form = ease(clamp((uProgress * 1.55 - aSeed * .35 - .02) / .5, 0., 1.));
  float out_ = clamp((uProgress - .7 - aSeed * .12) / .22, 0., 1.);
  out_ = out_ * out_;
  vec3 s = aScatter;
  s.xz = rot(uTime * (.03 + aSeed * .04) + aSeed * 6.283) * s.xz;
  s.xy = rot(uTime * .05) * s.xy;
  vec3 tgt = aTarget;
  tgt.z += .025 * sin(uTime * 1.6 + aSeed * 40. + aTarget.x * 3.);
  // breathing ribbon wave across the formed mark
  tgt.z += .025 * sin(aTarget.x * 2.4 - uTime * .6) * form;
  vec3 p = mix(s, tgt, form);
  // pointer repulsion once the mark has formed
  vec2 md = p.xy - uMouse;
  float f = exp(-dot(md, md) * 9.) * form;
  p.xy += normalize(md + 1e-4) * f * .28;
  p.z += f * .4;
  // dispersal: stream outward and past the camera
  vec3 dir = normalize(vec3(aTarget.xy * 1.3 + vec2(aSeed - .5, fract(aSeed * 7.3) - .5) * .8, 1.2));
  p += dir * out_ * (1.6 + aSeed * 3.);
  float d = 3.2 - p.z;
  gl_Position = vec4(p.x * uScale / uAspect, p.y * uScale, 0., d);
  float sweep = (1. - smoothstep(0., .22, abs(aTarget.x - sin(uTime * .3) * 1.25))) * .6;
  vColor = aColor + sweep * form * vec3(.25, .55, .8);
  vAlpha = mix(.45, 1., form) * (1. - out_ * .85);
  gl_PointSize = uPx * mix(2.6, 1.15, form) * (3.2 / d) * (1. + out_ * 1.5);
}`;
  const P_FS = `
precision mediump float;
varying vec3 vColor; varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - .5;
  float r = dot(c, c);
  if (r > .25) discard;
  float a = smoothstep(.25, .0, r) * vAlpha;
  gl_FragColor = vec4(vColor * a, a);
}`;

  function sampleLogo(src, step) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const W = 520, H = Math.round(W * img.height / img.width);
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        const x = c.getContext('2d'); x.drawImage(img, 0, 0, W, H);
        let data;
        try { data = x.getImageData(0, 0, W, H).data; } catch (e) { return reject(e); }
        const T = [], C = [];
        for (let y = 0; y < H; y += step) for (let xx = 0; xx < W; xx += step) {
          const i = (y * W + xx) * 4;
          if (data[i + 3] > 140) {
            T.push((xx / W - .5) * 2, -(y / H - .5) * 2 * H / W, 0);
            C.push(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
          }
        }
        resolve({ T, C });
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  async function logoField(canvas, src) {
    const gl = makeGL(canvas); if (!gl) return null;
    let prog;
    try { prog = program(gl, P_VS, P_FS); } catch (e) { console.warn(e); return null; }
    const small = innerWidth < 700;
    let pts;
    try { pts = await sampleLogo(src, small ? 3 : 2); } catch (e) { console.warn(e); return null; }
    const n = pts.T.length / 3;
    const scatter = new Float32Array(n * 3), seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = 1.6 + Math.random() * 2.6;
      const s = Math.sqrt(1 - u * u);
      scatter[i * 3] = r * s * Math.cos(th); scatter[i * 3 + 1] = r * u * .7; scatter[i * 3 + 2] = r * s * Math.sin(th) * .6 - .4;
      seed[i] = Math.random();
    }
    const attr = (name, arr, size) => {
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
      return { loc: gl.getAttribLocation(prog, name), b, size };
    };
    const A = [attr('aTarget', new Float32Array(pts.T), 3), attr('aScatter', scatter, 3), attr('aColor', new Float32Array(pts.C), 3), attr('aSeed', seed, 1)];
    const U = k => gl.getUniformLocation(prog, k);
    const u = { time: U('uTime'), prog: U('uProgress'), asp: U('uAspect'), scale: U('uScale'), px: U('uPx'), mouse: U('uMouse') };
    const mouse = [0, 9], target = [0, 9];
    let scale = 2.4;
    canvas.parentElement.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = 1 - ((e.clientY - r.top) / r.height) * 2;
      const asp = r.width / r.height;
      // invert the projection at the mark's depth (d = 3.2)
      target[0] = nx * 3.2 * asp / scale; target[1] = ny * 3.2 / scale;
    });
    canvas.parentElement.addEventListener('pointerleave', () => { target[0] = 0; target[1] = 9; });
    canvas.dataset.points = n;
    return {
      render(time, progress) {
        if (!visible(canvas)) return;
        fit(canvas, 1);
        const asp = canvas.width / canvas.height;
        scale = 2.5 * Math.min(1, asp / 1.25);
        mouse[0] += (target[0] - mouse[0]) * .1; mouse[1] += (target[1] - mouse[1]) * .1;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
        gl.useProgram(prog);
        A.forEach(a => { gl.bindBuffer(gl.ARRAY_BUFFER, a.b); gl.enableVertexAttribArray(a.loc); gl.vertexAttribPointer(a.loc, a.size, gl.FLOAT, false, 0, 0); });
        gl.uniform1f(u.time, time); gl.uniform1f(u.prog, progress);
        gl.uniform1f(u.asp, asp); gl.uniform1f(u.scale, scale);
        gl.uniform1f(u.px, DPR * (small ? 2.2 : 1.9));
        gl.uniform2f(u.mouse, mouse[0], mouse[1]);
        gl.drawArrays(gl.POINTS, 0, n);
        canvas.classList.add('live');
      }
    };
  }

  window.WBGL = { ribbons, logoField };
})();
