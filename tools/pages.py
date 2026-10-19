"""Content and renderer for the SEO, GEO and FAQ pages (English + German).

Called from tools/build.py. Each page is written twice:
  /seo-geo/  /web-app-development/  /faq/  /privacy/          (English)
  /de/seo-geo/  /de/web-app-development/  /de/faq/  /de/privacy/   (German)
"""
import html, json, re

SITE = 'https://webbetter.ch'
E = lambda s: html.escape(s, quote=False)
A = lambda s: html.escape(s, quote=True)

# ------------------------------------------------------------------ content
SEO = {
 'en': {
  'title': 'SEO Agency for Fast, Findable Websites | Web Better',
  'desc': 'Technical SEO, content strategy and Core Web Vitals from Web Better (webbetter.ch): websites that Google and Bing understand instantly and rank for the questions your customers ask.',
  'crumb': 'SEO', 'kicker': 'SERVICES / SEO',
  'h1a': 'SEO that compounds.', 'h1b': 'Rankings that keep paying back.',
  'lead': 'Web Better builds websites that search engines understand instantly: fast, well structured and written for the questions your customers actually ask. Technical SEO, content and Core Web Vitals, engineered together from day one.',
  'cta1': 'Start your SEO project', 'cta2': 'Read the FAQ',
  'stats_label': '[ OUR STANDARD FOR EVERY PAGE ]',
  'stats': [('2.5', 's', 'Largest Contentful Paint, or faster'), ('0.1', '', 'Cumulative Layout Shift, or less'), ('200', 'ms', 'Interaction to Next Paint, or faster'), ('100', '%', 'of pages indexable, mapped and linked')],
  'pillars_label': '[ FOUR PILLARS ]', 'pillars_title': 'Everything search engines<br>need, nothing they don\'t.',
  'pillars': [
    ('Technical foundation', 'Crawlable architecture, clean URLs and a site that renders perfectly for search bots.', ['XML sitemaps and robots.txt', 'Canonical tags and hreflang', 'Redirect mapping without chains', 'Structured data (schema.org)']),
    ('Content and search intent', 'Pages built around what people search for, with one clear job each.', ['Keyword and intent mapping', 'Content briefs and copywriting', 'Internal linking structure', 'Titles and meta descriptions']),
    ('Authority and entities', 'Signals that tell Google who you are and why you can be trusted.', ['Organization and service schema', 'Consistent company profiles', 'Digital PR and mentions', 'Author and expertise signals']),
    ('Speed and experience', 'Fast pages rank better, convert better and cost less to advertise.', ['Core Web Vitals in the green', 'Image and font optimisation', 'Mobile-first rendering', 'Accessible, clean markup']),
  ],
  'steps_label': '[ HOW WE WORK ]', 'steps_title': 'Five steps from audit<br>to growth.',
  'steps': [
    ('Audit', 'We crawl your site, review Google Search Console and analytics, and benchmark the competitors that rank where you want to be.'),
    ('Strategy', 'A keyword and intent map, a target site architecture and a prioritised list of fixes, ranked by impact.'),
    ('Build and fix', 'Templates, structured data, redirects, internal links and performance, shipped in clean, tested releases.'),
    ('Content', 'Briefs and pages written for real questions, connected so every page supports the others.'),
    ('Measure and grow', 'Monthly reporting on rankings, clicks, conversions and Core Web Vitals, with the next improvements already planned.'),
  ],
  'checks_label': '[ INCLUDED IN EVERY SEO PROJECT ]', 'checks_title': 'The full technical checklist.',
  'checks': ['XML sitemap and robots.txt', 'Canonical URLs', 'hreflang for every language', 'Structured data (schema.org)', 'Core Web Vitals optimisation', 'Mobile-first rendering', 'Clean URL architecture', '301 redirect mapping', 'Internal linking', 'Image optimisation and alt text', 'Open Graph and social cards', 'Search Console and Bing Webmaster setup'],
  'proof_label': '[ PROOF, NOT PROMISES ]', 'proof_title': 'This website is our own case study.',
  'proof_text': 'Everything on this page applies to webbetter.ch itself: real language versions with hreflang, structured data on every page, a clean sitemap, a robots.txt that welcomes search engines and AI crawlers, and Core Web Vitals measured live in the footer.',
  'proof_links': [('/sitemap.xml', 'sitemap.xml'), ('/robots.txt', 'robots.txt'), ('/llms.txt', 'llms.txt')],
  'faq_label': '[ SEO QUESTIONS ]', 'faq_title': 'SEO, answered.',
  'cta_title': 'Ready to be found?', 'cta_text': 'Tell us where you want to rank. You get a clear plan and a fixed proposal.',
  'service': ('Search engine optimization', 'Technical SEO, content strategy, structured data and Core Web Vitals optimisation for websites in English and German.'),
 },
 'de': {
  'title': 'SEO-Agentur für schnelle, auffindbare Websites | Web Better',
  'desc': 'Technisches SEO, Content-Strategie und Core Web Vitals von Web Better (webbetter.ch): Websites, die Google und Bing sofort verstehen und für die Fragen Ihrer Kundschaft ranken.',
  'crumb': 'SEO', 'kicker': 'LEISTUNGEN / SEO',
  'h1a': 'SEO mit Zinseszins.', 'h1b': 'Rankings, die sich immer wieder auszahlen.',
  'lead': 'Web Better baut Websites, die Suchmaschinen sofort verstehen: schnell, sauber strukturiert und geschrieben für die Fragen, die Ihre Kundschaft wirklich stellt. Technisches SEO, Content und Core Web Vitals, vom ersten Tag an gemeinsam entwickelt.',
  'cta1': 'SEO-Projekt starten', 'cta2': 'Zu den FAQ',
  'stats_label': '[ UNSER STANDARD FÜR JEDE SEITE ]',
  'stats': [('2.5', 's', 'Largest Contentful Paint oder schneller'), ('0.1', '', 'Cumulative Layout Shift oder weniger'), ('200', 'ms', 'Interaction to Next Paint oder schneller'), ('100', '%', 'der Seiten indexierbar, erfasst und verlinkt')],
  'pillars_label': '[ VIER SÄULEN ]', 'pillars_title': 'Alles, was Suchmaschinen<br>brauchen, nichts darüber hinaus.',
  'pillars': [
    ('Technisches Fundament', 'Crawlbare Architektur, saubere URLs und eine Website, die für Suchbots perfekt rendert.', ['XML-Sitemaps und robots.txt', 'Canonical-Tags und hreflang', 'Weiterleitungen ohne Ketten', 'Strukturierte Daten (schema.org)']),
    ('Content und Suchintention', 'Seiten, die sich an echten Suchanfragen orientieren, jede mit einer klaren Aufgabe.', ['Keyword- und Intent-Mapping', 'Content-Briefings und Texte', 'Interne Verlinkung', 'Titel und Meta-Beschreibungen']),
    ('Autorität und Entitäten', 'Signale, die Google zeigen, wer Sie sind und warum man Ihnen vertrauen kann.', ['Organisations- und Service-Schema', 'Einheitliche Firmenprofile', 'Digitale PR und Erwähnungen', 'Autoren- und Expertise-Signale']),
    ('Geschwindigkeit und Erlebnis', 'Schnelle Seiten ranken besser, konvertieren besser und senken Werbekosten.', ['Core Web Vitals im grünen Bereich', 'Bild- und Schriftoptimierung', 'Mobile-first-Rendering', 'Barrierearmes, sauberes Markup']),
  ],
  'steps_label': '[ SO ARBEITEN WIR ]', 'steps_title': 'Fünf Schritte vom Audit<br>zum Wachstum.',
  'steps': [
    ('Audit', 'Wir crawlen Ihre Website, prüfen Google Search Console und Analytics und vergleichen die Mitbewerber, die dort ranken, wo Sie hinwollen.'),
    ('Strategie', 'Eine Keyword- und Intent-Map, eine Zielarchitektur der Website und eine priorisierte Liste von Massnahmen, geordnet nach Wirkung.'),
    ('Umsetzen und korrigieren', 'Templates, strukturierte Daten, Weiterleitungen, interne Links und Performance, in sauberen, getesteten Releases.'),
    ('Content', 'Briefings und Seiten für echte Fragen, so verknüpft, dass jede Seite die anderen stärkt.'),
    ('Messen und wachsen', 'Monatliche Berichte zu Rankings, Klicks, Conversions und Core Web Vitals, mit den nächsten Verbesserungen bereits geplant.'),
  ],
  'checks_label': '[ IN JEDEM SEO-PROJEKT ENTHALTEN ]', 'checks_title': 'Die komplette technische Checkliste.',
  'checks': ['XML-Sitemap und robots.txt', 'Canonical-URLs', 'hreflang für jede Sprache', 'Strukturierte Daten (schema.org)', 'Optimierung der Core Web Vitals', 'Mobile-first-Rendering', 'Saubere URL-Architektur', '301-Weiterleitungsplan', 'Interne Verlinkung', 'Bildoptimierung und Alt-Texte', 'Open Graph und Social Cards', 'Einrichtung von Search Console und Bing Webmaster'],
  'proof_label': '[ BEWEISE STATT VERSPRECHEN ]', 'proof_title': 'Diese Website ist unsere eigene Fallstudie.',
  'proof_text': 'Alles auf dieser Seite gilt auch für webbetter.ch selbst: echte Sprachversionen mit hreflang, strukturierte Daten auf jeder Seite, eine saubere Sitemap, eine robots.txt, die Suchmaschinen und KI-Crawler willkommen heisst, und Core Web Vitals, live im Footer gemessen.',
  'proof_links': [('/sitemap.xml', 'sitemap.xml'), ('/robots.txt', 'robots.txt'), ('/llms.txt', 'llms.txt')],
  'faq_label': '[ FRAGEN ZU SEO ]', 'faq_title': 'SEO, beantwortet.',
  'cta_title': 'Bereit, gefunden zu werden?', 'cta_text': 'Sagen Sie uns, wo Sie ranken wollen. Sie erhalten einen klaren Plan und ein verbindliches Angebot.',
  'service': ('Suchmaschinenoptimierung', 'Technisches SEO, Content-Strategie, strukturierte Daten und Optimierung der Core Web Vitals für Websites auf Deutsch und Englisch.'),
 },
}

