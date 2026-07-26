import { createClient } from "@/lib/supabase/server";
import ProductDetailClient from "./ProductDetailClient";
import { Product } from "@/types/product";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from("products")
    .select("name, description, images")
    .eq("slug", slug)
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Priya Footwear`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images && product.images[0] ? [{ url: product.images[0] }] : [{ url: "/placeholder.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images && product.images[0] ? [product.images[0]] : ["/placeholder.jpg"],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch product by slug
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  // Fetch related products
  const { data: relatedData } = await supabase
    .from("products")
    .select("*")
    .eq("category", data.category)
    .neq("id", data.id)
    .limit(3);

  const formatProduct = (row:   any): Product => ({
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

  const product: Product = formatProduct(data);
  const relatedProducts: Product[] = (relatedData || []).map(formatProduct);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
