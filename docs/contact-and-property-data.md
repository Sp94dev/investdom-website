# Formularz kontaktowy i wspólne dane inwestycji

Data: 2026-10-17. Zakres zlecony przez właściciela: punkty 2 i 4 przeglądu jakości kodu.

## Zmiany

### Formularz

- `src/lib/contact.ts`: wspólne limity i walidacja klienta/serwera. API traktuje payload jako `unknown`, wymaga tekstowych pól, sprawdza imię, email, telefon, długość wiadomości i trzy dozwolone tematy. Właściwości prototypu, tablice, null i niewłaściwe typy nie zastępują poprawnego formularza.
- Limity: imię 100 znaków, email 254, telefon 32 znaki i 9–15 cyfr, wiadomość 5000 znaków. Dopuszczone formatowanie telefonu: spacje, myślniki i nawiasy, plus na początku.
- Jawne `method="post" action="/api/contact"`. Bez JavaScriptu używany jest `application/x-www-form-urlencoded`; z JavaScriptem JSON. Dane osobowe nie są przekazywane w query stringu. Natywna ścieżka otrzymuje osobną czytelną odpowiedź HTML i link powrotu.
- Endpoint odczytuje maksymalnie 64 KiB, także bez Content-Length. Limit obejmuje narzut kodowania natywnych formularzy. Odczyt ma limit 3 s, odrzucane są nieobsługiwane media types, nieprawidłowy JSON i powtórzone nazwy pól urlencoded. Błędy wejścia otrzymują 400/408/413/415.
- Honeypot i odrzucanie żądań z obcym Origin / `Sec-Fetch-Site: cross-site`. To dodatkowa ochrona, a nie trwały limit liczby żądań. Programy poza przeglądarką mogą podawać własne nagłówki.
- `src/scripts/contact-form.ts`: typowany skrypt zamiast dużego bloku inline; wspólna walidacja, blokada ponownego submit w trakcie wysyłki, limit oczekiwania 12 s, `aria-busy`, status live i zachowanie wartości po błędzie. Usunięto timer, który mógł ukryć komunikat następnej próby. Sukces pozostaje widoczny do następnej wysyłki.
- Fokus przy `#kontakt` nadal obsługuje istniejący `contact-navigation.ts`. Zachowane klasy pól, przycisku, etykiety oraz położenie formularza. Ukryte pole honeypot nie jest dostępne klawiaturą ani pokazywane użytkownikowi.
- `src/lib/contact-email.ts`: escapowany HTML, alternatywa tekstowa i stabilny HMAC z dokładnego payloadu emaila. Nagłówek idempotencji nie zawiera jawnych danych osobowych. Natywne i JSON-owe ponowienie po normalizacji otrzymują ten sam klucz.
- Wysyłka do istniejącej usługi Resend przez natywny `fetch` z limitem 8 s. Usunięcie nieużywanego SDK Resend zmniejszyło lokalne drzewo zależności o 30 pakietów; nie dodano bibliotek ani nie aktualizowano pozostałych wersji.
- Brak treści wiadomości i danych kontaktowych w logach aplikacji; błędy dostawcy nie są zwracane użytkownikowi. Odpowiedzi mają `no-store` i `X-Robots-Tag: noindex, nofollow`.

### Dane ofert i projektów

`src/data/properties.ts` zastępuje trzy niezależne tablice. Komponent strony głównej, lista ofert i projekty importują te same dane i zdjęcie. Lokalizacje wyliczane są z listy inwestycji.

Właściciel potwierdził istniejące dane: Pisarzowice, etap II, cena **895 000 zł**, powierzchnia **135 m²**, działka **700 m²**, stan deweloperski, **4 pokoje**, **2 łazienki** i istniejące cechy. Usunięto komentarz sugerujący przykładową powierzchnię działki. Zachowano dotychczasowy opis, obraz pierwszego etapu i jego podpis ALT. Kolejność tych samych cech ujednolicono między widokami.

Zmiana faktu w jednej inwestycji wymaga teraz edycji jednego rekordu i wdrożenia, zgodnie z prerenderowaniem stron z PR #3. Nie dodano nowych ofert ani danych ofertowych do JSON-LD.

## Konfiguracja wysyłki

W Vercel → Project → Settings → Environment Variables:

| Zmienna | Zastosowanie |
| --- | --- |
| `RESEND_API_KEY` | Serwerowy klucz z uprawnieniem wysyłki w Resend. Nie udostępniać w kodzie klienta ani logach. |
| `CONTACT_EMAIL` | Pojedynczy docelowy adres email. Ma pierwszeństwo przed fallbackiem. |

