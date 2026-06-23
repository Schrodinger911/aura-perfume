import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchProductsByIds, type Product } from "@/lib/queries";
import { useWishlist } from "@/lib/wishlist-store";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Aeterna" },
      { name: "description", content: "Your curated Aeterna wishlist." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProductsByIds(ids).then((p) => {
      if (mounted) {
        setItems(p);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [ids]);

  return (
    <div className="px-6 lg:px-10 pt-12 pb-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-5xl md:text-6xl mb-3">Wishlist</h1>
        <p className="text-obsidian/60 mb-12">A private library of scents to revisit.</p>

        {loading ? (
          <div className="py-24 text-center eyebrow text-obsidian/40">Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-2xl mb-4">Your wishlist is empty.</p>
            <Link to="/collections" className="eyebrow border-b border-obsidian pb-1">
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
