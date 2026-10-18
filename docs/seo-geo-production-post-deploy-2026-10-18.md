# INVESTDOM — audyt SEO i GEO produkcji po wdrożeniu

**Cel:** https://www.investdom.com.pl/. **Data:** 18.10.2026, odczyty po 14:11 UTC. **Wersja referencyjna:** `main`, `2c3193a8059063d8176f116b061d448df330892d`, po scaleniu PR #2, #3 i #5; PR #4 był częścią #3.

To nowy audyt publicznej strony. [Poprzedni raport](seo-geo-audit-2026-10-18.md) opisuje stan sprzed wdrożenia około 10:30 UTC. [Dowody i wyniki wszystkich prób](seo-evidence/2026-10-18-post-deployment-seo-geo.json).

## Wnioski

Podstawy techniczne SEO działają na wszystkich czterech stronach. Wdrożono poprawki obrazów, metadanych i formularza oraz usunięto remonty. Mediana mobilnego Performance głównej wzrosła **84 → 97**, a LCP spadło **3,35 → 2,39 s** w porównywalnym pomiarze laboratoryjnym.

Najbliższa paczka powinna doprecyzować **ofertę w Pisarzowicach, etap inwestycji, podpisy zdjęć i potwierdzenie obietnic FAQ**. Wykryto również cztery dostępne aliasy `index.html`, które warto przekierować. Nie wykryto blokady indeksowania stron kanonicznych w badanym zakresie.

**Cytowania i rekomendacje w ChatGPT, Claude, Perplexity oraz Google AI: niezmierzone.** Dostępność HTML i wyniki Lighthouse opisują techniczną gotowość. Faktyczną widoczność trzeba zmierzyć w tych produktach i danych właściciela. Nie nadano własnego arbitralnego wyniku GEO 0–100.

## 1. Wyniki Lighthouse

Lighthouse **13.5.0**, Chromium **154.0.8037.57**. Dziewięć kolejnych przebiegów produkcji: po trzy dla głównej mobile/desktop, po jednej próbie mobilnej pozostałych stron. Zachowano wersje i konfigurację wcześniejszego pomiaru, w tym blokadę transportu GA i proxy środowiska.

| Strona / wariant | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Główna mobile, mediana 3 prób | **97** | 100 | 100 | 100 | **2,39 s** | **31 ms** | 0 |
| Główna desktop, mediana 3 prób | **100** | 100 | 100 | 100 | **0,51 s** | 0 ms | 0 |
| Budowa mobile, 1 próba | 99 | 100 | 100 | 100 | 0,98 s | 6 ms | 0 |
| Oferty mobile, 1 próba | 100 | 100 | 100 | 100 | 1,09 s | 88 ms | 0 |
| Projekty mobile, 1 próba | 100 | 100 | 100 | 100 | 1,08 s | 21 ms | 0 |

Rozrzut Performance głównej: mobile **96 / 97 / 97**, desktop **100 / 100 / 73**. Ostatnia próba desktop miała TBT **694 ms**; jest zachowana w dowodach. Mediana nie opisuje każdej wizyty. Nie odtworzono wcześniejszego ostrzeżenia Partytown w żadnym z dziewięciu nowych przebiegów; nie jest to gwarancja jego trwałego usunięcia we wszystkich przeglądarkach.

### Porównanie z produkcją sprzed wdrożenia

| Wskaźnik głównej mobile | Przed | Po |
|---|---:|---:|
| Mediana Performance | 84 | **97** |
| Mediana LCP | 3,35 s | **2,39 s** |
| Mediana TBT | 402 ms | **31 ms** |
| CLS | 0 | 0 |
| Best Practices | 81 | **100** |
| Zasób hero pobrany w pierwszej próbie mobilnej | WebP 429 016 B | **AVIF 180 003 B** |

Różnica w bajtach tego zasobu wynosi ok. **58%**. Dobór pliku zależy od ekranu, DPR i obsługi formatów. Mniejszy plik nie dowodzi, że sam odpowiada za całą zmianę wyniku; wraz z nim wdrożono prerenderowanie i zmiany skryptów.

**Są to dane laboratoryjne, nie terenowe Core Web Vitals.** Nie zmierzono INP. Próba pobrania PageSpeed Insights/CrUX zwróciła HTTP 429 z wyczerpanym limitem usługi; to ograniczenie dostępu do danych, nie błąd witryny. Warunki CPU, sieci i proxy nadal ograniczają wnioskowanie o wyniku użytkowników.

### Pozostałe możliwości wydajnościowe

