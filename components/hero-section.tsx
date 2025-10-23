import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/echoes site-7956 (1).jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/60"></div>
      </div>

      {/* Content - added pt-12 (48px) for spacing above the logo */}
      <div className="container-custom relative z-10 text-center pt-12">
        <div className="max-w-3xl mx-auto">
          <Image
            src="/adamos_logo_bg_removed.png"
            alt="George Adamos"
            width={400}
            height={133}
            className="h-auto w-80 md:w-96 mx-auto mb-8 animate-fade-in"
            priority
          />
        </div>
      </div>
    </section>
  );
}
