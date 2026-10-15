# INVESTDOM — audyt Technical SEO Foundation

Data: 2026-10-15. Branch: `seo/technical-foundation`. Analizowany commit aplikacji: `bef43ec35daab4bf93043f0f9c3f2da9c7f8c097`.

**Stan: częściowe wdrożenie, draft PR do podglądu Vercel.** Rozdziały audytu opisują stan bazowy. Wdrożono etapy 1–2: kanonikalizację i sitemapę oraz dane firmy i JSON-LD. Metadane, semantyka, obrazy i końcowa weryfikacja pozostają w toku. Plan wykonawczy: [Technical SEO Foundation](superpowers/plans/2026-10-15-technical-seo-foundation.md).

## Wnioski

Witryna ma techniczną podstawę do indeksowania: Astro generuje HTML na serwerze, cztery strony mają unikalne tytuły i opisy, pojedynczy H1, metadane społecznościowe i linkowanie dostępne bez JavaScript. Nie wykryto globalnej blokady indeksowania ani błędnego zastępowania nieistniejących stron odpowiedzią 200.

Najważniejsze problemy to sprzeczne sygnały kanonikalizacji, duplikaty adresów z końcowym ukośnikiem i bez niego oraz niespójne dane kontaktowe. Następne zadania obejmują poprawę danych strukturalnych, zgodności metadanych z ofertą i dostarczania obrazów. Ocena SEO Lighthouse nie wykrywa wszystkich tych problemów i nie jest oceną całej strategii SEO.

## Metoda i zakres

- Przegląd kodu Astro, konfiguracji Vercel, wspólnego layoutu i wszystkich stron treściowych.
- `fetch_page.py` i `parse_html.py`: HTML, metadane, nagłówki, obrazy i JSON-LD; macierz 24 żądań obejmująca hosty, protokoły, warianty ścieżek, parametry, sitemapę, API i błędy 404.
- `sitemap_discovery.py`: deklaracja w robots.txt i rozpoznanie istniejącego indeksu sitemap.
- `render_page.py --mode always`: porównanie odpowiedzi serwera i DOM po wykonaniu JavaScript dla czterech stron.
- `capture_screenshot.py`: widoki desktop i mobile.
- Lighthouse 13.5.0: osobne przebiegi mobilne czterech stron oraz desktop strony głównej; pomiary wykonywane kolejno.
- Kontrola składni JSON-LD i porównanie właściwości z dokumentacją schema.org. Nie jest to potwierdzenie walidacji Google Rich Results Test ani indeksacji w Google.
- Użyte skille: `seo-audit`, `seo-technical`, `seo-schema`, `seo-images`, Superpowers `writing-plans` i `verification-before-completion`.

Witryna jest lokalną firmą budowlaną sprzedającą także własne inwestycje. Analiza obejmuje zakres techniczny wskazany w zadaniu; nie obejmuje kampanii linkowania, strategii publikacji, monitoringu pozycji ani zmian treści marketingowych.

### Potwierdzone dane firmy

Użytkownik potwierdził w tej sesji:

- Telefon: **+48 571 328 993**, zapis maszynowy `+48571328993`.
- Ulica: **ul. Do lasu 25**.

Pozostałe dane wykorzystuje się tylko wtedy, gdy wynikają ze zgodnej, widocznej treści projektu. Nie potwierdzono współrzędnych GPS, klasy cenowej, pośrednictwa nieruchomości ani parametrów ofert oznaczonych w kodzie jako przykładowe.

## Architektura

| Element | Stan zastany |
|---|---|
| Framework | Astro 5.16.11, TypeScript, Tailwind CSS 4 |
| Routing | Pliki `src/pages/*.astro`, cztery strony publiczne |
| Renderowanie | SSR: `output: 'server'`, adapter `@astrojs/vercel` |
| API | `POST /api/contact`, Resend; GET sprawdzono bez wysyłania wiadomości |
| SEO | Wspólny `src/layouts/Layout.astro`, metadane przekazywane ze stron |
| Sitemapa | Istniejące `@astrojs/sitemap`, `sitemap-index.xml` i `sitemap-0.xml` |
| Obrazy | `astro:assets`, transformacje `/_image`, dostarczany WebP |
| Fonty i analityka | Lokalne Fontsource; Google Analytics przez Partytown |
| Kontrole | `astro check`, `astro build`; brak skryptów `test` i `lint` |

