# Web Better insights: the articles behind the "Featured insights" cards.
# Every figure here is taken from the source linked beside it. Keep it that way:
# when a source changes, update the sentence or drop it.
#
# Body blocks:  ('h2', text) · ('p', html) · ('ul', [html, ...]) · ('ol', [html, ...])
#               ('stats', [(figure, label), ...]) · ('quote', text, cite) · ('note', html)

GEO_PAPER = 'https://arxiv.org/abs/2311.09735'
GOOGLE_AI = 'https://developers.google.com/search/docs/appearance/ai-features'
OPENAI_BOTS = 'https://developers.openai.com/api/docs/bots'
ANTHROPIC_BOTS = 'https://support.claude.com/en/articles/8896518'
CHATGPT_SEARCH = 'https://openai.com/index/introducing-chatgpt-search/'
BRAVE = 'https://techcrunch.com/2025/03/21/anthropic-appears-to-be-using-brave-to-power-web-searches-for-its-claude-chatbot/'
LLMSTXT = 'https://llmstxt.org/'
VITALS = 'https://web.dev/articles/vitals'
GOOGLE_CWV = 'https://developers.google.com/search/docs/appearance/core-web-vitals'
INP = 'https://web.dev/blog/inp-cwv-launch'
VODAFONE = 'https://web.dev/case-studies/vodafone'
DELOITTE = 'https://web.dev/case-studies/milliseconds-make-millions'
PEW = 'https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/'
AHREFS = 'https://ahrefs.com/blog/ai-overviews-reduce-clicks/'
AHREFS_UPDATE = 'https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/'


def a(url, text):
    return f'<a href="{url}" target="_blank" rel="noopener">{text}</a>'


