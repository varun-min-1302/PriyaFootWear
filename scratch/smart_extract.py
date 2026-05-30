import cv2
import numpy as np
from pathlib import Path

workspace_dir = Path(r"c:\Users\VARUN\OneDrive\Desktop\PriyaFootWear")
img_path = workspace_dir / "public" / "images" / "products" / "leefox-699-leefox-chappal-4.png"
output_path = workspace_dir / "public" / "images" / "products" / "leefox-699-leefox-chappal-transparent.png"

# Read image
img = cv2.imread(str(img_path))
if img is None:
    print("Error: Could not read image.")
    exit(1)

h, w, c = img.shape
print(f"Loaded image size: {w}x{h}")

# Define bounding box for GrabCut
margin_x = int(w * 0.15)
margin_y = int(h * 0.10)
rect = (margin_x, margin_y, w - 2 * margin_x, h - 2 * margin_y)

# Allocate memory for GrabCut models
mask = np.zeros(img.shape[:2], np.uint8)
bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)

# Run GrabCut
print("Running GrabCut segmentation...")
cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 7, cv2.GC_INIT_WITH_RECT)

# Generate mask where 0 and 2 are background, 1 and 3 are foreground
mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')

# Now let's perform color thresholding to remove wood pixels that were misclassified as foreground.
# Wood pixels on the left or bottom-left: R > 110, G > 90, B > 80.
# Let's inspect BGR channels and set those pixels to 0 in mask2.
for y in range(h):
    for x in range(w):
        if mask2[y, x] == 1:
            b, g, r = img[y, x]
            # Wood is generally bright and warm-toned (yellowish/brownish wood grain)
            # The sandal is dark brown/black leather.
            # Let's see: wood background is very bright compared to the dark shadow and shoe.
            # If R > 100 and G > 80 and B > 70 and (x < 290 or x > 510 or y > 920):
            # Let's check color distance or simple threshold.
            is_wood = r > 100 and g > 80 and b > 70 and (x < 300 or y > 930 or x > 520)
            if is_wood:
                mask2[y, x] = 0

# Find contours in the updated mask
contours, hierarchy = cv2.findContours(mask2, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
if len(contours) == 0:
    print("No contours found!")
    exit(1)

# Sort contours by area and keep the largest one (which must be the shoe)
largest_contour = max(contours, key=cv2.contourArea)

# Create a clean mask with only the largest contour
clean_mask = np.zeros_like(mask2)
cv2.drawContours(clean_mask, [largest_contour], -1, 255, -1)

# Apply morphological closing and opening to smooth boundaries
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
clean_mask = cv2.morphologyEx(clean_mask, cv2.MORPH_CLOSE, kernel)
clean_mask = cv2.morphologyEx(clean_mask, cv2.MORPH_OPEN, kernel)

# Apply Gaussian blur to the mask to feather the edges
alpha_blurred = cv2.GaussianBlur(clean_mask, (5, 5), 0)

# Build the BGRA image
b, g, r = cv2.split(img)
rgba = cv2.merge((b, g, r, alpha_blurred))

# Save output
cv2.imwrite(str(output_path), rgba)
print(f"Saved refined transparent image to: {output_path}")
