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

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: token || undefined,
  useCdn: false,
});

/* =========================================
   IMAGE URL BUILDER
   ========================================= */
const builder = imageUrlBuilder({ projectId, dataset });

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
  gridClass?: string;
  order?: number;
  isFeatured?: boolean;
  gallery?: any[];
};

export type MediaPost = {
  _id: string;
  title: string;
  slug: Slug;
  publication: string;
  category: string;
  excerpt: string;
  featuredImage?: any;
  externalLink?: string;
  showOnHome?: boolean;
  order?: number;
  publishedDate?: string;
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

/* =========================================
   ALIASES για να δουλέψουν οι υπάρχουσες σελίδες
   ========================================= */
export { getPortfolioBySlug as getPortfolioProject };
export { getHomePortfolioProjects as getFeaturedPortfolioProjects };
