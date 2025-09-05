from PIL import Image, ImageDraw
import cv2
import numpy as np
from pathlib import Path
from typing import List, Tuple

from ..utils.logger import setup_logger

logger = setup_logger(__name__)

class ImageProcessor:
    def __init__(self):
        self.logger = setup_logger(__name__)
    
    def redact_text_areas(self, image: Image.Image, text_areas: List[Tuple[str, Tuple[int, int, int, int]]]) -> Image.Image:
        """Redact specific text areas in an image"""
        img_draw = ImageDraw.Draw(image)
        
        for text, (x, y, w, h) in text_areas:
            # Expand the bounding box slightly to ensure complete coverage
            padding = 2
            img_draw.rectangle(
                [x - padding, y - padding, x + w + padding, y + h + padding],
                fill="black"
            )
        
        return image
    
    def enhance_image_quality(self, image_path: Path) -> Image.Image:
        """Enhance image quality for better OCR results"""
        try:
            # Read image
            img = cv2.imread(str(image_path))
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Apply noise reduction
            denoised = cv2.fastNlMeansDenoising(gray)
            
            # Apply thresholding
            _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Convert back to PIL Image
            enhanced_image = Image.fromarray(thresh)
            
            return enhanced_image
        except Exception as e:
            self.logger.error(f"Error enhancing image: {e}")
            return Image.open(image_path)