import os
from pathlib import Path

workspace_dir = Path(r"c:\Users\VARUN\OneDrive\Desktop\PriyaFootWear")
seed_file = workspace_dir / "src" / "data" / "seedProducts.ts"
store_file = workspace_dir / "src" / "store" / "useProductStore.ts"

new_products_code = """
  // ==========================================
  // NEW ARRIVALS (ADDED FROM LOCAL DIRECTORY)
  // ==========================================
  {
    id: "PFW-014",
    name: "Aerowalk Comfort Cross-Strap Slippers",
    slug: "aerowalk-599-aerowalk",
    description: "Step out in comfort with these premium cross-strap slippers from Aerowalk. Built with a thick cushioned polyurethane (PU) sole that absorbs shocks, and a soft synthetic leather upper that ensures an ergonomic fit. Perfect for daily house wear and outdoor walks.",
    price: 599,
    category: "Slippers",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Brown"],
    images: [
      "/images/products/aerowalk-599-aerowalk-1.png",
      "/images/products/aerowalk-599-aerowalk-2.png",
      "/images/products/aerowalk-599-aerowalk-3.png",
      "/images/products/aerowalk-599-aerowalk-4.png"
    ],
    material: "PU Sole, Synthetic Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-015",
    name: "Airgold Premium Buckle Toe-Loop Sandal - Brown",
    slug: "airgold-429-airgold",
    description: "Elevate your look with the Airgold Buckle Toe-Loop Sandals in classic brown. Designed with cross-over synthetic straps, a secure toe loop, and an adjustable bronze buckle. The contoured soft footbed offers excellent arch support for all-day comfort.",
    price: 429,
    category: "Sandals",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Brown"],
    images: [
      "/images/products/airgold-429-airgold-1.png",
      "/images/products/airgold-429-airgold-2.png",
      "/images/products/airgold-429-airgold-3.png",
      "/images/products/airgold-429-airgold-4.png"
    ],
    material: "Cushioned Rubber Sole, Synthetic Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-016",
    name: "Airgold Premium Buckle Toe-Loop Sandal - Black",
    slug: "airgold-449-airgold",
    description: "Elevate your look with the Airgold Buckle Toe-Loop Sandals in sleek black. Featuring a cross-over strap layout, a secure toe loop, and a classic bronze buckle. Styled with a cushioned black sole that provides premium comfort and durability.",
    price: 449,
    category: "Sandals",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Black"],
    images: [
      "/images/products/airgold-449-airgold-1.png",
      "/images/products/airgold-449-airgold-2.png",
      "/images/products/airgold-449-airgold-3.png",
      "/images/products/airgold-449-airgold-4.png"
    ],
    material: "Cushioned Rubber Sole, Synthetic Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-017",
    name: "Catwog Diagonal Cross-Strap Leather Slide - Black",
    slug: "catwog-649-chappal",
    description: "Experience sleek luxury with the Catwog Diagonal Cross-Strap Slides in black. Made with double-stitched leather panels and a circular metallic emblem. Features a cushioned stitched footbed that conforms to your feet, offering all-day comfort.",
    price: 649,
    category: "Slippers",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Black"],
    images: [
      "/images/products/catwog-649-chappal-1.png",
      "/images/products/catwog-649-chappal-2.png",
      "/images/products/catwog-649-chappal-3.png",
      "/images/products/catwog-649-chappal-4.png"
    ],
    material: "PU Sole, Cushioned Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-018",
    name: "Catwog Diagonal Cross-Strap Leather Slide - Tan",
    slug: "catwog-649-chappal1",
    description: "Experience sleek luxury with the Catwog Diagonal Cross-Strap Slides in tan brown. Crafted with double-stitched leather panels and a circular metallic detail. Includes a stitched cushioned footbed for a supportive, relaxed stride.",
    price: 649,
    category: "Slippers",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Tan", "Brown"],
    images: [
      "/images/products/catwog-649-chappal1-1.png",
      "/images/products/catwog-649-chappal1-2.png",
      "/images/products/catwog-649-chappal1-3.png",
      "/images/products/catwog-649-chappal1-4.png"
    ],
    material: "PU Sole, Cushioned Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-019",
    name: "Cattica by Catwog Full-Cover Toe-Ring Sandal",
    slug: "catwog-699-full-cover-chappal",
    description: "A premium leather full-cover sandal under the Cattica line by Catwog. Featuring a broad leather upper covering the midfoot with a secure toe loop, a soft leather footbed, and double-stitched edges. Perfect for festive, ethnic, or daily casual wear.",
    price: 699,
    category: "Sandals",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Tan", "Brown"],
    images: [
      "/images/products/catwog-699-full-cover-chappal-1.png",
      "/images/products/catwog-699-full-cover-chappal-2.png",
      "/images/products/catwog-699-full-cover-chappal-3.png",
      "/images/products/catwog-699-full-cover-chappal-4.png"
    ],
    material: "PU Sole, Genuine Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-020",
    name: "Catwog Premium Fisherman Roman Sandal",
    slug: "catwog-699-sandal",
    description: "Step up your semi-formal style with the Catwog Fisherman Roman Sandals. Made with sleek black leather featuring cross-weave cutouts, a semi-closed toe box, and an adjustable side buckle strap. Built on a durable sole with a soft inner lining.",
    price: 699,
    category: "Sandals",
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Black"],
    images: [
      "/images/products/catwog-699-sandal-1.jpeg",
      "/images/products/catwog-699-sandal-2.jpeg",
      "/images/products/catwog-699-sandal-3.jpeg",
      "/images/products/catwog-699-sandal-4.jpeg"
    ],
    material: "PU Sole, Synthetic Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-021",
    name: "Leefox Comfort Toe-Loop Cross-Strap Slide",
    slug: "leefox-699-leefox-chappal",
    description: "The Leefox Comfort Toe-Loop Slide features a unique cross-strap design with detailed texture, a comfortable toe loop, and a classic side buckle. Designed with a contoured soft footbed featuring the Leefox diamond logo for maximum foot support.",
    price: 699,
    category: "Slippers",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Brown"],
    images: [
      "/images/products/leefox-699-leefox-chappal-1.png",
      "/images/products/leefox-699-leefox-chappal-2.png",
      "/images/products/leefox-699-leefox-chappal-3.png",
      "/images/products/leefox-699-leefox-chappal-4.png"
    ],
    material: "PU Sole, Textured Synthetic Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-022",
    name: "Leefox Perforated Full-Cover Slide - Chocolate",
    slug: "leefox-699-leefox-chappal-full-cover-chocolate",
    description: "This premium full-cover slipper from Leefox features a broad, perforated chocolate brown leather upper for breathability and style. Features an adjustable side buckle strap, cushioned footbed, and a heavy-duty sole for robust comfort.",
    price: 699,
    category: "Slippers",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Chocolate Brown"],
    images: [
      "/images/products/leefox-699-leefox-chappal-full-cover-chocolate-1.jpeg",
      "/images/products/leefox-699-leefox-chappal-full-cover-chocolate-2.jpeg",
      "/images/products/leefox-699-leefox-chappal-full-cover-chocolate-3.jpeg",
      "/images/products/leefox-699-leefox-chappal-full-cover-chocolate-4.jpeg"
    ],
    material: "PU Sole, Perforated Synthetic Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-023",
    name: "Lee Cooper Perforated Full-Cover Slide - Tan",
    slug: "leefox-699-leefox-chappal-full-cover-tan-chococ",
    description: "A premium full-cover slide slipper from Lee Cooper. Constructed with a broad, perforated tan brown upper, side buckle detailing, and a soft chocolate brown cushioned footbed. Provides unmatched durability and a sophisticated look.",
    price: 699,
    category: "Slippers",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Tan Brown"],
    images: [
      "/images/products/leefox-699-leefox-chappal-full-cover-tan-chococ-1.jpeg",
      "/images/products/leefox-699-leefox-chappal-full-cover-tan-chococ-2.jpeg",
      "/images/products/leefox-699-leefox-chappal-full-cover-tan-chococ-3.jpeg",
      "/images/products/leefox-699-leefox-chappal-full-cover-tan-chococ-4.jpeg"
    ],
    material: "PU Sole, Perforated Synthetic Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-024",
    name: "PCW Cushioned Thong Slipper - Black",
    slug: "pcw-289-pcw-black",
    description: "Stay relaxed with the PCW Cushioned Thong Slippers. Features a broad, black thong strap with a central metal stud and side buckle adjustment. Built with a textured, slip-resistant black footbed that provides everyday ease and grip.",
    price: 289,
    category: "Slippers",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Black"],
    images: [
      "/images/products/pcw-289-pcw-black-1.png",
      "/images/products/pcw-289-pcw-black-2.png",
      "/images/products/pcw-289-pcw-black-3.png",
      "/images/products/pcw-289-pcw-black-4.png"
    ],
    material: "EVA Midsole, Synthetic Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-025",
    name: "PCW Cushioned Thong Slipper - Navy",
    slug: "pcw-289-pcw-t",
    description: "Stay relaxed with the PCW Cushioned Thong Slippers. Crafted with a broad, navy blue thong strap, central rivet, and side buckle. Set on a soft grey footbed with a flexible sole for indoor and casual outdoor wear.",
    price: 289,
    category: "Slippers",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Navy Blue"],
    images: [
      "/images/products/pcw-289-pcw-t-1.png",
      "/images/products/pcw-289-pcw-t-2.png",
      "/images/products/pcw-289-pcw-t-3.png",
      "/images/products/pcw-289-pcw-t-4.png"
    ],
    material: "EVA Midsole, Synthetic Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-026",
    name: "PCW Premium Broad-Strap Thong Sandal",
    slug: "pcw-379-pcw",
    description: "Designed for premium style and durability, the PCW Broad-Strap Thong Sandals feature black leather straps with an adjustable side buckle and contrast tan edge lining on the sole. The anti-slip sole offers great traction.",
    price: 379,
    category: "Sandals",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Black"],
    images: [
      "/images/products/pcw-379-pcw-1.png",
      "/images/products/pcw-379-pcw-2.png",
      "/images/products/pcw-379-pcw-3.png"
    ],
    material: "PU Sole, Synthetic Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-027",
    name: "PCW+ Cushioned Toe-Ring Slide Sandal",
    slug: "pcw-429-pcw",
    description: "Experience the ultimate in grip and styling with the PCW+ Toe-Ring Slide Sandals. Designed with cross-over black leather straps, a secure toe ring, and a functional side buckle. Includes a textured contoured footbed for arch support.",
    price: 429,
    category: "Sandals",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Black"],
    images: [
      "/images/products/pcw-429-pcw-1.png",
      "/images/products/pcw-429-pcw-2.png",
      "/images/products/pcw-429-pcw-3.png",
      "/images/products/pcw-429-pcw-4.png"
    ],
    material: "Cushioned PU Sole, Synthetic Leather Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  },
  {
    id: "PFW-028",
    name: "Winger Comfort Dual-Strap Slide",
    slug: "winger-479-winger",
    description: "A classic look that never goes out of style. The Winger Comfort Dual-Strap Slides feature two broad black straps with matching metallic buckles. Equipped with a contoured soft black footbed that shapes to your feet for maximum support.",
    price: 479,
    category: "Slippers",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Black"],
    images: [
      "/images/products/winger-479-winger-1.png",
      "/images/products/winger-479-winger-2.png",
      "/images/products/winger-479-winger-3.png",
      "/images/products/winger-479-winger-4.png"
    ],
    material: "PU Sole, Synthetic Upper",
    featured: false,
    newArrival: true,
    createdAt: new Date("2026-05-29").toISOString()
  }
"""

