import os
import shutil
import json
from pathlib import Path
from PIL import Image as PILImage

# Attempt to load pillow_avif
try:
    import pillow_avif
except ImportError:
    pass

workspace_dir = Path(r"c:\Users\VARUN\OneDrive\Desktop\PriyaFootWear")
src_dir = workspace_dir / "FootWear products"
dest_dir = workspace_dir / "public" / "images" / "products"

# Create destination directory
dest_dir.mkdir(parents=True, exist_ok=True)

products_data = []

# Map folders to nice names, descriptions, categories, colors, etc.
# Group styles:
# 1. aerowalk/599_aerowalk -> Aerowalk Comfort Cross-Strap Slippers (Slippers, Brown)
# 2. airgold/429_airgold -> Airgold Premium Buckle Toe-Loop Sandal - Brown (Sandals, Brown)
# 3. airgold/449_airgold -> Airgold Premium Buckle Toe-Loop Sandal - Black (Sandals, Black)
# 4. catwog/649_chappal -> Catwog Diagonal Cross-Strap Leather Slide - Black (Slippers, Black)
# 5. catwog/649_chappal(1) -> Catwog Diagonal Cross-Strap Leather Slide - Tan (Slippers, Tan)
# 6. catwog/699_full_cover_chappal -> Cattica by Catwog Full-Cover Toe-Ring Sandal (Sandals, Tan/Brown)
# 7. catwog/699_sandal -> Catwog Premium Fisherman Roman Sandal (Sandals, Black)
# 8. Leefox/699_leefox_chappal -> Leefox Comfort Toe-Loop Cross-Strap Slide (Slippers, Brown)
# 9. Leefox/699_leefox_chappal_full_cover_chocolate -> Leefox Perforated Full-Cover Slide - Chocolate (Slippers, Chocolate Brown)
# 10. Leefox/699_leefox_chappal_full_cover_tan_chococ -> Lee Cooper Perforated Full-Cover Slide - Tan (Slippers, Tan Brown)
# 11. PCW/289_pcw_black -> PCW Cushioned Thong Slipper - Black (Slippers, Black)
# 12. PCW/289_pcw_T -> PCW Cushioned Thong Slipper - Navy (Slippers, Navy Blue)
# 13. PCW/379_pcw -> PCW Premium Broad-Strap Thong Sandal (Sandals, Black)
# 14. PCW/429_pcw -> PCW+ Cushioned Toe-Ring Slide Sandal (Sandals, Black)
# 15. winger/479_winger -> Winger Comfort Dual-Strap Slide (Slippers, Black)

