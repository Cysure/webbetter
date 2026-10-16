/* Web Better: enquiry and careers popups.
   [data-enquiry] opens the project enquiry, [data-careers] opens careers.
   Both post to a Vercel function and fall back to a pre-filled email. */
(() => {
  const TO = 'beratung@webbetter.ch';
  const de = document.documentElement.lang === 'de';
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const L = de ? {
    need: 'Bitte füllen Sie Name, eine gültige E-Mail und Ihre Nachricht aus.',
    sending: 'Wird gesendet …',
    fallback: 'Ihr E-Mail-Programm öffnet sich mit Ihrer Nachricht. Bitte dort auf Senden klicken.',
    fallbackCv: 'Ihr E-Mail-Programm öffnet sich. Bitte hängen Sie Ihren Lebenslauf dort an und klicken Sie auf Senden.',
    subject: 'Projektanfrage über webbetter.ch', subjectCar: 'Bewerbung über webbetter.ch',
    fileType: 'Bitte laden Sie eine PDF- oder Word-Datei hoch.', fileSize: 'Die Datei ist grösser als 3 MB.'
  } : {
    need: 'Please add your name, a valid email and your message.',
    sending: 'Sending …',
    fallback: 'Your email app is opening with your message. Please press send there.',
    fallbackCv: 'Your email app is opening. Please attach your CV there and press send.',
    subject: 'Project enquiry via webbetter.ch', subjectCar: 'Application via webbetter.ch',
    fileType: 'Please upload a PDF or Word file.', fileSize: 'The file is larger than 3 MB.'
  };

  function setup(id, trigger, endpoint, kind) {
    const dlg = document.getElementById(id);
    if (!dlg || typeof dlg.showModal !== 'function') return;
    const form = dlg.querySelector('form'), status = dlg.querySelector('.enq-status');
    const done = dlg.querySelector('.enq-done'), sendBtn = dlg.querySelector('.enq-send');
    let last = null;
    const open = (e, el) => {
      e?.preventDefault(); last = el || null;
      form.hidden = false; done.hidden = true; status.textContent = '';
      dlg.showModal(); document.documentElement.classList.add('enq-open');
      setTimeout(() => form.querySelector('input[name="name"]')?.focus(), 250);
    };
    const close = () => { dlg.classList.add('closing'); setTimeout(() => { dlg.classList.remove('closing'); dlg.close(); }, 260); };
    dlg.addEventListener('close', () => { document.documentElement.classList.remove('enq-open'); last?.focus?.(); });
    document.addEventListener('click', e => { const el = e.target.closest(`[${trigger}]`); if (el) open(e, el); });
    dlg.querySelector('.enq-close').addEventListener('click', close);
    dlg.querySelector('.enq-again').addEventListener('click', close);
    dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });

    // CV upload: click or drag a file onto the drop zone
    const drop = dlg.querySelector('.car-drop'), file = drop?.querySelector('input[type=file]'), fileLabel = drop?.querySelector('.car-file');
    const checkFile = f => {
      if (!f) return '';
      if (!/\.(pdf|docx?)$/i.test(f.name)) return L.fileType;
      if (f.size > 3 * 1024 * 1024) return L.fileSize;
      return '';
    };
    const showFile = () => {
      const f = file.files[0], err = checkFile(f);
      drop.classList.toggle('has', !!f && !err); drop.classList.toggle('bad', !!err);
      fileLabel.hidden = !f; fileLabel.textContent = f ? (err || `${f.name} · ${(f.size / 1024 / 1024).toFixed(1)} MB`) : '';
    };
    if (drop) {
      file.addEventListener('change', showFile);
      ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
      ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
      drop.addEventListener('drop', e => { if (e.dataTransfer.files.length) { file.files = e.dataTransfer.files; showFile(); } });
    }
    const toBase64 = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(f); });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        name: (fd.get('name') || '').trim(), email: (fd.get('email') || '').trim(), message: (fd.get('message') || '').trim(),
        company: (fd.get('company') || '').trim(), phone: (fd.get('phone') || '').trim(), budget: fd.get('budget') || '',
        interests: fd.getAll('interests'), role: fd.get('role') || '', link: (fd.get('link') || '').trim(),
        website: fd.get('website') || '', lang: de ? 'de' : 'en', page: location.pathname
      };
      const bad = !data.name || !EMAIL.test(data.email) || data.message.length < 5;
      form.querySelectorAll('[required]').forEach(i => i.closest('.enq-field').classList.toggle('bad', !i.value.trim() || (i.type === 'email' && !EMAIL.test(i.value.trim()))));
      if (bad) { status.textContent = L.need; status.className = 'enq-status err'; return; }
      const f = file?.files[0], ferr = checkFile(f);
      if (ferr) { status.textContent = ferr; status.className = 'enq-status err'; return; }

      status.textContent = L.sending; status.className = 'enq-status';
      sendBtn.disabled = true; dlg.classList.add('sending');
      let ok = false;
      try {
        if (f) data.cv = { name: f.name, type: f.type || 'application/octet-stream', data: await toBase64(f) };
        const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        ok = r.ok;
      } catch (err) { ok = false; }
      sendBtn.disabled = false; dlg.classList.remove('sending');
      if (ok) { form.hidden = true; done.hidden = false; form.reset(); if (drop) showFile(); status.textContent = ''; return; }

      // fallback: the visitor's own email app, so nothing is lost
      const lines = (kind === 'careers' ? [
        `Name: ${data.name}`, `Email: ${data.email}`, data.role && `Role: ${data.role}`, data.link && `Portfolio/LinkedIn: ${data.link}`
      ] : [
        `Name: ${data.name}`, data.company && `Company: ${data.company}`, `Email: ${data.email}`, data.phone && `Phone: ${data.phone}`,
        data.interests.length && `Interests: ${data.interests.join(', ')}`, data.budget && `Budget: ${data.budget}`
      ]).filter(Boolean).join('\n') + '\n\n' + data.message;
      const subject = kind === 'careers' ? `${L.subjectCar}: ${data.role}` : L.subject;
      location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
      status.textContent = kind === 'careers' && f ? L.fallbackCv : L.fallback; status.className = 'enq-status';
    });
  }

  setup('enquiry', 'data-enquiry', '/api/enquiry', 'enquiry');
  setup('careers', 'data-careers', '/api/careers', 'careers');
})();
