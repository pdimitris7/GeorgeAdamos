// components/prints-section.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllPrints, urlForImage, type Print } from "@/lib/sanity";
import PrintModal from "@/components/print-modal";

export default function PrintsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prints, setPrints] = useState<Print[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Print | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // μπορείς να το αλλάξεις να χτυπάει /api/prints/all αν προτιμάς server route
        const data = await getAllPrints();
        if (mounted) setPrints(data.slice(0, 6)); // δείξε 6 στην αρχική
      } catch (e) {
        console.error("Error fetching prints:", e);
        if (mounted) setPrints([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // fade-in on view
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

  return (
    <section id="prints" ref={sectionRef} className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 px-4">
          <h2 className="heading-lg text-brown mb-4">Prints & Shop</h2>
          <p className="body-md text-navy-dark">
            Bring the artistry of my photography into your space with premium
            quality prints.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center font-mono text-navy-dark">
            LOADING PRINTS…
          </div>
        )}

        {/* Empty */}
        {!loading && prints.length === 0 && (
          <div className="py-16 text-center font-mono text-navy-dark/70">
            No prints available yet.
          </div>
        )}

        {/* Grid */}
        {!loading && prints.length > 0 && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {prints.map((p) => {
              const thumb =
                urlForImage(p.image)?.width(700).height(875).fit("max").url() ||
                "/placeholder.svg?height=875&width=700";
              const fromPrice = p.availableSizes?.[0]?.price ?? null;
              return (
                <button
                  key={p._id}
                  onClick={() => setSelected(p)}
                  className="group text-left bg-beige-light rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
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
                    <h3 className="font-mono text-base md:text-lg text-navy tracking-wider mb-1 group-hover:text-brown transition-colors">
                      {p.title.toUpperCase()}
                    </h3>
                    <p className="font-mono text-xs md:text-sm text-navy-dark/80">
                      {fromPrice !== null ? `FROM €${fromPrice}` : "—"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* CTA κάτω */}
        <div className="mt-12 md:mt-16 text-center px-4">
          <div className="max-w-2xl mx-auto p-8 bg-beige rounded-lg">
            <h3 className="heading-sm text-brown mb-4">Custom Orders</h3>
            <p className="body-md text-navy-dark mb-6">
              Looking for a specific image or custom size? Contact me directly
              to discuss your requirements and create a bespoke piece for your
              space.
            </p>
            <Link
              href="mailto:contact@georgeadamos.com"
              className="inline-block px-8 py-3 bg-brown text-white rounded-md hover:bg-brown-light transition-colors"
            >
              Request Custom Print
            </Link>
          </div>

          <div className="mt-8">
            <Link
              href="/prints"
              className="inline-block font-mono text-navy text-lg underline hover:animate-bounce transition-all"
            >
              View All Prints
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PrintModal print={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
