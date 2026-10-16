/* Web Better: shared behaviour for the SEO, GEO and FAQ pages. */
(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = window.t || (x => x);

  /* theme */
  const toggle = $('#themeToggle'), label = $('.theme-label');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const sync = () => { if (label) label.textContent = T(isDark() ? 'DAY' : 'NIGHT'); };
  sync();
  toggle?.addEventListener('click', e => {
    const apply = () => { root.dataset.theme = isDark() ? 'light' : 'dark'; try { localStorage.setItem('webbetter-theme', root.dataset.theme); } catch (err) {} sync(); };
    if (!document.startViewTransition || reduced) return apply();
    const x = e.clientX || innerWidth - 60, y = e.clientY || 40, r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 750, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
  });

  /* menu */
  const burger = $('#burger'), menu = $('#menu');
  let lenis = null;
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger?.setAttribute('aria-expanded', open); menu?.setAttribute('aria-hidden', !open);
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  burger?.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('.menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* FAQ search + categories (works without motion) */
  const search = $('#fqSearch');
  if (search) {
    const chips = $$('.chip'), groups = $$('.fq-group'), empty = $('.fq-empty');
    let cat = 'all';
    const apply = () => {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      groups.forEach(g => {
        let n = 0;
        $$('.faq-item', g).forEach(it => {
          const hit = (cat === 'all' || it.dataset.cat === cat) && (!q || it.textContent.toLowerCase().includes(q));
          it.hidden = !hit; if (hit) { n++; it.classList.add('in'); }
          if (q && hit) it.open = true;
        });
        g.hidden = n === 0; shown += n;
      });
      empty.hidden = shown > 0;
    };
    chips.forEach(c => c.addEventListener('click', () => { chips.forEach(x => x.classList.toggle('on', x === c)); cat = c.dataset.cat; apply(); }));
    search.addEventListener('input', apply);
    // deep link: /faq/#seo opens that category
    const h = location.hash.slice(1); const pre = chips.find(c => c.dataset.cat === h);
    if (pre) pre.click();
  }

  /* header + progress + scroll effects */
  const header = $('#header'), progress = $('#progress'), hero = $('.ph');
  const stepsEl = $('.st'), bar = $('.st-bar i'), steps = $$('.st-item');
  let lastY = 0, motion = false;
  const update = () => {
    const y = scrollY, vh = innerHeight, max = document.documentElement.scrollHeight - vh;
    header?.classList.toggle('scrolled', y > 40);
    header?.classList.toggle('on-hero', !!hero && y < hero.offsetHeight - 80);
    header?.classList.toggle('hidden', y > lastY + 2 && y > vh && !document.body.classList.contains('menu-open'));
    if (Math.abs(y - lastY) > 2) lastY = y;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!motion) return;
    if (hero) {
      const p = clamp(y / hero.offsetHeight);
      $('.ph-inner', hero).style.transform = `translateY(${(p * 120).toFixed(1)}px)`;
      $('.ph-inner', hero).style.opacity = (1 - p * 1.2).toFixed(3);
    }
    if (stepsEl) {
      const r = stepsEl.getBoundingClientRect();
      const p = clamp((vh * .6 - r.top) / r.height);
      if (bar) bar.style.transform = `scaleY(${p})`;
      steps.forEach((s, i) => s.classList.toggle('lit', p > (i + .3) / steps.length));
    }
  };
  addEventListener('scroll', update, { passive: true });
  update();

  /* count-up */
  const countUp = el => {
    const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, t0 = performance.now();
    const step = now => { const k = clamp((now - t0) / 1400), e = 1 - Math.pow(1 - k, 3); el.textContent = (end * e).toFixed(dec); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  /* HUD (footer) */
  const hud = $('#hud');
  if (hud) {
    const set = (k, v, good) => { const b = hud.querySelector(`[data-k="${k}"]`); if (b) { b.textContent = v; b.classList.toggle('good', !!good); } };
    try {
      new PerformanceObserver(l => { const e = l.getEntries().pop(); if (e) set('lcp', (e.startTime / 1000).toFixed(2) + 's', e.startTime < 2500); }).observe({ type: 'largest-contentful-paint', buffered: true });
      let cls = 0; set('cls', '0.000', true);
      new PerformanceObserver(l => { l.getEntries().forEach(e => { if (!e.hadRecentInput) cls += e.value; }); set('cls', cls.toFixed(3), cls < .1); }).observe({ type: 'layout-shift', buffered: true });
      let inp = 0;
      new PerformanceObserver(l => { l.getEntries().forEach(e => { if (e.interactionId) inp = Math.max(inp, e.duration); }); set('inp', Math.round(inp) + 'ms', inp < 200); }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch (e) {}
    try {
      const c = document.createElement('canvas').getContext('webgl'), ext = c && c.getExtension('WEBGL_debug_renderer_info');
      set('gpu', String(ext ? c.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'n/a').replace(/ANGLE \(|\)$/g, '').replace(/Direct3D.*|vs_.*$/, '').trim());
      c && c.getExtension('WEBGL_lose_context')?.loseContext();
    } catch (e) {}
    let f = 0, last = performance.now();
    const fps = now => { f++; if (now - last > 1000) { set('fps', f, f > 50); f = 0; last = now; } requestAnimationFrame(fps); };
    requestAnimationFrame(fps);
  }

  if (reduced) return;
  /* motion starts only after a real animation frame */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    motion = true;
    root.classList.add('anim');
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      $$('[data-count]', e.target).forEach(countUp);
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => io.observe(el));
    setTimeout(() => $$('.reveal:not(.in)').forEach(el => { if (el.getBoundingClientRect().top < innerHeight * 1.2) el.classList.add('in'); }), 4000);

    if (window.Lenis) { lenis = new Lenis({ duration: 1.1, smoothWheel: true }); lenis.on('scroll', update); }

    // hero WebGL: the SEO skyline, the GEO globe, or ribbons for the FAQ
    const layers = [];
    const cv = $('#phGL'), kind = hero?.dataset.kind;
    if (cv && window.WBX) {
      let L = null;
      if (kind === 'seo') L = WBX.city(cv);
      else if (kind === 'geo') L = WBX.geoGlobe(cv, $('.ph-labels'));
      if (L) layers.push(t => { if (hero.getBoundingClientRect().bottom > 0) L.render(kind === 'seo' ? t * .5 : t, kind === 'seo' ? clamp(scrollY / innerHeight) : scrollY / innerHeight * .5); });
    }
    if (cv && (kind === 'faq' || kind === 'privacy') && window.WBGL) {
      const R = WBGL.ribbons(cv, { host: hero, count: 5, gain: .9 });
      if (R) layers.push(t => R.render(t * .45, scrollY / innerHeight));
    }
    const ctaCv = $('.pg-cta-gl');
    if (ctaCv && window.WBGL) {
      const R2 = WBGL.ribbons(ctaCv, { host: ctaCv.parentElement, count: 4, gain: .7 });
      if (R2) layers.push(t => R2.render(t * .4 + 20, 0));
    }
    const t0 = performance.now();
    const loop = now => {
      if (lenis) lenis.raf(now);
      update();
      const t = (now - t0) / 1000;
      for (const l of layers) l(t);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }));
})();
