# INVESTDOM — Maximize Preview Results Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Subagent work is optional only if the execution method is later explicitly selected.

**Goal:** Poprawić rzeczywiste ładowanie strony i usunąć potwierdzone błędy audytów, utrzymując dostępność, funkcjonalność oraz poprawne rozdzielenie preview i produkcji; przygotować wiarygodną bazę dalszego GEO.

**Architecture:** Zachować Astro 5 SSR, Vercel, natywne `astro:assets`, istniejący routing, sitemap i współdzielone dane firmy. Wykonać małe zmiany w obrazach, istniejącej integracji Partytown i metadanych. Publikację nowych materiałów GEO prowadzić jako osobną paczkę po potwierdzeniu danych przez właściciela.

**Tech Stack:** Astro 5, TypeScript/ESM, Tailwind 4, Vercel, Node test runner, istniejące Sharp, Claude SEO 2.4.2, Lighthouse 13.5.0 / Chromium 156.

**Spec:** [Aktualny pomiar i wymagania](../../preview-score-audit.md). Dowody: `docs/seo-evidence/2026-10-16-preview-scores.json`. Szerszy kontekst: [audyt GEO](../../seo-geo-audit.md).

**Aktualizacja celu po decyzji właściciela:** pomiary Agent Readiness prowadzić teraz na produkcji `https://www.investdom.com.pl/`. Rozszerzenie o kryteria Cloudflare i pełną ścieżkę 20 → 53 → 80 → 100 znajduje się w [osobnym planie produkcyjnego Agent Readiness](2026-10-16-production-agent-readiness.md). Prognozy zależą od rzeczywistych zaliczeń. Tabele preview poniżej pozostają historyczną bazą techniczną; nie używać skanu przekierowanego na login Vercel jako wyniku INVESTDOM. Nowy plan uzupełnia prace nad wydajnością i GEO, a nie potwierdza ich wdrożenia.

## Global Constraints

- Pracować od `616871b` lub nowszego na aktualnym branchu `seo/technical-foundation`; nie cofać poprawionego a11y. Plan zastępuje niezakończone zadania 3–5 wcześniejszego planu w pokrywającym się zakresie.
- `tests/seo.test.mjs` ma niezatwierdzone testy OG, nagłówków i wymiarów obrazów z wcześniejszej pracy. Zachować je, przejrzeć i włączyć do odpowiadających zadań; nie zakładać, że obecnie przechodzą. `.agents/` to lokalne narzędzia, nie zawartość aplikacyjnego PR.
- Telefon `+48571328993`, ulica `ul. Do lasu 25`, origin `https://www.investdom.com.pl`, podstrony bez końcowego `/`.
- Zachować układ, kadr i te same zdjęcia, typografię oraz animacje. Każdy kompromis jakości zdjęcia wymaga oceny wizualnej przed zatwierdzeniem.
- Zachować SSR, obsługę kontaktu, GA4 i `dataLayer.push`; nie wyłączać analityki, walidacji, zabezpieczeń ani audytów dla zwiększenia punktacji.
- Nie stosować lazy loading dla obrazów LCP. Pozostałe obrazy poniżej pierwszego ekranu zachować lazy.
- Bez nowych bibliotek. Aktualizacja istniejącej integracji Partytown jest ograniczona do zadania 2; nie aktualizować całego Astro/Tailwind.
- Preview zachowuje `X-Robots-Tag: noindex` i canonical domeny produkcyjnej; oczekiwany SEO 69 z jednym kontrolowanym `is-crawlable` fail nie blokuje preview.
- Cel: mediana 3 porównywalnych pomiarów Performance ≥95 mobile dla każdej strony, ≥99 desktop głównej; dążyć do 100. LCP ≤2,5 s, TBT ≤200 ms, CLS ≤0,1 w laboratorium. Nie traktować tego jako terenowego INP/CWV.
- A11y 100, `target-size` pass, Agentic 2/2. Best Practices cel 100, ale pozostały problem dostawcy zgłosić jawnie. Produkcyjne SEO cel 100 po wdrożeniu, bez obietnicy pozycji lub cytowań.
- Nie wymyślać danych, recenzji, certyfikatów ani profili. GSC/Bing/GBP/logi i wdrożenie produkcyjne są działaniami właściciela wymagającymi odpowiedniego dostępu.
- Nie zapisywać tokenu `_vercel_share`, cookies ani danych logowania w git, raportach lub opisie PR.

