"use client";

import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductCard from "@/components/ProductCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import NewArrivals from "@/components/NewArrivals";
import Testimonials from "@/components/Testimonials";
import RecentlyViewed from "@/components/RecentlyViewed";
import { MessageSquare, PhoneCall, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types/product";

interface HomeClientProps {
  featuredProducts: Product[];
  newArrivalProducts: Product[];
  bestSellerProducts: Product[];
}

export default function HomeClient({ featuredProducts, newArrivalProducts, bestSellerProducts }: HomeClientProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedCategories />

      <section className="py-24 bg-neutral-50 dark:bg-neutral-900/10 border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
                Handpicked Elite
              </span>
              <h2 className="text-fluid-h2 font-display font-black tracking-tight">
                Featured Products
              </h2>
            </div>
            
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              View Full Catalog
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </motion.div>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No featured products available.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 xl:gap-8">
              {featuredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
              <TrendingUp className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
                Customer Favorites
              </span>
              <h2 className="text-fluid-h2 font-display font-black tracking-tight">
                Best Sellers
              </h2>
            </div>
          </motion.div>

          {(bestSellerProducts.length === 0 ? featuredProducts : bestSellerProducts).length === 0 ? (
            <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl p-8 sm:p-12 text-center border border-border/50 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 mb-6">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">⭐ Popular products will appear here</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">Once customers start exploring our collection, the most viewed and purchased footwear will be featured here automatically.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 xl:gap-8">
              {(bestSellerProducts.length === 0 ? featuredProducts : bestSellerProducts).map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <WhyChooseUs />
      <NewArrivals products={newArrivalProducts} />
      <RecentlyViewed />
      <Testimonials />

      <section className="py-28 bg-neutral-100 dark:bg-neutral-950 text-foreground relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-neutral-200 dark:bg-neutral-900 border border-border text-xs font-semibold text-muted-foreground"
          >
            <ShieldCheck className="h-4.5 w-4.5 text-accent" />
            Fast Delivery & Premium Packaging
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-fluid-h1 font-display font-black tracking-tight leading-none">
              Looking For Your <br />
              <span className="text-accent">Perfect Pair?</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto font-sans leading-relaxed">
              No accounts. No complicated checkout. Talk directly to our footwear experts on WhatsApp to check sizes and confirm your order instantly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center max-w-md mx-auto pt-4"
          >
            <a
              href="https://wa.me/918374284265?text=Hello%20Priya%20Foot%20Wear,%20I%20am%20looking%20for%20shoes.%20Please%20guide%20me%20with%20what%20is%20available."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-emerald-950/20 active:scale-95"
            >
              <MessageSquare className="h-4 w-4" />
              WhatsApp Inquiry
            </a>
            
            <a
              href="tel:+918374284265"
              className="flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-xl bg-foreground text-background hover:bg-foreground/80 font-extrabold text-xs uppercase tracking-widest transition-all duration-300 active:scale-95"
            >
              <PhoneCall className="h-4 w-4" />
              Call Store Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
