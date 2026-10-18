import { createHmac } from 'node:crypto';
import { CONTACT_SUBJECTS, type ContactData } from './contact';

export function escapeHtml(text: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (character) => entities[character]);
}

/** The payload and key must stay identical when an uncertain request is retried. */
export function createContactEmail(data: ContactData, to: string, secret: string) {
  const subjectLabel = CONTACT_SUBJECTS[data.temat_wybrany];
  const text = [
    `Imię i nazwisko: ${data.name}`, `Email: ${data.email}`,
    `Telefon: ${data.phone}`, `Temat: ${subjectLabel}`, '', data.message,
  ].join('\n');
  const phoneLink = data.phone.replace(/[ ()-]/g, '');
  const payload = {
    from: 'Formularz InvestDom <formularz@investdom.com.pl>',
    to: [to],
    reply_to: data.email,
    subject: `Nowa wiadomość od ${data.name} - ${subjectLabel}`,
    text,
    html: `<!doctype html><html lang="pl"><head><meta charset="utf-8"></head>
      <body style="font-family:Arial,sans-serif;line-height:1.6;color:#333">
        <main style="max-width:600px;margin:auto;padding:20px">
          <h1 style="font-size:24px;color:#1a3b5d">Nowa wiadomość z formularza INVESTDOM</h1>
          <p><strong>Imię i nazwisko:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
          <p><strong>Telefon:</strong> <a href="tel:${escapeHtml(phoneLink)}">${escapeHtml(data.phone)}</a></p>
          <p><strong>Temat:</strong> ${escapeHtml(subjectLabel)}</p>
          <div style="white-space:pre-wrap">${escapeHtml(data.message)}</div>
          <p style="font-size:12px;color:#555">Formularz kontaktowy investdom.com.pl</p>
        </main>
      </body></html>`,
  };
  const body = JSON.stringify(payload);
  return {
    body,
    // Resend keeps idempotency keys for 24 hours. No personal data in the header.
    idempotencyKey: `contact-v1-${createHmac('sha256', secret).update(body).digest('hex')}`,
  };
}
