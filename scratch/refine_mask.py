import cv2
import numpy as np
from pathlib import Path

workspace_dir = Path(r"c:\Users\VARUN\OneDrive\Desktop\PriyaFootWear")
rgba_path = workspace_dir / "public" / "images" / "products" / "leefox-699-leefox-chappal-transparent.png"

# Load image
img = cv2.imread(str(rgba_path), cv2.IMREAD_UNCHANGED)
if img is None:
    print("Error: Could not read image.")
    exit(1)

h, w, c = img.shape
print(f"Image dimensions: {w}x{h}")

# The shoe is in the center. The wood piece is on the left side (x < 280) and has light wood colors.
# Let's inspect pixels on the left side of the shoe.
# Light wood typically has high BGR values: B > 100, G > 120, R > 140
for y in range(h):
    for x in range(w):
        if img[y, x, 3] > 0: # If pixel is visible
            # Get BGR values
            b, g, r = img[y, x, 0], img[y, x, 1], img[y, x, 2]
            
            # Wood cleanup condition:
            # If the pixel is on the left side (x < 275) or bottom left (x < 290 and y > 600)
            # and matches the light wood color spectrum
            is_left_side = x < 280
            is_bottom_left = x < 300 and y > 500
            
            # Light wood threshold
            is_wood_color = r > 110 and g > 90 and b > 80
            
            # Additional check: very far left is definitely background wood
            is_far_left = x < 240
            
            if (is_left_side and is_wood_color) or (is_bottom_left and is_wood_color) or is_far_left:
                img[y, x, 3] = 0 # Make it transparent
                img[y, x, 0] = 0
                img[y, x, 1] = 0
                img[y, x, 2] = 0

# Apply a slight morphology erosion/dilation to clean up noise on the boundaries
mask = img[:, :, 3]
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
cleaned_mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
img[:, :, 3] = cleaned_mask

# Save refined image
cv2.imwrite(str(rgba_path), img)
print("Mask refined successfully.")
