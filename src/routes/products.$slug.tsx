import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Check } from "lucide-react";
import { fetchProduct, type ProductPageData, type Variant } from "@/lib/queries";
import { productImage } from "@/lib/image-map";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/lib/cart-store";
import { useWishlist, useRecent } from "@/lib/wishlist-store";

export const Route = createFileRoute("/products/$slug")({
  head: ({ loaderData, params }) => {
    const p = (loaderData as ProductPageData | undefined)?.product;
    const title = p ? `${p.name} — ${p.brand?.name ?? "Aeterna"}` : "Fragrance — Aeterna";
    const description = p?.description ?? `Shop ${params.slug} at Aeterna.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
      ],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p.name,
                brand: { "@type": "Brand", name: p.brand?.name },
                description: p.description,
                offers: {
                  "@type": "Offer",
                  priceCurrency: "USD",
                  price: p.sale_price ?? p.base_price,
                  availability: "https://schema.org/InStock",
                },
                aggregateRating: p.rating_count
                  ? {
                      "@type": "AggregateRating",
                      ratingValue: p.rating_avg,
                      reviewCount: p.rating_count,
                    }
                  : undefined,
              }),
            },
          ]
        : undefined,
    };
  },
  loader: async ({ params }) => {
    const data = await fetchProduct(params.slug);
    if (!data) throw notFound();
    return data;
  },
  notFoundComponent: () => (
    <div className="px-6 py-32 text-center">
      <h1 className="font-display text-4xl mb-3">Product not found</h1>
      <Link to="/collections" className="eyebrow border-b border-obsidian pb-1">
        Back to Collections
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-6 py-32 text-center text-sm text-obsidian/60">
      Unable to load this product. {error.message}
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product, variants, related } = Route.useLoaderData() as ProductPageData;
  const [variantId, setVariantId] = useState(variants[1]?.id ?? variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const isWishlisted = useWishlist((s) => s.ids.includes(product.id));
  const visitRecent = useRecent((s) => s.visit);

  useEffect(() => {
    visitRecent(product.id);
  }, [product.id, visitRecent]);

  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const price = variant?.sale_price ?? variant?.price ?? product.base_price;
  const img = productImage(product.slug);

  const handleAdd = (buyNow = false) => {
    if (!variant) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand?.name ?? "",
      size_ml: variant.size_ml,
      price,
      qty,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
    if (buyNow) openCart();
  };

  return (
    <div className="px-6 lg:px-10 pt-10 pb-24">
      <div className="mx-auto max-w-7xl">
        <nav className="eyebrow text-obsidian/40 mb-10 flex gap-2 items-center">
          <Link to="/" className="hover:text-obsidian">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-obsidian">Collections</Link>
          <span>/</span>
          <span className="text-obsidian/60">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="space-y-4">
            <div
              className="relative aspect-[4/5] bg-bone overflow-hidden cursor-zoom-in"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setZoomPos({
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100,
                });
              }}
            >
              <img
                src={img}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500"
                style={
                  zoom
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transform: "scale(2.1)",
                      }
                    : undefined
                }
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[img, img, img, img].map((src, i) => (
                <div key={i} className="aspect-square bg-bone overflow-hidden">
                  <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:pt-6">
            <div className="eyebrow text-obsidian/40 mb-3">{product.brand?.name}</div>
            <h1 className="font-display text-4xl md:text-6xl mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="italic font-display text-obsidian/60 mb-6">
              {product.fragrance_family}
              {product.concentration && ` · ${product.concentration.replace(/_/g, " ")}`}
            </p>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-3xl">{formatPrice(price)}</span>
              {product.sale_price && (
                <span className="text-obsidian/40 line-through">
                  {formatPrice(product.base_price)}
                </span>
              )}
              {product.rating_count > 0 && (
                <span className="eyebrow text-obsidian/50 ml-auto">
                  ★ {product.rating_avg.toFixed(1)} ({product.rating_count})
                </span>
              )}
            </div>

            <p className="text-obsidian/70 leading-relaxed mb-10">{product.description}</p>

            {/* Sizes */}
            <div className="mb-8">
              <div className="eyebrow font-semibold mb-3">Size</div>
              <div className="flex gap-3">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    className={`px-5 py-3 border text-sm transition-colors ${
                      variantId === v.id
                        ? "border-obsidian bg-obsidian text-alabaster"
                        : "border-obsidian/15 hover:border-obsidian/40"
                    }`}
                  >
                    {v.size_ml} ml
                    <span className="block text-[10px] mt-0.5 opacity-70">
                      {formatPrice(v.sale_price ?? v.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + actions */}
            <div className="flex gap-3 mb-10">
              <div className="flex items-center border border-obsidian/15">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3" aria-label="Decrease">−</button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-3" aria-label="Increase">+</button>
              </div>
              <button
                type="button"
                onClick={() => handleAdd(false)}
                className="flex-1 bg-obsidian text-alabaster eyebrow tracking-[0.3em] hover:bg-gold transition-colors duration-500 flex items-center justify-center gap-2"
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4" /> Added
                  </>
                ) : (
                  "Add to Bag"
                )}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Wishlist"
                className={`px-4 border ${
                  isWishlisted
                    ? "border-obsidian bg-obsidian text-alabaster"
                    : "border-obsidian/15 hover:border-obsidian/40"
                }`}
              >
                <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleAdd(true)}
              className="w-full border border-obsidian py-4 eyebrow tracking-[0.3em] hover:bg-obsidian hover:text-alabaster transition-colors mb-12"
            >
              Buy Now
            </button>

            {/* Fragrance pyramid */}
            <section className="border-t border-obsidian/10 pt-8">
              <h2 className="eyebrow font-semibold mb-6">Fragrance Pyramid</h2>
              <NoteRow label="Top" notes={product.top_notes} />
              <NoteRow label="Heart" notes={product.middle_notes} />
              <NoteRow label="Base" notes={product.base_notes} />
            </section>

            {/* Performance */}
            <section className="border-t border-obsidian/10 pt-8 mt-8 grid grid-cols-2 gap-6">
              <Stat label="Longevity" value={product.longevity ?? "—"} />
              <Stat label="Projection" value={product.projection ?? "—"} />
            </section>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-32">
            <div className="flex justify-between items-end mb-10">
              <div>
                <div className="eyebrow text-obsidian/40 mb-2">From the same house</div>
                <h2 className="font-display text-3xl">You may also like</h2>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12"
            >
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}

function NoteRow({ label, notes }: { label: string; notes: string[] }) {
  if (!notes.length) return null;
  return (
    <div className="flex gap-5 py-3 border-b border-obsidian/5 last:border-0">
      <div className="eyebrow text-obsidian/50 w-16 shrink-0">{label}</div>
      <div className="text-sm">{notes.join(" · ")}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow text-obsidian/50 mb-1">{label}</div>
      <div className="font-display text-xl">{value}</div>
    </div>
  );
}
