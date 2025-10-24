// app/portfolio/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft } from "lucide-react";

// ⬇️ ΧΡΗΣΙΜΟΠΟΙΗΣΕ ΤΟ lib/sanity (builder), ΟΧΙ sanity-public
import { urlForImage, type PortfolioProject } from "@/lib/sanity-public";

function toTitleCase(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/portfolio/all", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: PortfolioProject[] = await res.json();
        if (mounted) setItems(data);
      } catch (e) {
        console.error("Error fetching portfolio projects:", e);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Δυναμικές κατηγορίες
  const categoryItems = useMemo(() => {
    const set = new Set(
      items.map((p) => (p.category || "").toLowerCase().trim()).filter(Boolean)
    );
    return ["all", ...Array.from(set).sort()];
  }, [items]);

  const filtered =
    selectedCategory === "all"
      ? items
      : items.filter(
          (p) => (p.category || "").toLowerCase().trim() === selectedCategory
        );

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <h1 className="font-mono text-4xl md:text-5xl font-normal mb-6 text-white-800">
            Loading Portfolio...
          </h1>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-white pt-20">
        {/* Header */}
        <div className="bg-gray-50 py-16 md:py-24">
          <div className="container-custom">
            <div className="flex items-center mb-8">
              <Link
                href="/#portfolio"
                className="inline-flex items-center space-x-2 font-mono text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </Link>
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-mono text-4xl md:text-5xl font-normal mb-6 text-gray-800">
                [ ] Portfolio
              </h1>
              <p className="font-mono text-lg leading-relaxed text-gray-600">
                Complete collection of projects, stories, and visuals.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200">
          <div className="container-custom py-6">
            <div className="flex flex-wrap justify-center gap-4">
              {categoryItems.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 font-mono text-sm uppercase tracking-wide transition-colors ${
                    selectedCategory === cat
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {toTitleCase(cat)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="container-custom py-16">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-mono text-gray-600">
                No projects found for the selected category.
              </p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filtered.map((project) => {
                  const src =
                    urlForImage(project.heroImage)
                      ?.width(1600)
                      .height(1200)
                      .fit("max")
                      .url() ??
                    "/placeholder.svg?height=900&width=1200&query=portfolio";

                  return (
                    <Link
                      key={project._id}
                      href={`/portfolio/${project.slug.current}`}
                      scroll={false} // αν έχεις intercepting modal
                      className="group block"
                    >
                      <div className="relative overflow-hidden mb-4 aspect-[4/3] rounded-lg">
                        <Image
                          src={src}
                          alt={project.title}
                          fill
                          sizes="(min-width:1024px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white font-mono text-base md:text-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            Read Story
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-gray-900 text-white text-xs font-mono uppercase tracking-wide rounded">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-gray-900 font-serif text-lg font-semibold">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
