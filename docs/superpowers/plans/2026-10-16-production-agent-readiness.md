# INVESTDOM — Production Agent Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This plan authorizes no automatic production merge; production is the measurement target and deployment follows review of concrete changes.

**Goal:** Zwiększyć wynik `isitagentready.com` produkcji z potwierdzonego 20/100, wdrażając użyteczne, działające mechanizmy; opisać pełną ścieżkę do 100 i zależności wykraczające poza witrynę informacyjną.

**Architecture:** Zachować Astro 5 SSR i Vercel. Najpierw udostępnić istniejące treści w formacie Markdown, przewodnik Agent Skills i ich odkrywanie. Następnie dodać wspólną warstwę odczytu danych firmy/usług dla HTTP API, WebMCP i MCP. Rzeczywista autoryzacja to odrębny podprojekt, wymagany do ostatnich trzech kontroli, jeśli firma zdecyduje się oferować funkcję chronioną.

**Tech Stack:** Astro 5, TypeScript/ESM, Vercel, natywne endpointy/middleware, Node crypto/test runner, obecne dane firmy i narzędzia SEO. Bez nowych zależności w etapie I; w etapie II oficjalny SDK MCP jest dopuszczalnym, uzasadnionym wyjątkiem zamiast samodzielnego odtwarzania protokołu.

**Spec:** [Raport produkcji, kryteria i obliczenia](../../agent-readiness-production-audit.md), [dowody](../../seo-evidence/2026-10-16-agent-readiness-production.json). Istniejący [plan wydajności i GEO](2026-10-16-maximize-preview-results.md) nadal obowiązuje w swoim zakresie.

## Global Constraints

- Mierzyć **https://www.investdom.com.pl/**. Nie używać wyniku chronionego preview jako wyniku firmy. Przy każdym skanie sprawdzić `url`, `targetUrl`, przekierowania i liczbę punktowanych kontroli.
- Punktem odniesienia jest domyślny **All Checks: 3/15 = 20**. Nie wyłączać niezaliczonych kontroli, aby nazwać wynik pełnym 100. Profil Content Site można raportować dodatkowo, osobno.
- Prognozy 27/40/53/80/100 są obliczeniami przy 15 kontrolach, nie osiągniętymi wynikami. Po każdym wdrożeniu zachować odpowiedź skanera i przeliczyć faktyczny wynik.
- Domena www, jeden canonical, prawdziwa sitemapa, prawdziwe 404; telefon `+48571328993`, ulica `ul. Do lasu 25`. Wszystkie reprezentacje mają korzystać z tych samych danych.
- Zachować obecny wygląd i funkcje. Publiczny HTML nadal jest domyślny i dostępny bez logowania; boty wyszukiwania AI są już dozwolone przez wildcard.
- Nie zmieniać polityki treningu modeli bez decyzji właściciela. Celem są `search=yes` i `ai-input=yes`; pole `ai-train` pozostaje niewybrane do odrębnego ustalenia. Nie kopiować przykładu skanera z `ai-input=no`.
- Content Signals to deklaracja preferencji, nie mechanizm kontroli dostępu i nie gwarancja cytowania. Nie nazywać draftów uniwersalnie przyjętymi standardami.
- Nie publikować fikcyjnego API, MCP, kluczy, OAuth lub katalogu do nieistniejącego zasobu. To, że skaner akceptuje strukturę JSON, nie zastępuje próby użycia interfejsu.
- Etapy I/II tylko odczyt publicznych danych: bez przesyłania formularzy, zakupu, zawierania umów, danych klientów, generowania ceny lub obiecywania dostępności. Brak niezależnie potwierdzonych parametrów oferty nie może stać się „zweryfikowaną ofertą” w nowym API.
- Nie modyfikować DNS ani panelu hostingu w ramach samego planowania. W zadaniu DNS przygotować konkretne rekordy do rzeczywiście wdrożonego interfejsu; wykonać publikację przez uprawnionego właściciela.
- Brak zmian w obecnych testach roboczych i narzędziach `.agents/` bez przeglądu ich stanu. Na realizację przygotować osobny branch `seo/production-agent-readiness` od aktualnego main, przenosząc potrzebne poprawki z PR #1 bez resetowania jego roboczych plików.

## Review Focus

