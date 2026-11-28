import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { commonContent, navItems } from "@/content/pl/common";
import { getGlossaryTerm, glossaryIndexContent, glossaryTerms } from "@/content/pl/glossary";
import { GlossaryTermPage } from "@/components/layout/GlossaryPages";
import { PageShell } from "@/components/layout/PageShell";
import { glossaryBasePath, glossaryPath } from "@/lib/i18n/glossary";
import { localizePath } from "@/lib/i18n/routes";
import { BreadcrumbJsonLd, DefinedTermJsonLd, FaqJsonLd } from "@/lib/seo/json-ld";
import { createGlossaryMetadata } from "@/lib/seo/metadata";

/** Only the entries that exist are valid children of the glossary. */
export const dynamicParams = false;

export function generateStaticParams() {
  return glossaryTerms.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: PageProps<"/pl/slownik/[slug]">): Promise<Metadata> {
  const term = getGlossaryTerm((await params).slug);

  return term ? createGlossaryMetadata({ path: glossaryPath(term.slug), ...term.seo }) : {};
}

export default async function PlGlossaryTermPage({ params }: PageProps<"/pl/slownik/[slug]">) {
  const term = getGlossaryTerm((await params).slug);

  if (!term) {
    notFound();
  }

  const path = glossaryPath(term.slug);
  const related = term.related.flatMap((slug) => getGlossaryTerm(slug) ?? []);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: commonContent.nav.home, path: localizePath("pl", "home") },
          { name: glossaryIndexContent.navLabel, path: glossaryBasePath },
          { name: term.term, path },
        ]}
      />
      <DefinedTermJsonLd
        dateModified={term.updatedAt}
        definition={term.definition}
        path={path}
        set={{ name: glossaryIndexContent.hero.title, path: glossaryBasePath }}
        term={term.term}
      />
      <FaqJsonLd items={term.faq} />
      <PageShell alternatePaths={{ en: localizePath("en", "home"), pl: path }} locale="pl" navItems={navItems} page="home" shell={commonContent}>
        <GlossaryTermPage content={glossaryIndexContent} ctas={{ primary: localizePath("pl", "contact") }} related={related} term={term} />
      </PageShell>
    </>
  );
}
