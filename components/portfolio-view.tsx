// components/portfolio-view.tsx
import Image from "next/image";
import { type PortfolioProject, type GalleryItem } from "@/lib/sanity-public";
import { hasImageAsset, stableKey, imgUrl } from "./portfolio-utils";
import createImageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fyr1ddav";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const builder = createImageUrlBuilder({ projectId, dataset });

/** Build a URL from a resolved gallery item (asset + hotspot + crop) */
function galleryItemUrl(item: GalleryItem, w: number, h: number): string {
  if (!item?.asset) return "/placeholder.svg";
  try {
    const src: any = { asset: item.asset };
    if (item.hotspot) src.hotspot = item.hotspot;
    if (item.crop) src.crop = item.crop;
    return builder.image(src).width(w).height(h).fit("crop").url();
  } catch {
    return "/placeholder.svg";
  }
}

/** Map size string → Tailwind col/row span classes.
 *  Mobile: always full width (col-span-1 in a 1-col grid).
 *  Desktop (md+): masonry spans apply. */
function sizeToClasses(size: string): string {
  switch (size) {
    case "2x1": return "col-span-1 md:col-span-2 md:row-span-1";
    case "1x2": return "col-span-1 md:col-span-1 md:row-span-2";
    case "2x2": return "col-span-1 md:col-span-2 md:row-span-2";
    default:    return "col-span-1 md:col-span-1 md:row-span-1";
  }
}

/** Resolve dimensions for Sanity image URL based on size */
function sizeToPixels(size: string): { w: number; h: number } {
  switch (size) {
    case "2x1": return { w: 1600, h: 800 };
    case "1x2": return { w: 800, h: 1600 };
    case "2x2": return { w: 1400, h: 1400 };
    default:    return { w: 800, h: 800 };
  }
}

export default function PortfolioView({
  project,
}: {
  project: PortfolioProject;
}) {
  if (!project) return null;

  const heroSrc = imgUrl(project.heroImage, 2000, 1200) || "/placeholder.svg";

  const gallery = Array.isArray(project.gallery)
    ? project.gallery.filter((item) => item?.asset)
    : [];

  return (
    <div className="w-full bg-white text-black">

      {/* ── Hero ── */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={heroSrc}
          alt={project.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-6">
            <h1 className="text-white font-mono text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-wide">
              {(project.title || "").toUpperCase()}
            </h1>
            <div className="text-white font-mono text-lg md:text-xl font-light tracking-widest">
              {(project.category || "").toUpperCase()}
            </div>
          </div>
        </div>
      </section>

      {/* ── Description ── */}
      {project.description && (
        <section className="px-6 md:px-12 py-12 max-w-3xl mx-auto text-center">
          <p className="text-black font-mono text-base md:text-lg leading-relaxed font-light">
            {project.description}
          </p>
        </section>
      )}

      {/* ── Masonry Gallery ── */}
      {gallery.length > 0 && (
        <section className="px-4 md:px-6 pb-20 md:pb-16 max-w-7xl mx-auto">
          {/* Mobile: 1 column, each image 4:3 aspect ratio, full width.
              Desktop (md+): 4-column masonry grid with row/col spans per size. */}
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-3 md:[grid-auto-rows:clamp(160px,22vw,320px)]"
          >
            {gallery.map((item, index) => {
              const size = item.size || "1x1";
              const span = sizeToClasses(size);
              const { w, h } = sizeToPixels(size);
              const src = galleryItemUrl(item, w, h);
              const alt = item.alt || `${project.title} — ${index + 1}`;

              return (
                <div
                  key={item._key || index}
                  className={`${span} relative overflow-hidden bg-gray-100 group aspect-[4/3] md:aspect-auto`}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(min-width: 768px) 25vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
