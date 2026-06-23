import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/queries";
import { productImage } from "@/lib/image-map";
import { formatPrice } from "@/lib/format";
import { useWishlist } from "@/lib/wishlist-store";

export function ProductCard({
  product,
  index = 0,
  variant = "grid",
}: {
  product: Product;
  index?: number;
  variant?: "grid" | "list";
}) {
  const wishlisted = useWishlist((s) => s.ids.includes(product.id));
  const toggleWishlist = useWishlist((s) => s.toggle);

  if (variant === "list") {
    return (
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="group flex gap-6 border-b border-obsidian/5 py-8"
      >
        <div className="aspect-square w-40 shrink-0 overflow-hidden bg-bone">
          <img
            src={productImage(product.slug)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
        </div>
        <div className="flex-1">
          <div className="eyebrow text-obsidian/40 mb-1">{product.brand?.name}</div>
          <h3 className="font-display text-2xl mb-2">{product.name}</h3>
          <p className="text-sm text-obsidian/60 max-w-xl line-clamp-2 mb-4">
            {product.description}
          </p>
          <div className="text-sm font-medium">{formatPrice(product.base_price)}</div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: Math.min(index, 6) * 0.06, ease: [0.32, 0.72, 0, 1] }}
      className="group relative"
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-colors ${
          wishlisted
            ? "bg-obsidian text-alabaster"
            : "bg-alabaster/70 text-obsidian/60 hover:text-obsidian"
        }`}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className="h-3.5 w-3.5" fill={wishlisted ? "currentColor" : "none"} />
      </button>
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="block"
      >
        <div className="aspect-[4/5] mb-5 overflow-hidden bg-bone">
          <img
            src={productImage(product.slug)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-[900ms] ease-out"
          />
        </div>
        <div className="eyebrow text-obsidian/40 mb-1.5">{product.brand?.name}</div>
        <h3 className="text-[13px] font-semibold uppercase tracking-widest mb-1">
          {product.name}
        </h3>
        <p className="italic font-display text-sm text-obsidian/60 mb-3">
          {product.top_notes.slice(0, 3).join(", ")}
        </p>
        <div className="flex items-baseline gap-2">
          {product.sale_price ? (
            <>
              <span className="text-sm font-medium">{formatPrice(product.sale_price)}</span>
              <span className="text-xs text-obsidian/40 line-through">
                {formatPrice(product.base_price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium">{formatPrice(product.base_price)}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
