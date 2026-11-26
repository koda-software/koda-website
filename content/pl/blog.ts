import { localizePath } from "@/lib/i18n/routes";
import type { BlogUiContent } from "../types";

export const blogContent: BlogUiContent = {
  seo: {
    title: "Blog - BPM, low-code i automatyzacja procesów",
    description:
      "Notatki zespołu, który tworzy Opero: wdrożenia BPM, projektowanie procesów, automatyzacja, modelowanie danych i miejsca, w których AI realnie pomaga.",
  },
  index: {
    label: "Blog",
    title: "Notatki z budowania platformy BPM no-code.",
    description:
      "To, czego uczymy się wdrażając Opero w realnych operacjach: jak modelować procesy, gdzie automatyzacja naprawdę się opłaca, czego wymaga kontrola nad danymi i kiedy AI pomaga, a kiedy przeszkadza.",
  },
  labels: {
    featured: "Wyróżnione",
    minRead: "min czytania",
    published: "Opublikowano",
    updated: "Zaktualizowano",
    tags: "Tagi",
    related: "Powiązane artykuły",
    aboutAuthor: "O autorze",
    allArticles: "Wszystkie artykuły",
    inCategory: "W kategorii",
    byAuthor: "Autor",
    emptyState: "Nie ma tu jeszcze opublikowanych artykułów. Zajrzyj wkrótce.",
    previous: "Poprzednia",
    next: "Następna",
    pagination: "Paginacja bloga",
    page: "Strona",
    breadcrumbHome: "Start",
  },
  recent: {
    title: "Najnowsze na blogu.",
    description:
      "Notatki zespołu, który tworzy Opero: o projektowaniu procesów, automatyzacji pracy i wdrażaniu BPM w codziennym działaniu firm.",
  },
  archives: {
    categoryDescription: "Wszystkie artykuły z tej kategorii.",
    tagDescription: "Wszystkie artykuły oznaczone tym tagiem.",
    authorDescription: "Wszystko, co napisał ten autor.",
  },
  seoTemplates: {
    categoryTitle: "{name} - Blog",
    categoryDescription: "Artykuły o {name} od zespołu tworzącego Opero w KodaSoft.",
    tagTitle: "{name} - Blog",
    tagDescription: "Artykuły oznaczone tagiem {name} od zespołu tworzącego Opero w KodaSoft.",
    authorTitle: "{name} - Blog",
    authorDescription: "Artykuły napisane przez: {name} na blogu KodaSoft.",
    descriptionTopics: "Piszemy o procesach, dokumentach i automatyzacji.",
    pageTitle: "{title} - strona {page}",
    pageDescription: "{description} Strona {page}.",
  },
  notFound: {
    title: "Tego artykułu już tu nie ma.",
    description:
      "Strona, o którą prosisz, została przeniesiona, zmieniła adres albo została wycofana. Poniżej znajdziesz wszystko, co jest obecnie dostępne.",
    backLabel: "Wróć na blog",
  },
  hub: {
    topStories: "Najważniejsze artykuły",
    latest: "Najnowsze",
    allCount: "Wszystkie artykuły ({count})",
    allShort: "Wszystkie ({count})",
    streamHeading: "Wszystkie artykuły",
    streamCount: "Liczba artykułów: {count}, od najnowszych",
    picks: "Wybór redakcji",
    topics: "Tematy",
    rail: "Więcej od KodaSoft",
    freeTools: "Darmowe narzędzia",
    allTools: "Wszystkie darmowe narzędzia ({count})",
  },
  search: {
    label: "Szukaj artykułów",
    placeholder: "Szukaj artykułów",
    empty: "Żaden artykuł nie pasuje do tego wyszukiwania.",
    unavailable: "Wyszukiwanie jest teraz niedostępne.",
  },
  article: {
    breadcrumb: "Ścieżka nawigacji",
    share: "Udostępnij",
    shareOnLinkedIn: "Udostępnij na LinkedIn",
    shareOnX: "Udostępnij na X",
    copyLink: "Kopiuj link",
    linkCopied: "Link skopiowany",
    keepReading: "Czytaj dalej",
    faq: "Najczęściej zadawane pytania",
  },
  promos: {
    product: "Produkt KodaSoft",
    productAlt: "{name} w Opero",
    freeTool: "Darmowe narzędzie",
    openTool: "Otwórz narzędzie",
    inOpero: "Zobacz to w Opero",
    featureLink: "{name} w Opero",
    howItWorks: "Zobacz, jak to działa w Opero",
  },
  cta: {
    title: "Zobacz, jak to działa na Twoich procesach.",
    description:
      "Przejdziemy przez Twoje operacje, pokażemy, jak Opero je odwzoruje, i szczerze powiemy, co pasuje, a co nie.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj Opero",
  },
};

export const blogCtas = {
  primary: localizePath("pl", "contact"),
  secondary: localizePath("pl", "opero"),
};
