import HomeClient from "./HomeClient";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  // Fetch featured products
  const { data: featuredData } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  // Fetch new arrivals
  const { data: newArrivalData } = await supabase
    .from("products")
    .select("*")
    .eq("newArrival", true)
    .order("created_at", { ascending: false })
    .limit(10);

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

  return (
    <HomeClient 
      featuredProducts={featuredProducts} 
      newArrivalProducts={newArrivalProducts} 
    />
  );
}
