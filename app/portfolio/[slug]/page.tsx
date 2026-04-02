// app/portfolio/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPortfolioBySlug, getPortfolioHighlights } from "@/lib/sanity.base";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import PortfolioView from "@/components/portfolio-view";
import PortfolioHighlights from "@/components/portfolio-highlights";

export default async function PortfolioProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const [project, highlights] = await Promise.all([
    getPortfolioBySlug(params.slug),
    getPortfolioHighlights(20),
  ]);

  if (!project) return notFound();

  // Highlights: ασφαλές mapping για slug & εικόνες (hero/cover/main/image)
  const highlightItems = (Array.isArray(highlights) ? highlights : [])
    .map((h: any) => {
      const slug =
        typeof h?.slug === "string" ? h.slug : h?.slug?.current || "";

      return {
        slug,
        title: h?.title ?? "",
        heroImage: h?.heroImage ?? h?.coverImage ?? h?.mainImage ?? h?.image,
        category: h?.category ?? "",
      };
    })
    .filter((h) => h.slug && h.slug !== params.slug);

  return (
    <>
      <ScrollToTop />
      <Navigation />

      <main>
        {/* Highlights κάτω από το menu */}
        {highlightItems.length > 0 && (
          <PortfolioHighlights
            items={highlightItems}
            currentSlug={params.slug}
          />
        )}

        {/* Περιεχόμενο project σε πλήρη σελίδα */}
        <PortfolioView project={project} />
      </main>

      <Footer />
    </>
  );
}

export const revalidate = 60;