## Review Focus

1. Wysoki telefon i DPR 2–3: obraz ma zachować kadr i szczegóły; szerokość viewportu sama nie wyznacza potrzebnego wariantu hero. Pokrycie: zadanie 1.
2. Safari/WebP i przełączenie desktop/mobile: fallback działa, nie ma pustego hero, pogorszenia logo ani poziomego scrolla. Pokrycie: zadanie 1 i kontrola manualna w zadaniu 4.
3. Analityka i formularz: po aktualizacji Partytown konfiguracja GA4 wykonuje się raz, dane trafiają do kolejki, formularz nie wysyła rzeczywistych prób testowych. Pokrycie: zadanie 2 oraz 4.
4. Preview i produkcja: noindex zostaje w preview, ale nie przenosi się do produkcji; canonical i sitemap nie zawierają parametrów udostępnienia. Pokrycie: zadanie 3 oraz 4.
5. Informacje niepotwierdzone lub przeterminowane: nie trafiają do nowych treści/schematów jako pewne fakty; treść zatwierdza właściciel, a identyfikacja firmy nie miesza innych marek INVESTDOM. Pokrycie: zadanie 5.

## Kolejność i mapa plików

Zadania 1–4: domknięcie technicznego PR #1. Zadanie 5: osobny PR treści po uzyskaniu materiałów. Zadanie 6: pomiar po publikacji. Działania manualne i brak danych nie blokują niezależnych prac technicznych.

| Odpowiedzialność | Pliki |
|---|---|
| Warianty i priorytety obrazów | `src/components/sections/{Hero,About,Properties}.astro`, `src/pages/{domy-na-sprzedaz-bielsko,projekty-domow}.astro` |
| Wymiary logo, metadata | `src/components/brand/LogoIcon.astro`, `src/layouts/Layout.astro`, istniejące strony |
| Integracja analityki | `astro.config.mjs`, `package.json`, `package-lock.json`; Layout tylko jeśli wymaga tego wspierane API |
| Kontrole regresji | `tests/seo.test.mjs`, `scripts/check-seo.mjs`; bez nowego frameworka testowego |
| Fakty biznesowe i GEO | nowy `docs/geo-facts.md`, po zatwierdzeniu `src/data/investments.mjs` i strony realizacji/inwestycji |
| Raporty i wyniki | `docs/preview-score-audit.md`, `docs/seo-audit.md`, `docs/seo-geo-audit.md`, `docs/seo-evidence/` |

---

### Task 1: Zmniejszyć transfer hero i poprawić strategię obrazów

**Files:** zmodyfikować pięć plików obrazów z tabeli oraz `src/components/brand/LogoIcon.astro`; rozszerzyć `tests/seo.test.mjs`; wyniki w `docs/seo-evidence/2026-10-16-image-optimization.json`.

**Interfaces:** HTML nadal zawiera obraz z prawdziwym ALT. Hero używa natywnego `Picture` z `astro:assets`, źródeł AVIF/WebP i fallbacku WebP; pierwsze zdjęcia ofert/projektów `Image` z `loading="eager"`, `fetchpriority="high"`. Inne zdjęcia zachowują lazy. Logo dostaje `width="875" height="190"`, zachowując `h-10 w-auto`.

