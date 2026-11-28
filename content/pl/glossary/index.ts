import type { GlossaryIndexContent, GlossaryTerm } from "@/content/types";
import type { FeatureKey } from "@/lib/i18n/features";
import { bpmn } from "./bpmn";
import { bpms } from "./bpms";
import { dashboard } from "./dashboard";
import { dziennikPodawczy } from "./dziennik-podawczy";
import { ewidencjaDokumentow } from "./ewidencja-dokumentow";
import { optymalizacjaProcesow } from "./optymalizacja-procesow";
import { raportowanie } from "./raportowanie";
import { skanowanieDokumentow } from "./skanowanie-dokumentow";
import { szablonDokumentu } from "./szablon-dokumentu";
import { wersjonowanieDokumentow } from "./wersjonowanie-dokumentow";

export const glossaryIndexContent: GlossaryIndexContent = {
  seo: {
    title: "Słownik pojęć: obieg dokumentów, procesy i BPM",
    description:
      "Słownik pojęć z obiegu dokumentów, zarządzania procesami i raportowania: BPMN, BPMS, dziennik podawczy, ewidencja i wersjonowanie dokumentów. Krótko, z przykładami.",
  },
  navLabel: "Słownik",
  breadcrumbLabel: "Słownik",
  hero: {
    title: "Słownik pojęć",
    description: "Obieg dokumentów, procesy biznesowe i raportowanie wyjaśnione krótko i na przykładach z codziennej pracy firmy.",
  },
  intro:
    "Każde hasło zaczyna się od definicji, którą można przeczytać w kilka sekund, a potem pokazuje, jak to wygląda w praktyce: przykład z firmy, najczęstsze pytania i to, jak dana rzecz działa w Opero.",
  labels: {
    definition: "Definicja",
    example: "Przykład.",
    faq: "Najczęstsze pytania",
    related: "Powiązane hasła",
    sources: "Źródła",
    updated: "Hasło sprawdzone:",
    allTerms: "Wszystkie hasła",
  },
  opero: {
    title: "Opero łączy procesy, dokumenty i raporty",
    body: "Platforma BPM low-code, w której obieg dokumentów, procesy, automatyzacje i raporty pracują na tych samych danych. Konfigurujesz ją pod swoją firmę, bez pisania kodu.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj Opero",
  },
};

const collator = new Intl.Collator("pl");

/** Every entry, A to Z by the Polish alphabet. */
export const glossaryTerms: GlossaryTerm[] = [
  bpmn,
  bpms,
  dashboard,
  dziennikPodawczy,
  ewidencjaDokumentow,
  optymalizacjaProcesow,
  raportowanie,
  skanowanieDokumentow,
  szablonDokumentu,
  wersjonowanieDokumentow,
].sort((a, b) => collator.compare(a.term, b.term));

const termsBySlug = new Map(glossaryTerms.map((term) => [term.slug, term]));

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return termsBySlug.get(slug);
}

/** The entries each feature page links to, so the glossary and the money pages point at each other. */
const termsByFeature: Partial<Record<FeatureKey, string[]>> = {
  documents: ["dziennik-podawczy", "ewidencja-dokumentow", "wersjonowanie-dokumentow", "skanowanie-dokumentow", "szablon-dokumentu"],
  processes: ["bpms", "bpmn", "optymalizacja-procesow"],
  reports: ["raportowanie", "dashboard"],
};

export function glossaryTermsForFeature(feature: FeatureKey): GlossaryTerm[] {
  return (termsByFeature[feature] ?? []).flatMap((slug) => getGlossaryTerm(slug) ?? []);
}

export const glossaryStripTitle = "Pojęcia z tej strony w słowniku";
