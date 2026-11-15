import type { ToolPageContent, WhiteListLabels } from "@/content/types";

export const whiteListPage: ToolPageContent = {
  seo: {
    title: "Biała lista VAT - sprawdź NIP i rachunek",
    description:
      "Sprawdź kontrahenta na białej liście VAT po NIP: status VAT, dane firmy i rachunki z wykazu. Zweryfikuj konto przed przelewem i wydrukuj potwierdzenie.",
  },
  navLabel: "Biała lista VAT",
  navDescription: "Sprawdź kontrahenta i jego rachunek bankowy po NIP, zanim zlecisz przelew.",
  hero: {
    title: "Sprawdź kontrahenta na białej liście VAT",
    description:
      "Wpisz NIP, a zobaczysz status VAT firmy i rachunki z wykazu podatników VAT. Dodaj numer konta, żeby sprawdzić je przed przelewem.",
  },
  explainer: {
    title: "Po co sprawdzać kontrahenta na białej liście",
    paragraphs: [
      "Biała lista to wykaz podatników VAT prowadzony przez Szefa Krajowej Administracji Skarbowej. Pokazuje status VAT firmy i rachunki bankowe, które zgłosiła do urzędu.",
      "Jeśli za jedną transakcję powyżej 15 000 zł płacisz na rachunek spoza wykazu, nie zaliczysz tej płatności do kosztów podatkowych i odpowiadasz solidarnie za VAT kontrahenta. Liczy się stan wykazu z dnia zlecenia przelewu.",
      "Tych skutków unikniesz, płacąc w mechanizmie podzielonej płatności albo składając zawiadomienie ZAW-NR do urzędu skarbowego kontrahenta w ciągu 7 dni od zlecenia przelewu.",
      "Rachunki wirtualne, na przykład do płatności masowych, nie są wypisane w wykazie wprost. Wpisz numer konta w polu obok NIP, a wykaz sprawdzi go także wśród rachunków wirtualnych.",
    ],
    table: {
      caption: "Co oznacza wynik",
      columns: ["Wynik", "Co to znaczy"],
      rows: [
        ["Czynny", "Firma jest zarejestrowana jako czynny podatnik VAT."],
        ["Zwolniony", "Firma jest w rejestrze VAT, ale korzysta ze zwolnienia. Jej faktury zwykle nie zawierają VAT."],
        ["Brak w wykazie", "Firma nie jest zarejestrowana do VAT albo została wykreślona. Sprawdź, czy faktura z VAT jest zasadna."],
        ["Rachunek na liście", "Przelew na ten rachunek nie grozi utratą kosztów ani odpowiedzialnością solidarną."],
        ["Rachunku brak na liście", "Przy płatności powyżej 15 000 zł zapłać w MPP albo złóż ZAW-NR w ciągu 7 dni."],
      ],
    },
  },
  sources: {
    title: "Podstawa prawna i źródła",
    updatedLabel: "Zasady aktualne na:",
    updatedAt: "2026-11-15",
    note: "Narzędzie ma charakter informacyjny. Wiążący jest wykaz podatników VAT prowadzony przez Szefa KAS.",
    items: [
      { label: "Wyszukiwarka wykazu podatników VAT (podatki.gov.pl)", href: "https://www.podatki.gov.pl/wykaz-podatnikow-vat-wyszukiwarka" },
      { label: "API wykazu podatników VAT (Ministerstwo Finansów)", href: "https://wl-api.mf.gov.pl" },
      { label: "Art. 96b ustawy o podatku od towarów i usług (wykaz podatników VAT)" },
      { label: "Art. 15d ust. 1 pkt 3 ustawy o CIT i art. 22p ust. 1 pkt 3 ustawy o PIT (koszty podatkowe)" },
      { label: "Art. 117ba Ordynacji podatkowej (odpowiedzialność solidarna, zawiadomienie ZAW-NR)" },
      { label: "Art. 19 ustawy Prawo przedsiębiorców (próg 15 000 zł)" },
    ],
  },
  faq: {
    title: "Częste pytania",
    items: [
      {
        question: "Jak udowodnić, że sprawdziłem kontrahenta?",
        answer:
          "Każde sprawdzenie dostaje z wykazu identyfikator zapytania. Zapisz go albo wydrukuj potwierdzenie i dołącz do dokumentów płatności. Na wydruku jest data stanu wykazu i godzina sprawdzenia.",
      },
      {
        question: "Ile razy dziennie mogę sprawdzić NIP?",
        answer:
          "Ministerstwo Finansów ogranicza liczbę zapytań z jednego adresu w ciągu dnia. Zapytania idą prosto z Twojej przeglądarki do wykazu, więc limit dotyczy tylko Ciebie. Po jego wyczerpaniu skorzystaj z wyszukiwarki na podatki.gov.pl.",
      },
      {
        question: "Czy mogę sprawdzić stan wykazu z przeszłości?",
        answer: "Tak. Zmień datę, a zobaczysz stan wykazu z wybranego dnia, na przykład z dnia zlecenia przelewu.",
      },
      {
        question: "Czy KodaSoft widzi NIP i numer konta, które wpisuję?",
        answer:
          "Nie. Zapytanie wysyła Twoja przeglądarka bezpośrednio do API Ministerstwa Finansów. Nie przechodzi przez nasze serwery i niczego nie zapisujemy.",
      },
    ],
  },
  opero: {
    title: "Opero sprawdza kontrahentów za Ciebie",
    body: "Gdy do Opero trafia faktura kosztowa, system sam sprawdza kontrahenta i jego rachunek na białej liście, a potem jeszcze raz przed zleceniem płatności.",
    primaryCta: "Umów demo",
    secondaryCta: "Integracje w Opero",
  },
  otherToolsTitle: "Inne narzędzia",
};

