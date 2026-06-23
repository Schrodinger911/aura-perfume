import { supabase } from "@/integrations/supabase/client";

export type Brand = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  gender: "women" | "men" | "unisex" | null;
  is_featured: boolean;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  brand_id: string;
  brand?: Brand;
  fragrance_family: string | null;
  concentration: string | null;
  gender: "women" | "men" | "unisex";
  top_notes: string[];
  middle_notes: string[];
  base_notes: string[];
  longevity: string | null;
  projection: string | null;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  base_price: number;
  sale_price: number | null;
  rating_avg: number;
  rating_count: number;
};

export type Variant = {
  id: string;
  product_id: string;
  size_ml: number;
  price: number;
  sale_price: number | null;
  sku: string;
  stock_qty: number;
};

export type Banner = {
  id: string;
  eyebrow: string | null;
  headline: string;
  subhead: string | null;
  cta_label: string | null;
  cta_href: string | null;
};

export type Testimonial = {
  id: string;
  author: string;
  source: string | null;
  quote: string;
};

const PRODUCT_FIELDS =
  "id,slug,name,description,brand_id,fragrance_family,concentration,gender,top_notes,middle_notes,base_notes,longevity,projection,is_best_seller,is_new_arrival,base_price,sale_price,rating_avg,rating_count,brand:brands(id,slug,name,description)";

const num = (v: unknown): number =>
  v == null ? 0 : typeof v === "number" ? v : parseFloat(String(v));

const normalizeProduct = (p: any): Product => ({
  ...p,
  base_price: num(p.base_price),
  sale_price: p.sale_price == null ? null : num(p.sale_price),
  rating_avg: num(p.rating_avg),
  rating_count: p.rating_count ?? 0,
  top_notes: p.top_notes ?? [],
  middle_notes: p.middle_notes ?? [],
  base_notes: p.base_notes ?? [],
  brand: p.brand ?? undefined,
});

export type HomepageData = {
  banner: Banner | null;
  bestsellers: Product[];
  newArrivals: Product[];
  brands: Brand[];
  testimonials: Testimonial[];
  collections: Collection[];
};

export async function fetchHomepage(): Promise<HomepageData> {
  const [banner, bestsellers, newArrivals, brands, testimonials, collections] =
    await Promise.all([
      supabase
        .from("homepage_banners")
        .select("id,eyebrow,headline,subhead,cta_label,cta_href")
        .eq("is_active", true)
        .order("sort_order")
        .limit(1)
        .maybeSingle(),
      supabase
        .from("products")
        .select(PRODUCT_FIELDS)
        .eq("is_best_seller", true)
        .limit(4),
      supabase
        .from("products")
        .select(PRODUCT_FIELDS)
        .eq("is_new_arrival", true)
        .limit(4),
      supabase.from("brands").select("id,slug,name,description").limit(6),
      supabase
        .from("testimonials")
        .select("id,author,source,quote")
        .order("sort_order")
        .limit(4),
      supabase
        .from("collections")
        .select("id,slug,name,description,gender,is_featured,sort_order")
        .eq("is_featured", true)
        .order("sort_order"),
    ]);

  return {
    banner: (banner.data as Banner | null) ?? null,
    bestsellers: ((bestsellers.data ?? []) as any[]).map(normalizeProduct),
    newArrivals: ((newArrivals.data ?? []) as any[]).map(normalizeProduct),
    brands: (brands.data ?? []) as Brand[],
    testimonials: (testimonials.data ?? []) as Testimonial[],
    collections: (collections.data ?? []) as Collection[],
  };
}

export async function fetchCollections(): Promise<Collection[]> {
  const { data } = await supabase
    .from("collections")
    .select("id,slug,name,description,gender,is_featured,sort_order")
    .order("sort_order");
  return (data ?? []) as Collection[];
}

export type CollectionPageData = {
  collection: Collection | null;
  products: Product[];
  brands: Brand[];
};

export async function fetchCollectionPage(slug: string): Promise<CollectionPageData> {
  const { data: collection } = await supabase
    .from("collections")
    .select("id,slug,name,description,gender,is_featured,sort_order")
    .eq("slug", slug)
    .maybeSingle();
  if (!collection) return { collection: null, products: [], brands: [] };

  const { data: links } = await supabase
    .from("product_collections")
    .select("product_id")
    .eq("collection_id", (collection as any).id);

  const ids = ((links ?? []) as Array<{ product_id: string }>).map((l) => l.product_id);
  let products: Product[] = [];
  if (ids.length) {
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_FIELDS)
      .in("id", ids);
    products = ((data ?? []) as any[]).map(normalizeProduct);
  }
  const { data: brands } = await supabase
    .from("brands")
    .select("id,slug,name,description");

  return {
    collection: collection as Collection,
    products,
    brands: (brands ?? []) as Brand[],
  };
}

export type ProductPageData = {
  product: Product;
  variants: Variant[];
  related: Product[];
};

export async function fetchProduct(slug: string): Promise<ProductPageData | null> {
  const { data: p } = await supabase
    .from("products")
    .select(PRODUCT_FIELDS)
    .eq("slug", slug)
    .maybeSingle();
  if (!p) return null;
  const product = normalizeProduct(p);
  const { data: variants } = await supabase
    .from("product_variants")
    .select("id,product_id,size_ml,price,sale_price,sku,stock_qty")
    .eq("product_id", product.id)
    .order("size_ml");
  const { data: related } = await supabase
    .from("products")
    .select(PRODUCT_FIELDS)
    .eq("brand_id", product.brand_id)
    .neq("id", product.id)
    .limit(4);
  return {
    product,
    variants: ((variants ?? []) as any[]).map((v: any) => ({
      ...v,
      price: num(v.price),
      sale_price: v.sale_price == null ? null : num(v.sale_price),
    })) as Variant[],
    related: ((related ?? []) as any[]).map(normalizeProduct),
  };
}


export async function searchProducts(q: string) {
  if (!q.trim()) return [] as Product[];
  const pattern = `%${q.trim()}%`;
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_FIELDS)
    .or(`name.ilike.${pattern},description.ilike.${pattern},fragrance_family.ilike.${pattern}`)
    .limit(12);
  return ((data ?? []) as any[]).map(normalizeProduct);
}

export async function fetchProductsByIds(ids: string[]) {
  if (!ids.length) return [];
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_FIELDS)
    .in("id", ids);
  return ((data ?? []) as any[]).map(normalizeProduct);
}
