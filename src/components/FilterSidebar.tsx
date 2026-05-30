"use client";

import { useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";
import { X, RotateCcw } from "lucide-react";

export default function FilterSidebar() {
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

  const categories = ["All", "Formal", "Casual", "Sports", "Sandals", "Slippers", "Belts"];
  
  const priceBrackets = [
    { label: "All Prices", range: [0, 5000] },
    { label: "Under ₹400", range: [0, 400] },
    { label: "₹400 - ₹600", range: [400, 600] },
    { label: "₹600 - ₹800", range: [600, 800] },
    { label: "Over ₹800", range: [800, 5000] },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block space-y-8 sticky top-24 h-[fit-content] pb-8 pr-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <h3 className="font-display font-bold text-base uppercase tracking-wider text-foreground">
          Filters
        </h3>
        <button
          suppressHydrationWarning
          onClick={resetFilters}
          className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-accent uppercase tracking-wider transition-colors duration-200"
        >
          <RotateCcw className="h-3 w-3" />
          Reset All
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-3.5">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
          Category
        </span>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                suppressHydrationWarning
                key={cat}
                onClick={() => setFilters({ category: cat })}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background font-bold shadow-md shadow-foreground/5 dark:bg-white dark:text-black"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {cat === "All" ? "All Footwear" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Bracket Filter */}
      <div className="space-y-3.5">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
          Price Range
        </span>
        <div className="flex flex-col gap-1.5">
          {priceBrackets.map((bracket) => {
            const isSelected =
              filters.priceRange[0] === bracket.range[0] &&
              filters.priceRange[1] === bracket.range[1];
            return (
              <button
                suppressHydrationWarning
                key={bracket.label}
                onClick={() => setFilters({ priceRange: bracket.range as [number, number] })}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  isSelected
                    ? "text-accent font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {bracket.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sizes Filter */}
      <div className="space-y-3.5">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
          Size (UK)
        </span>
        <div className="grid grid-cols-4 gap-2">
          {/* "All" button */}
          <button
            suppressHydrationWarning
            onClick={() => setFilters({ size: "All" })}
            className={`h-9 rounded-md text-xs font-bold border transition-all duration-200 cursor-pointer ${
              filters.size === "All"
                ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white shadow-sm"
                : "border-border/80 dark:border-border/20 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            All
          </button>
          {/* Dynamic Sizes */}
          {uniqueSizes.map((size) => {
            const isSelected = filters.size === size;
            return (
              <button
                suppressHydrationWarning
                key={size}
                onClick={() => setFilters({ size: isSelected ? "All" : size })}
                className={`h-9 rounded-md text-xs font-bold border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white shadow-sm"
                    : "border-border/80 dark:border-border/20 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Colors Filter */}
      <div className="space-y-3.5">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
          Color
        </span>
        <div className="flex flex-wrap gap-2">
          {/* "All" Badge */}
          <button
            suppressHydrationWarning
            onClick={() => setFilters({ color: "All" })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer ${
              filters.color === "All"
                ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white"
                : "border-border/80 dark:border-border/20 text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {/* Dynamic Colors */}
          {uniqueColors.map((color) => {
            const isSelected = filters.color === color;
            return (
              <button
                suppressHydrationWarning
                key={color}
                onClick={() => setFilters({ color: isSelected ? "All" : color })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background border-foreground dark:bg-white dark:text-black dark:border-white"
                    : "border-border/80 dark:border-border/20 text-muted-foreground hover:text-foreground"
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
