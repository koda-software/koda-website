import type { Metadata } from "next";
import { BlogCategoryRoute } from "@/components/blog/routes";
import { blogCategoryMetadata } from "@/lib/blog/page-meta";
import { categoryParams } from "@/lib/blog/static-params";

export function generateStaticParams() {
  return categoryParams();
}

export async function generateMetadata({ params }: PageProps<"/en/blog/category/[slug]">): Promise<Metadata> {
  return blogCategoryMetadata("en", (await params).slug);
}

export default async function BlogEnCategoryPage({ params }: PageProps<"/en/blog/category/[slug]">) {
  return <BlogCategoryRoute locale="en" slug={(await params).slug} />;
}
