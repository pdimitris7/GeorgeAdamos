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
      },
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
          {/* First Column */}
          <div
            className={`space-y-10 md:space-y-12 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div>
              <h2 className="text-lg md:text-xl font-mono mb-3 md:mb-4 tracking-wide">
                Facts
              </h2>
              <div className="font-mono text-xs md:text-sm leading-relaxed opacity-90">
                <p>
                  Passionate about shooting lands and food
                  <br />
                  humans and their stories
                  <br />
                  Discover and highlight the intricate details
                  <br />
                  to evoke emotions and moods
                  <br />
                  To create stories
                </p>
              </div>
            </div>

            <div className="pl-6 md:pl-12">
              <h2 className="text-xl md:text-2xl font-mono mb-3 md:mb-4 tracking-wide">
                And feelings
              </h2>
              <div className="font-mono text-xs md:text-sm leading-relaxed opacity-90">
                <p>
                  The last light of the day
                  <br />
                  And the first
                  <br />
                  The clouds touching a mountain peak
                  <br />
                  A shy smile
                  <br />
                  A human movement
                  <br />
                  A pot boiling
                  <br />
                  The smoke of the fire
                </p>
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="space-y-8 md:space-y-10">
              <div>
                <h3 className="text-sm font-mono mb-3 md:mb-4 opacity-70 uppercase tracking-widest">
                  [Approach]
                </h3>
                <div className="font-mono text-xs md:text-sm leading-relaxed opacity-90">
                  <p>
                    Documentary
                    <br />
                    Atmospheric
                    <br />
                    Abstract
                  </p>
                </div>
              </div>

              <div className="pl-3 md:pl-6">
                <h3 className="text-sm font-mono mb-3 md:mb-4 opacity-70 uppercase tracking-widest">
                  [Philosophy]
                </h3>
                <div className="font-mono text-xs md:text-sm leading-relaxed opacity-90">
                  <p>
                    Portraying the essence
                    <br />
                    Portraying the soul
                  </p>
                </div>
              </div>

              <div className="pl-6 md:pl-12">
                <h3 className="text-sm font-mono mb-3 md:mb-4 opacity-70 uppercase tracking-widest">
                  [Culture]
                </h3>
                <div className="font-mono text-xs md:text-sm leading-relaxed opacity-90">
                  <p>
                    The classics
                    <br />
                    Black and white
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
