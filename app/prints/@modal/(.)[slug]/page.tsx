import { notFound } from "next/navigation";
import { getPrintBySlug } from "@/lib/sanity.base";
import PrintModal from "@/components/print-modal";

export const dynamic = "force-dynamic";

export default async function PrintStandalonePage({
  params,
}: {
  params: { slug: string };
}) {
  const print = await getPrintBySlug(params.slug);
  if (!print) return notFound();
  return <PrintModal print={print} mode="overlay" />;
}
