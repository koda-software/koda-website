import type { Metadata } from "next";
import { BlogIndexRoute } from "@/components/blog/routes";
import { blogIndexMetadata } from "@/lib/blog/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return blogIndexMetadata("en");
}

export default function BlogEnIndexPage() {
  return <BlogIndexRoute locale="en" />;
}
