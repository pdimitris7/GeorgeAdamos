"use client";

import { useRef, useEffect, useState } from "react";

export default function AboutSection() {
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
      {
        threshold: 0.2,
      }
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

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen bg-black text-white py-16 md:py-24 flex items-center"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8 w-full">
        <div className="mb-16 md:mb-12 text-3xl font-mono opacity-70">
          [ ] About George
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div
            className={`space-y-6 md:space-y-8 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div>
              <h2 className="text-lg md:text-xl font-mono mb-3 md:mb-4 tracking-wide">
                Passionate about shooting lands and food
              </h2>
              <div className="font-mono text-xs md:text-sm leading-relaxed opacity-90">
                <p>humans and their stories</p>
              </div>
            </div>

            <div className="pl-6 md:pl-12">
              <h2 className="text-xl md:text-2xl font-mono mb-3 md:mb-4 tracking-wide">
                Discover and highlight the intricate details
              </h2>
              <div className="font-mono text-xs md:text-sm leading-relaxed opacity-90">
                <p>to evoke emotions and moods</p>
              </div>
            </div>

            <div className="pl-3 md:pl-6">
              <h2 className="text-xl md:text-2xl font-mono mb-3 md:mb-4 tracking-wide">
                To create stories
              </h2>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="text-sm font-mono mb-3 md:mb-4 opacity-70">
                  [PHILOSOPHY]
                </h3>
                <div className="font-mono text-xs md:text-sm leading-relaxed opacity-90">
                  <p>
                    Every dish tells a story.
                    <br />
                    Every ingredient has a purpose.
                    <br />
                    Every frame captures a moment
                    <br />
                    that connects people to food.
                  </p>
                </div>
              </div>

              <div className="pl-3 md:pl-6">
                <h3 className="text-sm font-mono mb-3 md:mb-4 opacity-70">
                  [APPROACH]
                </h3>
                <div className="font-mono text-xs md:text-sm leading-relaxed opacity-90">
                  <p>
                    We don't just photograph food.
                    <br />
                    We capture the essence of culinary
                    <br />
                    craftsmanship, the passion behind
                    <br />
                    each creation, and the emotions
                    <br />
                    that great food evokes.
                  </p>
                </div>
              </div>

              <div className="pl-6 md:pl-12">
                <h3 className="text-sm font-mono mb-3 md:mb-4 opacity-70">
                  [Culture]
                </h3>
                <div className="font-mono text-xs md:text-sm leading-relaxed opacity-90">
                  <p>
                    GEORGE ADAMOS
                    <br />
                    Food & Travel Photographer
                    <br />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
