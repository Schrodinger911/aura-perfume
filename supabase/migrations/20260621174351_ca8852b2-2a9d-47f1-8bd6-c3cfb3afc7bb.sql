
-- Enums
CREATE TYPE public.gender_t AS ENUM ('women','men','unisex');
CREATE TYPE public.concentration_t AS ENUM ('eau_de_cologne','eau_de_toilette','eau_de_parfum','parfum','extrait');

-- Brands
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.brands TO anon, authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands public read" ON public.brands FOR SELECT TO anon, authenticated USING (true);

-- Collections
CREATE TABLE public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  hero_image_url text,
  gender public.gender_t,
  sort_order int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.collections TO anon, authenticated;
GRANT ALL ON public.collections TO service_role;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "collections public read" ON public.collections FOR SELECT TO anon, authenticated USING (true);

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
  description text,
  fragrance_family text,
  concentration public.concentration_t,
  gender public.gender_t NOT NULL DEFAULT 'unisex',
  top_notes text[] NOT NULL DEFAULT '{}',
  middle_notes text[] NOT NULL DEFAULT '{}',
  base_notes text[] NOT NULL DEFAULT '{}',
  longevity text,
  projection text,
  is_best_seller boolean NOT NULL DEFAULT false,
  is_new_arrival boolean NOT NULL DEFAULT false,
  base_price numeric(10,2) NOT NULL,
  sale_price numeric(10,2),
  rating_avg numeric(2,1) NOT NULL DEFAULT 0,
  rating_count int NOT NULL DEFAULT 0,
  hero_image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX products_brand_idx ON public.products(brand_id);

-- Variants
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size_ml int NOT NULL,
  price numeric(10,2) NOT NULL,
  sale_price numeric(10,2),
  sku text UNIQUE NOT NULL,
  stock_qty int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "variants public read" ON public.product_variants FOR SELECT TO anon, authenticated USING (true);

-- Images
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "images public read" ON public.product_images FOR SELECT TO anon, authenticated USING (true);

-- Join
CREATE TABLE public.product_collections (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  collection_id uuid NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);
GRANT SELECT ON public.product_collections TO anon, authenticated;
GRANT ALL ON public.product_collections TO service_role;
ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pc public read" ON public.product_collections FOR SELECT TO anon, authenticated USING (true);

-- Testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  source text,
  quote text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);

-- Banners
CREATE TABLE public.homepage_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow text,
  headline text NOT NULL,
  subhead text,
  cta_label text,
  cta_href text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.homepage_banners TO anon, authenticated;
GRANT ALL ON public.homepage_banners TO service_role;
ALTER TABLE public.homepage_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners public read" ON public.homepage_banners FOR SELECT TO anon, authenticated USING (true);

-- Seed data
INSERT INTO public.brands (slug, name, description) VALUES
  ('aeterna','Aeterna','House of Aeterna — Grasse, est. 1994.'),
  ('maison-orris','Maison Orris','Parisian olfactory atelier.'),
  ('velours','Velours','Velvet-soft modern orientals.'),
  ('lumina','Lumina','Bright minimalist citrus florals.'),
  ('noir-et-blanc','Noir et Blanc','Black-and-white photographic scents.'),
  ('oak-and-ivy','Oak & Ivy','English botanical perfumery.');

INSERT INTO public.collections (slug, name, description, gender, sort_order, is_featured) VALUES
  ('women','Women''s Fragrances','For her.','women',1,true),
  ('men','Men''s Fragrances','For him.','men',2,true),
  ('unisex','Unisex','Beyond binary.','unisex',3,true),
  ('niche','Niche','Limited extractions.','unisex',4,true),
  ('arabian','Arabian Perfumes','Oud, amber, oriental craft.','unisex',5,false),
  ('gift-sets','Gift Sets','Considered presentations.','unisex',6,false),
  ('seasonal','Seasonal','Autumn / Winter Edition.','unisex',7,false);

