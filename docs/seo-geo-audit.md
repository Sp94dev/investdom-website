# INVESTDOM — ponowny audyt SEO i GEO

## Aktualizacja Profilu Firmy w Google — 16.10.2026

Właściciel poinformował o aktualizacji wizytówki i przekazał [własny profil Google](https://share.google/O1Nye5JlpKbt5C3nc). Link rozwiązuje się do encji `/g/11yn13tdbh`, z nazwą „FIRMA USŁUGOWA INVEST DOM Paduch Andrzej” w przekierowaniu Google. Wspólne dane firmy w projekcie zawierają ten URL, a JSON-LD `HomeAndConstructionBusiness.sameAs` odwołuje się do wskazanego przez właściciela profilu. Nie zastąpiono marki INVESTDOM nazwą rejestrową ani nie skopiowano danych z nieoficjalnych katalogów.

Pełne pola wizytówki nie były dostępne w użytym odczycie Google, więc nie potwierdzono aktualności telefonu, adresu, godzin, kategorii ani linku WWW w panelu. Wykonanie aktualizacji jest potwierdzone przez właściciela; pełna zgodność i widoczność zmian pozostaje do kontroli. Nie przenoszono ocen/opinii do schema. Właściciel potwierdził też, że firma nie świadczy remontów; opcja formularza została już usunięta, a pozostałe wzmianki w treści usług i keywords wymagają uwzględnienia przy porządkowaniu zgodności oferty.

## Uzupełnienie: dostęp do właściwego podglądu — 16.10.2026

Po otrzymaniu od właściciela działającego linku udostępnienia sprawdzono bezpośrednio podgląd brancha `seo/technical-foundation` (wdrożenie zawierające poprawki a11y `d59f257`). Tokenu udostępnienia ani cookies nie zapisano w repozytorium. [Dowody z podglądu](seo-evidence/2026-10-16-preview.json).

**Poniższe ustalenia dotyczą podglądu, nie produkcji.** Starsze części raportu opisują stan produkcji z 15.10 i pozostają zapisem historycznym.

- Cztery strony zwracają HTTP 200; treści, metadane i JSON-LD są dostępne w surowym HTML. Nie trzeba wykonywać JavaScript, by odczytać opis firmy, usługi, FAQ i kontakt.
- Canonical wszystkich czterech stron prawidłowo wskazuje publiczną domenę `https://www.investdom.com.pl`, a telefon i adres są spójne: `+48571328993`, `ul. Do lasu 25`. To wcześniejsze problemy produkcji usunięte w podglądzie.
- Firma ma schemat `HomeAndConstructionBusiness`; usługa ma `Service` z powiązaniem do stabilnego `#organization`. JSON-LD parsuje się i nie zawiera poprzednich niepotwierdzonych GPS/priceRange. Samo schema nie zapewnia rekomendacji przez LLM.
- Sitemap zawiera adresy domeny produkcyjnej; nieistniejący adres zwraca 404. Odpowiedzi podglądu mają `X-Robots-Tag: noindex`, co jest **pożądane dla preview**. Nie zdejmować tego ograniczenia w celu GEO; indeksować należy produkcję po wdrożeniu. Kontrola botów przez udostępnioną sesję nie jest pomiarem dostępu publicznych crawlerów.
- Poprawki a11y etykiety `subject-select`, `inert` zamkniętego menu i kontrastu są już obecne w HTML tego wdrożenia. Zrzuty właściciela zawierają wcześniejsze klasy `bg-green-500` / `text-stone-400`; aktualny podgląd ma poprawione klasy tych elementów. Oddzielnie poprawiono pola dotykowe trzech linków w sekcji usług — zmiana powstała po tej kontroli podglądu.

### Pozostałe priorytety GEO potwierdzone na tym podglądzie

1. **Spójność oferty:** opis meta obiecuje „gotowe domy”, podczas gdy treść mówi „rozpoczynamy drugi etap” i pokazuje zdjęcia sprzedanego etapu I. Pisarzowice określono w opisie jako dzielnicę. Uzgodnić faktyczny status i poprawić komunikację, aby odpowiedzi AI nie przedstawiały oferty jako gotowego budynku.
2. **Weryfikacja faktów:** podgląd nadal pokazuje działkę 700 m² (w źródle oznaczoną jako przykładowa), cenę 895 000 zł oraz widełki i terminy w FAQ. Właściciel powinien potwierdzić aktualność tych informacji przed ich dalszym rozpowszechnianiem. Brak potwierdzenia nie oznacza automatycznie, że są fałszywe.
3. **Własne dowody realizacji:** podgląd informuje o sześciu sprzedanych domach etapu I, ale nie zawiera osobnej strony realizacji. Po potwierdzeniu dodać własne materiały: zakres wykonanych prac, zdjęcia etapów, daty i opis konkretnych rozwiązań. To bardziej użyteczna podstawa cytowania doświadczenia firmy niż ogólne deklaracje.
4. **Rozpoznanie firmy:** zachować spójny kontakt i uzupełnić zweryfikowane dane przedsiębiorcy oraz własne profile lokalne. Nie przypisywać profili innych firm INVESTDOM. Własność zewnętrznych profili pozostaje niezweryfikowana.
5. **Treści projektów:** meta description obiecuje bazę wielu typów projektów, a widoczna jest jedna karta. Dopasować obietnicę opisu do zawartości; dodatkowe projekty publikować dopiero z rzeczywistymi materiałami.

Aktualny podgląd ma poprawioną bazę techniczną SEO/GEO. Pozostają treści i dowody potrzebne do wiarygodnego opisania firmy i oferty. Nie potwierdzono jeszcze cytowań tej wersji przez ChatGPT, Claude, Perplexity lub Google AI. Kontrola prywatnego preview nie może ich wykazać.

**Data:** 15 października 2026, pomiary od 20:40 UTC. **Zakres:** publiczna produkcja `https://www.investdom.com.pl/`, cztery podstrony, próba odczytu podglądu PR i przegląd kodu brancha `seo/technical-foundation` na `6e2b345`.

## Wniosek

Treść strony jest dostępna dla wyszukiwarek i narzędzi AI bez wykonywania JavaScript. Najpilniejsze są publikacja poprawnych danych firmy i spójnych adresów URL, usunięcie niepotwierdzonych informacji ofertowych oraz rozwinięcie materiałów z własnych realizacji. Samo dodanie pliku dla AI nie zapewni rekomendacji firmy przez LLM.

**Poprawki z pierwszej paczki nadal nie działają na produkcji.** PR [#1](https://github.com/Sp94dev/investdom-website/pull/1) jest otwarty jako draft, a `main` nadal wskazuje `bef43ec`. Publiczny podgląd Vercel przekierowuje do logowania; końcowe HTTP 200 jest odpowiedzią strony logowania, a nie aplikacji. Jego metadanych nie zaliczono do wyników INVESTDOM. Ochrona podglądu jest prawidłowa; nie należy otwierać go do indeksowania.

## Metoda i ograniczenia

- Surowe HTTP: 22 żądania kontrolne produkcji i podglądu, analiza HTML, nagłówków, przekierowań, JSON-LD i XML sitemap. Polskie znaki odczytano jako UTF-8; domyślne kodowanie klienta HTTP skorygowano w parserze.
- Claude SEO 2.4.2: `agentic_check.py --ua-matrix`, `agent_ux_check.py`; Lighthouse 13.5.0 / HeadlessChrome 156, kategoria `agentic-browsing`, strona główna, mobile i desktop.
- Kontrola kodu Astro SSR, danych ofertowych, powiązań formularza i implementacji pierwszej paczki. Audyt nie zmienia kodu aplikacji ani treści marketingowych.
- Wyszukiwanie internetowe zapytań brandowych i lokalnych, opisane poniżej. To próbka dostępnego narzędzia wyszukiwania, **nie pomiar rankingu Google ani test cytowań w interfejsach ChatGPT, Claude lub Perplexity**.
- Brak dostępu do Search Console, Bing Webmaster Tools, profilu Google firmy i logów WAF. Nie potwierdzono faktycznej indeksacji wszystkich URL, wybranego przez Google canonical, wizytówki, prawdziwych wizyt botów ani cytowań przez konkretne LLM.
- Zachowano wcześniejsze pomiary wydajności jako historyczne; nie przedstawiono ich jako świeżego pomiaru Core Web Vitals. Nowy pomiar CLS jest laboratoryjny, nie terenowy.

Dowody: [HTTP, crawlerzy i agent UX](seo-evidence/2026-10-15-seo-geo.json). Starszy audyt: [seo-audit.md](seo-audit.md).

## 1. SEO techniczne — aktualna produkcja

| Obszar | Obserwacja | Ocena / działanie |
|---|---|---|
| Rendering | Wszystkie cztery strony zwracają 200 i główne treści w HTML | Dobra podstawa dla crawlerów bez JS; zachować SSR Astro |
| Metadane | 4 unikalne title i description; każda strona ma jeden H1 | Zachować; poprawić zgodność opisów ofert i projektów z treścią |
| Canonical | Odpowiedź z `www`, canonical wskazuje host bez `www` | Wdrożyć istniejącą poprawkę PR #1, następnie sprawdzić produkcję |
| Duplikaty | `/projekty-domow` i `/projekty-domow/` mają 200 i różne canonical | Po wdrożeniu oczekiwane 308 do wersji bez końcowego ukośnika |
| Parametry | UTM nie trafia do canonical | Poprawnie, ale host nadal wymaga korekty |
| Robots | 200, `User-agent: *`, `Allow: /` | Brak blokady treści; sitemap nadal wskazuje host bez `www` |
| Sitemapa | Index i sitemap-0 zwracają XML 200; cztery URL bez `www`, podstrony z `/` | Ujednolicić z finalnymi adresami; poprawka przygotowana w PR |
| Błędny URL | Rzeczywiste 404 | Poprawnie |
| JSON-LD | JSON parsuje się na 4 stronach; stary schemat zawiera m.in. `RealEstateAgent`, GPS, `priceRange` i „powiat czechowicki” | Składnia nie potwierdza prawdziwości danych; wdrożyć ograniczony, zweryfikowany schemat z PR |
| Obrazy | Transformacje obrazów działają; hero eager/high. Pierwsze zdjęcia ofert i projektów nadal lazy; brak wariantów srcset | Dokończyć paczkę techniczną; nie lazy-loadować obrazów LCP |
| Semantyka | Projekty przechodzą z H1 do H3; logotypy bez atrybutów wymiarów | Poprawić bez zmiany stylów; brak wymiarów nie dowodzi występowania CLS |
| Open Graph | Deklarowane 1200×630 nie odpowiada źródłu `og-image.jpg` 1024×1024 | Dostosować deklarację lub przygotować uzgodniony obraz social |

Pozostałe zadania pierwszej paczki są opisane w [planie technicznym](superpowers/plans/2026-10-15-technical-seo-foundation.md). W kodzie brancha canonical i dane firmy są poprawione; nie oznacza to ich wdrożenia na domenie publicznej.

## 2. Dostęp botów wyszukiwania AI

| Cel | Mechanizm | Wynik audytu |
|---|---|---|
| ChatGPT Search | `OAI-SearchBot` | Robots pozwala na `/`; próbne żądanie 200, brak wykrytego challenge |
| Claude Search | `Claude-SearchBot` | Jak wyżej |
| Perplexity Search | `PerplexityBot` | Jak wyżej |
| Wyszukiwarka Google i jej funkcje AI | Dostęp Googlebot oraz indeksacja i uprawnienie do wyświetlania fragmentów; ustawienia Search Console | Robots nie blokuje; faktyczna kwalifikacja w Search Console pozostaje do sprawdzenia |
| Trening modeli | M.in. `GPTBot`, `ClaudeBot`; osobna polityka | Obecny wildcard pozwala; nie zmieniono polityki treningu. Dopuszczenie treningu nie jest warunkiem ChatGPT Search |
| Odczyt na żądanie użytkownika | `ChatGPT-User`, `Claude-User`, `Perplexity-User` | Żądania kontrolne 200. Zasady robots różnią się między dostawcami |

Żądania z tymi nazwami User-Agent pochodzą z naszego środowiska, a nie ze zweryfikowanych adresów dostawców. Nie dowodzą, że rzeczywisty crawler odwiedził stronę lub otrzyma taką samą odpowiedź. Ewentualne reguły WAF należy kontrolować w logach i weryfikować pochodzenie botów zgodnie z dokumentacją dostawcy, zamiast ufać samej nazwie User-Agent.

Brak osobnych grup botów w robots **nie jest błędem**, skoro wildcard już zezwala na dostęp. Nie trzeba dopisywać redundantnych reguł, aby „włączyć GEO”.

## 3. Przydatność dla agentów przeglądających stronę

Lighthouse Agentic Browsing: **mobile 1/2, desktop 1/2** (13.5.0, 15.10.2026). Jeden niezaliczony obszar P0: drzewo dostępności z powodu etykiety pola. CLS wynosi 0 w obu pomiarach i przechodzi kontrolę. Pozostałe pięć kontroli — WebMCP coverage, registered tools, schema validity, llms.txt i ard-schema — ma status N/A i nie wchodzi do mianownika. Szczegóły są w pliku dowodowym. Kategoria jest eksperymentalnym badaniem laboratoryjnym, nie miernikiem pozycji ani szans na cytowanie. Agent-UX zwrócił **97/100**, co jest wyłącznie lokalną heurystyką narzędzia. Nie proponujemy dodawania opcjonalnych plików tylko dla zwiększenia mianownika wyniku.

- Potwierdzony błąd: `select#subject-select` nie ma dostępnej nazwy. W `Contact.astro` etykieta ma `for="subject"`, a pole `id="subject-select"`. Należy poprawić powiązanie; tekst i wygląd formularza mogą pozostać takie same.
- Źródło mobilnego menu ukrywa panel przez transformację i `aria-hidden`, bez usunięcia linków z kolejności fokusu. Wymaga sprawdzenia klawiaturą i korekty obsługi zamkniętego panelu. Nowy Lighthouse zgłosił błąd select; problem menu pochodzi z przeglądu źródła i wcześniejszego audytu, nie z nowego zgłoszenia Lighthouse.
- Brak WebMCP, katalogu zasobów agentów czy Markdown nie blokuje odczytu obecnego HTML. Nie ma uzasadnienia, by wdrażać protokoły transakcyjne lub udostępniać wysyłkę formularza agentom w tej paczce.

## 4. GEO — czy jest co wiarygodnie polecić i zacytować?

### P0: spójna tożsamość i kontakt

Produkcja podaje telefon `571 328 993` w kontakcie i JSON-LD, ale `571 328 983` w stopce wszystkich czterech stron. W sekcji kontaktowej jest `ul. Na Lasu 25`, a w stopce i schemacie `ul. Do Lasu 25`. Potwierdzone przez właściciela: **571 328 993, ul. Do lasu 25**. Rozbieżności są ryzykiem podania niewłaściwego kontaktu klientowi. Wdrożenie pierwszej paczki usuwa ten problem w aplikacji; później trzeba skontrolować zewnętrzne profile.

W próbce wyników istnieją inne marki INVESTDOM: m.in. `investdom.pl` (nieruchomości Opole) oraz `investdom-budowa.pl`. To osobne podmioty; nie wolno podłączać ich profili przez `sameAs` ani przypisywać ich realizacji tej firmie. Warto konsekwentnie przedstawiać firmę jako INVESTDOM z Bielska-Białej, wraz z właściwą domeną i kontaktem. Pełną nazwę prawną, NIP i własne profile dodać dopiero po potwierdzeniu.

### P0: prawdziwe dane ofertowe

W `src/pages/domy-na-sprzedaz-bielsko.astro` działka `700 m²` jest oznaczona komentarzem jako przykładowa. Ta sama wartość jest na stronie głównej. Właściciel powinien ją potwierdzić albo zatwierdzić usunięcie; nie należy kopiować jej do nowych opisów ani schematów ofert.

Do potwierdzenia pozostają aktualność ceny i dostępności inwestycji, relacja zdjęć etapu I do sprzedawanego etapu II oraz zakres cen/czasów w FAQ. Opis meta mówi o gotowych domach i nazywa Pisarzowice dzielnicą, mimo treści o rozpoczynanym etapie II. To niespójność istotna przy generowaniu odpowiedzi o ofercie. „100% zadowolonych” i „15+ lat” nie stanowią niezależnie potwierdzonych opinii ani podstawy do `AggregateRating`.

### P1: własne realizacje i materiały pomagające w decyzji

Serwis ma podstawowy opis procesu, trzy odpowiedzi FAQ i pojedyncze karty projektu/oferty, ale nie ma osobnych stron dokumentujących realizacje. To ogranicza ilość własnych, sprawdzalnych informacji o doświadczeniu firmy.

Proponowana kolejna paczka treści — dopiero po dostarczeniu danych przez właściciela:

1. **Dwie lub trzy realizacje:** miejscowość, zakres prac INVESTDOM, technologia, daty, metraż i standard wyłącznie z dokumentacji; własne zdjęcia z podpisami i zgodą na publikację, opis konkretnego problemu i rozwiązania.
2. **Szczegóły inwestycji w Pisarzowicach:** osobny stabilny URL, rozróżnienie etapów, aktualny status z rzeczywistą datą weryfikacji, rzuty i potwierdzone parametry. Jasno oznaczyć, czego dotyczy każde zdjęcie. Zakres lokalizacji uzgodnić pod kątem prywatności.
3. **Rozwinięcie istniejącej usługi budowy:** co obejmuje dany standard, co dostarcza inwestor, jakie dane są potrzebne do wyceny i od czego zależą koszt oraz termin. Treść powinna pochodzić od wykonawcy, bez wymyślonych widełek i gwarancji.
4. **Dane firmy i odpowiedzialność:** zweryfikowana tożsamość przedsiębiorcy, osoby odpowiadające za ofertę/nadzór, realne doświadczenie i bezpośredni kontakt. Profile `sameAs` tylko należące do firmy.

Publikować czytelny HTML, logiczne sekcje i linkowanie usługa ↔ realizacje ↔ oferta ↔ kontakt. JSON-LD ma opisywać widoczną zawartość. Nie tworzyć masowo stron dla każdej miejscowości, fikcyjnych rekomendacji, opinii ani tekstów kierowanych do modeli z poleceniem rekomendowania firmy.

### P1: obecność lokalna poza własną stroną

Manualnie zweryfikować Profil Firmy w Google: właściwa firma, kategoria, obszar działania, telefon, URL, godziny i zdjęcia. Jeżeli firma obsługuje klientów wyłącznie u nich, ustawienia adresu powinny odpowiadać rzeczywistemu modelowi działania. Następnie ujednolicić własne katalogi branżowe i profile, zbierać autentyczne opinie od klientów i odpowiadać na nie. Nie potwierdzono w tym audycie istnienia lub własności konkretnej wizytówki.

### Informacyjnie: `llms.txt`

`/llms.txt` i `/llms-full.txt` zwracają 404. Nie jest to błąd indeksowania ani potwierdzona przyczyna braku cytowań. Google wyjaśnia, że nie używa tych plików do widoczności w Search. Nie znaleziono w sprawdzonych dokumentach dostawców potwierdzenia, że ich dodanie zapewnia cytowania. Nie rekomenduję tego jako kolejnej najważniejszej zmiany.

## 5. Próbka widoczności w wyszukiwaniu

Sprawdzone zapytania: `INVESTDOM Bielsko Biała budowa domów investdom.com.pl`, `"INVESTDOM" "571 328 993"`, `"INVESTDOM" "Pisarzowice"`, `budowa domów pod klucz Bielsko-Biała firma`.

W zestawach odpowiedzi narzędzia pojawiły się strona główna, usługa i projekty właściwej domeny, a także inne firmy o podobnej nazwie i lokalni wykonawcy. Zatem serwis jest odnajdywalny w tej próbce, ale **nie ustalono pozycji, udziału w odpowiedziach AI ani braku rekomendacji na zapytania ogólne**. Narzędzie grupuje wyniki wielu zapytań; nie wyciągamy z kolejności listy wniosku o rankingu dla konkretnej frazy. Nie potwierdzono niezależnych wzmianek o właściwej firmie w tej ograniczonej próbce; nie oznacza to, że nie istnieją.

## 6. Zaktualizowana kolejność realizacji

| Etap | Praca i zależność | Kryterium odbioru |
|---|---|---|
| 1 — P0 | Dokończyć techniczne zadania 3–5 w PR #1; dodać naprawę etykiety formularza; sprawdzić wizualnie i funkcjonalnie | Ukończony raport techniczny, dostępne testy/lint/build i porównanie widoków; PR gotowy do decyzji właściciela |
| 2 — P0 | Po akceptacji wdrożyć PR; zweryfikować publiczną domenę | Jeden telefon/adres w body i JSON-LD, spójne www/canonical/sitemap, slash 308, 404 prawdziwe, brak blokady botów |
| 3 — P0/P1, właściciel | Potwierdzić dane inwestycji i firmy; dostęp do GSC/Bing/Profilu Firmy | Uzgodnione źródła faktów; zweryfikowane profile, przesłana finalna sitemapa i inspekcja URL |
| 4 — P1 | Materiały do 2–3 realizacji i strony inwestycji; rozszerzyć usługę w osobnym PR | Każdy fakt ma źródło, widoczne materiały własne, unikalne metadane, odpowiednie schema i linkowanie; treść zatwierdzona przez właściciela |
| 5 — P1 | Pomiar ruchu i zapytań klientów oraz monitoring AI | Zdarzenie skutecznego formularza oddzielone od kliknięć telefonu; miesięczny rejestr widoczności i leadów |

To plan kolejnych prac, nie informacja o wdrożeniu ich w tym audycie. Dokończenie wcześniejszego planu technicznego pozostaje osobnym zadaniem implementacyjnym.

## 7. Jak mierzyć, czy GEO przynosi klientów

- GSC: inspekcja czterech URL, canonical wybrany przez Google, sitemapa, zapytania brandowe i usługowe. Sprawdzić ustawienie udziału w funkcjach generatywnych oraz dostępność raportu generative AI w danej usłudze. Działanie manualne wymagające konta.
- Bing Webmaster Tools: zweryfikować domenę i sitemapę; skontrolować raporty indeksowania oraz dostępne raporty AI. To diagnostyka, bez obietnicy rekomendacji Copilot.
- Stały miesięczny zestaw pytań w ChatGPT Search, Claude Search, Perplexity i Google AI: np. „Kto buduje domy na działce klienta w Bielsku-Białej?”, „Co obejmuje budowa domu pod klucz w Bielsku-Białej?”, „Domy na sprzedaż Pisarzowice INVESTDOM”, „Jaki kontakt do INVESTDOM z Bielska-Białej?”. Zapisywać datę, produkt/model, tryb wyszukiwania, język/lokalizację, odpowiedź, wzmiankę i dokładny cytowany URL; powtórzyć próbki. Startowy wynik cytowań pozostaje **niezmierzony**.
- Oddzielać wzmiankę o właściwej firmie, link do jej domeny, poprawny kontakt i realny lead. Sprawdzać błędne przypisanie do firmy z Opola. Nie przypisywać ruchu direct automatycznie do AI; referrer może nie być przekazywany.
- Analytics i formularz: mierzyć dopiero potwierdzoną skuteczną wysyłkę jako lead, a kliknięcia telefonu osobno; porównywać okresy i jakość zapytań. Uwzględnić wymagane zgody w konfiguracji analityki.
- Logi Vercel/WAF: jeżeli dostępne, sprawdzić rzeczywiste boty i błędy odpowiedzi. Nigdy nie dopuszczać dostępu wyłącznie na podstawie łatwego do podszycia User-Agent.

## Źródła pierwotne sprawdzone podczas audytu

- [Google — optymalizacja dla generatywnych funkcji Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): podstawy SEO, własne użyteczne treści, informacje lokalne i brak wymogu `llms.txt`.
- [OpenAI — crawlerzy](https://developers.openai.com/api/docs/bots): odrębne role wyszukiwania, treningu i odczytu na życzenie.
- [Anthropic — crawlerzy i robots](https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler): `Claude-SearchBot`, `ClaudeBot`, `Claude-User`.
- [Perplexity — crawlerzy](https://docs.perplexity.ai/docs/resources/perplexity-crawlers): bot wyszukiwania, odczyt użytkownika i weryfikacja źródłowych IP.

Spełnienie wymogów technicznych pozwala ubiegać się o obecność w wyszukiwaniu; indeksacja, cytowanie i liczba klientów nie są gwarantowane. Nie nadano arbitralnego „GEO score”.
