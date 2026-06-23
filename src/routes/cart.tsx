import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { productImage } from "@/lib/image-map";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Aeterna" },
      { name: "description", content: "Review your Aeterna selections before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = cartTotal(items);
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const shipping = subtotal > 0 ? (subtotal >= 250 ? 0 : 15) : 0;

  return (
    <div className="px-6 lg:px-10 pt-12 pb-24">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-5xl md:text-6xl mb-12">Your Bag</h1>

        {items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl mb-4">Your bag is empty.</p>
            <p className="text-obsidian/60 mb-8">Begin with a discovery scent.</p>
            <Link to="/collections" className="eyebrow border-b border-obsidian pb-1">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
            <ul>
              {items.map((i) => (
                <li
                  key={i.variantId}
                  className="flex gap-6 py-6 border-b border-obsidian/5"
                >
                  <img
                    src={productImage(i.slug)}
                    alt={i.name}
                    className="h-32 w-28 object-cover bg-bone"
                  />
                  <div className="flex-1">
                    <div className="eyebrow text-obsidian/40 mb-1">{i.brand}</div>
                    <h2 className="font-display text-2xl mb-1">{i.name}</h2>
                    <div className="text-xs text-obsidian/50 mb-4">{i.size_ml} ml</div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-obsidian/15">
                        <button onClick={() => setQty(i.variantId, Math.max(0, i.qty - 1))} className="p-2" aria-label="Decrease">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-10 text-center text-sm">{i.qty}</span>
                        <button onClick={() => setQty(i.variantId, i.qty + 1)} className="p-2" aria-label="Increase">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(i.variantId)}
                        className="text-obsidian/40 hover:text-obsidian flex items-center gap-1.5 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(i.price * i.qty)}</div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="lg:sticky lg:top-24 self-start bg-bone/60 p-8">
              <h2 className="font-display text-2xl mb-6">Order Summary</h2>
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? "Complimentary" : formatPrice(shipping)} />
              <Row label="Estimated Tax" value="Calculated at checkout" muted />
              <div className="border-t border-obsidian/10 my-5" />
              <Row label="Total" value={formatPrice(subtotal + shipping)} bold />

              <div className="mt-8">
                <label className="eyebrow font-semibold mb-2 block">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="CODE"
                    className="flex-1 bg-transparent border border-obsidian/15 px-3 py-2 text-sm eyebrow tracking-[0.2em] focus:outline-none focus:border-obsidian"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCouponMsg(
                        coupon === "AETERNA10"
                          ? "Code applied at checkout."
                          : "Code not recognized.",
                      )
                    }
                    className="eyebrow border border-obsidian/15 px-4 hover:bg-obsidian hover:text-alabaster transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <p className="text-xs mt-2 text-obsidian/60">{couponMsg}</p>
                )}
              </div>

              <button
                type="button"
                className="w-full mt-8 bg-obsidian text-alabaster py-4 eyebrow tracking-[0.3em] hover:bg-gold transition-colors duration-500"
              >
                Proceed to Checkout
              </button>
              <p className="text-[11px] text-obsidian/40 text-center mt-3">
                Checkout will be activated in the next release.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className={`flex justify-between text-sm py-1.5 ${bold ? "text-base font-medium" : ""}`}>
      <span className={muted ? "text-obsidian/40" : "text-obsidian/70"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
