import type { PrivacyContent } from "../types";

/**
 * Polityka prywatności.
 *
 * Każde zdanie tutaj opisuje to, co serwis faktycznie robi - ustalone przez
 * przeczytanie kodu, nie przez przepisanie cudzego wzoru:
 *
 * - `app/api/contact/route.ts` wysyła zgłoszenie mailem przez Resend i nie
 *   zapisuje go nigdzie po stronie serwisu; pola i ich limity są tam widoczne.
 * - Google Analytics jest ładowane dopiero po zgodzie, a wybór użytkownika
 *   zostaje zapisany w `localStorage` i można go zmienić w stopce.
 * - `next/font/google` osadza krój Sora w czasie budowania, więc przeglądarka
 *   czytelnika nie łączy się z serwerami Google.
 * - Jedyny pomiar to `@vercel/speed-insights`, który nie używa ciasteczek.
 *
 *
 * OTWARTE: identyfikacja administratora. Dokument mówi "KodaSoft", bo spółka
 * nie jest jeszcze zarejestrowana i podanie formy prawnej byłoby twierdzeniem
 * o podmiocie, który nie istnieje. RODO wymaga jednak wskazania administratora
 * wraz z danymi identyfikującymi. Po rejestracji (planowo październik 2026)
 * trzeba uzupełnić punkt 1 o pełną nazwę, adres siedziby i numery NIP/KRS -
 * i dopiero wtedy dokument jest kompletny w rozumieniu art. 13 RODO.
 * Jeżeli którakolwiek z tych rzeczy się zmieni - dojdzie analityka, baza
 * zgłoszeń, zewnętrzny czat - ten dokument trzeba zmienić razem z nią.
 */
