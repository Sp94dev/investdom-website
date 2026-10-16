# INVESTDOM — Agent Readiness produkcji: wynik i droga do maksimum

**Cel pomiaru:** `https://www.investdom.com.pl/`. **Data:** 16.10.2026, 09:34 Europe/Warsaw. Źródło: oficjalne API `https://isitagentready.com/api/scan` oraz opublikowany kod obliczający wynik w interfejsie. Wynik odpowiada zrzutowi właściciela: **20/100, Level 1 — Basic Web Presence**. [Dowody i obliczenia](seo-evidence/2026-10-16-agent-readiness-production.json).

Odtworzono świeży skan, ponieważ bezpośrednia ścieżka raportu zwracała w środowisku 404. Skan właściwej produkcji działa. Wcześniejszy skan chronionego podglądu został przekierowany do `vercel.com/login`; jego Level 2 dotyczył Vercel i nie jest wynikiem INVESTDOM.

## Co dokładnie oznacza 20/100

Domyślny widok sumuje zaliczone, punktowane kontrole i dzieli je przez ich liczbę. Aktualnie: **3/15 = 20%**. To nie jest średnia czterech wskaźników kategorii ani pomiar liczby agentów korzystających ze strony.

| Kategoria | Zaliczone | Wniosek |
|---|---:|---|
| Discoverability | 2/4 | Robots i sitemap działają; brakuje nagłówków odkrywania zasobów i DNS-AID |
| Content | 0/1 | Brakuje negocjacji `Accept: text/markdown`; HTML pozostaje dostępny |
| Bot Access Control | 1/2 | Wildcard już dopuszcza boty AI; brakuje Content Signals |
| API/Auth/MCP/Skills | 0/8 | Nie są publikowane wykrywane interfejsy i ich opisy |
| Commerce | niepunktowane | Wdrożenie płatności nie podniesie wyniku ogólnego tej wersji skanera |

`webBotAuth` jest neutralne, A2A jest domyślnie wyłączone, a Personal Agent Protocol/Poppy ma charakter informacyjny. Ich dodanie nie podniesie domyślnego wyniku według obecnego algorytmu. Skaner może zmienić te zasady; przed odbiorem trzeba zachować aktualną konfigurację i licznik.

## Każda punktowana kontrola

| Kontrola | Teraz | Sposób zaliczenia i faktyczny warunek |
|---|---|---|
| `robotsTxt` | pass | Zachować poprawny robots i deklarację kanonicznej sitemapy |
| `sitemap` | pass | Zachować poprawny XML; po publikacji poprawek ujednolicić www i ścieżki |
| `robotsTxtAiRules` | pass | Wildcard jest prawidłowy; osobne Allow dla każdego bota nie są konieczne |
| `contentSignals` | fail | Zadeklarować preferencje użycia treści; wyszukiwanie i odpowiedzi AI zgodne z celem właściciela. Politykę treningu rozpatrzyć odrębnie |
| `markdownNegotiation` | fail | Prawdziwe wersje stron w Markdown na żądanie, domyślnie nadal HTML; poprawny Content-Type i cache |
| `linkHeaders` | fail | RFC 8288, np. `rel="describedby"` wskazujące rzeczywiście dostępny przewodnik; potem katalog API/specyfikację |
| `agentSkills` | fail | Użyteczny SKILL.md i indeks discovery 0.2.0 z prawdziwymi URL oraz SHA-256 |
| `ard` | fail | Katalog AI zawierający istniejący skill, później rzeczywiste API/MCP; zgodność także z walidacją Lighthouse |
| `apiCatalog` | fail | RFC 9727: katalog do działającego API, OpenAPI i dokumentacji |
| `webMcp` | fail | Zarejestrowane i działające narzędzia przeglądarkowe, np. odczyt danych firmy/usług; feature detection |
| `mcpServerCard` | fail | Działający serwer MCP oraz prawdziwa karta. Ścieżka rozpoznawana przez skaner jest mechanizmem zgodności z jego wersją, nie dowodem przyjętego standardu |
| `dnsAid` | fail | Rekordy DNS odkrywające rzeczywisty, wdrożony interfejs; dostęp do panelu DNS i weryfikacja protokołu |
| `oauthDiscovery` | fail | Działający authorization server i discovery; publikowane issuer/endpoints muszą być prawdziwe |
| `oauthProtectedResource` | fail | Rzeczywiście chroniony zasób, weryfikacja tokenów i opis obsługiwanej autoryzacji |
| `authMd` | fail | Działająca procedura rejestracji/provisioningu agentów i zgodna dokumentacja; sama kartka „OAuth supported” nie wystarcza |

## Przewidywany wpływ etapów

