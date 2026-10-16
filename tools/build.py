"""Web Better build: FAQ, structured data, static German page, sitemap, robots, llms.txt.

Run from anywhere:  python tools/build.py
The English index.html is the source of truth. de/index.html is generated from it.
"""
import html, json, os, re, subprocess
from html.parser import HTMLParser
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://webbetter.ch'
TODAY = date.today().isoformat()
FAQ = json.load(open(os.path.join(ROOT, 'tools', 'faq.json'), encoding='utf-8'))

def read(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
def write(p, s):
    full = os.path.join(ROOT, p); os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, 'w', encoding='utf-8', newline='\n').write(s)

# ---------------------------------------------------------------- copy
COPY = {
  'en': {
    'title': 'Web Better — Web Design, SEO &amp; GEO Agency | webbetter.ch',
    'og_title': 'Web Better — Web Design, SEO &amp; GEO Agency',
    'desc': 'Web Better designs and builds fast, cutting-edge websites and apps, and makes brands visible in Google and AI assistants like ChatGPT, Perplexity and Gemini through SEO and GEO.',
    'url': SITE + '/', 'locale': 'en_GB', 'alt_locale': 'de_CH',
    'org_desc': 'Design and development studio for modern companies: cutting-edge design, websites, apps, SEO, performance optimization and GEO (generative engine optimization) for visibility in AI search.',
    'services': [
      ('Cutting-edge design', 'UI/UX, product design, design systems, motion, 3D and WebGL, art direction.'),
      ('Websites and apps', 'Websites, web apps, iOS and Android apps, headless CMS, e-commerce, integrations, maintenance and support.'),
      ('SEO and optimization', 'Technical SEO, site architecture, schema markup, content strategy, Core Web Vitals, conversion optimization and analytics.'),
      ('GEO and AI search', 'Generative engine optimization: visibility and citations in ChatGPT, Perplexity, Gemini, Google AI Overviews, Copilot and Claude.')],
    'page_name': 'Web Better — Web Design, SEO & GEO Agency',
  },
  'de': {
    'title': 'Web Better – Webdesign, SEO &amp; GEO Agentur | webbetter.ch',
    'og_title': 'Web Better – Webdesign, SEO &amp; GEO Agentur',
    'desc': 'Web Better gestaltet und entwickelt schnelle, wegweisende Websites und Apps und macht Marken mit SEO und GEO sichtbar, bei Google und in KI-Assistenten wie ChatGPT, Perplexity und Gemini.',
    'url': SITE + '/de/', 'locale': 'de_CH', 'alt_locale': 'en_GB',
    'org_desc': 'Design- und Entwicklungsstudio für moderne Unternehmen: wegweisendes Design, Websites, Apps, SEO, Performance-Optimierung und GEO (Generative Engine Optimization) für Sichtbarkeit in der KI-Suche.',
    'services': [
      ('Wegweisendes Design', 'UI/UX, Produktdesign, Designsysteme, Motion, 3D und WebGL, Art Direction.'),
      ('Websites und Apps', 'Websites, Web-Apps, iOS- und Android-Apps, Headless CMS, E-Commerce, Integrationen, Wartung und Support.'),
      ('SEO und Optimierung', 'Technisches SEO, Seitenarchitektur, Schema-Markup, Content-Strategie, Core Web Vitals, Conversion-Optimierung und Analytics.'),
      ('GEO und KI-Suche', 'Generative Engine Optimization: Sichtbarkeit und Zitate in ChatGPT, Perplexity, Gemini, Google AI Overviews, Copilot und Claude.')],
    'page_name': 'Web Better – Webdesign, SEO & GEO Agentur',
  }
}