GEO = {
 'en': {
  'title': 'GEO Agency: Get Cited in ChatGPT, Perplexity & Gemini | Web Better',
  'desc': 'Generative engine optimization (GEO) from Web Better (webbetter.ch): make your brand easy for ChatGPT, Perplexity, Gemini, Google AI Overviews, Copilot and Claude to find, trust and cite.',
  'crumb': 'GEO', 'kicker': 'SERVICES / GEO',
  'h1a': 'Be the answer AI gives.', 'h1b': 'Generative engine optimization for the AI search era.',
  'lead': 'Your customers now ask ChatGPT, Perplexity, Gemini and Copilot before they ever see a list of links. GEO makes your brand the source those assistants read, trust and quote, so you are named inside the answer.',
  'cta1': 'Start your GEO project', 'cta2': 'Read the FAQ',
  'flow_label': '[ HOW AI SEARCH PICKS ITS SOURCES ]', 'flow_title': 'From question to citation<br>in four steps.',
  'flow': [
    ('Question', 'A customer asks an assistant in plain language, often a long, specific question.'),
    ('Retrieval', 'The assistant searches its index or the live web and gathers candidate pages.'),
    ('Evaluation', 'It favours sources that are clear, factual, consistent and trusted across the web.'),
    ('Answer and citation', 'It writes the answer and cites the sources it relied on. That is where you want to be.'),
  ],
  'pillars_label': '[ WHAT WE OPTIMISE ]', 'pillars_title': 'Five levers that decide<br>who gets cited.',
  'pillars': [
    ('Entity clarity', 'Who you are, what you do and where, stated the same way everywhere.', ['Organization and service schema', 'Consistent names and descriptions', 'Clear about and service pages']),
    ('Citable facts', 'Content written as precise, quotable answers to real questions.', ['Question-led page structure', 'Definitions, numbers and comparisons', 'FAQ content with markup']),
    ('Structured data and llms.txt', 'Machine-readable layers that tell language models what matters.', ['schema.org across the site', 'llms.txt and llms-full.txt', 'Sitemaps with language versions']),
    ('Authority and mentions', 'Assistants trust what the wider web agrees on.', ['Consistent company profiles', 'Mentions on relevant sites', 'Reviews and case studies']),
    ('Open to AI crawlers', 'If the bots cannot read you, they cannot cite you.', ['robots.txt welcoming AI crawlers', 'Fast, server-rendered content', 'Bing and Google indexing']),
  ],
  'engines_label': '[ WHERE YOUR CUSTOMERS ASK ]', 'engines_title': 'Optimised for every major AI assistant.',
  'engines': [
    ('ChatGPT', 'Search answers draw on OpenAI\'s own crawler and web search partners, including Bing.'),
    ('Perplexity', 'Runs its own crawler and live web search, and shows its sources with every answer.'),
    ('Gemini and AI Overviews', 'Built on Google\'s index, so classic SEO and GEO work hand in hand.'),
    ('Microsoft Copilot', 'Grounded in the Bing index, which makes Bing Webmaster Tools essential.'),
    ('Claude', 'Can search the web and read pages through Anthropic\'s crawlers.'),
  ],
  'compare_label': '[ GEO VS SEO ]', 'compare_title': 'Two disciplines, one foundation.',
  'compare_head': ('', 'SEO', 'GEO'),
  'compare': [('Goal', 'A high ranking in a list of links', 'A mention inside the answer itself'),
              ('Audience', 'Search engine algorithms', 'Language models and AI assistants'),
              ('Content', 'Keywords and search intent', 'Facts, entities and quotable answers'),
              ('Success metric', 'Rankings, clicks, conversions', 'Citations, mentions, referred visits'),
              ('Foundation', 'Fast, structured, crawlable site', 'The same, plus llms.txt and AI crawler access')],
  'steps_label': '[ HOW WE WORK ]', 'steps_title': 'Our GEO programme.',
  'steps': [
    ('Visibility audit', 'We ask the questions your customers ask across ChatGPT, Perplexity, Gemini, Copilot and Claude, and record who gets cited today.'),
    ('Entity and content fixes', 'We sharpen how your brand, services and facts are described, and restructure pages into clear, citable answers.'),
    ('Technical layer', 'Structured data, llms.txt, AI crawler access, sitemaps and indexing in both Google and Bing.'),
    ('Authority', 'Consistent profiles and relevant mentions, so the wider web confirms what your site says.'),
    ('Monitor monthly', 'We repeat the questions every month and report citations, mentions and the traffic they send.'),
  ],
  'faq_label': '[ GEO QUESTIONS ]', 'faq_title': 'GEO, answered.',
  'cta_title': 'Ready to be the answer?', 'cta_text': 'Tell us the questions your customers ask. We show you who gets cited today, and how to make it you.',
  'service': ('Generative engine optimization (GEO)', 'Visibility and citations for brands in AI assistants including ChatGPT, Perplexity, Google Gemini and AI Overviews, Microsoft Copilot and Claude.'),
 },
 'de': {
  'title': 'GEO-Agentur: Zitiert in ChatGPT, Perplexity & Gemini | Web Better',
  'desc': 'Generative Engine Optimization (GEO) von Web Better (webbetter.ch): Ihre Marke wird für ChatGPT, Perplexity, Gemini, Google AI Overviews, Copilot und Claude leicht auffindbar, vertrauenswürdig und zitierbar.',
  'crumb': 'GEO', 'kicker': 'LEISTUNGEN / GEO',
  'h1a': 'Die Antwort, die KI gibt.', 'h1b': 'Generative Engine Optimization für die Ära der KI-Suche.',
  'lead': 'Ihre Kundschaft fragt heute ChatGPT, Perplexity, Gemini und Copilot, bevor sie überhaupt eine Liste von Links sieht. GEO macht Ihre Marke zur Quelle, die diese Assistenten lesen, der sie vertrauen und die sie zitieren, damit Sie in der Antwort genannt werden.',
  'cta1': 'GEO-Projekt starten', 'cta2': 'Zu den FAQ',
  'flow_label': '[ WIE KI-SUCHE IHRE QUELLEN WÄHLT ]', 'flow_title': 'Von der Frage zum Zitat<br>in vier Schritten.',
  'flow': [
    ('Frage', 'Eine Kundin fragt einen Assistenten in natürlicher Sprache, oft lang und sehr konkret.'),
    ('Recherche', 'Der Assistent durchsucht seinen Index oder das Live-Web und sammelt passende Seiten.'),
    ('Bewertung', 'Er bevorzugt Quellen, die klar, faktenbasiert, konsistent und im Web anerkannt sind.'),
    ('Antwort und Zitat', 'Er formuliert die Antwort und nennt die Quellen, auf die er sich stützt. Genau dort wollen Sie stehen.'),
  ],
  'pillars_label': '[ WAS WIR OPTIMIEREN ]', 'pillars_title': 'Fünf Hebel, die entscheiden,<br>wer zitiert wird.',
  'pillars': [
    ('Klare Entitäten', 'Wer Sie sind, was Sie tun und wo, überall gleich beschrieben.', ['Organisations- und Service-Schema', 'Einheitliche Namen und Beschreibungen', 'Klare Über-uns- und Leistungsseiten']),
    ('Zitierfähige Fakten', 'Inhalte als präzise, zitierbare Antworten auf echte Fragen.', ['Fragengeleitete Seitenstruktur', 'Definitionen, Zahlen und Vergleiche', 'FAQ-Inhalte mit Markup']),
    ('Strukturierte Daten und llms.txt', 'Maschinenlesbare Ebenen, die Sprachmodellen zeigen, was wichtig ist.', ['schema.org auf der ganzen Website', 'llms.txt und llms-full.txt', 'Sitemaps mit Sprachversionen']),
    ('Autorität und Erwähnungen', 'Assistenten vertrauen dem, worin sich das Web einig ist.', ['Einheitliche Firmenprofile', 'Erwähnungen auf relevanten Websites', 'Bewertungen und Fallstudien']),
    ('Offen für KI-Crawler', 'Wenn Bots Sie nicht lesen können, können sie Sie nicht zitieren.', ['robots.txt, die KI-Crawler zulässt', 'Schnelle, serverseitig gerenderte Inhalte', 'Indexierung bei Bing und Google']),
  ],
  'engines_label': '[ WO IHRE KUNDSCHAFT FRAGT ]', 'engines_title': 'Optimiert für alle grossen KI-Assistenten.',
  'engines': [
    ('ChatGPT', 'Suchantworten stützen sich auf den eigenen Crawler von OpenAI und Suchpartner, darunter Bing.'),
    ('Perplexity', 'Nutzt einen eigenen Crawler und Live-Websuche und zeigt zu jeder Antwort die Quellen.'),
    ('Gemini und AI Overviews', 'Basieren auf dem Google-Index, deshalb wirken klassisches SEO und GEO zusammen.'),
    ('Microsoft Copilot', 'Stützt sich auf den Bing-Index, deshalb sind die Bing Webmaster Tools unverzichtbar.'),
    ('Claude', 'Kann im Web suchen und Seiten über die Crawler von Anthropic lesen.'),
  ],
  'compare_label': '[ GEO VS. SEO ]', 'compare_title': 'Zwei Disziplinen, ein Fundament.',
  'compare_head': ('', 'SEO', 'GEO'),
  'compare': [('Ziel', 'Ein hohes Ranking in einer Liste von Links', 'Eine Nennung direkt in der Antwort'),
              ('Publikum', 'Algorithmen von Suchmaschinen', 'Sprachmodelle und KI-Assistenten'),
              ('Inhalte', 'Keywords und Suchintention', 'Fakten, Entitäten und zitierbare Antworten'),
              ('Erfolgsmass', 'Rankings, Klicks, Conversions', 'Zitate, Erwähnungen, vermittelte Besuche'),
              ('Fundament', 'Schnelle, strukturierte, crawlbare Website', 'Dasselbe, plus llms.txt und Zugang für KI-Crawler')],
  'steps_label': '[ SO ARBEITEN WIR ]', 'steps_title': 'Unser GEO-Programm.',
  'steps': [
    ('Sichtbarkeits-Audit', 'Wir stellen die Fragen Ihrer Kundschaft in ChatGPT, Perplexity, Gemini, Copilot und Claude und halten fest, wer heute zitiert wird.'),
    ('Entitäten und Inhalte', 'Wir schärfen, wie Ihre Marke, Leistungen und Fakten beschrieben werden, und strukturieren Seiten zu klaren, zitierbaren Antworten.'),
    ('Technische Ebene', 'Strukturierte Daten, llms.txt, Zugang für KI-Crawler, Sitemaps und Indexierung bei Google und Bing.'),
    ('Autorität', 'Einheitliche Profile und relevante Erwähnungen, damit das Web bestätigt, was Ihre Website sagt.'),
    ('Monatliches Monitoring', 'Wir stellen die Fragen jeden Monat erneut und berichten über Zitate, Erwähnungen und den Traffic, den sie bringen.'),
  ],
  'faq_label': '[ FRAGEN ZU GEO ]', 'faq_title': 'GEO, beantwortet.',
  'cta_title': 'Bereit, die Antwort zu sein?', 'cta_text': 'Nennen Sie uns die Fragen Ihrer Kundschaft. Wir zeigen Ihnen, wer heute zitiert wird und wie Sie es werden.',
  'service': ('Generative Engine Optimization (GEO)', 'Sichtbarkeit und Zitate für Marken in KI-Assistenten wie ChatGPT, Perplexity, Google Gemini und AI Overviews, Microsoft Copilot und Claude.'),
 },
}