Nadawca pozostaje `Formularz InvestDom <formularz@investdom.com.pl>`; domena nadawcza musi być zweryfikowana w Resend. Nie zmieniono istniejącego nadawcy.

Do czasu odpowiedzi właściciela zachowano dotychczasowy fallback odbiorcy `kontakt@investdom.com.pl`. Widoczny adres strony pozostaje `kontakt@investdom.pl`. Nie są one automatycznie traktowane jako ta sama skrzynka. Jawne ustawienie poprawnego `CONTACT_EMAIL` rozstrzyga odbiorcę. Nowe wartości zmiennych wymagają wdrożenia z odpowiedniego środowiska Vercel.

### Ponawianie i idempotencja

[Resend przechowuje klucze idempotencji przez 24 godziny](https://resend.com/docs/dashboard/emails/idempotency-keys). Ta sama znormalizowana treść, kontakt i odbiorca, przy tym samym kluczu API i szablonie, dają ten sam klucz. Powtórka w tym oknie ma zostać potraktowana przez dostawcę jako ta sama operacja. Zmieniona treść daje nowy klucz; po wygaśnięciu okna identyczna treść może być wysłana ponownie. Rotacja klucza API lub zmiana szablonu zmienia również wynik HMAC.

Przerwanie połączenia nie dowodzi, że wiadomości nie przyjęto. Komunikaty błędów mówią o braku potwierdzenia, a klient nie resetuje pól ani nie wykonuje automatycznych ponowień. Po sukcesie dostawca potwierdza przyjęcie operacji, co nie zastępuje kontroli dostarczenia do skrzynki i spamu.

## Działanie manualne: Vercel WAF

W kodzie **nie ma trwałego rate limitera**. Nie dodano pozornego limitu w lokalnym `Map` funkcji serverless. Konfiguracja panelu hostingowego nie jest dostępna w tym środowisku.

Przed publikacją włączyć regułę w [Vercel WAF](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting):

1. Ograniczyć regułę do ścieżki `/api/contact` i metody `POST`, na właściwym projekcie oraz domenie produkcyjnej.
2. Grupować żądania po zaufanym adresie IP ustalanym przez platformę. Proponowany próg startowy: **5 żądań na 60 sekund na IP**; czas blokady 60 s, jeśli dany plan/edytor udostępnia te parametry. Dostosować do dostępnych ustawień i rzeczywistego ruchu.
3. Najpierw obejrzeć logi reguły, następnie włączyć egzekwowanie. Uwzględnić wspólny adres IP użytkowników sieci firmowych/mobilnych. Limit ma działać przed uruchomieniem funkcji i wywołaniem dostawcy maili.
4. Potwierdzić w panelu, że reguła została wdrożona, a blokady mają oczekiwany status. Klient formularza obsługuje także odpowiedź inną niż JSON i HTTP 429; konkretna strona blokady zależy od WAF.

Jeśli plan Vercel nie udostępnia odpowiedniej reguły, alternatywą jest atomowy limiter we współdzielonym magazynie. Wymaga konfiguracji usługi i sekretów. Honeypot i idempotencja ograniczają inne rodzaje nadużyć i nie zastępują tego kroku.

## Weryfikacja i pozostałe ograniczenia

- `npm run check`: **0 błędów, 0 ostrzeżeń, 4 istniejące podpowiedzi**.
- `npm run build`: **PASS**; cztery prerenderowane strony, 34 zoptymalizowane warianty obrazów i dynamiczny endpoint kontaktowy.
- `git diff --check`: **PASS**.
- Odczyt wygenerowanego HTML potwierdził jawny POST, action endpointu, wspólne limity i wzorzec telefonu.

Świeży niezależny przegląd kodu całej zmiany wskazał jeden istotny błąd: natywny POST textarea używa CRLF, a JSON używa LF. Przeniesiono normalizację nowych wierszy przed kontrolę długości, aby ta sama wiadomość nie przekraczała limitu wyłącznie przez sposób wysyłki. Nie zgłoszono usterek krytycznych ani drobnych.

Zgodnie z instrukcją środowiska nie dodawano ani nie uruchamiano testów bez osobnego zlecenia. Nie wykonywano kontroli przeglądarkowych ani rzeczywistej wysyłki. Nie ma dostępu do klucza Resend, ustawień skrzynki ani panelu WAF; brak deklaracji o dostawie maili lub działaniu limitu na produkcji. Przegląd źródeł i kompilacja nie zastępują tych kontroli.

PR jest oparty na `perf/seo-images-metadata`, aby zachować optymalizację obrazów; powinien trafić na main po PR #3. Usunięcie remontów pozostaje niezależnym PR #2. Ten zakres nie obejmuje migracji wersji Astro, zmiany fontów ani pozostałych punktów audytu.
