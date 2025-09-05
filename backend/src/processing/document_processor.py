from pathlib import Path
from typing import Dict, List, Tuple
from PIL import Image
import PyPDF2
import json
from datetime import datetime

from ..models.pii_detector import PIIDetector
from ..models.visual_detector import VisualDetector
from ..processing.pdf_handler import PDFHandler
from ..processing.image_processor import ImageProcessor
from ..utils.config import Config
from ..utils.logger import setup_logger
from ..utils.helpers import save_audit_log

logger = setup_logger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.logger = setup_logger(__name__)
        self.pii_detector = PIIDetector()
        self.visual_detector = VisualDetector()
        self.pdf_handler = PDFHandler()
        self.image_processor = ImageProcessor()
    
    def process_document(self, input_path: Path, output_path: Path = None) -> Dict:
        """Process a document and redact PII"""
        if not input_path.exists():
            raise FileNotFoundError(f"Input file not found: {input_path}")
        
        # Determine output path if not provided
        if output_path is None:
            output_path = Config.OUTPUT_DIR / f"redacted_{input_path.name}"
        
        # Process based on file type
        file_extension = input_path.suffix.lower()
        
        if file_extension == '.pdf':
            return self._process_pdf(input_path, output_path)
        elif file_extension in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']:
            return self._process_image(input_path, output_path)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
    
    def _process_pdf(self, pdf_path: Path, output_path: Path) -> Dict:
        """Process a PDF document"""
        self.logger.info(f"Processing PDF: {pdf_path}")
        
        # Extract text for PII detection
        text = self.pdf_handler.extract_text_from_pdf(pdf_path)
        
        # Detect PII in text
        pii_results = self.pii_detector.detect_pii_hybrid(text)
        
        # Convert PDF to images for visual detection
        images = self.pdf_handler.convert_pdf_to_images(pdf_path)
        
        # Process each page
        redacted_images = []
        visual_pii = []
        
        for i, image in enumerate(images):
            self.logger.info(f"Processing page {i+1}/{len(images)}")
            
            # Detect visual PII (signatures, logos)
            temp_image_path = Config.OUTPUT_DIR / f"temp_page_{i}.png"
            image.save(temp_image_path)
            
            signatures = self.visual_detector.detect_signatures(temp_image_path)
            logos = self.visual_detector.detect_logos(temp_image_path)
            
            # Redact visual PII
            redaction_areas = [(x1, y1, x2, y2) for x1, y1, x2, y2, conf in signatures + logos]
            redacted_image = self.visual_detector.redact_areas(image, redaction_areas)
            
            redacted_images.append(redacted_image)
            
            # Record visual PII for audit log
            for x1, y1, x2, y2, conf in signatures:
                visual_pii.append({
                    "type": "signature",
                    "page": i + 1,
                    "bbox": [x1, y1, x2, y2],
                    "confidence": conf
                })
            
            for x1, y1, x2, y2, conf in logos:
                visual_pii.append({
                    "type": "logo",
                    "page": i + 1,
                    "bbox": [x1, y1, x2, y2],
                    "confidence": conf
                })
            
            # Clean up temp file
            temp_image_path.unlink(missing_ok=True)
        
        # Save redacted PDF
        if redacted_images:
            redacted_images[0].save(
                output_path, 
                save_all=True, 
                append_images=redacted_images[1:],
                format="PDF"
            )
        
        # Prepare audit log data
        audit_data = {
            "document": str(pdf_path),
            "text_pii": pii_results,
            "visual_pii": visual_pii,
            "timestamp": datetime.now().isoformat(),
            "redacted_output": str(output_path)
        }
        
        # Save audit log
        audit_log_path = output_path.with_suffix('.json')
        with open(audit_log_path, 'w') as f:
            json.dump(audit_data, f, indent=2)
        
        self.logger.info(f"Processing complete. Output: {output_path}")
        return audit_data
    
    def _process_image(self, image_path: Path, output_path: Path) -> Dict:
        """Process an image document"""
        self.logger.info(f"Processing image: {image_path}")
        
        # Open image
        image = Image.open(image_path)
        
        # Extract text for PII detection
        text = self.pdf_handler.extract_text_from_image(image)
        
        # Detect PII in text
        pii_results = self.pii_detector.detect_pii_hybrid(text)
        
        # Detect visual PII
        signatures = self.visual_detector.detect_signatures(image_path)
        logos = self.visual_detector.detect_logos(image_path)
        
        # Redact visual PII
        redaction_areas = [(x1, y1, x2, y2) for x1, y1, x2, y2, conf in signatures + logos]
        redacted_image = self.visual_detector.redact_areas(image, redaction_areas)
        
        # Save redacted image
        redacted_image.save(output_path)
        
        # Prepare visual PII data for audit log
        visual_pii = []
        for x1, y1, x2, y2, conf in signatures:
            visual_pii.append({
                "type": "signature",
                "bbox": [x1, y1, x2, y2],
                "confidence": conf
            })
        
        for x1, y1, x2, y2, conf in logos:
            visual_pii.append({
                "type": "logo",
                "bbox": [x1, y1, x2, y2],
                "confidence": conf
            })
        
        # Prepare audit log data
        audit_data = {
            "document": str(image_path),
            "text_pii": pii_results,
            "visual_pii": visual_pii,
            "timestamp": datetime.now().isoformat(),
            "redacted_output": str(output_path)
        }
        
        # Save audit log
        audit_log_path = output_path.with_suffix('.json')
        with open(audit_log_path, 'w') as f:
            json.dump(audit_data, f, indent=2)
        
        self.logger.info(f"Processing complete. Output: {output_path}")
        return audit_data