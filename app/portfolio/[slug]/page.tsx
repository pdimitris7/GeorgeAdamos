// app/portfolio/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPortfolioBySlug } from "@/lib/sanity.base";
import PortfolioModal from "@/components/portfolio-modal";

export default async function PortfolioProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getPortfolioBySlug(params.slug);
  if (!project) return notFound();
  return <PortfolioModal project={project} />;
}

export const revalidate = 60;
