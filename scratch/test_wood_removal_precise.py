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

# 1. Run GrabCut to get initial foreground
mask = np.zeros(img.shape[:2], np.uint8)
bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)

margin_x = int(w * 0.15)
margin_y = int(h * 0.10)
rect = (margin_x, margin_y, w - 2 * margin_x, h - 2 * margin_y)

print("Running GrabCut...")
cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 7, cv2.GC_INIT_WITH_RECT)
fg_mask = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')

# 2. Identify wood by HSV color range
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
# Wood is yellowish/brownish: Hue ~ 10-25, Saturation ~ 40-255, Value ~ 70-255
lower_wood = np.array([10, 40, 70])
upper_wood = np.array([25, 255, 255])
wood_mask = cv2.inRange(hsv, lower_wood, upper_wood)

# Also check for very bright pixels (light wood grain)
bright_mask = cv2.inRange(hsv, np.array([0, 0, 90]), np.array([180, 255, 255]))
# Combine wood colors and bright pixels
wood_or_bright = cv2.bitwise_or(wood_mask, bright_mask)

# Apply wood mask precisely:
# - Below y = 920: apply only on left side (x < 248) or right side (x > 500)
# - Above y = 920: apply across the entire width
pedestal_wood = np.zeros_like(wood_or_bright)
for y in range(h):
    if y > 920:
        pedestal_wood[y, :] = wood_or_bright[y, :]
    elif y > 400:
        # Left side wood piece: x < 248
        # Right side wood piece: x > 500
        pedestal_wood[y, :248] = wood_or_bright[y, :248]
        pedestal_wood[y, 500:] = wood_or_bright[y, 500:]

# Dilate the wood mask to cover shadows nearby
kernel_dilate = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
dilated_wood = cv2.dilate(pedestal_wood, kernel_dilate)

# Subtract dilated wood from the foreground mask
cleaned_fg = np.where(dilated_wood > 0, 0, fg_mask)

# Find contours on the cleaned foreground
contours, hierarchy = cv2.findContours(cleaned_fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
if len(contours) == 0:
    print("Error: No contours found after cleanup.")
    exit(1)

# Keep the largest contour (the sandal)
largest_contour = max(contours, key=cv2.contourArea)

# Create a clean mask
final_mask = np.zeros_like(fg_mask)
cv2.drawContours(final_mask, [largest_contour], -1, 255, -1)

# Morphological operations to clean up edges and fill internal holes
kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
final_mask = cv2.morphologyEx(final_mask, cv2.MORPH_CLOSE, kernel_close)
final_mask = cv2.morphologyEx(final_mask, cv2.MORPH_OPEN, kernel_close)

# Feather the edges of the mask
alpha_channel = cv2.GaussianBlur(final_mask, (5, 5), 0)

# Merge back into BGRA
b, g, r = cv2.split(img)
rgba = cv2.merge((b, g, r, alpha_channel))

cv2.imwrite(str(output_path), rgba)
print("Precise sandal background removal complete!")
