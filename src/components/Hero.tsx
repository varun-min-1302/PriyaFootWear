"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, Wind, Droplet, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── HERO SLIDES ─────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: "slide-1",
    badge: "NEW ARRIVAL",
    title1: "Athens Flip",
    title2: "Relaxation",
    accentClass: "text-[#C73838]",
    desc: "Iconic relaxation for casual ease. Lightweight. Water-friendly. Perfect for summer.",
    features: [
      { icon: Feather, label: "Lightweight:", sub: "Easy-to-Pack Design" },
      { icon: Wind, label: "Cooling:", sub: "Open Air Design" },
      { icon: Droplet, label: "Water Ready:", sub: "Beach & Pool Friendly" },
    ],
    price: "₹899",
    image: "/images/hero/slide-1-v3.png",
    bgClass: "bg-[#F3F4ED]",
    circleClass: "bg-[#E6E8D6]",
    btnClass: "bg-[#B3D334] text-white hover:bg-[#a2c02f]",
    shopHref: "/products",
    detailHref: "/products",
  },
  {
    id: "slide-2",
    badge: "NEW ARRIVAL",
    title1: "Classic Clog",
    title2: "Comfort",
    accentClass: "text-[#B3D334]",
    desc: "Iconic comfort for everyday adventures. Lightweight. Durable. Always fun.",
    features: [
      { icon: Feather, label: "Lightweight:", sub: "All-Day Comfort" },
      { icon: Wind, label: "Ventilated:", sub: "Better Breathability" },
      { icon: Droplet, label: "Water Friendly:", sub: "Quick Dry" },
    ],
    price: "₹1,199",
    image: "/images/hero/slide-2-v3.png",
    bgClass: "bg-[#F7F4EA]",
    circleClass: "bg-[#EAE4CA]",
    btnClass: "bg-[#B3D334] text-white hover:bg-[#a2c02f]",
    shopHref: "/products",
    detailHref: "/products",
  },
  {
    id: "slide-3",
    badge: "NEW ARRIVAL",
    title1: "LiteRide™",
    title2: "360 Clog",
    accentClass: "text-neutral-800",
    desc: "Step into effortless comfort. Lightweight. Breathable. Built for everyday.",
    features: [
      { icon: Feather, label: "Ultra Lightweight", sub: "" },
      { icon: Wind, label: "360° Breathability", sub: "" },
      { icon: Droplet, label: "Water Friendly", sub: "" },
    ],
    price: "₹1,299",
    image: "/images/hero/slide-3-v3.png",
    bgClass: "bg-[#EAE4DD]",
    circleClass: "bg-[#D8D0C5]",
    btnClass: "bg-neutral-900 text-white hover:bg-neutral-800",
    shopHref: "/products",
    detailHref: "/products",
  },
] as const;

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const textVariants = {
  enter: { opacity: 0, y: -20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] as const } },
};

const productVariants = {
  enter: { opacity: 0, scale: 0.9, y: 30 },
  center: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, scale: 0.9, y: -30, transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] as const } },
};

