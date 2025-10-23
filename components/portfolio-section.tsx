"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getHomePortfolioProjects,
  urlForImage,
  type PortfolioProject,
} from "@/lib/sanity";

export default function PortfolioSection() {
  const [items, setItems] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Μόνο όσα έχουν "Show on Homepage" (isFeatured true)
        const data = await getHomePortfolioProjects();
        if (alive) setItems(data.slice(0, 4)); // κρατάμε max 4 για το 4×2 layout
      } catch (e) {
        console.error("Failed to load homepage portfolio:", e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <section id="portfolio" className="py-16 md:py-24 bg-black text-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-mono text-3xl md:text-4xl font-normal mb-6 opacity-70">
              [ ] Portfolio
            </h2>
            <p className="font-mono text-base leading-relaxed mb-8">
              Loading featured projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section id="portfolio" className="py-16 md:py-24 bg-black text-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-mono text-3xl md:text-4xl font-normal mb-6 opacity-70">
              [ ] Portfolio
            </h2>
            <p className="font-mono text-base leading-relaxed mb-8">
              No projects selected for homepage.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Helper: ασφαλές URL για Image
  const src = (img: any, w = 1600, h = 1200) =>
    urlForImage(img)?.width(w).height(h).fit("max").url() || "/placeholder.svg";

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-black text-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="font-mono text-3xl md:text-4xl font-normal mb-6 opacity-70">
            [ ] Portfolio
          </h2>
          <p className="font-mono text-base leading-relaxed mb-8">
            A visual journey through impactful storytelling.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* =========================
              Desktop (≥md) — EXACT layout
              grid-cols-4 / grid-rows-2 / h-[600px]
             ========================= */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 h-[600px]">
            {/* Large tile (2x2) */}
            {items[0] && (
              <Link
                href={`/portfolio/${items[0].slug.current}`}
                scroll={false}
                className={`${
                  items[0].gridClass || "col-span-2 row-span-2"
                } group relative overflow-hidden`}
              >
                <Image
                  src={src(items[0].heroImage, 2000, 2000)}
                  alt={items[0].title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-black/80 text-white font-mono text-xs uppercase tracking-wide mb-3">
                    {items[0].category}
                  </span>
                  <h3 className="text-white font-mono text-xl font-semibold mb-2 leading-tight">
                    {items[0].title}
                  </h3>
                  <span className="text-gray-300 font-mono text-sm">
                    Read Story →
                  </span>
                </div>
              </Link>
            )}

            {/* Remaining 3 tiles (1x1) */}
            {items.slice(1).map((p) => (
              <Link
                key={p._id}
                href={`/portfolio/${p.slug.current}`}
                scroll={false}
                className={`${
                  p.gridClass || "col-span-1 row-span-1"
                } group relative overflow-hidden`}
              >
                <Image
                  src={src(p.heroImage, 1200, 900)}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-2 py-1 bg-black/80 text-white font-mono text-xs uppercase tracking-wide mb-2">
                    {p.category}
                  </span>
                  <h3 className="text-white font-mono text-sm font-semibold mb-1 leading-tight">
                    {p.title}
                  </h3>
                  <span className="text-gray-300 font-mono text-xs">
                    Read Story →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* =========================
              Mobile & Small ( < md )
              διατηρώ ίδια αισθητική αλλά responsive:
              - xs: 1 στήλη (stack)
              - sm: 2 στήλες
             ========================= */}
          <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((p) => (
              <Link
                key={p._id}
                href={`/portfolio/${p.slug.current}`}
                scroll={false}
                className="group relative overflow-hidden rounded-lg aspect-[4/3]"
              >
                <Image
                  src={src(p.heroImage, 1200, 900)}
                  alt={p.title}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-2 py-1 bg-black/80 text-white font-mono text-xs uppercase tracking-wide mb-2">
                    {p.category}
                  </span>
                  <h3 className="text-white font-mono text-sm sm:text-base font-semibold mb-1 leading-tight">
                    {p.title}
                  </h3>
                  <span className="text-gray-300 font-mono text-xs">
                    Read Story →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/portfolio"
            className="inline-block font-mono text-white text-lg font-medium underline"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
