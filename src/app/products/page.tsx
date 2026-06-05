import { Suspense } from "react";
import CatalogContent from "./CatalogContent";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Men's Collection | Priya FootWear",
  description: "Browse our premium range of formal wear, casual sneakers, sports running shoes, and comfortable home slides.",
  openGraph: {
    title: "Men's Collection | Priya FootWear",
    description: "Browse our premium range of formal wear, casual sneakers, sports running shoes, and comfortable home slides.",
    type: "website",
  }
};

export default async function ProductsPage() {
  const supabase = await createClient();
  
  // Fetch all products from Supabase
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", JSON.stringify(error, null, 2));
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error details:", error.details);
    console.error("Error hint:", error.hint);
  }
  
  console.log("Products fetched:", data?.length ?? 0, "items");

  // Map database casing to Product type
  const products: Product[] = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    category: row.category as any,
    sizes: row.sizes || [],
    colors: row.colors || [],
    images: row.images || [],
    material: row.material,
    featured: row.featured,
    newArrival: row.newArrival,
    createdAt: row.createdAt || row.created_at, // Handle both in case of camel vs snake case
  }));

  return (
    <div className="pt-20 bg-background min-h-screen">
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 py-32 text-center text-muted-foreground font-semibold">
          Loading footwear collection...
        </div>
      }>
        <CatalogContent initialProducts={products} />
      </Suspense>
    </div>
  );
}
