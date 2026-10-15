# INVESTDOM Technical SEO Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Poprawić kanonikalizację, dane firmy i JSON-LD, metadane oraz ładowanie obrazów czterech stron INVESTDOM.

**Architecture:** Zachować SSR Astro, routing plikowy, istniejące sitemap i transformacje obrazów Vercel. Canonical opierać na `Astro.site`; dane firmy współdzielić między body i JSON-LD. Używać natywnych API i istniejących zależności.

**Tech Stack:** Astro 5, TypeScript/ESM, Tailwind 4, Vercel, astro:assets, Node test runner, Claude SEO, Lighthouse.

**Spec:** [Audyt i kryteria odbioru](../../seo-audit.md). Dane bazowe: `docs/seo-evidence/2026-10-15-baseline.json`.

## Global Constraints

- Zachować wygląd, kadrowanie zdjęć, typografię, animacje i funkcjonalność.
- Nie zmieniać body marketingowego poza potwierdzonymi danymi kontaktowymi i ALT.
- Telefon: `+48571328993`, prezentacja `+48 571 328 993`; ulica: `ul. Do lasu 25`.
- Origin: `https://www.investdom.com.pl`; podstrony bez końcowego `/`.
- Nie wymyślać danych firmy/ofert, ocen ani opinii; nie dodawać nowej biblioteki SEO/testowej.
- Nie stosować lazy loading dla głównych obrazów LCP.
- Wymagające dostępu do GSC/DNS/hostingu działania opisać jako manualne.
- Branch `seo/technical-foundation`; wynik: PR z raportem i wynikami kontroli.

## Review Focus

1. Query/UTM: canonical usuwa query; redirect zachowuje je.
2. POST `/api/contact` i `/_image`: normalizacja nie psuje metod API ani obrazów.
3. Nieistniejące URL: status 404, wykluczenie z sitemapy.
4. Wysoki telefon, retina i desktop: responsywne obrazy zachowują kadr i jakość.
5. JSON-LD: bez przykładowej działki 700 m², niezweryfikowanych GPS/cen i możliwości zamknięcia tagu script.

### Task 1: Canonical, przekierowania i sitemapa

**Files:** `astro.config.mjs`, `vercel.json`, `public/robots.txt`, `src/layouts/Layout.astro`, nowy `src/lib/seo.mjs`, `tests/seo.test.mjs`, `scripts/check-seo.mjs`, `package.json`.

**Interfaces:** `getCanonicalUrl(pathname, site)` zwraca absolutny URL na origin `site`, bez query/hash i końcowego slash poza `/`. Kontrola HTTP przyjmuje osobno origin testowy i produkcyjny. Sitemapa nadal powstaje automatycznie.

- [ ] Dodać i uruchomić testy odpowiedzi HTML/HTTP przeciw bazowemu kodowi; oczekiwany RED dla hosta, slash i sitemapy.
- [ ] Ustawić `site` www, `trailingSlash: 'never'`, stałą normalizację ścieżek Vercel oraz politykę hosta. Zachować query i metody POST.
- [ ] Zastosować helper canonical w layoucie i społecznościowych URL; poprawić deklarację sitemap w robots.txt.
- [ ] Sprawdzić wygenerowany indeks i jego mapy: 4 kanoniczne URL, bez API/404, bez sztucznego lastmod.
- [ ] Testy i build GREEN; commit `fix(seo): align canonical URLs and sitemap`.

### Task 2: Dane firmy i JSON-LD

**Files:** nowy `src/data/company.mjs`, `src/lib/seo.mjs`, `src/layouts/Layout.astro`, `Footer.astro`, `Contact.astro`, `budowa-domow-pod-klucz.astro`, testy.

**Interfaces:** `company` przechowuje wspólne dane; `getBusinessSchema(site)` tworzy HomeAndConstructionBusiness z `/#organization`; `getServiceSchema(site)` opisuje budowę pod klucz i odwołuje się do firmy przez `provider.@id`. Layout przyjmuje dodatkowe dane strony; serializacja JSON-LD chroni granicę tagu script.