# 1. Modify seedProducts.ts
with open(seed_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Locate the end of the array (last closing brace and brackets before export ends)
# Our array ends like:
#   }
# ];
# We will insert our new items before the ];

target = "  }\n];"
if target in content:
    replacement = "  },\n" + new_products_code + "];"
    content = content.replace(target, replacement)
    print("Successfully found array end and injected new products.")
else:
    # try another variation of whitespace
    target2 = "  }\n\n];"
    if target2 in content:
        replacement = "  },\n" + new_products_code + "];"
        content = content.replace(target2, replacement)
        print("Successfully found array end and injected new products (alt).")
    else:
        print("Error: Could not locate end of seedProducts array.")

with open(seed_file, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Modify useProductStore.ts (bump store cache key to v4)
with open(store_file, 'r', encoding='utf-8') as f:
    store_content = f.read()

if "pfw-products-exclusive-v3" in store_content:
    store_content = store_content.replace("pfw-products-exclusive-v3", "pfw-products-exclusive-v4")
    print("Successfully bumped localStorage cache key to pfw-products-exclusive-v4.")
else:
    print("Could not find pfw-products-exclusive-v3 in useProductStore.ts.")

with open(store_file, 'w', encoding='utf-8') as f:
    f.write(store_content)

print("Insertion process complete.")