def faq_items(lang):
    out = []
    for item in FAQ:
        q, a = item[lang]
        a_html = html.escape(a, quote=False).replace('hello@webbetter.ch', '<a href="mailto:hello@webbetter.ch">hello@webbetter.ch</a>')
        out.append(f'''      <details class="faq-item">
        <summary><h3 class="faq-q">{html.escape(q, quote=False)}</h3><span class="faq-plus" aria-hidden="true"></span></summary>
        <p>{a_html}</p>
      </details>''')
    return '\n'.join(out)

def jsonld(lang):
    c = COPY[lang]
    graph = [
      {"@type": "Organization", "@id": SITE + "/#org", "name": "Web Better", "alternateName": ["WebBetter", "webbetter.ch"],
       "url": SITE + "/", "logo": {"@type": "ImageObject", "url": SITE + "/assets/logo-webbetter.png", "width": 1040, "height": 586},
       "image": SITE + "/assets/og-image.png", "email": "hello@webbetter.ch", "description": c['org_desc'],
       "knowsAbout": ["Web design", "UI/UX design", "Brand identity", "Website development", "Mobile app development", "E-commerce",
                      "Search engine optimization", "Technical SEO", "Core Web Vitals", "Generative engine optimization (GEO)",
                      "AI search visibility", "Answer engine optimization", "Structured data", "llms.txt", "WebGL"],
       "contactPoint": {"@type": "ContactPoint", "email": "hello@webbetter.ch", "contactType": "sales", "availableLanguage": ["English", "German"]}},
      {"@type": "ProfessionalService", "@id": SITE + "/#service", "name": "Web Better", "url": SITE + "/",
       "parentOrganization": {"@id": SITE + "/#org"}, "image": SITE + "/assets/og-image.png", "email": "hello@webbetter.ch",
       "description": c['org_desc'],
       "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Services", "itemListElement": [
           {"@type": "Offer", "itemOffered": {"@type": "Service", "name": n, "description": d, "provider": {"@id": SITE + "/#org"}}} for n, d in c['services']]}},
      {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "Web Better", "inLanguage": ["en", "de"],
       "publisher": {"@id": SITE + "/#org"}},
      {"@type": "WebPage", "@id": c['url'] + "#webpage", "url": c['url'], "name": c['page_name'], "description": c['desc'],
       "inLanguage": lang, "isPartOf": {"@id": SITE + "/#website"}, "about": {"@id": SITE + "/#org"},
       "primaryImageOfPage": SITE + "/assets/og-image.png", "dateModified": TODAY},
      {"@type": "FAQPage", "@id": c['url'] + "#faq", "inLanguage": lang, "mainEntity": [
          {"@type": "Question", "name": i[lang][0], "acceptedAnswer": {"@type": "Answer", "text": i[lang][1]}} for i in FAQ]},
    ]
    return '<script type="application/ld+json">\n' + json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=1) + '\n  </script>'

def head(lang):
    c = COPY[lang]
    return f'''  <title>{c['title']}</title>
  <meta name="description" content="{c['desc']}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#071431">
  <link rel="canonical" href="{c['url']}">
  <link rel="alternate" hreflang="en" href="{SITE}/">
  <link rel="alternate" hreflang="de" href="{SITE}/de/">
  <link rel="alternate" hreflang="de-CH" href="{SITE}/de/">
  <link rel="alternate" hreflang="x-default" href="{SITE}/">
  <link rel="alternate" type="text/plain" title="LLM summary" href="{SITE}/llms.txt">
  <link rel="sitemap" type="application/xml" href="{SITE}/sitemap.xml">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Web Better">
  <meta property="og:url" content="{c['url']}">
  <meta property="og:title" content="{c['og_title']}">
  <meta property="og:description" content="{c['desc']}">
  <meta property="og:image" content="{SITE}/assets/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Web Better">
  <meta property="og:locale" content="{c['locale']}">
  <meta property="og:locale:alternate" content="{c['alt_locale']}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{c['og_title']}">
  <meta name="twitter:description" content="{c['desc']}">
  <meta name="twitter:image" content="{SITE}/assets/og-image.png">
  {jsonld(lang)}
'''