- Hero jest wykrywalne w początkowym HTML i ma eager/high. Zachować ten priorytet. W próbach mobilnych istotną częścią LCP pozostaje opóźnienie renderowania. Kod ma animację wejścia tekstu 1 s z opóźnieniem 0,2 s; przed jej zmianą wyprofilować wpływ na cały pierwszy ekran, bez przypisywania jej automatycznie pełnego opóźnienia obrazu.
- Szacowana oszczędność obrazów w drugiej próbie mobilnej to ok. **16 KiB** przy zdjęciu poniżej hero, wcześniej pierwsza próba wskazywała ok. 409 KiB łącznie. To estymacje narzędzia, nie identyczny zestaw zasobów w każdej próbie. Dalsza kompresja ma niższy priorytet niż rzetelna oferta.
- Nadal występują długie zadania strony/Partytown i łańcuch CSS → font. Nagłówki/tekst mają wyliczony font systemowy, pola — Inter. Tokeny `--font-family-*` nie konfigurują `--font-*` Tailwind 4. Uporządkowanie wymaga sprawdzenia wyglądu i łamania tekstów; Inter dla formularza jest faktycznie używany.
- Poprawiony OG ma właściwe wymiary, ale JPG waży **640 604 B**. Kompresja jest opcjonalną poprawką udostępnień społecznościowych; ten zasób nie jest obrazem LCP strony.

## 2. SEO techniczne

Astro z routingiem plikowym, Vercel, cztery strony prerenderowane i dynamiczny endpoint kontaktu. Zgodność architektury sprawdzono w repo, a dostępność treści — bezpośrednio w pierwszym HTML produkcji.

| Kontrola | Wynik |
|---|---|
| Cztery strony kanoniczne | Wszystkie HTTP 200 |
| Title / description | Kompletne i unikalne dla każdej strony |
| Canonical / OG URL / Twitter URL | Zgodne, bezwzględne adresy HTTPS www |
| Robots | HTTP 200, wildcard `Allow: /`, poprawna deklaracja sitemapy |
| Sitemap index i child | HTTP 200, poprawny XML, dokładnie cztery istniejące kanoniczne strony |
| Dyrektywy indeksowania | Brak blokującego meta `noindex` i obserwowanego `X-Robots-Tag` na stronach kanonicznych |
| Treść bez JavaScriptu | Główna treść, cena, parametry, kontakt, linki i JSON-LD dostępne |
| Semantyka | Jeden H1 i `main` na stronę; `lang="pl"`, nazwane nawigacje |
| Linki wewnętrzne | 63 wystąpienia z poprawnymi celami stron i fragmentów |
| Obrazy | 17/17 wystąpień ma ALT i wymiary; 14/14 sprawdzonych reprezentatywnych zasobów HTTP 200 |
| JSON-LD | 6/6 bloków parsuje się; powiązania encji i treść FAQ zgodne |
| 404 | Nieistniejąca ścieżka ma prawdziwe HTTP 404 |
| Końcowy slash podstron | 308 do czystych adresów bez slash |
| Dwa warianty UTM | HTTP 200, canonical pozostaje czysty |

### Nowe ustalenie: aliasy `index.html`

| Adres dodatkowy | Teraz | Docelowo |
|---|---|---|
| `/index.html` | 200 | 301/308 do `/` |
| `/budowa-domow-pod-klucz/index.html` | 200 | 301/308 do `/budowa-domow-pod-klucz` |
| `/domy-na-sprzedaz-bielsko/index.html` | 200 | 301/308 do `/domy-na-sprzedaz-bielsko` |
| `/projekty-domow/index.html` | 200 | 301/308 do `/projekty-domow` |

HTML każdego aliasu ma identyczny SHA-256 jak strona kanoniczna i poprawny canonical. Aliasy nie są linkowane w badanym zbiorze ani ujęte w sitemapie. **Niski priorytet:** usunąć zbędne odpowiedzi 200 stałym przekierowaniem, zachowując parametry. Nie uzyskano dowodu ich faktycznej indeksacji ani wyboru niewłaściwego canonicala przez Google.

Pozostaje wcześniejsza konfiguracja domeny: HTTPS apex używa **307**, a HTTP apex przechodzi przez **308 → 307 → 200**. Przy trwałym wyborze www zalecane stałe przekierowanie bezpośrednio do HTTPS www. Wymaga sprawdzenia reguł domeny w Vercel; brak dostępu do panelu nie jest awarią aplikacji.

### Dane strukturalne i kontakt

