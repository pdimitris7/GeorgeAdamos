// components/media-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, BookOpen } from "lucide-react";
import { urlForImage, type MediaPost } from "@/lib/sanity";

export default function MediaSection() {
  const [mediaPosts, setMediaPosts] = useState<MediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/media/home", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const posts: MediaPost[] = await res.json();
        // Δείξε μέχρι 3 στην αρχική — αν θες ΟΛΑ, βγάλε το slice:
        setMediaPosts(posts);
      } catch (error) {
        console.error("Error fetching media posts:", error);
        setMediaPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // απλό reveal on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) obs.unobserve(sectionRef.current);
    };
  }, []);

  if (loading) {
    return (
      <section
        id="media"
        ref={sectionRef}
        className="py-16 md:py-24 bg-gray-50"
      >
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-mono text-3xl md:text-4xl font-normal mb-6 text-gray-800">
              [ ] Media Coverage
            </h2>
            <p className="font-mono text-base leading-relaxed text-gray-600">
              Loading media posts...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!mediaPosts.length) {
    return (
      <section
        id="media"
        ref={sectionRef}
        className="py-16 md:py-24 bg-gray-50"
      >
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-mono text-3xl md:text-4xl font-normal mb-6 text-gray-800">
              [ ] Media Coverage
            </h2>
            <p className="font-mono text-base leading-relaxed text-gray-600">
              No media posts enabled for Home. Enable{" "}
              <strong>Show on Home</strong> in Sanity.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="media" ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16 px-4">
          <h2 className="font-mono text-2xl md:text-3xl lg:text-4xl font-normal mb-4 md:mb-6 text-gray-800">
            [ ] Media Coverage
          </h2>
          <p className="font-mono text-sm md:text-base leading-relaxed text-gray-600 mb-6 md:mb-8">
            Publications and articles.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-16 md:space-y-20">
            {mediaPosts.map((post, index) => (
              <div
                key={post._id}
                className={`transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <Link
                  href={`/media/${post.slug.current}`}
                  scroll={false}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center group ${
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

                  {/* Text */}
                  <div
                    className={`${
                      index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                    }`}
                  >
                    <div className="space-y-3 md:space-y-4">
                      <p className="text-sm font-medium text-gray-500 font-mono uppercase tracking-wide">
                        {post.publication}
                      </p>

                      <h3 className="text-xl md:text-2xl lg:text-3xl font-serif text-gray-900 leading-tight group-hover:text-gray-700 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center space-x-4 pt-2 md:pt-4">
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
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/media"
            className="inline-block font-mono text-gray-900 text-lg font-medium underline hover:animate-bounce transition-all duration-200"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