- [ ] **1. Ustalić porównywalny punkt odniesienia.** Wykonać po trzy mobile pomiary czterech URL i trzy desktop głównej, tą samą wersją Lighthouse, sekwencyjnie, z tą samą metodą dostępu do preview. Zapisać mediany, transfer faktycznie wybranych obrazów i zrzuty 375×812, 412×915, 390×844 przy DPR 3 oraz 1440×1000. Nie porównywać lokalnego dev z wdrożeniem jako eksperymentu wydajności.
- [ ] **2. Dodać precyzyjne kontrole HTML.** Testy `LCP images are eager and high priority`, `responsive images expose width candidates and sizes`, `logo reserves its intrinsic ratio`: na głównej pierwszy obraz main ma eager/high; na ofertach i projektach pierwszy img main ma eager/high; pozostałe zdjęcia głównej pozostają lazy; źródła hero i obrazy kart mają co najmniej dwa warianty oraz niepuste sizes. Włączyć istniejący test wymiarów obrazów. Przed zmianą oczekiwane FAIL dla lazy LCP/srcset/logo.
- [ ] **3. Dodać warianty natywnego Astro.** Dla hero zacząć od `formats={['avif','webp']}`, fallback WebP, quality 60 i widths `[800,1200,1600,1920,2560,3200,4032]`, maksymalnie do rozdzielczości źródła. Oprzeć proporcję na rzeczywistym źródle 4:3; nie kopiować nieprawdziwego 1920×1080 do nowego wyniku. Dla aktualnej geometrii hero użyć sizes `max(100vw, 120vh, 800px)`: wynika z `height=max(90vh,600px)` i proporcji 4:3. Zachować klasy, overlays oraz eager/high; sprawdzić faktyczny Content-Type, rozmiary i wybór pliku na Vercel, nie tylko HTML.
- [ ] **4. Uzupełnić pozostałe obrazy.** Dla About i Properties dodać warianty `[400,640,800,1200,1600]`, dla ofert te same, dla karty projektu `[400,640,800]`; sizes wyznaczyć z istniejących kontenerów, wysokości `object-cover` i breakpointów. Nie zmieniać boxów ani kadru. Pierwsze obrazy podstron eager/high; niższe lazy. Dodać wymiary logo.
- [ ] **5. Sprawdzić wynik i jakość.** Oczekiwane PASS kontroli HTML, brak rozciągnięć/zmiany kadru i poziomego scrolla. Porównać obrazy na DPR 1/2/3 i WebP fallback. Budżet roboczy hero w emulacji mobile Lighthouse: ≤200 KiB zamiast 419 KiB; jeśli jakość przy quality 60 nie przechodzi oceny, dostroić ją i jawnie zapisać osiągnięty kompromis. Nie zmniejszać zdjęcia do 400 px tylko dla budżetu. Powtórzyć trzy pomiary po wdrożeniu; ocenić medianę względem specyfikacji.
- [ ] **6. Commit:** `perf: optimize native responsive images and LCP delivery`, z testami i dowodami; bez zmian animacji/fontów.

### Task 2: Usunąć ostrzeżenie Partytown bez utraty analityki

**Files:** `package.json`, `package-lock.json`, ewentualnie istniejąca konfiguracja w `astro.config.mjs` / `src/layouts/Layout.astro`; zapis audytu w `docs/seo-evidence/2026-10-16-partytown.json`.

**Interfaces:** nadal jeden bootstrap `gtag`, identyfikator `G-XDW3BJ5BJ9`, działające `dataLayer.push` i transport Partytown zgodny z integracją. Żadna zmiana nie dodaje nowego systemu śledzenia.

- [ ] **1. Odtworzyć przyczynę.** Zachować kontrolę `deprecations` z `FencedFrame` w `partytown-sandbox-sw.html`, wersje pakietów oraz bazowy sposób inicjalizacji i wysyłki GA4. W kontrolowanym przeglądzie przechwycić transport analityki, zamiast generować zdarzenia w usłudze produkcyjnej.
- [ ] **2. Zaktualizować istniejącą integrację.** Wykonać `npm install --save-exact @astrojs/partytown@2.1.8`; przejrzeć lockfile. Nie używać bezpośredniego override do najnowszego majora `@qwik.dev/partytown` i nie aktualizować pozostałych zależności. Zmienić konfigurację tylko według API tej wersji.
- [ ] **3. Zweryfikować analitykę.** `.agents/bin/seo check` i `.agents/bin/seo build` kończą się sukcesem; w kontrolowanym transporcie bootstrap i konfiguracja wykonują się raz, kolejka działa, brak błędów konsoli i zduplikowanego page_view. Sprawdzić nową sesję i sesję z istniejącym service workerem; jeśli ostrzeżenie występuje tylko na starym workerze, opisać to zamiast uznać, że kod go nie naprawił.
- [ ] **4. Powtórzyć Lighthouse Best Practices.** Oczekiwane `deprecations` pass i 100 Best Practices, bez pogorszenia mediany Performance/TBT. Jeżeli 2.1.8 nadal zgłasza ten sam problem, zanotować wersję i reprodukcję oraz ograniczenie upstream. Nie usuwać GA4 ani nie filtrować audytu; nie przedstawiać 100 jako osiągniętego wyniku.
- [ ] **5. Commit:** `fix: update Partytown integration and verify analytics`; jeśli eksperyment aktualizacji powoduje regresję i nie ma bezpiecznej poprawki, zachować działającą wersję i zatwierdzić wyłącznie uczciwie opisane ograniczenie.