Cztery `HomeAndConstructionBusiness`, jeden `Service` i jeden `FAQPage` mają poprawną składnię. Stałe `@id` firmy jest prawidłowo użyte jako dostawca usługi. Telefon **+48 571 328 993** i adres **ul. Do lasu 25, 43-300 Bielsko-Biała** są zgodne z informacją właściciela. Nie znaleziono dopisanych ocen ani fikcyjnych danych.

To kontrola składni i zgodności, nie zaliczony Google Rich Results Test ani potwierdzenie wyników rozszerzonych. Brak okruszków w UI nie wymaga samego `BreadcrumbList`; brak `Product`/`Offer` dla nieruchomości nie jest automatycznie błędem. FAQ pozostaje przydatne użytkownikom, ale Google wycofał jego wyniki rozszerzone 7.05.2026 — nie opierać na nim obietnicy dodatkowego wyglądu wyniku.

Formularz ma jawny POST/action i etykietę tematu; opcji remontów nie ma. W tym audycie nie wysyłano ani nie wypełniano formularza. Publiczny email to `kontakt@investdom.pl`, fallback API to `kontakt@investdom.com.pl`; produkcyjne `CONTACT_EMAIL` może go nadpisywać. Właściciel powinien potwierdzić docelową skrzynkę, rzeczywistą dostawę i regułę WAF. Obecność nowego formularza nie potwierdza tych ustawień.

## 3. Dostępność i przeglądarka

Osiem świeżych skanów axe-core **4.11.1**: cztery strony × mobile 375×812 / desktop 1440×1000, WCAG A/AA do 2.2 oraz reguła rozmiaru celów dotykowych. **Brak wykrytych naruszeń, błędów JavaScriptu i poziomego overflow** w tych widokach.

Główna ma także kontrole kontrastu oznaczone do ręcznej oceny: **10 elementów mobile i 6 desktop**, m.in. tekst na zdjęciu/gradiencie. Wynik automatyczny 100 nie zamyka pełnego audytu WCAG. Zrzuty oceniono pod kątem układu pierwszego ekranu; nie testowano fizycznego Safari/iPhone ani czytnika ekranu.

Przeglądarka potwierdziła fokus formularza po wejściu przez `#kontakt`, prawidłową aktywną sekcję po zakończeniu przewijania, scrollspy bez zmiany adresu, zamykanie menu przez Escape z powrotem fokusu oraz `inert` zamkniętego menu. Z wyłączonym JavaScriptem cena/treść oferty i jawny POST są nadal dostępne. Nie odtwarzano wysyłki maili.

## 4. GEO — dostęp wyszukiwarek AI

| Nazwa User-Agent | Przeznaczenie | HTTP / robots |
|---|---|---|
| Googlebot | Wyszukiwanie Google | 200 / dozwolone |
| Bingbot | Wyszukiwanie Bing | 200 / dozwolone |
| OAI-SearchBot | ChatGPT Search | 200 / dozwolone |
| Claude-SearchBot | Wyszukiwanie Claude | 200 / dozwolone |
| PerplexityBot | Wyszukiwanie Perplexity | 200 / dozwolone |
| ChatGPT-User | Pobrania inicjowane przez użytkownika | 200 / dozwolone |
| Claude-User | Pobrania inicjowane przez użytkownika | 200 / dozwolone |
| Perplexity-User | Pobrania inicjowane przez użytkownika | 200 / dozwolone |
| GPTBot | Trening modeli OpenAI | 200 / dozwolone |
| ClaudeBot | Trening modeli Anthropic | 200 / dozwolone |

To kontrolne żądania z **niezweryfikowanymi nazwami UA z jednego środowiska**, nie dowód wizyt prawdziwych robotów, indeksacji lub cytowania. Rzeczywiste zachowanie wobec zweryfikowanych IP/tożsamości należy potwierdzić w logach WAF/hostingu. Dostęp dla treningu i wyszukiwania to osobne decyzje; otwarcie treningu nie jest warunkiem ChatGPT Search.

