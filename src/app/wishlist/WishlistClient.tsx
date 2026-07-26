"use client";

import { useEffect, useState } from "react";
import { useCustomerExperience } from "@/context/CustomerExperienceContext";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";

export default function WishlistClient() {
  const { wishlist } = useCustomerExperience();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .in("id", wishlist);

        if (!error && data) {
          const formatted: Product[] = data.map((row) => ({
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
            original_price: row.original_price ? Number(row.original_price) : undefined,
            enquiry_count: row.enquiry_count,
            share_count: row.share_count,
            view_count: row.view_count,
            status: row.status as any,
            createdAt: row.createdAt || row.created_at,
          }));
          setProducts(formatted);
        }
      } catch (e) {
        console.error("Failed to load wishlist products", e);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, [wishlist]);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <h1 className="text-3xl font-display font-bold text-foreground">My Wishlist</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border/40">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save your favorite shoes here to view them later.</p>
            <Link 
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
