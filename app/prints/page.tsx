"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import PrintsCartDrawer from "@/components/prints-cart-drawer";
import { urlForImage, type Print } from "@/lib/sanity";
import { openCart } from "@/lib/cart";

// δέχεται μόνο αυτά τα δύο, αλλιώς undefined
function isCartStage(x: unknown): x is "cart" | "checkout" {
  return x === "cart" || x === "checkout";
}

export default function PrintsPage() {
  const [prints, setPrints] = useState<Print[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // query listening για άνοιγμα cart από το modal (π.χ. ?cart=open&stage=checkout)
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const handledQueryOnceRef = useRef(false);

  useEffect(() => {
    if (!searchParams) return;
    const cartOpen = searchParams.get("cart") === "open";
    if (!cartOpen) return;

    const stageRaw = searchParams.get("stage") || undefined;
    const stage = isCartStage(stageRaw) ? stageRaw : undefined;

    // Αποφυγή διπλού ανοίγματος σε Strict Mode
    if (!handledQueryOnceRef.current) {
      handledQueryOnceRef.current = true;
      openCart(stage);
    }

    // Καθάρισμα URL σε επόμενο tick ώστε να μην συγκρουστεί με τον Router state
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cart");
    params.delete("stage");
    const next = `${pathname}${params.size ? `?${params}` : ""}`;
    const id = setTimeout(() => {
      router.replace(next, { scroll: false });
    }, 0);
    return () => clearTimeout(id);
  }, [searchParams, pathname, router]);

  // Fallback: άνοιγμα cart αν υπάρχει flag στο sessionStorage (π.χ. από modal σε άλλο route)
  useEffect(() => {
    try {
      const flag =
        sessionStorage.getItem("cart:open-on-load") === "1" ||
        sessionStorage.getItem("cart:open") === "1";
      const stageRaw = sessionStorage.getItem("cart:open-stage") || undefined;
      const stage = isCartStage(stageRaw) ? stageRaw : undefined;
      if (flag) {
        sessionStorage.removeItem("cart:open-on-load");
        sessionStorage.removeItem("cart:open");
        sessionStorage.removeItem("cart:open-stage");
        openCart(stage);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch prints
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/prints/all", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Print[] = await res.json();
        if (alive) setPrints(data);
      } catch (e) {
        console.error("Error fetching prints:", e);
        if (alive) setPrints([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Δυναμικές κατηγορίες
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of prints) {
      const c = (p.category || "").toLowerCase().trim();
      if (c) set.add(c);
    }
    return ["all", ...Array.from(set).sort()];
  }, [prints]);

  const visible =
    selectedCategory === "all"
      ? prints
      : prints.filter(
          (p) => (p.category || "").toLowerCase().trim() === selectedCategory
        );

  return (
    <>
      <Navigation />

      {/* Drawer του cart */}
      <PrintsCartDrawer />

      <div className="min-h-screen bg-black pt-20">
        {/* Header */}
        <div className="bg-black border-b border-white/10 py-16 md:py-24">
          <div className="container-custom">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-mono text-4xl md:text-5xl font-normal mb-6 text-white">
                [ ] PRINTS
              </h1>
              <p className="font-mono text-lg leading-relaxed text-white/70">
                Browse the collection and open a print to view sizes &amp;
                order.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-black border-b border-white/10">
          <div className="container-custom py-6">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 font-mono text-sm uppercase tracking-wide transition-colors ${
                    selectedCategory === cat
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {cat === "all"
                    ? "All"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="container-custom py-16">
          {loading && (
            <div className="py-16 text-center font-mono text-white/80">
              LOADING PRINTS…
            </div>
          )}

          {!loading && visible.length === 0 && (
            <div className="text-center py-16">
              <p className="font-mono text-white/60">
                No prints found for the selected category.
              </p>
            </div>
          )}

          {!loading && visible.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
              {visible.map((p) => {
                const thumb =
                  urlForImage(p.image)
                    ?.width(700)
                    .height(875)
                    .fit("max")
                    .url() || "/placeholder.svg?height=875&width=700";
                const fromPrice = p.availableSizes?.[0]?.price ?? null;

                return (
                  <Link
                    key={p._id}
                    href={`/prints/${p.slug.current}`}
                    scroll={false}
                    prefetch={false}
                    className="group block bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all"
                  >
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={thumb}
                        alt={p.title}
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="font-mono text-base md:text-lg text-white tracking-wider mb-1 group-hover:text-white">
                        {p.title.toUpperCase()}
                      </h3>
                      <p className="font-mono text-xs md:text-sm text-white/70">
                        {fromPrice !== null ? `FROM €${fromPrice}` : "—"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
