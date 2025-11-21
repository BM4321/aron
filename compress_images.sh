#!/bin/bash

# Directory containing images
IMAGE_DIR="assets"

# Max width for images
MAX_WIDTH=1920

# Compression quality (percentage)
QUALITY=80

echo "Starting image compression in $IMAGE_DIR..."

# Loop through image files
for img in "$IMAGE_DIR"/*.{jpg,jpeg,png}; do
    if [ -f "$img" ]; then
        echo "Processing $img..."
        
        # Get current dimensions
        WIDTH=$(sips -g pixelWidth "$img" | grep pixelWidth | awk '{print $2}')
        
        # Resize if width is greater than MAX_WIDTH
        if [ "$WIDTH" -gt "$MAX_WIDTH" ]; then
            echo "  Resizing from ${WIDTH}px to ${MAX_WIDTH}px..."
            sips -Z "$MAX_WIDTH" "$img" --out "$img" > /dev/null
        fi
        
        # Compress
        echo "  Compressing with quality $QUALITY%..."
        sips -s formatOptions "$QUALITY" "$img" --out "$img" > /dev/null
        
        echo "  Done."
    fi
done

echo "Image compression complete."
