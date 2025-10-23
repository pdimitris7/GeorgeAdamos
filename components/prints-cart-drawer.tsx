// components/prints-cart-drawer.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  readCart,
  updateQty,
  removeItem,
  clearCart,
  getSubtotal,
  onCartUpdated,
  onCartOpen,
  onCartClose,
} from "@/lib/cart";

type CartItem = ReturnType<typeof readCart>[number];

type Customer = {
  fullName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
};

export default function PrintsCartDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<"cart" | "checkout">("cart");
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingZone, setShippingZone] = useState<"gr" | "eu" | "world">("gr");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(
    null
  );

  const formRef = useRef<HTMLFormElement>(null);

  // 1) basic hydrate + listeners
  useEffect(() => {
    setItems(readCart());
    const offUpd = onCartUpdated(() => setItems(readCart()));
    const offOpen = onCartOpen((st) => {
      setStage(st);
      setOpen(true);
      if (st === "checkout") {
        setTimeout(() => {
          formRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          (
            formRef.current?.querySelector(
              'input[name="fullName"]'
            ) as HTMLInputElement | null
          )?.focus();
        }, 50);
      }
    });
    const offClose = onCartClose(() => setOpen(false));
    return () => {
      offUpd?.();
      offOpen?.();
      offClose?.();
    };
  }, []);

  // 2) open via query params (?cart=open&stage=checkout)
  useEffect(() => {
    const wantOpen = params.get("cart") === "open";
    if (!wantOpen) return;
    const st = (params.get("stage") as "checkout" | "cart") || "cart";
    setStage(st);
    setOpen(true);
    if (st === "checkout") {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        (
          formRef.current?.querySelector(
            'input[name="fullName"]'
          ) as HTMLInputElement | null
        )?.focus();
      }, 50);
    }
    // δεν κλείνουμε το param εδώ — θα καθαριστεί όταν ο χρήστης κλείσει το drawer
  }, [params]);

  // 3) ESC για κλείσιμο
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function handleClose() {
    setOpen(false);
    // καθάρισε τα query params ?cart= / ?stage=
    const next = new URLSearchParams(params.toString());
    next.delete("cart");
    next.delete("stage");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const shipping = useMemo(
    () => (shippingZone === "gr" ? 5 : shippingZone === "eu" ? 15 : 25),
    [shippingZone]
  );
  const subtotal = useMemo(() => getSubtotal(items), [items]);
  const total = subtotal + shipping;

  function handleQty(id: string, next: number) {
    updateQty(id, next);
    setItems(readCart());
  }
  function handleRemove(id: string) {
    removeItem(id);
    setItems(readCart());
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const fd = new FormData(e.currentTarget);
    const customer = {
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      address1: String(fd.get("address1") || ""),
      address2: String(fd.get("address2") || ""),
      city: String(fd.get("city") || ""),
      postalCode: String(fd.get("postalCode") || ""),
      country: String(fd.get("country") || ""),
      notes: String(fd.get("notes") || ""),
    } as Customer;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items,
          totals: { subtotal, shipping, total },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Checkout failed");

      setResult({
        ok: true,
        msg: "Order placed successfully. Check your email.",
      });
      clearCart();
      setItems([]);
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      setResult({ ok: false, msg: err?.message || "Error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* overlay (πάνω απ’ όλα) */}
      <div
        className={`fixed inset-0 z-[70] bg-black/60 transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* drawer */}
      <aside
        className={`fixed right-0 top-0 z-[71] h-full w-full sm:w-[480px] lg:w-[520px] bg-white text-gray-900 shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full flex flex-col">
          {/* header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h3 className="font-mono tracking-widest">
              {stage === "checkout" ? "Checkout" : "Your Cart"}
            </h3>
            <button
              onClick={handleClose}
              className="font-mono text-sm underline hover:no-underline"
            >
              Close
            </button>
          </div>

          {/* content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            {!items.length ? (
              <p className="font-mono text-sm text-gray-500">
                Your cart is empty.
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center gap-3 border-b pb-3"
                  >
                    <img
                      src={it.imageUrl}
                      alt={it.title}
                      className="w-16 h-20 object-cover bg-gray-100"
                    />
                    <div className="flex-1">
                      <div className="font-mono text-sm">
                        {it.title.toUpperCase()}
                      </div>
                      <div className="font-mono text-xs text-gray-600">
                        {it.size}" • €{it.price.toFixed(2)}
                      </div>
                      <div className="mt-2 inline-flex items-center border">
                        <button
                          onClick={() =>
                            handleQty(it.id, Math.max(1, it.qty - 1))
                          }
                          className="px-2 py-1"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 font-mono">{it.qty}</span>
                        <button
                          onClick={() => handleQty(it.id, it.qty + 1)}
                          className="px-2 py-1"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">
                        €{(it.qty * it.price).toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleRemove(it.id)}
                        className="mt-2 font-mono text-xs text-red-600 underline"
                      >
                        remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between text-sm font-mono pt-2">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-mono">
                  <label className="flex items-center gap-2">
                    Shipping
                    <select
                      value={shippingZone}
                      onChange={(e) =>
                        setShippingZone(e.target.value as "gr" | "eu" | "world")
                      }
                      className="border px-2 py-1 text-sm"
                    >
                      <option value="gr">Greece (€5)</option>
                      <option value="eu">EU (€15)</option>
                      <option value="world">Rest of World (€25)</option>
                    </select>
                  </label>
                  <span>€{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-mono border-t pt-2">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <button
                  className="mt-2 font-mono text-xs text-gray-600 underline"
                  onClick={() => {
                    clearCart();
                    setItems([]);
                  }}
                >
                  clear cart
                </button>
              </div>
            )}

            {!!items.length && (
              <form
                ref={formRef}
                onSubmit={submit}
                className="space-y-3 border-t pt-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="fullName"
                    required
                    placeholder="Full name"
                    className="border px-3 py-2 text-sm"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    className="border px-3 py-2 text-sm"
                  />
                  <input
                    name="phone"
                    placeholder="Phone"
                    className="border px-3 py-2 text-sm col-span-2"
                  />
                  <input
                    name="address1"
                    required
                    placeholder="Address line 1"
                    className="border px-3 py-2 text-sm col-span-2"
                  />
                  <input
                    name="address2"
                    placeholder="Address line 2"
                    className="border px-3 py-2 text-sm col-span-2"
                  />
                  <input
                    name="city"
                    required
                    placeholder="City"
                    className="border px-3 py-2 text-sm"
                  />
                  <input
                    name="postalCode"
                    required
                    placeholder="Postal code"
                    className="border px-3 py-2 text-sm"
                  />
                  <input
                    name="country"
                    required
                    placeholder="Country"
                    className="border px-3 py-2 text-sm col-span-2"
                  />
                </div>
                <textarea
                  name="notes"
                  placeholder="Notes (optional)"
                  rows={3}
                  className="border w-full px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white py-2 font-mono tracking-widest hover:bg-gray-900 disabled:opacity-60"
                >
                  {submitting ? "SENDING..." : "PLACE ORDER"}
                </button>
                {result && (
                  <p
                    className={`text-sm font-mono mt-1 ${
                      result.ok ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.msg}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
