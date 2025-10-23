// components/prints-cart-button.tsx
"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { getCount, onCartUpdated, openCart } from "@/lib/cart";

export default function PrintsCartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCount());
    const off = onCartUpdated(() => setCount(getCount()));
    return off;
  }, []);

  return (
    <button
      onClick={() => openCart()}
      className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-gray-200 transition-colors"
      aria-label="Open cart"
    >
      <ShoppingCart size={18} />
      <span className="font-mono text-sm">Cart</span>
      {count > 0 && (
        <span className="ml-1 px-2 py-0.5 rounded bg-black text-white text-xs font-mono">
          {count}
        </span>
      )}
    </button>
  );
}
