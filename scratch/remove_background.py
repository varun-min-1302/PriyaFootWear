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
# The shoe is vertically oriented in the center of the image
# Let's define the box enclosing the shoe (about 15% margin on left/right, 10% on top/bottom)
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

# Multiply the image with the mask to extract foreground
extracted = img * mask2[:, :, np.newaxis]

# Convert BGR to BGRA (add alpha channel)
b_channel, g_channel, r_channel = cv2.split(extracted)
alpha_channel = mask2 * 255

# Apply a slight blur on the mask edges to smooth the cut
alpha_blurred = cv2.GaussianBlur(alpha_channel, (5, 5), 0)
final_alpha = np.where(mask2 == 1, 255, alpha_blurred)

rgba = cv2.merge((b_channel, g_channel, r_channel, final_alpha))

# Save output
cv2.imwrite(str(output_path), rgba)
print(f"Saved transparent image to: {output_path}")