- [ ] Testy RED dla niepoprawnego telefonu/ulicy, danych strukturalnych i braku Service.
- [ ] Ujednolicić dane firmy w body, kontaktowych meta i JSON-LD.
- [ ] Usunąć niepotwierdzone RealEstateAgent, geo, priceRange i błędny powiat czechowicki; serviceType przypisać Service.
- [ ] Dodać Service wyłącznie na stronie usługi; zachować prawdziwe FAQ. BreadcrumbList: N/A, brak widocznych breadcrumbs.
- [ ] Sprawdzić JSON, typy/właściwości, referencje i zgodność treści; testować tekst `</script>`.
- [ ] Testy i astro check GREEN; commit `fix(seo): unify business data and service schema`.

### Task 3: Metadane i semantyka

**Files:** Layout, strony ofert/projektów/usługi, LogoIcon, testy.

**Interfaces:** zachować title/description/ogImage; dodać kontrolę jednego H1/main i kompletności OG/Twitter.

- [ ] Testy RED dla wymiarów OG i hierarchii nagłówków.
- [ ] Dopasować metadata ofert do etapu II w Pisarzowicach; metadata projektów do rzeczywistej pozycji, bez obietnicy nieobecnych kategorii.
- [ ] Podać rzeczywiste wymiary OG 1024 × 1024; zachować grafikę.
- [ ] H3 karty projektu → H2; standardy materiałowe jako H2. Zachować klasy. Dodać proporcje logo 875 × 190 bez zmiany wymiarów CSS.
- [ ] Ocenić ALT względem zdjęć; nie dopisywać fikcyjnych lokalizacji.
- [ ] Testy GREEN; commit `fix(seo): refine metadata and heading semantics`.

### Task 4: Obrazy i LCP

**Files:** Hero, About, Properties, strony ofert/projektów, testy i dowody.

**Interfaces:** natywne warianty Astro, srcset/sizes; hero i pierwsze obrazy ofert/projektów eager/high, pozostałe lazy.

- [ ] Testy RED dla LCP lazy i braku responsywnych wariantów.
- [ ] Nadać eager/high pierwszym obrazom ofert/projektów; zachować eager/high hero i lazy niższych obrazów.
- [ ] Dodać warianty uwzględniające wysokość/kadr object-cover i retina; dostroić kompresję tylko przy zachowaniu jakości.
- [ ] Porównać transfer rzeczywistych wariantów, LCP, CLS/TBT oraz screenshoty. Nie zmieniać animacji ani tokenów fontów.
- [ ] Testy GREEN; commit `perf(seo): optimize responsive images and LCP loading`.

### Task 5: Weryfikacja i Pull Request

**Files:** raport, plan, dowody, testy i opis PR.

- [ ] Uruchomić pełne testy Node, astro check i build; nie nazywać Astro check lintem.
- [ ] Kontrola surowego HTML, DOM, canonical, JSON-LD, HTTP, XML i 404; bez wysyłania produkcyjnego formularza.
- [ ] Porównać desktop/mobile, menu, kotwice i formularz na kontrolowanym transporcie; ujawnić ograniczenia testu doręczenia.
- [ ] Pomiary laboratoryjne porównać w tych samych warunkach; INP/terenowe CWV i GSC pozostają osobnym sprawdzeniem.
- [ ] Uzupełnić raport o rozwiązania i wyniki, oznaczyć manualne przełączenie przekierowania domeny Vercel 307 → 308, GSC i GBP.
- [ ] Niezależny przegląd całego brancha, poprawki z testem RED→GREEN, commit dokumentacji.
- [ ] Wypchnąć branch i otworzyć PR do main; bez automatycznego wdrożenia produkcyjnego.

## Poza zakresem

Biznesowo zweryfikować przykładowe 700 m² i marketingowe deklaracje gotowych domów. Osobno rozważyć kontrast, label selecta, fokus zamkniętego menu i warning Partytown FencedFrame. Nie zmieniać typografii poprzez naprawę tokenów Tailwind w zadaniu SEO.

## Postęp

- Etap 1: ukończony, commit 622842a, 5/5 testów i build.
- Etap 2: ukończony, commit 2efda78, 9/9 testów, astro check bez błędów.
- Etapy 3–5: w toku. Na prośbę użytkownika otwierany draft PR, aby udostępnić podgląd Vercel przed zakończeniem pozostałych etapów.
