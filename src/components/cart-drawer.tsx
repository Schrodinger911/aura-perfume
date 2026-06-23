import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = cartTotal(items);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-obsidian/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[71] w-full sm:w-[440px] bg-alabaster flex flex-col"
            role="dialog"
            aria-label="Shopping bag"
          >
            <header className="flex items-center justify-between px-6 h-16 border-b border-obsidian/5">
              <h2 className="font-display text-xl">Your Bag</h2>
              <button onClick={close} aria-label="Close bag" className="p-2">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="font-display text-2xl mb-3">Your bag is empty</p>
                  <p className="text-sm text-obsidian/60 mb-8">
                    Begin with a discovery scent.
                  </p>
                  <Link
                    to="/collections"
                    onClick={close}
                    className="eyebrow border-b border-obsidian pb-1"
                  >
                    Explore Collections
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-6">
                  {items.map((i) => (
                    <li key={i.variantId} className="flex gap-4 pb-6 border-b border-obsidian/5 last:border-0">
                      <div className="flex-1">
                        <div className="eyebrow text-obsidian/40 mb-1">{i.brand}</div>
                        <div className="font-display text-lg leading-tight mb-1">{i.name}</div>
                        <div className="text-xs text-obsidian/50 mb-3">{i.size_ml} ml</div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-obsidian/15">
                            <button
                              type="button"
                              onClick={() => setQty(i.variantId, Math.max(0, i.qty - 1))}
                              className="p-2 hover:bg-bone"
                              aria-label="Decrease"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{i.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(i.variantId, i.qty + 1)}
                              className="p-2 hover:bg-bone"
                              aria-label="Increase"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(i.variantId)}
                            className="text-obsidian/40 hover:text-obsidian"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{formatPrice(i.price * i.qty)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-obsidian/5 px-6 py-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-obsidian/60">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-obsidian/40 mb-5">
                  Taxes and shipping calculated at checkout.
                </p>
                <Link
                  to="/cart"
                  onClick={close}
                  className="w-full block text-center bg-obsidian text-alabaster py-4 eyebrow tracking-[0.3em] hover:bg-gold transition-colors duration-500"
                >
                  View Bag & Checkout
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