FAQP = {
 'en': {
  'title': 'FAQ: Web Design, SEO, GEO & Website Projects | Web Better',
  'desc': 'Answers to the most common questions about websites, apps, costs, timelines, SEO and GEO (generative engine optimization) from Web Better, webbetter.ch.',
  'crumb': 'FAQ', 'kicker': 'FAQ',
  'h1a': 'Questions, answered.', 'h1b': 'Everything about websites, SEO and GEO.',
  'lead': 'Straight answers on costs, timelines, technology, search engine optimization and visibility in AI assistants. Can\'t find yours? Write to beratung@webbetter.ch.',
  'cta1': 'Ask your question',
  'search': 'Search the questions', 'all': 'All', 'empty': 'No matching question. Write to beratung@webbetter.ch and we will answer it.',
  'cats': {'general': 'About Web Better', 'projects': 'Projects and pricing', 'build': 'Design and development', 'seo': 'SEO', 'geo': 'GEO and AI search', 'perf': 'Website optimisation'},
  'cta_title': 'Still have a question?', 'cta_text': 'Write to us. You get a clear, personal answer.',
 },
 'de': {
  'title': 'FAQ: Webdesign, SEO, GEO & Website-Projekte | Web Better',
  'desc': 'Antworten auf die häufigsten Fragen zu Websites, Apps, Kosten, Zeitplänen, SEO und GEO (Generative Engine Optimization) von Web Better, webbetter.ch.',
  'crumb': 'FAQ', 'kicker': 'FAQ',
  'h1a': 'Fragen, beantwortet.', 'h1b': 'Alles zu Websites, SEO und GEO.',
  'lead': 'Klare Antworten zu Kosten, Zeitplänen, Technologie, Suchmaschinenoptimierung und Sichtbarkeit in KI-Assistenten. Ihre Frage ist nicht dabei? Schreiben Sie an beratung@webbetter.ch.',
  'cta1': 'Ihre Frage stellen',
  'search': 'Fragen durchsuchen', 'all': 'Alle', 'empty': 'Keine passende Frage. Schreiben Sie an beratung@webbetter.ch, wir beantworten sie gerne.',
  'cats': {'general': 'Über Web Better', 'projects': 'Projekte und Preise', 'build': 'Design und Entwicklung', 'seo': 'SEO', 'geo': 'GEO und KI-Suche', 'perf': 'Website-Optimierung'},
  'cta_title': 'Noch eine Frage?', 'cta_text': 'Schreiben Sie uns. Sie erhalten eine klare, persönliche Antwort.',
 },
}


# ------------------------------------------------------------------ combined SEO & GEO page
SEOGEO = {
 'en': {
  'title': 'SEO & GEO Agency: Rank on Google and in AI | Web Better',
  'desc': 'SEO and GEO from Web Better (webbetter.ch): technical SEO, content and Core Web Vitals for Google and Bing, plus generative engine optimization so ChatGPT, Perplexity, Gemini, AI Overviews, Copilot and Claude cite your brand.',
  'crumb': 'SEO & GEO', 'kicker': 'SERVICES / SEO & GEO',
  'h1a': 'Found in search. Cited by AI.', 'h1b': 'SEO and GEO, engineered as one system.',
  'lead': 'Your customers search on Google and ask ChatGPT, Perplexity, Gemini and Copilot. Web Better builds the fast, structured, factual foundation that ranks in classic search and gets your brand named inside AI answers.',
  'cta1': 'Start your SEO & GEO project', 'cta2': 'Read the FAQ',
  'split_label': '[ TWO DISCIPLINES ]', 'split_title': 'Rankings and citations,<br>from one foundation.',
  'seo_label': '[ SEO: FOUR PILLARS ]', 'seo_title': 'Everything search engines<br>need to rank you.',
  'geo_label': '[ GEO: FIVE LEVERS ]', 'geo_title': 'Everything AI assistants<br>need to cite you.',
  'steps_label': '[ HOW WE WORK ]', 'steps_title': 'One programme for<br>search and AI.',
  'steps': [
    ('Audit', 'We crawl your site, review Search Console and analytics, benchmark competitors, and ask ChatGPT, Perplexity, Gemini, Copilot and Claude the questions your customers ask to see who gets cited today.'),
    ('Strategy', 'A keyword, intent and question map, a target site architecture and a prioritised plan for SEO and GEO, ranked by impact.'),
    ('Build and fix', 'Templates, structured data, llms.txt, redirects, internal links, AI crawler access and Core Web Vitals, shipped in tested releases.'),
    ('Content and authority', 'Pages written as clear, citable answers to real questions, consistent company profiles and relevant mentions across the web.'),
    ('Measure and grow', 'Monthly reporting on rankings, clicks, conversions, Core Web Vitals and AI citations, with the next improvements already planned.'),
  ],
  'faq_label': '[ SEO & GEO QUESTIONS ]', 'faq_title': 'SEO and GEO, answered.',
  'cta_title': 'Ready to be found and cited?', 'cta_text': 'Tell us where you want to rank and which questions your customers ask. You get a clear plan and a fixed proposal.',
 },
 'de': {
  'title': 'SEO- & GEO-Agentur: Google-Ranking und KI-Zitate | Web Better',
  'desc': 'SEO und GEO von Web Better (webbetter.ch): technisches SEO, Content und Core Web Vitals für Google und Bing, dazu Generative Engine Optimization, damit ChatGPT, Perplexity, Gemini, AI Overviews, Copilot und Claude Ihre Marke zitieren.',
  'crumb': 'SEO & GEO', 'kicker': 'LEISTUNGEN / SEO & GEO',
  'h1a': 'Gefunden in der Suche. Zitiert von KI.', 'h1b': 'SEO und GEO, als ein System entwickelt.',
  'lead': 'Ihre Kundschaft sucht bei Google und fragt ChatGPT, Perplexity, Gemini und Copilot. Web Better baut das schnelle, strukturierte und faktenbasierte Fundament, das in der klassischen Suche rankt und Ihre Marke in KI-Antworten nennen lässt.',
  'cta1': 'SEO- & GEO-Projekt starten', 'cta2': 'Zu den FAQ',
  'split_label': '[ ZWEI DISZIPLINEN ]', 'split_title': 'Rankings und Zitate,<br>aus einem Fundament.',
  'seo_label': '[ SEO: VIER SÄULEN ]', 'seo_title': 'Alles, was Suchmaschinen<br>brauchen, um Sie zu ranken.',
  'geo_label': '[ GEO: FÜNF HEBEL ]', 'geo_title': 'Alles, was KI-Assistenten<br>brauchen, um Sie zu zitieren.',
  'steps_label': '[ SO ARBEITEN WIR ]', 'steps_title': 'Ein Programm für<br>Suche und KI.',
  'steps': [
    ('Audit', 'Wir crawlen Ihre Website, prüfen Search Console und Analytics, vergleichen Mitbewerber und stellen ChatGPT, Perplexity, Gemini, Copilot und Claude die Fragen Ihrer Kundschaft, um zu sehen, wer heute zitiert wird.'),
    ('Strategie', 'Eine Keyword-, Intent- und Fragen-Map, eine Zielarchitektur der Website und ein priorisierter Plan für SEO und GEO, geordnet nach Wirkung.'),
    ('Umsetzen und korrigieren', 'Templates, strukturierte Daten, llms.txt, Weiterleitungen, interne Links, Zugang für KI-Crawler und Core Web Vitals, in getesteten Releases.'),
    ('Content und Autorität', 'Seiten als klare, zitierbare Antworten auf echte Fragen, einheitliche Firmenprofile und relevante Erwähnungen im Web.'),
    ('Messen und wachsen', 'Monatliche Berichte zu Rankings, Klicks, Conversions, Core Web Vitals und KI-Zitaten, mit den nächsten Verbesserungen bereits geplant.'),
  ],
  'faq_label': '[ FRAGEN ZU SEO & GEO ]', 'faq_title': 'SEO und GEO, beantwortet.',
  'cta_title': 'Bereit, gefunden und zitiert zu werden?', 'cta_text': 'Sagen Sie uns, wo Sie ranken wollen und welche Fragen Ihre Kundschaft stellt. Sie erhalten einen klaren Plan und ein verbindliches Angebot.',
 },
}

