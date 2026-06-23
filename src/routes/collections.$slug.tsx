import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { fetchCollectionPage, type Product, type Brand } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/collections/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${cap(params.slug)} — Aeterna Collection` },
      {
        name: "description",
        content: `Shop the Aeterna ${cap(params.slug)} collection — luxury fragrances hand-poured in Grasse.`,
      },
      { property: "og:title", content: `${cap(params.slug)} — Aeterna` },
      { property: "og:description", content: `Aeterna ${cap(params.slug)} collection.` },
    ],
  }),
  loader: async ({ params }) => {
    const data = await fetchCollectionPage(params.slug);
    if (!data.collection) throw notFound();
    return data;
  },
  notFoundComponent: () => (
    <div className="px-6 py-32 text-center">
      <h1 className="font-display text-4xl">Collection not found</h1>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-6 py-32 text-center text-sm text-obsidian/60">
      Unable to load this collection. {error.message}
    </div>
  ),
  component: CollectionPage,
});

function cap(s: string) {
  return s
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

type SortKey = "popular" | "newest" | "price_asc" | "price_desc" | "rating";

function CollectionPage() {
  const { collection, products, brands } = Route.useLoaderData();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortKey>("popular");
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [familyFilter, setFamilyFilter] = useState<string[]>([]);
  const [concFilter, setConcFilter] = useState<string[]>([]);
  const [onlyBest, setOnlyBest] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);

  const families = useMemo(
    () => Array.from(new Set((products as Product[]).map((p) => p.fragrance_family).filter(Boolean))) as string[],
    [products],
  );
  const concs = useMemo(
    () => Array.from(new Set((products as Product[]).map((p) => p.concentration).filter(Boolean))) as string[],
    [products],
  );

  const filtered = useMemo(() => {
    const filteredList = (products as Product[]).filter((p: Product) => {
      if (brandFilter.length && !brandFilter.includes(p.brand_id)) return false;
      if (familyFilter.length && (!p.fragrance_family || !familyFilter.includes(p.fragrance_family))) return false;
      if (concFilter.length && (!p.concentration || !concFilter.includes(p.concentration))) return false;
      if (onlyBest && !p.is_best_seller) return false;
      if (onlyNew && !p.is_new_arrival) return false;
      if ((p.sale_price ?? p.base_price) > maxPrice) return false;
      return true;
    });

    const sorted = [...filteredList];
    switch (sort) {
      case "price_asc":
        sorted.sort((a: Product, b: Product) => (a.sale_price ?? a.base_price) - (b.sale_price ?? b.base_price));
        break;
      case "price_desc":
        sorted.sort((a: Product, b: Product) => (b.sale_price ?? b.base_price) - (a.sale_price ?? a.base_price));
        break;
      case "newest":
        sorted.sort((a: Product, b: Product) => Number(b.is_new_arrival) - Number(a.is_new_arrival));
        break;
      case "rating":
        sorted.sort((a: Product, b: Product) => b.rating_avg - a.rating_avg);
        break;
      default:
        sorted.sort((a: Product, b: Product) => Number(b.is_best_seller) - Number(a.is_best_seller));
    }
    return sorted;
  }, [products, brandFilter, familyFilter, concFilter, onlyBest, onlyNew, maxPrice, sort]);

  const toggle = (
    val: string,
    list: string[],
    setter: (v: string[]) => void,
  ) => setter(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  return (
    <div className="px-6 lg:px-10 pt-12 pb-24">
      <div className="mx-auto max-w-7xl">
        <header className="text-center mb-14">
          <div className="eyebrow text-obsidian/40 mb-4">Collection</div>
          <h1 className="font-display text-5xl md:text-7xl">{collection!.name}</h1>
          {collection!.description && (
            <p className="mt-5 text-obsidian/60 max-w-xl mx-auto">{collection!.description}</p>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
          {/* Filters */}
          <aside className="space-y-8 lg:sticky lg:top-24 self-start">
            <Filter title="Brand">
              {(brands as Brand[]).map((b: Brand) => (
                <Check
                  key={b.id}
                  checked={brandFilter.includes(b.id)}
                  onChange={() => toggle(b.id, brandFilter, setBrandFilter)}
                  label={b.name}
                />
              ))}
            </Filter>

            {families.length > 0 && (
              <Filter title="Fragrance Family">
                {families.map((f) => (
                  <Check
                    key={f}
                    checked={familyFilter.includes(f)}
                    onChange={() => toggle(f, familyFilter, setFamilyFilter)}
                    label={f}
                  />
                ))}
              </Filter>
            )}

            {concs.length > 0 && (
              <Filter title="Concentration">
                {concs.map((c) => (
                  <Check
                    key={c}
                    checked={concFilter.includes(c)}
                    onChange={() => toggle(c, concFilter, setConcFilter)}
                    label={c.replace(/_/g, " ")}
                  />
                ))}
              </Filter>
            )}

            <Filter title="Price">
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-obsidian"
              />
              <div className="text-xs text-obsidian/60 mt-2">Up to ${maxPrice}</div>
            </Filter>

            <Filter title="Highlights">
              <Check checked={onlyBest} onChange={() => setOnlyBest(!onlyBest)} label="Best Sellers" />
              <Check checked={onlyNew} onChange={() => setOnlyNew(!onlyNew)} label="New Arrivals" />
            </Filter>
          </aside>

          {/* Results */}
          <div>
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-obsidian/5">
              <div className="eyebrow text-obsidian/50">{filtered.length} fragrances</div>
              <div className="flex items-center gap-5">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="eyebrow bg-transparent focus:outline-none border-b border-obsidian/20 pb-1"
                >
                  <option value="popular">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <div className="hidden sm:flex gap-1">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`p-1.5 ${view === "grid" ? "text-obsidian" : "text-obsidian/30"}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`p-1.5 ${view === "list" ? "text-obsidian" : "text-obsidian/30"}`}
                  >
                    <ListIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="py-32 text-center text-obsidian/60">
                <p className="font-display text-2xl mb-2">Nothing matches those filters.</p>
                <p className="text-sm">Try widening your selection.</p>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div>
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} variant="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Filter({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow font-semibold mb-4 pb-2 border-b border-obsidian/10">{title}</div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer text-sm text-obsidian/70 hover:text-obsidian capitalize">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-obsidian w-3.5 h-3.5"
      />
      {label}
    </label>
  );
}
