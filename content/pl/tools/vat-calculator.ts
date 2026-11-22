import type { ToolPageContent, VatCalculatorLabels } from "@/content/types";

export const vatCalculatorPage: ToolPageContent = {
  seo: {
    title: "Kalkulator VAT - netto brutto online",
    description:
      "Kalkulator VAT online: przelicz netto na brutto i brutto na netto dla stawek 23%, 8% i 5%. Policz VAT całej faktury od sumy lub od każdej pozycji.",
  },
  navLabel: "Kalkulator VAT",
  navDescription: "Przelicz netto, VAT i brutto dla każdej stawki, także dla całej faktury.",
  hero: {
    title: "Kalkulator VAT",
    description:
      "Przelicz netto na brutto i brutto na netto dla każdej stawki VAT. Dla faktury z kilkoma pozycjami policzysz VAT od sumy albo od każdej pozycji.",
  },
  explainer: {
    title: "Jak obliczyć VAT: netto, brutto i kwota podatku",
    paragraphs: [
      "VAT to procent od kwoty netto. Brutto to netto plus VAT. Kwotę VAT zaokrągla się do pełnego grosza: końcówki poniżej pół grosza się pomija, a od pół grosza w górę zaokrągla do pełnego grosza.",
      "Na fakturze z kilkoma pozycjami VAT najczęściej liczy się od sumy wartości netto w każdej stawce. Liczenie go przy każdej pozycji osobno i sumowanie może dać różnicę kilku groszy.",
      "Gdy ceny są podane brutto, na przykład w sprzedaży dla konsumentów, VAT wylicza się z kwoty brutto: brutto razy stawka, podzielone przez sto plus stawkę.",
    ],
    table: {
      caption: "Wzory dla stawki 23%",
      columns: ["Co liczysz", "Wzór"],
      rows: [
        ["Netto na brutto", "brutto = netto × 1,23"],
        ["Brutto na netto", "netto = brutto ÷ 1,23"],
        ["VAT z netto", "VAT = netto × 0,23"],
        ["VAT z brutto", "VAT = brutto × 23 ÷ 123"],
      ],
    },
  },
  sources: {
    title: "Podstawa prawna",
    updatedLabel: "Zasady aktualne na:",
    updatedAt: "2026-11-15",
    note: "Kalkulator ma charakter informacyjny. Stawkę dla konkretnego towaru lub usługi sprawdź w ustawie o VAT albo z księgowym.",
    items: [
      { label: "Art. 41 i art. 146ef ustawy o podatku od towarów i usług (stawki 23%, 8%, 5% i 0%)" },
      { label: "Art. 106e ust. 11 ustawy o VAT (zaokrąglanie kwot podatku do pełnych groszy)" },
      { label: "Art. 106e ust. 7 i 8 ustawy o VAT (faktury z cenami brutto)" },
    ],
  },
  faq: {
    title: "Częste pytania",
    items: [
      {
        question: "Ile to jest 1000 zł netto w brutto?",
        answer: "Przy stawce 23% 1000 zł netto to 1230 zł brutto. Przy stawce 8% to 1080 zł, a przy 5% to 1050 zł.",
      },
      {
        question: "VAT od sumy czy od każdej pozycji?",
        answer:
          "Najczęściej od sumy wartości netto w danej stawce. Część programów liczy VAT przy każdej pozycji i sumuje, przez co wynik może różnić się o kilka groszy. Tryb faktury pokazuje obie wersje.",
      },
      {
        question: "Dlaczego niektórej kwoty brutto nie da się uzyskać?",
        answer:
          "VAT jest zaokrąglany do grosza, więc przy kolejnych kwotach netto brutto rośnie o jeden albo dwa grosze. Kalkulator podpowie wtedy najbliższe kwoty netto.",
      },
      {
        question: "Co oznaczają zw. i np.?",
        answer:
          "„zw.” to sprzedaż zwolniona z VAT, „np.” to sprzedaż niepodlegająca opodatkowaniu w Polsce. W obu przypadkach na fakturze nie ma kwoty VAT, a brutto równa się netto.",
      },
    ],
  },
  opero: {
    title: "W Opero faktura liczy się sama",
    body: "Opero wylicza VAT, sumy i kwotę słownie na fakturach i dokumentach z danych, które już są w systemie.",
    primaryCta: "Umów demo",
    secondaryCta: "Dokumenty w Opero",
    points: [
      { title: "Sumy z pozycji", body: "Netto, VAT i brutto sumują się z pozycji faktury, więc nikt nie przepisuje kwot." },
      { title: "Wysyłka do KSeF", body: "Faktury sprzedaży trafiają do KSeF prosto z Opero, a przyjętej faktury nie da się już zmienić." },
      { title: "PDF z Twojego szablonu", body: "Opublikowany szablon zamienia fakturę w PDF z Twoim nagłówkiem, sumami i kwotą słownie." },
    ],
  },
  otherToolsTitle: "Inne narzędzia",
};

