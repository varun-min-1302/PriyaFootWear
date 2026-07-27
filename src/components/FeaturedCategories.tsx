"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export interface CategoryItem {
  name: string;
  slug: string;
  image: string;
  count: number;
  description: string;
}

interface FeaturedCategoriesProps {
  categories?: CategoryItem[];
}

const fallbackCategories: CategoryItem[] = [
  {
    name: "Sandals Collection",
    slug: "Sandals",
    image: "https://www.walkaroo.in/cdn/shop/files/1_da1c04d0-5b48-497e-ad13-cc6a5ab8e28d.jpg",
    count: 16,
    description: "Premium strapping sandals, roman designs, and daily comfort soles.",
  },
  {
    name: "Slippers & Flip-Flops",
    slug: "Slippers",
    image: "https://m.media-amazon.com/images/I/61m5xdwZ1WL._AC_UY1000_.jpg",
    count: 17,
    description: "Lightweight double-density EVA flip-flops and comfort slides.",
  },
];

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const displayCategories = categories && categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
              Curated Collections
            </span>
            <h2 className="text-fluid-h2 font-display font-black tracking-tight">
              Featured Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors duration-300"
          >
            Explore All Footwear
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>

        {/* Categories Grid (Dynamically adapts to number of categories) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {displayCategories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="group relative flex flex-col justify-end aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-border/40 hover:border-accent/40 hover:shadow-xl dark:hover:shadow-accent/5 transition-all duration-300 block"
              >
                {/* Background Image */}
                <div className="absolute inset-4 md:inset-6">
                  <Image
                    src={cat.image || "/placeholder.jpg"}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Text Content */}
                <div className="p-6 relative z-10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-accent transition-colors duration-300">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm flex-shrink-0">
                      {cat.count} {cat.count === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-neutral-300 font-medium leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent pt-1 translate-y-1.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    Explore Collection
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