HEAD_RE = re.compile(r'  <!-- SEO:START -->.*?<!-- SEO:END -->\n', re.S)
def set_head(s, lang):
    block = '  <!-- SEO:START -->\n' + head(lang) + '  <!-- SEO:END -->\n'
    if HEAD_RE.search(s):
        return HEAD_RE.sub(lambda m: block, s, count=1)
    # first run: strip the old scattered tags, then insert the block after the viewport meta
    s = re.sub(r'  <title>.*?</title>\n', '', s, count=1, flags=re.S)
    for pat in [r'  <meta name="description"[^\n]*\n', r'  <meta name="robots"[^\n]*\n', r'  <meta name="theme-color"[^\n]*\n',
                r'  <link rel="canonical"[^\n]*\n', r'  <link rel="alternate"[^\n]*\n', r'  <meta property="og:[^\n]*\n',
                r'  <meta name="twitter:[^\n]*\n']:
        s = re.sub(pat, '', s)
    s = re.sub(r'  <script type="application/ld\+json">.*?</script>\n', '', s, count=1, flags=re.S)
    return s.replace('<meta name="viewport" content="width=device-width, initial-scale=1">\n',
                     '<meta name="viewport" content="width=device-width, initial-scale=1">\n' + block, 1)

FAQ_RE = re.compile(r'(<div class="faq-list">\n).*?(\n    </div>\n  </section>)', re.S)

# ---------------------------------------------------------------- English page
en = read('index.html')
en = set_head(en, 'en')
en = FAQ_RE.sub(lambda m: m.group(1) + faq_items('en') + m.group(2), en, count=1)
write('index.html', en)

# ---------------------------------------------------------------- German page
node = subprocess.run(['node', '-e', r'''
const s = require('fs').readFileSync(process.argv[1], 'utf8');
const a = s.indexOf('const DE = {') + 'const DE = '.length;
const b = s.indexOf('\n  };', a) + 4;
const DE = eval('(' + s.slice(a, b) + ')');
process.stdout.write(JSON.stringify(DE));
''', os.path.join(ROOT, 'i18n.js')], capture_output=True, text=True, encoding='utf-8')
if node.returncode: raise SystemExit(node.stderr)
DE = json.loads(node.stdout)
norm = lambda t: re.sub(r'\s+', ' ', t.replace('‑', '-')).strip()

class Translator(HTMLParser):
    SKIP = {'script', 'style', 'svg', 'template'}
    def __init__(self):
        super().__init__(convert_charrefs=True); self.out = []; self.stack = []
    def handle_decl(self, d): self.out.append(f'<!{d}>')
    def handle_comment(self, d): self.out.append(f'<!--{d}-->')
    def handle_starttag(self, tag, attrs):
        raw = self.get_starttag_text()
        for a in ('aria-label', 'alt', 'placeholder', 'title'):
            for k, v in attrs:
                if k == a and v and norm(v) in DE:
                    raw = raw.replace(f'{a}="{html.escape(v, quote=True)}"', f'{a}="{html.escape(DE[norm(v)], quote=True)}"', 1)
                    raw = raw.replace(f'{a}="{v}"', f'{a}="{html.escape(DE[norm(v)], quote=True)}"', 1)
        self.out.append(raw)
        if tag not in ('br', 'img', 'meta', 'link', 'input', 'source', 'hr', 'wbr', 'use', 'path', 'circle', 'rect', 'line'):
            self.stack.append(tag)
    def handle_startendtag(self, tag, attrs): self.out.append(self.get_starttag_text())
    def handle_endtag(self, tag):
        if tag in self.stack:
            while self.stack and self.stack.pop() != tag: pass
        self.out.append(f'</{tag}>')
    def handle_data(self, d):
        if any(t in ('script', 'style') for t in self.stack):
            self.out.append(d); return
        if any(t in self.SKIP for t in self.stack):
            self.out.append(html.escape(d, quote=False)); return
        key = norm(d)
        if key and key in DE:
            lead = re.match(r'^\s*', d).group(0); trail = re.search(r'\s*$', d).group(0)
            d = lead + DE[key] + trail
        self.out.append(html.escape(d, quote=False))

