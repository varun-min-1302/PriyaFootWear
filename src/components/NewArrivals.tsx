"use client";

import { useRef } from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-xs font-bold tracking-widest uppercase text-accent">
                Just Landed
              </span>
            </div>
            <h2 className="text-fluid-h2 font-display font-black tracking-tight">
              New Arrivals
            </h2>
          </div>
          
          {products.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="p-3 rounded-full border border-border/80 bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-all shadow-md active:scale-90"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-3 rounded-full border border-border/80 bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-all shadow-md active:scale-90"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 md:px-0 md:mx-0 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        >
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] snap-start"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
