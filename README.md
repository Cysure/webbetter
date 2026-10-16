# Web Better — webbetter.ch

Static website for Web Better: design, websites, apps, SEO and GEO.

## Structure

- `index.html` — English page (source of truth)
- `de/index.html` — German page, **generated** by `tools/build.py`
- `styles.css`, `experiences.css` — styles
- `main.js` — scroll, motion and interaction
- `gl.js`, `experiences.js` — WebGL layers
- `i18n.js` — English/German strings and the language dropdown
- `assets/` — logos, client screenshots, paintings, share image
- `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` — **generated** by `tools/build.py`
- `vercel.json` — clean URLs, redirects and headers for Vercel

## Editing

After changing `index.html`, `i18n.js` or `tools/faq.json`, rebuild:

```bash
python tools/build.py
```

This updates the SEO head, the FAQ and its structured data, the German page, the sitemap, robots.txt and the llms files.

## Local preview

```bash
python -m http.server 6200
```
