import type { SecurityPageContent } from "@/content/feature-stories/security.types";
import type { FeaturePageContent } from "@/content/types";

const securityFaq: FeaturePageContent["faq"] = {
  title: "Najczęściej zadawane pytania.",
  items: [
    {
      question: "Jak działają uprawnienia w Opero?",
      answer:
        "Każdy dostaje role w organizacji i, osobno, w każdej spółce, do której należy. Role niosą uprawnienia org.* i company.* do konkretnych zasobów i czynności. Dodatkowo obiekt, strona czy formularz jest udostępniony wybranym spółkom oraz grupie odbiorców złożonej z ról lub osób, a obiekt można ograniczyć do rekordów, których dana osoba jest właścicielem. Trzeba przejść wszystkie te kontrole.",
    },
    {
      question: "Czy mogę ukryć przed rolą pojedyncze pole?",
      answer:
        "Tak, przez formularze. Dajesz roli jej własny formularz bez tego pola albo dodajesz warunek wyświetlania oparty na roli osoby lub wartościach rekordu. Serwer nie wysyła pola spoza formularza i odrzuca przesłaną dla niego wartość. W produkcie nie ma uprawnień do pojedynczych pól: listy i raporty pokazują kolumny wybrane przez autora, a właściciele i administratorzy systemu mogą odczytać cały rekord.",
    },
    {
      question: "Czy Opero obsługuje wiele spółek?",
      answer:
        "Tak. Jedna organizacja obejmuje wiele spółek. Konfigurację budujesz raz i włączasz dla każdej spółki osobno, rekordy biznesowe domyślnie zostają w swojej spółce, a dla spółki, do której ktoś nie należy, dostaje odpowiedź 404. Odczyt między spółkami wymaga osobnego uprawnienia org.companyData.readAll, które nie daje prawa zapisu.",
    },
    {
      question: "Czy dziennik aktywności zapisuje wszystko?",
      answer:
        "Nie. Zapisuje typy zdarzeń ze swojego katalogu: utworzone i zmienione rekordy, faktury, kontrahentów, komentarze, załączniki, przejścia w procesach, zmiany ról i uruchomienia reguł - z informacją kto, kiedy i, gdy zdarzenie niesie zmiany, jaka była wartość przed i po. Nie zapisuje, jakie rekordy ktoś otworzył, i nie każde działanie ma zdarzenie: usunięcie kontrahenta ma, usunięcie rekordu obiektu niestandardowego nie. Przejdziemy z Tobą katalog pod kątem potrzeb Twojego audytu.",
    },
    {
      question: "Czy raporty i zapytania SQL trzymają się tych zasad?",
      answer:
        "Częściowo. Zapisane zapytania SQL działają na ograniczonych rolach bazy danych, pod kontrolą row-level security w PostgreSQL, w zakresie spółki. Piszą je administratorzy i traktujemy je jako zaufane: listy SQL, raporty i zapisane zapytania nie stosują ograniczenia do własnych rekordów, a ich edytory o tym ostrzegają. Listy niestandardowe (Custom Lists) je stosują.",
    },
    {
      question: "Jakie standardy logowania jednokrotnego obsługujecie?",
      answer:
        "OpenID Connect - jedno połączenie na organizację, a użytkowników kierujemy po domenie e-mail zweryfikowanej rekordem DNS TXT. Nie obsługujemy SAML, SCIM, logowania inicjowanego przez dostawcę tożsamości ani przekazywania wylogowania, a role nadaje się w Opero, nie przez mapowanie grup. SSO to licencjonowany moduł; gdy licencja wygaśnie, SSO się wyłącza i członkowie logują się hasłem.",
    },
    {
      question: "Czy możemy uruchomić Opero na własnym serwerze?",
      answer:
        "Tak. Instalator z przewodnikiem stawia Opero na serwerze z Ubuntu 24.04 LTS albo Debianem 12 lub 13 (amd64), który kontrolujesz, z Twoim adresem, certyfikatem i miejscami na kopie zapasowe. To ten sam produkt, który sami utrzymujemy. Licencja działa online albo przez plik licencyjny, gdy instalacja nie może łączyć się na zewnątrz.",
    },
    {
      question: "Czy Opero ma certyfikaty bezpieczeństwa?",
      answer:
        "Ta strona opisuje, co robi produkt, i nie powołuje się na żadne certyfikaty. Przynieś na prezentację swój kwestionariusz bezpieczeństwa, a odpowiemy na niego punkt po punkcie, zgodnie z tym, jak Opero działa naprawdę.",
    },
  ],
};

