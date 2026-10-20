# Lokalne treści i inwestycja — 20.10.2026

## Plan i źródła

Baza: aktualny `origin/main`, `1d6a073`. Branch: `feat/local-seo-investment-content`.
Handover `HANDOVER-INVESTDOM-2026-10-20.md` przekazany lokalnie przez właściciela jest źródłem faktów biznesowych. W repozytorium i katalogach nadrzędnych nie znaleziono `AGENTS.md`; lokalny katalog umiejętności nie udostępnia Superpowers.

1. Wzmocnić `/budowa-domow-pod-klucz`, zachowując istniejący wygląd i rozróżnienie zakresów.
2. Dodać `/inwestycje/pisarzowice-etap-ii`: wspólne dane, galeria, kadry projektu, kontakt.
3. Włączyć trasę w SEO, sitemap, Markdown, discovery i routing Vercel; usunąć założenia czterech stron z walidacji.
4. Zweryfikować build, testy, HTTP, widok 375/768/1440 i interakcje. Przygotować PR bez merge.

## Zwięzłe teksty

- H1 usługi: „Budowa domów w Bielsku-Białej i okolicach”.
- Wstęp: „Masz działkę i planujesz budowę domu? Budujemy w Bielsku-Białej i okolicach, od fundamentów po wykończenie. Możesz zlecić nam stan surowy, deweloperski lub budowę pod klucz.”
- CTA usługi: „Zapytaj o wycenę” → `/#kontakt`.
- H1 inwestycji: „Dom na sprzedaż w Pisarzowicach — etap II”.
- Status: „Etap II w trakcie realizacji”. Cena i parametry wyłącznie z `src/data/properties.ts`.
- CTA inwestycji: „Umów się na oglądanie” → `/#kontakt`.
- Rzuty: „Układ pomieszczeń”, osobne nagłówki „Parter” i „Poddasze”. To ten sam projekt według właściciela, nie dokumentacja powykonawcza oferowanego egzemplarza.

## Redakcja całej strony po uwagach właściciela

Użyto zainstalowanego skilla `copy-editing` z repozytorium `coreyhaines31/marketingskills`. Przejrzano wszystkie pięć stron, wspólne dane, metadane, FAQ i kontakt.

- „Zapraszamy do oglądania.” jest osobnym akapitem HTML, również na liście ofert.
- Usunięto instrukcję nad galerią, skrócono podpisy zdjęć i opisy ALT.
- „Układ pomieszczeń” opisuje teraz rozkład domu w dwóch zdaniach. Nagłówki rzutów to „Parter” i „Poddasze”; legenda zastępuje powtarzające ją podpisy.
- Zgodnie z najnowszą prośbą właściciela całkowicie usunięto publiczną wiadomość o autorach i źródle projektu. To świadoma zmiana względem wcześniejszej wytycznej handoveru. Źródłowe materiały i pochodzenie pozostają udokumentowane w tym raporcie.
- Ujednolicono zaproszenia do kontaktu: „Umów się na oglądanie” i „Zapytaj o wycenę budowy”.
- Na stronie głównej, stronie usługi i projektu zastąpiono slogany konkretnym opisem oferty. Usunięto niepotwierdzone gwarancje, liczby dotyczące doświadczenia i satysfakcji, widełki cen/czasu budowy, darmową wycenę, odpowiedź w 24 h oraz deklarację autorskich projektów.
- Cena, lokalizacja, powierzchnia, działka, liczba pokoi, łazienek i status inwestycji nie zostały zmienione. Wygenerowane Markdown i FAQ JSON-LD korzystają z aktualnych tekstów.

Po redakcji powtórzono check/build, wszystkie 53 testy, SEO dla pięciu stron, 299 kontroli HTTP i audyt 15 widoków (375/768/1440 px). Bez błędów JS, poziomego przepełnienia i zgłoszonych naruszeń axe. Osobno sprawdzono odstęp między akapitami oraz widoki galerii, rzutów i kontaktu na telefonie i desktopie.

