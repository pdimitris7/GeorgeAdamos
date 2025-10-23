"use client";

import { useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
// ✱ Αν το project σου χρησιμοποιεί "sanity-public", άφησε αυτή την εισαγωγή.
// Αν είναι "sanity", άλλαξέ το αντίστοιχα.
import { urlForImage, type PortfolioProject } from "@/lib/sanity-public";

type Props = {
  project: PortfolioProject | null;
  onClose?: () => void;
};

/* -------- helpers -------- */

function hasImageAsset(img: any) {
  return Boolean(img?.asset?._ref || img?.asset?._id || img?._ref);
}

// Σταθερό key από Sanity για σωστό reorder στο UI
function stableKey(img: any, i: number) {
  return img?._key || img?.asset?._ref || img?.asset?._id || `g-${i}`;
}

/**
 * imgUrl: αν το urlForImage γυρίζει builder -> κάνε width/height/fit/url.
 * Αν γυρίζει string -> απλά επέστρεψε το string.
 * Αν γυρίζει object με url() μόνο -> κάλεσε url().
 */
function imgUrl(raw: any, w?: number, h?: number) {
  if (!raw) return undefined as string | undefined;
  const anyVal = urlForImage(raw as any) as any;

  // περίπτωση 1: builder με .width/.height/.fit/.url
  if (anyVal && typeof anyVal.width === "function") {
    let chain = anyVal;
    if (typeof w === "number") chain = chain.width(w);
    if (typeof h === "number") chain = chain.height(h);
    if (typeof chain.fit === "function") chain = chain.fit("max");
    if (typeof chain.url === "function") return chain.url();
  }

  // περίπτωση 2: ήδη URL string
  if (typeof anyVal === "string") return anyVal;

  // περίπτωση 3: object με .url() μόνο
  if (anyVal && typeof anyVal.url === "function") return anyVal.url();

  return undefined;
}

export default function PortfolioModal({ project, onClose }: Props) {
  const router = useRouter();

  const close = useCallback(() => {
    if (onClose) onClose();
    else router.back();
  }, [onClose, router]);

  // Κλείσιμο με ESC + κλείδωμα scroll
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, close]);

  if (!project) return null;

  const heroSrc = imgUrl(project.heroImage, 2000, 1200) || "/placeholder.svg";

  // Φέρνουμε gallery με τη σειρά της Sanity και σταθερά keys
  const gallery = useMemo(() => {
    const arr = Array.isArray(project.gallery) ? project.gallery : [];
    return arr.filter(hasImageAsset);
  }, [project.gallery]);

  const firstDetail = imgUrl(gallery[0], 1600, 1066) || heroSrc;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center overflow-y-auto"
      onClick={close} // click έξω από το container -> κλείσιμο
      aria-modal="true"
      role="dialog"
    >
      {/* X: fixed, χωρίς background, πάνω δεξιά */}
      <button
        onClick={close}
        className="fixed top-6 right-6 text-white hover:text-gray-300 transition-colors z-[60]"
        aria-label="Close"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      {/* Container */}
      <div
        className="relative w-[85vw] max-w-6xl max-h-[90vh] bg-white text-black overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()} // ΜΗΝ κλείσεις όταν κάνω click μέσα
      >
        {/* Hero */}
        <div className="relative h-[60vh] w-full overflow-hidden">
          <Image
            src={heroSrc}
            alt={project.title}
            fill
            sizes="(min-width: 1280px) 70vw, 90vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl px-8">
              <h1 className="text-white font-mono text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-wide">
                {(project.title || "").toUpperCase()}
              </h1>
              <div className="text-white font-mono text-lg md:text-xl font-light tracking-widest">
                {(project.category || "").toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="relative aspect-[3/2] bg-gray-100">
              <Image
                src={firstDetail}
                alt={`${project.title} detail`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-black font-mono text-lg leading-relaxed font-light">
                {project.description || "No description available."}
              </p>
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {gallery.slice(1).map((img: any, index: number) => {
                const isVertical =
                  (index + 1) % 4 === 0 || (index + 1) % 5 === 0;
                const src =
                  imgUrl(
                    img,
                    isVertical ? 1200 : 1600,
                    isVertical ? 1600 : 1066
                  ) || "/placeholder.svg";
                return (
                  <div
                    key={stableKey(img, index)}
                    className={`relative ${
                      isVertical ? "aspect-[3/4]" : "aspect-[3/2]"
                    } bg-gray-100`}
                  >
                    <Image
                      src={src}
                      alt={`${project.title} gallery ${index + 2}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
