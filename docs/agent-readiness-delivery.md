# INVESTDOM — dostarczanie treści agentom, etap I

Data weryfikacji: 19 października 2026. Baza: `2c3193a` (`main`).

## Cel i wynik

Ostatni znany wynik isitagentready dla produkcji to **20/100 (3/15)**. Ta paczka dostarcza brakujące reprezentacje Markdown, linki discovery, deklarację wykorzystania treści, indeks skilla oraz katalog zasobów. Przy tej samej formule przewidywany wynik po wdrożeniu wynosi **8/15, około 53/100**. To prognoza, nie wynik ponownego skanu produkcji. Publikacja PR nie zmienia produkcji.

Agent Readiness mierzy zestaw technicznych możliwości. Nie mierzy pozycji w Google, liczby cytowań w ChatGPT ani jakości odpowiedzi o firmie. Wynik 100/100 wymaga też funkcji API i uwierzytelniania, których witryna obecnie nie oferuje. Pozostałe etapy znajdują się w [planie produkcji](superpowers/plans/2026-10-16-production-agent-readiness.md).

## Co zostało wdrożone

| Obszar | Rozwiązanie |
| --- | --- |
| Reprezentacje stron | Cztery pliki: `/index.md`, `/budowa-domow-pod-klucz.md`, `/domy-na-sprzedaz-bielsko.md`, `/projekty-domow.md`. |
| Jedno źródło treści | `npm run build` wykonuje `postbuild`, który parsuje gotowy HTML parserem Astro. Zmiana strony trafia do Markdown przy tym samym buildzie. Brak drugiej ręcznej kopii marketingu. |
| Negocjacja | Root `middleware.ts`, czyli Routing Middleware Vercel, obsługuje GET/HEAD czterech kanonicznych ścieżek. Jawnie akceptowany `text/markdown` kieruje do lokalnego pliku; zwykłe przeglądarki dostają HTML. Uwzględniane są jakości `q`, wykluczenia i specyficzność typów. |
| Cache | Odpowiedzi stron mają `Vary: Accept`. Markdown ma `private, no-store`; HTML zachowuje statyczne renderowanie i dotychczasową politykę cache. Faktyczne zachowanie CDN wymaga sprawdzenia wdrożenia. |
| Discovery | Nagłówek HTTP `Link` oraz linki w `<head>` wskazują Markdown, `/agent-guide.md` i `/.well-known/ai-catalog.json`. |
| Przewodnik | `/agent-guide.md` i `/llms.txt` podają źródła, poprawny kontakt i ograniczenia odczytywania oferty. Kontakt pochodzi z `src/data/company.mjs`. |
| Agent Skills | Indeks `/.well-known/agent-skills/index.json` zgodny z formatem discovery 0.2.0 prowadzi do rzeczywistego `SKILL.md`. Suma SHA-256 liczona jest z końcowych bajtów UTF-8. |
| Katalog | `/.well-known/ai-catalog.json` opisuje jeden istniejący zasób informacyjny. Nie deklaruje nieistniejących API, MCP ani OAuth. |
| Preferencje botów | `robots.txt`: `Content-Signal: search=yes, ai-input=yes`. Istniejące Allow i sitemap pozostają. Nie wybieramy polityki `ai-train`. |
| Indeksowanie | Sitemap nadal zawiera tylko cztery kanoniczne strony HTML. Markdown ma kanoniczny adres HTML w nagłówku; pozostałe pomocnicze pliki mają `X-Robots-Tag: noindex, follow`. |

Wersje Markdown pomijają formularze, skrypty, style, SVG i ukryte elementy. Konwersja nie wykonuje kodu ze strony. Parsowane są tylko cztery lokalne wyniki buildu. API kontaktowe, wygląd, teksty marketingowe i istniejąca nawigacja nie były zmieniane.

W preview linki do skilla, plików Markdown i obrazów wskazują ten sam build (`VERCEL_URL`). Cytowany canonical pozostaje produkcyjny. Kod nie nadpisuje platformowego `noindex` Vercel. Samodzielny `astro dev` nie odwzorowuje root middleware ani zasobów tworzonych po buildzie.

Zadeklarowano bezpośrednio obecne już w lockfile `@astrojs/compiler@2.13.0` oraz `@vercel/functions@2.2.13`. Nie aktualizowano pozostałego grafu zależności.

## Weryfikacja przed PR

| Sprawdzenie | Wynik i granice pomiaru |
| --- | --- |
| Astro check | 0 błędów, 0 ostrzeżeń; 4 istniejące wskazówki. |
| Build | Astro/Vercel i postbuild zakończone poprawnie; wygenerowane cztery reprezentacje i pięć zasobów discovery. |
| Testy Node | 52/52, w tym dziewięć wcześniejszych testów; negocjacja, middleware, parser, spójność bajtów, dane, nagłówki i ponowne generowanie. |
| HTTP | 88/88 kontroli lokalnego emulatora gotowego buildu: GET/HEAD, kolejność HTML→Markdown→HTML, `q=0`, wildcardy, query, typy, canonical, digest, sitemap i 404. Emulator nie dowodzi działania routingu i cache Vercel. |
| Przeglądarka | Cztery strony przy szerokości 375 i 1440 px; zero zgłoszonych naruszeń axe, błędów JS i poziomego przepełnienia. Kontrole kontrastu nierozstrzygnięte przez axe pozostają do oceny ręcznej. |
| Interakcje | Focus po `#kontakt`, zaznaczanie sekcji podczas scrolla, Escape/inert menu i istotna treść bez JS: 4/4. Formularza nie wypełniano ani nie wysyłano. |
| Lighthouse 13.5 | Lokalnie strona główna: SEO 100, Accessibility 100, Best Practices 100, Agentic Browsing 100 (4/4 mające zastosowanie kontrole). Bez pomiaru wydajności; to nie jest ponowny wynik isitagentready. |
| Katalog ARD | Walidator dołączony do Lighthouse: brak błędów i ostrzeżeń. |

