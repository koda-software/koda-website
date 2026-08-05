import type { Metadata } from "next";
import { BlogTagRoute } from "@/components/blog/routes";
import { blogTagMetadata } from "@/lib/blog/page-meta";
import { tagParams } from "@/lib/blog/static-params";

export function generateStaticParams() {
  return tagParams();
}

export async function generateMetadata({ params }: PageProps<"/pl/blog/tag/[slug]">): Promise<Metadata> {
  return blogTagMetadata("pl", (await params).slug);
}

export default async function BlogPlTagPage({ params }: PageProps<"/pl/blog/tag/[slug]">) {
  return <BlogTagRoute locale="pl" slug={(await params).slug} />;
}
