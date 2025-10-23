"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

// Sample food gallery images
const foodGalleryImages = Array(12)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=800&width=800&text=Food+${i + 1}`,
    alt: `Food photography sample ${i + 1}`,
  }));

export default function FoodGallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const openImage = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = "hidden";
  };

  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = "";
  };

  // FIX: χωρίς functional updater -> δεν υπάρχει πιθανό null "prev"
  const nextImage = () => {
    if (selectedImage === null) return;
    const next =
      selectedImage === foodGalleryImages.length - 1 ? 0 : selectedImage + 1;
    setSelectedImage(next);
  };

  const prevImage = () => {
    if (selectedImage === null) return;
    const prev =
      selectedImage === 0 ? foodGalleryImages.length - 1 : selectedImage - 1;
    setSelectedImage(prev);
  };

  // Close on escape / navigate με βελάκια ΜΟΝΟ όταν είναι ανοιχτό
  useEffect(() => {
    if (selectedImage === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage]);

  return (
    <section
      id="food-gallery"
      ref={sectionRef}
      className="py-16 md:py-24 bg-beige"
    >
      <div className="container-custom px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-brown mb-3 md:mb-4">
            Food Gallery
          </h2>
          <p className="text-sm md:text-base text-navy-dark leading-relaxed">
            A curated collection showcasing the artistry and detail of my food
            photography.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {foodGalleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`transition-all duration-700 delay-${Math.min(
                index * 50,
                500
              )} ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => openImage(index)}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/95 p-2 md:p-4 lg:p-10">
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-50 text-white hover:text-beige transition-colors"
            aria-label="Close"
          >
            <X size={24} className="md:w-8 md:h-8" />
          </button>

          <div className="relative w-full max-w-5xl aspect-square md:aspect-auto md:h-[80vh]">
            <Image
              src={foodGalleryImages[selectedImage].src || "/placeholder.svg"}
              alt={foodGalleryImages[selectedImage].alt}
              fill
              className="object-contain"
            />

            {/* Navigation arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 flex items-center justify-center text-navy hover:bg-white transition-colors text-sm md:text-base"
              aria-label="Previous image"
            >
              &#10094;
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 flex items-center justify-center text-navy hover:bg-white transition-colors text-sm md:text-base"
              aria-label="Next image"
            >
              &#10095;
            </button>

            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
              {selectedImage + 1} / {foodGalleryImages.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
