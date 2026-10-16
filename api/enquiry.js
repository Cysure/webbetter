// Vercel serverless function: POST /api/enquiry
// Sends website enquiries to beratung@webbetter.ch through Resend (https://resend.com).
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY  required. API key from Resend, with webbetter.ch verified as a sending domain.
//   ENQUIRY_TO      optional. Defaults to beratung@webbetter.ch
//   ENQUIRY_FROM    optional. Defaults to "Web Better Website <website@webbetter.ch>"

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const line = (v, n) => String(v || '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method_not_allowed' }); }

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};

  // honeypot: bots fill the hidden field, people never see it
  if (b.website) return res.status(200).json({ ok: true });

  const name = line(b.name, 120), company = line(b.company, 160), email = line(b.email, 200), phone = line(b.phone, 60);
  const budget = line(b.budget, 40), lang = b.lang === 'de' ? 'de' : 'en', page = line(b.page, 200);
  const interests = (Array.isArray(b.interests) ? b.interests : []).map(x => line(x, 30)).slice(0, 8);
  const message = String(b.message || '').trim().slice(0, 5000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 5) {
    return res.status(400).json({ error: 'invalid' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ error: 'not_configured' });
  const to = process.env.ENQUIRY_TO || 'beratung@webbetter.ch';
  const from = process.env.ENQUIRY_FROM || 'Web Better Website <website@webbetter.ch>';

  const rows = [['Name', name], ['Company', company], ['Email', email], ['Phone', phone],
    ['Interests', interests.join(', ')], ['Budget', budget], ['Language', lang], ['Page', page]].filter(r => r[1]);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + '\n\n' + message;
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#071431">
  <h2 style="margin:0 0 12px">New enquiry from webbetter.ch</h2>
  <table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="color:#6b7690">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`).join('')}</table>
  <p style="white-space:pre-wrap;margin-top:16px;line-height:1.55">${esc(message)}</p></div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: `New enquiry: ${name}${company ? ` (${company})` : ''}`, text, html })
    });
    if (!r.ok) return res.status(502).json({ error: 'send_failed' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'send_failed' });
  }
};
