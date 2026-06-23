import { Link } from "@tanstack/react-router";

type ColLink = { to: string; label: string };

const SHOP: ColLink[] = [
  { to: "/collections", label: "All Collections" },
  { to: "/collections/women", label: "Women" },
  { to: "/collections/men", label: "Men" },
  { to: "/collections/niche", label: "Niche" },
  { to: "/collections/gift-sets", label: "Gift Sets" },
];

const HOUSE = [
  { href: "#", label: "The Atelier" },
  { href: "#", label: "Journal" },
  { href: "#", label: "Sustainability" },
  { href: "#", label: "Stockists" },
];

const CARE = [
  { href: "#", label: "Shipping & Returns" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Accessibility" },
];

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-obsidian/5 px-6 lg:px-10 py-20">
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
        <div className="col-span-2">
          <Link to="/" className="font-display italic text-3xl">
            AETERNA
          </Link>
          <p className="mt-8 max-w-sm text-sm text-obsidian/60 leading-relaxed">
            A house of olfactory architecture. Founded in Grasse, hand-poured in small
            batches.
          </p>
        </div>
        <div>
          <div className="eyebrow font-semibold mb-6">Shop</div>
          <ul className="flex flex-col gap-3">
            {SHOP.map((l) => (
              <li key={l.label}>
                <a href={l.to} className="text-sm text-obsidian/60 hover:text-obsidian transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <FooterCol title="House" links={HOUSE} />
        <FooterCol title="Care" links={CARE} />
      </div>
      <div className="mx-auto max-w-7xl flex flex-col-reverse md:flex-row gap-6 justify-between items-start md:items-center eyebrow text-obsidian/40">
        <span>© 2026 Aeterna Fragrances</span>
        <div className="flex gap-8">
          <a href="#">Instagram</a>
          <a href="#">Pinterest</a>
          <a href="#">Vimeo</a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <div className="eyebrow font-semibold mb-6">{title}</div>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-sm text-obsidian/60 hover:text-obsidian transition-colors">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
