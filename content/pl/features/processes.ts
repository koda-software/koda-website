import type { ProcessesPageContent } from "@/content/feature-stories/processes.types";
import type { FeaturePageContent } from "@/content/types";

/** One list for the page and for the FAQ structured data, which reads the feature export. */
const processesFaq: FeaturePageContent["faq"] = {
  title: "Najczęściej zadawane pytania.",
  items: [
    {
      question: "Czym jest workflow w Opero?",
      answer:
        "To droga, jaką rekord przechodzi przez firmę: etapy, dozwolone przejścia między nimi i osoba odpowiedzialna na każdym kroku. Może działać na Twoich własnych obiektach albo na kontrahentach, fakturach, budżetach i zgłoszeniach helpdesku.",
    },
    {
      question: "Czy zbudowanie procesu wymaga programisty?",
      answer:
        "Nie. Etapy rysujesz na kanwie, a osoby odpowiedzialne, terminy i warunki ustawiasz w formularzach. Prosta akceptacja jest dostępna jako gotowy szablon. Gdy będzie trzeba więcej, reguły i skrypty masz na tej samej platformie.",
    },
    {
      question: "Czy ścieżka może zależeć od kwoty albo innego pola?",
      answer:
        "Tak. Akcja może się pojawić tylko wtedy, gdy rekord spełnia Twoje warunki, więc wniosek poniżej limitu zatwierdza kierownik, a powyżej limitu trafia do finansów. Warunki działają na każdym polu rekordu.",
    },
    {
      question: "Czy na jednym etapie mogą akceptować dwie osoby?",
      answer:
        "Rekord jest zawsze na jednym etapie, a gdy etap ma kilka osób odpowiedzialnych, dalej może go przesunąć każda z nich. Jeśli podpisać muszą dwie osoby, każda dostaje własny etap, jeden po drugim.",
    },
    {
      question: "Co się dzieje, gdy ktoś przegapi termin?",
      answer:
        "Zadanie zostaje otwarte i widać, że jest po terminie, a Ty decydujesz, co dalej: przypomnienie dla właściciela, mail do kierownika zespołu albo przekazanie zadania komuś innemu. Terminy liczą się w dniach kalendarzowych, razem z weekendami.",
    },
    {
      question: "A jeśli właściciel jest na urlopie albo odchodzi z firmy?",
      answer:
        "Kluczowe etapy przypisz do zespołu, a działać będzie mógł każdy jego członek. Właściciel może też przekazać zadanie, a po terminie może to zrobić reguła. Opero nie ma ustawienia nieobecności. Gdy ktoś zostanie usunięty ze spółki, jego otwarte zadania zostają jako nieprzypisane i czekają, aż ktoś je przejmie.",
    },
    {
      question: "Czy mogę zmienić proces, gdy sprawy są w toku?",
      answer:
        "Tak. Pracujesz na szkicu i publikujesz go, gdy jest gotowy. Sprawy w toku korzystają z nowych ustawień od następnego kroku. Jeśli usuwasz etap, najpierw trzeba przesunąć stojące na nim sprawy.",
    },
    {
      question: "Jak proces łączy się z resztą Opero?",
      answer:
        "Działa na tych samych rekordach co wszystko inne. Pliki, komentarze i wygenerowane dokumenty zostają na rekordzie, uprawnienia decydują, kto go widzi, raporty czytają te same dane, a reguły mogą zadziałać na każdym kroku.",
    },
  ],
};


