import { create } from "zustand";
import { Product, FilterState, SortOption } from "@/types/product";

interface ProductStore {
  // State
  products: Product[];
  filters: FilterState;
  sortOption: SortOption;
  
  // Actions
  setProducts: (products: Product[]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setSortOption: (sort: SortOption) => void;
  
  // Helpers
  getFilteredProducts: () => Product[];
  getUniqueSizes: () => string[];
  getUniqueColors: () => string[];
}

const defaultFilters: FilterState = {
  category: "All",
  priceRange: [0, 5000],
  size: "All",
  color: "All",
  searchQuery: "",
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  filters: defaultFilters,
  sortOption: "featured",

  setProducts: (products) => {
    set({ products });
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  setSortOption: (sortOption) => {
    set({ sortOption });
  },

  getFilteredProducts: () => {
    const { products, filters, sortOption } = get();
    
    const result = products.filter((product) => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesId = product.id.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesId && !matchesCategory) {
          return false;
        }
      }

      if (filters.category !== "All" && product.category !== filters.category) {
        return false;
      }

      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      if (filters.size !== "All" && !product.sizes.includes(filters.size)) {
        return false;
      }

      if (filters.color !== "All") {
        const matchesColor = product.colors.some(
          (c) => c.toLowerCase() === filters.color.toLowerCase()
        );
        if (!matchesColor) return false;
      }

      return true;
    });

    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    return result;
  },

  getUniqueSizes: () => {
    const { products } = get();
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
  },

  getUniqueColors: () => {
    const { products } = get();
    const colorsSet = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => colorsSet.add(c.trim())));
    return Array.from(colorsSet).sort();
  },
}));
