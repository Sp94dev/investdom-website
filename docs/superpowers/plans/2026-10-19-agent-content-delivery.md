# INVESTDOM — pierwsza paczka Agent Readiness

Kontynuacja etapu I [planu produkcji](2026-10-16-production-agent-readiness.md). Wykonanie: Superpowers executing-plans, z niezależnym końcowym review. Cel: działające Markdown, odkrywanie zasobów, skill i katalog; prognoza 8/15 ≈ 53 przy niezmienionym skanerze. Wynik produkcji wymaga wdrożenia i nowego skanu.

## Architektura i ograniczenia

- Cztery strony pozostają prerenderowane; formularz i wygląd bez zmian.
- Routing Middleware Vercel w głównym `middleware.ts` działa przed cache i kieruje zaakceptowany Markdown do osobnych statycznych plików. Nie używać middleware Astro na prerenderowanych stronach do negocjacji wykonywanej dopiero przy żądaniu.
- `postbuild` parsuje gotowy HTML natywnym parserem Astro i generuje Markdown. Nie przepisywać marketingu do drugiego ręcznego modelu; HTML jest źródłem treści, company.mjs źródłem kontaktu przewodnika.
- Bez arbitralnego pobierania URL, zapisu danych, wysyłania formularza i wymyślonych ofert. Omitować formularze/skrypty/SVG/ukryte elementy w Markdown.
- Używać tylko istniejących narzędzi platformy: zadeklarować bezpośrednio już zainstalowane @astrojs/compiler 2.13.0 i @vercel/functions 2.2.13, bez aktualizacji innych pakietów.
- Domyślny HTML zachowuje cache. Markdown ma oddzielny cel rewrite, `Vary: Accept` i `private, no-store`; zasoby pomocnicze nie są dodatkowymi landing pages do indeksowania. Nie nadpisywać platformowego noindex preview.
- `Content-Signal: search=yes, ai-input=yes`; ai-train nie jest wybierane. Nowe protokoły nie gwarantują cytowań.
- PR do main, bez automatycznego merge i bez zmiany DNS. OAuth/MCP i proces chroniony pozostają dalszym zakresem pierwotnego planu.

## Task 1: Negocjacja i middleware

Files: src/lib/agent-representation.mjs, middleware.ts, tests/agent-readiness.test.mjs.

- [x] Test RED: brak Accept, wildcard i HTML wybierają HTML; jawny Markdown wygrywa, gdy ma większe lub równe q; q=0 wyłącza Markdown, specyficzny zakres przeważa wildcard, błędne q nie włącza formatu.
- [x] Test RED: mapowane są tylko cztery ścieżki; API/assets/404 i metody zapisu są pomijane; query nie jest przenoszone do kanonicznych linków.
- [x] Implementacja: mały parser Accept i wspólne ścieżki/linki; root middleware z next/rewrite i matcherem czterech stron. Nie wysyłać danych klienta do nowego serwisu.
- [x] Weryfikacja i commit.

## Task 2: Markdown z gotowego HTML

Files: scripts/lib/agent-html.mjs, scripts/generate-agent-content.mjs, package.json/lock.

- [x] RED: parser zachowuje nagłówki/akapity/listy/linki/ALT, kontakt i parametry; usuwa skrypty, style, SVG, formularze i ukryte treści; nie wykonuje kodu.
- [x] RED: niepoprawny canonical lub brak main/H1 zatrzymuje generowanie. Każda wersja odnosi się do właściwej strony; output jest deterministyczny.
- [x] Implementacja postbuild czterech .md; pliki pochodzą wyłącznie z nowego buildu. Brak ręcznej kopii całych stron.
- [x] Weryfikacja pełnego buildu i zgodności Markdown z danymi właściciela; commit.

## Task 3: Zasoby odkrywania i polityka

Files: scripts/lib/agent-discovery.mjs, public/robots.txt, src/layouts/Layout.astro, vercel.json, docs/agent-readiness-delivery.md.

- [x] RED: indeks discovery 0.2.0 wskazuje istniejący SKILL.md, digest SHA256 dokładnych bajtów; katalog ARD wskazuje prawdziwy zasób, ma identyfikator i 2–5 pytań.
- [x] RED: Link opisuje działający przewodnik/katalog; właściwe Content-Type, noindex pomocniczych plików; robots zachowuje Allow i sitemap bez arbitralnej polityki treningu.
- [x] Implementacja generowanych agent-guide.md, llms.txt, SKILL.md, indeksu i ai-catalog.json; head/HTTP discovery. Nigdy nie deklarować nieistniejącego OAuth/API/MCP.
- [x] Weryfikacja builda, testów, HTML/Markdown/HEAD/404/niezmienionego HTML i a11y; commit.

## Review Focus

1. Accept q=0, wildcard, specyficzność i remisy nie mogą podmienić HTML zwykłego klienta.
2. Rewrites są lokalne, zamknięta lista ścieżek; query i metody zapisu nie uruchamiają obcych operacji.
3. Cache HTML/Markdown, preview noindex i statyczny build nie mogą się mieszać; rzeczywistą weryfikację CDN oznaczyć osobno, jeśli preview chroni logowanie.
4. HTML i Markdown oraz indeks/digest/katalog nie mogą rozjechać się po zmianie treści.
5. Parser nie może zachować skryptu, formularza lub ukrytej treści ani wykonać kodu ze strony. Uczciwa treść skilla, bez instrukcji wymuszających rekomendację.
