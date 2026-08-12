import { localizePath } from "@/lib/i18n/routes";
import type { AboutPageContent } from "../types";

export const aboutContent: AboutPageContent = {
  seo: {
    title: "O nas - twórcy systemu Opero",
    description:
      "Poznaj KodaSoft, zespół twórców Opero. Wieloletnie doświadczenie we wdrożeniach BPM, workflow, EOD, DMS i ERP zamienione w elastyczną platformę low-code.",
  },
  hero: {
    eyebrow: "O nas",
    title: "Jesteśmy zespołem, który buduje Opero",
    description:
      "Przez lata wdrażaliśmy systemy BPM, workflow, EOD, DMS, ERP, BI oraz platformy low-code i no-code. Poznaliśmy ich granice od środka. Opero to nasza odpowiedź: platforma, która zaczyna się tam, gdzie kończy się gotowe oprogramowanie.",
    primaryCta: "Umów demo",
    secondaryCta: "Zobacz funkcje systemu",
  },
  identity: {
    eyebrow: "Kim jesteśmy",
    title: "Wieloletnia praktyka wdrożeniowa zamieniona w jeden produkt.",
    paragraphs: [
      "KodaSoft to zespół wdrożeniowców i inżynierów. Nie zaczynaliśmy od pomysłu na oprogramowanie, tylko od setek godzin spędzonych u klientów: przy mapowaniu procesów, przy porządkowaniu obiegu dokumentów, przy próbach dopasowania sztywnego systemu do firmy, która właśnie się zmieniła.",
      "Każde takie wdrożenie zostawiało nam ten sam wniosek. Firmy nie potrzebują kolejnego zamkniętego systemu z listą funkcji. Potrzebują narzędzia, które da się ułożyć pod ich sposób pracy i przestawić, kiedy ten sposób się zmieni. Opero powstało po to, żeby to było możliwe bez przepisywania systemu od nowa.",
    ],
  },
  origin: {
    eyebrow: "Skąd wzięło się Opero",
    title: "Widzieliśmy, gdzie zatrzymują się gotowe systemy.",
    paragraphs: [
      "Wdrażaliśmy systemy klasy BPM i workflow, elektroniczne obiegi dokumentów (EOD), repozytoria DMS, platformy low-code i no-code, systemy ERP, a także narzędzia raportowe i BI. Różnych producentów, w różnych branżach, w firmach o bardzo różnej dojrzałości procesowej.",
      "To dało nam rzadką perspektywę: widzieliśmy nie tylko to, co te systemy potrafią, ale przede wszystkim to, gdzie się zatrzymują. Jeden świetnie prowadzi dokument przez akceptacje, ale nie pozwala opisać własnych danych. Drugi pozwala zbudować dowolny formularz, ale nie ma pod nim prawdziwego silnika procesów. Trzeci ma wszystko, tylko każda zmiana oznacza projekt, wycenę i kilka tygodni czekania.",
      "Za każdym razem granica przebiegała w tym samym miejscu: system był gotowy, a firma nie przestawała się zmieniać. W pewnym momencie przestaliśmy szukać systemu, który to udźwignie, i zaczęliśmy go budować. Tak powstało Opero.",
    ],
    manifesto:
      "Nie opisujemy Opero jako systemu kompletnego, bo nie jest to gotowe oprogramowanie, które się włącza i używa. Opero jest elastyczne, rośnie razem z firmą i wspiera ją na każdym etapie rozwoju.",
  },
  mission: {
    eyebrow: "Nasza misja",
    title: "Dajemy firmom system, który dopasowuje się do nich, a nie odwrotnie.",
    description:
      "Chcemy, żeby zmiana w firmie nie oznaczała projektu informatycznego. Nowy proces, nowy typ dokumentu, nowy dział czy nowa linia biznesowa mają być czymś, co konfigurujesz w Opero, a nie czymś, co zamawiasz u dostawcy. Naszą miarą sukcesu jest to, ile firma potrafi zrobić w Opero sama, a nie ile funkcji zdołaliśmy wymienić w ofercie.",
  },
  beliefs: {
    eyebrow: "W co wierzymy",
    title: "Sześć przekonań, które widać w produkcie.",
    description:
      "To nie są hasła na stronę. Każde z nich przekłada się na konkretną decyzję projektową w Opero i na to, jak prowadzimy wdrożenia.",
    items: [
      {
        title: "System ma rosnąć razem z firmą.",
        description:
          "Firma, która wdraża system, i ta sama firma trzy lata później to dwie różne organizacje. Opero projektujemy tak, żeby ta druga nie musiała zaczynać od nowa.",
      },
      {
        title: "Firma nie powinna dopasowywać się do oprogramowania.",
        description:
          "Gotowe systemy narzucają swoją strukturę danych i swój sposób pracy. W Opero to Ty definiujesz obiekty własne, pola, formularze i procesy, więc system mówi Twoim językiem.",
      },
      {
        title: "Zmiana nie może wymagać programisty.",
        description:
          "Nowy etap w procesie, dodatkowe pole, inny układ formularza czy nowa reguła to konfiguracja, nie wdrożenie. Dzięki temu system nadąża za firmą w tygodniach, nie kwartałach.",
      },
      {
        title: "Jeden system zamiast pięciu narzędzi.",
        description:
          "Procesy, dokumenty, pliki, dane operacyjne i raporty w jednym miejscu znaczą jedną historię, jedne uprawnienia i jedną prawdę o sprawie. Integracje mają uzupełniać całość, a nie zszywać ją z kawałków.",
      },
      {
        title: "Elastyczność bez chaosu.",
        description:
          "Swoboda konfiguracji ma sens tylko wtedy, gdy pod spodem są uprawnienia, historia zmian i kontrola wersji. Opero pozwala zbudować dużo, ale nie pozwala zgubić tego, co się wydarzyło.",
      },
      {
        title: "Wiedza wdrożeniowa jest częścią produktu.",
        description:
          "Każdy schemat, który sprawdził się u klienta, wraca do platformy jako gotowy wzorzec. Nasze doświadczenie ma być skrótem dla kolejnych firm, a nie zasobem sprzedawanym na godziny.",
      },
    ],
  },
  background: {
    eyebrow: "Doświadczenie, które wchodzi do produktu",
    title: "Każdy z tych obszarów zostawił ślad w platformie.",
    description:
      "Opero nie powstało w oderwaniu od rynku. Poniżej to, czego nauczyła nas praca z każdą z tych klas systemów.",
    rows: [
      {
        label: "BPM i workflow",
        lesson:
          "Procesy muszą być modelowane jako etapy i przejścia, z warunkami i odpowiedzialnością na każdym kroku. Bez tego akceptacje wracają do maili.",
      },
      {
        label: "EOD",
        lesson: "Dokument to nie plik, tylko sprawa z własnymi danymi, obiegiem i historią.",
      },
      {
        label: "DMS",
        lesson: "Wersjonowanie i kontrola dostępu do plików są warunkiem zaufania do systemu.",
      },
      {
        label: "Low-code",
        lesson: "Reguły i skrypty muszą być dostępne wtedy, gdy konfiguracja przestaje wystarczać, ale nie wcześniej.",
      },
      {
        label: "No-code",
        lesson:
          "Jeśli kluczowej zmiany nie da się zrobić bez dewelopera, system w praktyce zamarza w wersji z dnia wdrożenia.",
      },
      {
        label: "ERP",
        lesson:
          "Dane firmy muszą być spójne, ale sztywny model danych to dokładnie to, co najczęściej blokuje rozwój.",
      },
      {
        label: "BI i raportowanie",
        lesson:
          "Raport jest wart tyle, ile dane pod nim, więc porządek trzeba zrobić na poziomie procesu, a nie na poziomie wykresu.",
      },
    ],
  },
  approach: {
    eyebrow: "Jak pracujemy",
    title: "Cztery zasady, według których prowadzimy wdrożenia.",
    items: [
      {
        title: "Zaczynamy od procesu, nie od modułu.",
        description:
          "Najpierw rozumiemy, jak sprawa przechodzi przez firmę, a dopiero potem decydujemy, co konfigurujemy w Opero.",
      },
      {
        title: "Wdrażamy etapami i szybko pokazujemy działający system.",
        description:
          "Lepiej uruchomić jeden proces i sprawdzić go w praktyce, niż projektować całość na papierze przez pół roku.",
      },
      {
        title: "Uczymy klienta obsługiwać system samodzielnie.",
        description:
          "Chcemy, żeby po wdrożeniu firma potrafiła sama dodać pole, zmienić formularz i poprawić proces.",
      },
      {
        title: "Rozwijamy platformę na podstawie realnych wdrożeń.",
        description:
          "Roadmapa Opero powstaje z potrzeb, które widzimy u klientów, a nie z listy funkcji konkurencji.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Umów demo",
    title: "Zobacz Opero w działaniu",
    description:
      "Najszybszy sposób, żeby ocenić, czy Opero pasuje do Twojej firmy, to zobaczyć je na Twoim procesie. Pokażemy, jak wygląda w nim obieg, który dziś prowadzisz w mailach i arkuszach.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj funkcje systemu",
  },
  seoText: {
    eyebrow: "KodaSoft i Opero",
    title: "Producent platformy low-code do procesów i dokumentów.",
    paragraphs: [
      "KodaSoft jest producentem Opero, platformy low-code do zarządzania procesami, dokumentami i danymi firmy. Zespół tworzący system ma za sobą wieloletnie wdrożenia oprogramowania klasy BPM, workflow, EOD, DMS i ERP, a także narzędzi raportowych i BI. To doświadczenie jest dziś fundamentem produktu: wiemy, jak w praktyce wygląda obieg akceptacji, rejestracja dokumentów, praca na wielu działach i moment, w którym firma przerasta swój system.",
      "Opero projektujemy jako platformę, a nie zamknięte oprogramowanie. Organizacja definiuje w nim własne obiekty, pola, formularze, układy i procesy, więc system opisuje jej rzeczywistość, zamiast narzucać schemat producenta. Zmiana konfiguracji nie wymaga programisty, dzięki czemu nowy proces czy nowy typ dokumentu uruchamiasz wtedy, kiedy jest potrzebny.",
      "Wierzymy, że system informatyczny ma rosnąć razem z firmą i wspierać ją na każdym etapie rozwoju: od pierwszego uporządkowanego obiegu dokumentów, przez automatyzację pracy kolejnych działów, po pełną kontrolę nad procesami i danymi w całej organizacji.",
    ],
  },
  faq: {
    eyebrow: "Częste pytania",
    title: "O KodaSoft i Opero",
    items: [
      {
        question: "Kto tworzy system Opero?",
        answer:
          "Opero powstaje w KodaSoft, zespole z wieloletnim doświadczeniem we wdrażaniu systemów BPM, workflow, EOD, DMS, ERP oraz platform low-code i no-code.",
      },
      {
        question: "Czym Opero różni się od gotowego systemu ERP lub EOD?",
        answer:
          "Opero nie narzuca własnego modelu danych ani procesów. Firma definiuje obiekty własne, formularze i obiegi, więc system dopasowuje się do jej sposobu pracy i zmienia razem z nią.",
      },
      {
        question: "Czy Opero jest gotowym oprogramowaniem?",
        answer:
          "Opero to platforma z gotowymi mechanizmami procesów, dokumentów, uprawnień i raportów, którą konfiguruje się pod konkretną firmę. Dlatego opisujemy je jako elastyczne, a nie kompletne w sensie zamkniętej listy funkcji.",
      },
      {
        question: "Czy do zmian w systemie potrzebny jest programista?",
        answer:
          "Nie. Obiekty, formularze, układy, procesy i reguły konfiguruje się bez kodu, a mechanizmy low-code są dostępne wtedy, gdy potrzebna jest niestandardowa logika.",
      },
    ],
  },
};

export const aboutCtas = {
  primary: localizePath("pl", "contact"),
  secondary: localizePath("pl", "opero"),
};
