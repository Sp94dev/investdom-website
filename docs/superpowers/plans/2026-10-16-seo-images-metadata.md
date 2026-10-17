# SEO — obrazy, metadane i kontrola interakcji

Zakres zatwierdzony przez właściciela: punkt 2 kolejnej paczki, tj. obrazy, priorytety LCP, metadane, semantyka oraz kontrola formularza i nawigacji. Plan uszczegóławia techniczne zadania wcześniejszego `2026-10-16-maximize-preview-results.md` po scaleniu PR #1. Osobny branch od aktualnego `main`; usuwanie remontów pozostaje w PR #2.

## Wymagania

- Zachować zdjęcia, ich kadr, istniejący układ i funkcjonalność. Użyć `astro:assets` i istniejącego Sharp, bez nowych bibliotek.
- Natywnie prerenderować cztery publiczne strony o stałej treści, aby wygenerować obrazy podczas buildu; formularz POST /api/contact pozostaje dynamiczny.
- Responsive AVIF/WebP dla zdjęć, prawdziwe proporcje w HTML, prawidłowe `sizes`. Hero i pierwszy obraz ofert/projektów eager/high; pozostałe zdjęcia lazy.
- OG zgodne z rzeczywistym plikiem; unikalne metadane zgodne z treścią; jeden H1 i poprawna hierarchia, naturalne ALT bez niepotwierdzonej lokalizacji.
- Kontakt: fokus formularza po kliknięciu i wejściu z #kontakt, zachowane menu, działający scrollspy i reduced motion.
- Po potwierdzeniu ostrzeżenia FencedFrame zaktualizować wyłącznie istniejące `@astrojs/partytown` do 2.1.8 zgodnie z wcześniejszym planem; zachować GA4 i sprawdzić konfigurację przez przechwycony transport.
- Kontrolować formularz przez przechwycony transport; nie wysyłać wiadomości ani zdarzeń analitycznych do produkcji podczas kontroli lokalnych.
- Nie wdrażać na produkcję przed scaleniem nowego PR. Nie usuwać noindex z podglądu.

## Kroki

1. Sprawdzić aktualny kod i pliki, zachować punkt odniesienia ze zbudowanego SSR. Użyć Lighthouse, Chromium/Playwright, axe oraz Sharp z istniejącego środowiska. Dobór jakości opierać na porównaniu rzeczywistych bajtów i widoku, a nie jednakowej liczbie jakości dla różnych kodeków.
2. Wprowadzić natywne warianty obrazów i priorytety. Domknąć OG, opisy ofert/projektów, hierarchię i ALT. Bez zmian niepotwierdzonych danych oferty i bez rozszerzania marketingu.
3. Astro Check/build, HTML i nagłówki, porównanie geometrii i zrzutów, kontrola klawiatury, formularza, focus i reduced motion. Przebiegi Lighthouse wykonywać sekwencyjnie, porównywać ten sam typ środowiska. Nie porównywać lokalnego dev z wdrożeniem jako dowodu wzrostu wyniku.
4. Raport z dokładnym zakresem, ograniczeniami i porównaniem. Świeży przegląd całej zmiany i osobny PR z podglądem Vercel.

Istniejące niezatwierdzone rozszerzenia `tests/seo.test.mjs` zachować. Nie dodawać ani nie uruchamiać zestawu testów jednostkowych w ramach tej paczki; weryfikacja obejmuje wymienione kontrole kompilacji i przeglądarki. Pozostałe zadania GEO, MCP i konfiguracja kont nie należą do tej paczki.
