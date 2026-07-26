export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: "Formal" | "Casual" | "Sports" | "Sandals" | "Slippers" | "Belts";
  sizes: string[]; // e.g., ["6", "7", "8", "9", "10"]
  colors: string[]; // e.g., ["Black", "Brown", "Tan", "White", "Navy", "Gray"]
  images: string[]; // array of image URLs/paths
  featured: boolean;
  newArrival: boolean;
  material?: string; // Optional material details
  createdAt: string; // ISO String
  original_price?: number | null;
  enquiry_count?: number;
  share_count?: number;
  view_count?: number;
  status?: "published" | "draft" | "archived" | "coming_soon";
}

export interface FilterState {
  category: string; // "All" or one of the categories
  priceRange: [number, number]; // [min, max]
  size: string; // "All" or a size string
  color: string; // "All" or a color string
  searchQuery: string;
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";
