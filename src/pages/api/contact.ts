import type { APIRoute } from 'astro';
import { CONTACT_MESSAGES, validateContactData } from '../../lib/contact';
import { createContactEmail, escapeHtml } from '../../lib/contact-email';

export const prerender = false;
// urlencoded Polish/non-Latin text can use up to nine bytes per UTF-16 unit.
const MAX_BODY_BYTES = 64 * 1024;
const BODY_TIMEOUT_MS = 3000;
const PROVIDER_TIMEOUT_MS = 8000;

class ContactRequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function readPayload(request: Request): Promise<unknown> {
  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json' && contentType !== 'application/x-www-form-urlencoded') {
    throw new ContactRequestError(415, CONTACT_MESSAGES.invalid);
  }
  const advertisedLength = request.headers.get('content-length');
  if (advertisedLength && (!/^\d+$/.test(advertisedLength) || Number(advertisedLength) > MAX_BODY_BYTES)) {
    throw new ContactRequestError(413, CONTACT_MESSAGES.tooLarge);
  }
  if (!request.body) throw new ContactRequestError(400, CONTACT_MESSAGES.invalid);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new ContactRequestError(408, CONTACT_MESSAGES.connection)), BODY_TIMEOUT_MS);
  });
  try {
    for (;;) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) throw new ContactRequestError(413, CONTACT_MESSAGES.tooLarge);
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    if (contentType === 'application/json') return JSON.parse(text) as unknown;
    const fields = new URLSearchParams(text);
    const seen = new Set<string>();
    for (const key of fields.keys()) {
      if (seen.has(key)) throw new ContactRequestError(400, CONTACT_MESSAGES.invalid);
      seen.add(key);
    }
    return Object.fromEntries(fields);
  } catch (error) {
    void reader.cancel().catch(() => {});
    if (error instanceof ContactRequestError) throw error;
    throw new ContactRequestError(400, CONTACT_MESSAGES.invalid);
  } finally {
    clearTimeout(timeout);
    reader.releaseLock();
  }
}

function reply(request: Request, status: number, message: string, success = false): Response {
  const headers = new Headers({
    'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow',
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
  });
  const wantsJson = request.headers.get('accept')?.includes('application/json') ||
    request.headers.get('content-type')?.toLowerCase().startsWith('application/json');
  if (wantsJson) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return new Response(JSON.stringify(success ? { success: true, message } : { error: message }), { status, headers });
  }
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'");
  const title = success ? 'Wiadomość wysłana' : 'Sprawdź wysyłkę wiadomości';
  return new Response(`<!doctype html><html lang="pl"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="robots" content="noindex,nofollow"><title>${title} | INVESTDOM</title>
    <style>body{font:1rem/1.6 system-ui,sans-serif;background:#fafaf9;color:#1a3b5d;margin:0;padding:24px}main{max-width:40rem;margin:10vh auto;background:white;padding:32px;border-radius:16px}h1{font-size:1.75rem}a{color:inherit;display:inline-block;padding:12px 0}a:focus-visible{outline:2px solid;outline-offset:4px}</style>
    </head><body><main><h1>${title}</h1><p role="status">${escapeHtml(message)}</p>
    ${success ? '' : '<p>Użyj przycisku „Wstecz”, aby wrócić do wpisanych danych.</p>'}
    <a href="/#kontakt">Wróć do kontaktu z INVESTDOM</a></main></body></html>`, { status, headers });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const origin = request.headers.get('origin');
    if ((origin && origin !== new URL(request.url).origin) || request.headers.get('sec-fetch-site') === 'cross-site') {
      return reply(request, 403, CONTACT_MESSAGES.invalid);
    }
    const payload = await readPayload(request);
    const validated = validateContactData(payload);
    if (!validated.ok) return reply(request, 400, validated.error);
    const honeypot = (payload as Record<string, unknown>).website;
    if (honeypot !== undefined && (typeof honeypot !== 'string' || honeypot.length > 0)) {
      return reply(request, 200, CONTACT_MESSAGES.success, true);
    }

    const apiKey = import.meta.env.RESEND_API_KEY?.trim();
    // Preserve the destination until the owner confirms the fallback domain.
    const to = (import.meta.env.CONTACT_EMAIL || 'kontakt@investdom.com.pl').trim();
    if (!apiKey || !to) {
      console.error('Contact delivery configuration is missing.');
      return reply(request, 503, CONTACT_MESSAGES.unavailable);
    }

    const email = createContactEmail(validated.data, to, apiKey);
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': email.idempotencyKey,
      },
      body: email.body,
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error('Contact provider rejected delivery.', { status: response.status });
      await response.body?.cancel();
      return reply(request, 502, CONTACT_MESSAGES.unavailable);
    }
    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string' || !result.id) {
      return reply(request, 502, CONTACT_MESSAGES.unavailable);
    }
    return reply(request, 200, CONTACT_MESSAGES.success, true);
  } catch (error) {
    if (error instanceof ContactRequestError) return reply(request, error.status, error.message);
    console.error('Contact delivery could not be confirmed.');
    return reply(request, 503, CONTACT_MESSAGES.unavailable);
  }
};