Nie ma uzasadnienia dla migracji frameworka, instalowania biblioteki SEO ani zmiany SSR na inny sposób renderowania w ramach tego zadania.

## Strony i indeksowalność

Poniższe ścieżki na `https://www.investdom.com.pl` zwracają HTTP 200. Wszystkie mają unikalny `title`, unikalny `description`, jeden H1 i dyrektywę `index, follow`. Żaden canonical nie jest jednak zgodny z końcowym hostem odpowiedzi.

| Ścieżka | Title | Canonical w HTML | Nagłówki |
|---|---|---|---|
| `/` | Budowa Domów Bielsko-Biała \| Nowe Domy na Sprzedaż \| INVESTDOM | `https://investdom.com.pl/` | 1 × H1, H2 → H3 |
| `/budowa-domow-pod-klucz` | Budowa domów pod klucz Bielsko-Biała \| Etapy i standardy \| INVESTDOM | `https://investdom.com.pl/budowa-domow-pod-klucz` | 1 × H1, H2 → H3 |
| `/domy-na-sprzedaz-bielsko` | Nowe domy na sprzedaż Bielsko-Biała \| Inwestycje \| INVESTDOM | `https://investdom.com.pl/domy-na-sprzedaz-bielsko` | 1 × H1, H2 → H3 |
| `/projekty-domow` | Projekty Domów Bielsko-Biała \| Autorskie Projekty \| INVESTDOM | `https://investdom.com.pl/projekty-domow` | 1 × H1, potem H3 |

Wszystkie strony są osiągalne z linków HTML na stronie głównej, na głębokości jednego kliknięcia. Istotna treść, canonical i JSON-LD znajdują się już w odpowiedzi serwera. Sprawdzono też odpowiedź dla User-Agent Googlebot; jest to test odpowiedzi serwera, a nie dowód rzeczywistego crawlowania lub indeksacji przez Google.

### Macierz HTTP

| Żądanie | Wynik |
|---|---|
| `https://investdom.com.pl/` i trzy podstrony bez `www` | 307 → odpowiednik z `www` → 200 |
| `http://investdom.com.pl/` | 308 → HTTPS bez `www` → 307 → HTTPS z `www` → 200 |
| `http://www.investdom.com.pl/` | 308 → HTTPS z `www` → 200 |
| Trzy podstrony z końcowym `/` oraz bez `/` | Oba warianty 200; różne canonical wynikające z pathname |
| `/projekty-domow?utm_source=seo-audit` | 200; canonical pomija query, ale nadal wskazuje host bez `www` |
| Losowa nieistniejąca ścieżka, z `/` i bez | 404 |
| `GET /api/contact` | 404; nie testowano produkcyjnego POST |
| `/robots.txt` | 200, `Allow: /`, deklaracja indeksu sitemap |
| `/sitemap-index.xml`, `/sitemap-0.xml` | 200; poprawne dokumenty XML |
| `/sitemap.xml` | 404; nie stanowi usterki, ponieważ prawidłowo działa zadeklarowany indeks sitemap |

## Ustalenia według priorytetu

### P1 — sygnały kanonikalizacji wskazują różne adresy

`astro.config.mjs:11`, `Layout.astro:13–20`, `public/robots.txt:6` i JSON-LD wskazują domenę bez `www`. Produkcja przekierowuje ją tymczasowym 307 na `www`. Dodatkowo canonical kopiuje końcowy ukośnik żądania, a sitemapa podaje adresy z ukośnikiem, mimo że linki wewnętrzne go pomijają.

**Skutek:** robot otrzymuje sprzeczne preferencje dla hosta i różne adresy kanoniczne tej samej treści. To problem konsolidacji sygnałów, nie dowód całkowitego braku indeksacji.

**Plan:** przyjąć `https://www.investdom.com.pl`, ścieżki podstron bez końcowego `/`, zachować `/` dla strony głównej. Ujednolicić canonical, `og:url`, sitemapę, robots.txt i JSON-LD. Stałe przekierowania hosta zweryfikować w Vercel; warianty ścieżek obsłużyć konfiguracją frameworka/hostingu. Zachować query string i działanie POST/API. Wymagane działania w panelu hostingu oznaczyć jako manualne.

