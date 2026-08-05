import { localizePath } from "@/lib/i18n/routes";
import type { BlogUiContent } from "../types";

export const blogContent: BlogUiContent = {
  seo: {
    title: "Blog - Elastyczny ERP, automatyzacja i praktyczne AI",
    description:
      "Notatki zespołu, który tworzy Opero: wdrożenia ERP, automatyzacja procesów, modelowanie danych, kontrola dostępu i miejsca, w których AI realnie pomaga.",
  },
  index: {
    eyebrow: "Blog",
    title: "Notatki z budowania elastycznego ERP.",
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
  archives: {
    categoryEyebrow: "Kategoria",
    tagEyebrow: "Tag",
    authorEyebrow: "Autor",
    categoryDescription: "Wszystkie artykuły z tej kategorii.",
    tagDescription: "Wszystkie artykuły oznaczone tym tagiem.",
    authorDescription: "Wszystko, co napisał ten autor.",
  },
  seoTemplates: {
    categoryTitle: "{name} - Blog",
    categoryDescription: "Artykuły o {name} od zespołu tworzącego Opero w Koda Soft.",
    tagTitle: "{name} - Blog",
    tagDescription: "Artykuły oznaczone tagiem {name} od zespołu tworzącego Opero w Koda Soft.",
    authorTitle: "{name} - Blog",
    authorDescription: "Artykuły napisane przez: {name} na blogu Koda Soft.",
    pageTitle: "{title} - strona {page}",
    pageDescription: "{description} Strona {page}.",
  },
  notFound: {
    title: "Tego artykułu już tu nie ma.",
    description:
      "Strona, o którą prosisz, została przeniesiona, zmieniła adres albo została wycofana. Poniżej znajdziesz wszystko, co jest obecnie dostępne.",
    backLabel: "Wróć na blog",
  },
  cta: {
    eyebrow: "Następny krok",
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
