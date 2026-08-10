# Funkcje systemu Opero — treść stron i plan wyglądu

Osiem podstron w sekcji „Funkcje systemu". Ten dokument daje **gotową treść** i
**plan, jak każda strona ma wyglądać**. Techniczne detale (komponenty, kod)
zostawiamy agentowi budującemu front.

**Zasady:**
- Terminologia **Opero** — to my wyznaczamy nazewnictwo branży (obiekty własne,
  silnik reguł, układy, procesy). Nie tłumaczymy na ogólniki.
- Każda strona ma **sprzedać temat, ale nie zasypać** — kilka mocnych bloków, zwięźle.
- Bez treści o etapach wdrożenia. Bez konkretnych wbudowanych obiektów i modułów
  branżowych — te trafią do osobnej zakładki „Dla kogo".
- Funkcje mogą się powtarzać między stronami (np. obiekty własne są i w No-Code, i w
  EOD) — to celowe, bo w każdym kontekście są innym argumentem.

---

## Jak wygląda każda strona (wspólny plan)

Wszystkie 8 stron ma ten sam rytm, z góry na dół:

1. **Sekcja powitalna (hero).** Duży nagłówek, pod nim jedno zdanie streszczające
   korzyść, przycisk „Umów prezentację" i drugi „Zobacz Opero w akcji". Obok lub w
   tle — główny zrzut ekranu tej funkcji.
2. **Zdanie wprowadzające.** Jeden krótki akapit, który mówi „o co chodzi", zanim
   wejdziemy w szczegóły.
3. **Bloki funkcji.** 3–6 kafelków, każdy: ikona + tytuł + 2 zdania. To serce strony.
4. **Pasmo zrzutów.** 2–3 obrazy pod sobą lub obok siebie, każdy z krótkim podpisem.
   Pokazują, że to realnie działa.
