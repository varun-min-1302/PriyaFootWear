"use client";

import { useState, useEffect, useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";
import { X, SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const products = useProductStore((state) => state.products);
  const filters = useProductStore((state) => state.filters);
  const setFilters = useProductStore((state) => state.setFilters);
  const resetFilters = useProductStore((state) => state.resetFilters);

  const uniqueSizes = useMemo(() => {
    const sizesSet = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => sizesSet.add(s)));
    return Array.from(sizesSet).sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }, [products]);

  const uniqueColors = useMemo(() => {
    const colorsSet = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => colorsSet.add(c.trim())));
    return Array.from(colorsSet).sort();
  }, [products]);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const categories = ["All", "Formal", "Casual", "Sports", "Sandals", "Slippers", "Belts"];
  
  const priceBrackets = [
    { label: "All Prices", range: [0, 5000] },
    { label: "Under ₹400", range: [0, 400] },
    { label: "₹400 - ₹600", range: [400, 600] },
    { label: "₹600 - ₹800", range: [600, 800] },
    { label: "Over ₹800", range: [800, 5000] },
  ];

  return (
    <div className="lg:hidden">
      {/* Trigger Button */}
      <button
        suppressHydrationWarning
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border/80 dark:border-border/20 bg-card text-foreground font-semibold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-sm w-full"
      >
        <SlidersHorizontal className="h-4 w-4 text-accent" />
        Filter & Sort
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />

            {/* Sliding Bottom Drawer Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-card rounded-t-3xl border-t border-border/40 shadow-2xl flex flex-col"
            >
              {/* Handlebar indicator */}
              <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-800 rounded-full mx-auto my-3 shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-accent" />
                  <h3 className="font-display font-black text-lg uppercase tracking-wide">
                    Filter Options
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full bg-muted/60 text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-grow overflow-y-auto px-6 py-6 space-y-8 pb-32">
                {/* 1. Category */}
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">
                    Category
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const isSelected = filters.category === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setFilters({ category: cat })}
                          className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                            isSelected
                              ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white font-bold"
                              : "border-border/80 dark:border-border/20 text-muted-foreground"
                          }`}
                        >
                          {cat === "All" ? "All Footwear" : cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Price Bracket */}
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">
                    Price Range
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {priceBrackets.map((bracket) => {
                      const isSelected =
                        filters.priceRange[0] === bracket.range[0] &&
                        filters.priceRange[1] === bracket.range[1];
                      return (
                        <button
                          key={bracket.label}
                          onClick={() => setFilters({ priceRange: bracket.range as [number, number] })}
                          className={`py-3 px-4 rounded-xl text-xs font-semibold border transition-all duration-200 text-center ${
                            isSelected
                              ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white font-bold"
                              : "border-border/80 dark:border-border/20 text-muted-foreground"
                          }`}
                        >
                          {bracket.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Sizes */}
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">
                    Size (UK)
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => setFilters({ size: "All" })}
                      className={`h-11 rounded-xl text-xs font-bold border transition-all duration-200 ${
                        filters.size === "All"
                          ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white"
                          : "border-border/80 dark:border-border/20 text-muted-foreground"
                      }`}
                    >
                      All
                    </button>
                    {uniqueSizes.map((size) => {
                      const isSelected = filters.size === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setFilters({ size: isSelected ? "All" : size })}
                          className={`h-11 rounded-xl text-xs font-bold border transition-all duration-200 ${
                            isSelected
                              ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white"
                              : "border-border/80 dark:border-border/20 text-muted-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Colors */}
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold block">
                    Color
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilters({ color: "All" })}
                      className={`px-4 py-2.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                        filters.color === "All"
                          ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white"
                          : "border-border/80 dark:border-border/20 text-muted-foreground"
                      }`}
                    >
                      All
                    </button>
                    {uniqueColors.map((color) => {
                      const isSelected = filters.color === color;
                      return (
                        <button
                          key={color}
                          onClick={() => setFilters({ color: isSelected ? "All" : color })}
                          className={`px-4 py-2.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                            isSelected
                              ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white"
                              : "border-border/80 dark:border-border/20 text-muted-foreground"
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Buttons */}
              <div className="absolute bottom-0 inset-x-0 p-6 border-t border-border/40 bg-card/95 backdrop-blur-md flex gap-4">
                <button
                  onClick={() => {
                    resetFilters();
                  }}
                  className="flex-1 py-4 rounded-xl border border-border/80 dark:border-border/20 font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-4 rounded-xl bg-accent text-accent-foreground font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-accent/20 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
