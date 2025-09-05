import re
import json
from typing import Dict, List, Any
from pathlib import Path
from .config import Config

def detect_pii_with_regex(text: str) -> Dict[str, List[str]]:
    """Detect PII using regex patterns"""
    detected_pii = {}
    
    for pii_type, pattern in Config.PII_PATTERNS.items():
        matches = re.findall(pattern, text)
        if matches:
            detected_pii[pii_type] = matches
    
    return detected_pii

def save_audit_log(document_path: Path, redacted_fields: List[str], 
                  confidence_scores: List[float], output_path: Path) -> None:
    """Save audit log in JSON format"""
    audit_data = {
        "document": str(document_path),
        "redacted_fields": redacted_fields,
        "confidence_scores": confidence_scores,
        "timestamp": datetime.now().isoformat()
    }
    
    with open(output_path, 'w') as f:
        json.dump(audit_data, f, indent=2)

def is_financial_context(text: str, keywords: List[str] = None) -> bool:
    """Check if text contains financial context keywords"""
    if keywords is None:
        keywords = ["account", "bank", "financial", "loan", "transaction", "balance", "payment"]
    
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in keywords)