5. **Sekcja domykająca.** Krótkie zdanie zachęty + jeden przycisk („Umów prezentację").
6. **Odnośniki do pokrewnych funkcji.** 2–3 linki do innych podstron z tej sekcji.

Akcent kolorystyczny wszędzie: **#38B6FF**. Ton: konkretny, rzeczowy, bez
marketingowego lania wody.

Przy każdej stronie niżej znajdziesz: adres, treść hero, wprowadzenie, bloki funkcji,
opis zrzutów (co ma być na obrazie) i tekst sekcji domykającej.

---

## 1. Procesy i workflow (BPM)
**Adres:** `/funkcje/procesy-workflow`

**Hero**
- Nagłówek: **Procesy i workflow — cała firma działa według Twoich reguł**
- Zdanie: Zaprojektuj każdy obieg pracy jako proces. Akceptacje, obiegi dokumentów i
  procedury przechodzą przez zdefiniowane stany — nic nie ginie między działami.

**Wprowadzenie**
Opero to silnik procesów, w którym rekord przechodzi przez stany i przejścia (np.
Nowe → W realizacji → Zaakceptowane → Zamknięte). Proces pilnuje kolejności,
uprawnień i terminów, a każdy przebieg zostaje w historii.

**Bloki funkcji**
- **Procesy (workflow)** — modelujesz obieg jako stany i przejścia, z warunkami i
  uprawnieniami na każdym kroku. Zmiana projektu procesu nie wymaga programisty.
- **Zadania i tablice kanban** — każdy etap generuje zadania przypisane osobom, z
  możliwością przekierowania. Praca widoczna na kanbanie i listach „moje zadania".
- **Obiekty własne jako nośnik procesu** — proces przypinasz do dowolnego obiektu
  (Wniosek, Zlecenie, Umowa), więc obiegiem obejmujesz dokładnie te dane, które masz.
- **Formularze na etapach** — na każdym stanie decydujesz, co użytkownik widzi i może
  zmienić. Inny zakres pól dla wnioskującego, inny dla akceptującego.
- **Historia i odtwarzanie** — pełny ślad kto, co i kiedy zmienił oraz możliwość
  prześledzenia przebiegu krok po kroku.

**Zrzuty**
1. Diagram procesu — węzły-stany połączone strzałkami-przejściami, jeden stan
   podświetlony jako aktualny. *Podpis: „Obieg akceptacji jako stany i przejścia".*
2. Tablica kanban — kolumny to stany procesu, karty to rekordy z osobą i terminem.
   *Podpis: „Praca zespołu na kanbanie".*
3. Rekord w toku — kartoteka z paskiem stanu i przyciskami przejść („Zaakceptuj",
   „Odrzuć", „Zwróć do poprawy"). *Podpis: „Rekord i dostępne przejścia".*

**Sekcja domykająca**
Zmapuj swój pierwszy proces w Opero. Pokażemy, jak przenieść obieg z maili i Excela
do jednego, kontrolowanego procesu.

**Pokrewne:** EOD / DMS · Platforma No-Code · Low-code i automatyzacje

---

## 2. EOD / DMS — obieg dokumentów i pliki
**Adres:** `/funkcje/eod-dms`

**Hero**
- Nagłówek: **EOD i DMS — dokumenty pod kontrolą od wpływu do archiwum**
- Zdanie: Rejestruj dokumenty, prowadź je przez obieg akceptacji i trzymaj każdą
  wersję pliku przy sprawie — zamiast po mailach i dyskach.

**Wprowadzenie**
Opero łączy obieg dokumentów (EOD) z zarządzaniem plikami (DMS): dokument ma swoją
kartotekę, ścieżkę akceptacji i komplet plików z wersjami. Wszystko z pełną historią
i kontrolą dostępu.

**Bloki funkcji**
- **Rejestracja dokumentów** — każdy typ dokumentu (pismo, faktura, wniosek) to obiekt
  własny z polami, numeracją i kartoteką.
- **Obieg akceptacji** — dokument krąży po zdefiniowanych stanach: dekretacja, opinie,
  zatwierdzenie, archiwizacja.
- **Formularze wprowadzania** — kontrolowane ekrany rejestracji i dekretacji, różne
  dla kancelarii, działu i akceptującego.
- **Pliki i wersjonowanie** — załączniki dowiązane do rekordu, przechowywane,
  wersjonowane i przeszukiwalne, z kontrolą uprawnień.
- **Szablony dokumentów** — generujesz umowy, pisma i decyzje z danych rekordu według
  wzorców ze zmiennymi; dokument zawsze w aktualnej wersji.

**Zrzuty**
1. Kartoteka dokumentu — pola rejestracyjne, panel załączników, pasek statusu obiegu.
   *Podpis: „Dokument, jego dane i obieg w jednym miejscu".*
2. Historia wersji pliku — lista wersji załącznika (v1, v2, v3) z datami i autorami.
   *Podpis: „Pełna historia wersji".*
3. Generowanie z szablonu — podgląd wygenerowanego pisma z danymi z rekordu.
   *Podpis: „Dokument z szablonu jednym kliknięciem".*

**Sekcja domykająca**
Uporządkuj obieg dokumentów. Zobacz, jak Opero prowadzi dokument od wpływu do archiwum
bez luk i zagubionych plików.

**Pokrewne:** Procesy i workflow · Platforma No-Code · Bezpieczeństwo i uprawnienia

---

## 3. Platforma No-Code
**Adres:** `/funkcje/no-code`

**Hero**
- Nagłówek: **No-code — zbuduj własny system bez programisty**
- Zdanie: Projektujesz dane, ekrany i nawigację w konfiguracji wizualnej. Opero
  zamienia je w działającą aplikację — bez pisania kodu.

**Wprowadzenie**
No-code w Opero to komplet klocków, z których składasz aplikację: obiekty własne i
pola opisują dane, formularze i układy budują ekrany, menu i strony własne —
nawigację, a słowniki i listy własne pilnują spójności.

**Bloki funkcji**
- **Obiekty własne i pola** — definiujesz typy danych i ich właściwości z ponad 20
  typów pól (tekst, kwota, data, wybór, powiązanie, plik, wyliczane). Strukturę
  zmieniasz bezpiecznie w wersji roboczej.
- **Obiekty podrzędne** — zagnieżdżone tabele w rekordzie (pozycje, etapy, uczestnicy)
  dla relacji „jeden do wielu".
- **Formularze i układy** — sterujesz dostępem do pól i wizualnym rozmieszczeniem
  sekcji, zakładek i komponentów, z wersjonowaniem.
- **Menu i strony własne** — układasz nawigację i budujesz dowolne strony (pulpity,
  instrukcje, panele) poza standardowym schematem obiekt → formularz.
- **Słowniki i listy własne** — kontrolowane wartości i lekkie zbiory referencyjne,
  które trzymają dane w ryzach.
- **Procesy na Twoich danych** — do każdego obiektu przypniesz workflow, więc
  aplikacja od razu obsługuje obiegi.

**Zrzuty**
1. Builder obiektu — tabela pól (nazwa, typ, ustawienia) i panel dodawania pola.
   *Podpis: „Projektujesz strukturę danych bez kodu".*
2. Edytor układu — sekcje i pola układane metodą przeciągnij-i-upuść.
   *Podpis: „Ekran składasz przeciągnij-i-upuść".*
3. Gotowa aplikacja — po lewej lista rekordów, po prawej otwarty formularz.
   *Podpis: „Efekt końcowy: działająca aplikacja".*

**Sekcja domykająca**
Zbuduj pierwszy obiekt w kilka minut. Pokażemy, jak z pustej instancji powstaje
działająca aplikacja — bez ani jednej linijki kodu.

**Pokrewne:** Procesy i workflow · Low-code i automatyzacje · Raporty i analityka

---

## 4. Low-code i automatyzacje
**Adres:** `/funkcje/low-code-automatyzacje`

**Hero**
- Nagłówek: **Low-code i automatyzacje — logika, która pracuje za Ciebie**
- Zdanie: Tam, gdzie konfiguracja to za mało, wchodzą reguły, skrypty i zapytania SQL.
  Automatyzujesz decyzje i przetwarzanie danych bez budowania osobnego systemu.

**Wprowadzenie**
Warstwa low-code Opero uruchamia logikę na zdarzeniach: silnik reguł reaguje według
zasady „gdy warunek → wykonaj kroki", silnik skryptów obsługuje nietypowe
przetwarzanie, a zapytania SQL sięgają po dane dokładnie tak, jak potrzebujesz.

**Bloki funkcji**
- **Silnik reguł i ich kroki** — definiujesz warunki i sekwencję akcji (ustaw pole,
  utwórz rekord, wyślij powiadomienie, zablokuj przejście). Reguły testujesz przed
  wdrożeniem, więc automatyzacja jest przewidywalna.
- **Silnik skryptów** — fragmenty wyrażeń i skryptów wywoływane z reguł, pól
  wyliczanych i szablonów dla scenariuszy poza konfiguracją wizualną.
- **Zapytania SQL** — nazwane, parametryzowane zapytania wielokrotnego użytku jako
  źródło reguł, raportów i pól wyboru.

**Zrzuty**
1. Edytor reguły — u góry warunki, poniżej ponumerowana lista kroków akcji.
   *Podpis: „Reguła: warunek → kroki akcji".*
2. Test reguły — wejściowy rekord i wynik/log wykonania kroków.
   *Podpis: „Test przed wdrożeniem".*
3. Zapytanie SQL — edytor z parametrami i tabelą wyników pod spodem.
   *Podpis: „Zapytanie z parametrami i wynikiem".*

**Sekcja domykająca**
Zautomatyzuj powtarzalną robotę. Zobacz, jak reguły i skrypty przejmują ręczne kroki,
które dziś robi zespół.

**Pokrewne:** Procesy i workflow · Raporty i analityka · Platforma No-Code

---

## 5. Raporty i analityka
**Adres:** `/funkcje/raporty`

**Hero**
- Nagłówek: **Raporty i analityka — decyzje na danych, nie na przeczuciach**
- Zdanie: Buduj zestawienia, wykresy i pulpity na żywych danych systemu. Od liczby
  zbiorczej zejdziesz do pojedynczego rekordu bez eksportu do Excela.

**Wprowadzenie**
Raporty Opero agregują i grupują dane obiektów, prezentują je w tabelach i na
wykresach, a przez drill-down prowadzą od wskaźnika do źródłowych rekordów.
Najważniejsze liczby zbierają dashboardy, a nietypowe cięcia danych — zapytania SQL.

**Bloki funkcji**
- **Raporty** — agregacje, grupowania i wskaźniki na danych systemu, z drążeniem
  szczegółów (drill-down) do rekordów źródłowych.
- **Wykresy** — wizualizacje trendów i rozkładów wprost w raporcie, czytelne dla
  zarządu.
- **Dashboardy** — pulpity z kafelkami i widgetami zbierające kluczowe metryki i
  skróty w jednym miejscu, osobne dla każdego zespołu.
- **Zapytania SQL jako źródło** — gdy standardowe filtry nie wystarczają, raport
  zasilasz własnym, parametryzowanym zapytaniem.

**Zrzuty**
1. Raport z wykresem — wykres u góry, pod nim tabela zagregowanych danych.
   *Podpis: „Raport i wykres na jednym ekranie".*
2. Drill-down — kliknięta wartość rozwinięta w listę rekordów, które ją tworzą.
   *Podpis: „Od wskaźnika do rekordów źródłowych".*
3. Dashboard — siatka kafelków KPI i kilka miniwykresów.
   *Podpis: „Kluczowe wskaźniki w jednym miejscu".*

**Sekcja domykająca**
Zobacz swoje dane w jednym miejscu. Pokażemy raport i dashboard zbudowane na Twoim
typie danych.

**Pokrewne:** Low-code i automatyzacje · Platforma No-Code · Kontekstowe AI i MCP

---

## 6. Bezpieczeństwo i uprawnienia
**Adres:** `/funkcje/bezpieczenstwo-uprawnienia`

**Hero**
- Nagłówek: **Bezpieczeństwo i uprawnienia — każdy widzi dokładnie to, co powinien**
- Zdanie: Role, uprawnienia, wiele spółek i tokeny API pod kontrolą. Dane firmy
  chronione na poziomie oczekiwanym przez działy IT.

**Wprowadzenie**
Dostęp w Opero układasz od organizacji i jej spółek, przez role i członków, aż po
precyzyjne uprawnienia do modułów, obiektów i pól. Integracje zabezpieczasz tokenami
API, a konta — uwierzytelnianiem wieloskładnikowym.

**Bloki funkcji**
- **Członkowie i role** — konta użytkowników zebrane w role, które definiują zakres
  dostępu. Zmiana uprawnień roli obejmuje od razu wszystkich w niej.
- **Uprawnienia szczegółowe** — kontrola widoczności i edycji na poziomie modułu,
  obiektu i pojedynczego pola.
- **Organizacje i spółki** — wspólna konfiguracja, osobne dane każdej firmy; grupa
  kapitałowa na jednej platformie bez mieszania danych.
- **Tokeny API** — dostęp dla integracji z określonym zakresem uprawnień, wydawany i
  odbierany niezależnie od kont ludzi.
- **MFA i logi** — uwierzytelnianie wieloskładnikowe oraz rejestr zdarzeń „kto, co,
  kiedy" na potrzeby audytu i zgodności.

**Zrzuty**
1. Macierz ról i uprawnień — wiersze to role, kolumny to moduły/obiekty, komórki to
   poziom dostępu. *Podpis: „Uprawnienia sterowane rolami".*
2. Spółki w organizacji — lista spółek ze statusem i przełącznikiem kontekstu.
   *Podpis: „Wiele spółek w jednej organizacji".*
3. Tokeny API — lista tokenów z zakresem i statusem. *Podpis: „Bezpieczny dostęp dla
   integracji".*

**Sekcja domykająca**
Zapanuj nad dostępem do danych. Pokażemy model ról i uprawnień dopasowany do struktury
Twojej firmy.

**Pokrewne:** Integracje i zgodność · EOD / DMS · Kontekstowe AI i MCP

---

## 7. Integracje i zgodność
**Adres:** `/funkcje/integracje-zgodnosc`

**Hero**
- Nagłówek: **Integracje i zgodność — Opero częścią Twojego ekosystemu**
- Zdanie: KSeF, e-Doręczenia, kursy NBP i weryfikacja VAT działają wprost z systemu, a
  otwarte API łączy Opero z resztą narzędzi firmy.

**Wprowadzenie**
Opero spełnia polskie wymogi (e-fakturowanie, korespondencja urzędowa) i wymienia dane
ze światem zewnętrznym bez osobnego oprogramowania — zgodność i integracje w jednym
miejscu.

**Bloki funkcji**
- **KSeF** — wysyłka i odbiór faktur ustrukturyzowanych zgodnie z obowiązkowym
  e-fakturowaniem w Polsce.
- **e-Doręczenia** — elektroniczna korespondencja urzędowa (odpowiednik listu
  poleconego) wprost z systemu.
- **Kursy walut NBP** — automatyczne pobieranie kursów (Tabela A) do przeliczeń
  wielowalutowych, z poprawną obsługą dni wolnych.
- **Weryfikacja VAT** — sprawdzanie statusu kontrahenta (biała lista / VIES), zanim
  wystawisz dokument.
- **Otwarte API** — łączysz Opero z systemami firmy dwukierunkowo, robiąc z platformy
  element ekosystemu, a nie kolejną wyspę.

**Zrzuty**
1. Panel integracji — karty/lista dostępnych integracji ze statusem połączenia.
   *Podpis: „Integracje włączane w jednym panelu".*
2. Wysyłka KSeF — sekcja przy fakturze ze statusem wysyłki, numerem i potwierdzeniem.
   *Podpis: „Faktura wysłana do KSeF".*
3. Weryfikacja VAT — kartoteka kontrahenta z wynikiem sprawdzenia numeru VAT.
   *Podpis: „Weryfikacja VAT przy kontrahencie".*

**Sekcja domykająca**
Połącz Opero ze swoimi systemami. Sprawdź, jak zgodność i integracje działają bez
dodatkowego oprogramowania.

**Pokrewne:** Bezpieczeństwo i uprawnienia · EOD / DMS · Raporty i analityka

---

## 8. Kontekstowe AI i MCP
**Adres:** `/funkcje/ai-mcp`

**Hero**
- Nagłówek: **Kontekstowe AI i MCP — asystent, który zna Twój system**
- Zdanie: AI rozumie strukturę i dane Twojej instancji przez protokół MCP. Konsultant
  buduje nim konfigurację, użytkownik pyta o dane w języku naturalnym.

**Wprowadzenie**
Opero wystawia swoje możliwości przez MCP (Model Context Protocol) — standard, który
daje asystentowi AI bezpieczny, świadomy kontekstu dostęp do platformy. Ten sam
mechanizm służy dwóm grupom: konsultantom przy konfiguracji i użytkownikom końcowym w
codziennej pracy.

**Bloki funkcji**
- **AI konfiguracyjne (dla konsultantów)** — budowa i modyfikacja obiektów,
  formularzy, reguł i procesów w dialogu z asystentem, z walidacją przed zapisem.
  Wdrożenie przyspiesza, bo AI zna kontrakt platformy.
- **AI dla użytkowników końcowych** — pytania o dane w języku naturalnym,
  wyszukiwanie rekordów i podsumowania bez klikania po ekranach.
- **MCP jako fundament** — jeden protokół łączy AI z konfiguracją i danymi runtime, z
  poszanowaniem uprawnień i zakresu dostępu.

**Zrzuty**
1. AI buduje konfigurację — po lewej rozmowa z asystentem, po prawej podgląd
   powstającego obiektu/reguły. *Podpis: „AI buduje konfigurację w dialogu".*
2. AI odpowiada na pytanie o dane — czat użytkownika z pytaniem i odpowiedzią
   (liczba/lista rekordów). *Podpis: „Pytasz o dane, dostajesz odpowiedź".*
3. Schemat AI ↔ MCP ↔ Opero — prosty diagram: z Opero dwie gałęzie „Konfiguracja" i
   „Dane runtime". Grafika rysowana, nie zrzut UI. *Podpis: „Jak MCP łączy AI z
   Opero".*

**Sekcja domykająca**
Zobacz AI, które zna Twój Opero. Pokażemy, jak asystent przyspiesza i konfigurację, i
codzienną pracę z danymi.

**Pokrewne:** Platforma No-Code · Low-code i automatyzacje · Raporty i analityka

---

## Ściąga mapy stron

| # | Podstrona | Adres | O czym mówi |
|---|-----------|-------|-------------|
| 1 | Procesy i workflow (BPM) | `/funkcje/procesy-workflow` | procesy, kanban, obiekty, formularze |
| 2 | EOD / DMS | `/funkcje/eod-dms` | obieg dokumentów, pliki, szablony |
| 3 | Platforma No-Code | `/funkcje/no-code` | obiekty, pola, formularze, układy, menu, słowniki |
| 4 | Low-code i automatyzacje | `/funkcje/low-code-automatyzacje` | reguły, skrypty, zapytania SQL |
| 5 | Raporty i analityka | `/funkcje/raporty` | raporty, wykresy, dashboardy |
| 6 | Bezpieczeństwo i uprawnienia | `/funkcje/bezpieczenstwo-uprawnienia` | role, spółki, tokeny API, MFA |
| 7 | Integracje i zgodność | `/funkcje/integracje-zgodnosc` | KSeF, e-Doręczenia, NBP, VAT, API |
| 8 | Kontekstowe AI i MCP | `/funkcje/ai-mcp` | AI dla konsultantów i użytkowników przez MCP |
