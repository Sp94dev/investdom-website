# INVESTDOM — weryfikacja zmian oraz audyt SEO i GEO

**Data: 18.10.2026. Produkcja: https://www.investdom.com.pl/.** Audyt objął stronę główną i wszystkie trzy publiczne podstrony. Odczyty i pomiary wykonano ponownie, a kod po scaleniu zweryfikowano osobno. [Wyniki pomiarów i kontroli](seo-evidence/2026-10-18-post-merge-seo-geo.json).

## Najważniejszy wniosek: co zostało scalone

PR #4 został scalony do `perf/seo-images-metadata`, czyli brancha **PR #3**. Nie oznacza to publikacji na produkcji. Sprawdzono również publiczny HTML: nadal ma wcześniejszy formularz, brak responsywnych źródeł obrazów i usługę „Remonty”.

| Element | Stan podczas audytu |
|---|---|
| `main` | `e15dcbdc285ebfb37aeb167392b4d583d07c105b` |
| [PR #4 — formularz i wspólne dane](https://github.com/Sp94dev/investdom-website/pull/4) | Scalony do brancha PR #3; merge commit `3ec3a6e723014f5a32079bbe844135423f9ce43c` |
| [PR #3 — obrazy i metadane](https://github.com/Sp94dev/investdom-website/pull/3) | Nadal otwarty do `main`; zawiera już PR #4 |
| [PR #2 — usunięcie remontów](https://github.com/Sp94dev/investdom-website/pull/2) | Nadal otwarty do `main`; niezależny od PR #3 |
| Publiczne podglądy PR #3/#4 | Przekierowują do logowania Vercel. Nie traktowano strony logowania jako wyniku INVESTDOM |

**Nie znaleziono w zbadanym zakresie blokady indeksowania produkcji.** Najpilniejsze są publikacja oczekujących poprawek i zgodność informacji o ofercie. Cytowania przez produkty AI pozostają niezmierzone.

## 1. Weryfikacja kodu po scaleniu

Poniższe kontrole kodu dotyczą **`3ec3a6e`**, a nie aktualnego `main`. Testy przeglądarkowe lokalnego wariantu korzystały z jego skompilowanego wyjścia Vercel, nie z serwera deweloperskiego.

| Kontrola | Wynik |
|---|---|
| `npm run check` | 0 błędów, 0 ostrzeżeń, 4 istniejące podpowiedzi |
| `npm run build` | PASS; cztery prerenderowane strony, 34 warianty obrazów, dynamiczne API kontaktu |
| `npm test` | **9/9 PASS** |
| Dodatkowe kontrole regresji API/formularza | **37/37 PASS**, atrapą dostawcy maili, bez rzeczywistej wysyłki |
| `npm run check:seo -- <base-url> https://www.investdom.com.pl` | PASS dla czterech stron lokalnego builda i osobno dla czterech stron produkcji |
| `git diff --check` | PASS |
| axe-core 4.11.1 | Brak wykrytych naruszeń w **16 widokach**: 4 strony × mobile/desktop × produkcja/lokalny build |
| Stany formularza | Kolejne 4 kontrole axe bez naruszeń: sukces, błąd serwera, odpowiedź 429 inna niż JSON, błąd sieci |

Sprawdzono limity i typy pól, zamkniętą listę tematów, nieprawidłowy JSON/UTF-8, powtórzone pola natywnego formularza, limit 64 KiB także bez Content-Length, timeout odczytu, obcy Origin, honeypot, escapowanie HTML, tekstową wersję wiadomości i idempotencję. Wiadomość długości 5000 znaków z CRLF w natywnym POST i LF w JSON tworzy identyczny payload dostawcy i klucz ponowienia. Błędy dostawcy nie dają fałszywego sukcesu ani nie ujawniają jego odpowiedzi użytkownikowi.

Przeglądarka potwierdziła również:

- kliknięcie kontaktu i wejście przez `#kontakt` ustawiają fokus na formularzu; po zakończeniu przewijania aktywny jest kontakt;
- ręczne przewijanie aktualizuje aktywną sekcję, bez zmiany adresu;
- menu mobilne obsługuje `inert`, Escape i powrót fokusu;
- pola są czyszczone po sukcesie i zachowywane po błędzie; podwójny submit podczas wysyłki uruchamia jeden transport;
- bez JavaScriptu formularz wysyła URLencoded **POST** do `/api/contact`, bez danych w adresie URL;
- preferencja ograniczonego ruchu wyłącza płynne przewijanie;
- żaden z 16 widoków nie miał poziomego overflow przy badanych rozmiarach.

Pierwsza próba natywnej wysyłki przez automatyczne kliknięcie miała timeout oczekiwania Playwright na stabilny element. Powtórzenie przez klawiaturę z wyłączonym JavaScriptem przeszło poprawnie. Nie przedstawiamy pierwszej próby jako zaliczonej ani samego timeoutu jako dowodu awarii formularza.

**Ograniczenia:** Chromium 154.0.8037.57, emulacja 375×812 i 1440×1000; nie był to fizyczny iPhone/Safari ani pełny audyt czytnika ekranu. axe zgłosił na stronie głównej także kontrasty do ręcznej oceny: 10 elementów mobile i 6 desktop, m.in. tekst na zdjęciu/gradiencie. Wynik automatyczny 100 nie zamyka tej oceny. Wyłączenie service workerów w kontrolowanym teście wywoływało błąd inicjalizacji Partytown na produkcji; przy dozwolonych workerach nie odtworzono go. Nie uznano tego za potwierdzoną awarię normalnej sesji.

Nie wysłano poprawnego formularza na produkcji ani prawdziwej wiadomości. API produkcji otrzymało jedynie puste `{}` i zwróciło 400. Dostarczalność Resend, sekrety i reguła WAF wymagają kontroli w panelach właściciela.

## 2. SEO techniczne — co działa

Architektura: **Astro 5 + routing plikowy + Vercel**, HTML generowany przez Astro, bez wymaganej hydratacji aplikacji do odczytu podstawowej treści. W PR #3 cztery strony są jawnie prerenderowane; API kontaktowe pozostaje dynamiczne. Tailwind 4 obsługuje style.

| Obszar produkcji | Wynik i zakres dowodu |
|---|---|
| Cztery publiczne URL | Wszystkie HTTP 200; `/`, `/budowa-domow-pod-klucz`, `/domy-na-sprzedaz-bielsko`, `/projekty-domow` |
| Title, description, canonical | Każda strona ma komplet i unikalne title/description; jeden bezwzględny self canonical |
| Open Graph i Twitter | Kompletne podstawowe metadane; URL zgodne z canonicalem; zastrzeżenie wymiarów OG poniżej |
| Robots | `/robots.txt` 200; `User-agent: *`, `Allow: /`; brak obserwowanej blokady istotnych treści |
| Sitemap | Zadeklarowane `/sitemap-index.xml` i `/sitemap-0.xml` zwracają poprawny XML i dokładnie cztery kanoniczne strony 200 |
| Indeksowalność | Brak meta `noindex` i obserwowanego blokującego `X-Robots-Tag`; to dopuszczenie indeksacji, nie dowód jej wykonania |
| Treści bez JS | Nagłówki, oferta, kontakt, linki i JSON-LD są w pierwszej odpowiedzi HTML |
| Semantyka | Jeden H1 i jeden `main` na stronę, `lang="pl"`, nazwane nawigacje |
| Linki wewnętrzne | 63 wystąpienia linków do stron/fragmentów w badanych dokumentach; bez niedziałających celów |
| Duplikaty | Końcowe `/` podstron przekierowują 308 do wersji bez slash; sprawdzone warianty UTM mają czysty canonical |
| Nieistniejący URL | Prawdziwe HTTP 404, bez przekierowania na stronę główną |
| Zdjęcia | 17 wystąpień `img` ma niepuste ALT; sprawdzone źródła obrazów, logo i OG zwracają 200 |

Nie ma potrzeby zmieniania adresu oferty tylko dlatego, że zawiera „bielsko”; lokalny kontekst powinien być zgodny w H1, opisie i karcie. Zmiana URL wymagałaby osobnego uzasadnienia i przekierowania.

Niższy priorytet ma konfiguracja hostów: HTTPS bez www przekierowuje **307**, a HTTP bez www przechodzi przez dwa skoki **308 → 307 → 200**. Przy trwałym wyborze www warto ustawić stałe 301/308 bezpośrednio do docelowego HTTPS www. Wymaga to kontroli konfiguracji hostingu; obecny łańcuch nie blokuje dotarcia do strony.

## 3. Dane strukturalne

**6/6 bloków JSON-LD parsuje się poprawnie:** cztery `HomeAndConstructionBusiness`, jeden `Service`, jeden `FAQPage`. Stały identyfikator firmy, `Service.provider`, URL oraz treść pytań i odpowiedzi są spójne. Telefon **+48 571 328 993** i adres **ul. Do lasu 25, 43-300 Bielsko-Biała** zgadzają się z potwierdzeniem właściciela i treścią stron.

To walidacja składni i ręczna kontrola zgodności, nie wynik Google Rich Results Test ani Search Console. Brak okruszków w interfejsie nie wymaga dodawania samego `BreadcrumbList`. Brak `Product`/`Offer` przy nieruchomości nie jest automatycznie błędem wyników rozszerzonych. Nie dopisywać ocen, opinii, godzin czy współrzędnych bez danych.

Według aktualizacji Google z 7.05.2026 wyniki rozszerzone FAQ zostały wycofane. Rzetelne FAQ nadal pomaga klientom, ale istniejący markup nie daje obietnicy dodatkowego wyniku Google.

## 4. Wydajność produkcji

**Lighthouse 13.5.0, Chromium 154**, dziewięć kolejnych przebiegów. Strona główna: mediany z trzech prób na urządzenie; podstrony: po jednej próbie mobilnej.

| Wariant | Performance | Accessibility | SEO | Best Practices | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Główna mobile, mediana 3 | **84** | 100 | 100 | 81 | **3,35 s** | **402 ms** | 0 |
| Główna desktop, mediana 3 | 100 | 100 | 100 | 81 | 0,70 s | 0 ms | 0 |
| Budowa mobile, 1 próba | 98 | 100 | 100 | 81 | 1,03 s | 11 ms | 0 |
| Oferty mobile, 1 próba | 98 | 100 | 100 | 81 | 1,02 s | 8 ms | 0 |
| Projekty mobile, 1 próba | 100 | 100 | 100 | 81 | 1,17 s | 21 ms | 0 |

Performance głównej mobile w trzech próbach: **84 / 73 / 88**. Wyniki są laboratoryjne, przez proxy środowiska i z blokadą transportu GA; nie są CrUX ani dowodem poprawy po wdrożeniu. TBT nie zastępuje INP. Nie porównujemy ich bezpośrednio z lokalnymi wynikami poprzedniego audytu, wykonanymi innym Chromium i bez produkcyjnego CDN.

Najważniejsze obserwacje:

1. **Obrazy strony głównej.** Hero pobiera 429 016 B WebP bez `srcset`; HTML deklaruje 1920×1080, plik ma 1920×1440. Lighthouse w pierwszej próbie szacował łącznie ok. 409 KiB potencjalnej oszczędności obrazów. To estymacja narzędzia. PR #3 przygotowuje responsywne AVIF/WebP i poprawne proporcje. Hero już teraz ma eager/high — zachować ten priorytet, nie dodawać lazy loading.
2. **Koszt strony głównej i Partytown.** Widać długie zadania strony i sandboxa Partytown oraz wymuszone przeliczenie layoutu. Po publikacji PR #3 powtórzyć pomiary i profilować pozostałe skrypty/animacje; sam spadek TBT nie dowodzi poprawy terenowego INP.
3. **Best Practices 81.** Wszystkie dziewięć prób ma jedno niezaliczenie: ostrzeżenie o wycofywanym Attribution Reporting w sandboxie Partytown. Aktualizacja integracji w PR #3 nie jest dowodem usunięcia ostrzeżenia. Przed ewentualną zmianą sposobu ładowania GA sprawdzić poprawne działanie analityki.
4. **Konfiguracja fontów.** Nagłówki i większość tekstu mają wyliczony font systemowy, pola formularza — Inter. `@theme` używa `--font-family-*`, a Tailwind 4 oczekuje tokenów `--font-*`. Inter jest pobierany dla formularza; nie należy usuwać wszystkich plików jako „nieużywanych”. Uporządkowanie tokenów lub usunięcie faktycznie zbędnych wariantów wymaga kontroli wyglądu i łamania nagłówków.
5. **Logo i OG.** Na produkcji brakuje jawnych wymiarów logo w HTML, ale zmierzony CLS wyniósł 0. OG deklaruje 1200×630, a rzeczywisty JPG ma 1024×1024 i 640 604 B. PR #3 poprawia deklarowane wymiary; ewentualna kompresja OG to niższy priorytet niż hero.

## 5. GEO — dostęp oraz jakość informacji

### Dostęp wyszukiwarek AI

Żądania z nazwami Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, ChatGPT-User, GPTBot i ClaudeBot zwracają HTTP 200. Aktualny robots pozwala im pobierać treść. Są to **kontrolne, niezweryfikowane nazwy User-Agent z jednego środowiska**, nie dowód wizyt autentycznych robotów, indeksacji ani cytowań. Weryfikacja rzeczywistego dostępu wymaga logów i oficjalnej weryfikacji tożsamości/IP.

Decyzję o robotach treningowych podejmować osobno od dostępu robotów wyszukiwania. Nie trzeba dodawać wielu osobnych `Allow`, skoro wildcard już działa. `/llms.txt` i katalog AI nie istnieją, a `Accept: text/markdown` zwraca HTML; nie są to blokady odczytu istniejącej treści ani wymagania Google AI Search.

### Wiarygodność i użyteczność treści

| Priorytet | Ustalenie | Działanie i warunek odbioru |
|---|---|---|
| **P1** | Produkcja i branch PR #3 nadal oferują „Remonty”, których firma nie wykonuje | Opublikować PR #2; widoczna oferta i aktywne metadane mają odpowiadać rzeczywistym usługom |
| **P1** | Meta oferty nazywa Pisarzowice dzielnicą Bielska i sugeruje gotowe domy, podczas gdy opis mówi o rozpoczynanym etapie II | PR #3 poprawia meta; doprecyzować również H1/intro i aktualny etap. Pisarzowice są w gminie Wilamowice; nie zmieniać tej informacji dla słowa kluczowego |
| **P1** | Zdjęcie etapu I ilustruje ofertę etapu II; wyjaśnienie nie jest widoczne przy każdej karcie | Dodać widoczny podpis na stronie głównej i projektach. Poprawiony ALT z PR #3/#4 nie zastępuje podpisu dla widzącego odbiorcy |
| **P1/P2** | FAQ podaje koszty i terminy bez daty/zakresu; „100% zadowolonych” i gwarancje wymagają podstawy | Potwierdzić te konkretne twierdzenia u właściciela; zatwierdzenie danych domu nie oznacza zatwierdzenia całego FAQ |
| **P2** | Strona projektu zawiera jedną krótką kartę; „Autorskie” wymaga potwierdzenia praw/roli firmy | Wyjaśnić zakres wykonawcy i autorstwo. Rozwinąć rzeczywistą dokumentację projektu zamiast obiecywać katalog wielu typów |
| **P2** | Brakuje pełnej dokumentacji inwestycji i mocnych dowodów doświadczenia | Opisać rzeczywistą realizację: miejscowość, rok, zakres prac, technologia, rozwiązane problemy; dodać własne zdjęcia i dostępne rzuty z prawami publikacji |
| **P2** | GBP jest w `sameAs`, ale nie ma widocznego linku; szczegóły profilu nie zostały wiarygodnie odczytane | Dodać użyteczny odnośnik; w panelu właściciela sprawdzić nazwę, kategorię, obszar, telefon, adres i opinie |

Potwierdzone parametry domu są zgodne między widokami: **895 000 zł, 135 m², działka 700 m², stan deweloperski, 4 pokoje, 2 łazienki**. PR #4 przenosi je do jednego źródła. Nie zgłaszamy ponownie niespójności tych wartości.

Nadal wymagają potwierdzenia: aktualna dostępność i postęp, zakres ceny i podatku, termin, prawa do projektu i materiałów, pełna nazwa działalności oraz twierdzenia o doświadczeniu/rezultatach. Nie dopisywać tych danych na podstawie podobnej firmy w katalogu.

Link GBP właściciela prowadzi do encji `/g/11yn13tdbh`, z nazwą wyszukiwania „FIRMA USŁUGOWA INVEST DOM Paduch Andrzej”. Odczyt przekierowania nie potwierdza telefonu, adresu, opinii ani weryfikacji profilu. Znaleziony podobny wpis Panorama Firm z ul. Piłsudskiego 25 jest kandydatem do sprawdzenia tożsamości, nie dowodem, że aktualny adres firmy jest błędny.

Mała próbka zwykłego wyszukiwania odnajduje witrynę. Jeden starszy fragment strony budowy nadal zawiera telefon kończący się na 983; bieżący HTML wszystkich stron ma poprawne **993**. To nieaktualny fragment wyszukiwania, nie aktualny błąd kontaktu. Nie zmierzono pozycji w Google/Local Pack ani odpowiedzi i cytowań ChatGPT, Claude, Perplexity czy Google AI.

## 6. Agent Readiness — ponowny pomiar i plan

Świeże API skanera z **18.10.2026, 10:40:51 UTC** oraz aktualny kod licznika odtwarzają **20/100, 3/15, Level 1 — Basic Web Presence**. W porównaniu z audytem 16.10 brak zmiany. Zaliczono robots, sitemap i dostęp botów przez wildcard. Brakuje tych samych punktowanych deklaracji/interfejsów. Commerce jest poza wynikiem, neutralne kontrole nie zwiększają mianownika.

Lighthouse Agentic Browsing daje osobno **2/2 mających zastosowanie kontroli** w dziewięciu próbach: dostępne drzewo semantyczne i stabilność layoutu. Pozostałe kontrole oznaczył jako `notApplicable`. Tych wyników nie należy przeliczać na wspólną skalę ani odczytywać jako pełnej integracji agentowej.

Plan maksymalizacji skanera z 16.10 pozostaje aktualny. Przy niezmienionych 15 kontrolach jego arytmetyka jest następująca:

| Etap opcjonalnego rozwoju agentowego | Prognozowane zaliczenia | Zależność |
|---|---:|---|
| Jawne Content Signals | 4/15, ok. 27 | Świadoma decyzja właściciela o użyciu treści, osobno trening i wyszukiwanie |
| Rzeczywisty Markdown i nagłówki odkrywania | 6/15, 40 | Treść z tych samych danych, poprawne typy/cache, bez różnic faktów względem HTML |
| Użyteczny skill i zgodny katalog ARD | 8/15, ok. 53 | Działające pliki, aktualne schematy i wskazania zasobów |
| Publiczne API, WebMCP/MCP i DNS-AID | 12/15, 80 | Realne funkcje dla klientów, testy integracji; DNS manualnie |
| OAuth, chroniony zasób i rejestracja agentów | 15/15, 100 | Osobny proces biznesowy wymagający tożsamości; nie publikować fikcyjnych endpointów |

To prognozy, nie wyniki wdrożenia. Dokładny zakres zawiera [wcześniejszy audyt Agent Readiness](agent-readiness-production-audit.md). Warstwa OAuth/MCP jest odrębnym projektem; wynik skanera nie mierzy pozyskania klientów ani cytowań. Publiczna oferta i kontakt powinny pozostać czytelne bez logowania. Nie uzależniać korekt oferty i realizacji od prac nad protokołami agentowymi.

## 7. Kolejność dalszych działań

### Etap A — publikacja i kontrola konwersji

1. Przejrzeć i scalić PR #2 oraz PR #3 do `main`; PR #4 jest już w #3. Sprawdzić ewentualne konflikty, build i wdrożenie Vercel. Ten audyt sam ich nie scala.
2. Potwierdzić docelowy email. Strona pokazuje `kontakt@investdom.pl`, fallback API to `kontakt@investdom.com.pl`; rzeczywiste `CONTACT_EMAIL` ma pierwszeństwo i nie jest znane audytorowi. Sama różnica nie dowodzi awarii dostawy.
3. W panelach sprawdzić `CONTACT_EMAIL`, `RESEND_API_KEY`, domenę nadawczą i regułę WAF dla POST `/api/contact`. Kod nie ma trwałego limitera; honeypot i idempotencja go nie zastępują. Szczegóły są w opisie PR #4.
4. Po wdrożeniu potwierdzić publiczny POST/action, brak remontów, `picture/srcset`, wymiary OG i cztery canonicale; wykonać uzgodnioną próbę dostawy do skrzynki oraz powtórzyć pomiary mobilne.

### Etap B — rzetelna oferta i treść GEO

1. Doprecyzować lokalizację, etap i podpisy zdjęć, zachowując potwierdzone parametry domu.
2. Zatwierdzić FAQ i obietnice; opisać rzeczywisty zakres ceny/standardu, aktualność i autorstwo projektu.
3. Rozwinąć jedną udokumentowaną realizację; powiązać usługę, projekt i ofertę linkami w kontekście.
4. Powiązać markę z potwierdzoną działalnością i GBP; poprawić wyłącznie zweryfikowane stare wpisy, udostępnić prawdziwe referencje za zgodą klientów.

### Etap C — pomiar wyników i dalsza wydajność

1. W Search Console sprawdzić cztery URL, wybrany canonical, sitemapę, ostatnie pobranie i raporty indeksacji; wymaga dostępu właściciela.
2. Porównać mobile przed/po w tej samej metodzie; po publikacji obrazy, LCP i długie zadania strony głównej mają pierwszeństwo. Docelowo ocenić terenowe LCP/INP/CLS, jeśli dane będą dostępne.
3. Mierzyć realne zapytania, telefony i skuteczne wysyłki, bez przesyłania treści formularza do analityki.
4. Dla cytowań AI zapisać produkt, datę, język/region, dokładne pytanie, odpowiedź i cytowane URL dla stałej próbki pytań klientów; zwykłego wyszukiwania nie przedstawiać jako takiego pomiaru.
5. Dopiero jako osobny zakres realizować potrzebne funkcje agentowe z etapu 6. Wynik 100 w skanerze nie zastępuje oceny indeksacji, cytowań i leadów.

## Metoda, dowody i ograniczenia

Zastosowano Claude SEO `seo-audit`, `seo-geo`, pomocnicze instrukcje techniczne/schema/agentic oraz Superpowers `systematic-debugging` i `verification-before-completion`. Podział analizy na treść/lokalne sygnały i technikę/schema uzupełniono testami kodu i przeglądarki. Uwzględniono wszystkie cztery odkryte publiczne strony i sitemapę; nie był to nieograniczony crawl zasobów zewnętrznych.

Utrwalono [zwięzły zestaw dowodów](seo-evidence/2026-10-18-post-merge-seo-geo.json) i [logi weryfikacji kodu](seo-evidence/2026-10-18-verification.log). Surowe Lighthouse, HTML, skrypty pomocnicze i zrzuty są w lokalnym `/workspace/shared/investdom-audit-2026-10-18/`; nie opublikowano danych logowania Vercel, cookies ani pełnych binarnych zrzutów. PR audytowy zawiera wyłącznie dokumentację i dowody, bez zmian aplikacji i zależności.

Nie uzyskano dostępu do Search Console, GA4, GBP, DNS, WAF, Resend ani rzeczywistych logów robotów. Nie potwierdzono dostawy emaili, indeksacji wszystkich URL, wybranych przez Google canonicali, danych terenowych CWV, pozycji lokalnych ani cytowań w odpowiedziach AI. Awaria pomocniczego skryptu skilla wskutek odrzucenia prywatnego proxy środowiska nie jest usterką witryny; równoważne kontrole HTTP wykonano osobno z zachowaniem TLS.

## Źródła

- [Google — funkcje AI i wymagania witryn](https://developers.google.com/search/docs/appearance/ai-features), [przewodnik optymalizacji](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
- [Google — aktualizacje dokumentacji, w tym FAQ](https://developers.google.com/search/updates), [zasady review snippets](https://developers.google.com/search/docs/appearance/structured-data/review-snippet).
- [Google — wyniki lokalne](https://support.google.com/business/answer/7091), [rzeczywista reprezentacja firmy](https://support.google.com/business/answer/3038177).
- [OpenAI — boty](https://developers.openai.com/api/docs/bots), [Anthropic — boty i dostęp](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity — crawlery](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).
- [Gmina Wilamowice — sołectwa](https://gmina.wilamowice.pl/strona/144-solectwa), [profil dostarczony przez właściciela](https://share.google/O1Nye5JlpKbt5C3nc).
- [Cloudflare Agent Readiness](https://isitagentready.com/www.investdom.com.pl), [metoda skanera](https://blog.cloudflare.com/agent-readiness/).
