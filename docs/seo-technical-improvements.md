# SEO — obrazy, metadane i dostępność, 16.10.2026

Zakres: techniczny punkt 2 kolejnej paczki po PR #1. Zmiany przygotowano na branchu `perf/seo-images-metadata`, od `e15dcbd` na main. Usunięcie remontów jest osobną zmianą w PR #2.

## Wdrożone w kodzie

### Obrazy i dostarczenie stron

- Natywny `Picture` z `astro:assets`: AVIF, WebP i fallback WebP, warianty szerokości oraz `sizes` dla hero, zdjęcia firmy, inwestycji i projektu.
- Hero ma proporcje 4032×3024 źródła, poprawne HTML 1920×1440, eager/high i rozmiar źródła uwzględniający wysokość ekranu. Zdjęcie i kadr pozostają te same. Jakość 35 dla tła z istniejącymi nakładkami, 45 dla zdjęć treści. Dobór oparto na bajtach i porównaniu zrzutów, nie na założeniu identycznej jakości różnych kodeków.
- Pierwszy obraz ofert i projektów ma eager/high; obrazy poniżej pierwszego ekranu na głównej pozostają lazy. Logo rezerwuje rzeczywiste proporcje 875×190.
- Cztery publiczne strony o stałej treści używają natywnego prerenderowania Astro. Ich HTML i 34 warianty obrazów powstają w buildzie, unikając konwersji AVIF przy pierwszym żądaniu. Formularz `/api/contact` pozostaje dynamicznym endpointem serwerowym. Aktualizacja treści stron nadal wymaga wdrożenia zmian z repozytorium.
- Pierwszy build z nowymi wariantami trwał około 145 s, następny z cache 7,53 s. Cache lokalny nie jest obietnicą czasu buildu Vercel.

### Metadane i semantyka

- OG ma rzeczywiste wymiary pliku 1024×1024, a `og:see_also` prawidłowy host www.
- Opisy ofert i projektu odpowiadają obecnej treści: nie obiecują gotowych domów ani wielkiego katalogu i nie określają Pisarzowic jako dzielnicy Bielska-Białej.
- Sekcja standardów materiałowych ma H2 przy zachowaniu klas. Cztery main mają pojedynczy H1 i nie pomijają poziomów nagłówków.
- ALT opisują zdjęcia bez niepotwierdzonej lokalizacji; zdjęcie inwestycji odpowiada opisowi pierwszego etapu z istniejącej treści.

### Analityka i formularz

- Zaktualizowano wyłącznie istniejące `@astrojs/partytown` do 2.1.8 oraz jego zależność. GA4 i forward `dataLayer.push` pozostają w konfiguracji.
- Odtworzono niemal biały komunikat ładowania na białej karcie: nieistniejący `text-navy-600` zastąpiono `text-navy-900`. Potwierdzenie ma kontrastowy `green-700`. Dodano semantykę live status oraz autocomplete name/tel/email.
- Hero uwzględnia `prefers-reduced-motion`: przy tej preferencji pojawia się od razu. Domyślna animacja pozostaje taka sama.

## Weryfikacja

- Astro Check: 0 błędów, 0 ostrzeżeń, 4 istniejące podpowiedzi. Build i `git diff --check`: PASS.
- Raw HTML czterech stron: unikalne metadane, canonical/OG/Twitter www, poprawne rozmiary OG, main/H1, hierarchia, wymiary obrazów i priorytety.
- Sześć porównywalnych zrzutów Chromium: 375×812, 412×915, 390×844 DPR3 i desktop 1440×1000 na głównej oraz mobilne oferty/projekty. Geometria mierzonych sekcji i zdjęć nie różni się o więcej niż 0,5 CSS px; brak poziomego overflow. Oceniono wygląd hero przed/po.
- axe WCAG A/AA: osiem kontroli czterech stron na mobile/desktop i cztery kontrole komunikatów formularza, bez wykrytych naruszeń. To kontrola automatyczna, nie pełny audyt WCAG.
- Kontakt: bezpośredni #kontakt, kliknięcie przy już istniejącym fragmencie, menu mobilne, klawiatura/Escape/inert, scrollspy bez zmiany hash/fokusu przy ręcznym scrollu, reduced motion oraz płynne przewijanie przechodzą kontrolę Chromium.
- WebP fallback działa po kontrolowanym oznaczeniu AVIF jako nieobsługiwanego. Partytown: lokalny stub potwierdził jedną inicjalizację/config GA4 oraz forward `dataLayer.push` w nowej i ponownej sesji workera; nie wysyłano danych do produkcyjnej analityki.
- Świeży niezależny przegląd całego diffu `e15dcbd..f45e2f4`: brak usterek wymagających poprawki.
- Walidacja telefonu/e-mail i trzy wyniki wysyłki: sukces, błąd serwera i błąd sieci. Wysyłkę przechwycono lokalnie; nie wysyłano prawdziwej wiadomości. Treści czterech stron są dostępne bez JavaScript.