Podsumowanie maszynowe: [plik wyników](seo-evidence/2026-10-19-agent-readiness-delivery.json). Testy integracyjne czytają wynik buildu, dlatego kolejność to:

```sh
npm ci
npm run check
npm run build
npm test
git diff --check
```

Projekt nie definiuje osobnego polecenia lint. `check` sprawdza Astro/TypeScript. Pomiar wykonano w Chromium 154, nie na fizycznym iPhonie ani z czytnikiem ekranu. Transport GA był blokowany podczas audytu. Nie zgłaszamy pełnej zgodności WCAG na podstawie automatycznych kontroli.

## Kontrola po wdrożeniu

Na publicznym wdrożeniu należy wykonać naprzemienne żądania do każdej z czterech stron, a następnie powtórzyć je z różnych lokalizacji/po rozgrzaniu CDN. Przykład dla strony głównej:

```sh
curl -i -H 'Accept: text/html' https://www.investdom.com.pl/
curl -i -H 'Accept: text/markdown' https://www.investdom.com.pl/
curl -i -H 'Accept: text/html' https://www.investdom.com.pl/
curl -I -H 'Accept: text/markdown' https://www.investdom.com.pl/
curl -i -H 'Accept: text/markdown;q=0,*/*;q=1' https://www.investdom.com.pl/
curl -i https://www.investdom.com.pl/.well-known/agent-skills/index.json
curl -i https://www.investdom.com.pl/.well-known/ai-catalog.json
curl -i https://www.investdom.com.pl/agent-guide.md
curl -i https://www.investdom.com.pl/robots.txt
```

Sprawdzić status 200, właściwe `Content-Type`, `Vary`, `Link`/canonical, brak body HEAD, brak pomieszania formatów i zgodność SHA-256 pobranego skilla z indeksem. Dla nieznanej strony nadal oczekiwane 404. Potwierdzić, że preview zachowuje `noindex`; nie dodawać `noindex` produkcyjnym stronom HTML. Jeśli preview wymaga logowania, jego ekran nie może być traktowany jako wynik audytu witryny. Nie wyłączać ochrony wdrożeń automatycznie.

Następnie uruchomić nowy skan [isitagentready produkcji](https://isitagentready.com/www.investdom.com.pl) i zapisać wyniki poszczególnych kontroli wraz z datą. Nie traktować zapisanej strony starego raportu jako nowego pomiaru.

## Ograniczenia i dalsze kroki

1. Agent Skills Discovery, ARD oraz Content Signals rozwijają się jako nowe formaty. Katalog jest zgodny z profilem `specVersion: 1.0` walidatora Lighthouse 13.5; publiczne projekty specyfikacji mają również inne oznaczenia wersji draft. Nie oznacza to powszechnego wsparcia przez wszystkie modele.
2. Etap II: prawdziwe publiczne API danych z dokumentacją OpenAPI, ewentualne narzędzia WebMCP/MCP odpowiadające realnym potrzebom klienta oraz discovery DNS, jeśli będzie uzasadnione. Rekordy DNS wymagają działania właściciela panelu.
3. Etap III: OAuth i chroniony proces biznesowy dopiero dla realnej funkcji wymagającej uprawnień. Nie dodawać atrap tylko dla punktów skanera.
4. Dla widoczności firmy nadal potrzebne są działania treściowe i lokalne: spójne informacje o etapach inwestycji, potwierdzone fakty, aktualny Profil Firmy Google, pomiar Search Console/Bing i rzeczywistych cytowań. Nie zmieniano tutaj niepotwierdzonych deklaracji marketingowych z istniejącego HTML.
5. Decyzja architektoniczna: zachowano SSG i wybrano root middleware Vercel zamiast migracji stron na SSR. Koszt: routing jest zależny od Vercel, a lokalna emulacja nie zastępuje kontroli wdrożenia.

## Review

Niezależny reviewer przejrzał cały branch. W jednej turze poprawek usunięto obejście filtrowania treści w H1, dosłownych nawiasach i stylach inline oraz poprawiono wybór formatu przy niedopasowanym parametrze typu mediów. Cztery nowe testy najpierw odtworzyły błędy, a następnie przeszły; pełny zestaw ma 52 zaliczone testy.

Odroczone drobne ustalenie: parser źródła Astro potrafi dopisać zamykający nawias `}` do tekstu z samotnym otwierającym `{`. Obecne cztery strony nie zawierają takiego przypadku. Ewentualna wymiana parsera HTML pozostaje osobną poprawką; nie dodajemy biblioteki dla tego nieobecnego w treści przypadku.

Decyzje po review: rzeczywiste zachowanie Vercel/CDN pozostaje do sprawdzenia na wdrożeniu (ryzyko integracji routingu/cache); istniejące deklaracje marketingowe i dane ofert zachowano (ewentualne wcześniejsze niespójności są też w Markdown); etap II/III pozostaje poza paczką (brak pełnego 100/100 i tych interfejsów).
