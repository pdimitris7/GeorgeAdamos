// components/portfolio-view.tsx
import Image from "next/image";
import { type PortfolioProject } from "@/lib/sanity-public";
import { hasImageAsset, stableKey, imgUrl } from "./portfolio-utils";

export default function PortfolioView({
  project,
}: {
  project: PortfolioProject;
}) {
  if (!project) return null;

  const heroSrc = imgUrl(project.heroImage, 2000, 1200) || "/placeholder.svg";

  const galleryRaw = Array.isArray(project.gallery) ? project.gallery : [];
  const gallery = galleryRaw.filter(hasImageAsset);
  const firstDetail = imgUrl(gallery[0], 1600, 1066) || heroSrc;

  return (
    <div className="w-full bg-white text-black">
      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden">
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
          <div className="text-center max-w-4xl px-6 sm:px-7 md:px-8">
            <h1 className="text-white font-mono text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-wide">
              {(project.title || "").toUpperCase()}
            </h1>
            <div className="text-white font-mono text-lg md:text-xl font-light tracking-widest">
              {(project.category || "").toUpperCase()}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 md:px-8 py-10 md:py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
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
            <p className="text-black font-mono text-base md:text-lg leading-relaxed font-light">
              {project.description || "No description available."}
            </p>
          </div>
        </div>

        {gallery.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4 mb-6">
            {gallery.slice(1).map((img: any, index: number) => {
              const isVertical = (index + 1) % 4 === 0 || (index + 1) % 5 === 0;
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
      </section>
    </div>
  );
}
