import type { IntegrationsPageContent } from "@/content/feature-stories/integrations.types";
import type { FeaturePageContent } from "@/content/types";

export const integrationsFeature: FeaturePageContent = {
  seo: {
    title: "Integracje i zgodność: KSeF, API, webhooki",
    description:
      "KSeF, kursy NBP i dane firm wprost w procesie. API, webhooki i gotowe integracje łączą Opero z narzędziami, których już używasz.",
  },
  navLabel: "Integracje i zgodność",
  navDescription: "Zgodność i połączone narzędzia",
  hero: {
    title: "Integracje i zgodność - Opero częścią Twojego ekosystemu",
    description:
      "KSeF, kursy NBP i wyszukiwanie danych firm działają wprost z systemu, a otwarte API łączy Opero z resztą narzędzi firmy.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    paragraph:
      "Opero obsługuje polskie e-fakturowanie i wymienia dane ze światem zewnętrznym bez osobnego oprogramowania.",
  },
  demo: {
    kind: "integrations",
    source: { name: "KSeF", subtitle: "Krajowy System e-Faktur" },
    document: { number: "FA/2026/8841", kind: "XML e-faktury" },
    recordTitle: "Faktura kosztowa",
    fields: [
      { label: "Numer", value: "FZ/2026/0143" },
      { label: "Kontrahent", value: "Hotel Panorama Sp. z o.o." },
      { label: "Kwota", value: "24 800,00 PLN" },
    ],
    apis: [
      { endpoint: "POST /api/records", direction: "system zewnętrzny → Opero" },
      { endpoint: "webhook: status.changed", direction: "Opero → system zewnętrzny" },
    ],
    captions: { arrives: "Dokument z KSeF <b>staje się rekordem</b>", fields: "Pola wypełniają się <b>bez przepisywania</b>", api: "API działa <b>w obie strony</b>" },
  },
  blocks: {
    title: "Wymogi i wymiana danych obsłużone w systemie.",
    items: [
      {
        title: "KSeF",
        description:
          "Wysyłka i odbiór faktur ustrukturyzowanych zgodnie z obowiązkowym e-fakturowaniem w Polsce.",
      },
      {
        title: "Kursy walut NBP",
        description:
          "Automatyczne pobieranie kursów (Tabela A) do przeliczeń wielowalutowych, z poprawną obsługą dni wolnych.",
      },
      {
        title: "Dane firm",
        description: "Dane firmy po NIP-ie lub zagranicznym numerze VAT, z REGON, CEIDG i usługi rejestrowej korzystającej w UE z VIES.",
      },
      {
        title: "Otwarte API",
        description:
          "Łączysz Opero z systemami firmy dwukierunkowo, robiąc z platformy element ekosystemu, a nie kolejną wyspę.",
      },
    ],
  },
  finalCta: {
    title: "Połącz Opero ze swoimi systemami.",
    description: "Sprawdź, jak zgodność i integracje działają bez dodatkowego oprogramowania.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    title: "Zgodność i integracje bez dodatkowych aplikacji.",
    paragraphs: [
      "Opero obsługuje polskie e-fakturowanie i wymienia dane ze światem zewnętrznym bez osobnego oprogramowania. Integracja z KSeF pozwala wysyłać i odbierać faktury ustrukturyzowane zgodnie z obowiązkowym e-fakturowaniem, bez wychodzenia do zewnętrznych portali.",
      "Codzienne operacje wspierają kolejne integracje. Kursy walut pobierane automatycznie z API NBP (Tabela A) zasilają przeliczenia wielowalutowe, z poprawną obsługą dni wolnych. Wyszukiwanie firmy pobiera dane kontrahenta z REGON i CEIDG, a dla zagranicznych numerów VAT z usługi rejestrowej korzystającej w UE z VIES, co ogranicza ręczne sprawdzanie.",
      "Otwarte API łączy Opero z pozostałymi narzędziami firmy w obie strony. Dzięki temu platforma staje się częścią Twojego ekosystemu, a nie kolejną odizolowaną wyspą danych. Zebranie zgodności i integracji w samej platformie skraca drogę i upraszcza utrzymanie.",
    ],
  },
  faq: {
    title: "Najczęściej zadawane pytania.",
    items: [
      { question: "Czy Opero obsługuje KSeF?", answer: "Tak. Opero wysyła faktury sprzedaży do KSeF i pobiera z niego faktury zakupu w formacie FA(3). Dołącza UPO, wystawia offline z KOD I i KOD II, obsługuje też korekty, faktury zaliczkowe i rozliczeniowe. Uwierzytelnia się certyfikatami KSeF, a nie tokenami, i może odnawiać je automatycznie." },
      { question: "Jakich faktur Opero nie wyśle do KSeF?", answer: "Faktur uproszczonych, sprzedaży w procedurze marży, stawek 0% dla WDT i eksportu, nowych środków transportu, załączników do faktur i samofakturowania. Obsługiwane stawki to 23, 22, 8, 7, 5, 0 krajowe, zw, np I, np II i oo. Stawka spoza tej listy jest odrzucana, zanim cokolwiek zostanie wysłane." },
      { question: "Co jeśli KSeF nie działa, a nie mamy certyfikatu Offline?", answer: "Opero ponawia próbę pięć razy przez około 75 sekund. Bez ważnego certyfikatu Offline nie może wystawić faktury offline, więc wysyłka kończy się statusem błędu z widoczną przyczyną, a gdy KSeF wróci, wysyłasz ją ponownie. Pobieranie faktur przychodzących po prostu rusza od miejsca, w którym skończył ostatni udany przebieg." },
      { question: "Czy musimy wymienić system księgowy?", answer: "Nie. Opero nie prowadzi księgi głównej, więc Twój system księgowy albo biuro rachunkowe działa dalej jak dotąd. Opero prowadzi proces wokół księgowości, a to, czego potrzebuje drugi system, przekazuje przez API, wywołanie webhooka z reguły albo zapisane zapytanie." },
      { question: "Czy jest gotowy konektor do naszego systemu księgowego lub ERP?", answer: "Gotowego konektora do takich produktów nie ma. Gotowe integracje to KSeF, Google Maps, SMSPLANET, OpenAI, Anthropic i Google Gemini, a do tego synchronizacja skrzynek Google Workspace, Microsoft 365 i IMAP/SMTP. Pozostałe systemy łączy się przez API i webhooki, a takie połączenie musi ktoś zbudować: u Ciebie albo u nas." },
      { question: "Czy inny system może powiadomić Opero, że coś się wydarzyło?", answer: "Tak, wywołując API: może utworzyć lub zmienić rekord albo uruchomić regułę z własnymi danymi wejściowymi. Usługa, która potrafi wysłać tylko webhook w swoim stałym formacie, potrzebuje po drodze małego adaptera." },
      { question: "Czy Opero połączy się z systemem w naszej sieci wewnętrznej?", answer: "Krok Wywołaj webhook łączy się z publicznymi adresami na portach 80 i 443, a prywatne zakresy adresów są zablokowane. System niedostępny z internetu może sam wywoływać API Opero albo stanąć za bramą, którą udostępnisz." },
      { question: "Co sprawdza wyszukiwanie firmy? Czy obejmuje białą listę podatników VAT?", answer: "Potwierdza, że firma jest w rejestrze, i pobiera jej dane: z REGON i CEIDG w Polsce, a dla zagranicznych numerów VAT z usługi, która w UE korzysta z VIES i obejmuje też GB, CH, LI, NO i AU. Nie sprawdza rachunków bankowych na białej liście." },
      { question: "Mamy kilka spółek. Jak to działa?", answer: "Dane dostępowe do KSeF można ustawić dla całej organizacji albo osobno dla każdej spółki, więc każdy NIP może mieć własny certyfikat. Token API zawsze należy do jednej spółki i widzi tylko to, co jest dla niej udostępnione." },
      { question: "Czy potrzebujemy programisty?", answer: "Do gotowych integracji nie: dane dostępowe wpisujesz w formularzu, weryfikujesz połączenie, a reguły budujesz wizualnie. Podłączenie własnego systemu przez API wymaga kogoś, kto po drugiej stronie napisze trochę kodu." },
    ],
  },
  related: {
    title: "Zobacz też",
    items: ["security", "documents", "reports"],
  },
};