meta_configs = {
    "aerowalk-599-aerowalk": {
        "name": "Aerowalk Comfort Cross-Strap Slippers",
        "category": "Slippers",
        "colors": ["Brown"],
        "material": "PU Sole, Synthetic Leather Upper",
        "description": "Step out in comfort with these premium cross-strap slippers from Aerowalk. Built with a thick cushioned polyurethane (PU) sole that absorbs shocks, and a soft synthetic leather upper that ensures an ergonomic fit. Perfect for daily house wear and outdoor walks."
    },
    "airgold-429-airgold": {
        "name": "Airgold Premium Buckle Toe-Loop Sandal - Brown",
        "category": "Sandals",
        "colors": ["Brown"],
        "material": "Cushioned Rubber Sole, Synthetic Leather Upper",
        "description": "Elevate your look with the Airgold Buckle Toe-Loop Sandals in classic brown. Designed with cross-over synthetic straps, a secure toe loop, and an adjustable bronze buckle. The contoured soft footbed offers excellent arch support for all-day comfort."
    },
    "airgold-449-airgold": {
        "name": "Airgold Premium Buckle Toe-Loop Sandal - Black",
        "category": "Sandals",
        "colors": ["Black"],
        "material": "Cushioned Rubber Sole, Synthetic Leather Upper",
        "description": "Elevate your look with the Airgold Buckle Toe-Loop Sandals in sleek black. Featuring a cross-over strap layout, a secure toe loop, and a classic bronze buckle. Styled with a cushioned black sole that provides premium comfort and durability."
    },
    "catwog-649-chappal": {
        "name": "Catwog Diagonal Cross-Strap Leather Slide - Black",
        "category": "Slippers",
        "colors": ["Black"],
        "material": "PU Sole, Cushioned Leather Upper",
        "description": "Experience sleek luxury with the Catwog Diagonal Cross-Strap Slides in black. Made with double-stitched leather panels and a circular metallic emblem. Features a cushioned stitched footbed that conforms to your feet, offering all-day comfort."
    },
    "catwog-649-chappal1": {
        "name": "Catwog Diagonal Cross-Strap Leather Slide - Tan",
        "category": "Slippers",
        "colors": ["Tan", "Brown"],
        "material": "PU Sole, Cushioned Leather Upper",
        "description": "Experience sleek luxury with the Catwog Diagonal Cross-Strap Slides in tan brown. Crafted with double-stitched leather panels and a circular metallic detail. Includes a stitched cushioned footbed for a supportive, relaxed stride."
    },
    "catwog-699-full-cover-chappal": {
        "name": "Cattica by Catwog Full-Cover Toe-Ring Sandal",
        "category": "Sandals",
        "colors": ["Tan", "Brown"],
        "material": "PU Sole, Genuine Leather Upper",
        "description": "A premium leather full-cover sandal under the Cattica line by Catwog. Featuring a broad leather upper covering the midfoot with a secure toe loop, a soft leather footbed, and double-stitched edges. Perfect for festive, ethnic, or daily casual wear."
    },
    "catwog-699-sandal": {
        "name": "Catwog Premium Fisherman Roman Sandal",
        "category": "Sandals",
        "colors": ["Black"],
        "material": "PU Sole, Synthetic Leather Upper",
        "description": "Step up your semi-formal style with the Catwog Fisherman Roman Sandals. Made with sleek black leather featuring cross-weave cutouts, a semi-closed toe box, and an adjustable side buckle strap. Built on a durable sole with a soft inner lining."
    },
    "leefox-699-leefox-chappal": {
        "name": "Leefox Comfort Toe-Loop Cross-Strap Slide",
        "category": "Slippers",
        "colors": ["Brown"],
        "material": "PU Sole, Textured Synthetic Leather Upper",
        "description": "The Leefox Comfort Toe-Loop Slide features a unique cross-strap design with detailed texture, a comfortable toe loop, and a classic side buckle. Designed with a contoured soft footbed featuring the Leefox diamond logo for maximum foot support."
    },
    "leefox-699-leefox-chappal-full-cover-chocolate": {
        "name": "Leefox Perforated Full-Cover Slide - Chocolate",
        "category": "Slippers",
        "colors": ["Chocolate Brown"],
        "material": "PU Sole, Perforated Synthetic Leather Upper",
        "description": "This premium full-cover slipper from Leefox features a broad, perforated chocolate brown leather upper for breathability and style. Features an adjustable side buckle strap, cushioned footbed, and a heavy-duty sole for robust comfort."
    },
    "leefox-699-leefox-chappal-full-cover-tan-chococ": {
        "name": "Lee Cooper Perforated Full-Cover Slide - Tan",
        "category": "Slippers",
        "colors": ["Tan Brown"],
        "material": "PU Sole, Perforated Synthetic Leather Upper",
        "description": "A premium full-cover slide slipper from Lee Cooper. Constructed with a broad, perforated tan brown upper, side buckle detailing, and a soft chocolate brown cushioned footbed. Provides unmatched durability and a sophisticated look."
    },
    "pcw-289-pcw-black": {
        "name": "PCW Cushioned Thong Slipper - Black",
        "category": "Slippers",
        "colors": ["Black"],
        "material": "EVA Midsole, Synthetic Leather Upper",
        "description": "Stay relaxed with the PCW Cushioned Thong Slippers. Features a broad, black thong strap with a central metal stud and side buckle adjustment. Built with a textured, slip-resistant black footbed that provides everyday ease and grip."
    },
    "pcw-289-pcw-t": {
        "name": "PCW Cushioned Thong Slipper - Navy",
        "category": "Slippers",
        "colors": ["Navy Blue"],
        "material": "EVA Midsole, Synthetic Leather Upper",
        "description": "Stay relaxed with the PCW Cushioned Thong Slippers. Crafted with a broad, navy blue thong strap, central rivet, and side buckle. Set on a soft grey footbed with a flexible sole for indoor and casual outdoor wear."
    },
    "pcw-379-pcw": {
        "name": "PCW Premium Broad-Strap Thong Sandal",
        "category": "Sandals",
        "colors": ["Black"],
        "material": "PU Sole, Synthetic Leather Upper",
        "description": "Designed for premium style and durability, the PCW Broad-Strap Thong Sandals feature black leather straps with an adjustable side buckle and contrast tan edge lining on the sole. The anti-slip sole offers great traction."
    },
    "pcw-429-pcw": {
        "name": "PCW+ Cushioned Toe-Ring Slide Sandal",
        "category": "Sandals",
        "colors": ["Black"],
        "material": "Cushioned PU Sole, Synthetic Leather Upper",
        "description": "Experience the ultimate in grip and styling with the PCW+ Toe-Ring Slide Sandals. Designed with cross-over black leather straps, a secure toe ring, and a functional side buckle. Includes a textured contoured footbed for arch support."
    },
    "winger-479-winger": {
        "name": "Winger Comfort Dual-Strap Slide",
        "category": "Slippers",
        "colors": ["Black"],
        "material": "PU Sole, Synthetic Upper",
        "description": "A classic look that never goes out of style. The Winger Comfort Dual-Strap Slides feature two broad black straps with matching metallic buckles. Equipped with a contoured soft black footbed that shapes to your feet for maximum support."
    }
}

