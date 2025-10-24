// lib/sanity.ts
import { createClient } from "@sanity/client";
import groq from "groq";

/* =========================================
   SANITY CLIENT (SERVER‑ONLY)
   ========================================= */
// ⚠️ Ιδανικά πέρασέ τα από env (Heroku Config Vars).
// Κρατάω fallback στα δικά σου ids για να μη «σκάσει» σε dev.
const projectId =
  process.env.SANITY_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "fyr1ddav";
const dataset =
  process.env.SANITY_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";

// Δέχεται μορφή "2024-05-01" ή "v2024-05-01"
const apiVersionRaw =
  process.env.SANITY_API_VERSION ||
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  "2024-05-01";
const apiVersion = apiVersionRaw.replace(/^v/i, "");

const token = process.env.SANITY_READ_TOKEN;
// Private dataset ⇒ CDN δεν δουλεύει. Με token -> useCdn: false
const useCdn = token ? false : true;

if (!projectId || !dataset) {
  throw new Error(
    "Missing SANITY projectId/dataset. Set SANITY_PROJECT_ID & SANITY_DATASET (ή τα NEXT_PUBLIC_ αντίστοιχα)."
  );
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: token || undefined,
  useCdn,
  // Αν θες preview drafts κάπου αλλού, βάλε perspective: "previewDrafts" σε ΕΚΕΙΝΑ τα fetch.
  // Εδώ θα ζητάμε published σε κάθε query.
});

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
   GROQ HELPERS
   ========================================= */
const PORTFOLIO_FIELDS = `
  _id, title, slug, category, heroImage, description, gridClass, order, isFeatured,
  "gallery": gallery[defined(asset)]
`;
const MEDIA_FIELDS = `
  _id, title, slug, publication, category, excerpt,
  featuredImage, externalLink, showOnHome, order, publishedDate,
  "gallery": gallery[defined(asset)]
`;
const PRINT_FIELDS = `
  _id, title, slug, category, image,
  availableSizes[]{size, price},
  description, isAvailable, order
`;

/* =========================================
   QUERIES – PORTFOLIO
   ========================================= */
export async function getHomePortfolioProjects(): Promise<PortfolioProject[]> {
  const QUERY = groq`
    *[_type == "portfolio" && coalesce(isFeatured, false) == true && !(_id in path("drafts.**"))]
      | order(coalesce(order, 999) asc, _createdAt desc) {
        ${PORTFOLIO_FIELDS}
      }
  `;
  return client.fetch(QUERY, {}, { perspective: "published" });
}

export async function getAllPortfolioProjects(): Promise<PortfolioProject[]> {
  const QUERY = groq`
    *[_type == "portfolio" && !(_id in path("drafts.**"))]
      | order(coalesce(order, 999) asc, _createdAt desc) {
        ${PORTFOLIO_FIELDS}
      }
  `;
  return client.fetch(QUERY, {}, { perspective: "published" });
}

export async function getPortfolioBySlug(
  slug: string
): Promise<PortfolioProject | null> {
  const QUERY = groq`
    *[_type == "portfolio" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      ${PORTFOLIO_FIELDS}
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
        ${MEDIA_FIELDS}
      }
  `;
  return client.fetch(QUERY, {}, { perspective: "published" });
}

export async function getAllMediaPosts(): Promise<MediaPost[]> {
  const QUERY = groq`
    *[_type == "mediaPost" && !(_id in path("drafts.**"))]
      | order(coalesce(order, 999) asc, _createdAt desc) {
        ${MEDIA_FIELDS}
      }
  `;
  return client.fetch(QUERY, {}, { perspective: "published" });
}

export async function getMediaBySlug(slug: string): Promise<MediaPost | null> {
  const QUERY = groq`
    *[_type == "mediaPost" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      ${MEDIA_FIELDS}
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
        ${PRINT_FIELDS}
      }
  `;
  return client.fetch(QUERY, {}, { perspective: "published" });
}

export async function getPrintBySlug(slug: string): Promise<Print | null> {
  const QUERY = groq`
    *[_type == "print" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      ${PRINT_FIELDS}
    }
  `;
  return client.fetch(QUERY, { slug }, { perspective: "published" });
}

/* =========================================
   Exports
   ========================================= */
export { groq };

/* =========================================
   Backwards‑compat aliases (όπως είχες)
   ========================================= */
export { getPortfolioBySlug as getPortfolioProject };
export { getHomePortfolioProjects as getFeaturedPortfolioProjects };
