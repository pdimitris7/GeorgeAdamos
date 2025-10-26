// components/portfolio-utils.ts
import { urlForImage } from "@/lib/sanity-public";

export function hasImageAsset(img: any) {
  return Boolean(img?.asset?._ref || img?.asset?._id || img?._ref);
}

// Σταθερό key από Sanity για σωστό reorder στο UI
export function stableKey(img: any, i: number) {
  return img?._key || img?.asset?._ref || img?.asset?._id || `g-${i}`;
}

/**
 * imgUrl: αν το urlForImage γυρίζει builder -> κάνε width/height/fit/url.
 * Αν γυρίζει string -> string.
 * Αν γυρίζει object με url() μόνο -> κάλεσε url().
 */
export function imgUrl(raw: any, w?: number, h?: number) {
  if (!raw) return undefined as string | undefined;
  const anyVal = urlForImage(raw as any) as any;

  if (anyVal && typeof anyVal.width === "function") {
    let chain = anyVal;
    if (typeof w === "number") chain = chain.width(w);
    if (typeof h === "number") chain = chain.height(h);
    if (typeof chain.fit === "function") chain = chain.fit("max");
    if (typeof chain.url === "function") return chain.url();
  }

  if (typeof anyVal === "string") return anyVal;
  if (anyVal && typeof anyVal.url === "function") return anyVal.url();

  return undefined;
}
