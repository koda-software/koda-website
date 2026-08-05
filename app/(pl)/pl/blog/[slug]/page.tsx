import type { Metadata } from "next";
import { BlogArticleRoute } from "@/components/blog/routes";
import { blogArticleMetadata } from "@/lib/blog/page-meta";
import { articleParams } from "@/lib/blog/static-params";

export function generateStaticParams() {
  return articleParams("pl");
}

export async function generateMetadata({ params }: PageProps<"/pl/blog/[slug]">): Promise<Metadata> {
  return blogArticleMetadata("pl", (await params).slug);
}

export default async function BlogPlArticlePage({ params }: PageProps<"/pl/blog/[slug]">) {
  return <BlogArticleRoute locale="pl" slug={(await params).slug} />;
}
