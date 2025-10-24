import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { getPortfolioProject, urlForImage } from "@/lib/sanity.base";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getPortfolioProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-black text-white">
        <div className="container-custom py-16 md:py-24 pt-24 md:pt-32">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/projects"
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors font-mono"
            >
              <ArrowLeft size={20} />
              Back to Projects
            </Link>
          </div>

          {/* Hero Section */}
          <div className="relative h-[60vh] w-full overflow-hidden mb-12 rounded-lg">
            <Image
              src={urlForImage(project.heroImage)?.url() || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-4xl px-8">
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-mono text-sm font-medium uppercase tracking-wide mb-4">
                  {project.category}
                </span>
                <h1 className="text-white font-mono text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {project.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className="max-w-4xl mx-auto mb-16">
              <p className="text-white font-mono text-lg leading-relaxed text-center">
                {project.description}
              </p>
            </div>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {project.gallery.map((image, index) => {
                const aspectRatios = [
                  "aspect-[4/5]", // portrait
                  "aspect-[3/2]", // landscape
                  "aspect-square", // square
                  "aspect-[5/4]", // slightly portrait
                  "aspect-[16/9]", // wide
                  "aspect-[2/3]", // tall portrait
                ];
                const aspectRatio = aspectRatios[index % aspectRatios.length];

                return (
                  <div
                    key={index}
                    className={`relative ${aspectRatio} w-full break-inside-avoid mb-6 overflow-hidden rounded-lg`}
                  >
                    <Image
                      src={urlForImage(image)?.url() || "/placeholder.svg"}
                      alt={`${project.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
