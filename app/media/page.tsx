// app/media/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, BookOpen, ArrowLeft } from "lucide-react";
import { urlForImage, type MediaPost } from "@/lib/sanity.base";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

function toTitleCase(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function MediaPage() {
  const [mediaPosts, setMediaPosts] = useState<MediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/media/all", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const posts: MediaPost[] = await res.json();
        setMediaPosts(posts);
      } catch (e) {
        console.error("Error fetching media posts:", e);
        setMediaPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categoryItems = useMemo(() => {
    const set = new Set(
      mediaPosts
        .map((p) => (p.category || "").toLowerCase().trim())
        .filter(Boolean)
    );
    return ["all", ...Array.from(set).sort()];
  }, [mediaPosts]);

  const filtered =
    selectedCategory === "all"
      ? mediaPosts
      : mediaPosts.filter(
          (p) => (p.category || "").toLowerCase().trim() === selectedCategory
        );

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-mono text-4xl md:text-5xl font-normal mb-6 text-gray-800">
              Loading Media...
            </h1>
          </div>
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
                href="/#media"
                className="inline-flex items-center space-x-2 font-mono text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </Link>
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-mono text-4xl md:text-5xl font-normal mb-6 text-gray-800">
                [ ] Media Coverage
              </h1>
              <p className="font-mono text-lg leading-relaxed text-gray-600">
                Complete collection of publications, interviews, and articles.
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

        {/* List */}
        <div className="container-custom py-16">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-mono text-gray-600">
                No media posts found for the selected category.
              </p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="space-y-12">
                {filtered.map((post, index) => (
                  <Link
                    key={post._id}
                    href={`/media/${post.slug.current}`}
                    scroll={false}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center group ${
                      index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                    }`}
                  >
                    {/* Image */}
                    <div
                      className={`relative aspect-[4/3] overflow-hidden rounded-lg ${
                        index % 2 === 1 ? "lg:col-start-2" : ""
                      }`}
                    >
                      <Image
                        src={
                          urlForImage(post.featuredImage)
                            ?.width(1200)
                            .height(900)
                            .fit("max")
                            .url() ||
                          "/placeholder.svg?height=400&width=600&query=media"
                        }
                        alt={post.title}
                        fill
                        sizes="(min-width:1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 bg-white/90 text-gray-800 font-mono text-xs font-medium uppercase tracking-wide rounded-full">
                          <BookOpen size={12} className="mr-1" />
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div
                      className={`${
                        index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                      }`}
                    >
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-gray-500 font-mono uppercase tracking-wide">
                          {post.publication}
                        </p>

                        <h3 className="text-2xl md:text-3xl font-serif text-gray-900 leading-tight group-hover:text-gray-700 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-gray-700 leading-relaxed text-lg">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center space-x-4 pt-4">
                          <span className="inline-flex items-center space-x-2 font-mono text-gray-900 group-hover:text-gray-600 transition-colors">
                            <span>Click to read more</span>
                            <ExternalLink
                              size={16}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
