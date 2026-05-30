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

# Clean spatially:
# For different y heights, set alpha to 0 for x coordinates outside the shoe silhouette.
for y in range(h):
    for x in range(w):
        # Determine left and right boundaries for the shoe at height y
        # The shoe is centered around x = 384 (midpoint of 768)
        
        # Heel area (bottom of the image)
        if y > 950:
            left_bound = 300
            right_bound = 470
        elif y > 750:
            left_bound = 290
            right_bound = 480
        # Arch / Midfoot area
        elif y > 500:
            left_bound = 270
            right_bound = 510
        # Upper strap area (widest part)
        elif y > 250:
            left_bound = 230
            right_bound = 540
        # Toe area (top)
        else:
            left_bound = 250
            right_bound = 525
            
        if x < left_bound or x > right_bound:
            img[y, x, 3] = 0
            img[y, x, 0] = 0
            img[y, x, 1] = 0
            img[y, x, 2] = 0

# Apply morphological smoothing on the alpha channel to make the edges clean
alpha = img[:, :, 3]
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel)
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
img[:, :, 3] = alpha

cv2.imwrite(str(rgba_path), img)
print("Spatial crop complete.")