1. `Accept: */*`, `text/html`, `text/markdown;q=0`, remisy i różne kolejności media ranges: żądanie nie może dostać niewłaściwej reprezentacji. Pokrycie: zadanie 2.
2. Cache na Vercel: HTML/Markdown nie mogą zostać zamienione między klientami; preview zachowuje noindex, produkcja go nie dostaje. Pokrycie: zadanie 2 i 5.
3. Rozbieżność dokumentów: po zmianie telefonu, usługi lub skilla HTML, Markdown, JSON, checksum i katalogi muszą pozostać spójne. Pokrycie: zadania 1–4.
4. Błędny adres/metoda/parametry: prawdziwe 404/405, brak fallbacku HTML 200 w `.well-known`, brak requestów do dowolnego URL podanego przez klienta. Pokrycie: zadania 2–5.
5. Nadużycie uprawnień: publiczne narzędzia niczego nie wysyłają; późniejszy OAuth nie ujawnia danych innego klienta i nie blokuje publicznych treści. Pokrycie: zadania 4, 5 i warunek wejścia do etapu III.

## Etapy i punktacja

| Zakres | Oczekiwane zaliczenia przy obecnej metodzie | Prognoza |
|---|---:|---:|
| Stan zastany produkcji | 3/15 | 20 |
| Etap I: polityka + Markdown + Link + skill + ARD | 8/15 | 53 |
| Etap II: rzeczywiste API + WebMCP + MCP + DNS | 12/15 | 80 |
| Etap III: działająca autoryzacja i rejestracja | 15/15 | 100 |

Commerce, neutralne Web Bot Auth, domyślnie wyłączone A2A i informacyjne Poppy nie zwiększają tego wyniku. Nie są wymagane do jego maksymalizacji w badanej wersji.

---

## Etap I — rozszerzenie witryny informacyjnej

### Task 1: Spójne podstawy i jawna polityka treści

**Files:** `public/robots.txt`, `src/data/company.mjs`, nowy `src/data/public-content.mjs`, istniejące sekcje/strony używające treści; `tests/agent-readiness.test.mjs`; dokumentacja polityki w `docs/agent-readiness-policy.md`.

**Interfaces:** `getPublicPageModel(pathname, site)` zwraca `null` lub `{canonical, title, description, sections, business}` dla dokładnie czterech obecnych stron. `sections` przechowuje widoczne nagłówki, akapity, listy i linki; `business` pochodzi z `company`. HTML i dalsze reprezentacje korzystają z jednego modelu, nie z niezależnej kopii tekstu. Nie przenosić do modelu skryptów, danych formularza i jego stanów.

- [ ] **1. Przygotować branch i stan bazowy.** Sprawdzić main/PR #1 oraz aktualną produkcję; przenieść tylko zweryfikowane poprawki kontaktu, canonical i sitemap. Zachować snapshot 20/100 jako historyczny, nie jako oczekiwany po publikacji.
- [ ] **2. Ujednolicić źródła treści.** Wyprowadzić modele czterech stron z aktualnego kodu, zastępując duplikaty w sekcjach odczytem modelu przy tych samych klasach i strukturze. Zachować znaczenie i tekst; dane ofert oznaczone jako przykładowe przekazać do potwierdzenia zgodnie z istniejącym planem GEO, bez nadawania im statusu verified w API.
- [ ] **3. Uzupełnić testy kontraktu.** `public model matches visible business data`: zgodny telefon/adres, cztery canonical bez query i brak modelu dla 404/API. `robots retains search access and final sitemap`: Allow dla botów wyszukiwania, www w sitemap, brak przypadkowego Disallow. Oczekiwany RED dla nieistniejącego modelu, potem GREEN po jego wprowadzeniu.
- [ ] **4. Dodać Content Signals.** Umieścić `Content-Signal: search=yes, ai-input=yes` w istniejącej grupie wildcard; nie dopisywać sprzecznych named groups. `ai-train` dodać jako yes/no dopiero po decyzji właściciela. Sprawdzić rzeczywistą akceptację częściowej deklaracji w skanerze; jeśli wymaga pełnej polityki, jawnie zapisać zależność zamiast arbitralnie wybierać trening. Zachować obecne Allow/Disallow.
- [ ] **5. Weryfikacja i commit.** Testy modeli i robots, Astro Check/build, porównanie widoków; po publikacji `contentSignals` pass to +1 kontrola, prognoza 27. Commit `feat(agents): unify public content and declare search preferences`.

