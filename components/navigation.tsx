"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const CART_KEY = "prints-cart-v1";

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  // header hide/show on scroll
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

  // mobile menu toggle
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  // nav push helper
  const handleNavigation = (href: string) => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(href);
  };

  // cart count
  function refreshCartCount() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const items = raw ? JSON.parse(raw) : [];
      const count = items.reduce((s: number, it: any) => s + (it.qty || 0), 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }
  useEffect(() => {
    refreshCartCount();
    const onStorage = () => refreshCartCount();
    const onUpdated = () => refreshCartCount();
    window.addEventListener("storage", onStorage);
    window.addEventListener("cart:updated", onUpdated as any);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart:updated", onUpdated as any);
    };
  }, []);

  // open checkout
  function openCheckout() {
    if (pathname !== "/prints") {
      router.push("/prints");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("cart:open"));
      }, 50);
    } else {
      window.dispatchEvent(new CustomEvent("cart:open"));
    }
  }

  const showCartButton = pathname === "/prints";

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

          <div className="flex items-center gap-2">
            {/* Cart μόνο στη σελίδα /prints */}
            {showCartButton && (
              <button
                onClick={openCheckout}
                className="relative z-50 p-2 text-beige-light hover:text-brown-light transition-colors flex items-center justify-center"
                aria-label="Open cart"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] leading-none bg-brown text-white rounded-full px-1.5 py-0.5">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Menu */}
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

      {/* Fullscreen menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="absolute inset-0 bg-black" onClick={toggleMenu} />
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
            </ul>

            <div className="mt-12 flex justify-center space-x-8">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors text-sm tracking-widest font-mono"
              >
                INSTAGRAM
              </a>
              <a
                href="mailto:hello@georgeadamos.com"
                className="text-white/70 hover:text-white transition-colors text-sm tracking-widest font-mono"
              >
                EMAIL
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
