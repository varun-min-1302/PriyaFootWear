"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-background pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Subtle warm ambient glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-accent/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">

        {/* ─── Left Column: Text & CTAs ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-7 text-left order-2 lg:order-1"
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
              New Arrival
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-fluid-hero tracking-tight leading-[1.05]">
            <span className="font-display font-black text-foreground block">The Art of</span>
            <span className="text-accent italic font-light font-serif block">the Artisan</span>
          </h1>

          {/* Body */}
          <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed max-w-lg">
            Engineered for the modern connoisseur. Each stitch narrates a legacy
            of craftsmanship, blending ergonomic precision with timeless
            silhouette. Step into comfort that speaks volumes.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 items-stretch sm:items-center">
            <a
              href="https://wa.me/918374284265?text=Hello%20Priya%20Foot%20Wear,%20I%20am%20interested%20in%20securing%20a%20pair.%20Please%20guide%20me."
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-8 py-4 rounded-lg bg-foreground text-background font-bold text-xs uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg hover:shadow-[0_6px_25px_rgba(205,162,80,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Secure Your Pair
            </a>

            <Link
              href="/products"
              className="text-center px-8 py-4 rounded-lg border border-border text-muted-foreground font-bold text-xs uppercase tracking-widest hover:border-accent/50 hover:text-accent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              View Lookbook
            </Link>
          </div>
        </motion.div>

        {/* ─── Right Column: Editorial Product Photo ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="flex justify-center items-center relative order-1 lg:order-2"
        >
          {/* Photo container */}
          <div className="relative w-full max-w-[520px] aspect-[4/5] overflow-hidden rounded-2xl border border-border/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] group">
            <Image
              src="/images/products/leefox-699-leefox-chappal-4.png"
              alt="LeeFox Premium Leather Sandal — Hand-Burnished Calfskin"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[8000ms] ease-out scale-100 group-hover:scale-[1.06]"
            />

            {/* Bottom shadow gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Floating Edition Overlay Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute bottom-5 right-5 left-5 sm:left-auto sm:w-[240px] bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md rounded-xl p-5 shadow-2xl border-l-4 border-l-accent z-20"
            >
              <span className="text-3xl font-serif italic font-semibold text-accent leading-none block">
                01
              </span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 mt-2 block">
                Edition 2026
              </span>
              <span className="text-xs font-sans font-black tracking-wider text-neutral-800 dark:text-white uppercase mt-1 leading-tight block">
                Hand-Burnished Calfskin
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