export const processesFeature: FeaturePageContent = {
  seo: {
    title: "System workflow i procesy BPM",
    description:
      "Zaprojektuj obieg pracy jako proces: etapy, przejścia, zadania i kanban. Automatyzuj akceptacje i procedury bez kodu. Zobacz workflow w Opero.",
  },
  navLabel: "Procesy i workflow",
  navDescription: "Nic nie ginie między działami",
  hero: {
    title: "Procesy i workflow - cała firma działa według Twoich reguł",
    description:
      "Zaprojektuj każdy obieg pracy jako proces. Akceptacje, obiegi dokumentów i procedury przechodzą przez zdefiniowane etapy - nic nie ginie między działami.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    paragraph:
      "Opero to silnik procesów, w którym rekord przechodzi przez etapy i przejścia (np. Nowe → W realizacji → Zaakceptowane → Zamknięte). Proces pilnuje kolejności, uprawnień i terminów, a każdy przebieg zostaje w historii.",
  },
  demo: {
    kind: "processes",
    columns: ["Nowe", "W realizacji", "Do akceptacji", "Zamknięte"],
    focusCard: { number: "ZGL/2026/019", title: "Awaria centrali VoIP" },
    otherCards: [
      { number: "ZGL/2026/017", title: "Szkolenie z obsługi CRM" },
      { number: "ZGL/2026/016", title: "Backup i migracja danych" },
      { number: "ZGL/2026/013", title: "Wymiana baterii w laptopach" },
    ],
    tasksLabel: "Moja praca",
    task: { title: "Wykonaj zgłoszenie", meta: "Marek Wiśniewski · dziś" },
    approvalLabel: "Do akceptacji",
    approveLabel: "Zatwierdź",
    rejectLabel: "Odrzuć",
    captions: {
      board: "Rekord wędruje po <b>etapach procesu</b>",
      task: "Zadanie trafia <b>do właściwej osoby</b>",
      approval: "Akceptacja przenosi go <b>do kolejnej kolumny</b>",
      done: "Proces pilnuje się <b>sam</b>",
    },
  },
  blocks: {
    title: "Proces, który pilnuje kolejności, uprawnień i terminów.",
    items: [
      {
        title: "Procesy (workflow)",
        description:
          "Modelujesz obieg jako etapy i przejścia, z warunkami i uprawnieniami na każdym kroku. Zmiana projektu procesu nie wymaga programisty.",
      },
      {
        title: "Zadania i tablice kanban",
        description:
          "Każdy etap generuje zadania przypisane osobom, z możliwością przekierowania. Praca widoczna na kanbanie i listach „moje zadania”.",
      },
      {
        title: "Obiekty własne jako nośnik procesu",
        description:
          "Proces przypinasz do dowolnego obiektu (Wniosek, Zlecenie, Umowa), więc obiegiem obejmujesz dokładnie te dane, które masz.",
      },
      {
        title: "Formularze na etapach",
        description:
          "Na każdym etapie decydujesz, co użytkownik widzi i może zmienić. Inny zakres pól dla wnioskującego, inny dla akceptującego.",
      },
      {
        title: "Historia i odtwarzanie",
        description:
          "Pełny ślad kto, co i kiedy zmienił oraz możliwość prześledzenia przebiegu krok po kroku.",
      },
    ],
  },
  finalCta: {
    title: "Zmapuj swój pierwszy proces w Opero.",
    description: "Pokażemy, jak przenieść obieg z maili i Excela do jednego, kontrolowanego procesu.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    title: "System workflow, który pilnuje kolejności i terminów.",
    paragraphs: [
      "Opero to system workflow, w którym każdy proces w firmie zamieniasz w powtarzalny, kontrolowany obieg. Rekord przechodzi przez zdefiniowane etapy i przejścia, a system pilnuje kolejności, uprawnień i terminów. Zamiast ustaleń rozproszonych w mailach i arkuszach masz jedno miejsce, w którym widać, na jakim etapie jest sprawa, kto za nią odpowiada i co wydarzyło się wcześniej.",
      "Zarządzanie procesami biznesowymi (BPM) w Opero nie wymaga programisty. Obieg projektujesz wizualnie: dodajesz etapy, łączysz je przejściami, ustawiasz warunki i osoby odpowiedzialne. Każde wejście na etap otwiera zadanie, a praca zespołu układa się na tablicy kanban i listach „moje zadania”. Akceptacje wniosków, obieg faktur, obsługa zgłoszeń czy procedury jakościowe działają dokładnie tak, jak je opiszesz.",
      "Ponieważ workflow przypinasz do dowolnego obiektu własnego, obiegiem obejmujesz własne dane firmy, a nie schemat narzucony przez system. Pełna historia i możliwość odtworzenia przebiegu dają porządek wymagany w audycie i codziennej pracy.",
    ],
  },
  faq: processesFaq,
  related: {
    title: "Zobacz też",
    items: ["documents", "noCode", "lowCode"],
  },
};

