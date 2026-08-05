import { blogContent as enBlog, blogCtas as enCtas } from "@/content/en/blog";
import { blogContent as plBlog, blogCtas as plCtas } from "@/content/pl/blog";
import { commonContent as enCommon, navItems as enNav } from "@/content/en/common";
import { commonContent as plCommon, navItems as plNav } from "@/content/pl/common";
import type { BlogUiContent, NavItem, ShellContent } from "@/content/types";
import type { BlogLocale } from "./types";

export type BlogBundle = {
  ui: BlogUiContent;
  ctaHrefs: { primary: string; secondary: string };
  shell: ShellContent;
  navItems: NavItem[];
};

const bundles: Record<BlogLocale, BlogBundle> = {
  en: { ui: enBlog, ctaHrefs: enCtas, shell: enCommon, navItems: enNav },
  pl: { ui: plBlog, ctaHrefs: plCtas, shell: plCommon, navItems: plNav },
};

/** Locale-specific copy and chrome for every blog route. */
export function blogBundle(locale: BlogLocale): BlogBundle {
  return bundles[locale];
}
