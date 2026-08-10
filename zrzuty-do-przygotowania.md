# Zrzuty ekranu - stan i plan

Zdecydowaliśmy, żeby nie pokazywać systemu zbyt szeroko. Pięć wybranych zrzutów
jest już wgranych i wpiętych w treść stron. Pozostałe strony na razie **nie
mają i nie wymagają** żadnego zdjęcia - wyglądają kompletnie bez niego.
Zdjęcia dokładam tylko tam, gdzie faktycznie chcemy coś pokazać.

## Wgrane zrzuty

Każdy zrzut zachowuje swoje naturalne proporcje (nie jest przycinany do
wspólnego kształtu) - stąd różne wysokości ramek na stronie.

| Plik | Wymiary | Co pokazuje | Gdzie ląduje |
|---|---|---|---|
| `public/features/procesy-workflow-hero.png` | 1968×1082 | Diagram procesu (Zbieranie wymagań → Do zrobienia → W trakcie → QA → Zrobione) | Procesy i workflow - zdjęcie w sekcji powitalnej |
| `public/features/low-code-automatyzacje-hero.webp` | 2000×861 | Edytor reguły („Rekord utworzony" + kroki akcji) | Low-code i automatyzacje - zdjęcie w sekcji powitalnej |
| `public/features/low-code-automatyzacje-sql.webp` | 2000×899 | Zapytanie SQL z wynikiem | Low-code i automatyzacje - pasmo „Jak to wygląda" |
| `public/features/no-code-hero.png` | 1926×1082 | Formularz „Utwórz kontrahenta" | Platforma No-Code - zdjęcie w sekcji powitalnej |
| `public/features/no-code-dashboard.webp` | 2000×986 | Główny pulpit Opero (Księgowość, Kontrahenci, Serwis...) | Platforma No-Code - pasmo „Jak to wygląda" |

Dla kolejnych zrzutów w przyszłości: dowolny format (PNG lub WebP, zgodny z
rzeczywistą zawartością pliku - nie zmieniaj samego rozszerzenia) i dowolna
proporcja. Podaj mi tylko plik, a ja dopiszę jego wymiary do treści strony -
obraz wyświetli się w swoich naturalnych proporcjach, bez przycinania.

## Strony bez zdjęć (na razie, docelowo opcjonalnie)

Te pięć podstron działa w pełni bez obrazów - sekcja powitalna jest
pełnoszerokim tekstem, a pasmo „Jak to wygląda" po prostu nie istnieje:

- EOD / DMS (`eod-dms`)
- Raporty i analityka (`raporty`)
- Bezpieczeństwo i uprawnienia (`bezpieczenstwo-uprawnienia`)
- Integracje i zgodność (`integracje-zgodnosc`)
- Kontekstowe AI (`kontekstowe-ai`)

Jeśli kiedyś zechcesz dodać im zdjęcia, wystarczy przygotować pliki i dać znać
- dopiszę `shot`/`shots` z powrotem do treści tych stron (struktura kodu już to
obsługuje, nic nie trzeba przebudowywać). Poniżej zostawiam opisy, co dokładnie
warto by pokazać, gdyby ta decyzja kiedyś padła:

**EOD / DMS**
- Kartoteka dokumentu z polami rejestracyjnymi, panelem załączników i paskiem statusu obiegu.
- Historia wersji pliku (v1, v2, v3) z datami i autorami.
- Podgląd pisma wygenerowanego z szablonu.

**Raporty i analityka**
- Raport z wykresem u góry i tabelą zagregowanych danych pod spodem.
- Drill-down: kliknięta wartość rozwinięta w listę rekordów.
- Dashboard z kafelkami KPI.

**Bezpieczeństwo i uprawnienia**
- Macierz ról i uprawnień (role × moduły/obiekty × poziom dostępu).
- Lista spółek w organizacji ze statusem.
- Lista tokenów API - **zamaskuj wartości tokenów**.

**Integracje i zgodność**
- Panel integracji z listą i statusem połączenia.
- Sekcja KSeF przy fakturze ze statusem wysyłki.
- Weryfikacja VAT przy kontrahencie - **użyj fikcyjnego kontrahenta i NIP-u**.

**Kontekstowe AI**
- Czat użytkownika z asystentem: pytanie o dane i odpowiedź z listą rekordów.
- Schemat asystenta i Opero (grafika rysowana, nie zrzut UI - mogę zrobić kodem).

## Ogólne zasady na przyszłość

- Jasny motyw Opero, bez paska adresu przeglądarki - samo okno aplikacji.
- Dane demonstracyjne, bez nazw prawdziwych klientów i danych osobowych.
- Wycinek pokazujący jedną konkretną rzecz, nie cały pulpit w pomniejszeniu.
