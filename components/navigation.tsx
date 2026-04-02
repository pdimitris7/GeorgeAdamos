"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { openCart, getCount, onCartUpdated } from "@/lib/cart";

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const onPrints = pathname?.startsWith("/prints");

  useEffect(() => {
    if (!onPrints) return;
    setCartCount(getCount());
    const off = onCartUpdated(() => setCartCount(getCount()));
    return () => off?.();
  }, [onPrints]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (href: string) => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          <Link
            href="/"
            className="relative z-50"
            onClick={() => handleNavigation("/")}
          >
            <div className="w-[80px] h-[80px] flex items-center justify-center">
              <Image
                src="/logo-static.png"
                alt="George Adamos"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {onPrints && (
              <button
                onClick={() => openCart("cart")}
                className="relative z-50 p-2 text-beige-light hover:text-brown-light transition-colors flex items-center justify-center"
                aria-label="Open cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white text-black text-[9px] font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={toggleMenu}
              className="relative z-50 p-2 text-beige-light hover:text-brown-light transition-colors flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black" onClick={toggleMenu} />

        {/* Menu content */}
        <div className="relative z-50 flex items-center justify-center min-h-screen bg-black">
          <nav className="text-center">
            <ul className="space-y-8">
              <li>
                <button
                  onClick={() => handleNavigation("/")}
                  className="group text-4xl md:text-5xl font-mono text-white hover:text-white transition-colors duration-300 tracking-wide flex items-center justify-center"
                >
                  <span className="mr-4 text-white/50 group-hover:text-white transition-colors">
                    [
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      x
                    </span>
                    ]
                  </span>
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/portfolio")}
                  className="group text-4xl md:text-5xl font-mono text-white hover:text-white transition-colors duration-300 tracking-wide flex items-center justify-center"
                >
                  <span className="mr-4 text-white/50 group-hover:text-white transition-colors">
                    [
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      x
                    </span>
                    ]
                  </span>
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/#about")}
                  className="group text-4xl md:text-5xl font-mono text-white hover:text-white transition-colors duration-300 tracking-wide flex items-center justify-center"
                >
                  <span className="mr-4 text-white/50 group-hover:text-white transition-colors">
                    [
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      x
                    </span>
                    ]
                  </span>
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/media")}
                  className="group text-4xl md:text-5xl font-mono text-white hover:text-white transition-colors duration-300 tracking-wide flex items-center justify-center"
                >
                  <span className="mr-4 text-white/50 group-hover:text-white transition-colors">
                    [
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      x
                    </span>
                    ]
                  </span>
                  Media
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/prints")}
                  className="group text-4xl md:text-5xl font-mono text-white hover:text-white transition-colors duration-300 tracking-wide flex items-center justify-center"
                >
                  <span className="mr-4 text-white/50 group-hover:text-white transition-colors">
                    [
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      x
                    </span>
                    ]
                  </span>
                  Prints
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/contact")}
                  className="group text-4xl md:text-5xl font-mono text-white hover:text-white transition-colors duration-300 tracking-wide flex items-center justify-center"
                >
                  <span className="mr-4 text-white/50 group-hover:text-white transition-colors">
                    [
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      x
                    </span>
                    ]
                  </span>
                  Contact
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