Wybór odpowiada aktualnemu końcowemu hostowi produkcji i istniejącym linkom wewnętrznym. [Dokumentacja Google o spójnej kanonikalizacji](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

### P1 — niespójne dane kontaktowe

- `src/components/layout/Footer.astro:27`: błędny numer `571 328 983`, zarówno tekst, jak i `tel:`.
- `src/components/sections/Contact.astro:131`: błędne `ul. Na Lasu 25`.
- W meta/JSON-LD i stopce występuje też pisownia `Do Lasu`; docelowo zastosować potwierdzone `ul. Do lasu 25`.

**Plan:** wspólne źródło danych firmy, wykorzystane w widocznym kontakcie, stopce, metadanych kontaktowych i JSON-LD. Poprawki tych danych są objęte potwierdzeniem użytkownika.

### P2 — dane strukturalne wymagają poprawy semantycznej

Obecny JSON-LD jest parsowalnym JSON. To nie potwierdza prawdziwości danych ani zgodności użycia każdej właściwości.

- `Layout.astro:173`: `serviceType` jest przypisane firmie. [schema.org/serviceType](https://schema.org/serviceType) wskazuje użycie na `Service`.
- `Layout.astro:140`: typ `RealEstateAgent` nie ma potwierdzenia pośrednictwa; widoczna oferta potwierdza działalność budowlaną.
- `Layout.astro:165`: `powiat czechowicki` jest błędnym określeniem obszaru administracyjnego; usunąć je. Czechowice-Dziedzice i powiat bielski występują już oddzielnie.
- `Layout.astro:154`, meta geo: współrzędne nie są zweryfikowaną lokalizacją firmy.
- `Layout.astro:181`: `priceRange: "$$"` nie ma potwierdzonego źródła.
- Brakuje `Service` na stronie budowy pod klucz oraz trwałego `@id` firmy, z którym można powiązać `provider`.

**Plan:** `HomeAndConstructionBusiness`, będące podtypem LocalBusiness/Organization, ze stabilnym `@id`; osobne `Service` na stronie usługi. Usunąć pola niepotwierdzone i poprawić obszar działania. Zachować FAQ zgodne z widoczną treścią; nie obiecywać dodatkowych rozszerzeń w wynikach Google. Nie tworzyć opinii, ocen ani ofert z przykładowych parametrów.

Nie ma widocznej nawigacji okruszkowej. `BreadcrumbList` jest w tym stanie **nie dotyczy**, zgodnie z warunkiem zadania. Dodawanie ukrytych breadcrumbs nie jest planowane.

### P2 — metadane nie zawsze opisują obecną zawartość

- `domy-na-sprzedaz-bielsko.astro:32`: description mówi o gotowych domach i „dzielnicach, takich jak Pisarzowice”, choć opis jedynej oferty mówi o rozpoczynanym etapie II i fotografiach sprzedanego etapu I.
- `projekty-domow.astro:23`: description obiecuje bazę domów parterowych, piętrowych i z poddaszem, a strona pokazuje jedną pozycję bez takich kategorii.

**Plan:** zachować unikalność i lokalny kontekst, dopasować wyłącznie title/description do potwierdzonej zawartości. Długość tekstów traktować jako wskazówkę redakcyjną, a nie limit indeksowania. Nie zmieniać marketingowego body w ramach technicznego wdrożenia.

### P2 — błędne wymiary grafiki Open Graph

`public/og-image.jpg`: **1024 × 1024**, 640 604 bajty. `Layout.astro:102–103`: deklarowane **1200 × 630**. Plik OG jest osobnym zasobem od obrazu LCP.

**Plan:** poprawić `og:image:width` i `og:image:height` do rzeczywistych wymiarów; zachować istniejącą grafikę. Open Graph i Twitter Card są już obecne na wszystkich stronach.

### P2 — hierarchia nagłówków strony projektów

`projekty-domow.astro:62`: tytuł karty jest H3 bez nadrzędnego H2. Zmienić go na H2 przy zachowaniu istniejących klas. „Nasze standardy materiałowe” na stronie usługi można ustawić jako równorzędne H2. Nie stwierdzono wielu głównych H1 ani braku elementu `<main>`.

### P2 — warianty obrazów wymagają optymalizacji na podstawie pomiarów

Wdrożone Astro/Vercel już konwertuje obrazy do WebP. Obraz hero ma pojedynczy wariant 1920 × 1080 bez `srcset`/`sizes`. Plik źródłowy o rozmiarze około 3,98 MB **nie jest obecnym transferem do przeglądarki**. W przygotowawczym przebiegu mobilnym transfer hero wynosił około 429 KB; nowy pomiar znajduje się w tabeli i pliku dowodowym poniżej.

Hero już ma `loading="eager"` i `fetchpriority="high"`; nie dodawać mu lazy loading. Obrazy About/Properties są już lazy. Obrazy kart podstron także mają wynikowe `loading="lazy"`; Lighthouse potwierdził je jako LCP obu podstron, więc wymagają eager/high dla pierwszej karty.

**Plan:** natywne warianty Astro, `srcset`/`sizes` i ocena kompresji. Przy `object-cover` uwzględnić wysokość sekcji i kadrowanie, a nie tylko szerokość telefonu. Nie zmieniać proporcji wyświetlania, kadru ani animacji bez potwierdzonej potrzeby.

### P3 — wymiary logo i jakość ALT

Wszystkie istotne zdjęcia mają ALT. Nie ma zadania masowego uzupełniania brakujących opisów. Możliwa jest korekta długiego, powtarzalnego ALT karty inwestycji do faktycznej treści zdjęcia. Logo SVG nie ma atrybutów wymiarów, choć CSS ogranicza jego wysokość. Dodać proporcje 875 × 190 jako zabezpieczenie, z zachowaniem obecnego CSS. Sam brak atrybutów nie dowodzi zmierzonego CLS.

## Wydajność i Core Web Vitals

| Strona / profil | Performance | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|
| home-mobile | 91 | 100 | 3.35 s | 0 | 88.0 ms |
| service-mobile | 100 | 100 | 0.93 s | 0 | 6.5 ms |
| offers-mobile | 100 | 100 | 1.39 s | 0 | 0.0 ms |
| projects-mobile | 95 | 100 | 1.12 s | 0 | 251.4 ms |
| home-desktop | 100 | 100 | 0.67 s | 0 | 0.0 ms |

Jedna próbka dla każdej konfiguracji, Lighthouse 13.5.0, Chromium 156, domyślne profile mobile/desktop. Wyniki pochodzą z tej chmury i ruchu przez proxy. To pomiary laboratoryjne; porównanie przed/po wymaga takich samych warunków, a próbkę z zakłóceniami należy powtórzyć.

Lighthouse nie mierzy terenowego INP; TBT nie jest jego zamiennikiem. Brak skonfigurowanych danych dostępowych do GSC/GA4/CrUX/PSI oznacza brak potwierdzenia rzeczywistej indeksacji, wybranego przez Google canonical, ruchu i 75. percentyla CWV. Osiągnięcie terenowych progów LCP ≤ 2,5 s, INP ≤ 200 ms i CLS ≤ 0,1 wymaga osobnego sprawdzenia danych użytkowników.

## Uwagi wymagające osobnej weryfikacji biznesowej

- `domy-na-sprzedaz-bielsko.astro:18`: `plot: "700 m²"` ma komentarz oznaczający wartość jako przykładową. Nie przenosić jej do nowego JSON-LD. Jest też widoczna na stronie głównej.
- Ceny i czasy budowy w FAQ są treścią zastaną, nie niezależnie potwierdzonym cennikiem.
- Widoczne marketingowe określenia „gotowe domy” i lokalizacji inwestycji wymagają osobnego przeglądu treści; w tym zadaniu dopasować tylko metadane.
- Nie naprawiać automatycznie tokenów fontów Tailwind: istniejące `--font-family-*` nie tworzą oczekiwanych utility Tailwind 4. Ich zmiana włączy inną typografię, co wykracza poza warunek zachowania wyglądu.

## Kontrole i kryteria odbioru

| Kryterium | Stan audytu | Warunek zakończenia wdrożenia |
|---|---|---|
| Unikalne title/description/canonical | Title i opisy unikalne; canonical niespójny | Cztery kanoniczne URL z unikalnymi, zgodnymi metadanymi |
| robots.txt i sitemapa | Działają; wymagają normalizacji URL | Wyłącznie cztery adresy kanoniczne, HTTP 200, bez API/404 |
| JSON-LD | Składnia poprawna; problemy semantyki i danych | Poprawna składnia, typy, właściwości i zgodność z widoczną treścią |
| Treść dostępna dla robotów | Potwierdzona w HTML i po renderowaniu | Zachować zawartość/metadane w pierwszej odpowiedzi HTML |
| Brak duplikatów URL | Niespełnione | Warianty ścieżek przekierowane na jeden URL |
| Wygląd i funkcjonalność | Zebrane widoki bazowe | Porównanie desktop/mobile, nawigacji i kontrolowanego formularza |
| Testy, lint, build | Brak skryptów test/lint; dostępne Astro check/build | Uruchomić dostępne kontrole i celowane testy SEO; podać wyniki |
| Raport | Ten dokument opisuje stan przed wdrożeniem | Uzupełnić rozwiązania, wyniki po zmianach i ograniczenia |

## Działania manualne

1. W Vercel zweryfikować domenę główną i stałe przekierowanie non-www → www, obecnie 307. DNS zmieniać tylko wtedy, gdy wymaga tego konfiguracja hostingu; sam audyt nie wykazał potrzeby zmiany rekordów.
2. Po wdrożeniu przesłać właściwy adres indeksu sitemap w Google Search Console i sprawdzić wybrane adresy narzędziem Inspekcja URL.
3. Sprawdzić wybrany przez Google canonical, raport indeksowania i terenowe CWV. Odnotować datę ponownego crawlowania; nie oczekiwać natychmiastowego efektu w SERP.
4. Zweryfikować zgodność telefonu/adresu w Google Business Profile i istniejących wizytówkach. Publikacja wymaga dostępu do tych kont.

## Dowody i odtwarzanie

Wersjonowane, zwarte wyniki: [baseline.json](seo-evidence/2026-10-15-baseline.json). Surowe HTML, JSON narzędzi, screenshoty i pełne raporty Lighthouse: `.agents/artifacts/investdom.com.pl-audit/` (lokalne pliki wyłączone z Git).

Przykładowe polecenia:

```bash
.agents/bin/seo run fetch_page.py https://www.investdom.com.pl/ --json --max-text 500
.agents/bin/seo run parse_html.py .agents/artifacts/investdom.com.pl-audit/pages/p0.html --json
.agents/bin/seo run sitemap_discovery.py https://www.investdom.com.pl/ --json
.agents/bin/seo run render_page.py https://www.investdom.com.pl/ --mode always --json --max-text 500
.agents/bin/seo lighthouse https://www.investdom.com.pl/ --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --output-path=.agents/artifacts/investdom.com.pl-audit/lighthouse/home-mobile
.agents/bin/seo check
.agents/bin/seo build
```

Polecenia sieciowe wymagają dostępu do sieci; przeglądarkowe także możliwości odświeżenia CA proxy w magazynie NSS, zgodnie z `.agents/README.md`.

## Stan podglądu — draft PR

W tym podglądzie dostępne są:

- origin www, canonical niezależny od hosta preview i parametrów UTM;
- natywne reguły Vercel 308 dla końcowego slash oraz konfiguracja stałego redirect hosta;
- automatyczna sitemapa z czterema kanonicznymi URL;
- wspólne dane firmy: +48 571 328 993, ul. Do lasu 25;
- HomeAndConstructionBusiness i Service na stronie budowy pod klucz;
- usunięte niepotwierdzone GPS, priceRange i typ pośrednika; bezpieczna serializacja JSON-LD.

Zweryfikowano stan commitów etapów 1–2: 9/9 testów, astro check: 0 błędów i 0 ostrzeżeń (5 istniejących podpowiedzi). Build dla etapu 1 zakończony powodzeniem. Vercel sprawdzi build bieżącego PR.

Draft nie oznacza ukończenia całego Technical SEO Foundation. Kolejne commity wprowadzą zadania 3–5 z planu. Obecna konfiguracja domeny w panelu Vercel może wyprzedzać reguły repozytorium i nadal wymaga sprawdzenia po publikacji. Dane GSC/GA4/CrUX i faktyczna wysyłka produkcyjnego formularza nie zostały zweryfikowane.