export const securityFeature: FeaturePageContent = {
  seo: {
    title: "Bezpieczeństwo, role i uprawnienia",
    description:
      "Role, rozdzielone spółki, widoczność własnych rekordów, tokeny API, MFA i logowanie jednokrotne OIDC. Ustal, kto otwiera dane firmy, i sprawdź, kto je zmienił.",
  },
  navLabel: "Bezpieczeństwo i uprawnienia",
  navDescription: "Każdy widzi tylko to, co powinien",
  hero: {
    title: "Bezpieczeństwo i uprawnienia - każdy widzi dokładnie to, co powinien",
    description:
      "Role, uprawnienia, wiele spółek i tokeny API pod kontrolą. Dane firmy chronione na poziomie oczekiwanym przez działy IT.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    paragraph:
      "Dostęp w Opero układasz od organizacji i jej spółek, przez role i członków, aż po precyzyjne uprawnienia do modułów, obiektów i pól. Integracje zabezpieczasz tokenami API, a konta - uwierzytelnianiem wieloskładnikowym.",
  },
  demo: {
    kind: "security",
    roles: ["Serwisant", "Kierownik", "Księgowość"],
    recordTitle: "ZGL/2026/019 · Awaria centrali VoIP",
    fields: [
      { label: "Klient", value: "Hotel Panorama" },
      { label: "Wartość szacowana", value: "1 800,00 PLN" },
      { label: "Koszt wewnętrzny", value: "940,00 PLN" },
      { label: "Notatka poufna", value: "Klient negocjuje stawkę ramową" },
    ],
    buttons: ["Edytuj", "Zatwierdź", "Usuń"],
    readOnlyLabel: "Tylko podgląd",
    captions: {
      technician: "Ten sam rekord, <b>trzy role</b>",
      manager: "Pola poufne <b>maskują się same</b>",
      finance: "Przyciski znikają <b>razem z uprawnieniem</b>",
    },
  },
  blocks: {
    title: "Kontrola dostępu od organizacji po pojedyncze pole.",
    items: [
      {
        title: "Członkowie i role",
        description:
          "Konta użytkowników zebrane w role, które definiują zakres dostępu. Zmiana uprawnień roli obejmuje od razu wszystkich w niej.",
      },
      {
        title: "Uprawnienia szczegółowe",
        description: "Kontrola widoczności i edycji na poziomie modułu, obiektu i pojedynczego pola.",
      },
      {
        title: "Organizacje i spółki",
        description:
          "Wspólna konfiguracja, osobne dane każdej firmy; grupa kapitałowa na jednej platformie bez mieszania danych.",
      },
      {
        title: "Tokeny API",
        description:
          "Dostęp dla integracji z określonym zakresem uprawnień, wydawany i odbierany niezależnie od kont ludzi.",
      },
      {
        title: "MFA i logi",
        description:
          "Uwierzytelnianie wieloskładnikowe oraz rejestr zdarzeń „kto, co, kiedy” na potrzeby audytu i zgodności.",
      },
    ],
  },
  finalCta: {
    title: "Zapanuj nad dostępem do danych.",
    description: "Pokażemy model ról i uprawnień dopasowany do struktury Twojej firmy.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    title: "Dostęp do danych pod pełną kontrolą.",
    paragraphs: [
      "Bezpieczeństwo w Opero zaczyna się od precyzyjnej kontroli dostępu. Uprawnienia ustawiasz od organizacji i jej spółek, przez role i członków, aż po widoczność i edycję na poziomie pojedynczego modułu, obiektu i pola. Dzięki rolom zmiana uprawnień obejmuje od razu wszystkich, którzy do nich należą, a każdy użytkownik widzi dokładnie to, co powinien.",
      "Obsługa wielu spółek (multi-company) pozwala prowadzić grupę firm na jednej platformie. Konfiguracja jest wspólna, ale dane operacyjne każdej spółki pozostają odseparowane, więc informacje się nie mieszają. Integracje zabezpieczasz tokenami API o określonym zakresie uprawnień, niezależnymi od kont ludzi.",
      "Uwierzytelnianie wieloskładnikowe (MFA) i rejestr zdarzeń podnoszą poziom ochrony do standardu oczekiwanego przez działy IT. Logi „kto, co i kiedy” dają przejrzystość potrzebną w audycie i przy spełnianiu wymogów zgodności.",
    ],
  },
  faq: securityFaq,
  related: {
    title: "Zobacz też",
    items: ["integrations", "documents", "ai"],
  },
};