### Task 3: Dokończyć metadane i semantykę poza punktacją Lighthouse

**Files:** `src/layouts/Layout.astro`, `src/pages/projekty-domow.astro`, `src/pages/domy-na-sprzedaz-bielsko.astro`, `src/pages/budowa-domow-pod-klucz.astro`, `tests/seo.test.mjs`.

**Interfaces:** zachować `Layout` props `title`, `description`, `ogImage`, `structuredData`; canonical i `getBusinessSchema`/`getServiceSchema` bez zmiany kontraktu. Nie dodawać schematu Offer, ocen ani breadcrumbs nieobecnych w UI.

- [ ] **1. Przejrzeć i uruchomić istniejące testy z roboczego `tests/seo.test.mjs`.** Oczekiwany FAIL OG 1200×630 vs faktyczne 1024×1024. Nie traktować już naprawionego nagłówka projektu jako nadal otwartego błędu. Dodać kontrolę, że meta opis oferty nie zawiera obietnicy gotowego domu lub dzielnicy Pisarzowice, a canonical/OG/Twitter nie zawierają query.
- [ ] **2. Poprawić deklaracje social.** Ustawić OG width/height na rzeczywiste 1024×1024 i `og:see_also` na `https://www.investdom.com.pl/`. Zachować istniejącą grafikę; dodatkowy format 1200×630 wymagałby osobnego zatwierdzenia grafiki.
- [ ] **3. Dopasować meta do aktualnego body.** Opis ofert: „Poznaj inwestycję INVESTDOM w Pisarzowicach koło Bielska-Białej. Sprawdź informacje o drugim etapie budowy domów i skontaktuj się w sprawie oferty.” Opis projektów: „Poznaj projekt domu prezentowany przez INVESTDOM: powierzchnię, liczbę pokoi i łazienek. Zapytaj o realizację w Bielsku-Białej i okolicach.” Zachować unikalne tytuły. Nie zmieniać statusu ani ceny w body na podstawie przypuszczeń.
- [ ] **4. Domknąć semantykę i ALT.** Utrzymać jeden H1/main, podnieść „Nasze standardy materiałowe” z H3 na H2 przy tych samych klasach. Sprawdzić zgodność ALT ze zdjęciem i kontekstem; nie podawać Bielska-Białej jako potwierdzonego miejsca zdjęcia z Pisarzowic. Bez zmian widocznego tekstu marketingowego poza zakresem uzgodnionym z właścicielem.
- [ ] **5. Uruchomić kontrole.** Po świeżym buildzie `npm test` oraz `npm run check:seo -- http://127.0.0.1:4321`; oczekiwane unikalne metadata, canonical produkcji, zgodne JSON-LD i wszystkie testy GREEN. Osobno HTTP preview potwierdza celowe noindex; nie należy oczekiwać SEO 100 na preview.
- [ ] **6. Commit:** `fix(seo): align metadata with visible offers and image dimensions`.

### Task 4: Domknąć dostępność, porównanie widoków i techniczny PR

**Files:** `docs/seo-audit.md`, `docs/preview-score-audit.md`, `docs/seo-evidence/`; kod zmieniać tylko przy odtworzonym błędzie. Opis istniejącego PR #1.

**Interfaces:** raport oddziela dane lokalne, preview i produkcję; wynik obejmuje raw HTML, HTTP, zrzuty, interakcje i mediany Lighthouse, bez fikcyjnego „lint pass” — repo ma Astro Check, nie osobny lint.

