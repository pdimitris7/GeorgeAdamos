import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { getFeaturedPortfolioProjects, urlForImage } from "@/lib/sanity"

export default async function ProjectsPage() {
  const projects = await getFeaturedPortfolioProjects()

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-black text-white">
        <div className="container-custom py-16 md:py-24 pt-24 md:pt-32">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="font-mono text-4xl md:text-5xl font-bold mb-6">All Projects</h1>
            <p className="font-mono text-lg leading-relaxed">
              A comprehensive collection of my photography work across different genres and styles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link key={project._id} href={`/projects/${project.slug.current}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                  <Image
                    src={urlForImage(project.heroImage)?.url() || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                </div>

                <div className="space-y-2">
                  <span className="inline-block px-2 py-1 bg-white/10 text-white font-mono text-xs uppercase tracking-wide">
                    {project.category}
                  </span>
                  <h3 className="text-white font-mono text-lg font-semibold group-hover:text-gray-300 transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-gray-400 font-mono text-sm line-clamp-2">{project.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 font-mono text-lg">
                No projects found. Add some projects in the Sanity Studio.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
