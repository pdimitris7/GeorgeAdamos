// components/media-modal.tsx
"use client";

import { useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ExternalLink, Calendar, BookOpen } from "lucide-react";
import { urlForImage, type MediaPost } from "@/lib/sanity-public";

function hasImageAsset(img: any) {
  return Boolean(img?.asset?._ref || img?._ref);
}

// Παράγει σειρές: 2 εικόνες, 1 wide, 4 τετράγωνες
function buildRows(images: any[]) {
  const rows: { kind: "two" | "one" | "four"; images: any[] }[] = [];
  let i = 0;
  while (i < images.length) {
    const end2 = Math.min(i + 2, images.length);
    if (end2 > i)
      rows.push({
        kind: end2 - i === 1 ? "one" : "two",
        images: images.slice(i, end2),
      });
    i = end2;

    if (i < images.length) {
      rows.push({ kind: "one", images: images.slice(i, i + 1) });
      i += 1;
    }

    const end4 = Math.min(i + 4, images.length);
    if (end4 > i)
      rows.push({
        kind: end4 - i < 4 ? (end4 - i === 1 ? "one" : "two") : "four",
        images: images.slice(i, end4),
      });
    i = end4;
  }
  return rows;
}

type Props = { post: MediaPost | null; onClose?: () => void };

export default function MediaModal({ post, onClose }: Props) {
  const router = useRouter();

  // Κλείσιμο modal
  const close = useCallback(() => {
    if (onClose) onClose();
    else router.back();
  }, [onClose, router]);

  // Lock scroll + ESC
  useEffect(() => {
    if (!post) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [post, close]);

  const heroUrl = useMemo(() => {
    const b = urlForImage(post?.featuredImage);
    return b ? b.width(1600).height(900).fit("max").url() : "/placeholder.svg";
  }, [post]);

  const gallery = useMemo(() => {
    const arr: any[] = Array.isArray(post?.gallery)
      ? (post!.gallery as any[])
      : [];
    return arr.filter(hasImageAsset);
  }, [post]);

  const rows = useMemo(() => buildRows(gallery), [gallery]);

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay - click έξω = close */}
      <div
        className="absolute inset-0 bg-black/90"
        onClick={close}
        aria-hidden="true"
      />

      {/* Container */}
      <div
        className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 md:p-6"
        onClick={close}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-[95vw] sm:max-w-3xl lg:max-w-6xl max-h-[92vh] bg-white overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky header (μαύρος) + X χωρίς background */}
          <div className="sticky top-0 z-20 w-full bg-black text-white">
            <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 font-mono">
                  <span className="truncate">{post.publication}</span>
                  <span className="hidden sm:inline">|</span>
                  <span className="truncate">{post.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {post.externalLink && (
                  <Link
                    href={post.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-white text-black text-xs sm:text-sm rounded hover:bg-gray-200 transition-colors"
                  >
                    <span className="hidden sm:inline">Reference</span>
                    <ExternalLink size={14} />
                  </Link>
                )}
                <button
                  onClick={close}
                  aria-label="Close"
                  className="p-1 text-white hover:opacity-80 transition-opacity"
                >
                  <X className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* HERO */}
          <div className="relative w-full h-[26vh] sm:h-[36vh] md:h-[46vh] lg:h-[56vh] overflow-hidden">
            <Image
              src={heroUrl}
              alt={post.title}
              fill
              priority
              sizes="(min-width:1280px) 60vw, (min-width:1024px) 70vw, (min-width:640px) 90vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* BODY */}
          <div className="bg-white">
            {/* Meta + Title + Excerpt */}
            <div className="py-6 sm:py-8 md:py-10">
              <div className="container-custom">
                <div className="text-center max-w-4xl mx-auto px-3 sm:px-4">
                  <div className="flex items-center justify-center gap-2 text-gray-600 font-mono text-xs sm:text-sm mb-2 sm:mb-3">
                    <span className="inline-flex items-center">
                      <BookOpen size={12} className="mr-1" />
                      {post.category}
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-black mb-3 sm:mb-4">
                    {post.title}
                  </h1>
                  {post.excerpt && (
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* GALLERY (responsive) */}
            {rows.length ? (
              <div className="space-y-0">
                {rows.map((row, rIdx) => {
                  if (row.kind === "two") {
                    return (
                      <div
                        key={`row-${rIdx}`}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4"
                      >
                        {row.images.map((img, i) => (
                          <div
                            key={img._key || i}
                            className="relative aspect-[4/3] overflow-hidden rounded-md"
                          >
                            <Image
                              src={
                                urlForImage(img)
                                  ?.width(1600)
                                  .height(1200)
                                  .fit("max")
                                  .url() || "/placeholder.svg"
                              }
                              alt={`Gallery ${rIdx}-${i}`}
                              fill
                              sizes="(min-width:1280px) 48vw, (min-width:640px) 50vw, 100vw"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    );
                  }

                  if (row.kind === "one") {
                    return (
                      <div
                        key={`row-${rIdx}`}
                        className="px-3 sm:px-4 pt-3 sm:pt-4"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden rounded-md">
                          <Image
                            src={
                              urlForImage(row.images[0])
                                ?.width(1920)
                                .height(1080)
                                .fit("max")
                                .url() || "/placeholder.svg"
                            }
                            alt={`Gallery ${rIdx}-0`}
                            fill
                            sizes="100vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    );
                  }

                  // four -> 2 στήλες στο mobile / 4 από sm+
                  return (
                    <div
                      key={`row-${rIdx}`}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-3 sm:px-4 pt-3 sm:pt-4"
                    >
                      {row.images.map((img, i) => (
                        <div
                          key={img._key || i}
                          className="relative aspect-square overflow-hidden rounded-md"
                        >
                          <Image
                            src={
                              urlForImage(img)
                                ?.width(1000)
                                .height(1000)
                                .fit("max")
                                .url() || "/placeholder.svg"
                            }
                            alt={`Gallery ${rIdx}-${i}`}
                            fill
                            sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 pb-10 text-center text-gray-500">
                No gallery images for this post.
              </div>
            )}

            {/* Μαύρο footer CTA */}
            <div className="bg-black py-10 sm:py-12 mt-6">
              <div className="container-custom text-center px-3 sm:px-4">
                <p className="text-base sm:text-lg text-white mb-4 sm:mb-6">
                  Read the full article
                </p>
                {post.externalLink && (
                  <Link
                    href={post.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium"
                  >
                    <span>Visit {post.publication}</span>
                    <ExternalLink size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* /BODY */}
        </div>
      </div>
    </div>
  );
}