const heroImage = {
  src: "/opero/processes/hero-workflow-canvas.webp",
  alt: "Kreator procesów Opero z procesem Employee Onboarding pokazanym jako połączone etapy na kanwie",
  width: 2111,
  height: 1316,
};

export const processesPage: ProcessesPageContent = {
  seo: processesFeature.seo,
  hero: {
    title: "Daj każdemu wnioskowi właściciela, termin i kolejny krok.",
    description:
      "Rozrysuj, jak wniosek zakupowy, umowa albo faktura kosztowa mają przechodzić przez firmę. Opero przypisuje do każdego kroku osobę i termin, a rekord, pliki, komentarze i decyzje trzyma w jednym miejscu.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Poznaj Opero",
    image: heroImage,
    magnifier: {
      src: "/opero/processes/hero-workflow-magnifier.webp",
      alt: "Zbliżenie etapu HR Setup z terminem 2 dni i dwoma przejściami: Request IT Setup i Cancel Onboarding",
      width: 900,
      height: 900,
    },
  },
  problem: {
    title: "Kto ma ten wniosek? Kto go zatwierdził i kiedy?",
    description:
      "Gdy proces żyje w mailach i wspólnym arkuszu, te pytania zajmują cały dzień. W Opero odpowiedzi są na rekordzie, dla każdego, kto może go zobaczyć.",
    askedLabel: "O co ludzie pytają dziś",
    answerLabel: "Co pokazuje Opero",
    rows: [
      { asked: "Kto to teraz ma?", answer: "Aktualny etap oraz osobę lub zespół, który za niego odpowiada, na rekordzie i na tablicy." },
      { asked: "Dostałeś mojego maila?", answer: "Nikt nie musi go wysyłać. Praca pojawia się na liście zadań właściciela, razem z powiadomieniem i mailem." },
      { asked: "Czy ktoś to zatwierdził?", answer: "Każda decyzja z osobą, datą i komentarzem, w historii rekordu." },
      { asked: "Dlaczego to leży od tygodnia?", answer: "Każde zadanie ma termin, a po jego upływie może pójść przypomnienie albo praca może trafić do kogoś innego." },
      { asked: "Czy ktoś to zmienił po podpisaniu?", answer: "Etap może zablokować rekord, więc to, co zatwierdzono, zostaje w zatwierdzonej postaci." },
    ],
  },
  story: {
    exampleLabel: "Przykład: wniosek zakupowy",
    title: "12 laptopów, od pierwszego formularza do zamówienia.",
    description:
      "Anna potrzebuje 12 laptopów dla nowego zespołu, razem 38 400 zł. Kierownicy w tej firmie mogą sami zatwierdzić do 25 000 zł. Imiona i kwoty to przykład. Etapy, limity i osoby ustawiasz po swojemu.",
    peopleLabel: "Co robią ludzie",
    operoLabel: "Co robi Opero",
    steps: [
      {
        stage: "Wniosek",
        title: "Anna wypełnia jeden formularz.",
        people: "Wpisuje, czego potrzebuje i ile to kosztuje, dołącza ofertę i wybiera swojego kierownika, Marka, jako osobę akceptującą.",
        opero: "Uruchamia proces, dodaje wniosek do listy zadań Marka z terminem i daje mu znać.",
      },
      {
        stage: "Decyzja kierownika",
        title: "Marek widzi tylko te opcje, które mają zastosowanie.",
        people: "Kwota przekracza jego limit, więc może wysłać wniosek do finansów albo odesłać go Annie. Wniosek na 20 000 zł mógłby zatwierdzić sam.",
        opero: "Sprawdza kwotę na rekordzie i proponuje właściwe akcje, więc limit nie zależy od niczyjej pamięci.",
      },
      {
        stage: "Akceptacja finansów",
        title: "Finanse dostają wniosek bez przekazywania go dalej.",
        people: "W finansach pracują Ewa i Tomek. Ewa ma teraz mniej zadań na liście.",
        opero: "Daje zadanie Ewie, a z nim wszystko, co potrzebne: formularz, ofertę i komentarz Marka.",
      },
      {
        stage: "Powrót do Anny",
        title: "Finanse proszą o drugą ofertę.",
        people: "Ewa pisze dlaczego i odsyła wniosek. Anna dodaje lepszą ofertę, 36 900 zł, i wysyła ponownie ten sam wniosek.",
        opero: "Prosi o komentarz, zanim cokolwiek wróci, i zapisuje go na rekordzie. Rozmowa zostaje przy wniosku, a nie w czyjejś skrzynce.",
      },
      {
        stage: "Zamówione",
        title: "Ewa zatwierdza, a zamówienie wychodzi.",
        people: "Ewa zatwierdza. Anna widzi na swoim wniosku, że sprawa jest załatwiona i kiedy.",
        opero: "Blokuje zatwierdzony wniosek, generuje zamówienie z Twojego szablonu i wysyła je mailem do dostawcy.",
      },
    ],
  },
  board: {
    title: "Cały zespół widzi tę samą tablicę.",
    description:
      "Każda sprawa stoi w kolumnie swojego etapu, a na karcie widać jej właściciela. Zespół wie, co czeka i na kogo, a pracę przesuwa dalej, przeciągając kartę, o ile pozwala na to proces.",
    demo: {
      columns: ["Wniosek", "Decyzja kierownika", "Akceptacja finansów", "Zamówione"],
      focusCard: { number: "WZ/2026/041", title: "12 laptopów dla nowego zespołu" },
      otherCards: [
        { number: "WZ/2026/044", title: "Stoisko na targi" },
        { number: "WZ/2026/039", title: "Regały do magazynu" },
        { number: "WZ/2026/036", title: "Krzesła biurowe" },
      ],
      tasksLabel: "Moja praca",
      task: { title: "Oceń wniosek", meta: "Marek Wiśniewski · za 2 dni" },
      approvalLabel: "Do akceptacji",
      approveLabel: "Zatwierdź",
      rejectLabel: "Odeślij",
      captions: {
        board: "Wniosek przechodzi <b>do decyzji kierownika</b>",
        task: "Wniosek ma Marek, <b>termin za 2 dni</b>",
        approval: "Powyżej limitu, więc <b>muszą zatwierdzić finanse</b>",
        done: "Zatwierdzone, <b>wniosek zamknięty</b>",
      },
    },
  },
  departments: {
    title: "Jedna platforma, proces dla każdego działu.",
    description:
      "Sześć przykładów z tych samych elementów. Wybierz ten, który najbardziej przypomina to, co robicie dziś.",
    tablistLabel: "Przykładowe procesy według działów",
    scenarios: [
      {
        department: "HR",
        process: "Onboarding pracownika",
        situation: "Nowa osoba zaczyna w poniedziałek. Nikt nie wie, że laptop nie dotarł.",
        stages: [
          { name: "Umowa podpisana", icon: "pen", tone: "intake", owner: "HR", auto: "Przypomnienie przed startem" },
          { name: "Dokumenty HR", icon: "clipboard", tone: "work", owner: "HR", due: "3 dni" },
          { name: "Sprzęt IT", icon: "laptop", tone: "work", owner: "IT, kto ma najmniej zadań", due: "5 dni" },
          { name: "Przygotowanie kierownika", icon: "user", tone: "work", owner: "Kierownik zespołu", due: "2 dni" },
          { name: "Aktywny", icon: "check", tone: "done", owner: "Nowa osoba", auto: "Mail powitalny" },
        ],
      },
      {
        department: "Dział prawny",
        process: "Przegląd umów",
        situation: "Sprzedaż i prawnicy wymieniają się załącznikami, a nikt nie wie, która wersja poszła do podpisu.",
        stages: [
          { name: "Szkic", icon: "pen", tone: "intake", owner: "Autor umowy", due: "2 dni" },
          { name: "Przegląd prawny", icon: "scale", tone: "work", owner: "Dział prawny", due: "3 dni", auto: "Komentarz przy zwrocie" },
          { name: "Akceptacja zarządu", icon: "stamp", tone: "approve", owner: "Zarząd", due: "2 dni", lock: "Warunki zablokowane" },
          { name: "Podpisana", icon: "check", tone: "done", owner: "Autor umowy", auto: "Dokument z Twojego szablonu" },
        ],
      },
      {
        department: "Finanse",
        process: "Akceptacja faktur kosztowych",
        situation: "Przychodzi faktura. Kto ją zamówił i kto podpisuje?",
        stages: [
          { name: "Zarejestrowana", icon: "inbox", tone: "intake", owner: "Sekretariat", due: "1 dzień" },
          { name: "Opis", icon: "pen", tone: "work", owner: "Osoba zamawiająca", due: "3 dni" },
          { name: "Akceptacja", icon: "stamp", tone: "approve", owner: "Właściciel budżetu", due: "2 dni", auto: "Komentarz przy odrzuceniu" },
          { name: "Przed księgowaniem", icon: "calculator", tone: "work", owner: "Księgowość", due: "2 dni" },
          { name: "Wysłana do księgowości", icon: "send", tone: "work", owner: "Księgowość", lock: "Faktura zablokowana" },
          { name: "Zaksięgowana", icon: "check", tone: "done", owner: "Księgowość" },
        ],
      },
      {
        department: "Sprzedaż",
        process: "Akceptacja rabatów",
        situation: "Ktoś zgodził się na czacie na 18% rabatu. Po trzech miesiącach finanse pytają, kto to był.",
        stages: [
          { name: "Oferta", icon: "pen", tone: "intake", owner: "Handlowiec", due: "1 dzień" },
          { name: "Akceptacja kierownika sprzedaży", icon: "stamp", tone: "approve", owner: "Kierownik sprzedaży", due: "1 dzień", auto: "Rabaty do 15%" },
          { name: "Akceptacja finansów", icon: "stamp", tone: "approve", owner: "Finanse", due: "1 dzień", auto: "Tylko powyżej 15%" },
          { name: "Wysłana do klienta", icon: "send", tone: "work", owner: "Handlowiec", auto: "Oferta z Twojego szablonu" },
          { name: "Zamknięta", icon: "check", tone: "done", owner: "Handlowiec", lock: "Decyzja zostaje przy szansie" },
        ],
      },
      {
        department: "Operacje",
        process: "Serwis i naprawy",
        situation: "Linia staje o 6:40. W piątek jedynym śladem jest pamięć technika.",
        stages: [
          { name: "Zgłoszone", icon: "alert", tone: "intake", owner: "Każdy, przez formularz" },
          { name: "Zaplanowane", icon: "calendar", tone: "work", owner: "Koordynator", due: "1 dzień" },
          { name: "W realizacji", icon: "wrench", tone: "work", owner: "Technicy, po kolei", due: "2 dni" },
          { name: "Wykonane", icon: "clipboard", tone: "approve", owner: "Kierownik", due: "1 dzień", auto: "Wymaga daty wykonania" },
          { name: "Zamknięte", icon: "check", tone: "done", owner: "Kierownik", auto: "Przypomnienie przed serwisem" },
        ],
      },
      {
        department: "Jakość",
        process: "Obsługa niezgodności",
        situation: "Audytor pyta, kto sprawdził poprawkę z marca. Zaczyna się szukanie po folderach.",
        stages: [
          { name: "Zgłoszona", icon: "alert", tone: "intake", owner: "Produkcja" },
          { name: "Analiza", icon: "search", tone: "work", owner: "Dział jakości", due: "5 dni" },
          { name: "Działanie korygujące", icon: "wrench", tone: "work", owner: "Dział odpowiedzialny", due: "10 dni" },
          { name: "Weryfikacja", icon: "shield", tone: "approve", owner: "Dział jakości", due: "3 dni", auto: "Komentarz, gdy poprawka zawiedzie" },
          { name: "Zamknięta", icon: "check", tone: "done", owner: "Dział jakości", lock: "Zablokowana, z pełną historią" },
        ],
      },
    ],
  },
  ownership: {
    title: "Praca trafia na listę właściwej osoby.",
    description:
      "Ludzie zaczynają dzień od Moich zadań, gdzie na jednej liście mają wszystko, co do nich należy, ze wszystkich procesów. Nikt nie musi niczego przesyłać dalej, żeby praca została przekazana.",
    bullets: [
      "Przypisz krok do konkretnej osoby albo do całego zespołu",
      "Rozdzielaj pracę po kolei albo dawaj ją temu, kto ma najmniej zadań",
      "Pozwól osobie przekazującej wybrać, kto dostanie sprawę jako następny",
      "Przekaż zadanie innej osobie, gdy zmienią się plany, a zmiana zostanie w historii",
    ],
    image: {
      src: "/opero/processes/my-tasks.webp",
      alt: "Strona Moje zadania w Opero z otwartymi zadaniami z kilku procesów, ich etapami i terminami",
      width: 2000,
      height: 1400,
    },
  },
  approvals: {
    title: "Twoje zasady akceptacji, wbudowane w proces.",
    description:
      "Zasada „wszystko powyżej limitu idzie też do zarządu” zwykle żyje w głowie jednej osoby. W Opero jest częścią procesu, więc działa także w gorący piątek i wtedy, gdy tej osoby nie ma.",
    bullets: [
      "Pokazuj akcję tylko wtedy, gdy rekord spełnia warunek, na przykład powyżej określonej kwoty",
      "Wstrzymaj sprawę, dopóki wymagane informacje nie zostaną uzupełnione",
      "Wymagaj komentarza, gdy ktoś odrzuca albo odsyła sprawę",
      "Zdecyduj na każdym etapie, kto może edytować rekord, i zablokuj go tam, gdzie nie wolno go zmieniać",
    ],
    image: {
      src: "/opero/processes/transition-required-comment.webp",
      alt: "Odrzucanie wniosku urlopowego w Opero, w oknie, które wymaga komentarza przed wykonaniem przejścia",
      width: 1000,
      height: 700,
    },
  },
  deadlines: {
    title: "Co się dzieje, gdy zadanie leży zbyt długo.",
    description:
      "Każdy etap może mieć własny termin, a Ty decydujesz, co dzieje się wokół niego. Oto jedno z możliwych ustawień dla akceptacji w finansach, na którą są trzy dni.",
    moments: [
      { when: "Dzień przed", title: "Sygnał dla właściciela", detail: "Powiadomienie albo mail, póki jest jeszcze czas.", tone: "calm" },
      { when: "W dniu terminu", title: "Widać tam, gdzie ludzie patrzą", detail: "Na liście zadań i w kalendarzu, czyli tam, gdzie ludzie planują swój tydzień.", tone: "due" },
      { when: "Dzień po", title: "Kierownik zespołu dostaje informację", detail: "Od Opero, zanim ktokolwiek przyjdzie się poskarżyć.", tone: "late" },
      { when: "4 dni po", title: "Praca idzie dalej", detail: "Reguła przekazuje zadanie innej osobie, a zmiana trafia do historii.", tone: "late" },
    ],
    note: "Terminy i działania ustawiasz po swojemu: jedno przypomnienie albo kilka, dla każdego zadania albo tylko dla niektórych. Te same reguły mogą też wygenerować dokument, wysłać maila albo zaktualizować rekord.",
  },
  visibility: {
    title: "Zobacz, jak stoją sprawy, bez spotkania statusowego.",
    description:
      "Każdy proces może mieć własną tablicę z liczbą spraw na każdym etapie i właścicielem na każdej karcie. Wąskie gardła widać jako pełną kolumnę, a każdą kartę możesz otworzyć i sprawdzić dlaczego.",
    bullets: [
      "Dodaj tablicę obok tabeli na liście, z której zespół już korzysta",
      "Zobacz zadania z terminami w kalendarzu",
      "Każdy widzi swoje zadania, a wskazane osoby mogą widzieć zadania wszystkich",
      "Prowadź jeden proces w całej grupie spółek albo inny w każdej z nich",
    ],
    image: {
      src: "/opero/processes/process-board.webp",
      alt: "Tablica Opero ze zgłoszeniami klientów w kolumnach według etapów procesu, na każdej karcie priorytet, klient, kategoria, kanał i osoba odpowiedzialna",
      width: 2000,
      height: 1389,
    },
  },
  history: {
    title: "Gdy ktoś pyta, co się stało, odpowiedź jest na rekordzie.",
    description:
      "Pół roku później klient, audytor albo Twój szef pyta, kto się na to zgodził. Otwierasz rekord i śledzisz go od początku do końca, z osią czasu decyzji i mapą przebytej trasy.",
    bullets: [
      "Każde przejście z osobą, datą i komentarzem",
      "Zmiany właściciela po drodze",
      "Trasa narysowana na mapie procesu, krok po kroku",
      "Przejścia wykonane przez automatyzację albo integrację są tak oznaczone",
    ],
    image: {
      src: "/opero/processes/workflow-history.webp",
      alt: "Historia procesu w Opero dla jednego rekordu: trasa przez etapy obok osi czasu z przejściami",
      width: 2000,
      height: 1400,
    },
    magnifier: {
      src: "/opero/processes/workflow-history-magnifier.webp",
      alt: "Zbliżenie osi czasu historii: przejścia Submit Request i Send to Manager, każde z komentarzem i datą",
      width: 900,
      height: 900,
    },
  },
  faq: processesFaq,
  related: {
    title: "Zobacz też",
    items: [
      { feature: "lowCode", title: "Low-code i automatyzacja", description: "Reguły stojące za przypomnieniami, dokumentami i mailami oraz skrypty, gdy potrzeba więcej." },
      { feature: "documents", title: "Dokumenty", description: "Generuj dokumenty z szablonów i trzymaj je przy sprawie, której dotyczą." },
      { feature: "noCode", title: "Platforma no-code", description: "Zbuduj obiekty, formularze i menu, na których działają Twoje procesy." },
    ],
  },
  finalCta: {
    title: "Przynieś proces, który sprawia najwięcej kłopotów.",
    description: "Ten, który żyje w wątkach mailowych i w głowie jednej osoby. Na prezentacji rozrysujemy go razem w Opero i pokażemy, jak by działał.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Skontaktuj się z nami",
  },
  seoText: {
    title: "System workflow i BPM na jednej platformie z Twoimi danymi.",
    paragraphs: [
      "Opero to system workflow, który zamienia procesy w firmie w czytelne etapy, z właścicielem i terminem na każdym kroku. Obieg rysujesz na kanwie i przypinasz do własnych rekordów albo do kontrahentów, faktur, budżetów i zgłoszeń helpdesku. Akceptacje, przekazania i przypomnienia działają potem według ustawionych przez Ciebie zasad, a każda decyzja zostaje w historii rekordu.",
      "Zarządzanie procesami biznesowymi (BPM) w Opero nie wymaga programisty. Akceptacja wniosków, obieg faktur, obsługa zgłoszeń i procedury jakościowe korzystają z tych samych tablic kanban, list zadań, dokumentów i raportów, więc nowy proces nie oznacza nowego narzędzia.",
    ],
  },
};
