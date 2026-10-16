import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Interface dla danych z formularza
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  temat_wybrany: string;
  message: string;
}

// Mapowanie tematów na czytelne nazwy
const subjectLabels: Record<string, string> = {
  kupno: 'Chcę kupić dom',
  budowa: 'Zlecenie budowy domu',
  inne: 'Inne zapytanie',
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Sprawdź czy API key jest skonfigurowany
    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY nie jest skonfigurowany');
      return new Response(
        JSON.stringify({ error: 'Błąd konfiguracji serwera' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parsuj dane z formularza
    const data: ContactFormData = await request.json();
    const { name, email, phone, temat_wybrany, message } = data;

    // Walidacja wymaganych pól
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Wszystkie wymagane pola muszą być wypełnione' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Walidacja formatu email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Niepoprawny format adresu email' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Inicjalizuj Resend
    const resend = new Resend(apiKey);

    // Przygotuj czytelny temat
    const subjectLabel = subjectLabels[temat_wybrany] || temat_wybrany || 'Kontakt';

    // Wyślij email
    const toEmail = import.meta.env.CONTACT_EMAIL || 'kontakt@investdom.com.pl';
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Formularz InvestDom <formularz@investdom.com.pl>',
      to: toEmail,
      replyTo: email,
      subject: `Nowa wiadomość od ${name} - ${subjectLabel}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0f172a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0f172a; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #0ea5e9; margin-top: 10px; }
            .footer { padding: 15px; font-size: 12px; color: #6c757d; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">📬 Nowa wiadomość z formularza</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">InvestDom - Formularz kontaktowy</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Imię i nazwisko:</div>
                <div class="value">${escapeHtml(name)}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
              </div>
              <div class="field">
                <div class="label">📱 Telefon:</div>
                <div class="value"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone || 'Nie podano')}</a></div>
              </div>
              <div class="field">
                <div class="label">📋 Temat:</div>
                <div class="value">${escapeHtml(subjectLabel)}</div>
              </div>
              <div class="field">
                <div class="label">💬 Wiadomość:</div>
                <div class="message-box">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              Wiadomość wysłana przez formularz kontaktowy na stronie investdom.com.pl
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error('Błąd Resend API:', JSON.stringify(emailError, null, 2));
      return new Response(
        JSON.stringify({ 
          error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.',
          details: emailError.message || emailError.name
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email wysłany pomyślnie:', emailData?.id);

    return new Response(
      JSON.stringify({ success: true, messageId: emailData?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Nieoczekiwany błąd:', error);
    return new Response(
      JSON.stringify({ error: 'Wystąpił nieoczekiwany błąd serwera' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Funkcja pomocnicza do escapowania HTML
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}
