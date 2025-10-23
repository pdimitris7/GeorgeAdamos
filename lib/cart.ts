// lib/cart.ts
export const CART_KEY = "prints-cart-v1";

export type CartItem = {
  id: string;
  printId: string;
  title: string;
  slug: string;
  size: string;
  price: number;
  qty: number;
  imageUrl: string;
};

const isBrowser = typeof window !== "undefined";

export function readCart(): CartItem[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cart:updated"));
  } catch {}
}

export function addOrMerge(item: CartItem) {
  const cart = readCart();
  const found = cart.find((x) => x.id === item.id);
  if (found) found.qty += item.qty;
  else cart.push(item);
  writeCart(cart);
}

export function updateQty(id: string, qty: number) {
  const cart = readCart();
  const i = cart.findIndex((x) => x.id === id);
  if (i === -1) return;
  if (qty <= 0) cart.splice(i, 1);
  else cart[i].qty = qty;
  writeCart(cart);
}

export function removeItem(id: string) {
  updateQty(id, 0);
}

export function clearCart() {
  writeCart([]);
}

export function getSubtotal(items?: CartItem[]) {
  const arr = items ?? readCart();
  return arr.reduce((s, x) => s + x.qty * x.price, 0);
}

export function getCount(items?: CartItem[]) {
  const arr = items ?? readCart();
  return arr.reduce((s, x) => s + x.qty, 0);
}

/* ---------- Events ---------- */

/** Άνοιγμα συρταριού. stage: "checkout" | "cart" (default "cart") */
export function openCart(stage: "checkout" | "cart" = "cart") {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent("cart:open", { detail: { stage } }));
}
export function closeCart() {
  if (!isBrowser) return;
  window.dispatchEvent(new Event("cart:close"));
}

/** Subscribe σε ενημερώσεις καλαθιού (qty, add/remove/clear) */
export function onCartUpdated(cb: () => void) {
  if (!isBrowser) return () => {};
  const fn = () => cb();
  window.addEventListener("cart:updated", fn);
  window.addEventListener("storage", fn); // sync μεταξύ tabs
  return () => {
    window.removeEventListener("cart:updated", fn);
    window.removeEventListener("storage", fn);
  };
}

/** Subscribe όταν ζητηθεί άνοιγμα */
export function onCartOpen(cb: (stage: "checkout" | "cart") => void) {
  if (!isBrowser) return () => {};
  const fn = (e: any) =>
    cb(e?.detail?.stage === "checkout" ? "checkout" : "cart");
  // @ts-ignore - custom event
  window.addEventListener("cart:open", fn as EventListener);
  return () => {
    // @ts-ignore
    window.removeEventListener("cart:open", fn as EventListener);
  };
}

/** Subscribe όταν ζητηθεί κλείσιμο */
export function onCartClose(cb: () => void) {
  if (!isBrowser) return () => {};
  const fn = () => cb();
  window.addEventListener("cart:close", fn);
  return () => window.removeEventListener("cart:close", fn);
}
