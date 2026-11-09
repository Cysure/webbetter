/* Web Better: Meta Pixel, loaded only after marketing consent (consent.js).
   Tracks PageView, Lead (enquiry form sent) and Schedule (Calendly booking).
   Nothing is loaded or sent before the visitor accepts "Marketing". */
(() => {
  const PIXEL_ID = '1810833220137211';
  let loaded = false;

  function load() {
    if (loaded) return;
    loaded = true;
    /* official Meta base code */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('consent', 'grant');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  const track = (event, params) => { if (loaded && window.fbq) window.fbq('track', event, params || {}); };

  const allowed = c => !!(c && c.marketing);
  if (allowed(window.WBConsent && window.WBConsent.get())) load();
  window.addEventListener('wb-consent', e => {
    if (allowed(e.detail)) load();
    else if (loaded && window.fbq) window.fbq('consent', 'revoke');
  });

  // enquiry form sent successfully (enquiry.js)
  window.addEventListener('wb-lead', e => track('Lead', { content_name: (e.detail && e.detail.kind) || 'enquiry' }));
  // Calendly booking (inline or popup widget)
  window.addEventListener('message', e => {
    if (e.origin === 'https://calendly.com' && e.data && e.data.event === 'calendly.event_scheduled') track('Schedule');
  });
})();