- [ ] **1. Sprawdzić a11y i interakcje.** Cztery strony mobile i desktop: `select-name`, `aria-hidden-focus`, kontrast, hierarchia i `target-size` pass. Klawiaturą: otwarcie menu, przejście po linkach, Escape/wybór linku, poprawny fokus po zamknięciu; zamknięte linki poza tab order. Sprawdzić fokus na ciemnych sekcjach i czytnik ekranu, nie tylko wynik skanera.
- [ ] **2. Sprawdzić formularz bez wysyłki produkcyjnej.** Przechwycić `/api/contact`, wymusić osobno sukces, błąd serwera i błąd sieci; sprawdzić walidację, widoczny stan i możliwość ponowienia. Jeśli potrzebny jest `role="status"`/`aria-live`, dodać po odtworzeniu braku ogłaszania. Brak testu prawdziwego doręczenia poczty jawnie zaznaczyć.
- [ ] **3. Porównać widoki.** Te same viewporty/DPR co zadanie 1, także Safari/WebP fallback; kadr, wysokości sekcji, typografia, kotwice i brak overflow pozostają zgodne. Nie utożsamiać ograniczonego testu z gwarancją braku wszystkich regresji.
- [ ] **4. Uruchomić komplet.** `.agents/bin/seo check`, `.agents/bin/seo build`, `npm test`, kontrola raw HTML i JSON-LD, HTTP slash 308 z zachowaniem query/metody, 404, XML sitemap. Zapisane mediany spełniają budżety albo mają wyjaśnione ograniczenia i pomiary. Parametr udostępnienia nie może trafić do canonical lub sitemapy.
- [ ] **5. Zaktualizować PR.** W opisie wymienić commity, porównanie wyników, zamierzone preview noindex, niepotwierdzone dane biznesowe i manualne działania. Oznaczyć stare zadania 3–5 jako ukończone tylko w faktycznie wykonanym zakresie. Publikacja produkcji pozostaje decyzją właściciela.
- [ ] **6. Commit:** `docs: record verified performance and accessibility improvements`.

### Task 5: Oddzielna paczka GEO na potwierdzonych danych

**Files:** najpierw `docs/geo-facts.md`; po zatwierdzeniu danych nowy `src/data/investments.mjs`, aktualizacja `src/components/sections/Properties.astro` i strony ofert, następnie nowe `src/pages/realizacje/index.astro`, `src/pages/realizacje/[slug].astro`, `src/pages/inwestycje/[slug].astro`. Metadane przez istniejący Layout, sitemap przez istniejącą integrację.

**Interfaces:** `investments` to wspólna kolekcja rekordów `{slug, title, locality, status, verifiedAt, sizeM2?, plotM2?, pricePln?, description, images}`. `status`/data/cena muszą mieć potwierdzenie w `docs/geo-facts.md`; opcjonalnych niezweryfikowanych pól nie wypełniać przykładowymi wartościami. Zatwierdzone realizacje korzystają z Astro Content Collections w `src/content.config.ts` i `src/content/realizations/*.md`; schemat zawiera slug, tytuł, miejscowość, zakres prac, opis, zdjęcia i faktycznie potwierdzone daty. Nie tworzysz pustych stron przed otrzymaniem materiałów.

- [ ] **1. Zebrać fakty od właściciela.** Potwierdzić 700 m² lub zatwierdzić usunięcie, aktualną cenę/dostępność etapu II, przypisanie zdjęć etapu I, zakresy FAQ, nazwę prawną i własne profile. Ustalić rzeczywiste źródła oraz dozwolone dane lokalizacji klientów. Tabela fakt → źródło → status akceptacji jest warunkiem dalszych zależnych zmian.
- [ ] **2. Ujednolicić zaakceptowane dane inwestycji.** Wspólna kolekcja zasila kartę głównej, listę ofert i szczegóły; rozróżnić stan obecny od docelowego standardu. Pokazywać datę aktualizacji wyłącznie z rzeczywistej weryfikacji; nie ustawiać jej automatycznie na datę buildu.
- [ ] **3. Dodać dwie lub trzy udokumentowane realizacje i szczegóły inwestycji.** Osobne stabilne URL, własne zdjęcia i podpisy, faktyczny zakres, problem i rozwiązanie. Jeśli jest tylko jedna kompletna realizacja, opublikować jedną zamiast dopisywać pozostałe. Rozwinąć istniejącą usługę o zatwierdzony zakres standardów i dane potrzebne do wyceny. Nie tworzyć seryjnie stron miast ani „tekstów pod AI”.
- [ ] **4. Zapewnić identyfikację i linkowanie.** Usługa ↔ realizacje ↔ oferta ↔ kontakt. Dodać wyłącznie zweryfikowane własne `sameAs`; nie profile firm z Opola lub innych domen o nazwie INVESTDOM. BreadcrumbList dodać tylko razem z widoczną nawigacją okruszkową. Dane schematu muszą odpowiadać body, bez fikcyjnego AggregateRating/Review/Offer.
- [ ] **5. Zweryfikować nowe treści.** Każdy publikowany rekord ma zatwierdzone źródła, unikalne metadata/canonical, SSR, prawdziwe ALT i właściwy URL w sitemap. Niekompletny lub niezatwierdzony rekord nie tworzy indeksowalnej strony. Przeprowadzić ocenę właściciela i kontrole techniczne przed publikacją.
- [ ] **6. Osobny PR:** `feat(geo): publish verified projects and investment details`, z listą danych pochodzących od właściciela. Nie dodawać `llms.txt`, WebMCP lub katalogów agentów jako rzekomego warunku cytowania.

