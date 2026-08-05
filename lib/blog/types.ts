/**
 * Shapes returned by the Opero blog saved queries and record API.
 *
 * Column names are kept in Polish exactly as the CMS emits them — there is no
 * renaming layer, so a schema change surfaces as a type error instead of a
 * silently undefined field.
 */

export type BlogLocale = "pl" | "en";

export type TiptapMark = {
  type: string;
  attrs?: Record<string, unknown> | null;
};

export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown> | null;
  content?: TiptapNode[] | null;
  marks?: TiptapMark[] | null;
  text?: string | null;
};

export type TiptapPayload = {
  doc?: TiptapNode | null;
  format?: string | null;
  plainText?: string | null;
  schemaVersion?: number | null;
  referencedFileIds?: string[] | null;
  mentionRefs?: unknown[] | null;
};

export type ArticleListRow = {
  id: string;
  tytul: string;
  slug: string;
  jezyk: string;
  zajawka: string | null;
  data_publikacji: string;
  updated_at: string;
  obraz_glowny: string | null;
  obraz_alt: string | null;
  czas_czytania: number | null;
  wyrozniony?: boolean | null;
  kategoria_slug: string | null;
  kategoria_nazwa: string | null;
  autor_slug?: string | null;
  autor_nazwa?: string | null;
  total?: number | null;
};

export type SchemaType = "BlogPosting" | "Article" | "NewsArticle";

export type ArticleFullRow = ArticleListRow & {
  grupa_tlumaczen: string;
  tresc: TiptapPayload | null;
  liczba_slow: number | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  noindex: boolean | null;
  typ_schema: SchemaType | null;
  autor_stanowisko: string | null;
  autor_avatar: string | null;
  autor_bio: TiptapPayload | null;
  autor_www?: string | null;
  autor_linkedin: string | null;
  autor_x: string | null;
  tagi: Array<{ slug: string; nazwa: string }> | null;
  powiazane: Array<{ slug: string; tytul: string; zajawka: string | null }> | null;
};

/** Rows of `blog_artykuly_po_autorze` carry the author header alongside each article. */
export type AuthorArticleRow = ArticleListRow & {
  autor_stanowisko: string | null;
  autor_avatar: string | null;
  autor_bio: TiptapPayload | null;
  autor_www: string | null;
  autor_linkedin: string | null;
  autor_x: string | null;
};

export type SitemapRow = {
  typ: "artykul" | "kategoria" | "tag" | "autor";
  slug: string;
  jezyk: string | null;
  lastmod: string;
  data_publikacji: string | null;
};

export type VariantRow = {
  jezyk: string;
  slug: string;
  tytul: string;
};

export type RedirectRow = {
  sciezka_z: string;
  sciezka_do: string;
  kod: "301" | "302";
};

export type BlogSettings = {
  nazwa_serwisu: string | null;
  adres_bazowy: string | null;
  sufiks_title: string | null;
  domyslny_og_image: string | null;
  logo: string | null;
  domyslny_jezyk: string | null;
  artykulow_na_stronie: number | null;
  profil_linkedin: string | null;
  profil_x: string | null;
  profil_youtube: string | null;
};

export type CategoryRecord = {
  nazwa: string;
  slug: string;
  opis: string | null;
  obraz: string | null;
  meta_title: string | null;
  meta_description: string | null;
  noindex: boolean | null;
  pozycja: number | null;
  kategoria_nadrzedna: string | null;
};

export type TagRecord = {
  nazwa: string;
  slug: string;
  opis: string | null;
};

export type AuthorRecord = {
  imie_nazwisko: string;
  slug: string;
  bio: TiptapPayload | null;
  avatar: string | null;
  stanowisko: string | null;
  email: string | null;
  url_www: string | null;
  url_linkedin: string | null;
  url_x: string | null;
  aktywny: boolean | null;
};

/** A page of articles plus the unpaginated total, used to build pagination. */
export type ArticlePage = {
  rows: ArticleListRow[];
  total: number;
};
