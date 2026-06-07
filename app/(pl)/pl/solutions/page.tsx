import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/pl/common";
import { solutionsContent, solutionsCtas } from "@/content/pl/solutions";
import { PageShell } from "@/components/layout/PageShell";
import { SolutionsPage } from "@/components/layout/SolutionsPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  locale: "pl",
  page: "solutions",
  ...solutionsContent.seo,
});

export default function PlSolutionsPage() {
  return (
    <PageShell locale="pl" page="solutions" shell={commonContent} navItems={navItems}>
      <SolutionsPage content={solutionsContent} primaryHref={solutionsCtas.primary} secondaryHref={solutionsCtas.secondary} />
    </PageShell>
  );
}
