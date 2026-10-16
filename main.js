(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Loader (timer driven, never blocks content for long) ---------- */
  const loader = $('#loader'), pct = $('#loaderPct');
  let n = 0;
  const tick = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 14));
    pct.textContent = n;
    if (n >= 100) { clearInterval(tick); setTimeout(() => loader.classList.add('done'), 250); }
  }, 70);
  setTimeout(() => loader.classList.add('done'), 2600);

  /* ---------- Theme ---------- */
  const toggle = $('#themeToggle'), label = $('.theme-label');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const T = window.t || (x => x), DE = window.WB_LANG === 'de';
  const syncLabel = () => { label.textContent = T(isDark() ? 'DAY' : 'NIGHT'); };
  syncLabel();
  toggle.addEventListener('click', e => {
    const apply = () => {
      root.dataset.theme = isDark() ? 'light' : 'dark';
      try { localStorage.setItem('webbetter-theme', root.dataset.theme); } catch (err) {}
      syncLabel();
    };
    if (!document.startViewTransition || reduced) return apply();
    const x = e.clientX || innerWidth - 60, y = e.clientY || 40;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 750, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
  });

  /* ---------- Menu ---------- */
  const burger = $('#burger'), menu = $('#menu');
  let lenis = null;
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Anchor links (work with or without smooth scroll) ---------- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = $(id); if (!t) return;
    e.preventDefault(); setMenu(false);
    if (lenis) lenis.scrollTo(t, { duration: 1.6 }); else t.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- Typing query in the AI search card ---------- */
  const q = $('#askQ');
  const queries = DE ? [
    'beste Designagentur für Sichtbarkeit in der KI-Suche',
    'wer baut schnelle Websites, die bei Google ranken?',
    'Agentur für GEO und ChatGPT-Empfehlungen',
    'wegweisendes Webdesign-Studio in der Schweiz'
  ] : [
    'best design agency for AI search visibility',
    'who builds fast websites that rank on Google?',
    'agency for GEO and ChatGPT recommendations',
    'cutting-edge web design studio in Switzerland'
  ];
  let qi = 0;
  const type = (text, i = 0) => {
    q.textContent = text.slice(0, i);
    if (i < text.length) return setTimeout(() => type(text, i + 1), 38 + Math.random() * 40);
    setTimeout(erase, 2600);
  };
  const erase = () => {
    const t = q.textContent;
    if (t.length) { q.textContent = t.slice(0, -1); return setTimeout(erase, 16); }
    qi = (qi + 1) % queries.length;
    setTimeout(() => type(queries[qi]), 300);
  };
  setTimeout(erase, 3400);

  /* ---------- Ask the demo: type anything, get a streamed answer ---------- */
  const askForm = $('#askForm'), askInput = $('#askInput'), askAnswer = $('#askAnswer');
  const ANSWERS = [
    [/geo|ai|chatgpt|perplexity|gemini|llm|copilot|claude|answer engine/i, '<b>Generative engine optimization (GEO)</b> makes a site easy for AI assistants to read, trust and quote: clear entities, citable facts, structured data and llms.txt. Web Better audits how often you are cited today, then builds the content and technical layer to raise it.'],
    [/seo|google|rank|search|traffic|organic/i, '<b>Technical SEO</b> at Web Better means fast, crawlable architecture, schema markup and Core Web Vitals in the green, plus content built around what your customers actually search.'],
    [/app|ios|android|mobile/i, 'Web Better designs and builds <b>web and mobile apps</b> end to end, from product design and prototyping to iOS, Android and the APIs behind them.'],
    [/design|brand|logo|ui|ux|identity/i, 'Web Better pairs <b>cutting-edge design</b> with engineering: brand systems, UI/UX, motion and WebGL, the kind of work you are scrolling through right now.'],
    [/speed|fast|performance|vitals|optimi/i, 'Speed is a feature. Web Better rebuilds sites for <b>sub-second loads</b> and green Core Web Vitals, which compounds into rankings, cheaper ads and higher conversion. See the live numbers in the footer of this page.'],
    [/price|cost|budget|quote|how much/i, 'Every project is scoped individually. Write to <b>beratung@webbetter.ch</b> with your goals and timeline, and you will get a clear proposal.'],
    [/where|swiss|switzerland|location|based|contact|email/i, 'Web Better is a Swiss studio at <b>webbetter.ch</b>. The fastest way in is <b>beratung@webbetter.ch</b>.']
  ];
  const ANSWERS_DE = [
    [/geo|ki|ai|chatgpt|perplexity|gemini|llm|copilot|claude/i, '<b>Generative Engine Optimization (GEO)</b> macht eine Website für KI-Assistenten leicht lesbar, vertrauenswürdig und zitierbar: klare Entitäten, zitierfähige Fakten, strukturierte Daten und llms.txt. Web Better misst, wie oft Sie heute zitiert werden, und baut dann die Inhalte und die Technik, um das zu steigern.'],
    [/seo|google|ranking|suche|traffic|organisch/i, '<b>Technisches SEO</b> bei Web Better heisst: schnelle, crawlbare Architektur, Schema-Markup und Core Web Vitals im grünen Bereich, dazu Inhalte, die genau das beantworten, wonach Ihre Kundschaft sucht.'],
    [/app|ios|android|mobil/i, 'Web Better gestaltet und entwickelt <b>Web- und Mobile-Apps</b> von A bis Z: vom Produktdesign und Prototyping bis zu iOS, Android und den APIs dahinter.'],
    [/design|marke|brand|logo|ui|ux/i, 'Web Better verbindet <b>wegweisendes Design</b> mit Engineering: Markensysteme, UI/UX, Motion und WebGL, also genau die Art Arbeit, durch die Sie gerade scrollen.'],
    [/schnell|speed|performance|vitals|optimi|ladezeit/i, 'Geschwindigkeit ist ein Feature. Web Better baut Websites mit <b>Ladezeiten unter einer Sekunde</b> und grünen Core Web Vitals. Das zahlt sich aus: bessere Rankings, günstigere Anzeigen, höhere Conversion. Die Live-Werte sehen Sie im Footer dieser Seite.'],
    [/preis|kost|budget|offerte|angebot|wie viel|teuer/i, 'Jedes Projekt wird individuell offeriert. Schreiben Sie an <b>beratung@webbetter.ch</b> mit Ihren Zielen und Ihrem Zeitplan, und Sie erhalten ein klares Angebot.'],
    [/wo|schweiz|standort|kontakt|e-mail|email/i, 'Web Better ist ein Schweizer Studio, zu finden unter <b>webbetter.ch</b>. Am schnellsten erreichen Sie uns über <b>beratung@webbetter.ch</b>.']
  ];
  const DEFAULT_ANSWER_DE = '<b>Web Better</b> ist ein Schweizer Studio für Design, Websites, Apps, SEO und GEO, gebaut dafür, dass Marken gefunden werden: von Menschen und von KI. Fragen Sie nach einem dieser Themen oder schreiben Sie an <b>beratung@webbetter.ch</b>.';
  const DEFAULT_ANSWER = '<b>Web Better</b> is a Swiss design and development studio for design, websites, apps, SEO and GEO, built so brands get found by people and by AI. Ask about any of those, or write to <b>beratung@webbetter.ch</b>.';
  const askBar = askForm;
  askInput.addEventListener('focus', () => askBar.classList.add('typing'));
  askInput.addEventListener('blur', () => { if (!askInput.value) askBar.classList.remove('typing'); });
  askBar.addEventListener('click', () => askInput.focus());
  askForm.addEventListener('submit', e => {
    e.preventDefault();
    const qText = askInput.value.trim(); if (!qText) return;
    const html = DE ? (ANSWERS_DE.find(([re]) => re.test(qText)) || [0, DEFAULT_ANSWER_DE])[1]
                    : (ANSWERS.find(([re]) => re.test(qText)) || [0, DEFAULT_ANSWER])[1];
    // stream word by word, keeping the bold markup intact
    const tmp = document.createElement('div'); tmp.innerHTML = html;
    const toks = [];
    tmp.childNodes.forEach(n => {
      const bold = n.nodeName === 'B';
      n.textContent.split(/(\s+)/).forEach(w => { if (w) toks.push({ w, bold }); });
    });
    askAnswer.innerHTML = '';
    let i = 0;
    const step = () => {
      if (i >= toks.length) return;
      const t = toks[i++];
      if (/^\s+$/.test(t.w)) askAnswer.appendChild(document.createTextNode(t.w));
      else { const el = document.createElement(t.bold ? 'b' : 'span'); el.className = 'tok'; el.textContent = t.w; askAnswer.appendChild(el); }
      setTimeout(step, 28 + Math.random() * 45);
    };
    step();
  });

  /* ---------- Service graphics: clone templates with unique ids ---------- */
  let gid = 0;
  $$('[data-g]').forEach(slot => {
    const tpl = document.getElementById('g-' + slot.dataset.g);
    if (!tpl) return;
    const k = ++gid;
    slot.innerHTML = tpl.innerHTML.replace(/\b(gd|gw|gs|gg)([A-Z]\w*)/g, `$1$2_${k}`);
  });

  /* ---------- Text splitting (content stays readable as-is) ---------- */
  const heroTitle = $('#heroTitle');
  heroTitle.setAttribute('aria-label', heroTitle.textContent.trim().replace(/\s+/g, ' '));
  const chars = [];
  $$('.line', heroTitle).forEach(line => {
    const words = line.textContent.trim().split(/\s+/);
    line.textContent = '';
    line.setAttribute('aria-hidden', 'true');
    words.forEach((w, wi) => {
      const wd = document.createElement('span'); wd.className = 'wd';
      [...w].forEach(c => {
        const ch = document.createElement('span'); ch.className = 'ch'; ch.textContent = c;
        ch._r = Math.random(); ch._s = Math.random() - .5;
        wd.appendChild(ch); chars.push(ch);
      });
      line.appendChild(wd);
      if (wi < words.length - 1) line.appendChild(document.createTextNode(' '));
    });
  });

  const statement = $('#statement');
  const words = [];
  (function wrapWords(node) {
    [...node.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement('span'); s.className = 'sw'; s.textContent = part;
          frag.appendChild(s); words.push(s);
        });
        c.replaceWith(frag);
      } else wrapWords(c);
    });
  })(statement);

  const wordmark = $('#wordmark');
  const wmLetters = [];
  (function split(node) {
    [...node.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...c.textContent].forEach(ch => { const s = document.createElement('span'); s.className = 'wl'; s.textContent = ch; frag.appendChild(s); wmLetters.push(s); });
        c.replaceWith(frag);
      } else split(c);
    });
  })(wordmark);

  /* ---------- Designed to stand out: split into letters ---------- */
  const soSec = $('#standout'), soText = $('#soText'), soLines = $$('.so-line');
  soText.setAttribute('aria-label', soText.textContent.replace(/\s+/g, ' ').trim());
  const soChars = [];
  soLines.forEach(line => {
    const words = line.textContent.trim().split(/\s+/);
    line.textContent = ''; line.setAttribute('aria-hidden', 'true');
    words.forEach((w, wi) => {
      // a word never breaks between its letters; lines may only wrap between words
      const word = document.createElement('span'); word.className = 'so-word';
      [...w].forEach(ch => {
        const sp = document.createElement('span'); sp.className = 'sc'; sp.textContent = ch;
        word.appendChild(sp); soChars.push(sp);
      });
      line.appendChild(word);
      if (wi < words.length - 1) line.appendChild(document.createTextNode(' '));
    });
  });
  // shrink the type until the longest word fits the screen (matters for German)
  const fitSo = () => {
    soText.style.fontSize = '';
    const avail = soText.parentElement.clientWidth * .92;
    const widest = Math.max(...$$('.so-word', soText).map(w => w.scrollWidth));
    if (widest > avail) soText.style.fontSize = (parseFloat(getComputedStyle(soText).fontSize) * avail / widest).toFixed(1) + 'px';
  };
  fitSo();
  document.fonts?.ready.then(fitSo);
  addEventListener('resize', fitSo);

  /* ---------- Scroll-driven scene ---------- */
  const header = $('#header'), progressBar = $('#progress');
  const floor = $('#floor'), ask = $('#askCard'), hv = $('#heroVisual');
  const band = $('#band'), rows = $$('.band-row'), bandLines = $$('.band-line');
  const bandBar = $('#bandBar'), bandPct = $('#bandPct');
  const works = $$('.work-media');
  const SVC_STEP = 1.45;   // one screen of panel + .45 screen of hold
  const panels = $$('.svc-panel'), svcs = $$('.svc'), servicesEl = $('#services');
  const g1 = $('.glass.g1'), g2 = $('.glass.g2'), orb = $('.orb');
  const speeds = $$('[data-speed]');
  const clientsSec = $('#clients'), blobs = $$('.cb');
  let motion = false;           // becomes true once a real animation frame has run
  let lastY = 0, bandP = .5, wmReveal = 1;

  function update() {
    const y = scrollY, vh = innerHeight, max = document.documentElement.scrollHeight - vh;
    header.classList.toggle('scrolled', y > 40);
    header.classList.toggle('hidden', y > lastY + 2 && y > vh && !document.body.classList.contains('menu-open'));
    if (Math.abs(y - lastY) > 2) lastY = y;
    progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    // band progress is needed by WebGL even before motion is confirmed
    const br = band.getBoundingClientRect();
    bandP = clamp(-br.top / (br.height - vh));
    if (!motion || reduced) return;

    // hero letters drift apart as you leave
    const hp = clamp(y / (vh * .9));
    chars.forEach(c => {
      c.style.transform = hp ? `translate3d(${c._s * hp * 30}px, ${-hp * (40 + c._r * 90)}px, 0) rotate(${c._s * hp * 10}deg)` : '';
      c.style.opacity = hp ? 1 - hp * .7 : '';
    });

    // hero visual parallax
    const hr = hv.getBoundingClientRect();
    if (hr.bottom > 0 && hr.top < vh) {
      const p = (vh - hr.top) / (vh + hr.height);
      floor.style.transform = `rotateX(64deg) translateY(${(p - .5) * -160}px)`;
      ask.style.transform = `translate(-50%, calc(-50% + ${(p - .5) * -120}px)) scale(${.94 + p * .1}) rotateX(${(.5 - p) * 14}deg)`;
    }

    // statement fills word by word
    const sr = statement.getBoundingClientRect();
    const sp = clamp((vh * .85 - sr.top) / (sr.height + vh * .35));
    const lit = Math.round(sp * words.length);
    words.forEach((w, i) => w.classList.toggle('lit', i < lit));

    // work cards: clip reveal + inner parallax
    works.forEach(m => {
      const r = m.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const e = clamp((vh - r.top) / (vh * .7));
      const inset = (1 - e) * 10;
      m.style.clipPath = `inset(${inset}% ${inset}% ${inset}% ${inset}% round ${(1 - e) * 24}px)`;
      const pp = (r.top + r.height / 2 - vh / 2) / vh;
      [...m.children].forEach(ch => { if (!ch.classList.contains('blob')) ch.style.translate = `0 ${pp * -40}px`; });
    });

    // marquee rows
    if (br.bottom > 0 && br.top < vh) {
      rows.forEach(r => { r.style.transform = `translateX(${(bandP - .5) * 18 * +r.dataset.dir}vw)`; });
      const step = bandP < .3 ? 0 : bandP < .68 ? 1 : 2;
      bandLines.forEach((l, i) => l.classList.toggle('on', i === step));
      bandBar.style.width = (bandP * 100).toFixed(1) + '%';
      bandPct.textContent = String(Math.round(bandP * 100)).padStart(3, '0');
    }

    // STAND OUT: letters fade and rise in one by one, hold, then the block drifts up into the next section
    const sor = soSec.getBoundingClientRect();
    if (sor.bottom > 0 && sor.top < vh) {
      const sp = clamp(-sor.top / (sor.height - vh));
      const n = soChars.length;
      const reveal = clamp(sp / .58);                       // 0 → .58: letters arrive
      soChars.forEach((c, i) => {
        const k = clamp(reveal * (n + 4) - i, 0, 4) / 4;     // each letter eases in over ~4 steps
        const e = 1 - Math.pow(1 - k, 3);
        c.style.opacity = (.04 + e * .96).toFixed(3);
        c.style.transform = `translateY(${((1 - e) * 46).toFixed(1)}px)`;
      });
      const gather = 1 - clamp(sp / .58);
      soLines[0].style.transform = `translateY(${(-gather * 40).toFixed(1)}px)`;
      soLines[1].style.transform = `translateY(${(gather * 40).toFixed(1)}px)`;
      const drift = clamp((sp - .8) / .2);                   // .58 → .8 hold, then a slow parallax lift
      soText.style.transform = `translateY(${(-drift * vh * .28).toFixed(1)}px)`;
      soText.style.letterSpacing = '';
    }

    // depth inside each stuck service panel: title drifts up, lists drift down
    const sTop = servicesEl.offsetTop;
    panels.forEach((p, i) => {
      const l = clamp((y - (sTop + i * vh * SVC_STEP)) / vh, -1, 1);
      if (!p._h2) { p._h2 = $('h2', p); p._lists = $$('.svc-list', p); }
      p._h2.style.translate = `0 ${l * -70}px`;
      p._lists.forEach(el => { el.style.translate = `0 ${l * 45}px`; });
    });

    // hero visual: the AI card and glass panes sit at different depths
    if (hr.bottom > 0 && hr.top < vh) {
      const hp2 = (vh - hr.top) / (vh + hr.height) - .5;
      g1.style.translate = `0 ${hp2 * -180}px`; g2.style.translate = `0 ${hp2 * -90}px`; orb.style.translate = `0 ${hp2 * -260}px`;
    }

    // service panels recede beneath the next
    panels.forEach((p, i) => {
      const next = svcs[i + 1];
      if (!next) return;
      const cover = clamp(1 - next.getBoundingClientRect().top / vh);
      p.style.transform = cover ? `scale(${1 - cover * .1}) translateY(${cover * -30}px)` : '';
      // a plain shade, not a CSS filter: filters over WebGL canvases are very expensive to composite
      if (!p._shade) { p._shade = document.createElement('div'); p._shade.className = 'svc-shade'; p.appendChild(p._shade); }
      p._shade.style.opacity = (cover * .7).toFixed(3);
    });

    // colour fields behind the testimonials: each drifts at its own depth
    const cr = clientsSec.getBoundingClientRect();
    if (cr.bottom > 0 && cr.top < vh) {
      const cp = (vh - cr.top) / (cr.height + vh) - .5;
      blobs.forEach((b, i) => {
        const d = +b.dataset.depth;
        b.style.transform = `translate3d(${Math.sin(cp * 3.2 + i * 1.7) * d * 160}px, ${cp * d * vh * 1.1}px, 0) scale(${1 + cp * d * .35})`;
      });
    }

    // testimonials parallax
    speeds.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      el.style.translate = `0 ${(r.top + r.height / 2 - vh / 2) * +el.dataset.speed * .5}px`;
    });
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();

  /* ---------- Reveal (only after motion is confirmed) ---------- */
  function observeReveals() {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in');
      io.observe(el);
    });
    setTimeout(() => $$('.reveal:not(.in)').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight * 1.2) el.classList.add('in');
    }), 4000);
  }

  /* ---------- Text scramble on mono labels ---------- */
  const GLYPHS = '!<>-_\\/[]{}=+*^?#01';
  function scramble(el) {
    const final = el.textContent; let f = 0;
    const id = setInterval(() => {
      el.textContent = [...final].map((c, i) => (c === ' ' || i < f / 2) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('');
      if (++f > final.length * 2) { clearInterval(id); el.textContent = final; }
    }, 28);
  }
  function observeLabels() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { scramble(e.target); io.unobserve(e.target); } }), { threshold: 1 });
    $$('.label, .f-label, .svc-num').forEach(el => io.observe(el));
  }

  /* ---------- Cursor + magnetic buttons ---------- */
  function initPointer() {
    if (!fine) return;
    const cur = $('#cursor');
    root.classList.add('has-cursor');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
    $$('a, button').forEach(el => {
      el.addEventListener('pointerenter', () => cur.classList.add('big'));
      el.addEventListener('pointerleave', () => cur.classList.remove('big'));
    });
    $$('.cta-mail, .btn, .burger').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${(e.clientX - r.left - r.width / 2) * .3}px ${(e.clientY - r.top - r.height / 2) * .4}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
    return () => { cx += (tx - cx) * .2; cy += (ty - cy) * .2; cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; };
  }

  /* ---------- Insight hover preview ---------- */
  const preview = $('#preview');
  if (fine) {
    $$('.post').forEach(post => {
      post.addEventListener('mouseenter', () => { preview.dataset.kind = post.dataset.art; preview.classList.add('on'); });
      post.addEventListener('mouseleave', () => preview.classList.remove('on'));
      post.addEventListener('mousemove', e => { preview.style.left = e.clientX + 'px'; preview.style.top = e.clientY + 'px'; });
      post.addEventListener('mouseenter', e => { preview.style.left = e.clientX + 'px'; preview.style.top = e.clientY + 'px'; });
    });
  }

  /* ---------- Live performance HUD: this page, measured in your browser ---------- */
  function initHud() {
    const hud = $('#hud'); if (!hud) return;
    const set = (k, v, good) => { const b = hud.querySelector(`[data-k="${k}"]`); if (b) { b.textContent = v; b.classList.toggle('good', !!good); } };
    try {
      new PerformanceObserver(l => { const e = l.getEntries().pop(); if (e) set('lcp', (e.startTime / 1000).toFixed(2) + 's', e.startTime < 2500); }).observe({ type: 'largest-contentful-paint', buffered: true });
      let cls = 0;
      new PerformanceObserver(l => { l.getEntries().forEach(e => { if (!e.hadRecentInput) cls += e.value; }); set('cls', cls.toFixed(3), cls < .1); }).observe({ type: 'layout-shift', buffered: true });
      set('cls', '0.000', true);
      let inp = 0;
      new PerformanceObserver(l => { l.getEntries().forEach(e => { if (e.interactionId) inp = Math.max(inp, e.duration); }); set('inp', Math.round(inp) + 'ms', inp < 200); }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch (e) {}
    try {
      const c = document.createElement('canvas').getContext('webgl');
      const ext = c && c.getExtension('WEBGL_debug_renderer_info');
      const name = ext ? c.getParameter(ext.UNMASKED_RENDERER_WEBGL) : (c ? c.getParameter(c.RENDERER) : 'n/a');
      set('gpu', String(name).replace(/ANGLE \(|\)$/g, '').replace(/Direct3D.*|vs_.*$/, '').trim());
      c && c.getExtension('WEBGL_lose_context')?.loseContext();
    } catch (e) {}
    let frames = 0, last = performance.now();
    const count = now => { frames++; if (now - last > 1000) { set('fps', frames, frames > 50); frames = 0; last = now; } requestAnimationFrame(count); };
    requestAnimationFrame(count);
  }

  /* ---------- Start motion only after a real frame ---------- */
  if (reduced) return;
  requestAnimationFrame(() => requestAnimationFrame(async () => {
    motion = true;
    root.classList.add('anim', 'fill-on');
    observeReveals();
    observeLabels();
    const moveCursor = initPointer();

    if (window.Lenis) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: .95 });
      lenis.on('scroll', update);
    }

    const layers = [];
    let builtThisFrame = false;
    const vis = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
    if (window.WBGL) {
      const h = WBGL.ribbons($('#heroGL'), { host: $('.hero'), count: 3, gain: .6 });
      if (h) layers.push((t) => h.render(t * .45, scrollY / innerHeight));
      WBGL.logoField($('#bandGL'), 'assets/logo-mark-dark.png').then(f => {
        if (!f) return;
        layers.push((t) => f.render(t, bandP));
        root.classList.add('gl-on');
      });
    }
    if (window.WBX) {
      const X = WBX;
      const progressOf = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight)); };
      // Shader compiles are expensive: build each experience only when its section is
      // within reach, and never more than one per frame.
      const near = el => { const r = el.getBoundingClientRect(); return r.top < innerHeight * 2.2 && r.bottom > -innerHeight; };
      const lazy = (el, create, draw) => {
        let L = null, state = 0;          // 0 waiting, 1 live, 2 failed
        layers.push(t => {
          if (state === 2) return;
          if (state === 0) {
            if (builtThisFrame || !near(el)) return;
            builtThisFrame = true;
            L = create(); state = L ? 1 : 2;
            return;
          }
          draw(L, t);
        });
      };

      // type window
      const typeSec = $('#typewin');
      lazy(typeSec, () => X.typeWindow($('#typeGL'), DE ? (innerWidth < 700 ? ['GEMACHT,', 'UM GEFUNDEN', 'ZU WERDEN.'] : ['GEMACHT, UM', 'GEFUNDEN ZU WERDEN.']) : (innerWidth < 700 ? ['DESIGNED', 'TO BE', 'FOUND.'] : ['DESIGNED', 'TO BE FOUND.'])),
        (L, t) => { if (vis(typeSec)) L.render(t * .5, progressOf(typeSec)); });

      // one experience per service panel
      const makers = [X.design, X.tunnel, X.city];
      panels.forEach((panel, i) => {
        const cv = document.createElement('canvas'); cv.className = 'svc-gl'; cv.setAttribute('aria-hidden', 'true');
        panel.insertBefore(cv, $('.svc-g', panel));
        const local = () => (scrollY - (servicesEl.offsetTop + i * innerHeight * SVC_STEP)) / innerHeight;
        const active = () => { const l = local(); return l > -.98 && l < SVC_STEP; };
        lazy(svcs[i], () => {
          let L;
          if (i === 3) {
            const lab = document.createElement('div'); lab.className = 'geo-labels'; panel.appendChild(lab);
            L = X.geoGlobe(cv, lab);
            if (L) panel.classList.add('geo-drag');
          } else L = makers[i](cv);
          if (L) panel.classList.add('has-gl');
          return L;
        }, (L, t) => { if (active()) L.render(t * [.45, .3, .5, 1][i], local()); });
      });

      // fluid behind testimonials
      const clientsEl = $('#clients');
      lazy(clientsEl, () => X.fluid($('#fluidGL')), (L, t) => { if (vis(clientsEl)) L.render(t); });

      // liquid hover cards on insights

      // black hole + four tile scenes in contact
      const ctaEl = $('#contact');
      lazy(ctaEl, () => X.hole($('#ctaGL')), (L, t) => {
        if (!vis(ctaEl)) return;
        const r = ctaEl.getBoundingClientRect();
        L.render(t * .4, clamp((innerHeight - r.top) / (r.height + innerHeight)));
      });
      const tileEls = $$('.tile-g');
      lazy(ctaEl, () => X.tiles($('#tilesGL'), tileEls), (L, t) => {
        if (!vis(ctaEl)) return;
        const rev = tileEls.map((el, i) => { const r = el.getBoundingClientRect(); return clamp((innerHeight - r.top) / (innerHeight * .45) - i * .08); });
        tileEls.forEach((el, i) => { el.parentElement.querySelector('.mono').style.opacity = Math.max(.15, rev[i]); });
        L.render(t * .6, rev);
      });
    }

    /* scroll-velocity skew on work cards and insight rows */
    const skewEls = [];
    let skew = 0;
    layers.push(() => {
      const v = lenis ? lenis.velocity : 0;
      skew += (clamp(v * .05, -2, 2) - skew) * .12;
      if (Math.abs(skew) > .01) skewEls.forEach(el => { if (vis(el)) el.style.transform = `skewY(${skew.toFixed(2)}deg)`; });
    });

    /* gyroscope drives the same pointer every shader listens to (phones) */
    if (!fine && window.DeviceOrientationEvent) {
      const onTilt = e => {
        if (e.gamma == null) return;
        const x = innerWidth / 2 + clamp(e.gamma / 35, -1, 1) * innerWidth * .4;
        const y = innerHeight / 2 + clamp((e.beta - 45) / 35, -1, 1) * innerHeight * .35;
        dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: y }));
      };
      const start = () => {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') DeviceOrientationEvent.requestPermission().then(s => { if (s === 'granted') addEventListener('deviceorientation', onTilt); }).catch(() => {});
        else addEventListener('deviceorientation', onTilt);
      };
      addEventListener('touchend', start, { once: true });
    }

    initHud();

    const t0 = performance.now();
    const loop = now => {
      if (lenis) lenis.raf(now);
      update();
      if (moveCursor) moveCursor();
      const t = (now - t0) / 1000;
      builtThisFrame = false;
      for (const l of layers) l(t);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    update();
  }));
})();
