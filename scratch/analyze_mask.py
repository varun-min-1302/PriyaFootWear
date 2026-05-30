import cv2
import numpy as np
from pathlib import Path

workspace_dir = Path(r"c:\Users\VARUN\OneDrive\Desktop\PriyaFootWear")
rgba_path = workspace_dir / "public" / "images" / "products" / "leefox-699-leefox-chappal-transparent.png"

img = cv2.imread(str(rgba_path), cv2.IMREAD_UNCHANGED)
if img is None:
    print("Error: Could not read transparent image.")
    exit(1)

alpha = img[:, :, 3]
non_zero = cv2.findNonZero(alpha)
if non_zero is None:
    print("Mask is completely transparent!")
    exit(1)

x, y, w, h = cv2.boundingRect(non_zero)
print(f"Non-transparent pixels bounding box: x={x}, y={y}, w={w}, h={h}")
print(f"Total non-transparent pixels: {np.sum(alpha > 0)} / {alpha.size}")
