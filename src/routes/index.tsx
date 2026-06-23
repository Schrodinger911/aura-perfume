import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { fetchHomepage, type HomepageData } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";
import heroImg from "@/assets/hero.jpg";
import atelierImg from "@/assets/atelier.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aeterna — Sculptural Luxury Perfumes" },
      {
        name: "description",
        content:
          "Hand-poured fragrances from a Grasse atelier. Shop signature scents, niche compositions, and discovery sets.",
      },
      { property: "og:title", content: "Aeterna — Sculptural Luxury Perfumes" },
      {
        property: "og:description",
        content: "Hand-poured fragrances from a Grasse atelier.",
      },
    ],
  }),
  loader: () => fetchHomepage(),
  component: Index,
});

function Index() {
  const { banner, bestsellers, newArrivals, brands, testimonials, collections } =
    Route.useLoaderData() as HomepageData;

  return (
    <>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[640px] flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Aeterna signature perfume bottle on a limestone plinth"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-alabaster/40 via-alabaster/10 to-alabaster/60" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
          className="relative z-10 text-center px-6"
        >
          <div className="eyebrow mb-5 text-obsidian/80">
            {banner?.eyebrow ?? "The Signature Collection"}
          </div>
          <h1 className="font-display text-6xl sm:text-7xl md:text-9xl leading-[0.95] mb-10">
            {banner?.headline?.split(" ").slice(0, -2).join(" ") ?? "L'Essence"}
            <br />
            <span className="italic">
              {banner?.headline?.split(" ").slice(-2).join(" ") ?? "de Nuit"}
            </span>
          </h1>
          <Link
            to="/products/$slug"
            params={{ slug: "ambre-noir" }}
            className="inline-block bg-obsidian text-alabaster px-12 py-4 eyebrow tracking-[0.3em] hover:bg-gold transition-colors duration-500"
          >
            {banner?.cta_label ?? "Shop the fragrance"}
          </Link>
        </motion.div>
      </section>

      {/* BRAND STRIP */}
      <div className="border-y border-obsidian/5 py-10 px-6">
        <div className="mx-auto max-w-7xl flex flex-wrap justify-around items-center gap-y-4 gap-x-8">
          {brands.slice(0, 5).map((b) => (
            <span
              key={b.id}
              className="font-display italic text-lg md:text-xl text-obsidian/40"
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>

      {/* BEST SELLERS */}
      <section className="px-6 lg:px-10 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-14">
            <div>
              <div className="eyebrow text-obsidian/40 mb-3">Best Sellers</div>
              <h2 className="font-display text-4xl md:text-5xl">Les Iconiques</h2>
              <p className="text-obsidian/60 text-sm mt-2 max-w-md">
                The foundational scents of the house.
              </p>
            </div>
            <Link
              to="/collections"
              className="eyebrow border-b border-obsidian pb-1 hidden sm:inline-block"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {bestsellers.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className="px-6 lg:px-10 py-24 bg-bone/60">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="eyebrow text-obsidian/40 mb-3">Curated</div>
            <h2 className="font-display text-4xl md:text-5xl">Featured Collections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.slice(0, 4).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  className="group block"
                >
                  <div className="aspect-[3/4] bg-obsidian/90 mb-5 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display italic text-3xl text-alabaster/80 group-hover:text-gold transition-colors">
                        {c.name.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display text-xl mb-1">{c.name}</h3>
                  <p className="eyebrow text-obsidian/40">Explore</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="px-6 lg:px-10 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between items-end mb-14">
              <div>
                <div className="eyebrow text-obsidian/40 mb-3">New Arrivals</div>
                <h2 className="font-display text-4xl md:text-5xl">Recently Composed</h2>
              </div>
              <Link
                to="/collections"
                className="eyebrow border-b border-obsidian pb-1 hidden sm:inline-block"
              >
                Browse All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {newArrivals.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EDITORIAL */}
      <section className="grid grid-cols-1 md:grid-cols-2 bg-obsidian text-alabaster">
        <div className="py-24 md:py-32 px-8 md:px-16 flex flex-col justify-center">
          <div className="eyebrow text-alabaster/50 mb-6">Our Heritage</div>
          <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
            Crafting invisible
            <br />
            masterpieces.
          </h2>
          <p className="text-alabaster/60 leading-relaxed max-w-md mb-10 text-pretty">
            Founded in Grasse, we translate architectural forms into olfactory
            experiences. Each bottle is hand-poured in small batches, honoring
            techniques from the 18th century.
          </p>
          <a
            href="#"
            className="eyebrow border-b border-alabaster/40 pb-1 self-start hover:border-alabaster transition-colors"
          >
            Read the story
          </a>
        </div>
        <div className="h-[420px] md:h-auto">
          <img
            src={atelierImg}
            alt="The Aeterna perfumer's atelier in Grasse"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 lg:px-10 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="eyebrow text-center text-obsidian/40 mb-12">Press</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="border-l-2 border-gold pl-6"
              >
                <blockquote className="font-display text-xl md:text-2xl italic leading-relaxed mb-5">
                  {t.quote}
                </blockquote>
                <figcaption className="eyebrow text-obsidian/50">
                  {t.author}
                  {t.source && <span className="text-obsidian/30"> — {t.source}</span>}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-6 lg:px-10 py-28 text-center border-t border-obsidian/5 bg-bone/50">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Join the Circle</h2>
        <p className="text-obsidian/60 text-sm mb-10 max-w-md mx-auto">
          Exclusive previews and olfactory insights, delivered once a month.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="max-w-md mx-auto flex gap-2 border-b border-obsidian pb-2"
        >
          <label className="sr-only" htmlFor="nl">Email Address</label>
          <input
            id="nl"
            type="email"
            required
            placeholder="EMAIL ADDRESS"
            className="flex-1 bg-transparent eyebrow placeholder:text-obsidian/30 focus:outline-none"
          />
          <button type="submit" className="eyebrow font-bold">
            Subscribe
          </button>
        </form>
      </section>
    </>
  );
}
