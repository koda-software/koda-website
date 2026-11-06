import { polish } from "./polish";

/*
 * Copy for the Solutions, Implementation, About and Contact pages.
 *
 * Solutions: the facts per industry come from the current site's solutions
 * page, trimmed to the segments the commercial strategy names (production,
 * professional services and accounting offices, shared service centres and
 * groups of companies, construction, service) and with no logistics.
 * Implementation: the engagement as the LinkedIn services text and the
 * commercial strategy describe it - talk to the people who build the system,
 * see a demo on your own process, start with one area, take the system over.
 * About: the company's own story from the current About page, with the
 * category names it implemented written out in plain words.
 *
 * Nothing here is a client, a number or a quotation that does not exist.
 */

export const solutions = polish({
  hero: {
    title: ["Jeden system,", "który mówi językiem Waszego działu."] as [string, string],
    lead: "Projektujemy Opero dla organizacji, w których jeden proces przechodzi przez kilka działów, a jego dane leżą dziś w mailach i arkuszach. Najpierw obszary pracy, które wyglądają podobnie wszędzie, potem branże, w których wyglądają inaczej.",
  },
  areas: [
    {
      title: "Finanse i faktury",
      text: "Faktura kosztowa wchodzi z KSeF, przechodzi opis i akceptację, a dział finansów widzi, na jakim etapie jest każda.",
      items: ["Faktury z KSeF i ich akceptacja", "Opis i dekretacja na etapach", "Kontrahenci z weryfikacją VAT", "Raport kosztów od kwoty do faktury"],
      links: ["aplikacje", "integracje"],
    },
    {
      title: "Umowy",
      text: "Umowa ma właściciela, ścieżkę opinii zależną od wartości i przypomnienie przed końcem obowiązywania.",
      items: ["Rejestr umów z wersjami plików", "Opiniowanie i akceptacja zależna od kwoty", "Przypomnienia przed końcem umowy", "Szablony umów wypełniane danymi"],
      links: ["dokumenty", "procesy"],
    },
    {
      title: "Zakupy",
      text: "Wniosek o zakup trafia do właściwej osoby, zależnie od kwoty i działu, a zarząd widzi, ile czeka na decyzję.",
      items: ["Wnioski z formularzem dla działu", "Akceptacja kierownika i finansów", "Zamówienia i dostawcy przy sprawie", "Kontrola budżetu w raporcie"],
      links: ["moduly", "reguly"],
    },
    {
      title: "Kadry i wnioski",
      text: "Wnioski pracownicze bez papieru i bez arkusza obok, z danymi osobowymi widocznymi tylko dla uprawnionych.",
      items: ["Wnioski urlopowe i delegacje", "Ewidencja czasu przy projektach", "Uprawnienia do danych osobowych", "Dokumenty pracownicze przy sprawie"],
      links: ["kontrola", "aplikacje"],
    },
    {
      title: "Zgłoszenia i obsługa",
      text: "Zgłoszenie ma numer, właściciela i termin od chwili przyjęcia, a jego historia jest w jednym miejscu.",
      items: ["Zgłoszenia wewnętrzne i od klientów", "Przypisanie do zespołu albo roli", "Etapy i terminy obsługi", "Pełna historia sprawy"],
      links: ["aplikacje", "procesy"],
    },
    {
      title: "Zarząd i grupa spółek",
      text: "Zarząd patrzy na bieżące dane, a każda spółka w grupie zachowuje swoje, przy wspólnej konfiguracji.",
      items: ["Pulpity z najważniejszymi wskaźnikami", "Spółki w jednej organizacji", "Raporty z drążeniem do spraw", "Rejestr zdarzeń dla audytu"],
      links: ["raporty", "kontrola"],
    },
  ],
  industries: [
    {
      name: "Produkcja",
      lead: "Zakład ma wiele procesów, które rzadko mieszczą się w modułach ERP: zdarzenia jakościowe, utrzymanie maszyn, inspekcje, dokumenty dostawców i zgłoszenia wewnętrzne.",
      uses: [
        "Zdarzenia jakościowe, niezgodności i działania korygujące",
        "Sprawy utrzymania maszyn i zapotrzebowanie na części",
        "Dokumenty dostawców i cykliczne kontrole zgodności",
        "Zgłoszenia zakładowe, które nie pasują do żadnego działu",
      ],
      built: [
        "Własne moduły dla maszyn, inspekcji i dostawców",
        "Etapy między produkcją, jakością i zakupami",
        "Reguły dla przypomnień i kontroli cyklicznych",
        "Rejestr zdarzeń dla zmian operacyjnych",
      ],
    },
    {
      name: "Usługi profesjonalne i biura rachunkowe",
      lead: "Kancelarie, biura rachunkowe i firmy doradcze pracują na sprawach klientów z terminem. Każdy klient ma trochę inny tryb współpracy, a przekroczony termin kosztuje pieniądze i zaufanie.",
      uses: [
        "Sprawy klientów z etapami i osobą odpowiedzialną",
        "Obieg umów i dokumentów z wersjami",
        "Czynności cykliczne: rozliczenia, sprawozdania, odnowienia",
        "Rozliczenie pracy na kliencie albo sprawie",
      ],
      built: [
        "Moduły dla klientów, spraw i dokumentów",
        "Reguły przypominające o terminach",
        "Uprawnienia ograniczone do klientów zespołu",
        "Szablony pism wypełniane danymi sprawy",
      ],
    },
    {
      name: "Centra usług wspólnych i grupy spółek",
      lead: "Jeden zespół obsługuje faktury, umowy i akceptacje kilku spółek. Każda ma swoje dane i swoje zasady, a zarząd grupy chce widzieć całość.",
      uses: [
        "Obieg faktur i umów dla wielu spółek",
        "Akceptacje zależne od spółki i kwoty",
        "Wspólne procedury przy osobnych danych",
        "Zestawienia dla zarządu grupy",
      ],
      built: [
        "Spółki w jednej organizacji, z odseparowanymi danymi",
        "Wspólna konfiguracja procesów",
        "Role ograniczone do spółki albo działu",
        "Raporty z drążeniem do spraw każdej spółki",
      ],
    },
    {
      name: "Budownictwo i nieruchomości",
      lead: "Każdy projekt ma własną strukturę, wielu kontrahentów i długi obieg dokumentów, a mimo to wymaga kontroli między lokalizacjami.",
      uses: [
        "Sprawy na budowie, inspekcje i odbiory",
        "Kontrahenci, dokumenty i zmiany statusów",
        "Raporty między projektami i lokalizacjami",
        "Właściciel i następny krok w długich procesach",
      ],
      built: [
        "Moduły dla projektów, lokalizacji i kontrahentów",
        "Powiązania między partnerami, plikami i akceptacjami",
        "Uprawnienia dla zespołów i spółek",
        "Reguły dla brakujących dokumentów",
      ],
    },
    {
      name: "Serwis i utrzymanie",
      lead: "Praca serwisowa zależy od urządzeń, lokalizacji, techników, części i terminów. Kiedy te informacje leżą w osobnych narzędziach, trudno powiedzieć, co czeka, a co jest gotowe.",
      uses: [
        "Sprawy serwisowe od przyjęcia do zamknięcia",
        "Urządzenia, checklisty, zdjęcia i notatki",
        "Przeglądy cykliczne i gotowość sprzętu",
        "Wspólny obraz pracy dla terenu i biura",
      ],
      built: [
        "Moduły dla urządzeń, przypisań i checklist",
        "Etapy od przyjęcia po zamknięcie",
        "Reguły cykliczne dla przeglądów",
        "Asystent AI do podsumowania historii sprawy",
      ],
    },
  ],
});

