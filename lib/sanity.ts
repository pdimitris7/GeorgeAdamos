// lib/sanity.ts
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import groq from "groq";

/* =========================================
   SANITY CLIENT
   ========================================= */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fyr1ddav";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = (
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  "2023-05-03"
).replace(/^v/i, "");
const token = process.env.SANITY_READ_TOKEN;

// NOTE: Το ίδιο client χρησιμοποιείται και σε client components (π.χ. useEffect).
// ΜΗ βάλεις token σε .env αν δεν χρειάζεται, για να μην "δέσει" στο client bundle.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: token || undefined,
  // Realtime dev: απενεργοποιούμε CDN για να βλέπεις άμεσα αλλαγές.
  useCdn: false,
});

/* =========================================
   IMAGE URL BUILDER
   ========================================= */
const builder = imageUrlBuilder({ projectId, dataset });

/**
 * Επιστρέφει Sanity image-url builder για χρήση τύπου:
 *   urlForImage(img).width(1600).height(1200).fit("max").url()
 */
export function urlForImage(src?: any) {
  if (!src) return undefined;
  const ref = src?.asset?._ref || src?._ref || src?.asset?._id || null;
  if (!ref) return undefined;
  try {
    return builder.image(ref);
  } catch {
    return undefined;
  }
}

/* =========================================
   TYPES
   ========================================= */
export type Slug = { current: string };

export type PortfolioProject = {
  _id: string;
  title: string;
  slug: Slug;
  category: string;
  heroImage: any;
  description?: string;
  gridClass?: string; // για homepage layout
  order?: number; // ordering
  isFeatured?: boolean; // "Show on Homepage" στο schema
  gallery?: any[];
};

export type MediaPost = {
  _id: string;
  title: string;
  slug: Slug;
  publication: string;
  category: string; // free text
  excerpt: string;
  featuredImage?: any;
  externalLink?: string;
  showOnHome?: boolean; // flag για homepage
  order?: number;
  publishedDate?: string; // optional για παλιά docs
  gallery?: any[];
};

export type Print = {
  _id: string;
  title: string;
  slug: Slug;
  category: string;
  image: any;
  availableSizes: { size: string; price: number }[];
  description?: string;
  isAvailable?: boolean;
  order?: number;
};

/* =========================================
   QUERIES – PORTFOLIO
   ========================================= */

/** Homepage: μόνο όσα έχουν "Show on Homepage" (isFeatured = true) */
export async function getHomePortfolioProjects(): Promise<PortfolioProject[]> {
  const QUERY = groq`
    *[_type == "portfolio" && coalesce(isFeatured, false) == true && !(_id in path("drafts.**"))]
      | order(coalesce(order, 999) asc, _createdAt desc) {
        _id, title, slug, category, heroImage, description, gridClass, order, isFeatured,
        "gallery": gallery[defined(asset)]
      }
  `;
  return client.fetch(QUERY, {}, { perspective: "published" });
}

/** Όλα τα portfolio projects (για τη σελίδα /portfolio) */
export async function getAllPortfolioProjects(): Promise<PortfolioProject[]> {
  const QUERY = groq`
    *[_type == "portfolio" && !(_id in path("drafts.**"))]
      | order(coalesce(order, 999) asc, _createdAt desc) {
        _id, title, slug, category, heroImage, description, gridClass, order, isFeatured,
        "gallery": gallery[defined(asset)]
      }
  `;
  return client.fetch(QUERY, {}, { perspective: "published" });
}

/** Ένα project by slug */
export async function getPortfolioBySlug(
  slug: string
): Promise<PortfolioProject | null> {
  const QUERY = groq`
    *[_type == "portfolio" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      _id, title, slug, category, heroImage, description, gridClass, order, isFeatured,
      "gallery": gallery[defined(asset)]
    }
  `;
  return client.fetch(QUERY, { slug }, { perspective: "published" });
}

/* =========================================
   QUERIES – MEDIA
   ========================================= */

/** Homepage: μόνο όσα έχουν "Show on Home" (showOnHome = true) */
export async function getHomeMediaPosts(): Promise<MediaPost[]> {
  const QUERY = groq`
    *[_type == "mediaPost" && coalesce(showOnHome, false) == true && !(_id in path("drafts.**"))]
      | order(coalesce(order, 999) asc, _createdAt desc) {
        _id, title, slug, publication, category, excerpt,
        featuredImage, externalLink, showOnHome, order, publishedDate,
        "gallery": gallery[defined(asset)]
      }
  `;
  return client.fetch(QUERY, {}, { perspective: "published" });
}

/** Όλα τα media posts (για /media) */
export async function getAllMediaPosts(): Promise<MediaPost[]> {
  const QUERY = groq`
    *[_type == "mediaPost" && !(_id in path("drafts.**"))]
      | order(coalesce(order, 999) asc, _createdAt desc) {
        _id, title, slug, publication, category, excerpt,
        featuredImage, externalLink, showOnHome, order, publishedDate,
        "gallery": gallery[defined(asset)]
      }
  `;
  return client.fetch(QUERY, {}, { perspective: "published" });
}

/** Ένα media post by slug */
export async function getMediaBySlug(slug: string): Promise<MediaPost | null> {
  const QUERY = groq`
    *[_type == "mediaPost" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      _id, title, slug, publication, category, excerpt,
      featuredImage, externalLink, showOnHome, order, publishedDate,
      "gallery": gallery[defined(asset)]
    }
  `;
  return client.fetch(QUERY, { slug }, { perspective: "published" });
}

/* =========================================
   QUERIES – PRINTS
   ========================================= */
export async function getAllPrints(): Promise<Print[]> {
  const QUERY = groq`
    *[_type == "print" && coalesce(isAvailable, true) == true && !(_id in path("drafts.**"))]
      | order(coalesce(order, 999) asc, _createdAt desc) {
        _id, title, slug, category, image,
        availableSizes[]{size, price},
        description, isAvailable, order
      }
  `;
  return client.fetch(QUERY, {}, { perspective: "published" });
}

export async function getPrintBySlug(slug: string): Promise<Print | null> {
  const QUERY = groq`
    *[_type == "print" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      _id, title, slug, category, image,
      availableSizes[]{size, price},
      description, isAvailable, order
    }
  `;
  return client.fetch(QUERY, { slug }, { perspective: "published" });
}

export { groq };
