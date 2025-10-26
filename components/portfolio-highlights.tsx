import Link from "next/link";
import Image from "next/image";
import { imgUrl } from "./portfolio-utils";

export type HighlightItem = {
  slug: string;
  title: string;
  heroImage?: any;
  coverImage?: any;
  mainImage?: any;
  image?: any;
  category?: string;
};

export default function PortfolioHighlights({
  items,
  currentSlug,
  className,
}: {
  items: HighlightItem[];
  currentSlug?: string;
  className?: string;
}) {
  if (!items?.length) return null;

  return (
    <div
      className={`w-full bg-black border-b border-white/10 pt-24 ${
        className ?? ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-8 md:py-10">
        <div className="flex gap-6 sm:gap-8 md:gap-10 overflow-x-auto no-scrollbar snap-x scroll-smooth py-4">
          {items.map((it) => {
            const isActive = it.slug === currentSlug;
            const rawImg =
              it.heroImage ?? it.coverImage ?? it.mainImage ?? it.image;
            const thumb = imgUrl(rawImg, 200, 200) || "/placeholder.svg";

            return (
              <Link
                key={it.slug}
                href={`/portfolio/${it.slug}`}
                aria-label={`Άνοιγμα project: ${it.title}`}
                aria-current={isActive ? "page" : undefined}
                className="snap-start flex flex-col items-center shrink-0"
              >
                <div
                  className={[
                    "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28",
                    "rounded-full overflow-hidden ring-2 transition-all duration-200",
                    isActive ? "ring-white" : "ring-white/20",
                  ].join(" ")}
                >
                  <Image
                    src={thumb || "/placeholder.svg"}
                    alt={it.title}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <span
                  className={[
                    "mt-3 leading-tight text-center transition-colors duration-200",
                    "text-xs sm:text-sm tracking-wide font-sans",
                    "max-w-[6rem] sm:max-w-[7rem] line-clamp-2",
                    isActive ? "text-white" : "text-white/60",
                  ].join(" ")}
                  title={it.title}
                >
                  {it.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