## Pomiary Lighthouse

Wykonano 30 przebiegów (po trzy na każdy wariant w obu fazach). Lighthouse 13.5 i Chromium 156, ten sam lokalny serwer zbudowanego wyjścia Vercel; nie używano dev jako punktu porównania. Transport Google Analytics był blokowany w obu fazach. **Serwer porównawczy nie odtwarza kompresji HTML/CSS ani CDN Vercel; poniższe liczby nie są wynikiem wdrożonej produkcji.**

| Wariant | Performance przed → po | LCP przed → po | TBT przed → po |
|---|---:|---:|---:|
| home-mobile | 60 → 90 | 4.66 → 3.39 s | 851 → 0 ms |
| service-mobile | 100 → 100 | 1.51 → 1.51 s | 38 → 23 ms |
| offers-mobile | 99 → 100 | 1.96 → 1.66 s | 108 → 59 ms |
| projects-mobile | 99 → 100 | 1.66 → 1.66 s | 98 → 32 ms |
| home-desktop | 98 → 100 | 0.93 → 0.65 s | 43 → 0 ms |

Mediany A11y i SEO: 100 przed i po we wszystkich wariantach; CLS: 0. Best Practices pozostaje 81: ostrzeżenie `FencedFrame` występuje również w świeżej sesji Partytown 0.14.5 po aktualizacji integracji do 2.1.8. Aktualizacja nie usunęła tego problemu upstream. Lokalny cel mobile ≥95 i LCP ≤2,5 s nie został osiągnięty na głównej; wynik wymaga osobnej kontroli na wdrożonym CDN.

Rozrzut Performance na głównej mobile: 49–82 przed, 65–90 po; część prób zawiera ostrzeżenie o wolnym CPU. Spadek mediany TBT nie jest gwarancją poprawy INP ani samodzielnym dowodem działania jednej konkretnej optymalizacji. Wariant hero 1920 px ma 180 003 B AVIF zamiast 429 016 B WebP (−58,04%); ekran DPR3 może wybrać większy, ostrzejszy wariant.

[Surowe wyniki i mediany, geometria, kontrola formularza, fallback i analityka](seo-evidence/2026-10-16-images-metadata.json).

## Ograniczenia i odbiór

- Lokalne czasy i wyniki nie są danymi terenowymi Core Web Vitals ani wynikiem produkcji. Ostrzeżenia o wolnym CPU i rozrzut TBT trzeba czytać razem z medianami.
- WebP można sprawdzić w Chromium przez oznaczenie AVIF jako nieobsługiwanego w kontrolowanym HTML. Nie zastępuje to kontroli prawdziwego Safari/iPhone ani czytnika ekranu.
- Nie uruchamiano zestawu testów jednostkowych. Wcześniejsze niezatwierdzone rozszerzenia `tests/seo.test.mjs` pozostają poza tym PR.
- Fakty oferty wymagające potwierdzenia przez właściciela (cena, działka, status, widełki FAQ) pozostają do osobnego zadania. Nie zmieniano DNS ani kont GSC/Bing/Google.
- Publikacja produkcyjna i ocena terenowa następują po scaleniu PR. Podgląd nadal powinien zachować noindex.
