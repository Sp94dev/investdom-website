# Aktywna pozycja nawigacji

Uzgodnione z właścicielem 16.10.2026 po rozmowie `grill-me`:

- Desktop i rozwinięte menu mobilne pokazują tę samą aktywną sekcję.
- O firmie / Domy / Usługi: granatowy tekst i podkreślenie, bez zmiany rozmiaru lub grubości czcionki. Aktywny przycisk Kontakt ma dodatkowy obrys.
- Przed pierwszą sekcją menu (hero) brak aktywnej pozycji. W FAQ pozostają aktywne Usługi. Na końcu strony Kontakt jest aktywny.
- Na stronie głównej aktywna jest ostatnia sekcja, której początek minął linię 16 px poniżej stałego nagłówka. Kierunek przewijania nie zmienia reguły.
- **Także podczas płynnego przewijania po kliknięciu zaznaczamy faktycznie mijaną sekcję.** Nie blokujemy oznaczenia na docelowym linku.
- Ręczne przewijanie nie zmienia URL ani historii i nie przejmuje fokusu. Kliknięcia zachowują natywne działanie kotwic i fragment adresu.
- Oferty i projekty mają aktywne Domy, a strona budowy pod klucz — Usługi. To oznaczenie jest już w HTML z serwera.
- Przewijanie do kotwicy uwzględnia wysokość nagłówka. Preferencja reduced motion wyłącza płynne przewijanie.

Implementacja: `Header.astro` (statyczne przypisanie podstron i styl), `src/scripts/section-navigation.ts` (śledzenie na głównej), `global.css` (offset kotwic i reduced motion). Aktualizacje są grupowane przez requestAnimationFrame; listener scroll jest pasywny. ResizeObserver aktualizuje oznaczenie po zmianach rozmiarów sekcji i nagłówka. Brak nowych bibliotek.

Zakres tej zmiany nie obejmuje publikacji produkcyjnej ani pozostałych zaplanowanych prac SEO/Agent Readiness. Kontrole kompilacji i ograniczenia weryfikacji są raportowane w opisie PR.

Przegląd kodu wychwycił rozbieżność 1rem vs 16px przy zmienionej domyślnej czcionce przeglądarki; offset kotwic i linia przełączenia używają teraz tych samych 16 CSS px. Astro Check: 0 błędów, 0 ostrzeżeń i 5 istniejących wskazówek; build przechodzi. Nie dodawano ani nie uruchamiano nowych testów przeglądarkowych w ramach tej zmiany.

## Płynne przejścia

Na prośbę właściciela podkreślenie jest teraz jedną wspólną kreską dla każdego menu. Przy wejściu w pierwszą sekcję pojawia się przez fade-in (180 ms). Między aktywnymi linkami przesuwa się w obie strony i dopasowuje szerokość do tekstu (280 ms); w pionowym menu mobilnym porusza się wzdłuż listy. Przy powrocie do hero lub przejściu do Kontakt kreska zanika. Obrys Kontakt i kolor tekstu także mają płynne przejścia.

Wymiary są aktualizowane po zmianie rozmiaru menu i załadowaniu fontów. Kreska jest dekoracyjna (`aria-hidden`), a aktywna pozycja nadal jest oznaczana przez `aria-current`. Przy wyłączonym JavaScript pozostaje zwykłe podkreślenie aktywnych pozycji podstron. `prefers-reduced-motion: reduce` wyłącza nowe przejścia. Użyto natywnych CSS i API przeglądarki, bez nowych bibliotek.
