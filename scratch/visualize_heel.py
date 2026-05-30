import cv2
import numpy as np
from pathlib import Path

workspace_dir = Path(r"c:\Users\VARUN\OneDrive\Desktop\PriyaFootWear")
rgba_path = workspace_dir / "public" / "images" / "products" / "leefox-699-leefox-chappal-transparent.png"

img = cv2.imread(str(rgba_path), cv2.IMREAD_UNCHANGED)
if img is None:
    print("Error: Could not read image.")
    exit(1)

h, w, c = img.shape
alpha = img[:, :, 3]

# Print non-zero pixel counts for y from 1000 onwards
print("Heel contour density (y, width):")
for y in range(1000, h):
    count = np.sum(alpha[y, :] > 0)
    if count > 0:
        xs = np.where(alpha[y, :] > 0)[0]
        min_x = xs[0]
        max_x = xs[-1]
        width = max_x - min_x + 1
        print(f"y={y}: width={width}, count={count}, range=[{min_x}, {max_x}]")
