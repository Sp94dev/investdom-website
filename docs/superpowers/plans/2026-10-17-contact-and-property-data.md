# Formularz kontaktowy i wspólne dane inwestycji

## Cel i zaakceptowany zakres

Właściciel zlecił punkty 2 i 4 kolejnych działań: uporządkowanie formularza oraz ujednolicenie danych ofert. Potwierdził poprawność istniejących danych inwestycji 2026-10-17. Zachować wygląd, fokus/nawigację kontaktu, treści i warianty AVIF/WebP.

Baza: `01c9a8e` / `perf/seo-images-metadata` (otwarty PR #3). Branch: `fix/contact-and-property-data`. Nowy PR kierować do tego brancha; po scaleniu #3 można skierować go na main. Nie scalać starszych PR bez polecenia.

## Ograniczenia i decyzje

- Brak nowych bibliotek. Współdzielona walidacja TypeScript i natywne Web API.
- Nie dodawać ani nie uruchamiać testów bez osobnego zlecenia, zgodnie z instrukcją środowiska. Kontrole w tym zadaniu: Astro Check, build, diff oraz niezależny przegląd. Nie deklarować testów ani rzeczywistej dostawy emaili.
- Checkout odtworzono w nowym środowisku; wcześniejsze lokalne, nieopublikowane pliki nie są dostępne. Pracować na osobnym branchu w tym checkoutcie.
- Adres docelowy maili wymaga odpowiedzi na pytanie. Do tego czasu zachować pierwszeństwo CONTACT_EMAIL i istniejący fallback; nie zmieniać domeny przez domysł.
- Bez dostępu do panelu Vercel nie można włączyć trwałego limitu żądań między instancjami. Dodać zabezpieczenia aplikacji i opisać konkretną regułę WAF jako działanie hostingowe. Nie zastępować jej pamięciowym Map ani nie twierdzić, że honeypot jest rate limiterem.

## Task 1: Współdzielona walidacja i bezpieczny endpoint

**Pliki:** `src/lib/contact.ts`, `src/lib/contact-email.ts`, `src/pages/api/contact.ts`.

1. Zdefiniować pola i limity, zamkniętą listę tematów, komunikaty i walidację payloadu unknown.
2. Ograniczyć odczyt do 64 KiB i czasu oczekiwania; JSON i natywny urlencoded POST. Limit obejmuje także procentowe kodowanie znaków w natywnym formularzu. Błędny typ/formularz zwraca 4xx.
3. Odrzucać żądania z obcym Origin/Sec-Fetch-Site, sprawdzać ukryte pole honeypot.
4. Użyć natywnego fetch do istniejącego Resend API z timeoutem i stabilnym kluczem idempotencji wyliczonym po normalizacji; zachować escapowanie HTML i dodać tekstową wersję maila. Nie ujawniać błędów dostawcy.
5. Zwracać JSON klientowi AJAX, a czytelną stronę HTML bez JS. Dane formularza nie trafiają do URL. Odpowiedzi no-store/noindex.

**Interfejs:** klient Task 2 importuje CONTACT_LIMITS, CONTACT_SUBJECTS, CONTACT_MESSAGES, PHONE_PATTERN, validateContactData; endpoint odczytuje te same pola.

**Weryfikacja:** `npm run check`; oczekiwane: brak nowych błędów. Rzeczywista wysyłka wymaga środowiska Resend i osobnej kontroli.

## Task 2: Typowany klient i natywny formularz

**Pliki:** `src/components/sections/Contact.astro`, `src/scripts/contact-form.ts`.

1. Jawne method POST i action /api/contact; te same pola, autocomplete i wygląd. Limity i opcje pochodzą ze wspólnego modułu.
2. Zastąpić duży skrypt inline małym typowanym modułem. Zachować setupContactNavigation.
3. Blokować wielokrotne submit podczas wysyłki, dodać timeout klienta, aria-busy i poprawną obsługę nie-JSON/błędów sieci. Nie resetować danych przy błędzie.
4. Usunąć wyścig timerów statusu; sukces może pozostać widoczny do kolejnej interakcji/wysyłki. Nie obiecywać pewności niewysłania po utracie odpowiedzi.

**Weryfikacja:** `npm run check`; oczekiwane: brak błędów typów skryptu i komponentu.

## Task 3: Jedno źródło danych i przekazanie zmian

**Pliki:** `src/data/properties.ts`, komponent Properties i strony ofert/projektów; dokumentacja.

1. Zdefiniować wspólny typ i dane potwierdzonej inwestycji (cena 895 000 zł, powierzchnia 135 m², działka 700 m², stan deweloperski, 4 pokoje, 2 łazienki). Zachować istniejący opis i zdjęcie.
2. Wszystkie trzy widoki odwołują się do tego źródła; grupowanie po lokalizacji wyliczać z danych. Usunąć komentarz o przykładowej działce. Nie dodawać nowych twierdzeń/ofert do JSON-LD.
3. Opisać konfigurację wysyłki, idempotencję i manualny limit Vercel WAF. Usunąć SDK Resend, jeżeli natywny transport jest jedyną ścieżką wysyłki.
4. Astro Check, build, diff; świeży przegląd całej zmiany, poprawki istotnych usterek; osobny PR z wynikami i ograniczeniami.

**Review Focus:** granica unknown/JSON/urlencoded i duplikaty pól; nazwy prototypu jako temat; bajty i timeout odczytu; brak danych osobowych w URL/logach; spójność stabilnego klucza i faktycznego maila; niepewny wynik transportu; zachowanie bez JS; zachowanie obrazu i kolejności kart; brak deklarowania trwałego rate limitu bez konfiguracji hostingu.

**Weryfikacja:** `npm run check`, `npm run build`, `git diff --check`; oczekiwane: exit 0. Testów nie uruchamiać w tym zadaniu.
