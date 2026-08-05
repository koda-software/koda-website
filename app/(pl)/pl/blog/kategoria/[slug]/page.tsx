import type { Metadata } from "next";
import { BlogCategoryRoute } from "@/components/blog/routes";
import { blogCategoryMetadata } from "@/lib/blog/page-meta";
import { categoryParams } from "@/lib/blog/static-params";

export function generateStaticParams() {
  return categoryParams();
}

export async function generateMetadata({ params }: PageProps<"/pl/blog/kategoria/[slug]">): Promise<Metadata> {
  return blogCategoryMetadata("pl", (await params).slug);
}

export default async function BlogPlCategoryPage({ params }: PageProps<"/pl/blog/kategoria/[slug]">) {
  return <BlogCategoryRoute locale="pl" slug={(await params).slug} />;
}