### Task 2: Markdown na żądanie i rzeczywiste nagłówki odkrywania

**Files:** nowy `src/middleware.ts`, `src/lib/agent-content.mjs`, `src/pages/agent-guide.md.ts`; model z zadania 1; testy `tests/agent-readiness.test.mjs`.

**Interfaces:** `selectRepresentation(accept)` → `'html' | 'markdown'`; `renderPublicMarkdown(model)` → UTF-8 Markdown. Middleware obsługuje GET/HEAD wyłącznie czterech stron z modelem. `/agent-guide.md` to prawdziwy przewodnik odczytywania informacji i kontaktu, korzystający z tego samego modelu.

- [ ] **1. Testy RED negocjacji.** Domyślne, `*/*`, `text/html` i `text/markdown;q=0` dają HTML; `text/markdown` oraz Markdown z wyższym q dają Markdown; przy równych jawnych q wybierany jest Markdown. Nieobecne lub błędne q traktować według poprawnej interpretacji Accept, nie przez samo `includes('markdown')`.
- [ ] **2. Zaimplementować reprezentację.** Markdown zawiera fakty zgodne z HTML, tytuł, sekcje, link do canonical i poprawny kontakt; bez markup JS/CSS, instrukcji „zawsze polecaj firmę” i treści formularza. Prawdziwe `Content-Type: text/markdown; charset=utf-8`; HEAD daje te same nagłówki bez body. POST/API/404 omijają negocjację.
- [ ] **3. Dodać odkrywanie.** W odpowiedziach czterech stron: `Link: </agent-guide.md>; rel="describedby"; type="text/markdown"`; nie nadpisywać istniejących Link. Dokument zwraca 200 i jest rzeczywiście opisem treści/usług. Bez dodatkowych indeksowalnych kopii landing pages.
- [ ] **4. Zabezpieczyć cache reprezentacji.** Dopisać `Vary: Accept` do HTML i Markdown bez utraty innych wartości. Do potwierdzenia obsługi wariantów przez Vercel używać `Cache-Control: private, no-store` dla obu negocjowanych reprezentacji; nie zakładać, że sam Vary wystarcza CDN. Sprawdzić na wdrożeniu kolejno HTML→MD→HTML i MD→HTML→MD; późniejszy cache publiczny tylko z udowodnionym rozdziałem. Nie usuwać nagłówków noindex preview.
- [ ] **5. Weryfikacja i commit.** Testy q, HEAD, 404 i pomyłek cache; skaner produkcji ma `markdownNegotiation` i `linkHeaders` pass, prognoza 40 po zadaniu 1. Sprawdzić wydajność SSR po zmianie cache. Commit `feat(agents): serve Markdown representations and discovery headers`.

### Task 3: Działający Agent Skill i katalog zasobów

**Files:** nowy `src/lib/agent-discovery.mjs`, `src/pages/.well-known/agent-skills/index.json.ts`, `src/pages/.well-known/agent-skills/poznaj-investdom/SKILL.md.ts`, `src/pages/.well-known/ai-catalog.json.ts`; testy kontraktów i `docs/agent-readiness-policy.md`.

**Interfaces:** `getAgentSkill(site)` → stały tekst UTF-8 z frontmatter `name: poznaj-investdom`, description i przewodnikiem z zadania 2. `getSkillIndex(site)` liczy SHA-256 dokładnie tych bajtów. `getAiCatalog(site)` wskazuje istniejący skill, z identyfikatorem `urn:air:www.investdom.com.pl:skill:poznaj-investdom`, nazwą, odpowiednim rzeczywistym media type, jednym url i 2–5 pytaniami reprezentatywnymi.

