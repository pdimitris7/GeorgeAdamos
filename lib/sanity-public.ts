// lib/sanity-public.ts
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fyr1ddav";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const builder = imageUrlBuilder({ projectId, dataset });

// Δίνει string URL για <Image src={...}>
export function urlForImage(src?: any): string | undefined {
  if (!src) return undefined;
  try {
    if (src?.asset) return builder.image(src).url();
    const ref = src?._ref || src?.asset?._ref || src?.asset?._id;
    return ref ? builder.image(ref).url() : undefined;
  } catch {
    return undefined;
  }
}

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
  gallery?: any[];
};
