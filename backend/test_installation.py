import torch
import cv2
import pytesseract
import spacy
from transformers import pipeline

print("Testing installation...")

# Test PyTorch
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")

# Test OpenCV
print(f"OpenCV version: {cv2.__version__}")

# Test spaCy
try:
    nlp = spacy.load("en_core_web_sm")
    print("spaCy model loaded successfully")
except:
    print("spaCy model not loaded")

# Test Transformers
try:
    ner_pipeline = pipeline("token-classification", model="dslim/bert-base-NER", aggregation_strategy="simple")
    print("Transformers pipeline created successfully")
except Exception as e:
    print(f"Transformers error: {e}")

print("Installation test completed!")