Poniższe wyniki to arytmetyka przy **niezmienionych 15 kontrolach** i założeniu ich faktycznego zaliczenia, nie rezultaty wdrożenia ani obietnica wyniku skanera.

| Etap | Nowe zaliczenia względem poprzedniego | Razem | Prognoza |
|---|---|---:|---:|
| Stan obecny | — | 3/15 | 20 |
| Polityka treści | Content Signals | 4/15 | 27 |
| Czytelność i odkrywanie | Markdown + Link headers | 6/15 | 40 |
| Działający skill i katalog | Agent Skills + ARD | 8/15 | 53 |
| Publiczne interfejsy | API catalog + WebMCP + MCP card + DNS-AID | 12/15 | 80 |
| Rzeczywista autoryzacja | OAuth discovery + protected resource + Auth.md | 15/15 | 100 |

API skanera wskazuje, że kolejną bramką Level 2 jest obecnie Content Signals. Poziom i procent są osobnymi wynikami. Wyższe poziomy wymagają weryfikacji po wdrożeniu; nie przeliczamy ich automatycznie z procentów.

## Co realizować

**Najpierw etap do ok. 53:** przewodnik dla agentów korzystających z prawdziwych danych kontaktowych/usług, Markdown, odkrywanie zasobów i jawne preferencje. To rozbudowa obecnej witryny informacyjnej. Równolegle dokończyć istniejące poprawki wydajności/metadanych i opublikować je na produkcji.

**Potem etap do ok. 80:** małe publiczne API danych firmy i usług oraz jego interfejsy agentowe. Każdy zwracany fakt ma pochodzić z tych samych danych co HTML. Nie ujawniać formularzy klientów ani automatycznie składać zapytań o budowę. Funkcje mają mieć uzasadnienie w obsłudze klientów i dawać się wykonać od początku do końca.

**Pełne 100:** wymaga w tej wersji skanera działającej warstwy tożsamości, chronionej funkcji i rejestracji agentów. To osobny podprojekt produktu, np. autoryzowany dostęp do zapytań własnego klienta lub partnera, jeżeli firma rzeczywiście chce taką usługę. Najpierw określić model użytkowników i danych. Nie nakładać logowania na publiczne treści i nie publikować fikcyjnych endpointów. Wdrożenie jest zależne od tej decyzji; samo życzenie podniesienia wyniku nie definiuje chronionego procesu biznesowego.

## Znaczenie dla GEO

Skala pokazuje wykrywane protokoły i mechanizmy dostępu. Nie mierzy indeksacji, cytowań przez LLM ani pozyskanych klientów. Treści firmy są już renderowane jako HTML. Nowe protokoły należy traktować jako dodatkowy kanał wykorzystania informacji, a monitoring cytowań i leadów prowadzić osobno.

Rzeczywiste materiały realizacji, spójna oferta, właściwa tożsamość firmy i poprawny kontakt nadal są elementami planu GEO. Google nie wymaga Markdown ani specjalnych plików AI do obecności w swoich funkcjach generatywnych. Nie ma gwarancji, że uzyskanie 100 w tym skanerze zwiększy rekomendacje przez ChatGPT, Claude lub Perplexity.

## Status i źródła — sprawdzone 16.10.2026

- [Cloudflare: metoda i zakres skanera](https://blog.cloudflare.com/agent-readiness/), [sam skaner](https://isitagentready.com/). Commerce jest informacyjne; wynik jest metodą tego operatora.
- [Content Signals](https://contentsignals.org/) — polityka operatora i rozwijane mechanizmy deklarowania preferencji, nie uniwersalnie egzekwowany standard dostępu.
- [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288), [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727), [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728), [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414) — opublikowane standardy używane w odpowiednich zadaniach.
- [Agent Skills Discovery 0.2.0](https://github.com/cloudflare/agent-skills-discovery-rfc) — draft; indeks musi odpowiadać faktycznemu plikowi i digestowi.
- [AI Catalog](https://github.com/Agent-Card/ai-catalog) / [ARD](https://agenticresourcediscovery.org/) — rozwijane specyfikacje; weryfikować aktualny model i rozpoznawalność w obu skanerach.
- [MCP Server Cards SEP-2127](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127), [WebMCP](https://webmachinelearning.github.io/webmcp/), [DNS-AID draft](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/) — zależne od wersji/specyfikacji i odbiorcy; nie przedstawiać skanerowych heurystyk jako gwarancji interoperacyjności.
- [Google: optymalizacja dla funkcji generatywnych](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

W tym audycie nie zmieniono produkcji, DNS, polityki treningu ani aplikacji. [Plan wykonawczy Superpowers](superpowers/plans/2026-10-16-production-agent-readiness.md).
