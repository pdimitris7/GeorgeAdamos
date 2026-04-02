"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Small timeout ensures this fires after Next.js scroll restoration
    const id = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 0);
    return () => clearTimeout(id);
  }, [pathname]);

  return null;
}
