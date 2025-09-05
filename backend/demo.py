import sys
from pathlib import Path

# Add src to Python path
sys.path.append(str(Path(__file__).parent))

from src.models.pii_detector import PIIDetector
from src.utils.helpers import detect_pii_with_regex

def test_pii_detection():
    print("Testing PII detection...")
    
    # Test text with PII
    test_text = """
    Customer Information:
    Name: John Doe
    SSN: 123-45-6789
    Account Number: 1234567890
    Credit Card: 4111-1111-1111-1111
    Phone: (555) 123-4567
    Address: 123 Main St, Anytown, USA
    """
    
    # Test regex detection
    print("Regex detection results:")
    regex_results = detect_pii_with_regex(test_text)
    for pii_type, matches in regex_results.items():
        print(f"  {pii_type}: {matches}")
    
    # Test hybrid detection
    print("\nHybrid detection results:")
    detector = PIIDetector()
    hybrid_results = detector.detect_pii_hybrid(test_text)
    
    for pii_type, matches in hybrid_results.items():
        print(f"  {pii_type}:")
        for match, method, confidence in matches:
            print(f"    - {match} ({method}, confidence: {confidence:.2f})")

if __name__ == "__main__":
    test_pii_detection()