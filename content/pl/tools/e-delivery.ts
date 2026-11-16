import type { EDeliveryLabels, EDeliveryPageContent } from "@/content/types";
import { GOV_REGISTER_PAGE } from "@/lib/tools/e-delivery";

export const eDeliveryPage: EDeliveryPageContent = {
  seo: {
    title: "Wyszukiwarka adresów do e-Doręczeń",
    description:
      "Znajdź adres do e-Doręczeń urzędu, szkoły, ZUS albo firmy z KRS lub CEIDG. Wpisz nazwę, NIP, KRS lub REGON i skopiuj adres AE:PL. Za darmo, bez logowania.",
  },
  navLabel: "Adres do e-Doręczeń",
  navDescription: "Znajdź adres AE:PL urzędu albo firmy po nazwie, NIP, KRS lub REGON.",
  hero: {
    title: "Wyszukaj adres do e-Doręczeń urzędu lub firmy",
    description:
      "Wpisz nazwę urzędu i miejscowość albo NIP, KRS lub REGON firmy. Dostaniesz adres do doręczeń elektronicznych gotowy do skopiowania, ze źródłem i datą.",
  },
  explainer: {
    title: "Jak znaleźć adres do e-Doręczeń",
    paragraphs: [
      "Adres do e-Doręczeń to elektroniczny odpowiednik adresu do korespondencji poleconej. Ma postać AE:PL-12345-67890-ABCDE-12. Pismo wysłane na ten adres przez e-Doręczenia ma taki sam skutek prawny jak list polecony za potwierdzeniem odbioru.",
      "Adresy urzędów, szkół, sądów i innych podmiotów publicznych publikuje Ministerstwo Cyfryzacji na gov.pl. Lista jest aktualizowana w dni robocze. Adresy spółek i innych podmiotów z KRS są w ich wpisie w Krajowym Rejestrze Sądowym, a jednoosobowych firm we wpisie w CEIDG.",
      "Wpisz nazwę urzędu i miejscowość, a znajdziemy go w liście z gov.pl. Wpisz NIP, a sprawdzimy w wykazie podatników VAT numer KRS firmy i pobierzemy jej wpis z KRS. Jeśli firmy nie ma w KRS, sprawdzimy CEIDG. Numer KRS możesz wpisać z zerami na początku albo bez nich.",
      "Adresów osób prywatnych nie wyszukujemy. Prawo udostępnia je tylko podmiotom publicznym. Adwokatów, radców prawnych i innych zawodów zaufania publicznego znajdziesz w wyszukiwarce bazy adresów elektronicznych w aplikacji e-Doręczenia, jeśli masz własną skrzynkę.",
    ],
    table: {
      caption: "Gdzie szukamy adresu",
      columns: ["Wpisujesz", "Szukamy w", "Aktualność"],
      rows: [
        ["Nazwa urzędu lub REGON", "liście podmiotów publicznych z gov.pl", "z poprzedniego dnia roboczego"],
        ["NIP firmy", "wykazie podatników VAT, potem w KRS albo CEIDG", "na dziś"],
        ["Numer KRS", "KRS, rejestr przedsiębiorców albo stowarzyszeń i fundacji", "stan z ostatniego wpisu"],
        ["Adwokat, radca prawny, osoba prywatna", "nie wyszukujemy", "aplikacja e-Doręczenia"],
      ],
    },
  },
  popular: {
    title: "Adresy do e-Doręczeń najczęściej szukanych urzędów",
    intro: "Adresy z listy podmiotów publicznych na gov.pl z dnia {date}. Przed wysłaniem pisma sprawdź aktualny adres w wyszukiwarce powyżej.",
    columns: ["Urząd", "REGON", "Adres do e-Doręczeń"],
    institutions: [
      { regon: "000017756", label: "ZUS, Centrala" },
      { regon: "012513262", label: "KRUS, Centrala" },
      { regon: "015817985", label: "Narodowy Fundusz Zdrowia" },
      { regon: "000002217", label: "Ministerstwo Finansów" },
      { regon: "366063511", label: "Krajowa Informacja Skarbowa" },
      { regon: "000331501", label: "Główny Urząd Statystyczny" },
      { regon: "006212789", label: "Urząd Ochrony Konkurencji i Konsumentów" },
      { regon: "017315012", label: "Urząd do Spraw Cudzoziemców" },
      { regon: "000332251", label: "Urząd Patentowy RP" },
      { regon: "015259663", label: "Urząd m.st. Warszawy" },
      { regon: "350508747", label: "Urząd Miasta Krakowa" },
      { regon: "000514182", label: "Urząd Miasta Łodzi" },
      { regon: "001094670", label: "Urząd Miejski Wrocławia" },
      { regon: "000514199", label: "Urząd Miasta Poznania" },
      { regon: "000598463", label: "Urząd Miejski w Gdańsku" },
    ],
  },
  sources: {
    title: "Podstawa prawna i źródła",
    updatedLabel: "Zasady aktualne na:",
    updatedAt: "2026-11-16",
    note: "Narzędzie ma charakter informacyjny. Wiążący jest wpis w bazie adresów elektronicznych.",
    items: [
      { label: "Sprawdź, czy Twój urząd korzysta z e-Doręczeń (gov.pl)", href: GOV_REGISTER_PAGE },
      { label: "Wyszukiwarka KRS (Ministerstwo Sprawiedliwości)", href: "https://wyszukiwarka-krs.ms.gov.pl/" },
      { label: "API Otwarte KRS", href: "https://prs.ms.gov.pl/krs/openApi" },
      { label: "API wykazu podatników VAT (Ministerstwo Finansów)", href: "https://wl-api.mf.gov.pl" },
      { label: "Hurtownia danych CEIDG (biznes.gov.pl)", href: "https://dane.biznes.gov.pl/" },
      { label: "Aplikacja e-Doręczenia", href: "https://edoreczenia.gov.pl/" },
      { label: "Art. 9, 60, 151, 152 i 155 ustawy o doręczeniach elektronicznych (Dz.U. 2026 poz. 3)" },
    ],
  },
  faq: {
    title: "Częste pytania",
    items: [
      {
        question: "Co to jest adres do e-Doręczeń?",
        answer:
          "To adres skrzynki do doręczeń elektronicznych wpisany do bazy adresów elektronicznych (BAE), np. AE:PL-12236-59999-IBJFI-32. Pismo wysłane na ten adres ma taki skutek jak list polecony za potwierdzeniem odbioru.",
      },
      {
        question: "Jak sprawdzić adres do e-Doręczeń urzędu?",
        answer:
          "Wpisz nazwę urzędu i miejscowość, np. „urząd skarbowy Gdynia”. Szukamy w oficjalnej liście podmiotów publicznych z gov.pl i pokazujemy datę tej listy. Działają też skróty, np. ZUS, KRUS, US, GOPS czy PUP.",
      },
      {
        question: "Jak znaleźć adres do e-Doręczeń firmy?",
        answer:
          "Wpisz NIP albo numer KRS. Adres spółki pobieramy z jej aktualnego wpisu w Krajowym Rejestrze Sądowym. Jeśli firmy nie ma w KRS, sprawdzamy jej wpis w CEIDG, gdzie są jednoosobowe działalności gospodarcze.",
      },
      {
        question: "Dlaczego firma z KRS nie ma adresu do e-Doręczeń?",
        answer:
          "Brak adresu we wpisie KRS nie zawsze znaczy, że firma go nie ma: adres mógł jeszcze nie trafić do rejestru. Spółki z rejestru przedsiębiorców KRS mają obowiązek mieć adres do e-Doręczeń od 1 kwietnia 2025 r. Fundacje i stowarzyszenia spoza rejestru przedsiębiorców nie muszą go mieć.",
      },
      {
        question: "Kto musi mieć adres do e-Doręczeń?",
        answer:
          "Podmioty publiczne, podmioty z rejestru przedsiębiorców KRS, przedsiębiorcy z CEIDG (od 1 października 2026 r.) oraz adwokaci, radcy prawni, doradcy podatkowi, doradcy restrukturyzacyjni, rzecznicy patentowi i notariusze. Sądy, prokuratura i komornicy przejdą na e-Doręczenia do 1 października 2029 r.",
      },
      {
        question: "Dlaczego nie ma tu mojego sądu?",
        answer:
          "Sądy, prokuratura i komornicy mają czas na wdrożenie e-Doręczeń do 1 października 2029 r. Na liście gov.pl jest ich na razie tylko kilka. Do sądu pisz na zasadach podanych na jego stronie.",
      },
      {
        question: "Czy mogę sprawdzić adres osoby prywatnej?",
        answer: "Nie. Adresy osób fizycznych z bazy adresów elektronicznych są udostępniane tylko podmiotom publicznym.",
      },
      {
        question: "Czy KodaSoft widzi, czego szukam?",
        answer:
          "NIP, KRS i REGON sprawdza Twoja przeglądarka bezpośrednio w wykazie Ministerstwa Finansów i w KRS. Gdy firmy nie ma w KRS, pytamy CEIDG przez nasz serwer, bo jego API wymaga klucza. Nazwy urzędów wyszukujemy na naszym serwerze w kopii listy z gov.pl. Zapytań nie zapisujemy.",
      },
    ],
  },
  opero: {
    title: "Pisma urzędowe w jednym obiegu dokumentów",
    body: "W Opero rejestrujesz pisma przychodzące i wychodzące, przypisujesz je do osób i pilnujesz terminów odpowiedzi, z pełną historią zdarzeń.",
    primaryCta: "Umów demo",
    secondaryCta: "Obieg dokumentów w Opero",
  },
  otherToolsTitle: "Inne narzędzia",
};

