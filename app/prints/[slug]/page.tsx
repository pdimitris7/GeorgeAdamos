// app/prints/[slug]/page.tsx
import { notFound } from "next/navigation";
import PrintModal from "@/components/print-modal";
import { getPrintBySlug } from "@/lib/sanity";

export const revalidate = 60;

export default async function PrintStandalonePage({
  params,
}: {
  params: { slug: string };
}) {
  const print = await getPrintBySlug(params.slug);
  if (!print) return notFound();
  return <PrintModal print={print} mode="standalone" />;
}
