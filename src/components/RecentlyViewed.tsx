"use client";

import { useEffect, useState } from "react";
import { useCustomerExperience } from "@/context/CustomerExperienceContext";
import { getProductsByIds } from "@/app/actions/productActions";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { History } from "lucide-react";

export default function RecentlyViewed() {
  const { recentlyViewed } = useCustomerExperience();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // intentionally correct: hydration wrapper
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    async function loadProducts() {
      if (recentlyViewed.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // We only want to show up to 4 on homepage
        const topIds = recentlyViewed.slice(0, 4);
        const fetched = await getProductsByIds(topIds);
        
        // Ensure they appear in the exact order they were recently viewed
        const ordered = topIds.map(id => fetched.find(p => p.id === id)).filter(Boolean) as Product[];
        setProducts(ordered);
      } catch (err) {
        console.error("Failed to load recently viewed:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [recentlyViewed, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <section className="py-16 bg-background border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
            <History className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-display font-black tracking-tight">
              Recently Viewed
            </h2>
            <p className="text-sm text-muted-foreground">Pick up where you left off</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 rounded-3xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl p-8 sm:p-12 text-center border border-border/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 mb-6">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">Browse products and they'll appear here automatically.</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">Keep track of the footwear you've looked at while exploring our collections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