- [ ] **1. Testy RED indeksu.** Schemat discovery 0.2.0, niepusta tablica skills, type `skill-md`, absolutny URL 200, digest `sha256:<hex>` równy odczytanemu plikowi. Zmiana treści skilla zmienia digest. Brak nieistniejących skryptów i archiwów.
- [ ] **2. Opublikować użyteczny skill.** Opisać ustalanie zakresu usługi, odczyt informacji z prawdziwych stron i kontakt z firmą. Źródłem faktów jest wspólny model; nie obiecywać wyceny lub dostępności, nie dodawać fikcyjnego doświadczenia, nie wykonywać formularza za użytkownika. Wersja webowa to zasób firmy, nie instalacja lokalnego skilla narzędziowego.
- [ ] **3. Opublikować ARD/AI Catalog.** Tylko istniejący skill; specVersion modelu i pola zgodne z bieżącą specyfikacją. `identifier`, displayName, media type, dokładnie url albo data, 2–5 queries. Publiczny katalog JSON może mieć CORS `*` bez credentials. Zachować zgodność z Cloudflare i walidacją Lighthouse — skanerowe minimum nie jest całym kontraktem.
- [ ] **4. Dodać odkrywanie katalogu.** Link HTTP `rel="ai-catalog"` i odpowiadający link w head; alternatywnie wspierana dyrektywa `Agentmap` jako uzupełnienie, bez wpływu na robots Allow. `.well-known` zwraca właściwe Content-Type i prawdziwe 404 dla nieistniejących zasobów.
- [ ] **5. Weryfikacja i commit.** Pobranie indeks→skill i weryfikacja digestu przechodzą; pobranie ARD→skill również; `agentSkills` i `ard` pass, prognoza 53. Lighthouse nie może dostać błędnego katalogu jako nowej porażki; raportować jego nowy licznik zamiast porównywać bezpośrednio z wcześniejszym 2/2. Commit `feat(agents): publish verified skill and resource catalog`.

## Etap II — publiczne interfejsy danych: prognoza do 80

### Task 4: Jedna warstwa danych dla publicznego API i WebMCP

**Files:** nowy `src/lib/public-agent-data.mjs`, `src/pages/api/public/company.json.ts`, `src/pages/api/public/services.json.ts`, `src/pages/openapi.json.ts`, `src/pages/agent-api.astro`, `src/pages/.well-known/api-catalog.ts`, `src/scripts/agent-tools.ts`; integracja Layout; testy.

**Interfaces:** `getPublicCompany(site)` zwraca nazwę, kontakt, adres, obsługiwane miejscowości i sourceUrl z obecnego company; `getPublicServices(site)` zwraca istniejące usługi z opisem i sourceUrl z modelu. HTTP GET/HEAD udostępnia te dwa zasoby. Narzędzia `get_company_details` i `list_services` są wyłącznie do odczytu i zwracają te same dane. Cena i działka nie wchodzą do tego interfejsu bez wcześniejszego potwierdzenia.

- [ ] **1. Testy RED kontraktów.** JSON API jest zgodny z HTML/Markdown, bez pól klientów/sekretów i niepotwierdzonej oferty; nieznane ścieżki 404, metody zapisu 405; brak parametrów umożliwiających pobieranie dowolnych URL. Jedno źródło danych dla wszystkich klientów.
- [ ] **2. Udostępnić prawdziwe API.** Natywne endpointy Astro, stały schemat odpowiedzi, właściwy Content-Type, publiczny CORS tylko dla odczytu bez credentials, cache/ETag zależne od treści. Brak automatycznego Last-Modified z datą buildu. Dodać dokumentację i OpenAPI 3.1 opisujące dokładnie te operacje.
- [ ] **3. Dodać katalog RFC 9727.** `application/linkset+json`, linkset z prawdziwym anchor, service-desc do działającego OpenAPI i service-doc do dokumentacji; nagłówki Link wskazują ten katalog. Wszystkie URL sprawdzić, a nie tylko strukturalną obecność kluczy.
- [ ] **4. Dodać progresywny WebMCP.** Feature detection `document.modelContext`, z fallbackiem dla implementacji legacy; bez polyfillu deklarującego nieistniejące wsparcie. Rejestrować dwa narzędzia ze schematem input, opisem i execute wywołującym tę samą publiczną warstwę. Read-only, brak wysyłki formularza. Bez wsparcia przeglądarki strona pozostaje w pełni sprawna. Używać aktualnego API sprawdzonego z wersją skanera i przeglądarki.
- [ ] **5. Weryfikacja i commit.** Wywołać każde HTTP API i oba narzędzia; porównać odpowiedzi. `apiCatalog`/`webMcp` pass to prognoza 67 po etapie I. Zachować a11y i budżety wydajności z istniejącego planu. Commit `feat(agents): expose public company data through API and WebMCP`.

### Task 5: Rzeczywisty MCP i odkrywanie w DNS