# ------------------------------------------------------------------ web & app development page
DEV = {
 'en': {
  'title': 'Web & App Development: Websites, iOS & Android | Web Better',
  'desc': 'Web and app development from Web Better (webbetter.ch): fast websites, web apps, iOS and Android apps, e-commerce and headless CMS, designed, engineered and launched with SEO, accessibility and Core Web Vitals built in.',
  'crumb': 'Web & App Development', 'kicker': 'SERVICES / WEB & APP DEVELOPMENT',
  'h1a': 'Websites and apps that perform.', 'h1b': 'Designed, engineered and launched by one team.',
  'lead': 'From a fast marketing site to a full web app or a mobile app on iOS and Android, Web Better designs and builds digital products that load instantly, rank well, convert visitors and are easy for your team to run.',
  'cta1': 'Start your project', 'cta2': 'Read the FAQ',
  'stats_label': '[ BUILT INTO EVERY PROJECT ]',
  'stats': [('2.5', 's', 'Largest Contentful Paint, or faster'), ('100', '%', 'responsive on phones, tablets and desktops'), ('2', '', 'languages supported out of the box, EN and DE'), ('24', '/7', 'global hosting with automatic scaling')],
  'morph_label': '[ ONE PRODUCT, EVERY SCREEN ]', 'morph_title': 'One design system.<br>Every screen.',
  'morph': [('01 · DESKTOP', 'Websites', 'Wide layouts with room to tell your story, built on one design system.'),
            ('02 · TABLET', 'Web apps', 'Dashboards and portals that adapt to touch without losing detail.'),
            ('03 · MOBILE', 'iOS & Android', 'Apps that feel native, from one codebase, ready for both stores.'),
            ('04 · BACKEND', 'APIs & data', 'Secure APIs, integrations and real-time data behind every screen.')],
  'pillars_label': '[ WHAT WE BUILD ]', 'pillars_title': 'From first click<br>to daily use.',
  'pillars': [
    ('Websites', 'Fast, beautiful marketing sites and corporate websites that rank and convert.', ['Design system and UI', 'Multilingual with hreflang', 'Headless CMS for your team', 'SEO and GEO foundation']),
    ('Web apps', 'Portals, dashboards and SaaS products that feel as fast as native software.', ['Accounts, roles and permissions', 'APIs and integrations', 'Real-time data and dashboards', 'Secure, scalable backends']),
    ('Mobile apps', 'iOS and Android apps with the polish people expect from top brands.', ['iOS and Android from one codebase', 'Native features and offline mode', 'App Store and Play Store release', 'Analytics and crash reporting']),
    ('E-commerce', 'Shops that load fast, rank well and make checkout effortless.', ['Shopify or headless commerce', 'Payments, shipping and tax', 'Product pages that rank', 'Inventory and ERP integrations']),
    ('Care and growth', 'We stay on after launch so your product keeps getting better.', ['Updates and security patches', 'Monitoring and backups', 'Performance and SEO checks', 'New features in sprints']),
  ],
  'stack_label': '[ TECHNOLOGY ]', 'stack_title': 'Modern, proven technology.',
  'stack': [('Frontend', 'Next.js, React, Astro, TypeScript'), ('Mobile', 'React Native, Swift, Kotlin'), ('Content', 'Sanity, Storyblok, WordPress (headless)'), ('Commerce', 'Shopify, Stripe, headless checkouts'), ('Backend', 'Node.js, PostgreSQL, serverless APIs'), ('Hosting', 'Vercel, global edge network, CI/CD')],
  'steps_label': '[ HOW WE WORK ]', 'steps_title': 'From idea to launch<br>in five steps.',
  'steps': [
    ('Discovery', 'Goals, users and requirements, turned into a clear scope, timeline and fixed proposal.'),
    ('UX and design', 'User flows, wireframes and a design system, tested in clickable prototypes before a line of code.'),
    ('Build', 'Engineering in short sprints with weekly previews, so you see progress and steer early.'),
    ('Launch', 'Quality checks for speed, accessibility, SEO and security, then a smooth go-live with redirects in place.'),
    ('Care', 'Monitoring, updates and continuous improvement, with your team trained to run the product.'),
  ],
  'checks_label': '[ INCLUDED IN EVERY BUILD ]', 'checks_title': 'Quality, built in from day one.',
  'checks': ['Responsive, mobile-first design', 'Accessibility to WCAG guidelines', 'Core Web Vitals in the green', 'SEO and structured data', 'Multilingual setup', 'Privacy-first, consent-ready', 'Security headers and HTTPS', 'CMS your team can edit', 'Analytics and conversion tracking', 'Automated deployments', 'Documentation and training', 'Launch support and handover'],
  'faq_label': '[ DEVELOPMENT QUESTIONS ]', 'faq_title': 'Web and app development, answered.',
  'cta_title': 'Ready to build?', 'cta_text': 'Tell us what you want to create. You get a clear scope, a timeline and a fixed proposal.',
  'service': ('Web and app development', 'Design and development of websites, web apps, iOS and Android apps and e-commerce, with SEO, accessibility and performance built in.'),
 },
 'de': {
  'title': 'Web- & App-Entwicklung: Websites, iOS, Android | Web Better',
  'desc': 'Web- und App-Entwicklung von Web Better (webbetter.ch): schnelle Websites, Web-Apps, iOS- und Android-Apps, E-Commerce und Headless CMS, gestaltet, entwickelt und lanciert mit SEO, Barrierefreiheit und Core Web Vitals.',
  'crumb': 'Web- & App-Entwicklung', 'kicker': 'LEISTUNGEN / WEB- & APP-ENTWICKLUNG',
  'h1a': 'Websites und Apps, die überzeugen.', 'h1b': 'Gestaltet, entwickelt und lanciert von einem Team.',
  'lead': 'Von der schnellen Marketing-Website bis zur kompletten Web-App oder Mobile-App für iOS und Android: Web Better gestaltet und entwickelt digitale Produkte, die sofort laden, gut ranken, Besucher überzeugen und für Ihr Team einfach zu betreiben sind.',
  'cta1': 'Projekt starten', 'cta2': 'Zu den FAQ',
  'stats_label': '[ IN JEDEM PROJEKT ENTHALTEN ]',
  'stats': [('2.5', 's', 'Largest Contentful Paint oder schneller'), ('100', '%', 'responsiv auf Smartphone, Tablet und Desktop'), ('2', '', 'Sprachen ab Start, Deutsch und Englisch'), ('24', '/7', 'globales Hosting mit automatischer Skalierung')],
  'morph_label': '[ EIN PRODUKT, JEDER BILDSCHIRM ]', 'morph_title': 'Ein Designsystem.<br>Jeder Bildschirm.',
  'morph': [('01 · DESKTOP', 'Websites', 'Grosszügige Layouts mit Raum für Ihre Geschichte, gebaut auf einem Designsystem.'),
            ('02 · TABLET', 'Web-Apps', 'Dashboards und Portale, die sich an Touch anpassen, ohne an Übersicht zu verlieren.'),
            ('03 · MOBILE', 'iOS & Android', 'Apps mit nativem Gefühl aus einer Codebasis, bereit für beide Stores.'),
            ('04 · BACKEND', 'APIs & Daten', 'Sichere APIs, Integrationen und Echtzeitdaten hinter jedem Bildschirm.')],
  'pillars_label': '[ WAS WIR BAUEN ]', 'pillars_title': 'Vom ersten Klick<br>bis zur täglichen Nutzung.',
  'pillars': [
    ('Websites', 'Schnelle, schöne Marketing- und Unternehmenswebsites, die ranken und überzeugen.', ['Designsystem und UI', 'Mehrsprachig mit hreflang', 'Headless CMS für Ihr Team', 'SEO- und GEO-Fundament']),
    ('Web-Apps', 'Portale, Dashboards und SaaS-Produkte, die sich so schnell anfühlen wie native Software.', ['Konten, Rollen und Rechte', 'APIs und Integrationen', 'Echtzeitdaten und Dashboards', 'Sichere, skalierbare Backends']),
    ('Mobile Apps', 'iOS- und Android-Apps mit dem Schliff, den man von Top-Marken erwartet.', ['iOS und Android aus einer Codebasis', 'Native Funktionen und Offline-Modus', 'Veröffentlichung im App Store und Play Store', 'Analytics und Absturzberichte']),
    ('E-Commerce', 'Shops, die schnell laden, gut ranken und den Checkout mühelos machen.', ['Shopify oder Headless Commerce', 'Zahlung, Versand und Steuern', 'Produktseiten, die ranken', 'Lager- und ERP-Integrationen']),
    ('Betreuung und Wachstum', 'Wir bleiben nach dem Launch dabei, damit Ihr Produkt immer besser wird.', ['Updates und Sicherheitspatches', 'Monitoring und Backups', 'Performance- und SEO-Checks', 'Neue Funktionen in Sprints']),
  ],
  'stack_label': '[ TECHNOLOGIE ]', 'stack_title': 'Moderne, bewährte Technologie.',
  'stack': [('Frontend', 'Next.js, React, Astro, TypeScript'), ('Mobile', 'React Native, Swift, Kotlin'), ('Content', 'Sanity, Storyblok, WordPress (headless)'), ('Commerce', 'Shopify, Stripe, Headless Checkouts'), ('Backend', 'Node.js, PostgreSQL, Serverless-APIs'), ('Hosting', 'Vercel, globales Edge-Netzwerk, CI/CD')],
  'steps_label': '[ SO ARBEITEN WIR ]', 'steps_title': 'Von der Idee zum Launch<br>in fünf Schritten.',
  'steps': [
    ('Discovery', 'Ziele, Nutzer und Anforderungen, übersetzt in einen klaren Umfang, Zeitplan und ein verbindliches Angebot.'),
    ('UX und Design', 'User Flows, Wireframes und ein Designsystem, getestet in klickbaren Prototypen, bevor eine Zeile Code entsteht.'),
    ('Entwicklung', 'Entwicklung in kurzen Sprints mit wöchentlichen Vorschauen, damit Sie den Fortschritt sehen und früh steuern.'),
    ('Launch', 'Qualitätschecks für Geschwindigkeit, Barrierefreiheit, SEO und Sicherheit, dann ein reibungsloser Go-live mit Weiterleitungen.'),
    ('Betreuung', 'Monitoring, Updates und kontinuierliche Verbesserung, und Ihr Team ist geschult, das Produkt zu betreiben.'),
  ],
  'checks_label': '[ IN JEDEM PROJEKT ENTHALTEN ]', 'checks_title': 'Qualität, vom ersten Tag an eingebaut.',
  'checks': ['Responsives Mobile-first-Design', 'Barrierefreiheit nach WCAG', 'Core Web Vitals im grünen Bereich', 'SEO und strukturierte Daten', 'Mehrsprachiges Setup', 'Datenschutzfreundlich, Consent-ready', 'Sicherheits-Header und HTTPS', 'CMS, das Ihr Team pflegen kann', 'Analytics und Conversion-Tracking', 'Automatisierte Deployments', 'Dokumentation und Schulung', 'Launch-Support und Übergabe'],
  'faq_label': '[ FRAGEN ZUR ENTWICKLUNG ]', 'faq_title': 'Web- und App-Entwicklung, beantwortet.',
  'cta_title': 'Bereit loszulegen?', 'cta_text': 'Erzählen Sie uns, was Sie bauen möchten. Sie erhalten einen klaren Umfang, einen Zeitplan und ein verbindliches Angebot.',
  'service': ('Web- und App-Entwicklung', 'Gestaltung und Entwicklung von Websites, Web-Apps, iOS- und Android-Apps und E-Commerce, mit SEO, Barrierefreiheit und Performance.'),
 },
}

