/* Web Better: privacy notice and cookie consent (Swiss FADP, EU GDPR, German TDDDG, Austrian TKG).
   Layer 1: a clear notice with Reject all / More options / Accept & continue.
   Layer 2: category switches and the legal background.
   Shown on every page until the visitor decides; afterwards a shield button reopens it.
   Other scripts can listen for the 'wb-consent' event or read window.WBConsent.get(). */
(() => {
  const KEY = 'wb-consent', VERSION = 1;
  const de = document.documentElement.lang === 'de';
  const policy = de ? '/de/privacy/' : '/privacy/';
  const S = de ? {
    title: 'Datenschutzhinweis',
    p1: `Wir und unsere technischen Dienstleister verwenden Cookies und ähnliche Technologien. <b>Notwendige Speicherungen</b> sorgen dafür, dass diese Website funktioniert und sich Ihre Einstellungen merkt.`,
    p2: `Mit Ihrer Einwilligung setzen wir zusätzlich <a href="#" data-cs="more">Analyse- und Marketing-Cookies</a> ein, um zu verstehen, wie die Website genutzt wird, und um Kampagnen zu messen. Nach dem Schweizer <b>DSG</b>, der EU-<b>DSGVO</b>, dem deutschen <b>TDDDG</b> und dem österreichischen <b>TKG</b> ist dafür Ihre Zustimmung nötig.`,
    p3: `Sie können zustimmen, ablehnen oder Ihre Auswahl anpassen und sie jederzeit über das Schild-Symbol unten links ändern. Mehr dazu in unserer <a href="${'/de/privacy/'}">Datenschutzerklärung</a>.`,
    more: 'Weitere Optionen', reject: 'Alle ablehnen', accept: 'Akzeptieren & weiter', save: 'Auswahl speichern', back: 'Zurück',
    optTitle: 'Ihre Einstellungen',
    lawT: 'Warum fragen wir?', law: 'Das Schweizer Datenschutzgesetz (DSG), die EU-Datenschutz-Grundverordnung (DSGVO), § 25 TDDDG in Deutschland und § 165 TKG 2021 in Österreich erlauben nicht notwendige Cookies nur mit Ihrer ausdrücklichen Einwilligung. Ablehnen ist genauso einfach wie Zustimmen, und Ihre Wahl gilt, bis Sie sie ändern.',
    laws: ['DSG · Schweiz', 'DSGVO · EU', 'TDDDG · Deutschland', 'TKG · Österreich'],
    nec: 'Notwendig', necT: 'Speichert Ihre Einwilligung, Sprache und Darstellung. Ohne diese Daten funktioniert die Website nicht.',
    ana: 'Analyse', anaT: 'Anonyme Statistiken darüber, wie die Website genutzt wird. Derzeit nicht im Einsatz.',
    mkt: 'Marketing', mktT: 'Messung von Kampagnen und personalisierte Inhalte. Derzeit nicht im Einsatz.',
    always: 'Immer aktiv', reopen: 'Datenschutz-Einstellungen'
  } : {
    title: 'Privacy notice',
    p1: `We and our technical service providers use cookies and similar technologies. <b>Strictly necessary storage</b> keeps this website working and remembers your settings.`,
    p2: `With your consent, we also use <a href="#" data-cs="more">analytics and marketing cookies</a> to understand how the website is used and to measure campaigns. Under the Swiss <b>FADP</b>, the EU <b>GDPR</b>, Germany's <b>TDDDG</b> and Austria's <b>TKG</b>, these require your consent.`,
    p3: `You can accept, reject or customise your choice, and change it at any time with the shield button at the bottom left. Read more in our <a href="${'/privacy/'}">privacy policy</a>.`,
    more: 'More options', reject: 'Reject all', accept: 'Accept & continue', save: 'Save choices', back: 'Back',
    optTitle: 'Your settings',
    lawT: 'Why we ask', law: 'The Swiss Federal Act on Data Protection (FADP), the EU General Data Protection Regulation (GDPR), Section 25 of Germany\'s TDDDG and Section 165 of Austria\'s TKG 2021 only allow non-essential cookies with your explicit consent. Rejecting is as easy as accepting, and your choice applies until you change it.',
    laws: ['FADP · Switzerland', 'GDPR · EU', 'TDDDG · Germany', 'TKG · Austria'],
    nec: 'Necessary', necT: 'Remembers your consent, language and display settings. The website cannot work without it.',
    ana: 'Analytics', anaT: 'Anonymous statistics about how the website is used. Not currently in use.',
    mkt: 'Marketing', mktT: 'Campaign measurement and personalised content. Not currently in use.',
    always: 'Always on', reopen: 'Privacy settings'
  };
  const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && v.v === VERSION ? v : null; } catch (e) { return null; } };
  const write = c => {
    const v = { v: VERSION, necessary: true, analytics: !!c.analytics, marketing: !!c.marketing, ts: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
    window.dispatchEvent(new CustomEvent('wb-consent', { detail: v }));
    return v;
  };
  const SHIELD = '<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>';
  const ICONS = {
    necessary: SHIELD,
    analytics: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
    marketing: '<path d="M3 11v2a2 2 0 0 0 2 2h1l5 4V5L6 9H5a2 2 0 0 0-2 2z"/><path d="M16 8a5 5 0 0 1 0 8"/>'
  };

  let dlg = null, fab = null;
  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'cs'; dlg.setAttribute('aria-labelledby', 'csTitle');
    dlg.innerHTML = `
      <div class="cs-card">
        <div class="cs-scroll">
          <img class="cs-logo" src="/assets/logo-webbetter.png" alt="Web Better" width="1040" height="586">
          <section class="cs-l1">
            <h2 id="csTitle" tabindex="-1" autofocus>${S.title}</h2>
            <p>${S.p1}</p><p>${S.p2}</p><p>${S.p3}</p>
          </section>
          <section class="cs-l2" hidden>
            <h2>${S.optTitle}</h2>
            <div class="cs-cats">
              ${[['necessary', S.nec, S.necT, true], ['analytics', S.ana, S.anaT, false], ['marketing', S.mkt, S.mktT, false]].map(([k, t, d, locked]) => `
              <label class="cs-cat${locked ? ' locked' : ''}">
                <svg class="cs-ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>
                <span class="cs-cat-t"><b>${t}${locked ? ` <em>${S.always}</em>` : ''}</b><i>${d}</i></span>
                <span class="cs-switch"><input type="checkbox" name="${k}" ${locked ? 'checked disabled' : ''} aria-label="${t}"><span></span></span>
              </label>`).join('')}
            </div>
            <div class="cs-law">
              <b>${S.lawT}</b><p>${S.law}</p>
              <ul>${S.laws.map(l => `<li>${l}</li>`).join('')}</ul>
            </div>
          </section>
        </div>
        <div class="cs-foot">
          <button type="button" class="cs-btn out" data-cs="more">${S.more}</button>
          <button type="button" class="cs-btn out" data-cs="back" hidden>${S.back}</button>
          <button type="button" class="cs-btn out" data-cs="reject">${S.reject}</button>
          <button type="button" class="cs-btn fill" data-cs="save" hidden>${S.save}</button>
          <button type="button" class="cs-btn fill" data-cs="accept">${S.accept}</button>
        </div>
      </div>`;
    document.body.appendChild(dlg);
    const l1 = dlg.querySelector('.cs-l1'), l2 = dlg.querySelector('.cs-l2');
    const btn = n => dlg.querySelector(`.cs-foot [data-cs="${n}"]`);
    const layer = two => {
      l1.hidden = two; l2.hidden = !two;
      btn('more').hidden = two; btn('back').hidden = !two; btn('save').hidden = !two;
      dlg.classList.toggle('two', two);
      dlg.querySelector('.cs-scroll').scrollTop = 0;
    };
    dlg.addEventListener('click', e => {
      const t = e.target.closest('[data-cs]'); if (!t) return;
      const a = t.dataset.cs; e.preventDefault();
      if (a === 'more') return layer(true);
      if (a === 'back') return layer(false);
      if (a === 'accept') write({ analytics: true, marketing: true });
      if (a === 'reject') write({ analytics: false, marketing: false });
      if (a === 'save') write({ analytics: dlg.querySelector('[name=analytics]').checked, marketing: dlg.querySelector('[name=marketing]').checked });
      hide();
    });
    dlg.addEventListener('cancel', e => e.preventDefault());   // a decision is required
    dlg._layer = layer;
  }
  function buildFab() {
    if (fab) return;
    fab = document.createElement('button');
    fab.type = 'button'; fab.className = 'cs-fab'; fab.setAttribute('aria-label', S.reopen); fab.title = S.reopen;
    fab.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${SHIELD}</svg>`;
    fab.addEventListener('click', () => show(true));
    document.body.appendChild(fab);
  }
  function show(options) {
    if (!dlg) build();
    const c = read();
    dlg.querySelector('[name=analytics]').checked = !!c?.analytics;
    dlg.querySelector('[name=marketing]').checked = !!c?.marketing;
    dlg._layer(!!options);
    if (!dlg.open) { try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); } }
    document.documentElement.classList.add('cs-open');
    fab?.classList.add('gone');
  }
  function hide() {
    dlg.classList.add('closing');
    setTimeout(() => { dlg.classList.remove('closing'); dlg.close(); document.documentElement.classList.remove('cs-open'); buildFab(); fab.classList.remove('gone'); }, 300);
  }
  window.WBConsent = { get: read, open: () => show(true) };
  document.addEventListener('click', e => { if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); show(true); } });
  const start = () => {
    if (read() || /\/privacy\/$/.test(location.pathname)) buildFab();   // the policy page itself stays readable
    else setTimeout(() => show(false), 700);
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
