"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageSquare, ArrowUpRight } from "lucide-react";
import { Product } from "@/types/product";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Format price in Indian Rupees (INR)
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  // Generate pre-filled WhatsApp message
  const whatsappUrl = `https://wa.me/918374284265?text=${encodeURIComponent(
    `Hi Priya Foot Wear,\n\nI am interested in:\nProduct Name: ${product.name}\nProduct ID: ${product.id}\n\nPlease share availability.`
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col bg-card rounded-2xl border border-border/40 overflow-hidden hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-accent/5 hover:border-accent/30 transition-all duration-300 h-full"
    >
      {/* Product Image Gallery Wrapper */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-900 block">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.newArrival && (
            <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase bg-accent text-accent-foreground rounded-full shadow-md shadow-accent/20">
              New Arrival
            </span>
          )}
          {product.featured && (
            <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase bg-foreground text-background rounded-full border border-border/10 shadow-md">
              Featured
            </span>
          )}
        </div>

        {/* View Details overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
          <div className="flex items-center gap-1.5 bg-white text-black dark:bg-black dark:text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            View Details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Product Image Wrapper */}
        <div className="absolute inset-4">
          <Image
            src={product.images[0] || "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
            priority={false}
          />
        </div>
      </Link>

      {/* Info Content */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1.5">
          {product.category}
        </span>
        
        <Link href={`/products/${product.slug}`} className="hover:text-accent transition-colors duration-200 block mb-2">
          <h3 className="font-display font-bold text-base line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-lg font-extrabold text-foreground tracking-tight mb-4">
          {formattedPrice}
        </p>

        {/* Available Sizes List */}
        <div className="mb-5 mt-auto">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold block mb-2">
            Available Sizes (UK)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="w-7 h-7 flex items-center justify-center text-xs font-bold border border-border/80 dark:border-border/20 rounded-md text-muted-foreground group-hover:border-foreground/30 transition-colors duration-300"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-xs font-semibold text-muted-foreground flex items-center pl-1">
                +{product.sizes.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* WhatsApp Call to Action */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-emerald-900/10 hover:shadow-lg hover:shadow-emerald-900/20 active:scale-95"
        >
          <MessageSquare className="h-4 w-4" />
          Inquire Availability
        </a>
      </div>
    </motion.div>
  );
}