export const integrationsPage: IntegrationsPageContent = {
  hero: {
    title: "KSeF wysyłasz i odbierasz w Opero. Księgowość zostaje.",
    description:
      "Faktury sprzedaży idą do KSeF jako FA(3), a numer KSeF i UPO wracają na fakturę. Faktury zakupu stają się fakturami kosztowymi przez regułę, którą możesz przeczytać. Opero nie prowadzi księgi głównej, więc księgowość działa dalej, a reguła taka jak ta informuje ERP o zatwierdzonym zamówieniu.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Poznaj Opero",
    image: {
      src: "/opero/integrations/rule-webhook-hero.webp",
      alt: "Kreator reguł Opero z regułą uruchamianą przejściem w obiegu, która tworzy zamówienie w ERP wywołaniem webhooka, powiadamia zespół, a przy błędzie alarmuje księgowość",
      width: 2111,
      height: 1316,
    },
  },
  keep: {
    title: "Co łączy się od razu, a co ktoś musi zbudować.",
    description:
      "Gotowe integracje to KSeF, Google Maps, SMSPLANET, OpenAI, Anthropic i Google Gemini, a do tego synchronizacja skrzynek. Do systemów księgowych i ERP nie ma gotowych konektorów: rozmawiają z Opero przez API i krok reguły Wywołaj webhook, a takie połączenie ktoś musi napisać.",
    columns: { system: "Czego już używasz", connection: "Jak się łączy", result: "Co dostajesz i gdzie jest granica" },
    rows: [
      { system: "Poczta", examples: "Google Workspace, Microsoft 365, dowolny IMAP/SMTP", connection: "Synchronizacja skrzynki", result: "Wiadomości synchronizują się z Opero i zostają w Twojej skrzynce. Można powiązać je z rekordem, mogą też uruchomić regułę albo otworzyć zgłoszenie w helpdesku." },
      { system: "Księgowość lub ERP", examples: "To, na czym pracujecie dziś", connection: "API i Wywołaj webhook", result: "Reguła wysyła dane do Twojego systemu, na przykład po zatwierdzeniu zamówienia. On odpisuje przez API albo czyta przez zapisane zapytanie. Gotowego konektora nie ma, więc to połączenie trzeba napisać: u Ciebie albo u nas." },
      { system: "Strona internetowa", examples: "Kontakt, zamówienia, formularze zgłoszeniowe", connection: "API lub formularz publiczny", result: "Zapytanie staje się rekordem, na którym mogą działać reguły. Jedno zastrzeżenie: ponowione utworzenie przez API daje drugi rekord, więc strona nie powinna ponawiać na ślepo." },
      { system: "Kalendarze", examples: "Każda aplikacja, która subskrybuje ICS", connection: "Kanał ICS", result: "Ludzie widzą wydarzenia z Opero w kalendarzu, którego już używają. Subskrypcja tylko czyta, więc zmiany nadal wprowadza się w Opero." },
      { system: "Raporty i skrypty", examples: "Narzędzia BI, arkusze zasilane skryptem, własny kod", connection: "Zapisane zapytania przez API", result: "Token z uprawnieniem do wykonania uruchamia zapisane zapytanie i dostaje wiersze. Nikt nie potrzebuje loginu do bazy." },
      { system: "Mapy", examples: "Google Maps z Twoim kluczem", connection: "Integracja", result: "Kroki reguł do geokodowania, sprawdzania adresów, liczenia odległości i stref czasowych. Koszt użycia idzie na Twój klucz Google." },
      { system: "SMS-y", examples: "SMSPLANET", connection: "Integracja", result: "Krok reguły wysyła SMS z Twojego konta SMSPLANET, a raporty doręczenia wracają do Opero." },
      { system: "Modele AI", examples: "OpenAI, Anthropic, Google Gemini albo agent MCP", connection: "Twój własny klucz", result: "Krok z promptem może przeczytać plik i zwrócić pola do rekordu. Agent MCP, na przykład Claude, loguje się jako użytkownik i ma jego uprawnienia." },
    ],
    footnote: "Nie ma tu Twojego systemu? Jeśli potrafi wywoływać HTTPS albo przyjmować takie połączenia pod publicznym adresem na porcie 80 lub 443, zwykle da się go podłączyć. Przynieś go na prezentację, a powiemy, co będzie wymagać pracy.",
  },
  demo: {
    title: "Faktura z KSeF staje się fakturą kosztową, odczytaną z XML-a.",
    description: "Numer, dostawca, daty, kwoty i pozycje pochodzą z pliku FA(3), więc nikt ich nie przepisuje. Od tego rekordu Twoje systemy mogą wywoływać Opero, a Opero może wywoływać je. Dane na animacji są przykładowe.",
    content: {
      source: { name: "KSeF", subtitle: "Krajowy System e-Faktur" },
      document: { number: "FA/2026/8841", kind: "XML e-faktury" },
      recordTitle: "Faktura kosztowa",
      fields: [
        { label: "Numer", value: "FK/2026/0143" },
        { label: "Dostawca", value: "Hotel Panorama Sp. z o.o." },
        { label: "Kwota", value: "24 800,00 PLN" },
      ],
      apis: [
        { endpoint: "POST /api/v1/.../records", direction: "Twój system → Opero" },
        { endpoint: "Krok reguły: Wywołaj webhook", direction: "Opero → Twój system" },
      ],
      captions: { arrives: "Dokument z KSeF <b>staje się rekordem</b>", fields: "Pola są odczytywane <b>z XML-a FA(3)</b>", api: "Twoje systemy wołają Opero, <b>Opero woła je</b>" },
    },
  },
  compliance: {
    title: "Droga faktury KSeF, w jedną i w drugą stronę.",
    description: "Przy wysyłce przycisk i krok reguły korzystają z jednego sprawdzenia gotowości, więc nikt nie dostanie propozycji wysyłki, która zostanie odrzucona. Przy odbiorze pobieranie tylko zapisuje fakturę, a dalszy ciąg to reguła, którą sam układasz.",
    lanes: [
      {
        title: "Faktura sprzedaży wychodzi",
        stages: [
          { title: "Sprawdzenie, z listą wszystkich problemów naraz", detail: "Brak adresu sprzedawcy, sumy rozjechane o ponad 0,02, stawka zw bez podstawy zwolnienia. Potem XML przechodzi walidację względem schemy FA(3)." },
          { title: "Zamrożenie przed wysyłką", detail: "Zapisujemy dokładny XML i jego skrót SHA-256. Ponowienia używają tych samych bajtów i nie czytają faktury od nowa." },
          { title: "Wysyłka przez człowieka albo regułę", detail: "Wyślij do KSeF wymaga tego samego uprawnienia co edycja faktury. Krok reguły kolejkuje wysyłkę i wraca od razu, bez czekania na KSeF." },
          { title: "Przyjęcie i blokada", detail: "Najpierw UPO trafia na fakturę, dopiero potem uruchamia się wyzwalacz przyjęcia, więc kolejna reguła może na tym polegać. Faktury nie da się już edytować." },
        ],
      },
      {
        title: "Faktura od dostawcy przychodzi",
        stages: [
          { title: "Pobieranie co 15 minut lub rzadziej", detail: "Pobieranie jest wyłączone, dopóki go nie włączysz. Domyślnie co 30 minut, a dolna granica 15 minut wynika z limitów eksportu KSeF. Nieudany przebieg nie przesuwa znacznika, więc następny niczego nie pominie." },
          { title: "Zapis i wyzwalacz", detail: "NIP sprzedawcy, numer, kwota brutto i rodzaj faktury trafiają do reguły, która może rozgałęzić się po kwocie albo skierować korekty gdzie indziej." },
          { title: "Faktura kosztowa", detail: "Krok może dodać brakującego kontrahenta i odmawia utworzenia drugiej faktury kosztowej z tym samym numerem KSeF. KOR staje się korektą powiązaną z oryginałem." },
          { title: "PDF, a potem akceptacja", detail: "Krok reguły generuje PDF z kodem QR do weryfikacji i go dołącza. Dalej faktura idzie Waszym obiegiem kosztowym, jeśli go ustawiliście." },
        ],
      },
    ],
  },
  ksef: {
    title: "Co się dzieje, gdy KSeF przestaje odpowiadać.",
    description: "Przykład: faktura z datą wtorek 10 listopada 2026, tryb automatyczny, wgrany certyfikat Offline. Opero próbuje pięć razy przez około 75 sekund, po czym wystawia ją offline: ten sam zamrożony XML, z kodami KOD I i KOD II. 11 listopada to święto, więc termin dosłania mija w czwartek 12 listopada. Faktury przychodzące idą przez regułę taką jak na ekranie, z osobną ścieżką błędu przy każdym kroku.",
    image: {
      src: "/opero/ksef/invoice-automation-rule.webp",
      alt: "Reguła Opero, która pobiera fakturę z KSeF, tworzy fakturę kosztową, generuje PDF i go dołącza, z osobną ścieżką błędu dla każdego kroku",
      width: 1869,
      height: 1179,
    },
    cases: [
      { title: "Brak certyfikatu Offline", description: "Tryb automatyczny przełącza się tylko wtedy, gdy KSeF nie ma jeszcze żadnej referencji, a certyfikat Offline jest ważny. Bez niego wysyłka kończy się statusem błędu z widoczną przyczyną i wysyłasz ją ponownie." },
      { title: "Termin dosłania", description: "Opero ponawia dosłanie tych samych bajtów mniej więcej co minutę, aż KSeF przyjmie fakturę albo wycofasz ją, podając powód. Jeśli 13 listopada nadal nie dotarła, raz uruchamia się wyzwalacz, a reguła decyduje, kto się o tym dowie." },
      { title: "Faktura została odrzucona", description: "Kod i treść błędu z KSeF widać przy wysyłce, a wyzwalacz może kogoś powiadomić. Odrzucenie nie blokuje faktury, więc poprawiasz ją i wysyłasz ponownie. Faktura offline zostaje zamrożona i wraca jako korekta techniczna." },
      { title: "Wysłana, bez werdyktu", description: "Referencje zapisujemy przed odpytywaniem, więc ponowienie pyta o wynik i nigdy nie wysyła drugiej kopii. Po 30 minutach bezruchu Opero sprawdza ponownie, maksymalnie trzy razy. Po godzinie bezruchu pojawia się na liście zablokowanych wysyłek, z opcją Sprawdź ponownie." },
      { title: "Ta sama faktura dwa razy", description: "Druga wysyłka jest odrzucana, dopóki pierwsza trwa. Jeśli po awarii i tak powstanie duplikat, KSeF odpowiada kodem 440 z numerem i sesją oryginału. Opero zapisuje fakturę jako przyjętą i pobiera UPO z tamtej sesji." },
      { title: "Przyjęta, ale błędna", description: "Przyjętej faktury nie da się edytować ani usunąć. Korekta KOR powołuje się na numer KSeF oryginału i ma pozycje przed i po. Błędny NIP nabywcy jest odrzucany: korygujesz do zera i wystawiasz nową fakturę." },
      { title: "Certyfikat wygasa", description: "Panel faktury ostrzega na 30 dni przed końcem ważności. Automatyczne odnawianie, domyślnie włączone, działa w tym samym oknie dla certyfikatów uwierzytelniających i Offline. Tokenów KSeF nie obsługujemy: tylko certyfikaty." },
      { title: "Próba awarii", description: "Przełącznik Symuluj awarię KSeF sprawia, że wysyłka, pobieranie i zadania certyfikatów zawodzą jak przy prawdziwej awarii sieci. Sprawdź na środowisku TEST wystawianie offline i swoje reguły. Po wyłączeniu zamrożone faktury zostaną dosłane." },
    ],
  },
  checks: {
    title: "Dane po NIP-ie i kursy NBP, także przy awarii źródła.",
    description: "W obu przypadkach wiadomo, skąd pochodzi wartość. Gdy rejestr albo NBP nie odpowie, Opero niczego nie zgaduje.",
    sampleLabel: "Dane przykładowe",
    items: [
      {
        title: "Dane firmy po NIP-ie",
        description: "Opero pyta REGON o nazwę, formę prawną i adres, a przy jednoosobowych działalnościach CEIDG pomaga z adresem. Zagraniczne numery VAT sprawdza usługa rejestrowa, która w UE korzysta z VIES i obejmuje też GB, CH, LI, NO i AU. Krok reguły ma trzy wyjścia: znaleziono, nie znaleziono (błędny numer, brak w rejestrze, firma zamknięta) i błąd. Nie sprawdza rachunków na białej liście.",
        rows: [
          { label: "NIP", value: "000 000 00 00" },
          { label: "Nazwa", value: "Przykład Sp. z o.o." },
          { label: "Adres", value: "ul. Przykładowa 1, 00-001 Warszawa" },
          { label: "Źródło", value: "REGON" },
        ],
      },
      {
        title: "Kursy NBP na fakturach walutowych",
        description: "Dla daty w poniedziałek 16 listopada Opero bierze ostatnią tabelę sprzed niej: z piątku 13 listopada. Szuka do 31 dni wstecz, w tabeli A, a potem B, i przy kursie zapisuje numer oraz datę tabeli. Gdy NBP trzy razy nie odpowie, kurs ma status niedostępnego i możesz wpisać go ręcznie, podając powód. Automatycznie działa tylko metoda NBP, w polskich spółkach z walutą bazową PLN.",
        rows: [
          { label: "Waluta", value: "EUR" },
          { label: "Właściwa data", value: "16.11.2026" },
          { label: "Tabela", value: "A, z 13.11.2026" },
          { label: "Kurs", value: "4,2500 PLN" },
        ],
      },
    ],
  },
  scenarios: {
    title: "Sześć układów, które można zbudować z tych elementów.",
    description: "To przykłady ze zmyślonymi liczbami, a nie historie klientów. Wyzwalacze i kroki są prawdziwe. Wasze limity i ścieżki wyglądałyby inaczej.",
    items: [
      {
        team: "Finanse",
        industry: "Każdy płatnik VAT",
        title: "Faktury od dostawców powyżej 10 000 PLN trafiają do kierownika.",
        steps: ["Faktura z KSeF: 12 300 PLN brutto", "Warunek: powyżej 10 000 PLN", "Faktura kosztowa gotowa, kierownik powiadomiony"],
        outcome: "Jeśli reguła uruchomi się dwa razy dla jednego numeru KSeF, druga faktura kosztowa zostanie odrzucona i pójdzie ścieżką błędu.",
      },
      {
        team: "Sprzedaż",
        industry: "Hurt B2B",
        title: "Zapytanie ze strony z NIP-em przychodzi z danymi firmy.",
        steps: ["Strona wysyła formularz do API", "Wyszukiwanie firmy sprawdza NIP", "Handlowiec dostaje powiadomienie"],
        outcome: "Zamknięta firma albo nieznany NIP idzie wyjściem nie znaleziono, więc handlowiec może dostać prośbę o sprawdzenie przed telefonem.",
      },
      {
        team: "Serwis terenowy",
        industry: "Firma instalacyjna",
        title: "Zlecenie pokazuje odległość od bazy, a klient dostaje SMS.",
        steps: ["Google Maps sprawdza adres", "Krok liczy odległość od bazy", "SMSPLANET wysyła potwierdzenie wizyty"],
        outcome: "Raport doręczenia wraca do Opero, więc widać, czy SMS dotarł.",
      },
      {
        team: "Produkcja",
        industry: "Producent z ERP",
        title: "Reguła zakłada w ERP każde zatwierdzone zamówienie.",
        steps: ["Obieg przenosi zamówienie do etapu Zatwierdzone", "Wywołaj webhook wysyła je do ERP", "Zespół powiadomiony, odpowiedź ERP zapisana"],
        outcome: "Brak odpowiedzi przez 30 sekund albo status inny niż 2xx kieruje regułę na ścieżkę błędu, która alarmuje księgowość.",
      },
      {
        team: "HR",
        industry: "Handel z wieloma placówkami",
        title: "Przypomnienie na 30 dni przed końcem badań lekarskich.",
        steps: ["Przypomnienie o dacie 30 dni wcześniej", "Pracownik dostaje SMS", "Kierownik dostaje powiadomienie"],
        outcome: "Przypomnienie czyta pole daty z karty pracownika, więc nikt nie prowadzi osobnego arkusza terminów.",
      },
      {
        team: "Back office",
        industry: "Zarządzanie nieruchomościami",
        title: "PDF umowy podpowiada wartości pól.",
        steps: ["Ktoś dołącza plik", "Krok z promptem i Twoim kluczem go czyta", "Reguła zapisuje pola na rekordzie"],
        outcome: "Model może źle odczytać umowę, więc ktoś powinien sprawdzić zapisane wartości.",
      },
    ],
  },
  developers: {
    title: "REST API do danych spółki i wywołania wychodzące z reguł.",
    description: "Wersjonowane pod /api/v1, z OpenAPI po polsku i angielsku, do rekordów, kontrahentów, plików, komentarzy, obiegów, zgłoszeń, poczty, zapisanych zapytań i reguł. Nie służy do zmiany konfiguracji: formularze, reguły i obiegi tworzy się w aplikacji albo przez MCP.",
    bullets: [
      "Token należy do jednej spółki. Podanie innej spółki w ścieżce daje 403, odwołany lub wygasły token 401, a zasób nieudostępniony tej spółce 404.",
      "Tworzenie rekordu nie jest idempotentne: ponowione żądanie tworzy drugi rekord, więc sprawdź, zanim wyślesz je znowu.",
      "POST /api/v1/rules/:id/execute uruchamia regułę ręczną z Twoimi danymi. Wymaga uprawnienia api.company.rules.execute.",
      "Wywołaj webhook łączy się tylko z publicznymi adresami na portach 80 i 443, z limitem 30 sekund, treścią do 64 KB i odpowiedzią do 1 MB. Przekierowania nie są obsługiwane.",
      "Agenci AI korzystają z osobnego serwera MCP: logowanie OAuth jako użytkownik, z jego uprawnieniami.",
    ],
    inbound: {
      label: "Twój system wywołuje Opero",
      lines: [
        "POST /api/v1/custom-modules/crm/objects/deals/records",
        "Authorization: Bearer <token API spółki>",
        "",
        '{ "values": { "name": "Zapytanie ze strony" } }',
      ],
    },
    outbound: {
      label: "Opero wywołuje Twój system (krok reguły: Wywołaj webhook)",
      lines: [
        "POST https://erp.example.com/orders",
        "",
        '{ "order": "{{ trigger.data.number }}", "status": "approved" }',
      ],
    },
  },
  control: {
    title: "Co możesz sprawdzić przy każdym tokenie i uruchomieniu reguły.",
    description: "Gdy połączenie zawodzi, padają dwa pytania: co wolno było temu tokenowi i co naprawdę odpowiedział drugi system? Na oba odpowiada osobny ekran.",
    shots: [
      {
        title: "Token ograniczony do tego, czego potrzebuje",
        description: "Ten przykładowy token może czytać, tworzyć i zmieniać rekordy niestandardowe spółki i nic więcej. Wygasa po 30 dniach albo nigdy, jeśli zaznaczysz tę opcję. Po odwołaniu dostaje 401, a zmiany z API są przypisane do tokenu w historii rekordu.",
        image: {
          src: "/opero/integrations/api-tokens.webp",
          alt: "Okno tworzenia tokenu w Opero: token o nazwie Website enquiries, wygasający po 30 dniach, z zaznaczonym odczytem, tworzeniem i zmianą rekordów niestandardowych spółki",
          width: 1240,
          height: 1000,
        },
      },
      {
        title: "Odtworzenie każdego uruchomienia reguły",
        description: "Odtworzenie pokazuje drogę, jaką przeszło uruchomienie, i co opublikował każdy krok. Tutaj wywołanie ERP zwróciło status 200, z nagłówkami i treścią pod kluczem erp. Możesz też otworzyć kontekst, który krok widział w chwili działania.",
        image: {
          src: "/opero/integrations/rule-run-journal.webp",
          alt: "Odtworzenie uruchomienia reguły w Opero z zaznaczonym krokiem tworzenia zamówienia w ERP oraz opublikowanym statusem, nagłówkami i treścią",
          width: 2000,
          height: 1400,
        },
      },
    ],
    facts: [
      "Dane dostępowe można tylko zapisać, a przechowujemy je zaszyfrowane AES-256-GCM. Przy KSeF widać jedynie podmiot, numer seryjny, ważność i odcisk certyfikatu.",
      "Diagnostyka KSeF pokazuje stan połączenia, konteksty i przebiegi pobierania, faktury przychodzące, wysyłki oraz uruchomienia reguł, które za nimi stoją.",
      "Przejście na produkcyjne środowisko KSeF wymaga potwierdzenia, a zmiana środowiska kasuje weryfikację i wyłącza połączenie do czasu ponownej weryfikacji.",
    ],
  },
  faq: integrationsFeature.faq,
  related: {
    title: "Zobacz też",
    items: [
      { feature: "lowCode", title: "Low-code i automatyzacje", description: "Reguły i skrypty, które stoją za każdym scenariuszem z tej strony." },
      { feature: "security", title: "Bezpieczeństwo i uprawnienia", description: "Role, spółki i dostęp do rekordów, dla ludzi i dla tokenów." },
      { feature: "documents", title: "EOD / DMS", description: "Pliki, podglądy i generowane dokumenty przy sprawie, do której należą." },
    ],
  },
  finalCta: {
    title: "Przyślij nam listę systemów, na których pracujecie.",
    description: "Powiedz, gdzie ludzie kopiują dziś dane między systemami i jakie faktury wystawiacie. Na prezentacji przejdziemy przez to, co się połączy, co trzeba zbudować i czego do KSeF jeszcze nie wyślemy.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Skontaktuj się z nami",
  },
};
