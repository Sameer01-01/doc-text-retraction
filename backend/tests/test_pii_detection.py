import unittest
from pathlib import Path
from src.models.pii_detector import PIIDetector

class TestPIIDetection(unittest.TestCase):
    def setUp(self):
        self.detector = PIIDetector()
    
    def test_regex_detection(self):
        test_text = "My SSN is 123-45-6789 and account number is 1234567890"
        results = self.detector.detect_pii_hybrid(test_text)
        
        self.assertIn("ssn", results)
        self.assertIn("account_number", results)
        self.assertEqual(len(results["ssn"]), 1)
        self.assertEqual(len(results["account_number"]), 1)
    
    def test_financial_context(self):
        from src.utils.helpers import is_financial_context
        
        financial_text = "The account balance is $1000"
        non_financial_text = "The weather is nice today"
        
        self.assertTrue(is_financial_context(financial_text))
        self.assertFalse(is_financial_context(non_financial_text))

if __name__ == "__main__":
    unittest.main()