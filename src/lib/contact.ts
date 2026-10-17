export const CONTACT_LIMITS = { name: 100, email: 254, phone: 32, message: 5000 } as const;

export const CONTACT_SUBJECTS = {
  kupno: 'Chcę kupić dom',
  budowa: 'Zlecenie budowy domu',
  inne: 'Inne zapytanie',
} as const;

export const PHONE_PATTERN = String.raw`\+?[0-9 \-\(\)]{9,32}`;
const phonePattern = new RegExp(`^(?:${PHONE_PATTERN})$`);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const singleLineControlCharacters = /[\u0000-\u001f\u007f]/;

export const CONTACT_MESSAGES = {
  success: 'Dziękujemy! Wiadomość została wysłana pomyślnie.',
  loading: 'Wysyłanie wiadomości...',
  invalid: 'Sprawdź dane formularza i spróbuj ponownie.',
  tooLarge: 'Wiadomość jest zbyt długa. Skróć ją i spróbuj ponownie.',
  unavailable: 'Nie udało się potwierdzić wysyłki wiadomości. Spróbuj ponownie później lub skontaktuj się z nami telefonicznie.',
  connection: 'Nie udało się potwierdzić wysyłki. Sprawdź połączenie i spróbuj ponownie z tą samą treścią lub zadzwoń do nas.',
} as const;

export type ContactSubject = keyof typeof CONTACT_SUBJECTS;
export type ContactField = keyof typeof CONTACT_LIMITS | 'temat_wybrany';
export interface ContactData {
  name: string;
  email: string;
  phone: string;
  temat_wybrany: ContactSubject;
  message: string;
}
type ContactValidation =
  | { ok: true; data: ContactData }
  | { ok: false; error: string; field?: ContactField };

/** Validate untrusted network data as well as the enhanced browser form. */
export function validateContactData(value: unknown): ContactValidation {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: CONTACT_MESSAGES.invalid };
  }
  const input = value as Record<string, unknown>;
  const fields = Object.keys(CONTACT_LIMITS) as (keyof typeof CONTACT_LIMITS)[];
  const normalized: Record<string, string> = {};
  for (const field of fields) {
    const raw = input[field];
    if (typeof raw !== 'string') {
      return { ok: false, error: 'Wypełnij wszystkie wymagane pola.', field };
    }
    // Native textarea POST uses CRLF; its DOM value and JSON use LF.
    const text = (field === 'message' ? raw.replace(/\r\n?/g, '\n') : raw).trim();
    if (!text || text.length > CONTACT_LIMITS[field]) {
      return { ok: false, error: `Uzupełnij pole zgodnie z limitem ${CONTACT_LIMITS[field]} znaków.`, field };
    }
    normalized[field] = text;
  }
  if (singleLineControlCharacters.test(normalized.name)) {
    return { ok: false, error: 'Podaj imię i nazwisko w jednym wierszu.', field: 'name' };
  }
  if (!emailPattern.test(normalized.email) || singleLineControlCharacters.test(normalized.email)) {
    return { ok: false, error: 'Podaj poprawny adres email.', field: 'email' };
  }
  const digits = normalized.phone.replace(/\D/g, '');
  if (!phonePattern.test(normalized.phone) || digits.length < 9 || digits.length > 15) {
    return { ok: false, error: 'Podaj poprawny numer telefonu (od 9 do 15 cyfr).', field: 'phone' };
  }
  if (/\u0000/.test(normalized.message)) {
    return { ok: false, error: CONTACT_MESSAGES.invalid, field: 'message' };
  }
  if (typeof input.temat_wybrany !== 'string' || !Object.hasOwn(CONTACT_SUBJECTS, input.temat_wybrany)) {
    return { ok: false, error: 'Wybierz temat z listy.', field: 'temat_wybrany' };
  }
  return {
    ok: true,
    data: {
      name: normalized.name,
      email: normalized.email,
      phone: normalized.phone,
      message: normalized.message,
      temat_wybrany: input.temat_wybrany as ContactSubject,
    },
  };
}
