import type { Metadata } from "next";
import { BlogArticleRoute } from "@/components/blog/routes";
import { blogArticleMetadata } from "@/lib/blog/page-meta";
import { articleParams } from "@/lib/blog/static-params";

export function generateStaticParams() {
  return articleParams("en");
}

export async function generateMetadata({ params }: PageProps<"/en/blog/[slug]">): Promise<Metadata> {
  return blogArticleMetadata("en", (await params).slug);
}

export default async function BlogEnArticlePage({ params }: PageProps<"/en/blog/[slug]">) {
  return <BlogArticleRoute locale="en" slug={(await params).slug} />;
}