export const whiteListLabels: WhiteListLabels = {
  nipLabel: "NIP",
  nipPlaceholder: "np. 526 025 02 74",
  accountLabel: "Numer rachunku (opcjonalnie)",
  accountHint: "26 cyfr, spacje nie przeszkadzają. Sprawdzimy też rachunki wirtualne.",
  accountPlaceholder: "np. 59 1010 1010 0075 9122 2200 0000",
  dateLabel: "Stan na dzień",
  dateHint: "Puste pole oznacza dzisiaj.",
  submit: "Sprawdź w wykazie",
  checking: "Sprawdzam…",
  privacyNote: "Zapytanie idzie prosto do Ministerstwa Finansów. Nic nie zapisujemy.",
  errors: {
    nip: "To nie jest poprawny NIP. Sprawdź, czy ma 10 cyfr i nie ma literówki.",
    account: "To nie jest poprawny numer rachunku. Polski numer ma 26 cyfr.",
    date: "Wybierz dzisiejszą lub wcześniejszą datę.",
    network: "Nie udało się połączyć z wykazem Ministerstwa Finansów. Spróbuj za chwilę albo",
    limit: "Wykorzystano dzienny limit zapytań do wykazu z tego adresu. Spróbuj jutro albo",
    api: "Wykaz zwrócił błąd: {message}. Spróbuj ponownie albo",
  },
  result: {
    title: "Wynik sprawdzenia",
    notFound: "Tego NIP nie ma w wykazie podatników VAT",
    notFoundHint:
      "Firma nie jest zarejestrowana jako podatnik VAT albo została z rejestru wykreślona w wybranym dniu. Jeśli wystawia faktury z VAT, wyjaśnij to przed zapłatą.",
    statuses: {},
    statusLabel: "Status VAT",
    nipLabel: "NIP",
    regonLabel: "REGON",
    krsLabel: "KRS",
    residenceLabel: "Adres siedziby",
    workingLabel: "Adres prowadzenia działalności",
    registeredLabel: "Data rejestracji jako podatnik VAT",
    removedLabel: "Wykreślenie z rejestru",
    restoredLabel: "Przywrócenie do rejestru",
    deniedLabel: "Odmowa rejestracji",
    representativesLabel: "Reprezentanci",
    partnersLabel: "Wspólnicy",
    accountsLabel: "Rachunki w wykazie",
    noAccounts: "Firma nie ma zgłoszonych rachunków w wykazie.",
    virtualAccounts: "Firma ma też rachunki wirtualne. Nie są wypisane powyżej; wpisz numer konta, żeby go sprawdzić.",
    accountYes: "Ten rachunek jest w wykazie dla tego NIP.",
    accountNo: "Tego rachunku nie ma w wykazie dla tego NIP. Przy płatności powyżej 15 000 zł zapłać w MPP albo złóż ZAW-NR.",
    stateOnLabel: "Stan wykazu na dzień",
    requestIdLabel: "Identyfikator zapytania",
    checkedAtLabel: "Sprawdzono (czas polski)",
    copyId: "Kopiuj identyfikator",
    copied: "Skopiowano",
    print: "Drukuj potwierdzenie",
    printTitle: "Potwierdzenie sprawdzenia w wykazie podatników VAT",
    printSource: "Źródło: wykaz podatników VAT Szefa KAS, API Ministerstwa Finansów (wl-api.mf.gov.pl).",
    officialSearch: "użyj wyszukiwarki Ministerstwa Finansów.",
  },
};
