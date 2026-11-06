import Image from "next/image";

/*
 * Real screens from Opero, taken from the demonstration organisation Demo
 * Firma by `KodaSoft-Marketing/narzedzia/opero-screeny.js --zestaw strona`
 * (manifest in `marketing/materialy/screeny-strona`). The organisation wears
 * the brand theme, so the product on the page is the product as it ships,
 * not a drawing of it. Retake them there, never edit the files here.
 */
export const screens = {
  "karta-umowy": {
    alt: "Karta umowy UM/2026/0014 w Opero: pola umowy, kontrahent, warunki finansowe i panel procesu z etapem Opiniowanie prawne",
    width: 2880,
    height: 1800,
  },
  "proces-wizualny": {
    alt: "Proces Obieg umowy w kreatorze Opero: etapy od projektu do zakończenia, z terminami i przejściami między nimi",
    width: 3094,
    height: 948,
  },
  "obiekt-umowa": {
    alt: "Obiekt Umowa w konfiguracji Opero: lista pól z kluczami, typami i pokryciem formularzy",
    width: 2880,
    height: 1800,
  },
  "kokpit-umow": {
    alt: "Kokpit umów w Opero: wartość obowiązujących umów, umowy wygasające w 60 dni i wykresy",
    width: 2880,
    height: 1800,
  },
  "analityka-kancelarii": {
    alt: "Analityka kancelarii w Opero: liczniki pism po terminie i tabela przestawna pism według jednostek",
    width: 2880,
    height: 1800,
  },
  "moduly-wlasne": {
    alt: "Moduły własne w konfiguracji Opero: Kancelaria, Umowy i Zakupy",
    width: 2880,
    height: 1800,
  },
  "etap-rodzaj": {
    alt: "Ustawienia etapu Akceptacja finansowa w Opero: rodzaj etapu i przypisywanie odpowiedzialnych",
    width: 1904,
    height: 1632,
  },
  "etap-dostep": {
    alt: "Ustawienia etapu Akceptacja finansowa w Opero: kto może edytować rekord i kto może przenieść go dalej",
    width: 1904,
    height: 1632,
  },
  "etap-zadanie": {
    alt: "Ustawienia etapu Akceptacja finansowa w Opero: zadanie Potwierdź warunki finansowe z terminem trzech dni",
    width: 1904,
    height: 1632,
  },
  "regula-warunek": {
    alt: "Reguła w Opero: przejście w procesie, warunek wejścia na etap Księgowość i dwie akcje ustawiające pole",
    width: 2402,
    height: 1152,
  },
  "szablon-dokumentu": {
    alt: "Edytor szablonu dokumentu w Opero: protokół zgłoszenia serwisowego i lista pól wypełnianych z rekordu",
    width: 2880,
    height: 1800,
  },
  "karta-pisma": {
    alt: "Pismo przychodzące KAN/2026/00013 w Opero na etapie rejestracji w kancelarii, z kanałem wpływu i nadawcą",
    width: 2880,
    height: 1800,
  },
  slowniki: {
    alt: "Słowniki organizacji w Opero: rodzaj pisma, jednostka organizacyjna, typ umowy, centrum kosztów",
    width: 2880,
    height: 1800,
  },
  "analityka-umow": {
    alt: "Analityka umów w Opero: wartość portfela i tabela przestawna umów według typu i etapu",
    width: 2880,
    height: 1800,
  },
  "kokpit-kancelarii": {
    alt: "Pulpit Kancelaria i sprawy w Opero: pisma po terminie, sprawy w toku i wykresy kanałów wpływu",
    width: 2880,
    height: 1800,
  },
  "raport-edycja": {
    alt: "Edycja raportu w Opero: nazwa, źródło danych z zapytania SQL, zakres i dostępne kolumny",
    width: 2880,
    height: 1800,
  },
  "integracja-ksef": {
    alt: "Integracja KSeF w ustawieniach organizacji Opero: poświadczenia, środowisko i ustawienia pobierania faktur",
    width: 2880,
    height: 1800,
  },
  "obiekt-wlasnosc": {
    alt: "Obiekt Umowa w konfiguracji Opero: własność rekordów, każda firma ma własne rekordy, i dostęp do rekordów",
    width: 2880,
    height: 1800,
  },
  role: {
    alt: "Role organizacji w Opero z liczbą uprawnień i przypisań",
    width: 2880,
    height: 1800,
  },
} as const;

export type ScreenName = keyof typeof screens;

export function Screen({
  name,
  caption,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
}: {
  name: ScreenName;
  caption?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const screen = screens[name];
  return (
    <figure className={`screen ${className}`}>
      <div className="screen__frame">
        <Image
          alt={screen.alt}
          height={screen.height}
          priority={priority}
          sizes={sizes}
          src={`/propozycja/screeny/${name}.webp`}
          width={screen.width}
        />
      </div>
      {caption ? <figcaption className="screen__caption">{caption}</figcaption> : null}
    </figure>
  );
}