export const securityPage: SecurityPageContent = {
  seo: securityFeature.seo,
  hero: {
    title: "Ustal, kto otwiera który rekord i pole. Sprawdź, kto je potem zmienił.",
    description:
      "Do rekordów spółki mają dostęp tylko jej członkowie, przez formularz przypisany do swojej roli. Gdy usuniesz członka, jego sesje i utworzone przez niego tokeny API kończą się od razu. Rekord przechowuje każdą zmianę: osobę oraz wartość przed i po. W naszej chmurze albo na Twoim serwerze.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
    image: {
      src: "/opero/security/roles-hero.webp",
      alt: "Role firmowe w Opero z liczbą uprawnień, firm i osób przypisanych do każdej z nich",
      width: 2111,
      height: 1316,
    },
  },
  problem: {
    title: "Pytania o dostęp, które padają, gdy ktoś odchodzi albo dzwoni audytor.",
    points: [
      "Księgowa odchodzi w piątek. W poniedziałek nikt nie umie wymienić, co nadal może otworzyć ani jakie klucze integracji założyła.",
      "Serwisant potrzebuje zgłoszenia, ale 940 zł kosztu wewnętrznego stoi w tym samym wierszu arkusza.",
      "Wartość szansy wzrosła w zeszłym tygodniu ze 103 000 do 118 000, a wspólny plik nie mówi, kto ją zmienił.",
      "Dwie spółki z grupy mają jeden skoroszyt, więc księgowa jednej widzi liczby drugiej.",
    ],
    solution: "W Opero każda z tych spraw ma określoną odpowiedź: usunięcie z organizacji kończy sesje i unieważnia jej tokeny, formularze decydują, jakie pola dostaje rola, historia rekordu trzyma starą i nową wartość, a członkostwo w spółce decyduje, do czyich rekordów ktoś ma dostęp.",
  },
  views: {
    title: "Koszt wewnętrzny 940 zł nie trafia na formularz serwisanta.",
    description:
      "Do rekordu prowadzi formularz przypisany do roli. Dozwolone pola wynikają z opublikowanego układu formularza po stronie serwera: pole spoza układu nie jest wysyłane, a przesłana dla niego wartość zostaje odrzucona.",
    exampleLabel: "Przykład",
    recordTitle: "ZGL/2026/019 · Awaria centrali VoIP",
    absentLabel: "Poza tym formularzem:",
    viewOnlyLabel: "Tylko podgląd",
    columns: [
      {
        role: "Serwisant",
        fields: [
          { label: "Klient", value: "Hotel Panorama" },
          { label: "Problem", value: "Brak sygnału na 2. i 3. piętrze" },
          { label: "Miejsce", value: "Recepcja, serwerownia" },
        ],
        actions: ["Zapisz", "Oznacz jako naprawione"],
        absent: ["wartość szacowana", "koszt wewnętrzny"],
      },
      {
        role: "Kierownik serwisu",
        fields: [
          { label: "Klient", value: "Hotel Panorama" },
          { label: "Problem", value: "Brak sygnału na 2. i 3. piętrze" },
          { label: "Wartość szacowana", value: "1 800,00 PLN" },
          { label: "Koszt wewnętrzny", value: "940,00 PLN" },
        ],
        actions: ["Zapisz", "Zatwierdź", "Przekaż"],
        absent: [],
      },
      {
        role: "Księgowość",
        fields: [
          { label: "Klient", value: "Hotel Panorama" },
          { label: "Wartość szacowana", value: "1 800,00 PLN" },
          { label: "Koszt wewnętrzny", value: "940,00 PLN" },
        ],
        actions: [],
        absent: ["problem", "miejsce"],
      },
    ],
    note: "Formularz może też ukrywać swoje części warunkowo, na podstawie roli albo wartości rekordu. To reguła formularza, bo uprawnień do pojedynczych pól w produkcie nie ma: listy i raporty pokazują kolumny wybrane przez autora, a właściciele i administratorzy systemu mogą odczytać cały rekord. Te miejsca też trzeba ustawić z rozwagą.",
  },
  scenarios: {
    title: "Typowe reguły dostępu i ustawienie stojące za każdą z nich.",
    description: "Ustawia je Twój administrator w samym produkcie, bez prac programistycznych. Prawa kolumna mówi, co dokładnie się konfiguruje.",
    headers: { area: "Gdzie", rule: "Reguła, której chcesz", how: "Co konfigurujesz" },
    items: [
      {
        area: "Sprzedaż",
        rule: "Handlowcy pracują na swoich szansach. Dyrektor sprzedaży widzi cały lejek.",
        how: "Obiekt szans dostaje widoczność własnych rekordów, a właściciela wskazuje pole użytkownika albo Utworzone przez. Dyrektora dodajesz do grupy odbiorców z odczytem wszystkiego.",
      },
      {
        area: "HR",
        rule: "Pracownik widzi swoje wnioski urlopowe. Kierownik - te, które czekają na niego. Kadry - wszystkie.",
        how: "To samo ustawienie. Osoba z otwartym zadaniem w procesie może otworzyć wniosek, dopóki zadanie jest otwarte, a kadry należą do grupy z odczytem wszystkiego.",
      },
      {
        area: "Serwis w terenie",
        rule: "Serwisant widzi zlecenie, a marży nie widzi nigdy.",
        how: "Dwa formularze na jednym obiekcie, każdy z własną grupą odbiorców spośród ról w spółce. Formularz serwisanta pomija wartość i koszt.",
      },
      {
        area: "Finanse",
        rule: "Po zatwierdzeniu dokument mogą edytować już tylko wskazane osoby.",
        how: "Edycja na etapie ma trzy tryby: wszyscy, przypisani plus wskazani edytorzy albo tylko wskazani edytorzy. Etap tylko do odczytu ma pierwszeństwo przed nimi. Etap może też ukryć akcje na rekordzie, a serwer odrzuci ukryte polecenie.",
      },
      {
        area: "Holding",
        rule: "Każdy księgowy pracuje w jednej spółce. Kontroler grupy czyta dane wszystkich.",
        how: "Członkostwo w spółce z rolami dla tej spółki oraz org.companyData.readAll dla kontrolera. To uprawnienie obejmuje tylko odczyt, więc zapis nadal wymaga członkostwa w danej spółce.",
      },
      {
        area: "Klienci i partnerzy",
        rule: "Klient loguje się do portalu i nie widzi Twojego systemu.",
        how: "Użytkownicy portalu mają własne logowanie, rolę i menu, nie stają się członkami organizacji ani spółki i nie zajmują miejsca w licencji. Portale to licencjonowany moduł.",
      },
    ],
    disclaimer: "To przykłady tego, co można skonfigurować. Obiekty typu singleton i obiekty podrzędne nie mogą mieć widoczności własnych rekordów: rekord podrzędny dziedziczy dostęp po nadrzędnym.",
  },
  layers: {
    title: "Cztery kontrole przed otwarciem rekordu.",
    description: "Trzeba przejść wszystkie cztery, a każdą konfiguruje się osobno. Zaliczenie jednej nie przesądza o następnej.",
    items: [
      {
        title: "Spółka",
        description: "Członkostwo decyduje, w których spółkach ktoś pracuje. Dla każdej innej Opero odpowiada 404, jakby nie istniała, zamiast 403.",
      },
      {
        title: "Rola",
        description: "Uprawnienia zaznacza się dla zasobu i czynności. Role w spółkach definiuje się raz dla organizacji i przypisuje w każdej spółce osobno. Rola Właściciel jest chroniona, a ostatniego właściciela nie da się usunąć.",
      },
      {
        title: "Grupa odbiorców",
        description: "Obiekty, strony i formularze są udostępniane wybranym spółkom, a w nich wybranym rolom lub osobom. Grupa odbiorców nie daje uprawnienia, którego ktoś nie ma.",
      },
      {
        title: "Rekord",
        description: "Na obiekcie z widocznością własnych rekordów każdy widzi tylko swoje wiersze, chyba że należy do grupy z odczytem wszystkiego, ma otwarte zadanie na tym rekordzie albo jest właścicielem lub administratorem systemu.",
      },
    ],
    diagnostics: {
      title: "Dlaczego ta osoba nie może edytować formularza? Sprawdź to.",
      description: "Wybierasz spółkę i członka, a potem uruchamiasz test dostępu. Opero sprawdza status formularza, dostęp do obiektu w spółce i grupę odbiorców formularza dla tworzenia, podglądu i edycji, i podaje powód odmowy. Na zrzucie edycja nie przechodzi przez grupę odbiorców. Nikt nie musi logować się jako ktoś inny.",
      image: {
        src: "/opero/access/access-diagnostics-popover.webp",
        alt: "Okno diagnostyki dostępu w Opero z wynikami tworzenia, podglądu i edycji dla jednego członka, kontrola po kontroli",
        width: 1269,
        height: 572,
      },
    },
  },
  audit: {
    title: "Wartość wzrosła ze 103 000 do 118 000. Rekord pokazuje, kto to zrobił.",
    description:
      "Historia zmian rekordu podaje osobę, czas oraz wartość każdego pola przed i po. Dziennik aktywności pokazuje zdarzenia w całej organizacji lub jednej spółce, z filtrami po wykonawcy, kanale i typie zdarzenia. Jego odczyt wymaga osobnego uprawnienia.",
    images: {
      log: {
        src: "/opero/security/activity-log.webp",
        alt: "Dziennik aktywności Opero z listą ostatnich zmian w organizacji: wykonawca, zdarzenie, rekord i czas",
        width: 2000,
        height: 1250,
      },
      history: {
        src: "/opero/security/record-history.webp",
        alt: "Historia rekordu w Opero: kto zmienił każde pole, z wartością przed i po",
        width: 1200,
        height: 930,
      },
    },
    points: [
      {
        title: "Nie tylko edycje pól",
        description: "Wpis zostawiają utworzone i zmienione rekordy, faktury, kontrahenci, komentarze, załączniki, zmiany etapu w procesie, przypisania ról i uruchomienia reguł.",
      },
      {
        title: "Którą drogą przyszła zmiana",
        description: "Każdy wpis ma kanał: Web, API, MCP albo Reguła automatyzacji. Zapisy przez API niosą nazwę tokenu. Praca agenta AI widnieje jako osoba i podłączona przez nią aplikacja, jak na zrzucie.",
      },
      {
        title: "Co wpis zachowuje i kto go czyta",
        description: "Nazwy są zapisane we wpisie, więc późniejsza zmiana nazwy go nie przepisuje. Na obiekcie z widocznością własnych rekordów wpisy o rekordzie, którego ktoś nie może otworzyć, są przed nim ukryte.",
      },
    ],
    note: "Czego dziennik nie obejmuje: odnotowuje początek wizyty, a nie to, które rekordy ktoś otworzył, i nie każde działanie ma zdarzenie. Usunięcie kontrahenta ma, usunięcie rekordu obiektu niestandardowego nie. Przynieś na prezentację listę audytora, a sprawdzimy ją z katalogiem zdarzeń.",
  },
  questions: {
    title: "Co robi Opero, gdy coś idzie nie tak.",
    items: [
      { question: "Kierownik odchodzi. Co dzieje się z jego dostępem?", answer: "Usuwasz go z organizacji. Wszystkie jego sesje i członkostwa w spółkach się kończą, a utworzone przez niego tam tokeny API zostają unieważnione, więc integracja na takim tokenie stoi, dopóki nie dostanie nowego." },
      { question: "Kto przejmuje jego otwarte zadania?", answer: "Opero nie wybiera zastępcy. Przypisania osobiste znikają, zadania przypisane do roli zostają przy roli, a zadanie bez przypisanego może przydzielić edytor etapu." },
      { question: "Dostawca tożsamości nie działa, a SSO jest wymagane.", answer: "Członkowie zobowiązani do SSO muszą poczekać. Właściciele i osoby z rolą dającą wszystkie uprawnienia zachowują hasło, a administrator systemu może wyłączyć wymuszenie, co trafia do audytu." },
      { question: "Zablokowaliśmy kogoś u dostawcy tożsamości. Czy już nie wejdzie?", answer: "Nie zaloguje się ponownie, ale otwarta sesja w Opero trwa do wygaśnięcia: domyślnie 7 dni bezczynności, najwyżej 30 dni. SCIM nie ma, więc usuń lub dezaktywuj tę osobę także w Opero." },
      { question: "Ktoś edytuje rekord na zablokowanym etapie.", answer: "Etap tylko do odczytu odrzuca każdą edycję. W trybach ze wskazanymi edytorami pozostali dostają odmowę, także token API bez uprawnienia do obejścia procesu." },
      { question: "Ktoś ma wykradzione hasło.", answer: "Gdy konto ma drugi składnik, samo hasło nie wystarcza: na jego potwierdzenie jest domyślnie 5 minut i 5 prób. Nieudane hasła są ograniczone do 10 na e-mail i IP w 15 minut. Zmiana hasła kończy wszystkie sesje i zapamiętane przeglądarki." },
    ],
  },
  group: {
    title: "Kilka spółek w jednej organizacji, z rozdzielonymi rekordami.",
    description:
      "Obiekty, formularze, procesy i raporty budujesz raz, na poziomie organizacji, i włączasz dla każdej spółki osobno, na ekranie takim jak ten dla ACME Inc. Rekordy domyślnie zostają w swojej spółce, a każdy pracuje tylko w tych, do których należy.",
    bullets: [
      "Ta sama osoba może mieć rolę Manager w jednej spółce i Viewer w innej",
      "Raporty grupowe czytają dane między spółkami tylko z org.companyData.readAll, które nie daje prawa zapisu",
      "Zapisany SQL działa na ograniczonych rolach bazy pod row-level security w PostgreSQL, ale piszą go administratorzy i nie stosuje widoczności własnych rekordów",
      "Zapytania aplikacji także filtrują po spółce, więc kontrola przy wejściu nie jest jedyną barierą",
    ],
    image: {
      src: "/opero/security/company-exposure.webp",
      alt: "Ekran zasobów jednej spółki w Opero: strony z trybem udostępnienia, grupą odbiorców i przełącznikiem dostępności",
      width: 2000,
      height: 1400,
    },
  },
  entry: {
    title: "Logowanie dla ludzi, integracji i agentów AI.",
    description: "Człowiek, integracja i agent AI mają osobne drogi wejścia i osobne limity. Wartości MFA poniżej to ustawienia domyślne, które organizacja może zmienić.",
    items: [
      {
        icon: "sso",
        title: "Logowanie jednokrotne",
        description: "OpenID Connect, jedno połączenie na organizację, kierowanie po domenie potwierdzonej rekordem DNS TXT. Wymuszenie SSO wymaga zaliczonego testu połączenia, a zmiana połączenia zawiesza je do ponownego testu. Moduł licencjonowany.",
      },
      {
        icon: "mfa",
        title: "Logowanie wieloskładnikowe",
        description: "Aplikacja uwierzytelniająca, klucz dostępu lub klucz sprzętowy albo SMS, plus 10 kodów odzyskiwania. Polityka: wyłączone, opcjonalne, obowiązkowe dla administratorów albo dla wszystkich. Przeglądarkę można zapamiętać na 30 dni, najwyżej 90, ale nigdy po logowaniu kodem odzyskiwania.",
      },
      {
        icon: "tokens",
        title: "Tokeny API",
        description: "Przypisane do jednej spółki, ze wskazaną listą uprawnień. Ważność od 1 do 90 dni, domyślnie 30, chyba że jawnie wybierzesz brak terminu. Opero przechowuje tylko skrót SHA-256, a nazwa tokenu widnieje w historii.",
      },
      {
        icon: "agents",
        title: "Agenci AI",
        description: "Agent loguje się przez OAuth jako osoba i dostaje jej aktualne uprawnienia, sprawdzane przy każdym wywołaniu. Usunięcie osoby z organizacji odbiera dostęp także agentowi. Reset hasła albo odłączenie agenta unieważnia zgodę.",
      },
    ],
  },
  hosting: {
    title: "W naszej chmurze albo na Twoim serwerze.",
    description: "Produkt jest w obu wariantach ten sam. Różnica polega na tym, kto utrzymuje instalację, jej aktualizacje i kopie zapasowe.",
    options: [
      {
        title: "W naszej chmurze",
        description: "Utrzymujemy instalację i dbamy o aktualizacje. Ty logujesz się i pracujesz.",
      },
      {
        title: "Na Twoim serwerze",
        description: "Instalator z przewodnikiem stawia Opero na Ubuntu 24.04 LTS albo Debianie 12 lub 13 (amd64), pod Twoim adresem. Baza zostaje u Ciebie, pliki trafiają do wybranego magazynu zgodnego z S3, a aktualizacje instalujesz, kiedy chcesz.",
      },
    ],
    backups: {
      title: "Co obejmuje kopia i co robi przywracanie.",
      stages: [
        { title: "Harmonogram i retencja", description: "Co określony czas, codziennie, co tydzień, co miesiąc lub przez cron, w Twojej strefie czasowej. Retencja dla każdego miejsca docelowego zachowuje kopie przypięte i ostatnią zweryfikowaną." },
        { title: "Szyfrowanie i kopiowanie", description: "Baza danych oraz, jeśli to włączysz, pliki, do których się odwołuje, trafiają na dysk lokalny lub NAS, przez SFTP albo do magazynu zgodnego z S3. Obiekty bez odwołania w bazie zostają pominięte." },
        { title: "Kontrola", description: "Zaplanowane kontrole przywracają kopię do tymczasowej bazy, porównują tabele, rozszerzenia i migracje oraz weryfikują zapisane pliki. Gdy zapis plików się nie uda, kopia powstaje jako sama baza, a alert e-mail to podaje." },
        { title: "Co zmienia przywracanie", description: "Najpierw kontrola wstępna, potem sekret odzyskiwania niezależny od logowania. Powstaje chroniona kopia, poprzednia baza zostaje zachowana. Sesje i tokeny API są unieważniane, a reguły, integracje i skrzynki wstrzymane." },
      ],
    },
  },
  faq: securityFaq,
  related: {
    title: "Zobacz też",
    items: [
      { feature: "processes", title: "Procesy i workflow", description: "Etapy, zadania i akceptacje, z prawem edycji ustawianym dla każdego etapu." },
      { feature: "integrations", title: "Integracje", description: "Systemy zewnętrzne połączone przez tokeny API spółki ze wskazaną listą uprawnień." },
      { feature: "ai", title: "Kontekstowa AI", description: "Agenci AI pracujący na Twoich danych i z Twoimi uprawnieniami." },
    ],
  },
  finalCta: {
    title: "Przynieś swoje role i pytania audytora.",
    description: "Powiedz nam, jakie masz spółki i role oraz o co pyta Twój audytor. Na prezentacji ustawimy pasujące formularze i grupy odbiorców i przejdziemy Twój kwestionariusz bezpieczeństwa zgodnie z tym, jak działa Opero.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Skontaktuj się",
  },
};
