import Footer from "@/components/footer";
import Navigation from "@/components/navigation";

import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import PortfolioSection from "@/components/portfolio-section";
import MediaSection from "@/components/media-section";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <MediaSection />
      </main>
      <Footer />
    </>
  );
}
