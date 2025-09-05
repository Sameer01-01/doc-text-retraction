import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Base paths
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    DATA_DIR = BASE_DIR / "data"
    INPUT_DIR = DATA_DIR / "input"
    OUTPUT_DIR = DATA_DIR / "output"
    MODELS_DIR = DATA_DIR / "models"
    
    # Create directories if they don't exist
    for directory in [INPUT_DIR, OUTPUT_DIR, MODELS_DIR]:
        directory.mkdir(parents=True, exist_ok=True)
    
    # PII patterns for regex detection
    PII_PATTERNS = {
        "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
        "account_number": r"\b\d{10,20}\b",
        "credit_card": r"\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b",
        "swift_code": r"\b[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?\b",
        "phone": r"\b\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b",
    }
    
    # Model settings
    USE_GPU = os.getenv("USE_GPU", "false").lower() == "true"
    CONFIDENCE_THRESHOLD = 0.8
    
    # Tesseract path (update this for your Windows installation)
    TESSERACT_PATH = r"C:\Users\BITTU\AppData\Local\Programs\Tesseract-OCR"
    
    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")