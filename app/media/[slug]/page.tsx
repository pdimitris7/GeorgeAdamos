// app/media/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ExternalLink } from "lucide-react";

// ✅ server-only queries
import { getPortfolioBySlug } from "@/lib/sanity.server";
// ✅ public image builder + type
import { urlForImage, type MediaPost } from "@/lib/sanity-public";

type Props = { params: { slug: string } };

export const revalidate = 60;

export default async function MediaPostPage({ params }: Props) {
  const post = await getMediaBySlug(params.slug);
  if (!post) return notFound();

  const heroUrl =
    urlForImage(post.featuredImage)?.width(1600).height(900).fit("max").url() ||
    "/placeholder.svg";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-6">
        <div className="container-custom">
          <Link
            href="/media"
            className="inline-flex items-center gap-2 font-mono text-gray-600 hover:text-gray-900"
          >
            ← Back to Media
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative w-full h-[28vh] sm:h-[38vh] md:h-[48vh] lg:h-[58vh]">
        <Image
          src={heroUrl}
          alt={post.title}
          fill
          priority
          sizes="(min-width:1280px) 60vw, (min-width:1024px) 70vw, (min-width:640px) 90vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* Meta + Title + Excerpt */}
      <div className="container-custom py-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-gray-600 font-mono text-sm mb-3">
            <span className="inline-flex items-center">
              <BookOpen size={12} className="mr-1" />
              {post.category}
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-black mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-gray-700 text-lg leading-relaxed">
              {post.excerpt}
            </p>
          )}
          <p className="text-sm font-medium text-gray-500 font-mono uppercase tracking-wide mt-3">
            {post.publication}
          </p>
        </div>
      </div>

      {/* Gallery */}
      {Array.isArray(post.gallery) && post.gallery.length > 0 ? (
        <div className="space-y-0">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4">
            {post.gallery.slice(0, 2).map((img: any, i: number) => (
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
                  alt={`Gallery 0-${i}`}
                  fill
                  sizes="(min-width:1280px) 48vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {post.gallery[2] && (
            <div className="px-3 sm:px-4 pt-3 sm:pt-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-md">
                <Image
                  src={
                    urlForImage(post.gallery[2])
                      ?.width(1920)
                      .height(1080)
                      .fit("max")
                      .url() || "/placeholder.svg"
                  }
                  alt="Gallery wide"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {post.gallery.length > 3 && (
            <div className="grid grid-cols-4 gap-3 sm:gap-4 px-3 sm:px-4 pt-3 sm:pt-4">
              {post.gallery.slice(3).map((img: any, i: number) => (
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
                    alt={`Gallery 3-${i}`}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Μαύρο footer CTA */}
      <div className="bg-black py-12 mt-6">
        <div className="container-custom text-center">
          <p className="text-lg text-white mb-6">Read the full article</p>
          {post.externalLink && (
            <Link
              href={post.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              <span>Visit {post.publication}</span>
              <ExternalLink size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const posts: MediaPost[] = await getAllMediaPosts();
  return posts
    .filter((p) => p?.slug?.current)
    .map((p) => ({ slug: p.slug.current }));
}
