import type { PrivacyContent } from "../types";

/**
 * Polityka prywatności.
 *
 * Każde zdanie tutaj opisuje to, co serwis faktycznie robi - ustalone przez
 * przeczytanie kodu, nie przez przepisanie cudzego wzoru:
 *
 * - `app/api/contact/route.ts` wysyła zgłoszenie mailem przez Resend i nie
 *   zapisuje go nigdzie po stronie serwisu; pola i ich limity są tam widoczne.
 * - Nie ma ani jednego wywołania `document.cookie`, `localStorage` czy
 *   `sessionStorage` w całym repozytorium.
 * - `next/font/google` osadza krój Sora w czasie budowania, więc przeglądarka
 *   czytelnika nie łączy się z serwerami Google.
 * - Jedyny pomiar to `@vercel/speed-insights`, który nie używa ciasteczek.
 *
 * Jeżeli którakolwiek z tych rzeczy się zmieni - dojdzie analityka, baza
 * zgłoszeń, zewnętrzny czat - ten dokument trzeba zmienić razem z nią.
 */
export const privacyContent: PrivacyContent = {
  seo: {
    title: "Polityka prywatności",
    description:
      "Jak KodaSoft przetwarza dane osobowe przekazane przez formularz kontaktowy: zakres, cele, podstawy prawne, odbiorcy, okresy przechowywania i prawa osoby, której dane dotyczą.",
  },
  hero: {
    eyebrow: "Dokumenty",
    title: "Polityka prywatności",
    description:
      "Ten serwis nie używa plików cookies, nie profiluje odwiedzających i nie prowadzi analityki reklamowej. Dane osobowe zbieramy wyłącznie wtedy, gdy sami je Państwo prześlą przez formularz kontaktowy.",
  },
  updatedLabel: "Ostatnia aktualizacja",
  updatedAt: "2026-08-20",
  sections: [
    {
      heading: "1. Administrator danych",
      paragraphs: [
        "Administratorem danych osobowych przekazanych przez ten serwis jest KodaSoft sp. z o.o., twórca platformy Opero.",
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
      ],
    },
    {
      heading: "6. Komu powierzamy dane",
      paragraphs: [
        "Nie sprzedajemy danych i nie udostępniamy ich w celach marketingowych. Korzystamy z dwóch dostawców, bez których serwis nie mógłby działać:",
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
      ],
    },
    {
      heading: "7. Przekazywanie danych poza Europejski Obszar Gospodarczy",
      paragraphs: [
        "Obaj wymienieni dostawcy mają siedzibę w Stanach Zjednoczonych, więc dane mogą być przetwarzane poza Europejskim Obszarem Gospodarczym.",
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
        "Nie podejmujemy decyzji w sposób zautomatyzowany i nie profilujemy osób odwiedzających serwis.",
      ],
    },
    {
      heading: "10. Pliki cookies i technologie śledzące",
      paragraphs: [
        "Ten serwis nie zapisuje plików cookies i nie korzysta z pamięci lokalnej przeglądarki. Nie ma tu banera zgody na cookies, ponieważ nie ma na co się zgadzać.",
        "Nie osadzamy skryptów śledzących, pikseli reklamowych ani narzędzi analitycznych profilujących odwiedzających.",
        "Krój pisma używany w serwisie jest osadzony na naszym serwerze w czasie budowania strony. Przeglądarka nie łączy się w tym celu z serwerami firm trzecich.",
        "Jedynym pomiarem jest Vercel Speed Insights, który zbiera anonimowe wskaźniki szybkości ładowania stron - takie jak czas wyświetlenia największego elementu. Narzędzie nie używa ciasteczek i nie pozwala zidentyfikować pojedynczej osoby.",
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