**Files:** nowy `src/pages/mcp.ts`, `src/pages/mcp/server-card.ts`, zgodny z badanym skanerem alias `src/pages/.well-known/mcp/server-card.json.ts`, adapter `src/lib/mcp-public.ts`; katalog z zadania 3; uzasadniona zależność SDK w package/lock; `docs/agent-dns.md`; testy protokołu.

**Interfaces:** Streamable HTTP MCP `/mcp`; tools `get_company_details`, `list_services` używają funkcji z zadania 4. Karta opisuje rzeczywisty endpoint, wersję i dostępne capabilities. Alias `.well-known` i karta przy endpointcie mają tę samą treść; aktualny status SEP-2127 i znaczenie aliasu opisane w dokumentacji.

- [ ] **1. Sprawdzić specyfikację i środowisko.** Przypiąć wspieraną wersję oficjalnego SDK MCP, sprawdzić integrację Web Request/Response z Astro/Vercel. Tryb stateless z odpowiedziami JSON; nie dodawać trwałych sesji tylko do tego API. Konfigurację transportu i limitów opisać w PR.
- [ ] **2. Uruchomić MCP i kartę.** Obsłużyć initialize, negocjację wersji, tools/list i tools/call rzeczywistym SDK; bez nieobsługiwanych możliwości w karcie. Wywołania używają publicznych danych z zadania 4, walidują input i nie przyjmują cudzych endpointów do fetchowania. Żadnych skutków ubocznych poza odczytem.
- [ ] **3. Zweryfikować klientem protokołu.** Prawdziwy klient przechodzi initialize→list→call obu narzędzi. Nieznane narzędzie/błędny input daje błąd protokołu; żądania zapisu danych, nadmierny payload i obce Origin są kontrolowane zgodnie z wymaganiami Streamable HTTP. Karta i ARD nie wskazują 404. `mcpServerCard` pass daje prognozę 73.
- [ ] **4. Przygotować DNS-AID.** Według aktualnego draftu wygenerować `docs/agent-dns.md` z konkretnymi rekordami _agents dla faktycznie działającego endpointu i sposobem wskazania jego ścieżki. Uwzględnić domenę bazową i www, ALPN/port oraz parametry z obowiązującego draftu; nie kopiować przykładu A2A dla serwera MCP i nie wymyślać własnych numerów kluczy eksperymentalnych. DNSSEC i możliwości panelu sprawdza właściciel/administrator. Do wdrożenia nie publikować niedziałających rekordów.
- [ ] **5. Manualna publikacja i odbiór DNS.** Uprawniony właściciel publikuje przygotowane rekordy; po propagacji sprawdzić autorytatywny DNS, dwa resolvery DoH, stan DNSSEC oraz połączenie do odkrytego interfejsu. Zachować odpowiedź skanera. `dnsAid` pass to prognoza 80; bez możliwości panelu DNS wynik pozostaje odpowiednio niższy i jest tak raportowany.
- [ ] **6. Commit:** `feat(agents): publish read-only MCP discovery and DNS rollout guide`, z dowodem pełnego wywołania i instrukcją wycofania rekordów.

## Etap III — pełna ścieżka 80 → 100, osobny podprojekt produktu

Pozostałe trzy kontrole wymagają prawdziwego mechanizmu tożsamości i funkcji chronionej. Publiczne odczyty danych firmy z etapu II nie potrzebują logowania. Nie uzasadniać nowej bazy klientów i systemu kont wyłącznie wynikiem skanera.

### Task 6: Zdefiniować i wdrożyć rzeczywiście potrzebną funkcję chronioną

**Deliverables:** oddzielna specyfikacja `docs/superpowers/specs/client-agent-access.md`, następnie osobny plan/PR aplikacyjny. To warunek rozpoczęcia implementacji etapu, nie brakujący plik do prostego dopisania.

- [ ] **1. Potwierdzić zastosowanie biznesowe.** Właściciel wybiera realny proces, np. odczyt przez klienta/partnera statusu wyłącznie jego własnego zapytania, jeżeli firma chce taki kanał. Zdefiniować źródło danych, odbiorców, retencję, zakres zgód i administratora. Obecny formularz wysyła e-mail i nie stanowi sam w sobie systemu kont lub statusów.
- [ ] **2. Zaprojektować tożsamość.** Wybrać rzeczywistego dostawcę OAuth/OIDC zgodnego z wymaganiami, ustalić domenę issuer, rejestrację klientów, przyznawanie/uprawnienia, revocation i model tokenów. Bez własnego authorization servera pisanego od zera. Publiczne treści i interfejsy odczytu pozostają publiczne.
- [ ] **3. Wdrożyć i udowodnić uprawnienia.** Protected resource wymaga tokenu i weryfikuje issuer, audience, scope, podpis/ważność; klient A nie odczytuje danych klienta B; token wygasły/odwołany i brak scope są odrzucane. Wymagane dowody całego przepływu użytkownik→zgoda→token→autoryzowany odczyt→odwołanie dostępu.