UI = {
 'en': {'home': 'Home', 'services': 'Services', 'mail': 'beratung@webbetter.ch', 'scroll': 'SCROLL'},
 'de': {'home': 'Startseite', 'services': 'Leistungen', 'mail': 'beratung@webbetter.ch', 'scroll': 'SCROLLEN'},
}


# ------------------------------------------------------------------ privacy policy (Swiss FADP / EU GDPR)
COMPANY_ADDRESS = ''   # e.g. 'Musterstrasse 1, 8000 Zürich, Switzerland'. Fill in before launch.
PRIVACY = {
 'en': {
  'title': 'Privacy Policy | Web Better by WB Solutions',
  'desc': 'How WB Solutions, the company behind Web Better (webbetter.ch), processes personal data under the Swiss Federal Act on Data Protection (FADP) and the EU GDPR.',
  'crumb': 'Privacy policy', 'kicker': 'LEGAL', 'h1a': 'Privacy policy.', 'h1b': 'Clear, short and in line with Swiss and EU law.',
  'lead': 'This policy explains which personal data WB Solutions processes when you visit webbetter.ch, contact us or apply for a job, and which rights you have.',
  'updated': 'Last updated: 16 October 2026',
  'sections': [
   ('1. Who is responsible', '<p class="pv-box"><b>WB Solutions</b>{ADDR}<br>Web Better is a brand of WB Solutions.<br>Email: <a href="mailto:beratung@webbetter.ch">beratung@webbetter.ch</a></p><p>WB Solutions is the controller for the processing of personal data on this website. For any privacy question, write to the address above.</p>'),
   ('2. Legal framework', '<p>We process personal data in accordance with the Swiss Federal Act on Data Protection (FADP, revised DSG) and, where it applies to visitors from the European Union and the EEA, including Germany and Austria, the General Data Protection Regulation (GDPR). Depending on the purpose, we rely on your consent (Art. 6(1)(a) GDPR), the performance or preparation of a contract (Art. 6(1)(b) GDPR), legal obligations (Art. 6(1)(c) GDPR) or our legitimate interests (Art. 6(1)(f) GDPR).</p>'),
   ('3. Hosting and server logs', '<p>This website is hosted by Vercel Inc. (USA). When you visit it, technical data is processed automatically: IP address, date and time, the page requested, referrer, browser and operating system. We need this data to deliver the website securely and to detect misuse (legitimate interest). Log data is kept only for a short period. Data transferred to the USA is protected by the EU-U.S. and Swiss-U.S. Data Privacy Framework or by standard contractual clauses.</p>'),
   ('4. Contact and project enquiries', '<p>When you use the enquiry form or write to us by email, we process the details you provide, such as name, company, email, phone, budget and message, to answer your enquiry and prepare a proposal (contract preparation and legitimate interest). Form messages are delivered to us through the email service Resend (USA). We keep enquiries as long as needed to handle them and as required by statutory retention periods.</p>'),
   ('5. Job applications', '<p>When you apply through the careers form, we process your name, email, role, portfolio link, message and CV only to assess your application. Applications are deleted no later than six months after the application process ends, unless you agree that we keep them for future openings.</p>'),
   ('6. Cookies and local storage', '<p>We only use storage that is necessary for this website to work. It is kept in your browser\'s local storage, not in tracking cookies:</p><ul><li><b>wb-consent</b>: your privacy choice</li><li><b>webbetter-lang</b>: your language</li><li><b>webbetter-theme</b>: light or dark display</li></ul><p>We currently use no analytics or marketing cookies. If we add them, they will only run after you have agreed in the consent banner. You can change your choice at any time under <a href="#" data-cookie-settings>Cookie settings</a>.</p>'),
   ('7. External services', '<p>To display this website consistently, fonts are loaded from Google Fonts (Google Ireland Ltd. and Google LLC) and a script library from the jsDelivr network. Your browser connects to these servers, which transmits your IP address. We use these services in our legitimate interest in a fast and uniform presentation. Images, logos and paintings are stored on our own server.</p>'),
   ('8. Your rights', '<p>You have the right to access, correct and delete your personal data, to restrict or object to its processing, to data portability and to withdraw consent at any time with effect for the future. To exercise your rights, write to <a href="mailto:beratung@webbetter.ch">beratung@webbetter.ch</a>. You may also lodge a complaint with the Swiss Federal Data Protection and Information Commissioner (FDPIC) or, in the EU, with the supervisory authority of your country.</p>'),
   ('9. Security', '<p>This website is delivered exclusively over an encrypted connection (HTTPS/TLS). We use technical and organisational measures to protect your data against loss and unauthorised access.</p>'),
   ('10. Changes', '<p>We may update this policy when our services or the law change. The current version is always available on this page.</p>'),
  ],
 },
 'de': {
  'title': 'Datenschutzerklärung | Web Better von WB Solutions',
  'desc': 'Wie WB Solutions, das Unternehmen hinter Web Better (webbetter.ch), Personendaten nach dem Schweizer Datenschutzgesetz (DSG) und der EU-DSGVO bearbeitet.',
  'crumb': 'Datenschutz', 'kicker': 'RECHTLICHES', 'h1a': 'Datenschutz.', 'h1b': 'Klar, kurz und im Einklang mit Schweizer und EU-Recht.',
  'lead': 'Diese Erklärung zeigt, welche Personendaten WB Solutions bearbeitet, wenn Sie webbetter.ch besuchen, uns kontaktieren oder sich bewerben, und welche Rechte Sie haben.',
  'updated': 'Stand: 16. Oktober 2026',
  'sections': [
   ('1. Verantwortliche Stelle', '<p class="pv-box"><b>WB Solutions</b>{ADDR}<br>Web Better ist eine Marke der WB Solutions.<br>E-Mail: <a href="mailto:beratung@webbetter.ch">beratung@webbetter.ch</a></p><p>WB Solutions ist für die Bearbeitung von Personendaten auf dieser Website verantwortlich. Bei Fragen zum Datenschutz schreiben Sie bitte an die obige Adresse.</p>'),
   ('2. Rechtliche Grundlagen', '<p>Wir bearbeiten Personendaten gemäss dem Schweizer Bundesgesetz über den Datenschutz (DSG) und, soweit anwendbar für Besucherinnen und Besucher aus der Europäischen Union und dem EWR, einschliesslich Deutschland und Österreich, gemäss der Datenschutz-Grundverordnung (DSGVO). Je nach Zweck stützen wir uns auf Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Erfüllung oder Anbahnung eines Vertrags (lit. b), rechtliche Pflichten (lit. c) oder unsere berechtigten Interessen (lit. f).</p>'),
   ('3. Hosting und Server-Logs', '<p>Diese Website wird von Vercel Inc. (USA) gehostet. Beim Besuch werden automatisch technische Daten bearbeitet: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Referrer, Browser und Betriebssystem. Wir benötigen diese Daten, um die Website sicher auszuliefern und Missbrauch zu erkennen (berechtigtes Interesse). Log-Daten werden nur kurz aufbewahrt. Übermittlungen in die USA sind durch das EU-U.S. und Swiss-U.S. Data Privacy Framework oder durch Standardvertragsklauseln abgesichert.</p>'),
   ('4. Kontakt und Projektanfragen', '<p>Wenn Sie das Anfrageformular nutzen oder uns per E-Mail schreiben, bearbeiten wir Ihre Angaben wie Name, Firma, E-Mail, Telefon, Budget und Nachricht, um Ihre Anfrage zu beantworten und ein Angebot zu erstellen (Vertragsanbahnung und berechtigtes Interesse). Formularnachrichten werden uns über den E-Mail-Dienst Resend (USA) zugestellt. Wir bewahren Anfragen so lange auf, wie es für ihre Bearbeitung und gesetzliche Aufbewahrungsfristen nötig ist.</p>'),
   ('5. Bewerbungen', '<p>Wenn Sie sich über das Karriereformular bewerben, bearbeiten wir Name, E-Mail, Rolle, Portfolio-Link, Nachricht und Lebenslauf ausschliesslich zur Prüfung Ihrer Bewerbung. Bewerbungen werden spätestens sechs Monate nach Abschluss des Verfahrens gelöscht, ausser Sie stimmen einer längeren Aufbewahrung für künftige Stellen zu.</p>'),
   ('6. Cookies und lokale Speicherung', '<p>Wir verwenden nur Speicherungen, die für den Betrieb dieser Website notwendig sind. Sie liegen im lokalen Speicher Ihres Browsers, nicht in Tracking-Cookies:</p><ul><li><b>wb-consent</b>: Ihre Datenschutz-Auswahl</li><li><b>webbetter-lang</b>: Ihre Sprache</li><li><b>webbetter-theme</b>: helle oder dunkle Darstellung</li></ul><p>Derzeit setzen wir keine Analyse- oder Marketing-Cookies ein. Sollten wir solche ergänzen, werden sie erst nach Ihrer Einwilligung im Consent-Banner aktiv. Sie können Ihre Wahl jederzeit unter <a href="#" data-cookie-settings>Cookie-Einstellungen</a> ändern.</p>'),
   ('7. Externe Dienste', '<p>Für eine einheitliche Darstellung werden Schriften von Google Fonts (Google Ireland Ltd. und Google LLC) und eine Skript-Bibliothek über das jsDelivr-Netzwerk geladen. Ihr Browser verbindet sich dabei mit diesen Servern, wodurch Ihre IP-Adresse übertragen wird. Wir nutzen diese Dienste in unserem berechtigten Interesse an einer schnellen und einheitlichen Darstellung. Bilder, Logos und Gemälde liegen auf unserem eigenen Server.</p>'),
   ('8. Ihre Rechte', '<p>Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer Personendaten, auf Einschränkung der Bearbeitung, auf Widerspruch, auf Datenübertragbarkeit sowie das Recht, eine Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen. Schreiben Sie dazu an <a href="mailto:beratung@webbetter.ch">beratung@webbetter.ch</a>. Zudem können Sie sich beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) oder in der EU bei der Aufsichtsbehörde Ihres Landes beschweren.</p>'),
   ('9. Datensicherheit', '<p>Diese Website wird ausschliesslich über eine verschlüsselte Verbindung (HTTPS/TLS) ausgeliefert. Wir schützen Ihre Daten mit technischen und organisatorischen Massnahmen vor Verlust und unbefugtem Zugriff.</p>'),
   ('10. Änderungen', '<p>Wir können diese Erklärung anpassen, wenn sich unsere Leistungen oder das Recht ändern. Die aktuelle Fassung ist immer auf dieser Seite verfügbar.</p>'),
  ],
 },
}

