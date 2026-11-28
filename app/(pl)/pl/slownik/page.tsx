import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/pl/common";
import { glossaryIndexContent, glossaryTerms } from "@/content/pl/glossary";
import { GlossaryIndexPage } from "@/components/layout/GlossaryPages";
import { PageShell } from "@/components/layout/PageShell";
import { glossaryBasePath, glossaryPath } from "@/lib/i18n/glossary";
import { localizePath } from "@/lib/i18n/routes";
import { BreadcrumbJsonLd, DefinedTermSetJsonLd } from "@/lib/seo/json-ld";
import { createGlossaryMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createGlossaryMetadata({ path: glossaryBasePath, ...glossaryIndexContent.seo });

export default function PlGlossaryPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: commonContent.nav.home, path: localizePath("pl", "home") },
          { name: glossaryIndexContent.navLabel, path: glossaryBasePath },
        ]}
      />
      <DefinedTermSetJsonLd
        description={glossaryIndexContent.seo.description}
        name={glossaryIndexContent.hero.title}
        path={glossaryBasePath}
        terms={glossaryTerms.map((term) => ({ term: term.term, definition: term.definition, path: glossaryPath(term.slug) }))}
      />
      {/* No English glossary yet: the language switch leads to the English homepage. */}
      <PageShell alternatePaths={{ en: localizePath("en", "home"), pl: glossaryBasePath }} locale="pl" navItems={navItems} page="home" shell={commonContent}>
        <GlossaryIndexPage
          content={glossaryIndexContent}
          ctas={{ primary: localizePath("pl", "contact"), secondary: localizePath("pl", "opero") }}
          terms={glossaryTerms}
        />
      </PageShell>
    </>
  );
}