export const implementation = polish({
  hero: {
    title: ["Zaczynamy od jednego procesu,", "nie od całej firmy."] as [string, string],
    lead: "Najpierw poznajemy, jak naprawdę pracują zespoły. Potem uruchamiamy gotowe moduły i budujemy własne pod konkretne procesy. Po starcie szkolimy administratorów, a system przejmujecie w całości.",
  },
  stages: [
    {
      name: "Rozmowa diagnostyczna",
      text: "Poznajemy jeden proces: kto w nim pracuje, gdzie sprawa czeka i gdzie dane są przepisywane ręcznie. Rozmawiacie z twórcami systemu.",
      result: "Wiecie, czy Opero ma sens w tym procesie.",
    },
    {
      name: "Demo na Waszym procesie",
      text: "Budujemy pokaz na Waszym procesie, z Waszymi nazwami etapów i pól. Oglądacie coś, co już działa, a nie prezentację.",
      result: "Zespół widzi swój proces w systemie.",
    },
    {
      name: "Uruchomienie modułów",
      text: "Włączamy gotowe aplikacje i budujemy własne moduły dla jednego obszaru. Proces sprawdza się w codziennej pracy, zanim obejmie kolejne działy.",
      result: "Pierwszy obszar działa produkcyjnie.",
    },
    {
      name: "Szkolenie administratorów",
      text: "Uczymy Waszych administratorów zmieniać pola, etapy i reguły samodzielnie, w tym samym miejscu, w którym moduł powstał.",
      result: "Zmiana nie wymaga dostawcy.",
    },
    {
      name: "System jest Wasz",
      text: "Utrzymujemy i rozwijamy Opero, a organizacja przejmuje system w całości: konfigurację, dane i wiedzę o tym, jak jest zbudowany.",
      result: "Kolejne obszary dokładacie we własnym tempie.",
    },
  ],
  principles: [
    { title: "Rozmawiacie z twórcami systemu", text: "Na pytanie techniczne odpowiedź pada w tej samej rozmowie, a nie po przekazaniu do działu produktu." },
    { title: "Pierwszy krok jest mały", text: "Zaczynamy od jednego obszaru z jasnymi kryteriami. Ryzyko jest policzalne, zanim decyzja obejmie całą firmę." },
    { title: "Demo przed umową", text: "Zanim padnie słowo o umowie, widzicie swój proces w systemie, z własnymi nazwami." },
    { title: "Wiedza zostaje u Was", text: "Administratorzy po szkoleniu zmieniają system sami. Nie sprzedajemy godzin na każdą poprawkę." },
  ],
  limits: {
    title: "Czego Opero nie robi",
    text: "Opero nie jest systemem ERP ani księgowym. Prowadzi procesy, dokumenty i dane wokół nich, a z ERP wymienia dane przez API. Mówimy o tym na pierwszej rozmowie, żeby nie było o tym mowy na ostatniej.",
  },
  faq: [
    { q: "Ile trwa uruchomienie pierwszego obszaru?", a: "Zwykle tygodnie, nie kwartały: zaczynamy od jednego procesu i rozwijamy go po sprawdzeniu w praktyce. Dokładny plan powstaje po rozmowie diagnostycznej." },
    { q: "Ile kosztuje Opero?", a: "Cennik przedstawiamy na zapytanie, po rozmowie diagnostycznej, kiedy wiadomo, jakie obszary obejmie system." },
    { q: "Czy potrzebujemy programistów?", a: "Nie. Moduły, etapy i reguły zmienia administrator w konfiguracji. Skrypty i zapytania SQL są dostępne tam, gdzie konfiguracja przestaje wystarczać." },
    { q: "Kto utrzymuje system po wdrożeniu?", a: "Utrzymujemy i rozwijamy Opero, a Wasi administratorzy zmieniają konfigurację samodzielnie." },
    { q: "Czy Opero zastąpi nasz ERP?", a: "Nie. Opero pracuje obok ERP: prowadzi procesy i dokumenty, a dane wymienia przez API." },
  ],
});

