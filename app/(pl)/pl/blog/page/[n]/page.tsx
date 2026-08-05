import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndexRoute } from "@/components/blog/routes";
import { blogIndexMetadata } from "@/lib/blog/page-meta";
import { parsePaginationSegment } from "@/lib/blog/routes";
import { paginationParams } from "@/lib/blog/static-params";

export function generateStaticParams() {
  return paginationParams("pl");
}

export async function generateMetadata({ params }: PageProps<"/pl/blog/page/[n]">): Promise<Metadata> {
  const page = parsePaginationSegment((await params).n);

  return page ? blogIndexMetadata("pl", page) : {};
}

export default async function BlogPlPaginatedPage({ params }: PageProps<"/pl/blog/page/[n]">) {
  const page = parsePaginationSegment((await params).n);

  if (!page) {
    notFound();
  }

  return <BlogIndexRoute locale="pl" page={page} />;
}