def privacy_main(lang, base):
    c = PRIVACY[lang]
    addr = ('<br>' + E(COMPANY_ADDRESS)) if COMPANY_ADDRESS else ''
    secs = ''.join(f'      <h2>{E(h)}</h2>\n      {body.replace("{ADDR}", addr)}\n' for h, body in c['sections'])
    hero_c = dict(c); hero_c['cta1'] = 'beratung@webbetter.ch'
    return hero(hero_c, 'privacy', lang, base) + f'''  <section class="pg-sec container">
    <article class="pv-body">
      <p class="mono pv-meta">{E(c['updated'])}</p>
{secs}    </article>
  </section>
'''

# ------------------------------------------------------------------ building blocks
def mail_link(text):
    return E(text).replace('beratung@webbetter.ch', '<a href="mailto:beratung@webbetter.ch">beratung@webbetter.ch</a>')

def faq_block(items, lang, cls=''):
    out = []
    for f in items:
        q, a = f[lang]
        out.append(f'''      <details class="faq-item reveal" data-cat="{f["cat"]}">
        <summary><h3 class="faq-q">{E(q)}</h3><span class="faq-plus" aria-hidden="true"></span></summary>
        <p>{mail_link(a)}</p>
      </details>''')
    return '\n'.join(out)

def hero(c, kind, lang, base):
    u = UI[lang]
    return f'''  <section class="ph" data-kind="{kind}">
    <canvas class="ph-gl" id="phGL" aria-hidden="true"></canvas>
    <div class="ph-labels" aria-hidden="true"></div>
    <div class="ph-shade" aria-hidden="true"></div>
    <div class="container ph-inner">
      <nav class="ph-crumb mono" aria-label="Breadcrumb"><a href="{base}">{E(u['home'])}</a><span>/</span><span aria-current="page">{E(c['crumb'])}</span></nav>
      <p class="mono ph-kicker">{E(c['kicker'])}</p>
      <h1 class="ph-title"><span class="ph-l1">{E(c['h1a'])}</span><span class="ph-l2">{E(c['h1b'])}</span></h1>
      <p class="ph-lead">{mail_link(c['lead'])}</p>
      <div class="ph-cta">
        <a class="ph-btn primary" href="mailto:beratung@webbetter.ch" data-enquiry>{E(c['cta1'])} <svg><use href="#arrow"/></svg></a>
        {f'<a class="ph-btn" href="{base}faq/">{E(c["cta2"])}</a>' if c.get('cta2') else ''}
      </div>
    </div>
    <p class="mono ph-scroll" aria-hidden="true">{u['scroll']} <svg><use href="#down"/></svg></p>
  </section>
'''

def pillars(c):
    cards = []
    for i, (t, d, items) in enumerate(c['pillars']):
        li = ''.join(f'<li>{E(x)}</li>' for x in items)
        cards.append(f'''      <article class="pl-card reveal" style="--i:{i}">
        <span class="pl-num mono">{i + 1:02d}</span>
        <svg class="pl-ico" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18"/><path d="M14 26l7 7 13-16"/></svg>
        <h3>{E(t)}</h3>
        <p>{E(d)}</p>
        <ul class="mono">{li}</ul>
      </article>''')
    return f'''  <section class="pg-sec container">
    <p class="mono label">{E(c['pillars_label'])}</p>
    <h2 class="pg-h2 reveal">{c['pillars_title']}</h2>
    <div class="pl-grid">
{chr(10).join(cards)}
    </div>
  </section>
'''

def steps(c):
    rows = ''.join(f'''        <li class="st-item reveal"><span class="st-num mono">{i + 1:02d}</span><div><h3>{E(t)}</h3><p>{E(d)}</p></div></li>
''' for i, (t, d) in enumerate(c['steps']))
    return f'''  <section class="pg-sec container st" id="process">
    <div class="st-side">
      <p class="mono label">{E(c['steps_label'])}</p>
      <h2 class="pg-h2">{c['steps_title']}</h2>
      <div class="st-bar" aria-hidden="true"><i></i></div>
    </div>
    <ol class="st-list">
{rows}    </ol>
  </section>
'''

