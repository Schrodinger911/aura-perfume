import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { searchProducts, type Product } from "@/lib/queries";
import { useSearchHistory } from "@/lib/wishlist-store";
import { productImage } from "@/lib/image-map";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Aeterna" },
      { name: "description", content: "Search Aeterna's fragrance archive by name, brand, or fragrance note." },
      { property: "og:title", content: "Search — Aeterna" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useSearchHistory((s) => s.history);
  const addHist = useSearchHistory((s) => s.add);
  const clearHist = useSearchHistory((s) => s.clear);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      const r = await searchProducts(q);
      setResults(r);
      setLoading(false);
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  const submitHistory = () => {
    if (q.trim()) addHist(q.trim());
  };

  return (
    <div className="px-6 lg:px-10 pt-10 pb-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-5xl md:text-6xl mb-10">Search</h1>

        <div className="flex items-center gap-3 border-b-2 border-obsidian pb-3 mb-8">
          <SearchIcon className="h-5 w-5 text-obsidian/60" />
          <input
            autoFocus
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={submitHistory}
            placeholder="Perfume name, brand, or note…"
            className="flex-1 bg-transparent text-lg font-display focus:outline-none"
            aria-label="Search"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear">
              <X className="h-4 w-4 text-obsidian/60" />
            </button>
          )}
        </div>

        {q.trim() === "" && history.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <div className="eyebrow text-obsidian/50">Recent searches</div>
              <button onClick={clearHist} className="eyebrow text-obsidian/40 hover:text-obsidian">
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((h) => (
                <button
                  key={h}
                  onClick={() => setQ(h)}
                  className="px-3 py-1.5 border border-obsidian/15 text-sm hover:border-obsidian/40"
                >
                  {h}
                </button>
              ))}
            </div>
          </section>
        )}

        {q.trim() && (
          <section>
            <div className="eyebrow text-obsidian/50 mb-6">
              {loading ? "Searching…" : `${results.length} result${results.length === 1 ? "" : "s"}`}
            </div>
            <div className="flex flex-col gap-3">
              {results.map((p) => (
                <Link
                  key={p.id}
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className="flex items-center gap-5 p-3 border border-obsidian/5 hover:border-obsidian/15 transition-colors"
                >
                  <img
                    src={productImage(p.slug)}
                    alt={p.name}
                    className="h-16 w-16 object-cover bg-bone"
                  />
                  <div className="flex-1">
                    <div className="eyebrow text-obsidian/40">{p.brand?.name}</div>
                    <div className="font-display text-lg">{p.name}</div>
                    <div className="text-xs text-obsidian/50">
                      {p.top_notes.slice(0, 3).join(", ")}
                    </div>
                  </div>
                  <div className="text-sm">{formatPrice(p.sale_price ?? p.base_price)}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