next_id = 14

for brand_dir in src_dir.iterdir():
    if not brand_dir.is_dir():
        continue
    
    brand_name = brand_dir.name
    
    for prod_dir in brand_dir.iterdir():
        if not prod_dir.is_dir():
            continue
        
        folder_name = prod_dir.name
        
        # Determine slug
        slug = f"{brand_name.lower()}-{folder_name.lower().replace('_', '-')}"
        slug = slug.replace('(', '').replace(')', '')
        
        if slug == "pcw-289-pcw-p":
            # skip empty folder
            continue
            
        parts = folder_name.split('_')
        price_str = parts[0]
        try:
            price = int(price_str.replace('(', '').replace(')', ''))
        except ValueError:
            price = 599
            
        # Collect images
        img_files = []
        for f in prod_dir.iterdir():
            if f.is_file() and f.suffix.lower() in ['.png', '.jpg', '.jpeg', '.webp', '.avif']:
                img_files.append(f)
                
        img_files.sort(key=lambda x: x.name)
        
        copied_images = []
        for idx, img_file in enumerate(img_files):
            # Check if AVIF, convert to png
            if img_file.suffix.lower() == '.avif':
                dest_filename = f"{slug}-{idx+1}.png"
                dest_path = dest_dir / dest_filename
                try:
                    img = PILImage.open(img_file)
                    img.save(dest_path, "PNG")
                    copied_images.append(f"/images/products/{dest_filename}")
                except Exception as e:
                    print(f"Failed to convert {img_file}: {e}")
                    # Fallback to direct copy
                    dest_filename_avif = f"{slug}-{idx+1}.avif"
                    shutil.copy2(img_file, dest_dir / dest_filename_avif)
                    copied_images.append(f"/images/products/{dest_filename_avif}")
            else:
                # Sanitize extension (jpeg/jpg)
                ext = img_file.suffix.lower()
                dest_filename = f"{slug}-{idx+1}{ext}"
                dest_path = dest_dir / dest_filename
                shutil.copy2(img_file, dest_path)
                copied_images.append(f"/images/products/{dest_filename}")
                
        meta = meta_configs.get(slug, {
            "name": f"{brand_name} {folder_name.replace('_', ' ')}",
            "category": "Sandals",
            "colors": ["Black"],
            "material": "PU Sole",
            "description": f"Premium {brand_name} product. Durable, stylish, and comfortable for daily wear."
        })
        
        formatted_id = f"PFW-{next_id:03d}"
        next_id += 1
        
        product_obj = {
            "id": formatted_id,
            "name": meta["name"],
            "slug": slug,
            "description": meta["description"],
            "price": price,
            "category": meta["category"],
            "sizes": ["6", "7", "8", "9", "10", "11"],
            "colors": meta["colors"],
            "images": copied_images,
            "material": meta["material"],
            "featured": False,
            "newArrival": True,
            "createdAt": "NEW_DATE_PLACEHOLDER"
        }
        
        products_data.append(product_obj)

# Output as formatted typescript array block
ts_block = "  // New Arrivals (Local Products)\n"
for p in products_data:
    # Serialize JSON but replace NEW_DATE_PLACEHOLDER with new Date().toISOString()
    p_str = json.dumps(p, indent=4)
    # Adjust spacing and format
    lines = p_str.split('\n')
    formatted_lines = []
    for line in lines:
        if '"createdAt": "NEW_DATE_PLACEHOLDER"' in line:
            formatted_lines.append('    createdAt: new Date("2026-05-29").toISOString()')
        elif '"featured": false' in line:
            formatted_lines.append('    featured: false')
        elif '"newArrival": true' in line:
            formatted_lines.append('    newArrival: true')
        else:
            # remove quotes from keys for standard TS formatting
            # e.g. "id": -> id:
            parts = line.split('": ', 1)
            if len(parts) == 2 and parts[0].strip().startswith('"'):
                key = parts[0].strip()[1:]
                val = parts[1]
                indent = len(line) - len(line.lstrip())
                formatted_lines.append(f"{' ' * indent}{key}: {val}")
            else:
                formatted_lines.append(line)
                
    ts_block += ",\n".join(formatted_lines) + ",\n"

print("TS_BLOCK_START")
print(ts_block)
print("TS_BLOCK_END")