export const about = polish({
  hero: {
    title: ["Jesteśmy zespołem,", "który buduje Opero."] as [string, string],
    lead: "Przez lata wdrażaliśmy systemy obiegu dokumentów, procesów, ERP i raportowania. Poznaliśmy ich granice od środka. Opero zaczyna się tam, gdzie kończy się gotowe oprogramowanie.",
  },
  origin: {
    title: ["Widzieliśmy, gdzie", "zatrzymują się gotowe systemy."] as [string, string],
    paragraphs: [
      "Jeden świetnie prowadzi dokument przez akceptacje, ale nie pozwala opisać własnych danych. Drugi pozwala zbudować dowolny formularz, ale nie ma pod nim prawdziwych procesów. Trzeci ma wszystko, tylko każda zmiana oznacza projekt, wycenę i kilka tygodni czekania.",
      "Za każdym razem granica przebiegała w tym samym miejscu: system był gotowy, a firma nie przestawała się zmieniać. W pewnym momencie przestaliśmy szukać systemu, który to udźwignie, i zaczęliśmy go budować.",
    ],
  },
  lessons: [
    { label: "Procesy", text: "Proces musi mieć etapy, przejścia i odpowiedzialność na każdym kroku. Bez tego akceptacje wracają do maili." },
    { label: "Dokumenty", text: "Dokument to nie plik, tylko sprawa z własnymi danymi, obiegiem i historią." },
    { label: "Pliki", text: "Wersje i kontrola dostępu do plików są warunkiem zaufania do systemu." },
    { label: "Automatyzacje", text: "Reguły i skrypty muszą być pod ręką wtedy, gdy konfiguracja przestaje wystarczać, ale nie wcześniej." },
    { label: "Konfiguracja", text: "Jeśli kluczowej zmiany nie da się zrobić bez programisty, system zamarza w wersji z dnia wdrożenia." },
    { label: "ERP", text: "Dane muszą być spójne, ale sztywny model danych najczęściej blokuje rozwój." },
    { label: "Raporty", text: "Raport jest wart tyle, ile dane pod nim, więc porządek robi się na poziomie procesu." },
  ],
  mission: {
    label: "Misja",
    text: "Dajemy firmom system, który dopasowuje się do nich, a nie odwrotnie.",
    note: "Naszą miarą jest to, ile organizacja potrafi zrobić w Opero sama, a nie ile funkcji zdołaliśmy wymienić w ofercie.",
  },
  beliefs: [
    { title: "System ma rosnąć razem z firmą.", text: "Firma, która wdraża system, i ta sama firma trzy lata później to dwie różne organizacje. Ta druga nie powinna zaczynać od nowa." },
    { title: "Firma nie dopasowuje się do oprogramowania.", text: "Obiekty, pola, formularze i procesy definiuje organizacja, więc system mówi jej językiem." },
    { title: "Zmiana nie wymaga programisty.", text: "Nowy etap, pole czy reguła to konfiguracja, nie wdrożenie. System nadąża za firmą w tygodniach." },
    { title: "Jeden system zamiast pięciu narzędzi.", text: "Jedna historia sprawy, jedne uprawnienia i jedna prawda o danych." },
    { title: "Swoboda bez chaosu.", text: "Pod konfiguracją są uprawnienia, historia zmian i wersje. Można zbudować dużo i nie zgubić tego, co się wydarzyło." },
    { title: "Wiedza wdrożeniowa wraca do produktu.", text: "Każdy schemat, który sprawdził się u klienta, staje się wzorcem dla następnych." },
  ],
  sign: "Materiały podpisuje Zespół KodaSoft. Opero tworzy KodaSoft.",
});

export const contact = polish({
  hero: {
    title: ["Pokaż nam,", "jak działa Wasza firma."] as [string, string],
    lead: "Opowiedzcie, gdzie gotowe narzędzia przestają pasować: umowy, akceptacje, dokumenty, raporty albo powtarzalne wyjątki. Wrócimy z odpowiedzią, czy Opero to dobry kierunek.",
  },
  topics: ["Pokaz Opero", "Konkretny proces w firmie", "Gotowe aplikacje i KSeF", "Współpraca partnerska"],
  next: [
    { title: "Wiadomość", text: "Piszecie, jaki proces chcecie uporządkować." },
    { title: "Rozmowa diagnostyczna", text: "Rozmawiacie z twórcami systemu o jednym procesie." },
    { title: "Demo na Waszym procesie", text: "Oglądacie swój proces w Opero, z własnymi nazwami." },
  ],
  proposalNotice: "To propozycja strony. Formularz nie wysyła danych.",
});
