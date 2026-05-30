"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ArtisanShowcase() {
  return (
    <section className="py-24 bg-[#0a0705] border-t border-white/[0.03] relative overflow-hidden">
      {/* Decorative Gold Radial Light for Atmosphere */}
      <div className="absolute left-0 bottom-0 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Storytelling content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#cda250]/10 border border-[#cda250]/20">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#cda250]">
                New Arrival
              </span>
            </div>

            {/* Headline with mixed font styles matching mockup */}
            <h2 className="text-fluid-h1 font-serif text-white tracking-tight leading-[1.1]">
              The Art of <br />
              <span className="text-[#cda250] italic font-light font-serif">the Artisan</span>
            </h2>

            {/* Body paragraph */}
            <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed max-w-lg">
              Engineered for the modern connoisseur. Each stitch narrates a legacy of Italian craftsmanship, blending ergonomic precision with timeless silhouette.
            </p>

            {/* Premium Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 items-stretch sm:items-center">
              <a
                href="https://wa.me/918374284265?text=Hello%20Priya%20Foot%20Wear,%20I%20am%20interested%20in%20securing%20the%20LeeFox%20hand-burnished%20calfskin%20sandal."
                target="_blank"
                rel="noopener noreferrer"
                className="text-center px-8 py-4 rounded-lg bg-[#cda250] text-[#1a1105] font-bold text-xs uppercase tracking-widest hover:bg-[#d9b265] transition-all duration-300 shadow-[0_4px_20px_rgba(205,162,80,0.2)] hover:shadow-[0_6px_25px_rgba(205,162,80,0.4)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Secure Your Pair
              </a>
              
              <Link
                href="/products"
                className="text-center px-8 py-4 rounded-lg border border-[#cda250]/30 text-[#cda250] font-bold text-xs uppercase tracking-widest hover:bg-[#cda250]/5 hover:border-[#cda250]/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                View Lookbook
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Editorial Product Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 flex justify-center items-center relative"
          >
            {/* Aspect Container */}
            <div className="relative w-full max-w-[480px] aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.05] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] group">
              <Image
                src="/images/products/leefox-699-leefox-chappal-4.png"
                alt="LeeFox Hand-Burnished Calfskin Sandal"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[8000ms] scale-100 group-hover:scale-105"
              />

              {/* Light overlay at the bottom for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Information Overlay Card */}
              <div className="absolute bottom-6 right-6 left-6 sm:left-auto sm:w-[260px] bg-neutral-900/90 border border-white/5 border-l-4 border-l-[#cda250] backdrop-blur-md rounded-xl p-5 shadow-2xl flex flex-col items-start text-left z-20">
                <span className="text-2xl sm:text-3xl font-serif italic font-semibold text-[#cda250] leading-none">
                  01
                </span>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 mt-2">
                  Edition 2026
                </span>
                <span className="text-xs sm:text-sm font-sans font-black tracking-wider text-white uppercase mt-1 leading-tight">
                  Hand-Burnished Calfskin
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
