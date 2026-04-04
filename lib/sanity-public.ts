// lib/sanity-public.ts
import createImageUrlBuilder from "@sanity/image-url";

/* Public ENV για browser */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fyr1ddav";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const builder = createImageUrlBuilder({ projectId, dataset });

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

export type GalleryItem = {
  _key: string;
  size: "1x1" | "2x1" | "1x2" | "2x2";
  alt?: string;
  asset: any;
  hotspot?: any;
  crop?: any;
};

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
  gallery?: GalleryItem[];
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
