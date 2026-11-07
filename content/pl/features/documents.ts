import type { DocumentsPageContent } from "@/content/feature-stories/documents.types";
import type { FeaturePageContent } from "@/content/types";

export const documentsFeature: FeaturePageContent = {
  seo: {
    title: "Elektroniczny obieg dokumentów (EOD) i DMS",
    description:
      "Rejestruj dokumenty, prowadź je przez obieg akceptacji i trzymaj każdy plik przy sprawie. System EOD i DMS w jednej platformie Opero.",
  },
  navLabel: "EOD / DMS",
  navDescription: "Każdy plik przy swojej sprawie",
  hero: {
    title: "EOD i DMS - dokumenty pod kontrolą od wpływu do archiwum",
    description:
      "Rejestruj dokumenty, prowadź je przez obieg akceptacji i trzymaj każdą wersję pliku przy sprawie - zamiast po mailach i dyskach.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    paragraph:
      "Opero łączy obieg dokumentów (EOD) z zarządzaniem plikami (DMS): dokument ma swoją kartotekę, ścieżkę akceptacji i komplet plików z wersjami. Wszystko z pełną historią i kontrolą dostępu.",
  },
  demo: {
    kind: "documents",
    inboxLabel: "Skrzynka",
    mail: { file: "faktura-hotel-panorama.pdf", from: "od: biuro@panorama.pl" },
    record: {
      title: "Faktura kosztowa",
      numberLabel: "Numer",
      number: "FZ/2026/0142",
      partyLabel: "Kontrahent",
      party: "Hotel Panorama Sp. z o.o.",
      amountLabel: "Kwota brutto",
      amount: "24 800,00 PLN",
    },
    pathLabel: "Ścieżka akceptacji",
    condition: "Kwota ≥ 10 000 PLN?",
    branches: [
      { title: "Akceptacja: Zarząd", detail: "wymagane 2 podpisy" },
      { title: "Akceptacja: Kierownik", detail: "ścieżka pominięta" },
    ],
    versionsLabel: "Wersje pliku",
    versions: [
      { file: "faktura.pdf", detail: "skan z e-maila" },
      { file: "faktura.pdf", detail: "korekta pozycji 3" },
      { file: "faktura.pdf", detail: "zatwierdzona" },
    ],
    currentLabel: "aktualna",
    captions: { intake: "Dokument wpada i <b>sam staje się rekordem</b>", numbering: "Numer nadaje się <b>automatycznie</b>", path: "Ścieżka akceptacji <b>zależy od kwoty</b>", versions: "Każdy plik ma wersje - <b>nic nie ginie</b>" },
  },
  blocks: {
    title: "Kartoteka, obieg i pliki jako jedna całość.",
    items: [
      {
        title: "Rejestracja dokumentów",
        description:
          "Każdy typ dokumentu (pismo, faktura, wniosek) to obiekt własny z polami, numeracją i kartoteką.",
      },
      {
        title: "Obieg akceptacji",
        description:
          "Dokument krąży po zdefiniowanych etapach: dekretacja, opinie, zatwierdzenie, archiwizacja.",
      },
      {
        title: "Formularze wprowadzania",
        description:
          "Kontrolowane widoki rejestracji i dekretacji, różne dla kancelarii, działu i akceptującego.",
      },
      {
        title: "Pliki i wersjonowanie",
        description:
          "Załączniki dowiązane do rekordu, przechowywane, wersjonowane i przeszukiwalne, z kontrolą uprawnień.",
      },
      {
        title: "Szablony dokumentów",
        description:
          "Generujesz umowy, pisma i decyzje z danych rekordu według wzorców ze zmiennymi; dokument zawsze w aktualnej wersji.",
      },
    ],
  },
  finalCta: {
    title: "Uporządkuj obieg dokumentów.",
    description: "Zobacz, jak Opero prowadzi dokument od wpływu do archiwum bez luk i zagubionych plików.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    title: "Dokumenty od wpływu po archiwum w jednym systemie.",
    paragraphs: [
      "Elektroniczny obieg dokumentów (EOD) w Opero porządkuje drogę każdego pisma, wniosku i faktury: od wpływu, przez dekretację i akceptacje, po archiwizację. Dokument ma własną kartotekę zbudowaną jako obiekt własny, z polami rejestrowymi i numeracją, oraz ścieżkę obiegu opartą o etapy i przejścia. Dzięki temu wiadomo, gdzie jest sprawa i kto ma ją na biurku.",
      "Warstwa DMS (zarządzanie dokumentami) trzyma pliki tam, gdzie ich miejsce, czyli przy rekordzie sprawy. Załączniki są przechowywane, wersjonowane i przeszukiwalne, z kontrolą uprawnień, więc dokumenty nie giną po dyskach i skrzynkach mailowych. Szablony dokumentów pozwalają wygenerować umowę, decyzję czy pismo wprost z danych rekordu, zawsze w aktualnej wersji i formacie.",
      "Połączenie EOD i DMS w jednej platformie oznacza, że obieg, dane i pliki nie są rozbite między osobne narzędzia. To krótsza droga sprawy, mniej ręcznego przepisywania i pełna historia na potrzeby kontroli oraz zgodności.",
    ],
  },
  faq: {
    title: "Najczęściej zadawane pytania.",
    items: [
      {
        question: "Czym EOD różni się od DMS?",
        answer:
          "EOD to droga dokumentu przez firmę: rejestracja, dekretacja, akceptacja, zamknięcie. DMS dba o same pliki: gdzie leżą, kto ma do nich dostęp i jak je znaleźć. Opero łączy jedno z drugim, bo pliki są przypięte do rekordu, który tę drogę przechodzi.",
      },
      {
        question: "Czy dokumenty można generować automatycznie?",
        answer:
          "Tak, ale wyłącznie jako PDF: nie ma generowania plików Word ani HTML. Szablon zamienia dane w PDF, a reguła decyduje kiedy: przy zmianie etapu, według harmonogramu albo po akcji na liście. Ta sama reguła może dołączyć PDF do rekordu i wysłać go mailem. Jeśli ktoś ma dalej edytować wynik, trzymaj plik Word jako załącznik.",
      },
      {
        question: "Czy Opero przechowuje wersje załączonego pliku?",
        answer:
          "Nie w formie stosu wersji jednego pliku. Poprawiony plik to nowy załącznik obok poprzedniego, a historia aktywności pokazuje, kto i kiedy go dodał. Prawdziwą historię wersji mają szablony dokumentów, które przechodzą od szkicu do opublikowanej wersji, oraz długi tekst w obiektach dokumentowych, gdzie wcześniejszą treść można podejrzeć i zapisać jako nową wersję.",
      },
      {
        question: "Czy Opero przeszukuje wnętrze PDF-ów i skanów?",
        answer:
          "Nie. Wyszukiwarka obejmuje pola rekordów i tekst sformatowany, ale nie treść ani nazwy załączonych plików, a Opero nie ma wbudowanego OCR. Dlatego warto dać rekordowi pola, po których ludzie szukają. Po podłączeniu dostawcy AI reguła może odczytać załączony PDF i uzupełnić je za Ciebie.",
      },
      {
        question: "Czy pole podpisu to prawnie wiążący e-podpis?",
        answer:
          "Pole podpisu rejestruje podpis złożony na ekranie albo, jeśli na to pozwolisz, wpisany z klawiatury, wraz z czasem i, jeśli tego wymagasz, imieniem i nazwiskiem. Można je ustawić tak, by po podpisaniu nie dało się go zmienić. Nie jest to kwalifikowany podpis elektroniczny. Jeśli go potrzebujesz, podpisz dokument w swoim narzędziu do podpisu i dołącz plik do sprawy.",
      },
      {
        question: "Czy Opero pilnuje okresów przechowywania?",
        answer:
          "Nie ma gotowego harmonogramu retencji ani blokady prawnej. Politykę budujesz z pola daty, przypomnienia lub reguły cyklicznej, końcowych etapów tylko do odczytu i uprawnień do usuwania. Jeśli masz formalne wymogi archiwizacyjne, przynieś je na prezentację, a powiemy wprost, co się sprawdzi.",
      },
    ],
  },
  related: {
    title: "Zobacz też",
    items: ["processes", "noCode", "security"],
  },
};

