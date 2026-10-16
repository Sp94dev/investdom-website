# INVESTDOM — aktualny wynik podglądu i specyfikacja poprawy

**16.10.2026, 09:22–09:23 Europe/Warsaw.** Sprawdzony podgląd brancha `seo/technical-foundation`, commit `616871b`, wdrożenie Vercel `FdrZBgcn3LE8gV6zMuRgfw8xMgCW`.

Podstawa planu: prośba właściciela o ponowne sprawdzenie wyniku i szczegółów oraz przygotowanie planu Superpowers. Ta aktualizacja zawiera pomiary i plan; nie wdraża kolejnych optymalizacji.

## Aktualne wyniki

Lighthouse 13.5.0 / Chromium 156, dostęp udostępniony przez właściciela, po jednym pomiarze na wariant, sekwencyjnie, przez proxy środowiska. Cztery podstrony sprawdzono też w surowym HTML. To wyniki laboratoryjne, nie terenowe Core Web Vitals.

| Strona / urządzenie | Performance | A11y | Best Practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Główna / mobile | 86 | 100 | 81 | 69 | 3,96 s | 6,5 ms | 0 |
| Usługa / mobile | 100 | 100 | 81 | 69 | 0,94 s | 16 ms | 0 |
| Oferty / mobile | 100 | 100 | 81 | 69 | 1,38 s | 28 ms | 0 |
| Projekty / mobile | 99 | 100 | 81 | 69 | 1,81 s | 78 ms | 0 |
| Główna / desktop | 99 | 100 | 81 | 69 | 0,91 s | 79 ms | 0 |

Agentic Browsing: **2/2** dla każdego wariantu — drzewo dostępności i CLS przechodzą. Pozostałe kontrole są N/A. Nie przedstawiamy tego jako „100% GEO”. Wszystkie warianty przechodzą również kontrolę `target-size`, a także `select-name`, `aria-hidden-focus` i `color-contrast`. Nie oznacza to pełnego audytu WCAG czy wszystkich stanów interakcji.

### Dlaczego SEO ma 69?

Jedyna niezaliczona punktowana kontrola kategorii SEO to `is-crawlable`: nagłówek `X-Robots-Tag: noindex` dodawany do podglądu. **To prawidłowe zabezpieczenie preview.** Canonical wskazuje `https://www.investdom.com.pl`, dane firmy są spójne, metadane i główne treści są w HTML. Zwiększanie wyniku przez indeksowanie podglądu byłoby błędnym celem. Brak noindex i wynik SEO 100 należy sprawdzać na produkcji po wdrożeniu.

### Co ogranicza Performance?

- Na głównej LCP to hero. Dostarczany WebP ma **429 016 B (419 KiB)**. Audyt image delivery szacuje **307 102 B (300 KiB)** możliwych oszczędności dla hero i około **409 KiB** dla obrazów całej strony. Są to estymacje narzędzia, nie gwarantowane oszczędności ani liczby, które należy sumować z podwierszami audytu.
- Hero już ma `eager` i `fetchpriority="high"`, więc ponowne dodanie tych atrybutów nie rozwiąże problemu. Brak responsywnych wariantów; potrzebna jest kontrola formatu i kompresji.
- Faktycznie pobrany hero ma **1920×1440**, chociaż HTML i parametry URL deklarują 1920×1080. Źródło to 4032×3024, orientacja EXIF 1. Plan wariantów musi opierać się na rzeczywistym obrazie i zachować obecny kadr `object-cover`, szczególnie na wysokim telefonie.
- Pierwsze obrazy ofert i projektów są LCP na tych stronach, ale mają `loading="lazy"` i domyślny priorytet. Przechodzące dziś wyniki nie znoszą tego błędu strategii ładowania.
- Logo nie rezerwuje wymiarów w HTML; CLS w pomiarach wynosi jednak 0. To korekta odporności układu, nie dowód już występujących przesunięć.
- CSS blokujący renderowanie ma około 8,4 kB transferu. Nie uzasadnia to przebudowy Tailwind ani ręcznego wklejania całego CSS do HTML.

