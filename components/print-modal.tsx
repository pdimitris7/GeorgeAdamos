// components/print-modal.tsx
"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import Image from "next/image";
import { X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { urlForImage, type Print } from "@/lib/sanity-public";
import { addOrMerge, openCart, type CartItem } from "@/lib/cart";

function imgUrl(raw: any, w?: number, h?: number) {
  if (!raw) return undefined as string | undefined;
  const anyVal = urlForImage(raw) as any;
  if (anyVal && typeof anyVal.width === "function") {
    let c = anyVal;
    if (typeof w === "number") c = c.width(w);
    if (typeof h === "number") c = c.height(h);
    if (typeof c.fit === "function") c = c.fit("max");
    if (typeof c.url === "function") return c.url();
  }
  if (typeof anyVal === "string") return anyVal;
  if (anyVal && typeof anyVal.url === "function") return anyVal.url();
  return undefined;
}

type Props = { print: Print | null; onClose?: () => void };

export default function PrintModal({ print, onClose }: Props) {
  const router = useRouter();
  const close = useCallback(() => {
    if (onClose) onClose();
    else router.back();
  }, [onClose, router]);

  // Lock scroll + ESC
  useEffect(() => {
    if (!print) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [print, close]);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [stage, setStage] = useState<"select" | "added">("select");

  useEffect(() => {
    if (print?.availableSizes?.length)
      setSelectedSize(print.availableSizes[0].size);
    else setSelectedSize("");
    setQty(1);
    setStage("select");
  }, [print]);

  const heroUrl = useMemo(
    () => imgUrl(print?.image, 1200, 1500) || "/placeholder.svg",
    [print]
  );

  if (!print) return null;

  const selectedPrice =
    print.availableSizes?.find((s) => s.size === selectedSize)?.price ?? 0;

  function addToCart() {
    if (!selectedSize || !selectedPrice) return;

    const id = `${print._id}@${selectedSize}`;
    const imageUrl =
      imgUrl(print.image, 400, 500) || "/placeholder.svg?height=500&width=400";

    const newItem: CartItem = {
      id,
      printId: print._id,
      title: print.title,
      slug: print.slug?.current || "",
      size: selectedSize,
      price: selectedPrice,
      qty,
      imageUrl,
    };
    addOrMerge(newItem);
    setStage("added");
  }

  function goCheckout() {
    // Θα ανοίξει το drawer στο route /prints (παραμένεις στο ίδιο route)
    openCart();
    // option: άφησε το modal ανοιχτό ή κλείστο
    // close();
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/95 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <button
        onClick={close}
        className="fixed top-6 right-6 text-white hover:text-gray-300 transition-colors z-[60]"
        aria-label="Close"
      >
        <X size={32} strokeWidth={1.5} />
      </button>
      ;
      <div
        className="fixed inset-0 flex items-start sm:items-center justify-center overflow-y-auto overscroll-contain"
        onClick={close}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-6xl mt-8 sm:mt-4 md:mt-8 mb-0 sm:mb-4 md:mb-8 bg-black border-0 sm:border border-white/10 shadow-2xl min-h-[calc(100vh-2rem)] sm:min-h-0 sm:max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex flex-col md:flex-row-reverse min-h-screen sm:min-h-0 sm:max-h-[90vh]">
            <div className="relative w-full md:w-1/2 h-[50vh] sm:h-[60vh] md:h-auto md:min-h-[90vh] overflow-hidden border-b md:border-b-0 md:border-l border-white/10 flex-shrink-0 pt-4 sm:pt-0">
              <Image
                src={heroUrl || "/placeholder.svg"}
                alt={print.title}
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-contain bg-black"
                priority
              />
            </div>

            <div className="w-full md:w-1/2 px-4 pt-8 pb-6 sm:px-6 sm:pt-8 sm:pb-8 md:px-8 md:pt-10 md:pb-10 lg:px-12 lg:pt-12 lg:pb-12 space-y-6 md:space-y-8 overflow-y-auto flex-1">
              <div className="space-y-2 md:space-y-3 border-b border-white/5 pb-4 md:pb-6">
                <h2 className="font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] md:tracking-[0.2em] text-white leading-tight">
                  {print.title.toUpperCase()}
                </h2>
                <p className="text-white/50 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed md:leading-loose tracking-wide max-w-3xl">
                  {print.category}
                </p>
              </div>

              {print.description && (
                <p className="text-white/70 font-mono text-xs sm:text-sm md:text-base leading-relaxed md:leading-loose tracking-wide max-w-3xl">
                  {print.description}
                </p>
              )}

              {stage === "select" && (
                <>
                  {!!print.availableSizes?.length && (
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.25em] md:tracking-[0.3em] text-white/70 uppercase">
                        Select Size
                      </h3>
                      <div className="grid gap-2 md:gap-3">
                        {print.availableSizes.map((opt) => (
                          <label
                            key={opt.size}
                            className={`
                              flex items-center justify-between p-3 sm:p-4 md:p-5 cursor-pointer 
                              border transition-all duration-300 group
                              ${
                                selectedSize === opt.size
                                  ? "border-white bg-white/5"
                                  : "border-white/20 hover:border-white/40 hover:bg-white/[0.02]"
                              }
                            `}
                          >
                            <div className="flex items-center gap-3 md:gap-4">
                              <div
                                className={`
                                w-4 h-4 md:w-5 md:h-5 border-2 rounded-full flex items-center justify-center transition-all
                                ${
                                  selectedSize === opt.size
                                    ? "border-white"
                                    : "border-white/30 group-hover:border-white/50"
                                }
                              `}
                              >
                                {selectedSize === opt.size && (
                                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full" />
                                )}
                              </div>
                              <span className="font-mono text-sm sm:text-base md:text-lg tracking-wider text-white">
                                {opt.size}"
                              </span>
                            </div>
                            <span className="font-mono text-sm sm:text-base md:text-lg tracking-wider text-white">
                              €{opt.price}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] md:tracking-[0.3em] text-white/70 uppercase whitespace-nowrap">
                        Quantity
                      </span>
                      <div className="flex items-center border border-white/30">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 font-mono hover:bg-white/10 transition-colors text-sm sm:text-base"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="px-4 sm:px-5 py-2 sm:py-2.5 font-mono border-x border-white/30 min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty((q) => q + 1)}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 font-mono hover:bg-white/10 transition-colors text-sm sm:text-base"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={addToCart}
                      disabled={!selectedSize || !selectedPrice}
                      className="
                        w-full px-6 sm:px-8 py-3 sm:py-3.5 font-mono text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase
                        border-2 border-white text-white
                        hover:bg-white hover:text-black
                        transition-all duration-300
                        disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white
                      "
                    >
                      Add to Cart
                    </button>
                  </div>
                </>
              )}

              {stage === "added" && (
                <div className="border border-white/20 p-4 sm:p-6 md:p-8 bg-white/[0.02] space-y-4 md:space-y-6">
                  <div className="flex items-center gap-2 md:gap-3 text-white">
                    <span className="inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 border border-white/20">
                      <Check
                        size={16}
                        className="md:w-[18px] md:h-[18px]"
                        strokeWidth={2}
                      />
                    </span>
                    <span className="font-mono tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm uppercase">
                      Added to Cart
                    </span>
                  </div>

                  <div className="font-mono text-xs sm:text-sm text-white/60 space-y-1 md:space-y-1.5 tracking-wide">
                    <div>Item: {print.title.toUpperCase()}</div>
                    <div>Size: {selectedSize}"</div>
                    <div>
                      Quantity: {qty} × €{selectedPrice}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:gap-3 pt-3 md:pt-4 border-t border-white/10">
                    <button
                      onClick={goCheckout}
                      className="
                        w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black font-mono text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase
                        hover:bg-white/90 transition-colors
                      "
                    >
                      Go to Checkout
                    </button>
                    <button
                      onClick={close}
                      className="
                        w-full px-4 sm:px-6 py-2.5 sm:py-3 border border-white text-white font-mono text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase
                        hover:bg-white/5 transition-colors
                      "
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