export const eDeliveryLabels: EDeliveryLabels = {
  queryLabel: "Nazwa urzędu, NIP, KRS albo REGON",
  placeholder: "np. urząd skarbowy Gdynia albo 0000690425",
  submit: "Szukaj",
  searching: "Szukam…",
  hints: {
    empty: "Nazwy urzędów szukamy od razu. Numer zatwierdź klawiszem Enter.",
    text: "Szukam w liście urzędów z gov.pl.",
    nip: "Szukam po NIP. Naciśnij Enter.",
    krs: "Szukam po numerze KRS. Naciśnij Enter.",
    regon: "Szukam po numerze REGON. Naciśnij Enter.",
  },
  privacyNote:
    "Numery NIP, KRS i REGON sprawdzamy z Twojej przeglądarki w wykazie MF i w KRS, a CEIDG przez nasz serwer. Nazwy urzędów wyszukujemy na naszym serwerze w kopii listy z gov.pl. Zapytań nie zapisujemy.",
  errors: {
    nip: "To nie jest poprawny NIP. Numer KRS wpisz z zerami na początku, np. 0000690425.",
    regon: "To nie jest poprawny numer REGON. Sprawdź, czy ma 9 albo 14 cyfr i nie ma literówki.",
    krs: "To nie jest poprawny numer KRS. Ma do 10 cyfr, np. 0000690425.",
    number: "Nie rozpoznajemy tego numeru. Wpisz NIP (10 cyfr), KRS (do 10 cyfr) albo REGON (9 lub 14 cyfr).",
    short: "Wpisz co najmniej dwie litery nazwy albo numer.",
    krsNetwork: "Nie udało się połączyć z KRS. Spróbuj za chwilę albo",
    krsSearch: "sprawdź w wyszukiwarce KRS.",
    whiteListLimit: "Wykorzystano dzienny limit zapytań do wykazu MF. Wpisz numer KRS zamiast NIP albo spróbuj jutro.",
    whiteListNetwork: "Nie udało się połączyć z wykazem podatników VAT. Spróbuj za chwilę albo wpisz numer KRS.",
    searchUnavailable: "Lista urzędów jest chwilowo niedostępna. Sprawdź adres na gov.pl.",
    ceidgLimit: "CEIDG chwilowo nie przyjmuje więcej zapytań. Spróbuj za kilka minut.",
    ceidgUnavailable: "Nie udało się sprawdzić CEIDG. Spróbuj za chwilę.",
  },
  result: {
    copy: "Kopiuj adres",
    copied: "Skopiowano",
    regonLabel: "REGON",
    krsLabel: "KRS",
    nipLabel: "NIP",
    legalFormLabel: "Forma prawna",
    seatLabel: "Siedziba",
    townLabel: "Miejscowość",
    statusLabel: "Status",
    sourceGov: "gov.pl, lista z dnia {date}",
    sourceKrs: "KRS, {register}, stan na {state}, odpis z {extracted}",
    registers: { P: "rejestr przedsiębiorców", S: "rejestr stowarzyszeń i fundacji" },
    foreignBranch: "oddział przedsiębiorcy zagranicznego",
    sourceCeidg: "CEIDG, stan na dziś",
    officialGov: "Lista na gov.pl",
    officialKrs: "Sprawdź w wyszukiwarce KRS, numer {krs}",
    officialCeidg: "Wpis w CEIDG",
    noAdeTitle: "W KRS nie ma wpisanego adresu do e-Doręczeń tej firmy.",
    noAdeBody:
      "To nie znaczy, że firma go nie ma: adres mógł nie trafić jeszcze do KRS albo firma ma go od niedawna. Jeśli masz skrzynkę do e-Doręczeń, wyszukaj firmę w bazie adresów elektronicznych w",
    noAdeDutyP: "Spółki z KRS mają obowiązek mieć adres do e-Doręczeń od 1 kwietnia 2025 r.",
    noAdeNoDutyS: "Fundacje i stowarzyszenia spoza rejestru przedsiębiorców nie muszą mieć adresu do e-Doręczeń.",
    noAdeCeidg:
      "W CEIDG nie ma adresu do e-Doręczeń tej firmy. Przedsiębiorcy z CEIDG muszą go mieć od 1 października 2026 r., więc adres mógł jeszcze nie trafić do wpisu. Jeśli masz skrzynkę, sprawdź firmę w",
    eDeliveryApp: "aplikacji e-Doręczenia",
    listDate: "Lista urzędów z gov.pl z dnia {date}.",
    stale: "Może być nieaktualna, sprawdź na gov.pl.",
    showMore: "Pokaż więcej",
    shownOf: "{shown} z {total}",
    noInstitution: "Nie znaleźliśmy urzędu o tej nazwie.",
    companyHint: "Szukasz firmy? Wpisz jej NIP albo numer KRS.",
    nipNotFound: "Nie znaleźliśmy firmy z tym NIP-em w rejestrach, które sprawdzamy.",
    nipNotFoundHint: "Jeśli to spółka, wpisz jej numer KRS. Jeśli to urząd, wpisz jego nazwę.",
    krsNotFound: "Nie ma takiego numeru w KRS, ani w rejestrze przedsiębiorców, ani w rejestrze stowarzyszeń.",
    regonNotFound: "Nie znaleźliśmy tego numeru REGON w liście urzędów ani w rejestrach firm, które sprawdzamy.",
    ceidgStatuses: {
      AKTYWNY: "aktywna",
      ZAWIESZONY: "zawieszona",
      WYKRESLONY: "wykreślona",
      OCZEKUJE_NA_ROZPOCZECIE_DZIALANOSCI: "oczekuje na rozpoczęcie",
      WYLACZNIE_W_FORMIE_SPOLKI: "wyłącznie w formie spółki",
    },
  },
};
