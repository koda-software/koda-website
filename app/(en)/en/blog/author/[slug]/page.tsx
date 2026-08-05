import type { Metadata } from "next";
import { BlogAuthorRoute } from "@/components/blog/routes";
import { blogAuthorMetadata } from "@/lib/blog/page-meta";
import { authorParams } from "@/lib/blog/static-params";

export function generateStaticParams() {
  return authorParams();
}

export async function generateMetadata({ params }: PageProps<"/en/blog/author/[slug]">): Promise<Metadata> {
  return blogAuthorMetadata("en", (await params).slug);
}

export default async function BlogEnAuthorPage({ params }: PageProps<"/en/blog/author/[slug]">) {
  return <BlogAuthorRoute locale="en" slug={(await params).slug} />;
}