### Task 6: Produkcja i pomiar realnej widoczności — działania manualne

**Files:** wyniki w `docs/seo-evidence/production-verification.json`, rejestr w `docs/geo-monitoring.md`; konfiguracje kont tylko po udzieleniu dostępu. Zmiany aplikacji, jeśli potrzebne, w osobnym PR.

**Interfaces:** jeden wiersz pomiaru AI zawiera `{date, platform, modelOrMode, query, locale, brandMention, citedUrl, contactCorrect, notes}`. Brak cytowania to wynik próbki, nie dowód braku indeksacji. Lead formularza oznacza potwierdzoną skuteczną wysyłkę; klik telefonu jest osobnym zdarzeniem.

- [ ] **1. Po akceptacji wdrożenia sprawdzić produkcję.** Cztery URL, sitemap, canonical i przekierowania mają finalny host; produkcja bez noindex, preview nadal noindex. Powtórzyć Lighthouse; oczekiwane SEO 100 lub udokumentować nowy faktyczny błąd. Nie przenosić wyniku preview do produkcji bez sprawdzenia.
- [ ] **2. GSC i Bing Webmaster Tools.** Właściciel weryfikuje domenę, przesyła finalną sitemapę i kontroluje inspekcję URL oraz wybrany canonical; sprawdza dostępne ustawienia/raporty funkcji AI. DNS lub panel hostingu modyfikuje uprawniony właściciel. Indeksacja i emisja nie są gwarantowane.
- [ ] **3. Profil Firmy i lokalna tożsamość.** Potwierdzić własność właściwej wizytówki Google, kategorię, obszar działania, telefon i URL; ujednolicić rzeczywiście posiadane profile, dodać własne zdjęcia i autentyczne opinie bez ich fabrykowania.
  - Aktualizacja 16.10.2026: właściciel zaktualizował profil i wskazał `https://share.google/O1Nye5JlpKbt5C3nc`; JSON-LD powiązano przez sameAs. Pełny odczyt pól Google pozostaje niezweryfikowany. Przy kolejnej korekcie oferty uwzględnić potwierdzony brak usług remontowych.
- [ ] **4. Monitoring AI i leadów.** Co miesiąc te same co najmniej cztery pytania z raportu GEO w ChatGPT Search, Claude Search, Perplexity i Google AI; zapisać model/tryb, język/lokalizację, odpowiedź i URL, powtarzać próbki. Równolegle mierzyć skuteczne formularze i kliknięcia telefonu z poszanowaniem wymaganych zgód; nie przypisywać całego direct do LLM.
- [ ] **5. Kontrola terenowa.** Gdy są dane, ocenić p75 LCP ≤2,5 s, INP ≤200 ms i CLS ≤0,1 w oknie raportowania CrUX/GSC. Bez danych oznaczyć „niedostępne”, nie podstawiać TBT za INP i nie czekać z niezależnymi poprawkami technicznymi.
- [ ] **6. Raport miesięczny.** Porównać wzmianki o właściwej firmie, cytowane URL, poprawny kontakt i jakość zapytań klientów. Wyniki Lighthouse pozostają osobną tabelą; żaden wynik 100/100 nie jest gwarancją obecności w odpowiedziach LLM.

## Stan przy przekazaniu planu

- [x] Sprawdzono aktualny wdrożony preview i pięć świeżych przebiegów Lighthouse.
- [x] Zweryfikowano szczegóły: a11y/target-size przechodzą, SEO obniża wyłącznie celowe noindex, Best Practices ogranicza Partytown, główny koszt to hero.
- [x] Plan samodzielnie porównano ze specyfikacją i dowodami; rozdzielono zadania techniczne, treści zależne od danych oraz czynności właściciela.
- [ ] Implementacja tego planu: jeszcze nierozpoczęta. Obecny wynik pozostaje stanem bazowym, nie obietnicą wyniku po optymalizacji.
