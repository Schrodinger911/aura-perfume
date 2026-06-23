import { Link } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, cartCount } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";

const COLLECTIONS = [
  { slug: "women", label: "Women" },
  { slug: "men", label: "Men" },
  { slug: "unisex", label: "Unisex" },
  { slug: "niche", label: "Niche" },
  { slug: "arabian", label: "Arabian" },
  { slug: "gift-sets", label: "Gift Sets" },
  { slug: "seasonal", label: "Seasonal" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartItems = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const wishlistCount = useWishlist((s) => s.ids.length);
  const count = cartCount(cartItems);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-alabaster/85 backdrop-blur-xl border-b border-obsidian/5"
          : "bg-alabaster/40 backdrop-blur-md"
      }`}
    >
      <nav
        className="relative mx-auto flex h-16 items-center justify-between px-6 lg:px-10"
        aria-label="Primary"
      >
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="md:hidden -ml-2 p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div
            className="hidden md:flex items-center gap-7 eyebrow"
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              type="button"
              className="hover:text-gold transition-colors"
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
            >
              Collections
            </button>
            <Link to="/collections" className="hover:text-gold transition-colors">
              The Atelier
            </Link>
          </div>
        </div>

        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 font-display italic text-2xl tracking-tight"
        >
          AETERNA
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/search" className="eyebrow hover:text-gold transition-colors" aria-label="Search">
            <Search className="h-4 w-4 md:hidden" />
            <span className="hidden md:inline">Search</span>
          </Link>
          <Link
            to="/wishlist"
            className="eyebrow hover:text-gold transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4 md:hidden" />
            <span className="hidden md:inline">
              Wishlist ({wishlistCount})
            </span>
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="eyebrow font-semibold hover:text-gold transition-colors flex items-center gap-1.5"
            aria-label="Open bag"
          >
            <ShoppingBag className="h-4 w-4 md:hidden" />
            <span className="hidden md:inline">Bag ({count})</span>
            <span className="md:hidden text-[10px]">{count}</span>
          </button>
        </div>
      </nav>

      {/* Mega-menu */}
      {megaOpen && (
        <div
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => setMegaOpen(false)}
          className="absolute inset-x-0 top-full bg-alabaster/95 backdrop-blur-xl border-b border-obsidian/5 hidden md:block"
        >
          <div className="mx-auto max-w-6xl px-10 py-10 grid grid-cols-4 gap-10">
            <div>
              <h3 className="font-display text-2xl mb-2">The Atelier</h3>
              <p className="text-sm text-obsidian/60 max-w-xs">
                Sculpted scents, hand-poured in small batches in Grasse.
              </p>
            </div>
            {COLLECTIONS.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                to="/collections/$slug"
                params={{ slug: c.slug }}
                onClick={() => setMegaOpen(false)}
                className="block group"
              >
                <div className="eyebrow text-obsidian/40 mb-2">Collection</div>
                <div className="font-display text-xl group-hover:text-gold transition-colors">
                  {c.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-alabaster md:hidden flex flex-col">
          <div className="flex items-center justify-between h-16 px-6 border-b border-obsidian/5">
            <span className="font-display italic text-2xl">AETERNA</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 px-6 py-10 flex flex-col gap-6">
            <Link
              to="/collections"
              onClick={() => setMobileOpen(false)}
              className="font-display text-3xl"
            >
              All Collections
            </Link>
            {COLLECTIONS.map((c) => (
              <Link
                key={c.slug}
                to="/collections/$slug"
                params={{ slug: c.slug }}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl text-obsidian/80"
              >
                {c.label}
              </Link>
            ))}
            <div className="mt-auto eyebrow text-obsidian/40">© Aeterna Fragrances</div>
          </nav>
        </div>
      )}
    </header>
  );
}
