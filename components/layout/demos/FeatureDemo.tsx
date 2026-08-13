import type { FeatureDemoContent } from "@/content/types";
import { AiDemo } from "./AiDemo";
import { DocumentsDemo } from "./DocumentsDemo";
import { IntegrationsDemo } from "./IntegrationsDemo";
import { LowCodeDemo } from "./LowCodeDemo";
import { NoCodeDemo } from "./NoCodeDemo";
import { ProcessesDemo } from "./ProcessesDemo";
import { ReportsDemo } from "./ReportsDemo";
import { SecurityDemo } from "./SecurityDemo";

/**
 * Picks the demo component matching the tagged content. Keyed on `kind` rather
 * than the feature key, so a page can be given any demo and the two never drift
 * apart the way a positional lookup would.
 */
export function FeatureDemo({ demo }: { demo: FeatureDemoContent }) {
  switch (demo.kind) {
    case "processes":
      return <ProcessesDemo content={demo} />;
    case "noCode":
      return <NoCodeDemo content={demo} />;
    case "lowCode":
      return <LowCodeDemo content={demo} />;
    case "reports":
      return <ReportsDemo content={demo} />;
    case "documents":
      return <DocumentsDemo content={demo} />;
    case "integrations":
      return <IntegrationsDemo content={demo} />;
    case "ai":
      return <AiDemo content={demo} />;
    case "security":
      return <SecurityDemo content={demo} />;
  }
}
