import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { landings } from "@/components/propozycja/content-landings";
import { systemArea, systemAreas } from "@/components/propozycja/content-system";
import { SystemAreaPage } from "@/components/propozycja/pages/SystemAreaPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return systemAreas.map((area) => ({ slug: area.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = systemArea((await params).slug);
  return area ? { title: landings[area.slug].seo.title, description: landings[area.slug].seo.description } : {};
}

export default async function SystemArea({ params }: Props) {
  const area = systemArea((await params).slug);
  if (!area) notFound();
  return <SystemAreaPage area={area} />;
}