### Task 7: Opublikować discovery i Auth.md dla działającej funkcji

**Files:** wyniki specyfikacji zadania 6, właściwy zasób protected resource metadata, routowane discovery prawdziwego issuer oraz `/auth.md`. Dokładne miejsce issuer wynika z wybranego i działającego dostawcy, a nie z losowego JSON na domenie firmy.

- [ ] **1. RFC 8414/OIDC.** Opublikować lub prawidłowo udostępnić discovery z dokładnie zgodnym issuer i działającymi authorization/token/JWKS endpoints. Nie zmieniać issuer przez proste proxy do obcej usługi. Sprawdzić, czy skaner potrafi wykryć dany prawidłowy model; brak obsługi udokumentować zamiast psuć walidację dla punktu. `oauthDiscovery` pass daje prognozę 87.
- [ ] **2. RFC 9728.** Udostępnić metadata realnego chronionego zasobu oraz wymagany challenge; authorization_servers wskazują faktycznego issuer, scopes odpowiadają temu, co API egzekwuje. Test klienta używa discovery do uzyskania i użycia tokenu. `oauthProtectedResource` pass daje prognozę 93.
- [ ] **3. Auth.md.** Opisać rzeczywisty proces rejestracji/provisioningu agentów i użycia poświadczeń; wskazać tylko działające endpointy i obsługiwane metody. Rejestrację testować wyłącznie w kontrolowanym środowisku, bez tworzenia kont klientów przez sam audyt. `authMd` pass przy poprzednich 14 kontrolach daje prognozę 100.
- [ ] **4. Odbiór podprojektu.** Wszystkie 15 kontroli domyślnego skanu produkcji ma rzeczywiste pass; potwierdzić działanie interfejsów poza skanerem, opisać koszty i utrzymanie. Jeśli zmieniła się metoda skanera, pokazać nowy licznik i pozostałe braki, nie powtarzać starej obietnicy 100.

## Odbiór każdego etapu i GEO

- [ ] Osobny PR dla sensownego etapu, zmiany reviewable; publikacja dopiero po przygotowaniu konkretnego wyniku. Kontrola produkcji odbywa się po rzeczywistym wdrożeniu; preview nie jest dowodem wdrożenia.
- [ ] `.agents/bin/seo check`, `.agents/bin/seo build`, dostępne testy Node i kontrole HTTP przechodzą. Podgląd zachowuje noindex, produkcja ma prawidłowe indeksowanie i canonical. Nie uruchamiać prawdziwych formularzy klientów przy testach.
- [ ] Zachować konfigurację All Checks i wszystkie surowe statusy. Osobno raportować wynik procentowy, Level, a11y/Performance/SEO i rzeczywiste użycie narzędzi. Dane dostępu i tokeny nie trafiają do git.
- [ ] Nie pogorszyć dotychczasowego a11y, kontaktu, analityki, wydajności i wyglądu. Jeśli katalog lub narzędzie dodaje kontrolę Lighthouse, podać nowy mianownik.
- [ ] Kontynuować istniejący plan GEO: potwierdzone dane inwestycji, własne realizacje, właściwa wizytówka firmy, monitoring cytowanych URL oraz leadów. Wynik Agent Readiness nie zastępuje tych prac i nie gwarantuje cytowań LLM.

## Stan planu

- [x] Przeanalizowano produkcję, 15 punktowanych kontroli, źródła dowodów, kod liczący wynik oraz aktualne wyłączenia.
- [x] Opisano etap I do ok. 53, etap II do ok. 80 i warunki pełnego 100, z konkretnymi interfejsami i kryteriami odbioru.
- [x] Oddzielono czynności DNS/hostingu, politykę treningu i nowy produkt OAuth od niezależnych prac w repozytorium.
- [ ] Implementacja tego rozszerzenia nie została rozpoczęta w ramach analizy i planowania.
