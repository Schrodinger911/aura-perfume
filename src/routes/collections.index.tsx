import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { fetchCollections, type Collection } from "@/lib/queries";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "All Collections — Aeterna" },
      {
        name: "description",
        content: "Browse Aeterna's curated fragrance collections — Women, Men, Unisex, Niche, Arabian, Gift Sets, and Seasonal.",
      },
      { property: "og:title", content: "All Collections — Aeterna" },
      { property: "og:description", content: "Curated fragrance collections by Aeterna." },
    ],
  }),
  loader: () => fetchCollections(),
  component: CollectionsIndex,
});

function CollectionsIndex() {
  const collections = Route.useLoaderData() as Collection[];

  return (
    <div className="px-6 lg:px-10 pt-16 pb-24">
      <div className="mx-auto max-w-7xl">
        <header className="text-center mb-20">
          <div className="eyebrow text-obsidian/40 mb-4">The Library</div>
          <h1 className="font-display text-5xl md:text-7xl">All Collections</h1>
          <p className="mt-6 text-obsidian/60 max-w-xl mx-auto">
            Seven worlds, composed in small batches.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.06 }}
            >
              <Link
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="group block"
              >
                <div className="aspect-[4/5] bg-obsidian text-alabaster mb-5 overflow-hidden relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <div className="eyebrow text-alabaster/40 mb-3">Collection</div>
                    <span className="font-display italic text-4xl md:text-5xl text-center group-hover:text-gold transition-colors duration-500">
                      {c.name}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-obsidian/60">{c.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