Każdy przebieg zawiera przekierowanie związane z linkiem udostępnienia Vercel; Lighthouse ostrzega o nim. Nie traktować go jako błędu routingu produkcji ani porównywać bezpośrednio z pomiarem bez uwierzytelnienia. Sam wynik może zmieniać się między przebiegami; plan wymaga mediany trzech porównywalnych prób przed i po optymalizacji.

### Co ogranicza Best Practices?

Jedyna niezaliczona punktowana kontrola to `deprecations`: `FencedFrame` w `~partytown/partytown-sandbox-sw.html`. W projekcie działa `@astrojs/partytown` 2.1.4 / `@qwik.dev/partytown` 0.11.2. Rejestr npm w dniu audytu wskazuje nowszą integrację **2.1.8**, zależną od `@qwik.dev/partytown ^0.14.4`. Nie zainstalowano aktualizacji w ramach planowania; usunięcie ostrzeżenia wymaga osobnej kontroli po aktualizacji. Nie wyłączać GA4, aby podnieść wynik.

## SEO/GEO poza wynikiem skanera

Podgląd ma poprawny kontakt i schematy `HomeAndConstructionBusiness` / `Service`. Nadal nie rozstrzygnięto:

- metadane ofert mówią o gotowych domach i dzielnicy Pisarzowice, podczas gdy body opisuje rozpoczynany etap II;
- opis projektów obiecuje katalog wielu kategorii przy jednej widocznej karcie;
- 700 m² działki jest w kodzie oznaczone jako wartość przykładowa; aktualność ceny, statusu i widełek FAQ wymaga potwierdzenia;
- nie ma osobnych, udokumentowanych stron realizacji ani potwierdzonych własnych profili firmy do `sameAs`;
- obraz OG ma 1024×1024, a metadane deklarują 1200×630.

## Cel i ograniczenia realizacji

1. Cel wydajności: dążyć do 100, przyjąć jako bramkę medianę **Performance ≥95 mobile** na każdej stronie i **≥99 desktop** na głównej, lab LCP ≤2,5 s, TBT ≤200 ms, CLS ≤0,1. Bez deklarowania gwarantowanego wyniku przed pomiarem.
2. Utrzymać A11y 100 i `target-size` pass, Agentic 2/2; dodać manualną kontrolę klawiatury i stanów formularza.
3. Best Practices: cel 100 po wspieranej aktualizacji Partytown; gdy ostrzeżenie pozostanie u dostawcy, zachować analitykę i jawnie opisać ograniczenie.
4. SEO: w podglądzie tolerować wyłącznie celowe `is-crawlable` fail; na produkcji cel 100 i zgodny HTTP/HTML/XML. Nie publikować preview do indeksowania.
5. GEO: poprawić zgodność informacji, wykorzystać tylko materiały zatwierdzone przez właściciela i mierzyć rzeczywiste wzmianki/cytowane URL. Nie wyznaczać arbitralnej punktacji GEO ani obietnicy rekomendacji.
6. Zachować układ, zdjęcia, kadr, typografię, animacje i działające formularze. Bez nowych bibliotek SEO, bez migracji frameworka i bez wymyślonych danych. Nowe treści realizacji stanowią osobną paczkę wymagającą materiałów właściciela.

## Dowody i wykonanie

- [Wyniki, szczegóły audytów i HTML](seo-evidence/2026-10-16-preview-scores.json) — tokeny udostępnienia usunięto; pełne lokalne raporty pozostają w ignorowanych artefaktach narzędzi.
- [Plan Superpowers](superpowers/plans/2026-10-16-maximize-preview-results.md).
- [Szerszy audyt SEO/GEO](seo-geo-audit.md).
- [Astro Image/Picture](https://docs.astro.build/en/reference/modules/astro-assets/) — implementować wyłącznie API dostępne w zainstalowanym Astro 5, bez kopiowania funkcji z nowszego majora dokumentacji.
- [Google o optymalizacji dla funkcji generatywnych](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — podstawy SEO, własna użyteczna treść i informacje lokalne; brak wymogu dodatkowych plików AI.