export const documentsPage: DocumentsPageContent = {
  hero: {
    title: "Umowa, skan, akceptacja i przypomnienie w jednym rekordzie.",
    description:
      "Opero wypełnia PDF z opublikowanego szablonu, prowadzi rekord przez Twoje etapy akceptacji, otwiera załączniki w przeglądarce i powiadamia właściciela przed końcem umowy. Nie ma OCR, generowania plików Word ani podpisu kwalifikowanego, a na tej stronie piszemy, co zrobić zamiast tego.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Poznaj Opero",
    image: { src: "/opero/documents/hero-case-record.webp", alt: "Wniosek klienta REQ/2026/08/1 w Opero: formularz po lewej i cztery załączone pliki po prawej", width: 2111, height: 1316 },
  },
  problem: {
    title: "Pięć pytań o umowę, na które dysk sieciowy nie odpowie.",
    description:
      "Przykład: umowa UM/2026/0147 na 180 000 zł, zapisana jako PDF na dysku. Plik przechowuje treść. Etap, osoba odpowiedzialna, lista dostępu i data końca są gdzie indziej, zwykle w mailach. W Opero to pola rekordu, do którego PDF jest załączony.",
    folderLabel: "Na dysku sieciowym",
    caseLabel: "W rekordzie Opero",
    rows: [
      { question: "U kogo jest teraz UM/2026/0147?", folder: "Pytasz handlowca, potem prawnika, potem szukasz ostatniego maila.", opero: "Rekord pokazuje etap, osobę przypisaną i otwarte zadanie." },
      { question: "Do czego należy skan_0042.pdf?", folder: "Otwierasz plik i wnioskujesz z treści.", opero: "Jest załączony do jednego rekordu, obok klienta i terminu." },
      { question: "Kto może go otworzyć?", folder: "Każdy z dostępem do folderu i każdy, komu go przesłano.", opero: "Tylko osoby, które mogą czytać rekord i mają uprawnienie do odczytu załączników." },
      { question: "Kto zmienił wartość ze 150 000 na 180 000?", folder: "Porównujesz dwa pliki Word, o ile oba jeszcze istnieją.", opero: "Historia aktywności pokazuje starą i nową wartość, autora zmiany i czas." },
      { question: "Kto zauważy, że umowa kończy się 31 stycznia 2029?", folder: "Ten, kto wpisał to sobie do kalendarza.", opero: "Reguła przypomnienia na polu daty końca, do 365 dni przed nią lub po niej." },
    ],
  },
  caseFile: {
    title: "Plik otwiera się obok formularza, bez pobierania.",
    description:
      "W tym przykładzie wniosek klienta REQ/2026/08/1 ma cztery pliki. Raport serwisowy SR-2041 otwiera się w zakładce Pliki, a formularz zostaje na ekranie. Komentarze są o jedną zakładkę dalej. Ten sam panel działa przy kliencie, pracowniku, środku trwałym, zgłoszeniu i obiekcie, który zdefiniujesz sam.",
    bullets: [
      "Pliki trafiają do rekordu przez ręczne dodanie, pole pliku w formularzu (także publicznym), regułę, KSeF albo API.",
      "PDF, obrazy, Excel i CSV otwierają się w przeglądarce. Word, PowerPoint, .odt, .odp i .rtf dostają podgląd PDF konwertowany w tle, a oryginał zostaje bez zmian.",
      "Domyślny limit to 10 MB na załącznik i można go zmienić w ustawieniach organizacji. Plik wgrany do formularza, którego nikt nie zapisał, wygasa po 72 godzinach.",
      "Załączniki mają cztery uprawnienia: odczyt, dodawanie, zmianę nazwy i usuwanie. Domyślna rola Member może czytać i dodawać, a Viewer tylko czytać.",
    ],
    image: { src: "/opero/documents/file-preview-on-record.webp", alt: "Raport serwisowy SR-2041 jako podgląd PDF w zakładce Pliki rekordu Opero, obok formularza", width: 2000, height: 1400 },
  },
  journey: {
    title: "Jedna umowa na 180 000 zł, od wniosku po sygnał o odnowieniu.",
    description:
      "Prześledź całą drogę jednej sprawy. PDF nigdzie nie krąży: rekord zmienia etap, kolejna osoba dostaje zadanie, a wszystkie pliki zostają przy rekordzie.",
    note: "To przykład. Limit, etapy i daty ustawiasz sam. Po opublikowaniu zmienionego procesu ta sprawa od następnego przejścia korzysta z nowych przejść i warunków.",
    stages: [
      { tag: "Formularz", title: "Handlowiec zakłada UM/2026/0147", detail: "Klient, 180 000 zł, 24 miesiące od 1 lutego 2027. Numer nadaje pole kodu generowanego, po utworzeniu tylko do odczytu." },
      { tag: "Reguła", title: "Szkic PDF trafia do rekordu", detail: "Przy przejściu na etap Weryfikacja prawna reguła generuje PDF z opublikowanego szablonu i go załącza." },
      { tag: "Zadanie", title: "Dział prawny sprawdza szkic", detail: "Prawnik dostaje zadanie. Odesłanie szkicu wymaga komentarza, więc powód zostaje w rekordzie." },
      { tag: "Warunek", title: "180 000 zł to powyżej limitu", detail: "Powyżej 100 000 zł przejście do kierownika działu nie spełnia warunku. Dostępna jest tylko akceptacja zarządu.", active: true },
      { tag: "E-mail", title: "Wraca podpisany egzemplarz", detail: "Reguła na przychodzącym mailu łączy wątek ze sprawą i załącza podpisany PDF obok szkicu." },
      { tag: "Tylko odczyt", title: "Umowa aktywna, pola zamrożone", detail: "Ludzie ani reguły nie zmienią już wartości ani dat. Token API potrzebuje jawnego uprawnienia do obejścia blokady." },
      { tag: "Przypomnienie", title: "2 grudnia 2028: sygnał o odnowieniu", detail: "Przypomnienie ustawione na 60 dni przed końcem umowy 31 stycznia 2029 powiadamia właściciela o 9:00." },
    ],
  },
  scenarios: {
    title: "Sześć rodzajów dokumentów i to, co się z nimi dzieje.",
    description:
      "To przykłady konfiguracji z przykładowymi liczbami. Poza fakturami nie są to gotowe moduły: każdy to obiekt z Twoimi polami, etapami i szablonami.",
    stepLabels: ["Wejście", "Obieg", "Zostaje"],
    items: [
      {
        area: "HR",
        title: "Umowa o pracę dla nowej osoby",
        steps: [
          "Po akceptacji zatrudnienia reguła generuje PDF umowy z danych rekordu pracownika.",
          "Przełożony, a potem HR potwierdzają ją na swoich etapach, każde z zadaniem.",
          "Umowa zostaje w rekordzie pracownika, a reguła na dacie ostrzega 30 dni przed końcem ważności badań.",
        ],
      },
      {
        area: "Zakupy",
        title: "12 laptopów za 38 400 zł przy limicie 25 000 zł",
        steps: [
          "Pracownik składa wniosek na 12 sztuk po 3 200 zł i załącza ofertę dostawcy.",
          "Powyżej limitu dostępne jest tylko przejście do dyrektora. Odrzucenie wymaga komentarza.",
          "Reguła wysyła PDF zamówienia do dostawcy i załącza kopię do wniosku.",
        ],
      },
      {
        area: "Serwis, utrzymanie, instalatorzy",
        title: "Raport serwisowy SR-2041",
        steps: [
          "Technik zapisuje wizytę w rekordzie przeglądu urządzenia i dodaje zdjęcia.",
          "Klient podpisuje na ekranie. Z włączoną blokadą po podpisaniu podpisu nie można nadpisać, a zapisują się nazwisko i czas.",
          "Raport wychodzi jako PDF, a urządzenie zachowuje raporty ze wszystkich wcześniejszych wizyt.",
        ],
      },
      {
        area: "Finanse",
        title: "Faktura kosztowa z KSeF lub ze skrzynki",
        steps: [
          "Fakturę dostarcza KSeF albo przychodzi mailem jako PDF. Po podłączeniu dostawcy AI reguła odczytuje PDF i sprawdza sumy kontrolne NIP i IBAN.",
          "Import z AI czeka na weryfikację, aż księgowość oznaczy go jako gotowy. Fakturę ze znanym NIP sprzedawcy i numerem domyślnie pomija.",
          "Plik źródłowy zostaje przy fakturze. Opero nie prowadzi księgi głównej, więc księgowanie zostaje w Twoim systemie finansowo-księgowym.",
        ],
      },
      {
        area: "Jakość, produkcja",
        title: "Procedura z corocznym przeglądem",
        steps: [
          "Tekst powstaje w Opero jako obiekt dokumentowy, z linkami do rekordów, których dotyczy.",
          "Przechodzi przez etapy weryfikacji i zatwierdzenia, każdy z przypisanymi osobami.",
          "Etap Zatwierdzona jest tylko do odczytu, a przypomnienie na dacie następnego przeglądu trafia do właściciela.",
        ],
      },
      {
        area: "Sekretariat, instytucje publiczne",
        title: "Pismo przychodzące KP/2026/0381",
        steps: [
          "Sekretariat rejestruje pismo ze skanem, a numer nadaje pole kodu generowanego. Skanu nic nie odczytuje, więc nadawcę i temat wpisuje się ręcznie.",
          "Pismo trafia do działu, który dostaje zadanie z terminem i przypomnieniem.",
          "Każdy dział ma własną przefiltrowaną listę, a historia procesu pokazuje całą drogę pisma.",
        ],
      },
    ],
  },
  generate: {
    title: "PDF z opublikowanego szablonu, wypełniony danymi rekordu.",
    description:
      "Widoczną tu ofertę handlową układa się w milimetrach na kanwie strony, a pola wiąże ze zmiennymi, na przykład {{ data.customer }}. Faktury i zgłoszenia helpdesku mają gotowe zmienne. Dla własnych obiektów reguła przekazuje potrzebne wartości. Wynikiem jest wyłącznie PDF.",
    image: { src: "/opero/documents/template-editor.webp", alt: "Edytor szablonów dokumentów Opero z ofertą handlową, tabelą powiązaną z danymi i kodem QR", width: 2000, height: 1250 },
    points: [
      { title: "Co można umieścić na stronie", detail: "Tekst, tabele, listy, obrazy, linie, miejsca na podpis i kody QR, także vCard i Wi-Fi. Tabela bierze wiersze z listy w danych, a kolumna może pojawiać się warunkowo. Szablonów HTML nie ma." },
      { title: "Jedna stopka i nagłówek", detail: "Nagłówki i stopki to osobne elementy z własną publikacją. Opublikujesz nowy adres, a ma go już kolejny PDF. Wygenerowane wcześniej pliki się nie zmieniają." },
      { title: "Szkice zostają w firmie", detail: "Podgląd PDF nie tworzy pliku. Generowanie korzysta tylko z aktualnej opublikowanej wersji, publikacja ją waliduje i renderuje próbnie, a zadanie zapisuje użytą wersję." },
      { title: "Trzy kroki reguły", detail: "Przy zmianie etapu, według harmonogramu lub po akcji na liście: generuj, załącz, wyślij. Gdy renderowanie się nie uda, krok jest widoczny jako błąd w przebiegu reguły i nic nie zostaje załączone." },
    ],
  },
  write: {
    title: "Polityka może być samym rekordem, bez pliku Word.",
    description:
      "Widoczna tu polityka zwrotów sprzętu to obiekt dokumentowy: stronę tworzą tytuł i treść, a w panelu bocznym są Twoje pola, tutaj status, dział i następny przegląd. Ma te same etapy i uprawnienia co każdy inny rekord.",
    bullets: [
      "Nagłówki, tabele, obrazy, wyróżnione bloki i jeden spis treści budowany z nagłówków.",
      "Link do rekordu przechowuje tylko cel. Czytelnik widzi aktualną nazwę albo znacznik braku dostępu, jeśli nie może otworzyć tego rekordu.",
      "Historia przechowuje pełny wcześniejszy tekst długich treści, powyżej 16 KiB. Starą wersję wczytujesz do edytora i zapisujesz jako nową. Usunięte od tego czasu obrazy mogą w niej nie działać.",
      "Wyszukiwarka sięga do treści. Obiektu dokumentowego nie można użyć jako formularza publicznego.",
    ],
    image: { src: "/opero/documents/document-object.webp", alt: "Polityka napisana jako obiekt dokumentowy Opero, ze spisem treści, linkiem do rekordu i polami w panelu bocznym", width: 2000, height: 1400 },
  },
  find: {
    title: "Szukaj po kliencie, dacie lub etapie. Nazw plików nie indeksujemy.",
    description:
      "Wyszukiwarka obejmuje pola rekordów i tekst sformatowany, ale nie nazwy ani treść załączników, a OCR nie ma. Dlatego każdy rodzaj dokumentu powinien mieć pola, po których ludzie szukają. Przykładowa lista ma 14 wniosków klientów i zakładki: pełna lista, tablica oraz Podgląd z rekordem otwartym obok.",
    bullets: [
      "Listy filtrują po swoich polach, także po datach względnych, np. z ostatnich 30 dni.",
      "Administrator ustawia widoki: tabelę, tablicę, tablicę procesu i kalendarz. W Podglądzie klawisze J i K przechodzą między rekordami, a O otwiera pełną stronę.",
      "Użytkownicy dodają własne widoki obok tych zdefiniowanych przez administratora.",
      "W obiekcie ustawionym na rekordy własne lista pokazuje każdemu tylko to, czego jest właścicielem.",
    ],
    image: { src: "/opero/documents/split-list.webp", alt: "Lista 14 wniosków klientów w Opero z jednym rekordem otwartym obok listy w zakładce Podgląd", width: 2000, height: 1400 },
  },
  keep: {
    title: "Retencji nie ma gotowej. Budujesz ją z czterech części.",
    description:
      "Nie ma też blokady prawnej. Dla każdego rodzaju dokumentu łączysz etap końcowy, uprawnienia do usuwania, reguły na datach i przechowywanie. Tak działa każda z tych części.",
    items: [
      { title: "Końcowy etap tylko do odczytu", detail: "Na tym etapie nikt nie edytuje pól rekordu, a reguły też dostają odmowę. Załączników to nie obejmuje: działają według własnych uprawnień." },
      { title: "Kto może usuwać", detail: "Usunięcie rekordu wymaga uprawnienia do usuwania. Etap może dodatkowo dopuścić twórcę, autora lub osobę przypisaną. Usunięcie pliku wymaga osobnego uprawnienia, którego domyślna rola Member nie ma." },
      { title: "Reguły na datach", detail: "Przypomnienie uruchamia się raz na rekord i datę, a ponownie po zmianie daty. Reguła może usuwać załączniki i kończy się błędem, gdy pasuje ich więcej niż ustawiony limit." },
      { title: "Po usunięciu", detail: "Usunięty plik od razu znika ze wszystkich odczytów, a jego dane zostają przez 48 godzin, by świeża kopia zapasowa mogła je odczytać. Pliki leżą w magazynie zgodnym z S3 i można je objąć planem kopii." },
    ],
  },
  faq: documentsFeature.faq,
  related: {
    title: "Zobacz też",
    items: [
      { feature: "processes", title: "Procesy i obieg", description: "Etapy, zadania, warunki przejść i wymagane komentarze." },
      { feature: "lowCode", title: "Low-code i automatyzacja", description: "Kroki reguł, które generują, załączają i wysyłają dokument." },
      { feature: "security", title: "Bezpieczeństwo i uprawnienia", description: "Kto widzi którą spółkę, rekord i plik." },
    ],
  },
  finalCta: {
    title: "Przynieś na prezentację jeden prawdziwy dokument.",
    description: "Umowę, raport serwisowy albo wniosek zakupowy, razem z limitami akceptacji. Rozpiszemy go na pola, etapy i szablon, i powiemy wprost, czego nie da się w ten sposób zrobić.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Porozmawiajmy",
  },
};