def cta(c, lang):
    return f'''  <section class="pg-cta">
    <canvas class="pg-cta-gl" aria-hidden="true"></canvas>
    <div class="container pg-cta-inner reveal">
      <h2>{E(c['cta_title'])}</h2>
      <p>{E(c['cta_text'])}</p>
      <a class="cta-mail" href="mailto:beratung@webbetter.ch" data-enquiry>beratung@webbetter.ch <svg><use href="#arrow"/></svg></a>
    </div>
  </section>
'''

def seo_main(lang, base, faq_items):
    c = SEO[lang]
    stats = ''.join(f'''      <div class="sx reveal"><b><span data-count="{n}">{n}</span>{u}</b><span>{E(t)}</span></div>
''' for n, u, t in c['stats'])
    checks = ''.join(f'<li class="ck reveal" style="--i:{i}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9"/></svg>{E(x)}</li>' for i, x in enumerate(c['checks']))
    links = ' '.join(f'<a class="mono pr-link" href="{h}">{E(t)} ↗</a>' for h, t in c['proof_links'])
    return hero(c, 'seo', lang, base) + f'''  <section class="pg-sec container">
    <p class="mono label">{E(c['stats_label'])}</p>
    <div class="sx-row">
{stats}    </div>
  </section>
''' + pillars(c) + steps(c) + f'''  <section class="pg-sec container">
    <p class="mono label">{E(c['checks_label'])}</p>
    <h2 class="pg-h2 reveal">{E(c['checks_title'])}</h2>
    <ul class="ck-grid">{checks}</ul>
  </section>
  <section class="pg-sec container pr">
    <p class="mono label">{E(c['proof_label'])}</p>
    <h2 class="pg-h2 reveal">{E(c['proof_title'])}</h2>
    <p class="pr-text reveal">{E(c['proof_text'])}</p>
    <div class="pr-links reveal">{links}</div>
  </section>
  <section class="pg-sec container faq-page-sec">
    <p class="mono label">{E(c['faq_label'])}</p>
    <h2 class="pg-h2">{E(c['faq_title'])}</h2>
    <div class="faq-list">
{faq_block(faq_items, lang)}
    </div>
  </section>
''' + cta(c, lang)

def geo_main(lang, base, faq_items):
    c = GEO[lang]
    flow = ''.join(f'''      <li class="fl-node reveal" style="--i:{i}"><span class="fl-dot"></span><span class="mono fl-n">{i + 1:02d}</span><h3>{E(t)}</h3><p>{E(d)}</p></li>
''' for i, (t, d) in enumerate(c['flow']))
    engines = ''.join(f'''      <article class="en-card reveal" style="--i:{i}"><h3>{E(t)}</h3><p>{E(d)}</p></article>
''' for i, (t, d) in enumerate(c['engines']))
    h = c['compare_head']
    rows = ''.join(f'<tr class="reveal"><th scope="row">{E(a)}</th><td>{E(b)}</td><td>{E(cc)}</td></tr>' for a, b, cc in c['compare'])
    return hero(c, 'geo', lang, base) + f'''  <section class="pg-sec container">
    <p class="mono label">{E(c['flow_label'])}</p>
    <h2 class="pg-h2 reveal">{c['flow_title']}</h2>
    <ol class="fl">
      <li class="fl-line" aria-hidden="true"><i></i></li>
{flow}    </ol>
  </section>
''' + pillars(c) + f'''  <section class="pg-sec container">
    <p class="mono label">{E(c['engines_label'])}</p>
    <h2 class="pg-h2 reveal">{E(c['engines_title'])}</h2>
    <div class="en-grid">
{engines}    </div>
  </section>
  <section class="pg-sec container">
    <p class="mono label">{E(c['compare_label'])}</p>
    <h2 class="pg-h2 reveal">{E(c['compare_title'])}</h2>
    <div class="cmp-wrap"><table class="cmp"><thead><tr><th scope="col">{E(h[0])}</th><th scope="col">{E(h[1])}</th><th scope="col" class="hot">{E(h[2])}</th></tr></thead><tbody>{rows}</tbody></table></div>
  </section>
''' + steps(c) + f'''  <section class="pg-sec container faq-page-sec">
    <p class="mono label">{E(c['faq_label'])}</p>
    <h2 class="pg-h2">{E(c['faq_title'])}</h2>
    <div class="faq-list">
{faq_block(faq_items, lang)}
    </div>
  </section>
''' + cta(c, lang)


def seogeo_main(lang, base, faq_items):
    c, sc, gc = SEOGEO[lang], SEO[lang], GEO[lang]
    stats = ''.join(f"""      <div class="sx reveal"><b><span data-count="{n}">{n}</span>{u}</b><span>{E(t)}</span></div>
""" for n, u, t in sc['stats'])
    h = gc['compare_head']
    rows = ''.join(f'<tr class="reveal"><th scope="row">{E(a)}</th><td>{E(b)}</td><td>{E(cc)}</td></tr>' for a, b, cc in gc['compare'])
    flow = ''.join(f"""      <li class="fl-node reveal" style="--i:{i}"><span class="fl-dot"></span><span class="mono fl-n">{i + 1:02d}</span><h3>{E(t)}</h3><p>{E(d)}</p></li>
""" for i, (t, d) in enumerate(gc['flow']))
    engines = ''.join(f"""      <article class="en-card reveal" style="--i:{i}"><h3>{E(t)}</h3><p>{E(d)}</p></article>
""" for i, (t, d) in enumerate(gc['engines']))
    checks = ''.join(f'<li class="ck reveal" style="--i:{i}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9"/></svg>{E(x)}</li>' for i, x in enumerate(sc['checks']))
    links = ' '.join(f'<a class="mono pr-link" href="{hh}">{E(t)} ↗</a>' for hh, t in sc['proof_links'])
    seo_p = dict(sc); seo_p['pillars_label'] = c['seo_label']; seo_p['pillars_title'] = c['seo_title']
    geo_p = dict(gc); geo_p['pillars_label'] = c['geo_label']; geo_p['pillars_title'] = c['geo_title']
    return hero(c, 'seo', lang, base) + f"""  <section class="pg-sec container">
    <p class="mono label">{E(sc['stats_label'])}</p>
    <div class="sx-row">
{stats}    </div>
  </section>
  <section class="pg-sec container">
    <p class="mono label">{E(c['split_label'])}</p>
    <h2 class="pg-h2 reveal">{c['split_title']}</h2>
    <div class="cmp-wrap"><table class="cmp"><thead><tr><th scope="col">{E(h[0])}</th><th scope="col">{E(h[1])}</th><th scope="col" class="hot">{E(h[2])}</th></tr></thead><tbody>{rows}</tbody></table></div>
  </section>
""" + pillars(seo_p) + f"""  <section class="pg-sec container">
    <p class="mono label">{E(gc['flow_label'])}</p>
    <h2 class="pg-h2 reveal">{gc['flow_title']}</h2>
    <ol class="fl">
      <li class="fl-line" aria-hidden="true"><i></i></li>
{flow}    </ol>
  </section>
""" + pillars(geo_p) + f"""  <section class="pg-sec container">
    <p class="mono label">{E(gc['engines_label'])}</p>
    <h2 class="pg-h2 reveal">{E(gc['engines_title'])}</h2>
    <div class="en-grid">
{engines}    </div>
  </section>
""" + steps(c) + f"""  <section class="pg-sec container">
    <p class="mono label">{E(sc['checks_label'])}</p>
    <h2 class="pg-h2 reveal">{E(sc['checks_title'])}</h2>
    <ul class="ck-grid">{checks}</ul>
  </section>
  <section class="pg-sec container pr">
    <p class="mono label">{E(sc['proof_label'])}</p>
    <h2 class="pg-h2 reveal">{E(sc['proof_title'])}</h2>
    <p class="pr-text reveal">{E(sc['proof_text'])}</p>
    <div class="pr-links reveal">{links}</div>
  </section>
  <section class="pg-sec container faq-page-sec">
    <p class="mono label">{E(c['faq_label'])}</p>
    <h2 class="pg-h2">{E(c['faq_title'])}</h2>
    <div class="faq-list">
{faq_block(faq_items, lang)}
    </div>
  </section>
""" + cta(c, lang)

def dev_main(lang, base, faq_items):
    c = DEV[lang]
    stats = ''.join(f"""      <div class="sx reveal"><b><span data-count="{n}">{n}</span>{u}</b><span>{E(t)}</span></div>
""" for n, u, t in c['stats'])
    stack = ''.join(f"""      <article class="en-card reveal" style="--i:{i}"><h3>{E(t)}</h3><p>{E(d)}</p></article>
""" for i, (t, d) in enumerate(c['stack']))
    checks = ''.join(f'<li class="ck reveal" style="--i:{i}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9"/></svg>{E(x)}</li>' for i, x in enumerate(c['checks']))
    morph = ''.join(f"""        <li class="dm-item{' on' if i == 0 else ''}"><span class="mono">{E(tag)}</span><h3>{E(t)}</h3><p>{E(d)}</p></li>
""" for i, (tag, t, d) in enumerate(c['morph']))
    return hero(c, 'dev', lang, base) + f"""  <section class="pg-sec container">
    <p class="mono label">{E(c['stats_label'])}</p>
    <div class="sx-row">
{stats}    </div>
  </section>
  <section class="dm" id="devMorph" aria-labelledby="dm-title">
    <div class="dm-sticky">
      <canvas class="dm-gl" id="dmGL" aria-hidden="true"></canvas>
      <div class="container dm-inner">
        <p class="mono label">{E(c['morph_label'])}</p>
        <h2 class="pg-h2" id="dm-title">{c['morph_title']}</h2>
        <ol class="dm-list">
{morph}        </ol>
        <div class="dm-bar" aria-hidden="true"><i></i></div>
      </div>
    </div>
  </section>
""" + pillars(c) + f"""  <section class="pg-sec pg-stack">
    <canvas class="stack-gl" id="stackGL" aria-hidden="true"></canvas>
    <div class="container">
      <p class="mono label">{E(c['stack_label'])}</p>
      <h2 class="pg-h2 reveal">{E(c['stack_title'])}</h2>
      <div class="en-grid stack-grid">
{stack}      </div>
    </div>
  </section>
""" + steps(c) + f"""  <section class="pg-sec container">
    <p class="mono label">{E(c['checks_label'])}</p>
    <h2 class="pg-h2 reveal">{E(c['checks_title'])}</h2>
    <ul class="ck-grid">{checks}</ul>
  </section>
  <section class="pg-sec container faq-page-sec">
    <p class="mono label">{E(c['faq_label'])}</p>
    <h2 class="pg-h2">{E(c['faq_title'])}</h2>
    <div class="faq-list">
{faq_block(faq_items, lang)}
    </div>
  </section>
""" + cta(c, lang)

