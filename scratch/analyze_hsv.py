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
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

print("Analyzing pixel values at the bottom section of the shoe (y between 800 and 1200)...")

# Let's sample a grid of pixels at the bottom
# x between 250 and 500, y between 800 and 1200
for y in range(800, 1200, 40):
    row_str = f"y={y}: "
    for x in range(250, 500, 30):
        b, g, r = img[y, x]
        h_val, s_val, v_val = hsv[y, x]
        # Label based on color
        # Sandal is very dark (v_val < 80)
        # Wood is bright tan/brown (v_val > 90, s_val > 50, h_val between 10 and 25)
        color_label = "SHOE" if v_val < 90 else "WOOD"
        row_str += f"x={x}({r},{g},{b}|H={h_val},S={s_val},V={v_val}:{color_label})  "
    print(row_str)
    print("-" * 50)
