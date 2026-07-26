"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProductStore } from "@/store/useProductStore";
import FilterSidebar from "@/components/FilterSidebar";
import FilterDrawer from "@/components/FilterDrawer";
import ProductCard from "@/components/ProductCard";
import { Search, RotateCcw, LayoutGrid } from "lucide-react";
import { SortOption, Product } from "@/types/product";

interface CatalogContentProps {
  initialProducts: Product[];
}

export default function CatalogContent({ initialProducts }: CatalogContentProps) {
  const searchParams = useSearchParams();
  
  // Zustand State
  const setProducts = useProductStore((state) => state.setProducts);
  const products = useProductStore((state) => state.products);
  const filters = useProductStore((state) => state.filters);
  const setFilters = useProductStore((state) => state.setFilters);
  const resetFilters = useProductStore((state) => state.resetFilters);
  const sortOption = useProductStore((state) => state.sortOption);
  const setSortOption = useProductStore((state) => state.setSortOption);
  const getFilteredProducts = useProductStore((state) => state.getFilteredProducts);

  // Initialize store with SSR products and check for URL category parameters
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts, setProducts]);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilters({ category: categoryParam });
    }
  }, [searchParams, setFilters]);

  // Use the initialProducts if Zustand hasn't mounted/synced yet, otherwise use filtered
  const filteredProducts = products.length > 0 ? getFilteredProducts() : initialProducts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Header */}
      <div className="border-b border-border/40 pb-8 mb-10 space-y-4">
        <h1 className="text-fluid-h2 font-display font-black tracking-tight uppercase">
          Men&apos;s Collection
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed font-sans">
          Browse our premium range of formal wear, casual sneakers, sports running shoes, and comfortable home slides. Every shoe is designed for excellence.
        </p>
      </div>

      {/* Control Bar: Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center pb-6 mb-8 border-b border-border/40">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            suppressHydrationWarning
            type="text"
            placeholder="Search shoes by name, category, size..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="w-full pl-11 pr-4 py-3 bg-card border border-border/50 focus:border-accent focus:ring-1 focus:ring-accent rounded-xl text-sm transition-all outline-none"
          />
        </div>

        {/* Sorting Dropdown & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          {/* Sorting */}
          <div className="relative shrink-0 flex-grow sm:flex-grow-0">
            <select
              suppressHydrationWarning
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full sm:w-48 px-4 py-3 bg-card border border-border/50 focus:border-accent rounded-xl text-xs uppercase font-semibold tracking-wider outline-none cursor-pointer appearance-none"
            >
              <option value="featured">Featured First</option>
              <option value="newest">New Arrivals First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            {/* Custom down arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">▼</div>
          </div>

          {/* Mobile Filter Drawer Toggle */}
          <FilterDrawer />
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Desktop Sidebar */}
        <FilterSidebar />

        {/* Products Catalog list */}
        <div className="flex-grow">
          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold mr-1.5">
              Showing {filteredProducts.length} Products
            </span>
            {filters.category !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted text-foreground text-xs rounded-full border border-border/40 font-medium">
                Category: {filters.category}
              </span>
            )}
            {filters.size !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted text-foreground text-xs rounded-full border border-border/40 font-medium">
                Size: UK {filters.size}
              </span>
            )}
            {filters.color !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted text-foreground text-xs rounded-full border border-border/40 font-medium">
                Color: {filters.color}
              </span>
            )}
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted text-foreground text-xs rounded-full border border-border/40 font-medium">
                Search: &quot;{filters.searchQuery}&quot;
              </span>
            )}
          </div>

          {/* Grid list */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-3xl border border-border/40 p-8 space-y-4">
              <LayoutGrid className="h-12 w-12 text-neutral-300 dark:text-neutral-700" />
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-lg">No Footwear Matches</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  We couldn&apos;t find any shoes that match your search filters. Try resetting the filters or broadening your terms.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-bold text-xs uppercase tracking-wider rounded-xl transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 xl:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