export const privacyContent: PrivacyContent = {
  seo: {
    title: "Polityka prywatności",
    description:
      "Jak KodaSoft przetwarza dane z formularza kontaktowego i analityki opartej na zgodzie: zakres, cele, odbiorcy, okresy przechowywania i prawa użytkownika.",
  },
  hero: {
    eyebrow: "Dokumenty",
    title: "Polityka prywatności",
    description:
      "Ten serwis korzysta z Google Analytics wyłącznie po wyrażeniu zgody. Bez niej skrypt Google Analytics nie jest ładowany i nie są zapisywane analityczne pliki cookies.",
  },
  updatedLabel: "Ostatnia aktualizacja",
  updatedAt: "2026-09-02",
  sections: [
    {
      heading: "1. Administrator danych",
      paragraphs: [
        "Administratorem danych osobowych przekazanych przez ten serwis jest KodaSoft, twórca platformy Opero.",
        "We wszystkich sprawach dotyczących danych osobowych - w tym w celu skorzystania z praw opisanych w punkcie 8 - prosimy o kontakt na adres kontakt@kodasoft.pl lub telefonicznie pod numerem +48 666 618 026.",
        "Nie wyznaczyliśmy Inspektora Ochrony Danych. Nie mamy takiego obowiązku: nie przetwarzamy danych na dużą skalę, nie monitorujemy osób w sposób regularny i systematyczny ani nie przetwarzamy szczególnych kategorii danych.",
      ],
    },
    {
      heading: "2. Jakie dane zbieramy",
      paragraphs: [
        "Formularz kontaktowy to jedyne miejsce w serwisie, w którym prosimy o dane osobowe. Przesyłają Państwo:",
      ],
      list: [
        "imię i nazwisko - pole wymagane,",
        "adres e-mail - pole wymagane,",
        "treść wiadomości - pole wymagane,",
        "nazwę firmy - pole opcjonalne,",
        "numer telefonu - pole opcjonalne,",
        "temat zapytania wybrany z listy - pole opcjonalne.",
      ],
    },
    {
      heading: "3. Dane techniczne wysyłane automatycznie",
      paragraphs: [
        "Razem ze zgłoszeniem przekazywane są dwie informacje, o które formularz nie pyta wprost: wersja językowa serwisu oraz adres podstrony, z której formularz został wysłany. Służą wyłącznie temu, żebyśmy wiedzieli, w jakim języku odpowiedzieć i jakiego zagadnienia dotyczy zapytanie.",
        "Formularz zawiera także ukryte pole-pułapkę, niewidoczne dla człowieka. Wypełniają je automaty rozsyłające spam. Jeżeli pole jest wypełnione, zgłoszenie jest odrzucane i nie dociera do nikogo. Nie jest to przetwarzanie danych osobowych - sprawdzamy wyłącznie, czy pole pozostało puste.",
        "Nasz dostawca hostingu prowadzi standardowe logi serwera, obejmujące adres IP, datę i godzinę zapytania oraz typ przeglądarki. Są to dane techniczne konieczne do świadczenia usługi i zapewnienia bezpieczeństwa; nie łączymy ich z danymi z formularza i nie wykorzystujemy do identyfikowania odwiedzających.",
        "Jeżeli wyrażą Państwo zgodę na analitykę, Google Analytics otrzyma dane techniczne i informacje o korzystaniu z serwisu, takie jak adres odwiedzanej strony, aktywność w sesji, przybliżona lokalizacja oraz typ przeglądarki i urządzenia. Google używa adresu IP podczas zbierania danych do określenia przybliżonej lokalizacji, a następnie usuwa go przed zapisaniem danych w Analytics.",
      ],
    },
    {
      heading: "4. Po co przetwarzamy dane i na jakiej podstawie",
      rows: [
        {
          term: "Odpowiedź na zapytanie i ewentualna rozmowa handlowa",
          description:
            "Podstawą jest nasz prawnie uzasadniony interes - art. 6 ust. 1 lit. f RODO - polegający na obsłudze korespondencji skierowanej do nas. Jeżeli rozmowa doprowadzi do współpracy, podstawą staje się art. 6 ust. 1 lit. b RODO, czyli działania podejmowane przed zawarciem umowy.",
        },
        {
          term: "Zgoda na kontakt zaznaczana przy wysyłce formularza",
          description:
            "Art. 6 ust. 1 lit. a RODO. Zgodę można wycofać w każdej chwili, pisząc na kontakt@kodasoft.pl. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania, którego dokonano przed jej wycofaniem.",
        },
        {
          term: "Bezpieczeństwo serwisu i ochrona przed nadużyciami",
          description:
            "Prawnie uzasadniony interes - art. 6 ust. 1 lit. f RODO - polegający na utrzymaniu serwisu w działaniu i odfiltrowaniu zgłoszeń automatycznych.",
        },
        {
          term: "Pomiar odwiedzin i sposobu korzystania z serwisu za pomocą Google Analytics",
          description:
            "Państwa zgoda - art. 6 ust. 1 lit. a RODO. Analityka pozostaje wyłączona do czasu jej zaakceptowania, a zgodę można w każdej chwili wycofać w Ustawieniach analityki w stopce.",
        },
        {
          term: "Obowiązki wynikające z przepisów",
          description:
            "Art. 6 ust. 1 lit. c RODO, jeżeli przepisy - na przykład podatkowe lub rachunkowe - nakażą nam zachowanie określonych dokumentów.",
        },
      ],
    },
    {
      heading: "5. Jak długo przechowujemy dane",
      paragraphs: [
        "Zgłoszenie z formularza trafia do naszej skrzynki pocztowej jako wiadomość e-mail. Serwis nie zapisuje go w żadnej bazie danych - po wysłaniu wiadomości nie pozostaje po nim ślad po stronie strony internetowej.",
        "Korespondencję, która nie doprowadziła do współpracy, usuwamy najpóźniej po 24 miesiącach od ostatniego kontaktu.",
        "Jeżeli doszło do zawarcia umowy, dane związane z jej wykonaniem przechowujemy przez okres wymagany przepisami - w szczególności podatkowymi i rachunkowymi - a następnie do upływu terminów przedawnienia roszczeń.",
        "Logi serwera przechowuje nasz dostawca hostingu zgodnie ze swoją polityką retencji, standardowo przez okres liczony w dniach.",
        "Wybór dotyczący analityki pozostaje w pamięci lokalnej przeglądarki do czasu jego zmiany lub usunięcia danych witryny. Pliki cookies Google Analytics domyślnie wygasają po maksymalnie dwóch latach; wycofanie zgody wyłącza Analytics i usuwa jego pliki cookies z tego serwisu.",
        "Dane analityczne na poziomie użytkownika i zdarzenia są przechowywane w Google Analytics wyłącznie przez okres retencji skonfigurowany dla usługi, w granicach dostępnych dla standardowego konta Google Analytics.",
      ],
    },
    {
      heading: "6. Komu powierzamy dane",
      paragraphs: [
        "Nie sprzedajemy danych i nie udostępniamy ich w celach marketingowych. Korzystamy z następujących dostawców:",
      ],
      rows: [
        {
          term: "Vercel Inc.",
          description:
            "Hosting serwisu i pomiar szybkości ładowania stron. Przetwarza dane techniczne opisane w punkcie 3.",
        },
        {
          term: "Resend (Plus Five Five, Inc.)",
          description:
            "Dostarczenie wiadomości e-mail wygenerowanej przez formularz kontaktowy. Przetwarza dane, które wpisali Państwo w formularzu, wyłącznie w celu przesłania ich do naszej skrzynki.",
        },
        {
          term: "Google Ireland Limited",
          description:
            "Google Analytics, ładowane wyłącznie po wyrażeniu zgody, mierzy odwiedziny i sposób korzystania z serwisu. Przechowywanie reklamowe, dane użytkownika na potrzeby reklam, personalizacja reklam i Google signals są wyłączone w konfiguracji tagu serwisu.",
        },
      ],
    },
    {
      heading: "7. Przekazywanie danych poza Europejski Obszar Gospodarczy",
      paragraphs: [
        "Vercel i Resend mają siedziby w Stanach Zjednoczonych. Usługę Google Analytics świadczy w Europie Google Ireland Limited, która może korzystać z podmiotów powiązanych i podwykonawców w innych krajach. Dane mogą być zatem przetwarzane poza Europejskim Obszarem Gospodarczym.",
        "Przekazywanie odbywa się na podstawie zabezpieczeń przewidzianych w rozdziale V RODO - standardowych klauzul umownych zatwierdzonych przez Komisję Europejską lub decyzji o odpowiednim stopniu ochrony dotyczącej Ram Ochrony Danych UE-USA - określonych w umowach powierzenia przetwarzania zawartych z tymi dostawcami.",
        "Kopię zastosowanych zabezpieczeń udostępnimy na żądanie przesłane na adres kontakt@kodasoft.pl.",
      ],
    },
    {
      heading: "8. Państwa prawa",
      paragraphs: ["W odniesieniu do swoich danych mają Państwo prawo do:"],
      list: [
        "dostępu do danych oraz otrzymania ich kopii,",
        "sprostowania danych nieprawidłowych lub uzupełnienia niekompletnych,",
        "usunięcia danych,",
        "ograniczenia przetwarzania,",
        "wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,",
        "przenoszenia danych przetwarzanych na podstawie zgody lub umowy,",
        "wycofania zgody w dowolnym momencie, bez wpływu na zgodność z prawem wcześniejszego przetwarzania,",
        "wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.",
      ],
    },
    {
      heading: "9. Czy podanie danych jest obowiązkowe",
      paragraphs: [
        "Podanie danych jest całkowicie dobrowolne, ale bez imienia, adresu e-mail i treści wiadomości nie będziemy w stanie odpowiedzieć na zapytanie. Pozostałe pola można pominąć.",
        "Zgoda na analitykę jest dobrowolna, a jej odmowa nie wpływa na dostęp do serwisu. Nie podejmujemy decyzji w sposób zautomatyzowany i nie używamy Analytics do tworzenia indywidualnych profili marketingowych.",
      ],
    },
    {
      heading: "10. Pliki cookies i technologie śledzące",
      paragraphs: [
        "Serwis zapisuje wybór dotyczący analityki w pamięci lokalnej przeglądarki, aby respektować go podczas kolejnych wizyt. Ta preferencja jest niezbędna do zapamiętania, czy Google Analytics może zostać załadowane.",
        "Google Analytics działa w podstawowym trybie zgody: dopóki nie wybiorą Państwo opcji „Zgadzam się na analitykę”, skrypt Google nie jest pobierany, żadne dane nie są wysyłane do Google Analytics i nie są zapisywane analityczne pliki cookies.",
        "Po wyrażeniu zgody Google Analytics może zapisać własne pliki cookies _ga i _ga_<identyfikator-pomiaru>, aby rozróżniać użytkowników i zachować stan sesji. Domyślnie wygasają po maksymalnie dwóch latach, z uwzględnieniem ograniczeń przeglądarki.",
        "Zgodę można w każdej chwili udzielić lub wycofać w Ustawieniach analityki w stopce. Wycofanie zgody wyłącza dalsze zbieranie danych przez Analytics i usuwa pliki cookies Google Analytics dostępne dla tego serwisu.",
        "Krój pisma używany w serwisie jest osadzony na naszym serwerze w czasie budowania strony. Przeglądarka nie łączy się w tym celu z serwerami firm trzecich.",
        "Vercel Speed Insights również zbiera anonimowe wskaźniki szybkości ładowania stron - takie jak czas wyświetlenia największego elementu. Narzędzie nie używa ciasteczek i nie pozwala zidentyfikować pojedynczej osoby.",
      ],
    },
    {
      heading: "11. Odnośniki do serwisów zewnętrznych",
      paragraphs: [
        "W serwisie znajdują się odnośniki do stron zewnętrznych, w tym do profilu KodaSoft na LinkedIn oraz do dokumentacji technicznej. Po ich otwarciu obowiązują polityki prywatności tych serwisów, na które nie mamy wpływu.",
      ],
    },
    {
      heading: "12. Zmiany polityki",
      paragraphs: [
        "Politykę aktualizujemy, gdy zmienia się sposób działania serwisu - na przykład gdy dochodzi nowe narzędzie przetwarzające dane. Data ostatniej aktualizacji jest podana na początku dokumentu.",
        "Wcześniejsze wersje udostępnimy na żądanie przesłane na adres kontakt@kodasoft.pl.",
      ],
    },
  ],
};
