import { CONTACT_MESSAGES, validateContactData } from '../lib/contact';

export function setupContactForm() {
  const form = document.querySelector<HTMLFormElement>('#contact-form');
  const status = form?.querySelector<HTMLElement>('#status');
  const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!form || !status || !submit || form.dataset.contactEnhanced === 'true') return;
  form.dataset.contactEnhanced = 'true';
  let sending = false;

  const showStatus = (message: string, kind: 'loading' | 'success' | 'error') => {
    status.textContent = message;
    status.classList.remove('hidden', 'text-green-700', 'text-red-600', 'text-navy-900');
    status.classList.add(kind === 'success' ? 'text-green-700' : kind === 'error' ? 'text-red-600' : 'text-navy-900');
  };

  form.addEventListener('input', (event) => {
    if (event.target instanceof HTMLElement) event.target.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const fields = new FormData(form);
    const validated = validateContactData(Object.fromEntries(fields));
    if (!validated.ok) {
      showStatus(validated.error, 'error');
      const field = validated.field ? form.elements.namedItem(validated.field) : null;
      if (field instanceof HTMLElement) {
        field.setAttribute('aria-invalid', 'true');
        field.focus();
      }
      return;
    }

    sending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    showStatus(CONTACT_MESSAGES.loading, 'loading');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...validated.data, website: fields.get('website') ?? '' }),
        signal: controller.signal,
      });
      const result: unknown = await response.json().catch(() => null);
      if (response.ok && result && typeof result === 'object' && 'success' in result && result.success === true) {
        form.reset();
        showStatus(CONTACT_MESSAGES.success, 'success');
      } else {
        const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
          ? result.error
          : response.status === 429
            ? 'Zbyt wiele prób wysyłki. Odczekaj chwilę lub skontaktuj się z nami telefonicznie.'
            : CONTACT_MESSAGES.unavailable;
        showStatus(message, 'error');
      }
    } catch {
      showStatus(CONTACT_MESSAGES.connection, 'error');
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}
