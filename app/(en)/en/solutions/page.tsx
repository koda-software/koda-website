import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/en/common";
import { solutionsContent, solutionsCtas } from "@/content/en/solutions";
import { PageShell } from "@/components/layout/PageShell";
import { SolutionsPage } from "@/components/layout/SolutionsPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  page: "solutions",
  ...solutionsContent.seo,
});

export default function EnSolutionsPage() {
  return (
    <PageShell locale="en" page="solutions" shell={commonContent} navItems={navItems}>
      <SolutionsPage content={solutionsContent} primaryHref={solutionsCtas.primary} secondaryHref={solutionsCtas.secondary} />
    </PageShell>
  );
}