de = read('index.html')
de = set_head(de, 'de')
de = FAQ_RE.sub(lambda m: m.group(1) + faq_items('de') + m.group(2), de, count=1)
de = de.replace('<html lang="en">', '<html lang="de">', 1)
# assets and scripts resolve from the site root
de = de.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <base href="/">', 1)
t = Translator(); t.feed(de); t.close()
de = ''.join(t.out)
write('de/index.html', de)

# ---------------------------------------------------------------- sitemap, robots, llms
write('sitemap.xml', f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>{SITE}/</loc>
    <lastmod>{TODAY}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="{SITE}/"/>
    <xhtml:link rel="alternate" hreflang="de" href="{SITE}/de/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}/"/>
  </url>
  <url>
    <loc>{SITE}/de/</loc>
    <lastmod>{TODAY}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="{SITE}/"/>
    <xhtml:link rel="alternate" hreflang="de" href="{SITE}/de/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}/"/>
  </url>
</urlset>
''')

bots = ['Googlebot', 'Bingbot', 'Google-Extended', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
        'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Applebot', 'Applebot-Extended', 'CCBot', 'meta-externalagent', 'DuckAssistBot',
        'YouBot', 'Amazonbot', 'cohere-ai', 'MistralAI-User']
write('robots.txt', '# Web Better welcomes search engines and AI assistants.\n\n' +
      ''.join(f'User-agent: {b}\nAllow: /\n\n' for b in bots) +
      f'User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n')

svc_en = COPY['en']['services']
write('llms.txt', f'''# Web Better

> Web Better (webbetter.ch) is a design and development studio for modern companies. It designs brands and interfaces, builds fast websites and apps, and makes companies visible in Google and in AI assistants through SEO and GEO (generative engine optimization). Contact: hello@webbetter.ch. Languages: English and German.

## Services

''' + ''.join(f'- **{n}**: {d}\n' for n, d in svc_en) + f'''
## Selected client work

- [QuFi Network](https://qufi.network): protocol website for the verification layer of the post-quantum economy (website, WebGL, brand).
- [Veyns](https://veyns.io): immersive brand site for palm-vein identity (experience, WebGL, brand).

## Key pages

- [Home (English)]({SITE}/): services, work, FAQ and contact.
- [Startseite (Deutsch)]({SITE}/de/): German version of the site.
- [Full text for language models]({SITE}/llms-full.txt): services and every FAQ answer in plain text.

## FAQ

''' + ''.join(f'- {i["en"][0]} {i["en"][1]}\n' for i in FAQ) + '''
## Contact

- Email: hello@webbetter.ch
- Website: https://webbetter.ch
''')

write('llms-full.txt', f'''# Web Better — full text for language models

Web Better (webbetter.ch) is a design and development studio for modern companies.
Contact: hello@webbetter.ch. Website: {SITE}. Languages: English and German.
Last updated: {TODAY}.

## What Web Better does

Web Better pairs cutting-edge design with engineering, SEO and GEO, so modern companies look exceptional, load instantly and get recommended by the AI assistants their customers already ask.

## Services

''' + ''.join(f'### {n}\n\n{d}\n\n' for n, d in svc_en) + '''## Frequently asked questions (English)

''' + ''.join(f'### {i["en"][0]}\n\n{i["en"][1]}\n\n' for i in FAQ) + '''## Häufige Fragen (Deutsch)

''' + ''.join(f'### {i["de"][0]}\n\n{i["de"][1]}\n\n' for i in FAQ))

print('built: index.html, de/index.html, sitemap.xml, robots.txt, llms.txt, llms-full.txt')
