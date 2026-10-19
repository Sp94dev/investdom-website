# Aktualizacja oferty i zdjęcia — 19 października 2026

## Zakres

- Zastosowano zaakceptowany przez właściciela wariant zdjęcia domu w Pisarzowicach: szerszy kadr, uporządkowane i częściowo zwizualizowane otoczenie. Klimatyzatory pozostają widoczne.
- Wspólne źródło zdjęcia i ALT obsługuje hero, sekcję „O firmie”, ofertę oraz projekty. Każdy widok zdjęcia ma podpis „Wizualizacja otoczenia”.
- Astro generuje responsywne AVIF/WebP z pliku źródłowego 1672 × 941 px. Hero zachowuje `loading="eager"` i `fetchpriority="high"`; jego wariant WebP w pełnej rozdzielczości waży 139 422 B.
- Oferta otrzymała krótki status „Etap II w trakcie realizacji”. Usunięto nieaktualne twierdzenie, że zdjęcie przedstawia sprzedany dom z pierwszego etapu.
- Nagłówek, wstęp i metadane strony ofertowej wskazują Pisarzowice koło Bielska-Białej. Cena i parametry nieruchomości pozostają zgodne z potwierdzonymi danymi.
- Nie publikowano informacji o sprzątaniu budowy ani przygotowaniach do prezentacji.

## Weryfikacja lokalna

- `npm run check`: 0 błędów, 0 ostrzeżeń, 4 istniejące wskazówki.
- `npm test`: 52/52 testy zaliczone.
- `npm run build` wraz z `postbuild`: sukces; wygenerowane cztery reprezentacje Markdown zawierają aktualną treść.
- Chromium: cztery podstrony przy szerokości 375 i 1440 px, osiem przypadków bez błędów JavaScript i poziomego przepełnienia.
- axe: brak wykrytych naruszeń w ośmiu przypadkach. Część kontrastów na zdjęciach i gradientach wymaga oceny wzrokowej; wynik automatyczny nie oznacza pełnego audytu WCAG.
- Sprawdzono kadry na telefonie i desktopie oraz działanie menu, scrollspy, focus formularza kontaktowego i treści bez JavaScript. Formularz nie był wysyłany.
- `git diff --check`: sukces.

Wyniki przeglądarkowe pochodzą z lokalnej emulacji gotowego buildu. Wdrożenie Vercel wymaga osobnej kontroli po publikacji PR. Ta aktualizacja nie stanowi nowego pomiaru widoczności GEO ani Core Web Vitals w produkcji.

## Materiały

- Bieżący plik: `src/assets/images/pisarzowice-etap-ii-hero.png`.
- Wcześniejszy checkpoint ustaleń: branch `checkpoint/offer-clarity-2026-10-19`, commit `ee7e22e32c8edf9a7ee32d23cfeeaae6cded4784`. Wariant zdjęcia w tym checkpointcie został zastąpiony aktualnym.
