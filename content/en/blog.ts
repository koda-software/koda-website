import { localizePath } from "@/lib/i18n/routes";
import type { BlogUiContent } from "../types";

export const blogContent: BlogUiContent = {
  seo: {
    title: "Blog - notes on BPM, low-code and automation",
    description:
      "Field notes from the team building Opero: BPM rollouts, process design, workflow automation, data modelling, governance, and where AI genuinely helps.",
  },
  index: {
    eyebrow: "Blog",
    title: "Notes from building a no-code BPM platform.",
    description:
      "What we learn shipping Opero into real operations: how processes get modelled, where automation earns its keep, what governance actually requires, and where AI helps instead of getting in the way.",
  },
  labels: {
    featured: "Featured",
    minRead: "min read",
    published: "Published",
    updated: "Updated",
    tags: "Tags",
    related: "Related reading",
    aboutAuthor: "About the author",
    allArticles: "All articles",
    inCategory: "In",
    byAuthor: "By",
    emptyState: "No articles have been published here yet. Check back soon.",
    previous: "Previous",
    next: "Next",
    pagination: "Blog pagination",
    page: "Page",
    breadcrumbHome: "Home",
  },
  archives: {
    categoryEyebrow: "Category",
    tagEyebrow: "Tag",
    authorEyebrow: "Author",
    categoryDescription: "Every article filed under this category.",
    tagDescription: "Every article tagged with this topic.",
    authorDescription: "Everything written by this author.",
  },
  seoTemplates: {
    categoryTitle: "{name} - Blog",
    categoryDescription: "Articles about {name} from the team building Opero at KodaSoft.",
    tagTitle: "{name} - Blog",
    tagDescription: "Articles tagged {name} from the team building Opero at KodaSoft.",
    authorTitle: "{name} - Blog",
    authorDescription: "Articles written by {name} for the KodaSoft blog.",
    pageTitle: "{title} - page {page}",
    pageDescription: "{description} Page {page}.",
  },
  notFound: {
    title: "This article is no longer here.",
    description:
      "The page you asked for has been moved, renamed, or unpublished. The blog index below has everything that is currently live.",
    backLabel: "Back to the blog",
  },
  cta: {
    eyebrow: "Next step",
    title: "See how this works on your own processes.",
    description:
      "We can walk through your operations, show how Opero would model them, and be direct about what fits and what does not.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore Opero",
  },
};

export const blogCtas = {
  primary: localizePath("en", "contact"),
  secondary: localizePath("en", "opero"),
};
