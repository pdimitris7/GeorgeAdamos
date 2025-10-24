// lib/sanity-public.ts
import createImageUrlBuilder from "@sanity/image-url";

/* Public ENV για browser */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";

if (typeof window !== "undefined") {
  if (!projectId || !dataset) {
    // eslint-disable-next-line no-console
    console.warn(
      "[sanity-public] Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET"
    );
  }
}

const builder =
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }) : null;

/** Επιστρέφει builder για chaining: .width(...).height(...).fit("max").url() */
export function urlForImage(source?: any) {
  if (!source || !builder) return undefined as any;
  try {
    return builder.image(source);
  } catch {
    return undefined as any;
  }
}

/* ===== Types που χρειάζονται σε client components ===== */
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