export const vatCalculatorLabels: VatCalculatorLabels = {
  modeLabel: "Tryb kalkulatora",
  modes: { quick: "Szybkie przeliczenie", invoice: "Faktura z pozycjami" },
  rateLegend: "Stawka VAT",
  rates: { "23": "23%", "8": "8%", "5": "5%", "0": "0%", zw: "zw.", np: "np." },
  net: "Netto",
  vat: "VAT",
  gross: "Brutto",
  notApplicable: "nie dotyczy",
  hint: "Wpisz kwotę w dowolnym polu. Pozostałe przeliczą się same.",
  wordsLabel: "Brutto słownie",
  copyAmounts: "Kopiuj kwoty",
  copySummary: "Kopiuj podsumowanie",
  copied: "Skopiowano",
  formula: "VAT = netto × {rate}, zaokrąglony do grosza",
  formulaNoVat: "Bez VAT: brutto = netto",
  nearest:
    "Przy stawce {rate} żadna kwota netto nie daje dokładnie {gross} zł brutto. Najbliżej: netto {belowNet} zł daje {belowGross} zł, a netto {aboveNet} zł daje {aboveGross} zł. Powyżej VAT wyliczony z brutto.",
  errors: {
    invalid: "Wpisz kwotę, na przykład 1 234,56.",
    noVat: "Przy tej stawce nie ma VAT. Wpisz netto albo brutto.",
  },
  largePayment: {
    before: "Ponad 15 000 zł brutto: przed przelewem",
    link: "sprawdź rachunek na białej liście VAT",
    after: ", a przy towarach z załącznika 15 do ustawy o VAT zapłać w mechanizmie podzielonej płatności.",
  },
  priceBasisLabel: "Ceny pozycji:",
  priceBasis: { net: "netto", gross: "brutto" },
  columns: {
    name: "Nazwa",
    quantity: "Ilość",
    priceNet: "Cena netto",
    priceGross: "Cena brutto",
    rate: "Stawka",
    net: "Netto",
    vat: "VAT",
    gross: "Brutto",
  },
  cellLabel: "{column}, pozycja {n}",
  removeRow: "Usuń pozycję",
  addRow: "Dodaj pozycję",
  methodLabel: "VAT liczony:",
  methods: { sumNet: "od sumy netto w stawce", sumGross: "od sumy brutto w stawce", line: "od każdej pozycji" },
  summaryCaption: "Podsumowanie według stawek",
  totals: "Razem netto {net} · VAT {vat}",
  amountDue: "Do zapłaty",
  difference: "Liczony {other} VAT wyniósłby {vat}, czyli o {diff} {direction}.",
  otherMethod: { sum: "od sumy w stawce", line: "od każdej pozycji" },
  more: "więcej",
  less: "mniej",
  privacyNote: "Liczy się w Twojej przeglądarce. Nic nie wysyłamy.",
  currency: "zł",
  decimalSeparator: ",",
  copyText: { rate: "Stawka", total: "Razem" },
  defaultAmount: "1 000,00",
  defaultRows: [
    { name: "Konsultacja", price: "33,33" },
    { name: "Licencja", price: "33,33" },
    { name: "Wsparcie", price: "33,33" },
  ],
};
