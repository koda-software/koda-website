import type { Metadata } from "next";
import { BlogTagRoute } from "@/components/blog/routes";
import { blogTagMetadata } from "@/lib/blog/page-meta";
import { tagParams } from "@/lib/blog/static-params";

export function generateStaticParams() {
  return tagParams();
}

export async function generateMetadata({ params }: PageProps<"/en/blog/tag/[slug]">): Promise<Metadata> {
  return blogTagMetadata("en", (await params).slug);
}

export default async function BlogEnTagPage({ params }: PageProps<"/en/blog/tag/[slug]">) {
  return <BlogTagRoute locale="en" slug={(await params).slug} />;
}
