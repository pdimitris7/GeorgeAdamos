// lib/portfolio.adapters.ts
import { groq } from "next-sanity";
import { client } from "@/lib/sanity.base";
/** Ενοποίηση σχημάτων -> ίδια πεδία παντού */
export function normalizeProject(doc: any) {
  const slug =
    typeof doc?.slug === "object" ? doc?.slug?.current : doc?.slug || "";
  const heroImage =
    doc?.heroImage ?? doc?.coverImage ?? doc?.mainImage ?? doc?.image ?? null;
  const gallery =
    (Array.isArray(doc?.gallery) && doc.gallery) ||
    (Array.isArray(doc?.images) && doc.images) ||
    (Array.isArray(doc?.galleryImages) && doc.galleryImages) ||
    [];

  return {
    ...doc,
    slug,
    heroImage,
    gallery,
    title: doc?.title ?? "",
    category: doc?.category ?? "",
  };
}

/** Φέρνει άλλα projects για Highlights (ανεξαρτήτως τύπου) */
export async function getPortfolioHighlightDocs(limit = 20) {
  const q = groq`*[
    _type in ["portfolioProject", "portfolio", "project"] 
    && defined(slug.current)
  ] | order(coalesce(_updatedAt, _createdAt) desc)[0...$limit]{
    _id,
    title,
    "slug": slug.current,
    category,
    heroImage, coverImage, mainImage, image
  }`;
  return client.fetch(q, { limit });
}
