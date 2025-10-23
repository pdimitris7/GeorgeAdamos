import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-beige-light py-12">
      <div className="container-custom">
        <div className="flex flex-col items-center">
          <Image
            src="/adamos_logo_bg_removed.png"
            alt="George Adamos"
            width={180}
            height={60}
            className="h-auto w-36 mb-8"
          />

          <div className="flex space-x-6 mb-8">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-beige transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-beige transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={24} />
            </Link>
            <Link
              href="mailto:contact@georgeadamos.com"
              className="hover:text-beige transition-colors"
              aria-label="Email"
            >
              <Mail size={24} />
            </Link>
          </div>

          <div className="text-center mb-8">
            <p className="mb-2">contact@georgeadamos.com</p>
            <p>Athens, Greece</p>
          </div>

          <nav className="mb-8">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              <li>
                <Link href="#about" className="text-sm hover:text-beige transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="text-sm hover:text-beige transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#commercial" className="text-sm hover:text-beige transition-colors">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="#media" className="text-sm hover:text-beige transition-colors">
                  Media
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm hover:text-beige transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Removed copyright text completely */}
        </div>
      </div>
    </footer>
  )
}