`/llms.txt` i `/.well-known/ai-catalog.json` zwracają 404, a `Accept: text/markdown` zwraca HTML. Przy obecnej pełnej treści HTML nie blokuje to odczytu witryny. Google nie wymaga specjalnych plików AI, Markdown ani dodatkowego schema dla funkcji generatywnych. [Oficjalny przewodnik Google](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

### Agent Readiness

Świeży skan Cloudflare: **18.10.2026 14:14:26 UTC — 20/100, 3/15, Level 1**. Wynik nie zmienił się względem wcześniejszego audytu. Zaliczono robots, sitemap i dostęp botów przez wildcard; pozostałe punktowane pozycje dotyczą deklaracji lub interfejsów agentowych.

Lighthouse Agentic Browsing osobno: **2/2 mających zastosowanie kontroli** w każdym z dziewięciu przebiegów — drzewo dostępności i CLS. Pozostałe pozycje są `notApplicable`. Wyniki narzędzi mierzą różne zakresy. Żaden nie jest pomiarem cytowań ani leadów.

Wcześniejszy [plan rozwoju integracji agentowych](agent-readiness-production-audit.md) pozostaje odrębnym zakresem. OAuth/MCP/API mają sens jako działające funkcje dla rzeczywistego procesu klienta. Nie dopisywać pozornych endpointów lub reguł tylko dla punktów; poprawa opisu inwestycji ma obecnie wyższy priorytet.

## 5. GEO — najważniejsze problemy treści

### P1: zgodny opis lokalizacji i etapu inwestycji

[Oferta](https://www.investdom.com.pl/domy-na-sprzedaz-bielsko) ma już poprawne meta „Pisarzowice koło Bielska-Białej”, ale H1 mówi wyłącznie o Bielsku-Białej. Wstęp sugeruje zrealizowane domy czekające na właścicieli i wybór dzielnicy; karta opisuje rozpoczynany etap II w Pisarzowicach. Pisarzowice należą do gminy Wilamowice.

**Działanie:** ujednolicić H1, intro i kartę zgodnie z rzeczywistym stanem i obszarem „Bielsko-Biała i okolice”. Potwierdzić aktualną dostępność, etap, zakres ceny i termin. **Odbiór:** czytelnik i asystent otrzymują jedną wersję faktów; planowana budowa nie jest przedstawiona jako gotowy dom.

### P1/P2: widoczne podpisy fotografii i dokumentacja realizacji

ALT identyfikuje etap I, lecz jego zdjęcie nadal ilustruje etap II bez bezpośredniego wyjaśnienia na stronie głównej/projektach. Opis na stronie sprzedaży nie zastępuje podpisu przy każdej karcie.

**Działanie:** dodać widoczny podpis zgodny z faktami. Rozwinąć jedną rzeczywistą realizację: rok/miejscowość, zakres wykonawcy, zatwierdzony standard, przebieg i fotografie, ewentualne rzuty z prawami publikacji. **Odbiór:** etap zdjęcia jest jasny bez ALT; materiał pokazuje własne doświadczenie i nie miesza wizualizacji z ukończonym domem.

### P1: zatwierdzone koszty, terminy i obietnice

FAQ podaje **3000–3500 zł netto/m²**, **9–14 miesięcy** i **3–4 miesiące** bez daty/szczegółowego zakresu. Pozostają „100% zadowolonych”, „15+ lat”, gwarancja terminowości i odpowiedź w 24 h. Brak publicznej podstawy nie dowodzi fałszu, ale potwierdzenie parametrów domu nie zatwierdza automatycznie tych deklaracji.

**Działanie:** właściciel zatwierdza warunki i podstawę danych; zaktualizować albo usunąć niepotwierdzone deklaracje. **Odbiór:** publikowane obietnice mają prawdziwy zakres/podstawę, a FAQ i JSON-LD pozostają zgodne. Nie zastępować własnej wyceny cudzym cennikiem z internetu.

### P2: autorstwo i przydatność strony projektu

[Projekty](https://www.investdom.com.pl/projekty-domow) nadal używają „Autorskie” w title/H1 bez wyjaśnienia autora lub praw. Jedna krótka karta nie pokazuje rzutu ani zakresu adaptacji.

**Działanie:** potwierdzić rolę firmy i prawa, opisać rzeczywisty projekt i powiązać go z ofertą/usługą. **Odbiór:** słowo „autorskie” ma podstawę lub zostaje zastąpione; użytkownik rozumie, czy chodzi o projekt, adaptację czy konkretny dom. Nie trzeba tworzyć pozornego katalogu wielu projektów ani osiągać narzuconej liczby słów.

### P2: tożsamość firmy i profil lokalny

Telefon/adres są zgodne; GBP jest w `sameAs`, ale nie ma widocznego linku. Udostępniony profil kieruje do encji `/g/11yn13tdbh` i nazwy „FIRMA USŁUGOWA INVEST DOM Paduch Andrzej”; odczyt powłoki Google nie potwierdza jego pól ani opinii.

**Działanie:** właściciel potwierdza pełną tożsamość wykonawcy i relację z marką; dodać widoczny link do GBP. W panelu sprawdzić nazwę, telefon 993, domenę, kategorię, obszar i faktyczny sposób przyjmowania klientów. **Odbiór:** potwierdzone dane strony, schema i profilu są zgodne; referencje są rzeczywiste i publikowane za zgodą.

Parametry domu pozostają zgodne z zatwierdzeniem właściciela: **895 000 zł, 135 m², działka 700 m², stan deweloperski, 4 pokoje i 2 łazienki**. Nie wymagają ponownego „naprawiania” jako rozbieżne.

## 6. Odnajdywalność i pomiar efektów

Świeża, ograniczona próbka zwykłego wyszukiwania odnajduje witrynę. Niektóre starsze fragmenty nadal pokazują **remonty** i telefon kończący się na **983**, podczas gdy publiczny HTML ma już prawidłowe informacje. To nie dowód regresji wdrożenia. W GSC warto sprawdzić ostatnie pobranie czterech URL i ewentualnie poprosić o ponowną indeksację, bez obietnicy terminu odświeżenia.

W ograniczonej próbce nie potwierdzono profili domeny na YouTube/Facebook/LinkedIn/Reddit. Brak wyniku nie dowodzi ich nieistnienia. Podobne wpisy katalogowe, w tym Panorama Firm z innym adresem w URL, wymagają potwierdzenia tożsamości. Nie przypisywano tej firmie cudzych opinii lub danych.

### Plan następnej paczki

1. **Korekta faktów:** wstęp/H1 oferty, aktualny etap, podpisy zdjęć, zatwierdzenie FAQ i autorstwa.
2. **Mała poprawka techniczna:** stałe przekierowania czterech aliasów `index.html`; konfiguracja apex w hostingu przy okazji.
3. **Materiał dla klientów:** jedna udokumentowana realizacja, pełniejszy projekt/standard, potwierdzona tożsamość i widoczny GBP.
4. **Pomiar właścicielski:** GSC — indeksacja, wybrane canonicale, sitemap i ostatnie pobrania; GBP — realne pola i wyniki. Zweryfikować odbiór formularza i WAF w panelach.
5. **Widoczność AI i leady:** stały zestaw pytań markowych i ogólnych; zapisać produkt, datę, język/region, odpowiedź i cytowany URL. Mierzyć faktyczne telefony i potwierdzone wysyłki bez danych formularza w analityce.

Aktualna dokumentacja Google opisuje [kontrolę Search generative AI](https://support.google.com/webmasters/answer/16908024) oraz [raport wyświetleń w funkcjach generatywnych](https://support.google.com/webmasters/answer/16984139). Ich stan i dostępność na koncie INVESTDOM pozostają nieznane. Brak widocznego raportu przy małej próbce nie jest dowodem zera wyświetleń; dane należy odczytać z konta właściciela.

## Metoda i ograniczenia

Użyto Claude SEO `seo-audit`, `seo-geo`, `seo-technical`, `seo-schema`, `seo-local`, `seo-agentic` oraz Superpowers `verification-before-completion`. Wykonano świeże HTTP, odczyt HTML/XML/JSON-LD, ograniczony crawl linków i reprezentatywnych zasobów, dziewięć pomiarów Lighthouse, osiem skanów axe, cztery kontrole nawigacji/dostępu bez JS oraz nowy skan Cloudflare. Produkcyjnych formularzy i danych kont nie zmieniano; ten raport nie wdraża nowych poprawek aplikacji.

Brak dostępu do GSC, GBP, GA4, DNS/WAF, Resend i prawdziwych logów botów. Nie uruchomiono Google Rich Results Test, pełnego audytu profilu linków, terenowego CWV ani rzeczywistych testów cytowań w interfejsach LLM. Nie potwierdzono dostarczalności emaili. Nieznane elementy nie są automatycznie błędami witryny.

[Zwięzłe dowody](seo-evidence/2026-10-18-post-deployment-seo-geo.json) zachowują każdą próbę Lighthouse, wyniki przeglądarki, aliasy URL i ustalenia GEO. Surowe HTML, raporty, skrypty i zrzuty: `/workspace/shared/investdom-postdeploy-audit-2026-10-18/`. Nie publikowano cookies, poświadczeń ani prywatnych danych formularzy.

### Źródła zaleceń

- [Google — optymalizacja funkcji generatywnych](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [lokalne wyniki](https://support.google.com/business/answer/7091), [zasady profilu firmy](https://support.google.com/business/answer/3038177).
- [OpenAI — boty](https://developers.openai.com/api/docs/bots), [Anthropic — polityka crawlerów](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity — crawlery](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).
- [Google — aktualizacje dokumentacji](https://developers.google.com/search/updates), [Gmina Wilamowice — sołectwa](https://gmina.wilamowice.pl/strona/144-solectwa), [skaner Cloudflare](https://isitagentready.com/www.investdom.com.pl).
