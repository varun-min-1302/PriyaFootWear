"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, Wind, Droplet, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/product";

interface HeroProps {
  products?: Product[];
}

// Fallback slides in case DB has no products yet
const fallbackSlides = [
  {
    id: "fb1",
    badge: "NEW ARRIVAL",
    title1: "Classic Clog",
    title2: "Comfort",
    title2Color: "text-[#B3D334]",
    desc: "Iconic comfort for everyday adventures. Lightweight. Durable. Always fun.",
    features: [
      { icon: Feather, label: "Lightweight", sub: "All-Day Comfort" },
      { icon: Wind, label: "Ventilated", sub: "Better Breathability" },
      { icon: Droplet, label: "Water Friendly", sub: "Quick Dry" },
    ],
    price: "₹2,499",
    image: "/images/products/leefox-699-leefox-chappal-transparent.png",
    bgClass: "bg-[#F3F4ED]",
    circleClass: "bg-[#E6E8D6]",
    buttonColor: "bg-[#B3D334] text-white hover:bg-[#a2c02f]",
    slug: "classic-clog"
  }
];

export default function Hero({ products = [] }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto loop every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(1, products.length || fallbackSlides.length));
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  const hasProducts = products && products.length > 0;
  const slideCount = hasProducts ? products.length : fallbackSlides.length;
  
  // Safe bounded index
  const safeIndex = currentSlide % Math.max(1, slideCount);

  // Compute slide data dynamically from Product if available
  const getSlideData = (index: number) => {
    if (!hasProducts) return fallbackSlides[0];
    
    const prod = products[index];
    const configs = [
      {
        badge: "FEATURED",
        title2Color: "text-[#B3D334]",
        bgClass: "bg-[#F3F4ED]",
        circleClass: "bg-[#E6E8D6]",
        buttonColor: "bg-[#B3D334] text-white hover:bg-[#a2c02f]",
      },
      {
        badge: "NEW ARRIVAL",
        title2Color: "text-neutral-900",
        bgClass: "bg-[#EAE4DD]",
        circleClass: "bg-[#D8D0C5]",
        buttonColor: "bg-neutral-900 text-white hover:bg-neutral-800",
      },
      {
        badge: "TRENDING",
        title2Color: "text-[#C73838]",
        bgClass: "bg-[#F7F4EA]",
        circleClass: "bg-[#EAE4CA]",
        buttonColor: "bg-[#B3D334] text-white hover:bg-[#a2c02f]",
      }
    ];
    
    const config = configs[index % configs.length];
    
    // Split product name into two lines for visual appeal
    const nameWords = prod.name.split(" ");
    const title1 = nameWords.slice(0, Math.ceil(nameWords.length / 2)).join(" ");
    const title2 = nameWords.slice(Math.ceil(nameWords.length / 2)).join(" ");
    
    return {
      id: prod.id,
      badge: config.badge,
      title1: title1 || prod.name,
      title2: title2,
      title2Color: config.title2Color,
      desc: prod.description.substring(0, 100) + (prod.description.length > 100 ? "..." : ""),
      features: [
        { icon: Feather, label: "Premium", sub: "Quality Build" },
        { icon: ShieldCheck, label: "Durable", sub: "Long Lasting" },
        { icon: Droplet, label: "Comfort", sub: "All-Day Wear" },
      ],
      price: `₹${prod.price.toLocaleString("en-IN")}`,
      image: prod.images && prod.images.length > 0 ? prod.images[0] : "/images/products/leefox-699-leefox-chappal-transparent.png",
      bgClass: config.bgClass,
      circleClass: config.circleClass,
      buttonColor: config.buttonColor,
      slug: prod.slug
    };
  };

  const slide = getSlideData(safeIndex);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  return (
    <section className={`relative min-h-[90vh] w-full flex items-center overflow-hidden transition-colors duration-700 ${slide.bgClass} pt-28 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24`}>
      
      {/* Huge Background Circle */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slide.id + "-circle"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`absolute top-1/2 right-[-10%] sm:right-[5%] lg:right-[15%] -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full ${slide.circleClass}`}
        />
      </AnimatePresence>

      {/* Dot Pattern Overlay */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute bottom-1/4 left-1/4 w-32 h-32 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Column: Text & Features */}
        <div className="flex flex-col space-y-6 lg:space-y-8 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-text"}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Badge */}
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#B3D334] text-neutral-900 text-xs font-bold tracking-wider">
                {slide.badge}
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-7xl lg:text-[5rem] font-sans font-black leading-[1.05] tracking-tight text-neutral-900">
                <span className="block">{slide.title1}</span>
                {slide.title2 && <span className={`block ${slide.title2Color}`}>{slide.title2}</span>}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-neutral-600 max-w-md leading-relaxed font-medium">
                {slide.desc}
              </p>

              {/* Features Icons */}
              <div className="flex items-start gap-6 sm:gap-8 pt-2">
                {slide.features.map((feat, idx) => (
                  <div key={idx} className="flex flex-col space-y-2">
                    <div className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                      <feat.icon className="w-5 h-5 text-neutral-700" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-[11px] sm:text-xs font-bold text-neutral-900">{feat.label}</h4>
                      {feat.sub && <p className="text-[9px] sm:text-[10px] text-neutral-500">{feat.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price & Action */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-neutral-900">{slide.price}</span>
                  <span className="px-2 py-1 bg-[#F5DF4D] text-neutral-900 text-[10px] font-bold uppercase tracking-wider rounded">Free Shipping</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href={`/products/${slide.slug}`}
                  className={`text-center px-8 py-3.5 rounded-md font-bold text-sm tracking-wider uppercase transition-colors shadow-lg ${slide.buttonColor}`}
                >
                  Shop Now →
                </Link>
                <Link
                  href={`/products/${slide.slug}`}
                  className="text-center px-8 py-3.5 rounded-md border border-neutral-400 text-neutral-900 font-bold text-sm tracking-wider uppercase hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Floating Product & Pedestal */}
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center z-10 pointer-events-none mt-10 lg:mt-0">
          <AnimatePresence mode="popLayout">
            {/* The Shoe */}
            <motion.div
              key={slide.id + "-image"}
              initial={{ opacity: 0, y: -50, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: 50, rotate: 5 }}
              transition={{ type: "spring", damping: 20, stiffness: 100, duration: 0.8 }}
              className="absolute z-20 w-[110%] sm:w-[90%] lg:w-[100%] max-w-[600px] aspect-[4/3]"
            >
              <Image
                src={slide.image}
                alt={slide.title1}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>

          {/* Pedestal Base */}
          <div className="absolute bottom-[-5%] lg:bottom-[10%] w-[220px] sm:w-[350px] lg:w-[450px] h-[50px] sm:h-[70px] bg-[#E5E2DA] rounded-[100%] shadow-[0_20px_30px_rgba(0,0,0,0.1)] border-b-[15px] border-[#D4D0C8] z-10" />
        </div>

      </div>

      {/* Bottom Navigation & Progress */}
      <div className="absolute bottom-6 left-4 sm:left-6 lg:left-12 xl:left-24 right-4 sm:right-6 lg:right-12 xl:right-24 flex items-center justify-between z-30">
        
        {/* Progress Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-1 font-bold text-neutral-900">
            <span className="text-xl">0{currentSlide + 1}</span>
            <span className="text-sm text-neutral-400">/ 0{slideCount}</span>
          </div>
          <div className="w-24 sm:w-64 h-1 bg-neutral-300 rounded-full overflow-hidden relative">
            <motion.div
              key={currentSlide + "-progress"}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute top-0 left-0 h-full bg-[#B3D334]"
            />
          </div>
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handlePrev}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-100 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[#B3D334] text-white hover:bg-[#a2c02f] transition-colors shadow-sm"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

    </section>
  );
}
