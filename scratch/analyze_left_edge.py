import cv2
import numpy as np
from pathlib import Path

workspace_dir = Path(r"c:\Users\VARUN\OneDrive\Desktop\PriyaFootWear")
img_path = workspace_dir / "public" / "images" / "products" / "leefox-699-leefox-chappal-4.png"

img = cv2.imread(str(img_path))
if img is None:
    print("Error: Could not read image.")
    exit(1)

h, w, c = img.shape
print(f"Image dimensions: {w}x{h}")

print("Analyzing left edge transitions (x from 220 to 320, y from 550 to 800)...")
for y in range(550, 800, 30):
    row_str = f"y={y}: "
    for x in range(220, 320, 10):
        b, g, r = img[y, x]
        # shoe leather is very dark, usually R < 50, G < 40, B < 30
        is_dark_leather = r < 55 and g < 45 and b < 35
        label = "SHOE" if is_dark_leather else "WOOD"
        row_str += f"x={x}({r},{g},{b}:{label}) "
    print(row_str)
    print("-" * 50)