## Dostarczone zmiany

- Strona budowy: lokalny H1/wstęp, trzy zakresy współpracy, krótki proces ustalenia prac, dwie fotografie i bezpośrednie CTA. Usunięte niepotwierdzone standardy materiałowe i obietnice ze starego opisu. `Service` JSON-LD odpowiada widocznej usłudze.
- Nowa prerenderowana strona inwestycji: parametry ze wspólnego źródła, status etapu, cena, sześć zdjęć, dwa rzuty i CTA. Własny canonical i metadane; `BreadcrumbList` odpowiada widocznej nawigacji.
- Linki do szczegółów z listy ofert, karty na stronie głównej i projektu. Powiązanie usługa ↔ inwestycja. Nowa podstrona zachowuje zaznaczenie „Domy” w menu.
- Nowa trasa jest w allowliście Markdown, literalnym matcherze root middleware, nagłówkach Vercel, discovery i sitemap. Pliki Markdown nadal powstają z HTML; bez ręcznej kopii opisów.
- Walidator SEO oraz testy sitemap/generowania nie zakładają czterech stron. Rozszerzone kontrole obejmują nową trasę, dane, bezpośrednie linki obrazów, eager hero, breadcrumbs, GET/HEAD i nagłówki Markdown.
- Konwerter HTML → Markdown normalizuje białe znaki wewnątrz etykiet linków. Eliminuje to pusty akapit pomiędzy obrazem rzutu i tekstem „Powiększ”; przypadek jest sprawdzany w istniejącym teście konwersji.

## Zdjęcia i rzuty — pochodzenie

W tej sesji właściciel potwierdził: **„Obie grupy przedstawiają obecny dom na sprzedaż w Pisarzowicach”**. Potwierdzenie dotyczy IMG_3244–3254 oraz IMG_3320–3325. Nie tworzono osobnego portfolio wcześniejszych realizacji.

