// Vercel serverless function: POST /api/careers
// Sends job applications (with an optional CV attachment) to beratung@webbetter.ch through Resend.
// Uses the same environment variables as /api/enquiry: RESEND_API_KEY (required), ENQUIRY_TO, ENQUIRY_FROM.

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const line = (v, n) => String(v || '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);
const ROLES = ['Designer', 'Developer', 'Sales agent', 'Other'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method_not_allowed' }); }
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  if (b.website) return res.status(200).json({ ok: true });   // honeypot

  const name = line(b.name, 120), email = line(b.email, 200), link = line(b.link, 300);
  const role = ROLES.includes(b.role) ? b.role : 'Other', lang = b.lang === 'de' ? 'de' : 'en';
  const message = String(b.message || '').trim().slice(0, 5000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 5) return res.status(400).json({ error: 'invalid' });

  // CV: PDF or Word only, max 3 MB once decoded
  let attachments;
  if (b.cv && b.cv.data) {
    const fname = line(b.cv.name, 120).replace(/[^\w.\- ]+/g, '_');
    if (!/\.(pdf|docx?)$/i.test(fname)) return res.status(400).json({ error: 'file_type' });
    const bytes = Math.floor(String(b.cv.data).length * 3 / 4);
    if (bytes > 3 * 1024 * 1024) return res.status(413).json({ error: 'file_size' });
    attachments = [{ filename: fname, content: String(b.cv.data) }];
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ error: 'not_configured' });
  const to = process.env.ENQUIRY_TO || 'beratung@webbetter.ch';
  const from = process.env.ENQUIRY_FROM || 'Web Better Website <website@webbetter.ch>';

  const rows = [['Role', role], ['Name', name], ['Email', email], ['Portfolio / LinkedIn', link], ['Language', lang], ['CV', attachments ? attachments[0].filename : 'not attached']].filter(r => r[1]);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + '\n\nWhy Web Better:\n' + message;
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#071431">
  <h2 style="margin:0 0 12px">New application: ${esc(role)}</h2>
  <table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="color:#6b7690">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`).join('')}</table>
  <p style="margin:16px 0 4px;color:#6b7690">Why Web Better</p><p style="white-space:pre-wrap;margin:0;line-height:1.55">${esc(message)}</p></div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: `Application (${role}): ${name}`, text, html, attachments })
    });
    if (!r.ok) return res.status(502).json({ error: 'send_failed' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'send_failed' });
  }
};