-- Products
WITH b AS (SELECT slug,id FROM public.brands)
INSERT INTO public.products (slug,name,brand_id,description,fragrance_family,concentration,gender,top_notes,middle_notes,base_notes,longevity,projection,is_best_seller,is_new_arrival,base_price,sale_price,rating_avg,rating_count) VALUES
  ('santal-majestic','Santal Majestic',(SELECT id FROM b WHERE slug='aeterna'),'A meditation on Mysore sandalwood, smoked cedar, and quiet oud.','Woody','eau_de_parfum','unisex','{Bergamot,Pink Pepper}','{Iris,Violet Leaf}','{Sandalwood,Cedar,Oud}','8-10h','Moderate',true,false,245,NULL,4.8,142),
  ('rose-inconnue','Rose Inconnue',(SELECT id FROM b WHERE slug='maison-orris'),'An anonymous rose. Damask petals over pink pepper and quiet musk.','Floral','eau_de_parfum','women','{Pink Pepper,Lychee}','{Damask Rose,Peony}','{Musk,Patchouli}','6-8h','Moderate',true,true,210,NULL,4.7,98),
  ('bergamote-02','Bergamote 02',(SELECT id FROM b WHERE slug='lumina'),'Cold-pressed Calabrian bergamot, sea salt, and white musk.','Citrus','eau_de_toilette','unisex','{Bergamot,Lemon,Grapefruit}','{Sea Salt,Neroli}','{White Musk,Ambrette}','5-7h','Soft',true,false,195,NULL,4.6,210),
  ('ambre-noir','Ambre Noir',(SELECT id FROM b WHERE slug='velours'),'Resinous amber wrapped in vanilla, incense, and worn leather.','Amber','parfum','unisex','{Pink Pepper,Cardamom}','{Incense,Labdanum}','{Amber,Vanilla,Leather}','10-12h','Heavy',true,false,280,NULL,4.9,331),
  ('figue-noir','Figue Noir',(SELECT id FROM b WHERE slug='maison-orris'),'Black fig, milky sap, and warm fig wood.','Woody','eau_de_parfum','unisex','{Fig Leaf,Green Apple}','{Fig Milk,Coconut}','{Fig Wood,Cedar}','6-8h','Moderate',false,true,185,NULL,4.5,67),
  ('cuir-de-nuit','Cuir de Nuit',(SELECT id FROM b WHERE slug='aeterna'),'A nocturnal leather: birch tar, suede, and saffron.','Leather','parfum','men','{Saffron,Black Pepper}','{Birch,Suede}','{Leather,Castoreum,Vetiver}','10h+','Heavy',false,false,195,NULL,4.6,84),
  ('iris-blanc','Iris Blanc',(SELECT id FROM b WHERE slug='noir-et-blanc'),'Photographic iris: cold powder, butter, and quiet woods.','Powdery','eau_de_parfum','women','{Aldehydes,Carrot Seed}','{Iris,Orris Butter}','{Sandalwood,Musk}','7-9h','Moderate',false,true,260,NULL,4.7,55),
  ('vetiver-04','Vetiver 04',(SELECT id FROM b WHERE slug='lumina'),'Haitian vetiver over grapefruit zest and bone-dry cedar.','Woody','eau_de_toilette','men','{Grapefruit,Bergamot}','{Vetiver,Geranium}','{Cedar,Vetiver Root}','6-8h','Moderate',true,false,165,NULL,4.5,176),
  ('oud-sultan','Oud Sultan',(SELECT id FROM b WHERE slug='velours'),'Cambodian oud, Bulgarian rose, and royal saffron.','Oriental','parfum','unisex','{Saffron,Cardamom}','{Bulgarian Rose,Oud}','{Amber,Sandalwood,Musk}','12h+','Heavy',true,false,420,NULL,4.9,89),
  ('jardin-anglais','Jardin Anglais',(SELECT id FROM b WHERE slug='oak-and-ivy'),'A walled English garden: green stems, hyacinth, ivy.','Green','eau_de_toilette','women','{Galbanum,Hyacinth}','{Ivy,Linden Blossom}','{Oakmoss,Vetiver}','5-7h','Soft',false,true,170,NULL,4.4,42),
  ('encens-blanc','Encens Blanc',(SELECT id FROM b WHERE slug='noir-et-blanc'),'White incense, frankincense smoke, and chilled marble.','Incense','eau_de_parfum','unisex','{Pink Pepper,Elemi}','{Frankincense,Myrrh}','{Cedar,Cashmeran}','8-10h','Moderate',false,false,235,NULL,4.6,71),
  ('chypre-noir','Chypre Noir',(SELECT id FROM b WHERE slug='aeterna'),'A modern chypre. Bergamot, dark rose, oakmoss.','Chypre','eau_de_parfum','women','{Bergamot,Plum}','{Rose,Patchouli}','{Oakmoss,Labdanum}','8h','Moderate',true,false,225,189,4.8,124);

-- Variants
INSERT INTO public.product_variants (product_id, size_ml, price, sku, stock_qty)
SELECT p.id, sz.size, ROUND(p.base_price * sz.mult, 2), upper(replace(p.slug,'-','')) || '-' || sz.size, 25
FROM public.products p, (VALUES (30, 0.55), (50, 1.0), (100, 1.6)) AS sz(size, mult);

-- Map products to collections
WITH p AS (SELECT slug,id,gender FROM public.products), c AS (SELECT slug,id FROM public.collections)
INSERT INTO public.product_collections (product_id, collection_id)
SELECT p.id, c.id FROM p, c WHERE
  (p.gender::text = c.slug)
  OR (c.slug = 'niche' AND p.slug IN ('oud-sultan','encens-blanc','iris-blanc','cuir-de-nuit'))
  OR (c.slug = 'arabian' AND p.slug IN ('oud-sultan','ambre-noir'))
  OR (c.slug = 'seasonal' AND p.slug IN ('ambre-noir','encens-blanc','cuir-de-nuit','chypre-noir'));

-- Testimonials
INSERT INTO public.testimonials (author, source, quote, sort_order) VALUES
  ('Vogue','Beauty Edit','"A house that treats fragrance as architecture — quiet, considered, monumental."',1),
  ('Harper''s Bazaar','The Scent List','"Aeterna''s compositions feel less like perfumes than like rooms you walk through."',2),
  ('The New York Times','Style','"A new standard for restraint in modern perfumery."',3),
  ('Elle Decoration',NULL,'"Sculptural bottles, sculptural scents. Both worthy of the plinth."',4);

-- Hero banner
INSERT INTO public.homepage_banners (eyebrow, headline, subhead, cta_label, cta_href, sort_order, is_active) VALUES
  ('The Signature Collection','L''Essence de Nuit','A nocturnal composition of amber, oud, and quiet light.','Shop the fragrance','/products/ambre-noir',1,true);