Pobrano oryginały 16 zdjęć z [folderu zdjęć właściciela](https://drive.google.com/drive/folders/1Rivu0H9vBeVsdnKa_gQO7YIInv68bCI4). Wybrane sześć:

| Plik | Ujęcie | Oryginał |
| --- | --- | --- |
| IMG_3244 | Ogród | [Drive](https://drive.google.com/file/d/15wjC7vuigGAWLqszPkD-BA5-7bDbOCka/view) |
| IMG_3321 | Elewacja z wyjściem na taras | [Drive](https://drive.google.com/file/d/13NDjcpcB1mUtuWD26InoPoHzV66bqzUd/view) |
| IMG_3252 | Wejście i garaż | [Drive](https://drive.google.com/file/d/1c_f5yDMrJyScU1gNydyysu0uiqgjdDQS/view) |
| IMG_3254 | Elewacja boczna | [Drive](https://drive.google.com/file/d/1ixYXnE5VuZ73UZ_h1OYYSmWiQ809HOui/view) |
| IMG_3320 | Elewacja ogrodowa na wprost | [Drive](https://drive.google.com/file/d/1ODiL-NxvmP6RzpMNGNU0JD1z3CDw8KuA/view) |
| IMG_3324 | Poddasze i elewacja boczna | [Drive](https://drive.google.com/file/d/1WqbxjHu8yvLX29lE5NNDJDCWCP-Hlt-t/view) |

Produkcyjne pliki JPG powstały z oryginałów przez `sharp`: orientacja EXIF, szerokość 2000 px bez powiększania, JPEG quality 90/mozjpeg, usunięcie metadanych. Astro generuje responsywne AVIF/WebP i osobne obrazy WebP 2000 px do powiększania. IMG_3244 i IMG_3321 są również na stronie budowy. Galeria ma krótkie podpisy ujęć. Zdjęcia pochodzą z różnych sesji i nie stanowią deklaracji dzisiejszego stanu otoczenia. Retusz hero nie był zmieniany; ALT, klimatyzatory i podpis „Wizualizacja otoczenia” pozostały.

Źródło rzutów: [dwustronicowy PDF przekazany przez właściciela](https://drive.google.com/file/d/1aQFwBB2SxQoQQn8mFMItR6Ge0I7YFuBR/view), lokalnie `RzutyOkregowa-1.pdf`. Z każdej strony wyodrębniono osadzony skan 3307 × 2338 px, zachowując oryginalne piksele i proporcje. Kadry `(left, top, right, bottom)`: parter `(410, 230, 2190, 1530)` → 1780 × 1300 px; poddasze `(740, 208, 2200, 1435)` → 1460 × 1227 px. Bez rekonstrukcji AI, zmiany wymiarów lub wyliczania powierzchni. Pełne arkusze, pieczątki, podpisy i adres z metryki nie są publikowane. Na późniejsze, wyraźne polecenie właściciela usunięto z publicznej strony wiadomość o autorach i źródle projektu.

Na prośbę właściciela o większą czytelność prezentacja otrzymała dwa schematy wektorowe: `uklad-projektu-parter-czytelny.svg` i `uklad-projektu-poddasze-czytelny.svg`. Zachowują orientację, proporcje obrysu, podział pomieszczeń, położenie schodów i widoczne otwory ze skanów. Pominięto wymiary i notatki konstrukcyjne; wyposażenia nie dopowiadano. Nazwy, delikatne wypełnienia i kontrastowe numery pomagają odczytać układ. Legenda pomieszczeń jest również tekstem HTML, dostępnym bez JS. Numeracja odpowiada identyfikatorom pomieszczeń ze źródła (np. 1/4 → 4).

Na kolejną prośbę właściciela wzmocniono kolorystykę: salon pomarańczowy, kuchnia żółta, pokoje zielone, łazienki niebieskie, komunikacja beżowa i garaż szaroniebieski. Numery w SVG i legenda HTML mają odpowiadające sobie kolory; nazwy i numeracja nadal przekazują znaczenie niezależnie od koloru. Porównanie wszystkich atrybutów geometrycznych SVG z poprzednim commitem potwierdziło brak zmian układu. Kontrast granatowego tekstu do każdego z sześciu wypełnień wynosi co najmniej **7,90:1**. Po zmianie kolorów powtórzono check/build, 53 testy, SEO i axe na stronie inwestycji przy 375/768/1440 px: bez naruszeń i poziomego przepełnienia.

Schemat SVG otwiera się osobnym linkiem i pozostaje ostry po powiększeniu. Osobny link „Rzut z wymiarami” otwiera niezmieniony PNG ze skanu. Grafiki są emitowane jako lokalne pliki (`?url&no-inline`), aby natywne otwieranie oraz generowany Markdown miały działające adresy HTTP. Brak modala i nowej biblioteki. 135 m² i liczba pokoi pozostają zgodne z ofertą właściciela; to prezentacja układu projektu, nie dokumentacja powykonawcza oferowanego egzemplarza.

Pierwsze dwie propozycje powstały przez wbudowane `imagegen` w trybie edycji skanów, z poleceniem zachowania geometrii i otworów oraz usunięcia oznaczeń technicznych. Odrzucono je po porównaniu: parter miał zamknięte wejście do pokoju, a poddasze dodane otwory w ścianach. Żadna wygenerowana propozycja nie jest użyta w aplikacji. Docelowe SVG są autorską grafiką kodową odwzorowaną z widocznej geometrii skanów, bez generatywnej rekonstrukcji. Kontrola obejmowała także zbliżenia źródłowych połączeń pokój–hall–łazienka–przedsionek i otworów na poddaszu.

## Weryfikacja

Środowisko: Node 24.13.0. `npm ci` według niezmienionego lockfile; brak zmian zależności. Początkowy domyślny Node 20.10 zgłaszał wymaganie nowszego Node przez istniejące pakiety, dlatego instalację i wszystkie kontrole powtórzono na dostępnym Node 24.

| Kontrola | Wynik |
| --- | --- |
| `npm ci` | Zakończone poprawnie; istniejący audit npm raportuje 28 podatności, bez aktualizacji zależności w tej paczce. |
| `npm run check` | 0 błędów, 0 ostrzeżeń, 4 istniejące wskazówki. |
| `npm run build` | Poprawny build Vercel/Astro, 5 stron prerenderowanych i 5 reprezentacji Markdown. |
| `npm test` | 53/53. |
| `npm run check:seo -- http://localhost:4321 https://www.investdom.com.pl` | Wszystkie 5 stron: 200, unikalne metadane, canonical, OG/Twitter, jeden H1 i main. |
| Lokalny HTTP gotowego buildu | 299/299 kontroli, w tym 100 adresów zasobów: wszystkie `src`, warianty `srcset`, powiększenia, Markdown i discovery. HTML → Markdown → HTML, q=0, GET/HEAD, query, 308 bez utraty query i 404. |
| Chromium + axe | 5 stron × 375/768/1440 px; bez poziomego przepełnienia, zgłoszonych naruszeń axe i błędów JS. |
| Bez JavaScript | Wszystkie 5 stron zachowuje główną treść/H1; na inwestycji dostępne parametry, opisy i linki rzutów. |
| Interakcje | Menu mobilne, Escape/inert/focus, zdjęcie, schemat SVG i oryginał z wymiarami otwierane Enterem, focus formularza po „Umów się na oglądanie”, scrollspy czterech sekcji: poprawne. |
| Ocena wzrokowa | Sprawdzone schematy i legendy przy 375/768/1440 px, porównanie ze skanami i otwieranie oryginału z wymiarami. Prezentacja SVG pozostaje ostra przy powiększaniu; wymiary są w osobnym źródłowym PNG. |
| `git diff --check` | Poprawny. |

[Wyniki maszynowe i sumy kontrolne materiałów](seo-evidence/2026-10-20-local-content.json).

## Granice weryfikacji i publikacja

- Lokalny serwer czyta gotowe `.vercel/output/static` i wykonuje rzeczywisty root middleware; odtwarza nagłówki i przekierowania. Nie dowodzi zachowania edge/cache Vercel. Endpoint kontaktowy jest w nim wyłączony, a analityka była blokowana podczas audytu przeglądarkowego. Nie wysłano wiadomości do firmy ani nie zmieniono `CONTACT_EMAIL`/Resend.
- Podgląd T3 dwukrotnie zwrócił `Preview automation snapshot timed out after 15000ms.`; przegląd wykonano w lokalnym headless Chromium przez Playwright zainstalowany wyłącznie poza repo. Nie jest to audyt fizycznego telefonu ani czytnika ekranu. Część kontrastów na obrazach/gradientach jest nierozstrzygana automatycznie przez axe; podpis wizualizacji oceniono wzrokowo.
- Nie otwierano panelu GSC i nie oceniano wzrostu pozycji lub zapytań. Brak zmian DNS, budżetów, Profilu Firmy i ustawień hostingu.
- Produkcja pozostaje bez zmian do osobnej decyzji właściciela o merge. [Podgląd inwestycji na Vercel](https://investdom-git-feat-local-seo-in-fc42e7-admins-projects-2bc10d0e.vercel.app/inwestycje/pisarzowice-etap-ii) jest dostępny jako adres automatycznego wdrożenia, ale żądanie z 20.10.2026 przekierowało do `vercel.com/login` (tytuł „Login – Vercel”). Nie traktujemy ekranu logowania jako pozytywnej weryfikacji aplikacji; ochrona podglądu pozostaje bez zmian. W momencie sprawdzenia status GitHub/Vercel był `PENDING`. [PR #9](https://github.com/Sp94dev/investdom-website/pull/9) jest otwarty, bez merge.

