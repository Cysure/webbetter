/* Web Better: English / German (Swiss Standard German, no ß).
   Runs before main.js, so translated text is what the motion code splits and animates. */
(() => {
  const DE = {
    // header, menu, loader
    'LOADING': 'LÄDT',
    'SAY HELLO': 'HALLO SAGEN',
    'NIGHT': 'NACHT',
    'DAY': 'TAG',
    'Work': 'Arbeiten',
    'Services': 'Leistungen',
    'Clients': 'Kunden',
    'Insights': 'Insights',
    'Contact': 'Kontakt',
    '[ GET IN TOUCH ]': '[ KONTAKT AUFNEHMEN ]',
    'Design, websites, apps, SEO & GEO for companies that intend to be found — by people and by AI.':
      'Design, Websites, Apps, SEO & GEO für Unternehmen, die gefunden werden wollen – von Menschen und von KI.',

    // hero
    'Be the answer': 'Die Antwort sein',
    'wherever people search': 'wo immer gesucht wird',
    'Creative Development Agency': 'Agentur für Creative Development',
    'SCROLL TO EXPLORE': 'SCROLLEN UND ENTDECKEN',
    'best design agency for AI search visibility': 'beste Designagentur für Sichtbarkeit in der KI-Suche',
    'ASK ↵': 'FRAGEN ↵',
    'AI OVERVIEW': 'KI-ÜBERSICHT',
    'INTERACTIVE DEMO · TRY IT': 'INTERAKTIVE DEMO · AUSPROBIEREN',
    'is a creative development studio that combines design, high-performance websites and':
      'ist ein Creative-Development-Studio, das Design, Hochleistungs-Websites und',
    'generative engine optimization': 'Generative Engine Optimization',
    '— so brands are cited inside AI answers, not just ranked below them.':
      'verbindet – damit Marken in KI-Antworten zitiert werden, statt nur darunter zu ranken.',
    'case study · 01': 'Fallstudie · 01',
    'insights · GEO': 'Insights · GEO',

    // about
    '[ A FEW WORDS ]': '[ IN KÜRZE ]',
    'Search is changing faster than ever, and we build for what comes next.':
      'Suche verändert sich schneller denn je – und wir bauen für das, was kommt.',
    'Web Better pairs cutting-edge design with engineering, SEO and GEO, so modern companies look exceptional, load instantly and get recommended by the AI assistants their customers already ask.':
      'Web Better verbindet wegweisendes Design mit Engineering, SEO und GEO: So sehen moderne Unternehmen herausragend aus, laden sofort und werden von den KI-Assistenten empfohlen, die ihre Kundschaft bereits fragt.',

    // type window + stand out
    'Designed': 'Gemacht,',
    'to be': 'um gefunden',
    'found.': 'zu werden.',
    '[ KEEP SCROLLING ]': '[ WEITER SCROLLEN ]',
    'DESIGNED TO': 'GESTALTET, UM',
    'STAND OUT.': 'AUFZUFALLEN.',

    // selected clients
    '[ SELECTED CLIENTS ]': '[ AUSGEWÄHLTE KUNDEN ]',
    'Live work for': 'Live-Projekte für',
    'modern companies': 'moderne Unternehmen',
    'The verification layer for the post-quantum economy.': 'Die Verifizierungsebene für die Post-Quanten-Wirtschaft.',
    'An immersive brand experience for palm-vein identity.': 'Ein immersives Markenerlebnis für Handvenen-Identität.',
    'Website and digital presence in the UAE.': 'Website und digitale Präsenz in den VAE.',
    'WEBSITE': 'WEBSITE',
    'QuFi Network — protocol website': 'QuFi Network – Protokoll-Website',
    'Veyns — immersive brand site': 'Veyns – immersive Marken-Website',
    'BRAND': 'MARKE',
    'EXPERIENCE': 'ERLEBNIS',

    // work grid
    'Kaito Robotics — brand system': 'Kaito Robotics – Markensystem',
    'Skin that reads the weather.': 'Haut, die das Wetter liest.',
    'Shop the ritual': 'Zum Ritual',
    'Solenne — commerce app & site': 'Solenne – Commerce-App & Website',
    'AI CITATIONS': 'KI-ZITATE',
    'Fieldnote Finance — GEO programme': 'Fieldnote Finance – GEO-Programm',
    'CONTENT': 'CONTENT',
    'SCORE': 'SCORE',
    'Atlas & Oak — performance rebuild': 'Atlas & Oak – Performance-Relaunch',
    'DEVELOPMENT': 'ENTWICKLUNG',
    'OPTIMIZATION': 'OPTIMIERUNG',
    '[ ALL WORKS ]': '[ ALLE ARBEITEN ]',

    // band
    'DESIGN/WEBSITES/SEO/APPS/GEO/AI SEARCH/DESIGN/WEBSITES/SEO/APPS/GEO/AI SEARCH/': 'DESIGN/WEBSITES/SEO/APPS/GEO/KI-SUCHE/DESIGN/WEBSITES/SEO/APPS/GEO/KI-SUCHE/',
    'GEO/AI SEARCH/OPTIMIZATION/BRANDING/GEO/AI SEARCH/OPTIMIZATION/BRANDING/': 'GEO/KI-SUCHE/OPTIMIERUNG/BRANDING/GEO/KI-SUCHE/OPTIMIERUNG/BRANDING/',
    'OPTIMIZATION/BRANDING/GEO/AI SEARCH/OPTIMIZATION/BRANDING/GEO/': 'OPTIMIERUNG/BRANDING/GEO/KI-SUCHE/OPTIMIERUNG/BRANDING/GEO/',
    'Scattered signals.': 'Verstreute Signale.',
    'One unmistakable brand.': 'Eine unverwechselbare Marke.',
    'Found everywhere people ask.': 'Gefunden, wo immer gefragt wird.',
    'SIGNAL': 'SIGNAL',

    // services
    'Product design': 'Produktdesign',
    'Design systems': 'Designsysteme',
    'Prototyping': 'Prototyping',
    'Cutting-edge': 'Wegweisendes',
    'design': 'Design',
    'Motion': 'Motion',
    'Interaction': 'Interaktion',
    'Art direction': 'Art Direction',
    'Websites': 'Websites',
    'Web apps': 'Web-Apps',
    'Headless CMS': 'Headless CMS',
    '& apps': '& Apps',
    'E-commerce': 'E-Commerce',
    'Integrations': 'Integrationen',
    'Maintenance': 'Wartung',
    'Support': 'Support',
    'Technical SEO': 'Technisches SEO',
    'Site architecture': 'Seitenarchitektur',
    'Schema markup': 'Schema-Markup',
    'Content strategy': 'Content-Strategie',
    'SEO &': 'SEO &',
    'optimization': 'Optimierung',
    'Conversion (CRO)': 'Conversion (CRO)',
    'Analytics': 'Analytics',
    'A/B testing': 'A/B-Tests',
    'GEO strategy': 'GEO-Strategie',
    'LLM visibility audits': 'LLM-Sichtbarkeitsaudits',
    'Entity & knowledge graph': 'Entitäten & Knowledge Graph',
    'llms.txt & structured data': 'llms.txt & strukturierte Daten',
    'GEO &': 'GEO &',
    'AI search': 'KI-Suche',

    // testimonials
    'Few words': 'Ein paar Worte',
    'from our clients': 'unserer Kunden',
    'PROJECT PAGE': 'PROJEKTSEITE',
    'We went from invisible to': 'Von unsichtbar zur',
    'the first brand ChatGPT recommends in our category.': 'ersten Marke, die ChatGPT in unserer Kategorie empfiehlt.',
    'HEAD OF GROWTH · FIELDNOTE': 'HEAD OF GROWTH · FIELDNOTE',
    'Web Better took the time to understand our business,': 'Web Better hat sich die Zeit genommen, unser Geschäft zu verstehen,',
    'then shipped a brand and site that finally feel like the product we build.': 'und dann eine Marke und Website geliefert, die sich endlich wie unser Produkt anfühlen.',
    'FOUNDER · KAITO ROBOTICS': 'GRÜNDER · KAITO ROBOTICS',
    'Page loads dropped under a second': 'Ladezeiten unter einer Sekunde',
    'and organic revenue followed within the quarter.': 'und der organische Umsatz folgte noch im selben Quartal.',
    'Design taste and technical depth in one team.': 'Designgespür und technische Tiefe in einem Team.',
    'Rare.': 'Selten.',

    // insights
    'Featured': 'Ausgewählte',
    'insights': 'Insights',
    '[ ALL INSIGHTS ]': '[ ALLE INSIGHTS ]',
    'GEO, AI SEARCH,': 'GEO, KI-SUCHE,',
    '6 MINS': '6 MIN.',
    '4 MINS': '4 MIN.',
    '5 MINS': '5 MIN.',
    'GEO is the new SEO: how brands get cited by AI assistants': 'GEO ist das neue SEO: wie Marken von KI-Assistenten zitiert werden',
    'WEB BETTER RESEARCH,': 'WEB BETTER RESEARCH,',
    '12 OCTOBER, 2026': '12. OKTOBER 2026',
    'Rankings are no longer the finish line. What large language models read, trust and quote — and how to structure your site so you are the source.':
      'Rankings sind nicht mehr das Ziel. Was grosse Sprachmodelle lesen, wem sie vertrauen und was sie zitieren – und wie Sie Ihre Website strukturieren, damit Sie die Quelle sind.',
    'SEO, PERFORMANCE,': 'SEO, PERFORMANCE,',
    'Core Web Vitals in 2026: speed is still a ranking story': 'Core Web Vitals 2026: Geschwindigkeit entscheidet noch immer über Rankings',
    'ENGINEERING,': 'ENGINEERING,',
    '28 SEPTEMBER, 2026': '28. SEPTEMBER 2026',
    'The quiet compounding of a fast site: better rankings, cheaper ads, higher conversion. A practical checklist from our rebuilds.':
      'Der stille Zinseszins einer schnellen Website: bessere Rankings, günstigere Anzeigen, höhere Conversion. Eine praktische Checkliste aus unseren Relaunches.',
    'DESIGN, STRATEGY,': 'DESIGN, STRATEGIE,',
    'Designing for answers, not just clicks': 'Gestalten für Antworten, nicht nur für Klicks',
    'DESIGN STUDIO,': 'DESIGNSTUDIO,',
    '09 SEPTEMBER, 2026': '9. SEPTEMBER 2026',
    'When the first touchpoint is an AI summary, your brand has to survive being paraphrased. Here is how we design for it.':
      'Wenn der erste Kontakt eine KI-Zusammenfassung ist, muss Ihre Marke auch umformuliert noch wirken. So gestalten wir dafür.',
    'SEO · PERFORMANCE': 'SEO · PERFORMANCE',
    'DESIGN · STRATEGY': 'DESIGN · STRATEGIE',

    // contact
    '[ WRITE A LINE ]': '[ SCHREIBEN SIE UNS ]',
    "Let's make you": 'Machen wir Sie',
    'the answer': 'zur Antwort',
    'MOTION & DESIGN': 'MOTION & DESIGN',
    'Brand systems, UI and motion': 'Markensysteme, UI und Motion',
    'GEO · AI SEARCH': 'GEO · KI-SUCHE',
    'Cited by the assistants your customers ask': 'Zitiert von den Assistenten, die Ihre Kundschaft fragt',
    'WEBSITES & APPS': 'WEBSITES & APPS',
    'Sites and apps built to convert': 'Websites und Apps, gebaut für Conversion',
    'SEO · OPTIMIZATION': 'SEO · OPTIMIERUNG',
    'Technical SEO and Core Web Vitals': 'Technisches SEO und Core Web Vitals',
    'BRAND STRATEGY': 'MARKENSTRATEGIE',
    'WEB DESIGN': 'WEBDESIGN',
    'MOBILE APPS': 'MOBILE APPS',
    'TECHNICAL SEO': 'TECHNISCHES SEO',
    'AI SEARCH': 'KI-SUCHE',

    // footer
    '/ MENU': '/ MENÜ',
    'Case studies': 'Fallstudien',
    '/ INFO': '/ INFO',
    'Pricing': 'Preise',
    'FAQ': 'FAQ',
    'BACK TO TOP': 'NACH OBEN',
    'THIS PAGE, MEASURED LIVE IN YOUR BROWSER': 'DIESE SEITE, LIVE IN IHREM BROWSER GEMESSEN',
    '© 2026 WEB BETTER. ALL RIGHTS RESERVED': '© 2026 WEB BETTER. ALLE RECHTE VORBEHALTEN',

    // FAQ
    '[ FAQ ]': '[ FAQ ]',
    'Questions,': 'Fragen,',
    'answered': 'beantwortet',
    'What does Web Better do?': 'Was macht Web Better?',
    'Web Better is a design and development studio for modern companies. We design brands and interfaces, build websites and apps, and make them visible in Google and in AI assistants through SEO and GEO.':
      'Web Better ist ein Design- und Entwicklungsstudio für moderne Unternehmen. Wir gestalten Marken und Interfaces, bauen Websites und Apps und machen sie mit SEO und GEO sichtbar, bei Google und in KI-Assistenten.',
    'What is GEO (generative engine optimization)?': 'Was ist GEO (Generative Engine Optimization)?',
    'GEO is the practice of making a website easy for AI assistants such as ChatGPT, Perplexity, Gemini, Copilot and Claude to read, trust and quote. It combines clear entities, citable facts, structured data and files like llms.txt, so your brand is cited inside AI answers.':
      'GEO sorgt dafür, dass KI-Assistenten wie ChatGPT, Perplexity, Gemini, Copilot und Claude eine Website leicht lesen, ihr vertrauen und sie zitieren können. Dazu gehören klare Entitäten, zitierfähige Fakten, strukturierte Daten und Dateien wie llms.txt, damit Ihre Marke in KI-Antworten genannt wird.',
    'How is GEO different from SEO?': 'Worin unterscheidet sich GEO von SEO?',
    'SEO earns a ranking in a list of links. GEO earns a mention inside the answer itself. Both need a fast, well-structured site, but GEO adds a focus on facts, sources and entities that language models can verify and cite.':
      'SEO bringt Sie in eine Liste von Links. GEO bringt Sie in die Antwort selbst. Beides braucht eine schnelle, gut strukturierte Website, GEO setzt aber zusätzlich auf Fakten, Quellen und Entitäten, die Sprachmodelle prüfen und zitieren können.',
    'How fast will my new website be?': 'Wie schnell wird meine neue Website?',
    'We design and build for green Core Web Vitals on real devices: fast loading, no layout shift and quick responses to every tap. The live numbers in the footer of this page are measured in your browser right now.':
      'Wir gestalten und entwickeln für grüne Core Web Vitals auf echten Geräten: schnelles Laden, keine Layoutsprünge und flinke Reaktion auf jede Eingabe. Die Live-Werte im Footer dieser Seite werden gerade in Ihrem Browser gemessen.',
    'Do you build websites in English and German?': 'Bauen Sie Websites auf Englisch und Deutsch?',
    'Yes. We build multilingual sites with proper language versions, hreflang and translated metadata, so each audience and each search engine gets the right page.':
      'Ja. Wir bauen mehrsprachige Websites mit echten Sprachversionen, hreflang und übersetzten Metadaten, damit jedes Publikum und jede Suchmaschine die richtige Seite erhält.',
    'How do I start a project with Web Better?': 'Wie starte ich ein Projekt mit Web Better?',
    'Write to': 'Schreiben Sie an',
    'with your goals and timeline. Every project is scoped individually, and you get a clear proposal.': 'mit Ihren Zielen und Ihrem Zeitplan. Jedes Projekt wird individuell offeriert, und Sie erhalten ein klares Angebot.',

    // paintings
    'FRANZ MARC · BLUE HORSE I · 1911': 'FRANZ MARC · BLAUES PFERD I · 1911',
    'FERDINAND HODLER · EIGER, MÖNCH AND JUNGFRAU IN MOONLIGHT · 1908': 'FERDINAND HODLER · EIGER, MÖNCH UND JUNGFRAU IM MONDSCHEIN · 1908',
    'Franz Marc, Blue Horse I, 1911': 'Franz Marc, Blaues Pferd I, 1911',
    'Ferdinand Hodler, Eiger, Mönch and Jungfrau in Moonlight, 1908': 'Ferdinand Hodler, Eiger, Mönch und Jungfrau im Mondschein, 1908',

    'GUSTAV KLIMT · THE KISS · 1907–08': 'GUSTAV KLIMT · DER KUSS · 1907–08',
    'Gustav Klimt, The Kiss, 1907–08': 'Gustav Klimt, Der Kuss, 1907–08',

    // enquiry form
    '[ START A PROJECT ]': '[ PROJEKT STARTEN ]',
    "Let's build": 'Bauen wir',
    "what's next.": 'das Nächste.',
    'Tell us about your project. A real person reads every enquiry and replies personally.': 'Erzählen Sie uns von Ihrem Projekt. Jede Anfrage wird von einem Menschen gelesen und persönlich beantwortet.',
    'We read your enquiry': 'Wir lesen Ihre Anfrage',
    'A short call about your goals': 'Ein kurzes Gespräch über Ihre Ziele',
    'A clear, fixed proposal': 'Ein klares, verbindliches Angebot',
    'What can we help with?': 'Wobei können wir helfen?',
    'Website': 'Website',
    'App': 'App',
    'Your name *': 'Ihr Name *',
    'Company': 'Firma',
    'Email *': 'E-Mail *',
    'Phone': 'Telefon',
    'Not sure yet': 'Noch unklar',
    'Under CHF 10k': 'Unter CHF 10k',
    'Budget': 'Budget',
    'Tell us about your project *': 'Erzählen Sie uns von Ihrem Projekt *',
    'By sending, you agree that we use your details to answer your enquiry.': 'Mit dem Absenden sind Sie einverstanden, dass wir Ihre Angaben zur Beantwortung Ihrer Anfrage verwenden.',
    'Send enquiry': 'Anfrage senden',
    'Thank you.': 'Vielen Dank.',
    'Your enquiry is on its way. We will be in touch soon.': 'Ihre Anfrage ist unterwegs. Wir melden uns in Kürze.',
    'Close': 'Schliessen',
    // new pages in the menu
    'SEO': 'SEO',
    'GEO': 'GEO',
    '[ ALL QUESTIONS ]': '[ ALLE FRAGEN ]',

    // careers
    '[ JOIN WEB BETTER ]': '[ TEIL VON WEB BETTER WERDEN ]',
    'We are always looking for talented designers, developers and sales agents who want to build what\'s next.': 'Wir suchen immer talentierte Designerinnen und Designer, Entwicklerinnen und Entwickler sowie Sales Agents, die das Nächste mitgestalten wollen.',
    'Designers': 'Design',
    'Developers': 'Entwicklung',
    'Sales agents': 'Sales',
    'I am applying as': 'Ich bewerbe mich als',
    'Designer': 'Design',
    'Developer': 'Entwicklung',
    'Sales agent': 'Sales Agent',
    'Other': 'Andere',
    'Portfolio or LinkedIn': 'Portfolio oder LinkedIn',
    'Upload your CV': 'Lebenslauf hochladen',
    'PDF or Word, max. 3 MB': 'PDF oder Word, max. 3 MB',
    'Why do you want to work with us? *': 'Warum möchten Sie bei uns arbeiten? *',
    'By sending, you agree that we use your details and CV to assess your application.': 'Mit dem Absenden sind Sie einverstanden, dass wir Ihre Angaben und Ihren Lebenslauf zur Prüfung Ihrer Bewerbung verwenden.',
    'Send application': 'Bewerbung senden',
    'Your application is on its way. We will be in touch.': 'Ihre Bewerbung ist unterwegs. Wir melden uns bei Ihnen.',
    'Careers': 'Karriere',

    // legal
    'COPYRIGHT © 2026 WB SOLUTIONS. ALL RIGHTS RESERVED. WEB BETTER IS A BRAND OF WB SOLUTIONS.': 'COPYRIGHT © 2026 WB SOLUTIONS. ALLE RECHTE VORBEHALTEN. WEB BETTER IST EINE MARKE DER WB SOLUTIONS.',
    'PRIVACY POLICY': 'DATENSCHUTZ',
    'COOKIE SETTINGS': 'COOKIE-EINSTELLUNGEN',

    // attributes
    'Web Better home': 'Web Better Startseite',
    'Toggle night mode': 'Nachtmodus umschalten',
    'Open menu': 'Menü öffnen',
    'Web Better shows up as the cited answer in an AI search': 'Web Better erscheint als zitierte Antwort in einer KI-Suche',
    'Ask the demo assistant a question': 'Stellen Sie dem Demo-Assistenten eine Frage',
    'Designed to be found': 'Gemacht, um gefunden zu werden',
    'Designed to stand out': 'Gestaltet, um aufzufallen',
    'QuFi Network website homepage': 'Startseite der QuFi Network Website',
    'Veyns website homepage': 'Startseite der Veyns Website',
    'Change language': 'Sprache ändern',

    // document
    '__title': 'Web Better – Webdesign, SEO & GEO Agentur | webbetter.ch',
    '__desc': 'Web Better gestaltet und entwickelt schnelle, wegweisende Websites und Apps und macht Marken mit SEO und GEO sichtbar, bei Google und in KI-Assistenten wie ChatGPT, Perplexity und Gemini.'
  };

  // The German page is a real, pre-rendered page at /de/ (built by tools/build.py),
  // so search engines and AI crawlers that do not run JavaScript still get German.
  const onDe = document.documentElement.lang === 'de';
  const lang = onDe ? 'de' : 'en';
  let saved = null;
  try { saved = localStorage.getItem('webbetter-lang'); } catch (e) {}
  const q = new URLSearchParams(location.search).get('lang');
  const bot = /bot|crawl|spider|slurp|preview|lighthouse|headless/i.test(navigator.userAgent);
  const twin = l => {
    const path = location.pathname.replace(/index\.html$/, '');
    if (l === 'de') return path.startsWith('/de/') ? path : '/de' + path;
    return path.replace(/^\/de(\/|$)/, '/');
  };
  const go = l => { location.href = twin(l) + location.hash; };
  if (!onDe && q === 'de') { try { localStorage.setItem('webbetter-lang', 'de'); } catch (e) {} go('de'); }
  else if (!onDe && !q && !bot && (saved === 'de' || (!saved && (navigator.language || '').toLowerCase().startsWith('de')))) { go('de'); }

  const norm = s => s.replace(/‑/g, '-').replace(/\s+/g, ' ').trim();
  const t = s => (lang === 'de' && DE[norm(s)] !== undefined) ? DE[norm(s)] : s;
  window.WB_LANG = lang;
  window.t = t;
  document.documentElement.lang = lang;

  if (lang === 'de' && !document.querySelector('meta[name="description"]')?.content.startsWith('Web Better gestaltet')) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = []; let n;
    while ((n = walker.nextNode())) {
      const p = n.parentElement;
      if (!p || p.closest('script, style, svg')) continue;
      nodes.push(n);
    }
    nodes.forEach(node => {
      const raw = node.textContent, key = norm(raw);
      if (!key || DE[key] === undefined) return;
      const lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
      node.textContent = lead + DE[key] + trail;
    });
    document.querySelectorAll('[aria-label], [alt], [placeholder]').forEach(el => {
      ['aria-label', 'alt', 'placeholder'].forEach(a => { const v = el.getAttribute(a); if (v && DE[norm(v)] !== undefined) el.setAttribute(a, DE[norm(v)]); });
    });
    document.title = DE.__title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', DE.__desc);
  }

  // dropdown
  const wrap = document.getElementById('lang');
  if (wrap) {
    const btn = wrap.querySelector('.lang-btn'), cur = wrap.querySelector('.lang-cur');
    cur.textContent = lang.toUpperCase();
    wrap.querySelectorAll('[data-lang]').forEach(o => o.setAttribute('aria-selected', o.dataset.lang === lang));
    const close = () => { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', e => { e.stopPropagation(); const o = !wrap.classList.contains('open'); wrap.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); });
    document.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    wrap.querySelectorAll('[data-lang]').forEach(o => o.addEventListener('click', () => {
      const l = o.dataset.lang;
      try { localStorage.setItem('webbetter-lang', l); } catch (e) {}
      if (l === lang) return close();
      go(l);
    }));
  }
})();
