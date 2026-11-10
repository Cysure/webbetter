/* Web Better: Google Ads conversion tracking, loaded only after marketing consent (consent.js).
   Uses Google Consent Mode v2: everything is denied by default and nothing is loaded or sent
   before the visitor accepts "Marketing". Conversion "Website-Anfrage" fires when the enquiry
   form is sent successfully (wb-lead) or a Calendly booking completes. */
(() => {
  const AW_ID = 'AW-18567185640';
  const CONVERSION = AW_ID + '/aXcyCJGc3LUdEOiJw5VF';
  let loaded = false;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });

  function load() {
    if (loaded) return;
    loaded = true;
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + AW_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', AW_ID);
  }

  const convert = () => { if (loaded) gtag('event', 'conversion', { send_to: CONVERSION, value: 1.0, currency: 'CHF' }); };

  const allowed = c => !!(c && c.marketing);
  if (allowed(window.WBConsent && window.WBConsent.get())) load();
  window.addEventListener('wb-consent', e => {
    if (allowed(e.detail)) load();
    else gtag('consent', 'update', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  });

  window.addEventListener('wb-lead', convert);
  window.addEventListener('message', e => {
    if (e.origin === 'https://calendly.com' && e.data && e.data.event === 'calendly.event_scheduled') convert();
  });
})();