def seogeo_ld(lang, items):
    def g(url):
        out = []
        for key, c in (('seo', SEO[lang]), ('geo', GEO[lang])):
            name, desc = c['service']
            out.append({"@type": "Service", "@id": url + "#" + key, "name": name, "description": desc, "serviceType": name,
                        "provider": {"@id": SITE + "/#org"}, "areaServed": ["CH", "DE", "AT", "Worldwide"], "availableLanguage": ["en", "de"], "url": url})
        return out + faq_ld(items, lang)(url)
    return g

def faq_main(lang, base, faq_all):
    c = FAQP[lang]
    order = ['general', 'projects', 'build', 'seo', 'geo', 'perf']
    chips = f'<button type="button" class="chip on mono" data-cat="all">{E(c["all"])}</button>' + ''.join(
        f'<button type="button" class="chip mono" data-cat="{k}">{E(c["cats"][k])}</button>' for k in order)
    groups = ''
    for k in order:
        items = [f for f in faq_all if f['cat'] == k]
        groups += f'''    <section class="fq-group" data-cat="{k}" aria-labelledby="fq-{k}">
      <h2 class="fq-h mono" id="fq-{k}">{E(c['cats'][k])}</h2>
      <div class="faq-list">
{faq_block(items, lang)}
      </div>
    </section>
'''
    return hero(c, 'faq', lang, base) + f'''  <section class="pg-sec container fq">
    <div class="fq-tools">
      <label class="fq-search"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="6"/><path d="M14 14l4 4"/></svg>
        <input type="search" id="fqSearch" placeholder="{A(c['search'])}" aria-label="{A(c['search'])}"></label>
      <div class="fq-chips" role="toolbar">{chips}</div>
    </div>
{groups}    <p class="fq-empty" hidden>{mail_link(c['empty'])}</p>
  </section>
''' + cta(c, lang)

# ------------------------------------------------------------------ head + schema
def page_head(lang, slug, c, graph_extra):
    url = f'{SITE}/{"de/" if lang == "de" else ""}{slug}/'
    en_url, de_url = f'{SITE}/{slug}/', f'{SITE}/de/{slug}/'
    home = f'{SITE}/{"de/" if lang == "de" else ""}'
    graph = [
      {"@type": "Organization", "@id": SITE + "/#org", "name": "Web Better", "legalName": "WB Solutions", "alternateName": ["WebBetter", "webbetter.ch", "WB Solutions"], "url": SITE + "/",
       "logo": SITE + "/assets/logo-webbetter.png", "email": "beratung@webbetter.ch"},
      {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": c['title'].replace(' | Web Better', ''), "description": c['desc'],
       "inLanguage": lang, "isPartOf": {"@id": SITE + "/#website"}, "about": {"@id": SITE + "/#org"},
       "breadcrumb": {"@id": url + "#breadcrumb"}, "primaryImageOfPage": SITE + "/assets/og-image.png"},
      {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": UI[lang]['home'], "item": home},
        {"@type": "ListItem", "position": 2, "name": c['crumb'], "item": url}]},
    ] + graph_extra(url)
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=1)
    locale, alt = ('de_CH', 'en_GB') if lang == 'de' else ('en_GB', 'de_CH')
    t = A(c['title']); d = A(c['desc'])
    return f'''  <title>{E(c['title'])}</title>
  <meta name="description" content="{d}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#030817">
  <link rel="canonical" href="{url}">
  <link rel="alternate" hreflang="en" href="{en_url}">
  <link rel="alternate" hreflang="de" href="{de_url}">
  <link rel="alternate" hreflang="de-CH" href="{de_url}">
  <link rel="alternate" hreflang="x-default" href="{en_url}">
  <link rel="alternate" type="text/plain" title="LLM summary" href="{SITE}/llms.txt">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Web Better">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{t}">
  <meta property="og:description" content="{d}">
  <meta property="og:image" content="{SITE}/assets/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="{locale}">
  <meta property="og:locale:alternate" content="{alt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{t}">
  <meta name="twitter:description" content="{d}">
  <meta name="twitter:image" content="{SITE}/assets/og-image.png">
  <script type="application/ld+json">
{ld}
  </script>
'''

def faq_ld(items, lang):
    return lambda url: [{"@type": "FAQPage", "@id": url + "#faq", "inLanguage": lang, "mainEntity": [
        {"@type": "Question", "name": f[lang][0], "acceptedAnswer": {"@type": "Answer", "text": f[lang][1]}} for f in items]}]

def service_ld(c, lang, items):
    name, desc = c['service']
    def g(url):
        return [{"@type": "Service", "@id": url + "#service", "name": name, "description": desc, "serviceType": name,
                 "provider": {"@id": SITE + "/#org"}, "areaServed": ["CH", "DE", "AT", "Worldwide"], "availableLanguage": ["en", "de"], "url": url}] + faq_ld(items, lang)(url)
    return g

# ------------------------------------------------------------------ page shell
def shell(lang, head, main, chrome_top, chrome_bottom, slug):
    return f'''<!doctype html>
<html lang="{lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
{head}  <link rel="icon" href="/assets/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/experiences.css">
  <link rel="stylesheet" href="/enquiry.css">
  <link rel="stylesheet" href="/pages.css">
  <script>try{{var t=localStorage.getItem('webbetter-theme');if(t)document.documentElement.dataset.theme=t}}catch(e){{}}</script>
</head>
<body class="subpage page-{slug}">
{chrome_top}
<main id="top">
{main}</main>

{chrome_bottom}
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="/gl.js"></script>
<script src="/experiences.js"></script>
<script src="/i18n.js"></script>
<script src="/consent.js"></script>
<script src="/enquiry.js"></script>
<script src="/page.js"></script>
</body>
</html>
'''

def build(ctx):
    """ctx: read, write, Translator, de_links, FAQ"""
    en_home = ctx['read']('index.html')
    # header chrome: symbols, progress, cursor, header, menu (no loader)
    top = en_home[en_home.index('<!-- SVG symbols -->'): en_home.index('<main id="top">')]
    top = top.replace('<!-- Loader -->\n', '')
    top = re.sub(r'<div class="loader".*?\n</div>\n', '', top, flags=re.S)
    bottom = en_home[en_home.index('<!-- Footer -->'): en_home.index('</footer>') + len('</footer>')]
    def absolutise(s, lang):
        s = s.replace('src="assets/', 'src="/assets/').replace('href="assets/', 'href="/assets/')
        s = re.sub(r'href="#(?!arrow|down|up|mark|moon|sun|quote)([\w-]+)"', lambda m: f'href="/{"de/" if lang == "de" else ""}#{m.group(1)}"', s)
        s = s.replace('href="#top"', f'href="/{"de/" if lang == "de" else ""}"')
        return s
    FAQ = ctx['FAQ']
    pages = []
    for lang in ('en', 'de'):
        base = '/de/' if lang == 'de' else '/'
        seo_items = [f for f in FAQ if f['cat'] == 'seo']
        geo_items = [f for f in FAQ if f['cat'] == 'geo']
        dev_items = [f for f in FAQ if f['cat'] in ('build', 'perf')]
        specs = [
          ('seo-geo', SEOGEO[lang], seogeo_main(lang, base, seo_items + geo_items), seogeo_ld(lang, seo_items + geo_items)),
          ('web-app-development', DEV[lang], dev_main(lang, base, dev_items), service_ld(DEV[lang], lang, dev_items)),
          ('faq', FAQP[lang], faq_main(lang, base, FAQ), faq_ld(FAQ, lang)),
          ('privacy', PRIVACY[lang], privacy_main(lang, base), lambda url: []),
        ]
        for slug, c, main, ld in specs:
            doc = shell(lang, page_head(lang, slug, c, ld), main, absolutise(top, lang), absolutise(bottom, lang), slug)
            if lang == 'de':
                t = ctx['Translator'](); t.feed(doc); t.close(); doc = ''.join(t.out)
                doc = ctx['de_links'](doc)
            path = f'{"de/" if lang == "de" else ""}{slug}/index.html'
            ctx['write'](path, doc)
            pages.append(path)
    return pages

def llms_pages():
    return {'seo': SEO, 'geo': GEO, 'dev': DEV}
