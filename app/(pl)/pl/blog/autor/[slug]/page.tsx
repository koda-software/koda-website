import type { Metadata } from "next";
import { BlogAuthorRoute } from "@/components/blog/routes";
import { blogAuthorMetadata } from "@/lib/blog/page-meta";
import { authorParams } from "@/lib/blog/static-params";

export function generateStaticParams() {
  return authorParams();
}

export async function generateMetadata({ params }: PageProps<"/pl/blog/autor/[slug]">): Promise<Metadata> {
  return blogAuthorMetadata("pl", (await params).slug);
}

export default async function BlogPlAuthorPage({ params }: PageProps<"/pl/blog/autor/[slug]">) {
  return <BlogAuthorRoute locale="pl" slug={(await params).slug} />;
}
