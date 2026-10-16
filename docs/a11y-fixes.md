# Poprawki dostępności — 16.10.2026

Branch: `seo/technical-foundation`, PR #1. Zakres wynika z błędów z poprzedniego Lighthouse i przeglądu źródeł, a nie z odczytu chronionego podglądu Vercel.

## Zmiany

- Powiązano etykietę „Temat” z `select#subject-select`.
- Dodano `inert` do zamkniętego menu mobilnego i synchronizację z `aria-hidden` oraz `aria-expanded`. Zamknięte linki nie uczestniczą w nawigacji klawiaturą. Menu zamyka się po wyborze linku, klawiszem Escape i przy przejściu na szerokość desktop; fokus z zamykanego panelu wraca do przycisku.
- Podniesiono kontrast opisów usług, kontaktu i stopki: `text-stone-400` → `text-stone-300`. Zielone etykiety z białym tekstem: `bg-green-500` → `bg-green-700`. Są to celowe, niewielkie zmiany odcieni potrzebne do poprawienia czytelności; układ pozostaje taki sam.
- Nagłówek projektu zmieniono z H3 na H2 przy zachowaniu klas wizualnych, eliminując przeskok H1 → H3.

## Weryfikacja

- `.agents/bin/seo check`: 0 błędów, 0 ostrzeżeń, 5 istniejących wskazówek.
- `.agents/bin/seo build`: sukces, adapter Vercel i generowanie sitemap zakończone.
- Lokalny Lighthouse 13.5.0 / Chromium 156, mobile, kategoria `accessibility`: wyniki wszystkich czterech stron zapisano w [dowodach](seo-evidence/2026-10-16-a11y.json).
- Nie wysyłano rzeczywistych zapytań z formularza. Lokalny audyt nie potwierdza wdrożenia na produkcji lub podglądzie.

Wynik automatycznego skanera nie oznacza pełnej zgodności z WCAG. Pozostaje manualna ocena czytnikiem ekranu, wszystkich stanów formularza i widoczności fokusu.
