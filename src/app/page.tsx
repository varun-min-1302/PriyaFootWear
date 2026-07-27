import HomeClient from "./HomeClient";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types/product";
import { CategoryItem } from "@/components/FeaturedCategories";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  // Fetch best sellers (highest views/enquiries)
  const { data: bestSellerData } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(4);

  // Fetch featured products
  const { data: featuredData } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  // Fetch new arrivals
  const { data: newArrivalData } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("newArrival", true)
    .order("created_at", { ascending: false })
    .limit(10);

  // Dynamic category aggregation from database
  const { data: allCatProducts } = await supabase
    .from("products")
    .select("category, images, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const categoryMap: Record<string, { count: number; image: string }> = {};

  (allCatProducts || []).forEach((row) => {
    const rawCat = row.category ? row.category.trim() : "";
    if (!rawCat) return;

    if (!categoryMap[rawCat]) {
      const img = Array.isArray(row.images) && row.images.length > 0 ? row.images[0] : "";
      categoryMap[rawCat] = {
        count: 1,
        image: img,
      };
    } else {
      categoryMap[rawCat].count += 1;
    }
  });

  const categories: CategoryItem[] = Object.entries(categoryMap).map(([catName, info]) => {
    let displayName = catName;
    const lower = catName.toLowerCase();
    if (!lower.includes("collection") && !lower.includes("flip-flop") && !lower.includes("belt") && !lower.includes("slipper")) {
      displayName = `${catName} Collection`;
    }

    return {
      name: displayName,
      slug: catName,
      image: info.image,
      count: info.count,
      description: `Explore our latest ${catName.toLowerCase()} range (${info.count} ${info.count === 1 ? 'item' : 'items'}).`,
    };
  });

  const formatProduct = (row: any): Product => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    sizes: row.sizes || [],
    colors: row.colors || [],
    images: row.images || [],
    material: row.material,
    featured: row.featured,
    newArrival: row.newArrival,
    createdAt: row.createdAt || row.created_at,
  });

  const featuredProducts: Product[] = (featuredData || []).map(formatProduct);
  const newArrivalProducts: Product[] = (newArrivalData || []).map(formatProduct);
  const bestSellerProducts: Product[] = (bestSellerData || []).map(formatProduct);

  let heroProducts = featuredProducts.slice(0, 3);
  if (heroProducts.length === 0) {
    const { data: anyData } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(3);
    heroProducts = (anyData || []).map(formatProduct);
  }

  return (
    <HomeClient 
      featuredProducts={featuredProducts} 
      newArrivalProducts={newArrivalProducts}
      bestSellerProducts={bestSellerProducts}
      heroProducts={heroProducts}
      categories={categories}
    />
  );
}
