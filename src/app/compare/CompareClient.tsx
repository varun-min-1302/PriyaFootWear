"use client";

import { useEffect, useState } from "react";
import { useCustomerExperience } from "@/context/CustomerExperienceContext";
import { getProductsByIds } from "@/app/actions/productActions";
import { Product } from "@/types/product";
import { Loader2, ArrowLeftRight, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CompareClient() {
  const { compareList, toggleCompare } = useCustomerExperience();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompare() {
      if (compareList.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const data = await getProductsByIds(compareList);
        // Order according to how they were added to compare list
        const ordered = compareList.map(id => data.find(p => p.id === id)).filter(Boolean) as Product[];
        setProducts(ordered);
      } catch (e) {
        console.error("Failed to load compare products", e);
      } finally {
        setLoading(false);
      }
    }
    loadCompare();
  }, [compareList]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <ArrowLeftRight className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-display font-bold text-foreground">Compare Products</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border/40">
            <ArrowLeftRight className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Nothing to compare</h2>
            <p className="text-muted-foreground mb-6">Add products to your compare list to see them side-by-side.</p>
            <Link 
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[800px] w-full grid" style={{ gridTemplateColumns: `minmax(150px, 1fr) repeat(${products.length}, minmax(250px, 1fr))` }}>
              
              {/* Header / Images */}
              <div className="font-semibold text-muted-foreground pt-4 pb-4 pr-4 border-b border-border/40 flex items-center">
                Product
              </div>
              {products.map(product => (
                <div key={product.id} className="p-4 border-b border-l border-border/40 relative group">
                  <button 
                    onClick={() => toggleCompare(product.id)}
                    className="absolute top-6 right-6 z-10 bg-background/80 backdrop-blur p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove from compare"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-secondary/50 mb-3">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                    )}
                  </div>
                  <h3 className="font-medium text-foreground line-clamp-2 leading-tight">
                    <Link href={`/products/${product.slug}`} className="hover:underline">{product.name}</Link>
                  </h3>
                </div>
              ))}

              {/* Price */}
              <div className="font-semibold text-muted-foreground py-4 pr-4 border-b border-border/40 flex items-center">Price</div>
              {products.map(product => (
                <div key={product.id} className="p-4 border-b border-l border-border/40 font-medium text-foreground">
                  {formatPrice(product.price)}
                </div>
              ))}

              {/* Category */}
              <div className="font-semibold text-muted-foreground py-4 pr-4 border-b border-border/40 flex items-center">Category</div>
              {products.map(product => (
                <div key={product.id} className="p-4 border-b border-l border-border/40 text-foreground">
                  {product.category}
                </div>
              ))}

              {/* Material */}
              <div className="font-semibold text-muted-foreground py-4 pr-4 border-b border-border/40 flex items-center">Material</div>
              {products.map(product => (
                <div key={product.id} className="p-4 border-b border-l border-border/40 text-foreground">
                  {product.material || "N/A"}
                </div>
              ))}

              {/* Sizes */}
              <div className="font-semibold text-muted-foreground py-4 pr-4 border-b border-border/40 flex items-center">Available Sizes</div>
              {products.map(product => (
                <div key={product.id} className="p-4 border-b border-l border-border/40 text-foreground">
                  <div className="flex flex-wrap gap-1">
                    {product.sizes?.length ? product.sizes.map(size => (
                      <span key={size} className="px-2 py-0.5 bg-secondary text-xs rounded">{size}</span>
                    )) : "N/A"}
                  </div>
                </div>
              ))}

              {/* Colors */}
              <div className="font-semibold text-muted-foreground py-4 pr-4 border-b border-border/40 flex items-center">Available Colors</div>
              {products.map(product => (
                <div key={product.id} className="p-4 border-b border-l border-border/40 text-foreground">
                  <div className="flex flex-wrap gap-1">
                    {product.colors?.length ? product.colors.map(color => (
                      <span key={color} className="px-2 py-0.5 bg-secondary text-xs rounded">{color}</span>
                    )) : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