ARTICLES = [
# =====================================================================================
{
 'slug': 'geo-is-the-new-seo', 'art': 'art-geo', 'date': '2026-10-12',
 'en': {
  'tags': 'GEO, AI SEARCH', 'by': 'WEB BETTER RESEARCH', 'date': '12 OCTOBER, 2026',
  'title': 'GEO is the new SEO: how brands get cited by AI assistants',
  'seo_title': 'GEO Is the New SEO: How Brands Get Cited by AI | Web Better',
  'desc': 'How ChatGPT, Google AI Overviews and Claude choose their sources, what the research says about getting cited, and a practical GEO checklist for your website.',
  'dek': 'Rankings are no longer the finish line. What large language models read, trust and quote, and how to structure your site so you are the source.',
  'takeaways': [
    'AI assistants answer from pages they can reach and index. If the right crawlers are blocked, or Google cannot show a snippet of the page, you are not in the race.',
    'In the research that coined the term, adding quotations, statistics and cited sources made content up to 40% more visible in AI answers. Keyword stuffing made it less visible.',
    'GEO does not replace SEO. It sits on top of it: Google says AI Overviews draw on pages that are already indexed and eligible for a snippet.',
  ],
  'body': [
   ('p', 'For twenty years the goal of search was simple to describe: rank on page one, ideally in the top three. That goal has not disappeared, but it is no longer the whole story. A growing share of questions now get answered before anyone sees a list of links, by Google\'s AI Overviews, by ChatGPT, by Perplexity, by Claude. The answer names a handful of sources. Being one of them is the new page one.'),
   ('p', 'That is what <b>generative engine optimisation</b>, or GEO, is about. The term is younger than most of the tools that now use it, and a lot of what gets sold under the label is guesswork. So this piece sticks to what can be checked: what the platforms themselves document, and what the one serious study on the subject actually measured.'),
   ('h2', 'Where AI answers come from'),
   ('p', 'Assistants do not invent their sources at random. When they search the web they work from an index, and they fetch pages with their own crawlers. Each platform documents this differently, and the details matter.'),
   ('ul', [
     f'<b>Google.</b> In its guidance on {a(GOOGLE_AI, "AI features and your website")}, Google states that to appear as a supporting link in AI Overviews or AI Mode, a page must be indexed and eligible to be shown in Google Search with a snippet, and that there are no additional technical requirements.',
     f'<b>ChatGPT.</b> OpenAI {a(CHATGPT_SEARCH, "launched ChatGPT search")} on 31 October 2024 and opened it to everyone in February 2025. Its {a(OPENAI_BOTS, "crawler documentation")} is explicit: sites that opt out of OAI-SearchBot will not be shown in ChatGPT search answers. GPTBot is a separate crawler used for model training.',
     f'<b>Claude.</b> Anthropic {a(ANTHROPIC_BOTS, "lists three robots")}: ClaudeBot for training data, Claude-User when a person asks Claude to look something up, and Claude-SearchBot to improve search results. Brave Search has appeared on Anthropic\'s subprocessor list since March 2025, and {a(BRAVE, "independent testing")} found Claude\'s citations matching Brave\'s results.',
   ]),
   ('p', 'The practical consequence is unglamorous but decisive. Check your robots.txt, your firewall and your CDN\'s bot protection. We regularly see sites that block AI crawlers by default without anyone having decided to. Blocking a training crawler such as GPTBot can be a legitimate choice. Blocking the search crawlers means opting out of the answers.'),
   ('h2', 'What the research measured'),
   ('p', f'The term GEO comes from a {a(GEO_PAPER, "2023 paper")} by Pranjal Aggarwal and colleagues, published at KDD 2024. The team built a benchmark of 10,000 queries, rewrote source pages in different ways and measured how much of each page made it into generated answers.'),
   ('stats', [('40%', 'maximum lift in visibility in AI answers'), ('10,000', 'queries in the GEO-bench test set'), ('+115%', 'for fifth-ranked pages that cited sources')]),
   ('p', 'Three changes did best: adding <b>quotations</b> from credible people, adding <b>statistics</b>, and <b>citing sources</b>. Making the text more fluent also helped. Keyword stuffing, the oldest trick in SEO, scored below the unedited baseline. The effects also varied by topic, which the authors flag as a reason to avoid one-size-fits-all advice.'),
   ('p', 'The most interesting finding is about who benefits. Pages that ranked lower in conventional results gained far more than the top result. Citing sources lifted the visibility of fifth-ranked pages by 115% on average, while the top-ranked page lost ground. For smaller companies competing with large brands, that is the most encouraging line in the study.'),
   ('note', 'One caution: the study measured visibility in a research setup using generative models of the time, not inside the live ChatGPT or Google products. It tells you what kinds of content language models prefer to use. It does not guarantee a citation tomorrow.'),
   ('h2', 'Write for extraction'),
   ('p', 'Taken together, the documentation and the research point in the same direction. An assistant has to find your page, understand it quickly and lift a passage that stands on its own. Content that does well tends to share a few traits.'),
   ('ul', [
     '<b>The answer comes first.</b> Put the direct answer in the opening sentence of a section, then the nuance. A paragraph that starts with background is hard to quote.',
     '<b>Facts are specific.</b> Prices, timelines, numbers and named examples beat adjectives. "Most projects launch in six to ten weeks" can be quoted. "We work fast" cannot.',
     '<b>Claims carry their evidence.</b> Link the source, name the study, quote the expert. That is exactly what the GEO experiments rewarded.',
     '<b>Each section stands alone.</b> Headings that are real questions, and paragraphs that make sense out of context, survive being cut out of the page.',
     '<b>The important text is real text.</b> Facts locked in images, sliders or scripts that load after interaction are easy for people to miss and harder for machines to read.',
   ]),
   ('h2', 'Make your brand easy to recognise'),
   ('p', 'Assistants also need to understand who you are. Use the same company name, description and contact details on your site, your Google Business Profile, LinkedIn and the directories you appear in. Add structured data (Organization, Service, FAQPage) so that facts like your location, services and languages are machine-readable rather than implied.'),
   ('p', f'You may have heard of {a(LLMSTXT, "llms.txt")}, a plain-text summary of a site proposed in September 2024. It is cheap to add and we publish one, but be clear about its status: it is a proposal, not a standard, and Google\'s John Mueller has said publicly that no AI system currently uses it. Treat it as a bonus, never as the strategy.'),
   ('h2', 'A short GEO checklist'),
   ('ol', [
     'Allow Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot and PerplexityBot in robots.txt, and check that your CDN does not challenge them.',
     'Make sure your key pages are indexed, with no noindex or nosnippet tags hiding them.',
     'Rewrite your most important pages answer-first, with specific facts, numbers and linked sources.',
     'Add an FAQ that answers the questions customers really ask, in their words.',
     'Keep your company facts identical everywhere they appear, and mark them up with schema.org.',
     'Ask the assistants yourself. Track the questions that matter to your business, monthly, and note who gets cited.',
   ]),
   ('p', 'None of this is magic, and none of it is wasted if AI search changes again next year. Pages that are fast, clear, specific and well sourced have always been what search engines tried to find. The difference now is that the reward is not just a click. It is being the answer.'),
  ],
 },
 'de': {
  'tags': 'GEO, KI-SUCHE', 'by': 'WEB BETTER RESEARCH', 'date': '12. OKTOBER 2026',
  'title': 'GEO ist das neue SEO: wie Marken von KI-Assistenten zitiert werden',
  'seo_title': 'GEO ist das neue SEO: so zitiert Sie die KI | Web Better',
  'desc': 'Wie ChatGPT, Google AI Overviews und Claude ihre Quellen wählen, was die Forschung über Zitierungen sagt, und eine praktische GEO-Checkliste für Ihre Website.',
  'dek': 'Rankings sind nicht mehr das Ziel. Was grosse Sprachmodelle lesen, wem sie vertrauen und wen sie zitieren, und wie Sie Ihre Website so aufbauen, dass Sie die Quelle sind.',
  'takeaways': [
    'KI-Assistenten antworten aus Seiten, die sie erreichen und indexieren können. Wer die richtigen Crawler blockiert oder bei Google kein Snippet zulässt, ist gar nicht im Rennen.',
    'In der Studie, die den Begriff geprägt hat, wurden Inhalte mit Zitaten, Statistiken und Quellenangaben bis zu 40 % sichtbarer in KI-Antworten. Keyword-Stuffing machte sie unsichtbarer.',
    'GEO ersetzt SEO nicht, es baut darauf auf: Laut Google stützen sich AI Overviews auf Seiten, die bereits indexiert sind und mit Snippet angezeigt werden dürfen.',
  ],
  'body': [
   ('p', 'Zwanzig Jahre lang war das Ziel der Suche leicht zu beschreiben: auf Seite eins ranken, am besten unter den ersten drei. Dieses Ziel gibt es noch, aber es erzählt nicht mehr die ganze Geschichte. Immer mehr Fragen werden beantwortet, bevor jemand eine Liste mit Links sieht, von Googles AI Overviews, von ChatGPT, von Perplexity, von Claude. Die Antwort nennt eine Handvoll Quellen. Eine davon zu sein, ist die neue Seite eins.'),
   ('p', 'Genau darum geht es bei <b>Generative Engine Optimization</b>, kurz GEO. Der Begriff ist jünger als die meisten Tools, die ihn heute verwenden, und vieles, was unter diesem Etikett verkauft wird, ist Vermutung. Dieser Beitrag hält sich deshalb an das, was sich prüfen lässt: was die Plattformen selbst dokumentieren und was die einzige ernsthafte Studie zum Thema tatsächlich gemessen hat.'),
   ('h2', 'Woher KI-Antworten kommen'),
   ('p', 'Assistenten wählen ihre Quellen nicht zufällig. Wenn sie im Web suchen, arbeiten sie mit einem Index und rufen Seiten mit eigenen Crawlern ab. Jede Plattform dokumentiert das anders, und die Details sind entscheidend.'),
   ('ul', [
     f'<b>Google.</b> In der Dokumentation {a(GOOGLE_AI, "AI features and your website")} schreibt Google, dass eine Seite indexiert sein und in der Google-Suche mit Snippet angezeigt werden dürfen muss, um als Quelle in AI Overviews oder im AI Mode zu erscheinen. Zusätzliche technische Anforderungen gibt es nicht.',
     f'<b>ChatGPT.</b> OpenAI hat {a(CHATGPT_SEARCH, "die ChatGPT-Suche")} am 31. Oktober 2024 lanciert und im Februar 2025 für alle geöffnet. Die {a(OPENAI_BOTS, "Crawler-Dokumentation")} ist eindeutig: Websites, die OAI-SearchBot ausschliessen, erscheinen nicht in den Antworten der ChatGPT-Suche. GPTBot ist ein separater Crawler für das Modelltraining.',
     f'<b>Claude.</b> Anthropic {a(ANTHROPIC_BOTS, "nennt drei Robots")}: ClaudeBot für Trainingsdaten, Claude-User, wenn eine Person Claude etwas nachschlagen lässt, und Claude-SearchBot zur Verbesserung der Suchergebnisse. Brave Search steht seit März 2025 auf Anthropics Liste der Unterauftragsverarbeiter, und {a(BRAVE, "unabhängige Tests")} fanden Claudes Quellen deckungsgleich mit den Ergebnissen von Brave.',
   ]),
   ('p', 'Die praktische Folge ist wenig glamourös, aber entscheidend. Prüfen Sie Ihre robots.txt, Ihre Firewall und den Bot-Schutz Ihres CDN. Wir sehen regelmässig Websites, die KI-Crawler standardmässig blockieren, ohne dass das je jemand entschieden hat. Einen Trainings-Crawler wie GPTBot zu sperren, kann eine bewusste Entscheidung sein. Die Such-Crawler zu sperren heisst, auf die Antworten zu verzichten.'),
   ('h2', 'Was die Forschung gemessen hat'),
   ('p', f'Der Begriff GEO stammt aus einer {a(GEO_PAPER, "Studie von 2023")} von Pranjal Aggarwal und Kollegen, veröffentlicht an der KDD 2024. Das Team baute einen Benchmark mit 10’000 Suchanfragen, schrieb Quellseiten auf verschiedene Arten um und mass, wie viel von jeder Seite in den generierten Antworten landete.'),
   ('stats', [('40 %', 'maximale Steigerung der Sichtbarkeit in KI-Antworten'), ('10’000', 'Suchanfragen im GEO-bench-Testset'), ('+115 %', 'für Seiten auf Rang fünf mit Quellenangaben')]),
   ('p', 'Am besten schnitten drei Änderungen ab: <b>Zitate</b> glaubwürdiger Personen ergänzen, <b>Statistiken</b> ergänzen und <b>Quellen angeben</b>. Auch flüssigere Texte halfen. Keyword-Stuffing, der älteste Trick im SEO, lag unter der unbearbeiteten Ausgangsversion. Die Effekte unterschieden sich zudem je nach Thema, was die Autoren als Grund nennen, Pauschalrezepte zu meiden.'),
   ('p', 'Am spannendsten ist, wer profitiert. Seiten, die in den klassischen Ergebnissen weiter hinten lagen, gewannen deutlich mehr als das Top-Ergebnis. Quellenangaben steigerten die Sichtbarkeit von Seiten auf Rang fünf im Schnitt um 115 %, während die bestplatzierte Seite verlor. Für kleinere Unternehmen, die gegen grosse Marken antreten, ist das die ermutigendste Zeile der Studie.'),
   ('note', 'Eine Einschränkung: Die Studie mass die Sichtbarkeit in einem Forschungsaufbau mit generativen Modellen jener Zeit, nicht in den laufenden Produkten von ChatGPT oder Google. Sie zeigt, welche Art von Inhalten Sprachmodelle bevorzugt verwenden. Eine Zitierung morgen garantiert sie nicht.'),
   ('h2', 'Schreiben, damit man zitiert werden kann'),
   ('p', 'Dokumentation und Forschung zeigen in dieselbe Richtung. Ein Assistent muss Ihre Seite finden, schnell verstehen und eine Passage übernehmen können, die für sich allein steht. Inhalte, die gut abschneiden, haben einige Gemeinsamkeiten.'),
   ('ul', [
     '<b>Die Antwort kommt zuerst.</b> Die direkte Antwort steht im ersten Satz eines Abschnitts, die Nuancen danach. Ein Absatz, der mit Hintergrund beginnt, lässt sich schlecht zitieren.',
     '<b>Fakten sind konkret.</b> Preise, Zeitrahmen, Zahlen und benannte Beispiele schlagen Adjektive. «Die meisten Projekte gehen nach sechs bis zehn Wochen live» lässt sich zitieren. «Wir arbeiten schnell» nicht.',
     '<b>Aussagen tragen ihren Beleg.</b> Verlinken Sie die Quelle, nennen Sie die Studie, zitieren Sie die Expertin. Genau das wurde in den GEO-Experimenten belohnt.',
     '<b>Jeder Abschnitt steht für sich.</b> Überschriften, die echte Fragen sind, und Absätze, die auch ohne Kontext verständlich sind, überstehen es, aus der Seite herausgelöst zu werden.',
     '<b>Wichtiger Text ist echter Text.</b> Fakten in Bildern, Slidern oder nachgeladenen Skripten übersehen Menschen leicht, und Maschinen lesen sie schlechter.',
   ]),
   ('h2', 'Machen Sie Ihre Marke wiedererkennbar'),
   ('p', 'Assistenten müssen auch verstehen, wer Sie sind. Verwenden Sie denselben Firmennamen, dieselbe Beschreibung und dieselben Kontaktdaten auf Ihrer Website, im Google-Unternehmensprofil, auf LinkedIn und in den Verzeichnissen, in denen Sie erscheinen. Ergänzen Sie strukturierte Daten (Organization, Service, FAQPage), damit Standort, Leistungen und Sprachen maschinenlesbar sind und nicht nur angedeutet.'),
   ('p', f'Vielleicht haben Sie von {a(LLMSTXT, "llms.txt")} gehört, einer reinen Textzusammenfassung einer Website, vorgeschlagen im September 2024. Sie ist schnell erstellt und wir veröffentlichen selbst eine, aber ihr Status sollte klar sein: Es ist ein Vorschlag, kein Standard, und Googles John Mueller hat öffentlich gesagt, dass derzeit kein KI-System sie nutzt. Betrachten Sie sie als Zugabe, nie als Strategie.'),
   ('h2', 'Eine kurze GEO-Checkliste'),
   ('ol', [
     'Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot und PerplexityBot in der robots.txt zulassen und prüfen, dass Ihr CDN sie nicht abweist.',
     'Sicherstellen, dass Ihre wichtigsten Seiten indexiert sind und kein noindex oder nosnippet sie versteckt.',
     'Die wichtigsten Seiten so umschreiben, dass die Antwort zuerst kommt, mit konkreten Fakten, Zahlen und verlinkten Quellen.',
     'Ein FAQ ergänzen, das die Fragen beantwortet, die Kundinnen und Kunden wirklich stellen, in ihren Worten.',
     'Firmenangaben überall identisch halten und mit schema.org auszeichnen.',
     'Die Assistenten selbst fragen. Die für Ihr Geschäft wichtigen Fragen monatlich prüfen und notieren, wer zitiert wird.',
   ]),
   ('p', 'Nichts davon ist Magie, und nichts davon ist verloren, falls sich die KI-Suche nächstes Jahr wieder verändert. Schnelle, klare, konkrete und gut belegte Seiten waren schon immer das, was Suchmaschinen finden wollten. Der Unterschied ist, dass die Belohnung heute nicht nur ein Klick ist. Sondern die Antwort zu sein.'),
  ],
 },
 'sources': [('Aggarwal et al., “GEO: Generative Engine Optimization”, KDD 2024', GEO_PAPER),
             ('Google Search Central, “AI features and your website”', GOOGLE_AI),
             ('OpenAI, “Overview of OpenAI crawlers”', OPENAI_BOTS),
             ('OpenAI, “Introducing ChatGPT search”', CHATGPT_SEARCH),
             ('Anthropic Help Center, crawlers and robots.txt', ANTHROPIC_BOTS),
             ('TechCrunch, “Anthropic appears to be using Brave to power web searches for its Claude chatbot”', BRAVE),
             ('llmstxt.org, the llms.txt proposal', LLMSTXT)],
},
# =====================================================================================
{
 'slug': 'core-web-vitals-2026', 'art': 'art-seo', 'date': '2026-09-28',
 'en': {
  'tags': 'SEO, PERFORMANCE', 'by': 'ENGINEERING', 'date': '28 SEPTEMBER, 2026',
  'title': 'Core Web Vitals in 2026: speed is still a ranking story',
  'seo_title': 'Core Web Vitals in 2026: Speed Still Matters | Web Better',
  'desc': 'The three Core Web Vitals, their thresholds, what Google says about ranking, what speed is worth in revenue, and the checklist we use on every rebuild.',
  'dek': 'The quiet compounding of a fast site: better rankings, cheaper ads, higher conversion. A practical checklist from our rebuilds.',
  'takeaways': [
    'Good means LCP within 2.5 seconds, INP of 200 milliseconds or less and CLS of 0.1 or less, measured at the 75th percentile of real visits.',
    'Google says good Core Web Vitals align with what its ranking systems reward. Relevance still comes first, so speed is a tiebreaker you should not lose.',
    'The business case is measured: in Vodafone\'s A/B test a 31% faster LCP brought 8% more sales.',
  ],
  'body': [
   ('p', 'Every few years someone declares that page speed no longer matters for SEO. Every few years the data says otherwise. Speed was never the strongest ranking signal, and it still is not. But it touches everything that comes after the ranking: whether the visitor stays, whether the form gets filled in, whether the ad click you paid for turns into a customer.'),
   ('h2', 'The three numbers'),
   ('p', f'Google measures page experience with three {a(VITALS, "Core Web Vitals")}. Each has a clear threshold for "good".'),
   ('stats', [('2.5 s', 'Largest Contentful Paint: when the main content appears'), ('200 ms', 'Interaction to Next Paint: how fast the page reacts'), ('0.1', 'Cumulative Layout Shift: how much the layout jumps')]),
   ('p', f'Two details are easy to miss. First, the thresholds apply at the <b>75th percentile</b> of page loads, separately for mobile and desktop. A fast test on your office laptop proves little. Three in four real visits, on real phones and real networks, have to be good. Second, {a(INP, "INP replaced First Input Delay")} as a Core Web Vital in March 2024. FID only measured the delay before the first interaction. INP looks at the responsiveness of interactions across the whole visit, which is much harder to fake and much closer to how a slow site feels.'),
   ('h2', 'What Google actually says about ranking'),
   ('p', f'Google\'s {a(GOOGLE_CWV, "Search documentation")} says good Core Web Vitals align with what its core ranking systems seek to reward, and recommends achieving them for success in Search. It does not promise that fast pages outrank relevant ones, and nobody should claim it does. A slow page with the best answer will usually beat a fast page with a weak one.'),
   ('p', 'In practice speed acts as a tiebreaker between pages that are similarly relevant. In competitive markets that is exactly where you are: several agencies, shops or clinics offering much the same, with comparable content. Losing the tiebreaker is avoidable.'),
   ('h2', 'What speed is worth'),
   ('p', 'The stronger argument for speed is commercial, and here the evidence is better than the folklore.'),
   ('ul', [
     f'<b>Vodafone</b> ran an {a(VODAFONE, "A/B test")} on a landing page, identical except for performance work. The optimised version had a 31% better LCP and produced 8% more sales, a 15% better lead-to-visit rate and an 11% better cart-to-visit rate.',
     f'<b>Deloitte</b>, in a {a(DELOITTE, "study commissioned by Google")}, found that a 0.1-second improvement in mobile speed across the whole journey lifted retail conversions by 8.4% and travel conversions by 10.1%. Retail shoppers also spent 9.2% more per order.',
   ]),
   ('p', 'Those gains compound. A faster page converts more of the traffic you already have, which lowers your cost per lead from ads, which lets you buy more traffic at the same budget. Speed is one of the few improvements that pays off in SEO, paid media and conversion at the same time.'),
   ('h2', 'Measure the right thing'),
   ('p', 'Lab tools such as Lighthouse are useful for debugging, but they simulate one visit on one device. Google assesses your pages with field data from real Chrome users, collected in the Chrome UX Report and shown in the Core Web Vitals report in Search Console. Optimise until the field data turns green. A perfect Lighthouse score with poor field data is still a poor site.'),
   ('h2', 'The checklist we use on every rebuild'),
   ('ol', [
     '<b>LCP:</b> serve the hero image in a modern format at the right size, never lazy-load it, and give it fetch priority. Preload the main web font, or use a system font.',
     '<b>LCP:</b> render the main content as HTML from the server or the edge. Waiting for a JavaScript bundle before showing the headline costs seconds on mid-range phones.',
     '<b>INP:</b> ship less JavaScript. Remove unused libraries, split code by route, and defer third-party scripts until they are needed.',
     '<b>INP:</b> keep event handlers short. Break long tasks up so the browser can paint between them, and show feedback immediately.',
     '<b>CLS:</b> reserve space for every image, video, embed and ad with width and height or aspect-ratio. Never insert banners above content after load.',
     '<b>Everything:</b> audit tag managers and chat widgets every quarter. On most sites we review, third-party scripts are the single biggest cost.',
   ]),
   ('note', 'We practise what we preach: webbetter.ch shows its own live Largest Contentful Paint, layout shift and responsiveness in the footer of every page, measured in your browser as you read.'),
   ('p', 'Speed rarely makes headlines in a strategy deck. It is not as visible as a new brand or as exciting as AI search. But it quietly decides how much of everything else you do actually pays off.'),
  ],
 },
 'de': {
  'tags': 'SEO, PERFORMANCE', 'by': 'ENGINEERING', 'date': '28. SEPTEMBER 2026',
  'title': 'Core Web Vitals 2026: Geschwindigkeit entscheidet noch immer über Rankings',
  'seo_title': 'Core Web Vitals 2026: Tempo zählt noch immer | Web Better',
  'desc': 'Die drei Core Web Vitals, ihre Grenzwerte, was Google über Rankings sagt, was Geschwindigkeit an Umsatz bringt, und unsere Checkliste für jeden Relaunch.',
  'dek': 'Der stille Zinseszins einer schnellen Website: bessere Rankings, günstigere Anzeigen, mehr Conversions. Eine praktische Checkliste aus unseren Relaunches.',
  'takeaways': [
    'Gut heisst: LCP innerhalb von 2,5 Sekunden, INP von höchstens 200 Millisekunden und CLS von höchstens 0,1, gemessen am 75. Perzentil echter Besuche.',
    'Laut Google entsprechen gute Core Web Vitals dem, was die Ranking-Systeme belohnen. Relevanz kommt weiterhin zuerst, Geschwindigkeit ist ein Tiebreaker, den man nicht verlieren sollte.',
    'Der Business Case ist gemessen: Im A/B-Test von Vodafone brachte ein 31 % schnellerer LCP 8 % mehr Verkäufe.',
  ],
  'body': [
   ('p', 'Alle paar Jahre erklärt jemand, die Ladezeit spiele für SEO keine Rolle mehr. Alle paar Jahre zeigen die Daten das Gegenteil. Geschwindigkeit war nie das stärkste Ranking-Signal und ist es auch heute nicht. Aber sie beeinflusst alles, was nach dem Ranking kommt: ob der Besuch bleibt, ob das Formular ausgefüllt wird, ob der bezahlte Anzeigenklick zur Kundin wird.'),
   ('h2', 'Die drei Zahlen'),
   ('p', f'Google misst die Nutzererfahrung mit drei {a(VITALS, "Core Web Vitals")}. Jede hat einen klaren Grenzwert für «gut».'),
   ('stats', [('2,5 s', 'Largest Contentful Paint: wann der Hauptinhalt erscheint'), ('200 ms', 'Interaction to Next Paint: wie schnell die Seite reagiert'), ('0,1', 'Cumulative Layout Shift: wie stark das Layout springt')]),
   ('p', f'Zwei Details werden oft übersehen. Erstens gelten die Grenzwerte für das <b>75. Perzentil</b> der Seitenaufrufe, getrennt nach Mobile und Desktop. Ein schneller Test auf dem Büro-Laptop beweist wenig. Drei von vier echten Besuchen, auf echten Smartphones und in echten Netzen, müssen gut sein. Zweitens hat {a(INP, "INP den First Input Delay")} im März 2024 als Core Web Vital abgelöst. FID mass nur die Verzögerung vor der ersten Interaktion. INP bewertet die Reaktionsfähigkeit über den ganzen Besuch, was sich kaum schönrechnen lässt und viel näher daran ist, wie sich eine langsame Website anfühlt.'),
   ('h2', 'Was Google tatsächlich über Rankings sagt'),
   ('p', f'In der {a(GOOGLE_CWV, "Dokumentation der Google-Suche")} heisst es, gute Core Web Vitals entsprächen dem, was die zentralen Ranking-Systeme belohnen wollen, und Google empfiehlt sie für den Erfolg in der Suche. Google verspricht nicht, dass schnelle Seiten relevante Seiten überholen, und niemand sollte das behaupten. Eine langsame Seite mit der besten Antwort schlägt meist eine schnelle Seite mit einer schwachen.'),
   ('p', 'In der Praxis wirkt Geschwindigkeit als Tiebreaker zwischen ähnlich relevanten Seiten. In umkämpften Märkten ist genau das Ihre Lage: mehrere Agenturen, Shops oder Praxen mit ähnlichem Angebot und vergleichbaren Inhalten. Diesen Tiebreaker zu verlieren, lässt sich vermeiden.'),
   ('h2', 'Was Geschwindigkeit wert ist'),
   ('p', 'Das stärkere Argument für Geschwindigkeit ist kommerziell, und hier ist die Beweislage besser als die Folklore.'),
   ('ul', [
     f'<b>Vodafone</b> führte einen {a(VODAFONE, "A/B-Test")} auf einer Landingpage durch, die sich nur in der Performance unterschied. Die optimierte Version hatte einen um 31 % besseren LCP und brachte 8 % mehr Verkäufe, eine um 15 % bessere Lead-to-Visit-Rate und eine um 11 % bessere Cart-to-Visit-Rate.',
     f'<b>Deloitte</b> stellte in einer {a(DELOITTE, "von Google beauftragten Studie")} fest, dass eine um 0,1 Sekunden schnellere mobile Website über die ganze Customer Journey die Conversions im Detailhandel um 8,4 % und im Reisebereich um 10,1 % steigerte. Im Detailhandel gaben Kundinnen und Kunden pro Bestellung zudem 9,2 % mehr aus.',
   ]),
   ('p', 'Diese Gewinne verstärken sich. Eine schnellere Seite konvertiert mehr vom bestehenden Traffic, das senkt die Kosten pro Lead aus Anzeigen, und mit demselben Budget lässt sich mehr Traffic kaufen. Geschwindigkeit gehört zu den wenigen Verbesserungen, die sich gleichzeitig in SEO, bezahlten Medien und Conversion auszahlen.'),
   ('h2', 'Das Richtige messen'),
   ('p', 'Labor-Tools wie Lighthouse helfen bei der Fehlersuche, simulieren aber einen einzigen Besuch auf einem Gerät. Google bewertet Ihre Seiten mit Felddaten echter Chrome-Nutzer, gesammelt im Chrome UX Report und sichtbar im Core-Web-Vitals-Bericht der Search Console. Optimieren Sie, bis die Felddaten grün sind. Ein perfekter Lighthouse-Score mit schlechten Felddaten ist immer noch eine schlechte Website.'),
   ('h2', 'Unsere Checkliste für jeden Relaunch'),
   ('ol', [
     '<b>LCP:</b> das Hero-Bild in einem modernen Format und in passender Grösse ausliefern, nie lazy laden und mit Fetch-Priorität versehen. Die wichtigste Webschrift vorladen oder eine Systemschrift verwenden.',
     '<b>LCP:</b> den Hauptinhalt als HTML vom Server oder vom Edge rendern. Wer mit der Überschrift auf ein JavaScript-Bundle wartet, verliert auf Mittelklasse-Smartphones Sekunden.',
     '<b>INP:</b> weniger JavaScript ausliefern. Ungenutzte Bibliotheken entfernen, Code pro Route aufteilen und Skripte von Drittanbietern erst laden, wenn sie gebraucht werden.',
     '<b>INP:</b> Event-Handler kurz halten. Lange Aufgaben aufteilen, damit der Browser dazwischen zeichnen kann, und sofort Feedback zeigen.',
     '<b>CLS:</b> für jedes Bild, Video, Embed und jede Anzeige Platz reservieren, mit width und height oder aspect-ratio. Nie nach dem Laden Banner über dem Inhalt einfügen.',
     '<b>Alles:</b> Tag Manager und Chat-Widgets jedes Quartal prüfen. Bei den meisten Websites, die wir analysieren, sind Skripte von Drittanbietern der grösste einzelne Kostenpunkt.',
   ]),
   ('note', 'Wir halten uns selbst daran: webbetter.ch zeigt im Footer jeder Seite den eigenen Largest Contentful Paint, Layout Shift und die Reaktionszeit live an, gemessen in Ihrem Browser, während Sie lesen.'),
   ('p', 'Geschwindigkeit schafft es selten auf die Titelfolie einer Strategie. Sie ist weniger sichtbar als eine neue Marke und weniger aufregend als die KI-Suche. Aber sie entscheidet still darüber, wie viel von allem anderen sich tatsächlich auszahlt.'),
  ],
 },
 'sources': [('web.dev, “Web Vitals”', VITALS),
             ('Google Search Central, “Understanding Core Web Vitals and Google search results”', GOOGLE_CWV),
             ('web.dev, “Interaction to Next Paint becomes a Core Web Vital”', INP),
             ('web.dev case study, “Vodafone: A 31% improvement in LCP increased sales by 8%”', VODAFONE),
             ('web.dev case study, “Milliseconds make millions” (Deloitte Digital)', DELOITTE)],
},
# =====================================================================================
{
 'slug': 'designing-for-answers', 'art': 'art-design', 'date': '2026-09-09',
 'en': {
  'tags': 'DESIGN, STRATEGY', 'by': 'DESIGN STUDIO', 'date': '09 SEPTEMBER, 2026',
  'title': 'Designing for answers, not just clicks',
  'seo_title': 'Designing for Answers, Not Just Clicks | Web Better',
  'desc': 'AI summaries mean fewer clicks and more paraphrase. What the data shows, and how we design websites and brands that still win when the first touchpoint is an AI answer.',
  'dek': 'When the first touchpoint is an AI summary, your brand has to survive being paraphrased. Here is how we design for it.',
  'takeaways': [
    'Pew Research found people clicked a result in 8% of Google visits with an AI summary, against 15% without one.',
    'The visit that does arrive is later in the journey and more deliberate. The page has to confirm the answer and close the deal quickly.',
    'Design now has two audiences: the person, and the model summarising you to that person. Clear facts, a distinctive voice and visible proof serve both.',
  ],
  'body': [
   ('p', 'For most of the web\'s history, design started from an assumption so basic nobody wrote it down: the visitor arrives at your homepage, or at least on one of your pages, and forms an impression there. That assumption is weakening. More and more often the first thing a potential customer learns about you is a sentence written by someone else: an AI model summarising your site, alongside two competitors, in answer to a question.'),
   ('h2', 'What the data shows'),
   ('p', f'The clearest numbers come from {a(PEW, "Pew Research Center")}, which analysed the actual browsing of 900 US adults in March 2025. When a Google results page included an AI summary, people clicked a traditional result in 8% of visits. Without a summary they did so in 15% of visits. Links inside the summary itself were clicked in just 1% of visits, and people were more likely to end their browsing session altogether: 26% of the time against 16%.'),
   ('stats', [('8%', 'clicked a result when an AI summary appeared'), ('15%', 'clicked a result without a summary'), ('1%', 'clicked a link inside the summary')]),
   ('p', f'Ahrefs, using Search Console data from 300,000 keywords, {a(AHREFS, "found")} that an AI Overview correlated with a 34.5% lower click-through rate for the top-ranking page in March 2025. Its {a(AHREFS_UPDATE, "follow-up")} with December 2025 data put the drop at 58%. These are correlations rather than experiments, but they all point the same way.'),
   ('p', 'This does not mean websites matter less. It means the website is no longer where the first impression happens. It is where the decision gets confirmed.'),
   ('h2', 'Two audiences, one page'),
   ('p', 'A page now has to work for a person scanning it in seconds, and for a model reading it to summarise. The good news is that they want largely the same things. The bad news is that much of what passes for modern web design serves neither: vague hero slogans, key facts hidden in carousels, case studies without numbers, and pages that read the same as every competitor\'s.'),
   ('h2', 'How we design for it'),
   ('ul', [
     '<b>Say what you do in the first line.</b> "We design and build fast websites for Swiss SMEs" survives a summary. "Elevating digital experiences" does not. If a model cannot tell from your hero what you sell and to whom, neither can a busy buyer.',
     '<b>Turn claims into facts.</b> Replace "experienced team" with how many projects, since when, for whom. Specific numbers get quoted, and the research on generative engines shows statistics and quotations measurably raise how much of a page makes it into answers.',
     '<b>Give every page one clear job.</b> A page that answers one question well is easier to cite than a page that half-answers five. Use headings that read as questions, and put the answer directly underneath.',
     '<b>Keep the brand recognisable in paraphrase.</b> Your name, your positioning line and your proof points should be worded identically everywhere: site, profiles, directories, press. Consistency is how a summary ends up describing you the way you describe yourself.',
     '<b>Make proof visible and checkable.</b> Logos of real clients, linked case studies, named testimonials and published prices are trust signals for people and evidence for machines. Put them in HTML text, not only in images.',
     '<b>Design the landing for someone who already knows the answer.</b> Visitors from an AI answer arrive with context. Lead them to proof, pricing and contact fast, rather than restarting the story from the beginning.',
   ]),
   ('h2', 'What does not change'),
   ('p', 'A distinctive brand matters more in this world, not less. When three agencies are described in the same neutral sentence, the one people remember is the one whose name, look and voice stuck the last time they saw it. Summaries flatten copy. They cannot flatten a memorable experience once someone clicks through.'),
   ('quote', 'Design for the click you still get, and for the sentence written about you when you do not.', 'Web Better design principle'),
   ('p', 'That is the brief we now give ourselves on every project: a site that a model can summarise accurately, and that a person who arrives is glad they clicked.'),
  ],
 },
 'de': {
  'tags': 'DESIGN, STRATEGIE', 'by': 'DESIGN STUDIO', 'date': '09. SEPTEMBER 2026',
  'title': 'Gestalten für Antworten, nicht nur für Klicks',
  'seo_title': 'Gestalten für Antworten, nicht nur für Klicks | Web Better',
  'desc': 'KI-Zusammenfassungen bedeuten weniger Klicks und mehr Paraphrase. Was die Daten zeigen und wie wir Websites und Marken gestalten, die auch dann gewinnen, wenn der erste Kontakt eine KI-Antwort ist.',
  'dek': 'Wenn der erste Kontakt eine KI-Zusammenfassung ist, muss Ihre Marke die Paraphrase überstehen. So gestalten wir dafür.',
  'takeaways': [
    'Pew Research zeigte: Bei Google-Suchen mit KI-Zusammenfassung klickten Menschen in 8 % der Fälle auf ein Ergebnis, ohne Zusammenfassung in 15 %.',
    'Der Besuch, der doch kommt, findet später in der Customer Journey statt und ist gezielter. Die Seite muss die Antwort bestätigen und schnell zum Abschluss führen.',
    'Design hat heute zwei Zielgruppen: den Menschen und das Modell, das Sie für diesen Menschen zusammenfasst. Klare Fakten, eine eigenständige Stimme und sichtbare Belege dienen beiden.',
  ],
  'body': [
   ('p', 'Während des grössten Teils der Webgeschichte ging Design von einer Annahme aus, die so grundlegend war, dass niemand sie aufschrieb: Der Besuch landet auf Ihrer Startseite, oder zumindest auf einer Ihrer Seiten, und bildet sich dort einen Eindruck. Diese Annahme wird schwächer. Immer öfter ist das Erste, was potenzielle Kundinnen und Kunden über Sie erfahren, ein Satz, den jemand anderes geschrieben hat: ein KI-Modell, das Ihre Website neben zwei Mitbewerbern zusammenfasst, als Antwort auf eine Frage.'),
   ('h2', 'Was die Daten zeigen'),
   ('p', f'Die klarsten Zahlen stammen vom {a(PEW, "Pew Research Center")}, das im März 2025 das tatsächliche Surfverhalten von 900 Erwachsenen in den USA auswertete. Enthielt eine Google-Ergebnisseite eine KI-Zusammenfassung, klickten die Menschen in 8 % der Fälle auf ein klassisches Ergebnis. Ohne Zusammenfassung waren es 15 %. Links in der Zusammenfassung selbst wurden nur in 1 % der Fälle angeklickt, und die Sitzung wurde häufiger ganz beendet: in 26 % der Fälle gegenüber 16 %.'),
   ('stats', [('8 %', 'klickten auf ein Ergebnis, wenn eine KI-Zusammenfassung erschien'), ('15 %', 'klickten auf ein Ergebnis ohne Zusammenfassung'), ('1 %', 'klickten auf einen Link in der Zusammenfassung')]),
   ('p', f'Ahrefs {a(AHREFS, "stellte")} anhand von Search-Console-Daten zu 300’000 Keywords fest, dass ein AI Overview im März 2025 mit einer um 34,5 % tieferen Klickrate für das bestplatzierte Ergebnis einherging. Die {a(AHREFS_UPDATE, "Folgeanalyse")} mit Daten vom Dezember 2025 bezifferte den Rückgang auf 58 %. Das sind Korrelationen, keine Experimente, aber sie zeigen alle in dieselbe Richtung.'),
   ('p', 'Das heisst nicht, dass Websites weniger wichtig sind. Es heisst, dass der erste Eindruck nicht mehr auf der Website entsteht. Dort wird die Entscheidung bestätigt.'),
   ('h2', 'Zwei Zielgruppen, eine Seite'),
   ('p', 'Eine Seite muss heute für einen Menschen funktionieren, der sie in Sekunden überfliegt, und für ein Modell, das sie liest, um sie zusammenzufassen. Die gute Nachricht: Beide wollen weitgehend dasselbe. Die schlechte: Vieles, was als modernes Webdesign gilt, dient keinem von beiden. Vage Hero-Slogans, wichtige Fakten in Karussells, Fallstudien ohne Zahlen und Seiten, die klingen wie jene jedes Mitbewerbers.'),
   ('h2', 'Wie wir dafür gestalten'),
   ('ul', [
     '<b>In der ersten Zeile sagen, was Sie tun.</b> «Wir gestalten und entwickeln schnelle Websites für Schweizer KMU» übersteht eine Zusammenfassung. «Digitale Erlebnisse auf ein neues Level heben» nicht. Wenn ein Modell aus Ihrem Hero nicht erkennt, was Sie wem verkaufen, erkennt es eine beschäftigte Einkäuferin auch nicht.',
     '<b>Behauptungen in Fakten verwandeln.</b> Ersetzen Sie «erfahrenes Team» durch wie viele Projekte, seit wann, für wen. Konkrete Zahlen werden zitiert, und die Forschung zu generativen Suchmaschinen zeigt, dass Statistiken und Zitate messbar beeinflussen, wie viel einer Seite in Antworten landet.',
     '<b>Jeder Seite eine klare Aufgabe geben.</b> Eine Seite, die eine Frage gut beantwortet, lässt sich leichter zitieren als eine, die fünf halb beantwortet. Überschriften als Fragen formulieren und die Antwort direkt darunter setzen.',
     '<b>Die Marke in der Paraphrase erkennbar halten.</b> Name, Positionierung und Belege sollten überall gleich formuliert sein: Website, Profile, Verzeichnisse, Presse. Konsistenz sorgt dafür, dass eine Zusammenfassung Sie so beschreibt, wie Sie sich selbst beschreiben.',
     '<b>Belege sichtbar und überprüfbar machen.</b> Logos echter Kunden, verlinkte Fallstudien, Testimonials mit Namen und veröffentlichte Preise sind Vertrauenssignale für Menschen und Belege für Maschinen. Als HTML-Text, nicht nur in Bildern.',
     '<b>Die Landingpage für jemanden gestalten, der die Antwort schon kennt.</b> Besuche aus einer KI-Antwort kommen mit Kontext. Führen Sie sie schnell zu Belegen, Preisen und Kontakt, statt die Geschichte von vorne zu erzählen.',
   ]),
   ('h2', 'Was sich nicht ändert'),
   ('p', 'Eine eigenständige Marke wird in dieser Welt wichtiger, nicht unwichtiger. Wenn drei Agenturen im selben neutralen Satz beschrieben werden, bleibt jene in Erinnerung, deren Name, Auftritt und Stimme beim letzten Kontakt hängen geblieben sind. Zusammenfassungen machen Texte flach. Ein einprägsames Erlebnis nach dem Klick können sie nicht flach machen.'),
   ('quote', 'Gestalten Sie für den Klick, den Sie noch bekommen, und für den Satz, der über Sie geschrieben wird, wenn nicht.', 'Web Better Designprinzip'),
   ('p', 'Das ist das Briefing, das wir uns heute bei jedem Projekt geben: eine Website, die ein Modell korrekt zusammenfassen kann, und bei der ein Mensch, der ankommt, froh ist, geklickt zu haben.'),
  ],
 },
 'sources': [('Pew Research Center, “Google users are less likely to click on links when an AI summary appears in the results”, July 2025', PEW),
             ('Ahrefs, “AI Overviews Reduce Clicks by 34.5%”', AHREFS),
             ('Ahrefs, updated AI Overviews click-through study', AHREFS_UPDATE),
             ('Aggarwal et al., “GEO: Generative Engine Optimization”, KDD 2024', GEO_PAPER)],
},
]


def words(art, lang):
    import re
    c = art[lang]
    text = ' '.join([c['title'], c['dek']] + c['takeaways'] + [
        ' '.join(b[1]) if isinstance(b[1], list) and b[0] in ('ul', 'ol') else
        ' '.join(f'{x} {y}' for x, y in b[1]) if b[0] == 'stats' else
        ' '.join(b[1:]) for b in c['body']])
    return len(re.sub(r'<[^>]+>', ' ', text).split())


def minutes(art, lang):
    return max(1, round(words(art, lang) / 220))
