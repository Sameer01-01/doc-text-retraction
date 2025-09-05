import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import cv2
import numpy as np
from pathlib import Path
from typing import List, Tuple
import PyPDF2

from ..utils.config import Config
from ..utils.logger import setup_logger

logger = setup_logger(__name__)

# Set tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = Config.TESSERACT_PATH

class PDFHandler:
    def __init__(self):
        self.logger = setup_logger(__name__)
    
    def extract_text_from_pdf(self, pdf_path: Path) -> str:
        """Extract text from PDF using PyPDF2"""
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            return text
        except Exception as e:
            self.logger.error(f"Error extracting text from PDF: {e}")
            return ""
    
    def convert_pdf_to_images(self, pdf_path: Path, dpi: int = 300) -> List[Image.Image]:
        """Convert PDF to images for OCR processing"""
        try:
            images = convert_from_path(pdf_path, dpi=dpi)
            return images
        except Exception as e:
            self.logger.error(f"Error converting PDF to images: {e}")
            return []
    
    def extract_text_from_image(self, image: Image.Image) -> str:
        """Extract text from image using Tesseract OCR"""
        try:
            # Convert PIL Image to OpenCV format
            open_cv_image = np.array(image)
            open_cv_image = open_cv_image[:, :, ::-1].copy()  # Convert RGB to BGR
            
            # Preprocess image for better OCR
            gray = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
            thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
            
            # Perform OCR
            text = pytesseract.image_to_string(thresh)
            return text
        except Exception as e:
            self.logger.error(f"Error extracting text from image: {e}")
            return ""
    
    def extract_text_with_coordinates(self, image: Image.Image) -> List[Tuple[str, Tuple[int, int, int, int]]]:
        """Extract text with bounding box coordinates"""
        try:
            open_cv_image = np.array(image)
            open_cv_image = open_cv_image[:, :, ::-1].copy()
            gray = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
            thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
            
            # Get OCR data with bounding boxes
            ocr_data = pytesseract.image_to_data(thresh, output_type=pytesseract.Output.DICT)
            
            text_with_boxes = []
            n_boxes = len(ocr_data['text'])
            for i in range(n_boxes):
                if int(ocr_data['conf'][i]) > 60:  # Confidence threshold
                    text = ocr_data['text'][i].strip()
                    if text:
                        x, y, w, h = ocr_data['left'][i], ocr_data['top'][i], ocr_data['width'][i], ocr_data['height'][i]
                        text_with_boxes.append((text, (x, y, w, h)))
            
            return text_with_boxes
        except Exception as e:
            self.logger.error(f"Error extracting text with coordinates: {e}")
            return []