const bgVariants = {
  enter: { opacity: 0, scale: 0.85 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" as const } },
  exit: { opacity: 0, scale: 1.05, transition: { duration: 0.3 } },
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = HERO_SLIDES.length;

  const next = useCallback(() => setIdx((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setIdx((p) => (p - 1 + count) % count), [count]);

  // Auto-advance every 6 s, pause on hover
  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [isPaused, next]);

  // Keyboard navigation
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [next, prev]);

  const slide = HERO_SLIDES[idx];

  return (
    <section
      className={`relative min-h-screen w-full flex flex-col justify-between overflow-hidden transition-colors duration-700 ${slide.bgClass} pt-20 pb-8 px-4 sm:px-8 lg:px-14 xl:px-24`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background Circle ── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slide.id + "-bg"}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className={`absolute top-1/3 sm:top-1/2 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-[5%] -translate-y-1/2 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full pointer-events-none ${slide.circleClass}`}
        />
      </AnimatePresence>

      {/* ── Decorative Dots ── */}
      <div className="absolute top-[12%] right-[5%] w-24 h-24 opacity-25 bg-[radial-gradient(#00000022_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
      <div className="absolute bottom-[22%] left-[4%] w-24 h-24 opacity-25 bg-[radial-gradient(#00000022_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      {/* ── Top Sub-navigation ── */}
      <div className="w-full flex items-center justify-center gap-6 sm:gap-8 pt-2 pb-4 text-xs font-semibold text-neutral-600 z-20">
        <Link href="/" className="text-neutral-900 font-extrabold pb-0.5 border-b-2 border-neutral-900">
          Home
        </Link>
        <Link href="/products" className="hover:text-neutral-900 transition-colors">
          New Arrivals
        </Link>
        <Link href="/about" className="hover:text-neutral-900 transition-colors">
          Our Story
        </Link>
      </div>

      {/* ── Main Container (Desktop 2-col, Mobile exact stacked UX) ── */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 items-center relative z-10 my-auto">

        {/* ═══ TEXT CONTENT (Top on mobile, Left on desktop) ═══ */}
        <div className="flex flex-col z-20 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-text"}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-start text-left space-y-3 sm:space-y-5"
            >
              {/* Badge */}
              <span className="inline-block px-4 py-1 rounded-full bg-[#B3D334] text-neutral-900 text-[10px] font-extrabold tracking-widest uppercase">
                {slide.badge}
              </span>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-[5.5rem] font-sans font-black leading-[1.05] tracking-tight text-neutral-900">
                <span className="block">{slide.title1}</span>
                <span className={`block ${slide.accentClass}`}>{slide.title2}</span>
              </h1>

              {/* Accent Line */}
              <div className="w-10 h-[2px] bg-neutral-300 rounded-full" />

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-700 max-w-md leading-relaxed font-medium">
                {slide.desc}
              </p>

              {/* Feature Icons Row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-2 w-full max-w-md">
                {slide.features.map((feat, i) => (
                  <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-neutral-300 flex items-center justify-center bg-white/60 backdrop-blur-sm shadow-sm">
                      <feat.icon className="w-4 h-4 text-neutral-700" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-neutral-900 leading-tight">{feat.label}</p>
                      {feat.sub && <p className="text-[8px] sm:text-[9.5px] text-neutral-500 leading-tight">{feat.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price & CTAs for Desktop only */}
              <div className="hidden lg:flex flex-col space-y-5 pt-4 w-full">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-neutral-900">{slide.price}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={slide.shopHref}
                    className={`px-8 py-3.5 rounded-md font-extrabold text-[11px] tracking-[0.15em] uppercase transition-all shadow-lg active:scale-95 ${slide.btnClass}`}
                  >
                    Shop Now →
                  </Link>
                  <Link
                    href={slide.detailHref}
                    className="px-8 py-3.5 rounded-md border border-neutral-400 text-neutral-900 font-extrabold text-[11px] tracking-[0.15em] uppercase hover:bg-neutral-900 hover:text-white transition-all active:scale-95"
                  >
                    View Details
                  </Link>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ═══ FLOATING PRODUCT + PEDESTAL (Center on mobile & desktop) ═══ */}
        <div
          className="relative w-full h-[240px] sm:h-[340px] lg:h-[500px] flex flex-col items-center justify-center my-2 sm:my-4 lg:my-0"
          style={{ perspective: "1000px" }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={slide.id + "-product"}
              variants={productVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, { offset }) => {
                if (offset.x < -50) next();
                else if (offset.x > 50) prev();
              }}
              className="absolute z-20 w-[95%] sm:w-[85%] lg:w-[105%] max-w-[520px] aspect-[16/10] cursor-grab active:cursor-grabbing flex items-center justify-center"
            >
              {/* Floating animation */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                <Image
                  src={slide.image}
                  alt={`${slide.title1} ${slide.title2}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 95vw, 50vw"
                  className="object-contain select-none"
                  style={{
                    filter: "drop-shadow(0px 30px 20px rgba(0,0,0,0.18))",
                  }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Stone Pedestal */}
          <div className="absolute bottom-[0%] sm:bottom-[4%] lg:bottom-[8%] z-10 pointer-events-none flex flex-col items-center">
            <div
              className="w-[200px] sm:w-[280px] lg:w-[380px] h-[30px] sm:h-[40px] lg:h-[52px] rounded-[100%]"
              style={{
                background: "linear-gradient(180deg, #E8E4DC 0%, #D4CFC5 100%)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
              }}
            />
            <div
              className="w-[170px] sm:w-[240px] lg:w-[320px] h-[12px] sm:h-[18px] lg:h-[26px] -mt-1"
              style={{ background: "linear-gradient(180deg, #D4CFC5 0%, #C4BFB4 100%)" }}
            />
            <div
              className="w-[190px] sm:w-[265px] lg:w-[350px] h-[10px] sm:h-[15px] lg:h-[20px] rounded-[100%]"
              style={{
                background: "linear-gradient(180deg, #C4BFB4 0%, #B8B3A8 100%)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.16)",
              }}
            />
          </div>
        </div>

        {/* ═══ MOBILE BOTTOM PRICE & CTAS ═══ */}
        <div className="lg:hidden flex flex-col w-full space-y-4 pt-2 z-20">
          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-neutral-900">{slide.price}</span>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <Link
              href={slide.shopHref}
              className={`flex items-center justify-center px-4 py-3.5 rounded-md font-extrabold text-[11px] tracking-wider uppercase transition-all shadow-md active:scale-95 ${slide.btnClass}`}
            >
              Shop Now →
            </Link>
            <Link
              href={slide.detailHref}
              className="flex items-center justify-center px-4 py-3.5 rounded-md border border-neutral-400 text-neutral-900 font-extrabold text-[11px] tracking-wider uppercase hover:bg-neutral-900 hover:text-white transition-all active:scale-95 bg-white/40 backdrop-blur-sm"
            >
              View Details
            </Link>
          </div>
        </div>

      </div>

      {/* ── Slide Controls Footer ── */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pt-6 z-30">
        {/* Counter + Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-xl font-black text-neutral-900">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="text-xs sm:text-sm text-neutral-400 font-bold">
              / {String(count).padStart(2, "0")}
            </span>
          </div>
          <div className="w-20 sm:w-36 lg:w-56 h-[3px] bg-neutral-300 rounded-full overflow-hidden relative">
            <motion.div
              key={`progress-${idx}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute inset-y-0 left-0 bg-[#B3D334] rounded-full"
            />
          </div>
        </div>

        {/* Prev & Next Pill Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-100 transition-colors shadow-sm focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[#B3D334] text-white hover:bg-[#a2c02f] transition-colors shadow-sm focus:outline-none"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
