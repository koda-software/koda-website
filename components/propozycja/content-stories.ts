import type { StoryStep } from "./Story";
import { polish } from "./polish";

/**
 * Stories told step by step on real screens from the demonstration
 * organisation Demo Firma, with the screen holding still while the steps
 * pass. Every step is one thing the reader would do or see in Opero, in the
 * order they would meet it, and the captions say only what the screen shows.
 *
 * The scrolling story is used where building up is the subject - the home
 * page's contract and the no-code page's module - and not on every landing,
 * so the pages do not all read the same.
 */
export type AreaStory = {
  title: [string, string];
  steps: StoryStep[];
};

/**
 * The home page follows one contract through five stages, drawn. Right after
 * it, the same contract in the real product: the card it lives on, the
 * process behind it, and the settings of the stage it is about to enter.
 */
export const homeStory = polish({
  title: ["Ta sama umowa", "w prawdziwym Opero."] as [string, string],
  steps: [
    {
      title: "Umowa ma swoją kartę",
      text: "UM/2026/0014 w organizacji Demo Firma: status, kontrahent, typ, wartość, okres obowiązywania. Z prawej panel procesu z obiegiem, etapem i przypisaniem.",
      screen: "karta-umowy",
      focus: { x: 0.93, y: 0.2, zoom: 1.8 },
    },
    {
      title: "Za nią stoi proces",
      text: "Obieg umowy narysowany w kreatorze: etapy, przejścia między nimi i droga powrotu do poprawy. Tę tablicę układa administrator, nie programista.",
      screen: "proces-wizualny",
      focus: { x: 0.32, y: 0.36, zoom: 2 },
    },
    {
      title: "Następny etap już wie, co zrobić",
      text: "Akceptacja finansowa otworzy zadanie „Potwierdź warunki finansowe” z terminem trzech dni. Nikt nie musi o tym pamiętać ani o to prosić.",
      screen: "etap-zadanie",
      focus: { x: 0.5, y: 0.27, zoom: 1.6 },
    },
    {
      title: "I kto może ją przenieść dalej",
      text: "Ustawienia etapu mówią, kto edytuje umowę i kto przenosi ją do podpisu: każdy, kto ją widzi, albo tylko osoba przypisana. Zmienia się to jednym kliknięciem.",
      screen: "etap-dostep",
      focus: { x: 0.6, y: 0.28, zoom: 1.6 },
    },
    {
      title: "A zarząd widzi cały portfel",
      text: "Kokpit umów liczy na bieżąco wartość obowiązujących umów i te, które wygasają w ciągu 60 dni. Z tych samych danych, na których pracuje obieg.",
      screen: "kokpit-umow",
      focus: { x: 0.17, y: 0.29, zoom: 1.8 },
    },
  ] satisfies StoryStep[],
});

export const areaStories: Record<string, AreaStory> = polish({
  "no-code": {
    title: ["Od pustego modułu", "do ekranu, na którym pracuje zespół."],
    steps: [
      {
        title: "Zaczynacie od modułu",
        text: "Każdy obszar firmy dostaje swój moduł. W Demo Firma są trzy: Kancelaria, Umowy i Zakupy. Żaden nie jest gotowym produktem z pudełka, każdy powstał w konfiguracji.",
        screen: "moduly-wlasne",
        focus: { x: 0.1, y: 0.28, zoom: 1.8 },
      },
      {
        title: "Obiekt opisuje dane językiem firmy",
        text: "Umowa ma numer, kontrahenta, wartość, okres obowiązywania i opiekuna. Pola dodaje się w tabeli, a Opero od razu pokazuje, na których formularzach są użyte.",
        screen: "obiekt-umowa",
        focus: { x: 0.25, y: 0.6, zoom: 1.6 },
      },
      {
        title: "Słowniki trzymają wspólne wartości",
        text: "Typ umowy, rodzaj pisma, jednostka organizacyjna i centrum kosztów to słowniki. Jedna lista dla wszystkich modułów, więc „Dział Prawny” znaczy to samo w umowie i w piśmie.",
        screen: "slowniki",
        focus: { x: 0.25, y: 0.42, zoom: 1.6 },
      },
      {
        title: "Z tego powstaje ekran pracy",
        text: "Formularz układa pola w sekcje: strona umowy, warunki finansowe, okres obowiązywania. Z boku stoi panel procesu, bo umowa ma swój obieg.",
        screen: "karta-umowy",
        focus: { x: 0.25, y: 0.33, zoom: 1.6 },
      },
      {
        title: "A zespół zaczyna dzień od pulpitu",
        text: "Kokpit umów liczy wartość obowiązujących umów i te, które wygasają w ciągu 60 dni. Ten sam moduł, inne spojrzenie.",
        screen: "kokpit-umow",
        focus: { x: 0.17, y: 0.29, zoom: 1.8 },
      },
    ],
  },
});
