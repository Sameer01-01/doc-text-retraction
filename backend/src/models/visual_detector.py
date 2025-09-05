import cv2
import numpy as np
from PIL import Image
import torch
from ultralytics import YOLO
from typing import List, Tuple, Dict
from pathlib import Path

from ..utils.config import Config
from ..utils.logger import setup_logger

logger = setup_logger(__name__)

class VisualDetector:
    def __init__(self):
        self.logger = setup_logger(__name__)
        self.device = "cuda" if torch.cuda.is_available() and Config.USE_GPU else "cpu"
        
        # Initialize YOLOv8 model for signature and logo detection
        try:
            self.model = YOLO("yolov8n.pt")  # Using nano version for speed
            self.logger.info(f"Loaded YOLOv8 model on {self.device}")
        except Exception as e:
            self.logger.error(f"Could not load YOLO model: {e}")
            self.model = None
    
    def detect_signatures(self, image_path: Path) -> List[Tuple[int, int, int, int, float]]:
        """Detect signatures in an image using YOLOv8"""
        if not self.model:
            return []
        
        try:
            # Run inference
            results = self.model(image_path, conf=Config.CONFIDENCE_THRESHOLD)
            
            signatures = []
            for result in results:
                for box in result.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    confidence = float(box.conf[0])
                    class_id = int(box.cls[0])
                    
                    # Assuming we've trained our model to detect signatures (class 0)
                    if class_id == 0:
                        signatures.append((x1, y1, x2, y2, confidence))
            
            return signatures
        except Exception as e:
            self.logger.error(f"Error detecting signatures: {e}")
            return []
    
    def detect_logos(self, image_path: Path) -> List[Tuple[int, int, int, int, float]]:
        """Detect logos in an image using YOLOv8"""
        if not self.model:
            return []
        
        try:
            results = self.model(image_path, conf=Config.CONFIDENCE_THRESHOLD)
            
            logos = []
            for result in results:
                for box in result.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    confidence = float(box.conf[0])
                    class_id = int(box.cls[0])
                    
                    # Assuming we've trained our model to detect logos (class 1)
                    if class_id == 1:
                        logos.append((x1, y1, x2, y2, confidence))
            
            return logos
        except Exception as e:
            self.logger.error(f"Error detecting logos: {e}")
            return []
    
    def redact_areas(self, image: Image.Image, areas: List[Tuple[int, int, int, int]]) -> Image.Image:
        """Redact specified areas in an image"""
        img_array = np.array(image)
        
        for (x1, y1, x2, y2) in areas:
            # Create a black rectangle to redact the area
            cv2.rectangle(img_array, (x1, y1), (x2, y2), (0, 0, 0), -1)
        
        return Image.fromarray(img_array)