import re
import spacy
from transformers import pipeline
from typing import Dict, List, Tuple
from ..utils.config import Config
from ..utils.logger import setup_logger
from ..utils.helpers import detect_pii_with_regex, is_financial_context

logger = setup_logger(__name__)

class PIIDetector:
    def __init__(self):
        self.logger = setup_logger(__name__)
        self.nlp = spacy.load("en_core_web_sm")
        
        # Initialize Hugging Face models for PII detection
        try:
            self.ner_pipeline = pipeline(
                "token-classification",
                model="dslim/bert-base-NER",
                aggregation_strategy="simple"
            )
        except Exception as e:
            self.logger.warning(f"Could not load BERT NER model: {e}")
            self.ner_pipeline = None
    
    def detect_pii_spacy(self, text: str) -> Dict[str, List[str]]:
        """Detect PII using spaCy NER"""
        doc = self.nlp(text)
        pii_entities = {}
        
        for ent in doc.ents:
            if ent.label_ in ["PERSON", "ORG", "GPE", "DATE", "CARDINAL"]:
                if ent.label_ not in pii_entities:
                    pii_entities[ent.label_] = []
                pii_entities[ent.label_].append(ent.text)
        
        return pii_entities
    
    def detect_pii_transformers(self, text: str) -> Dict[str, List[Tuple[str, float]]]:
        """Detect PII using transformer models"""
        if not self.ner_pipeline:
            return {}
        
        try:
            results = self.ner_pipeline(text)
            pii_entities = {}
            
            for entity in results:
                entity_type = entity['entity_group']
                entity_text = entity['word']
                confidence = entity['score']
                
                if entity_type not in pii_entities:
                    pii_entities[entity_type] = []
                
                pii_entities[entity_type].append((entity_text, confidence))
            
            return pii_entities
        except Exception as e:
            self.logger.error(f"Error in transformer PII detection: {e}")
            return {}
    
    def detect_pii_hybrid(self, text: str) -> Dict[str, List[Tuple[str, str, float]]]:
        """Hybrid PII detection using multiple methods"""
        results = {}
        
        # 1. Regex detection
        regex_results = detect_pii_with_regex(text)
        for pii_type, matches in regex_results.items():
            if pii_type not in results:
                results[pii_type] = []
            for match in matches:
                # Add context awareness
                if is_financial_context(text):
                    results[pii_type].append((match, "regex", 0.9))
        
        # 2. spaCy NER
        spacy_results = self.detect_pii_spacy(text)
        for entity_type, entities in spacy_results.items():
            pii_type = self._map_spacy_to_pii_type(entity_type)
            if pii_type:
                if pii_type not in results:
                    results[pii_type] = []
                for entity in entities:
                    results[pii_type].append((entity, "spacy", 0.85))
        
        # 3. Transformers NER (if available)
        if self.ner_pipeline:
            transformer_results = self.detect_pii_transformers(text)
            for entity_type, entities in transformer_results.items():
                pii_type = self._map_transformer_to_pii_type(entity_type)
                if pii_type:
                    if pii_type not in results:
                        results[pii_type] = []
                    for entity, confidence in entities:
                        if confidence > Config.CONFIDENCE_THRESHOLD:
                            results[pii_type].append((entity, "transformer", confidence))
        
        return results
    
    def _map_spacy_to_pii_type(self, spacy_label: str) -> str:
        """Map spaCy entity labels to PII types"""
        mapping = {
            "PERSON": "name",
            "ORG": "organization",
            "GPE": "location",
            "DATE": "date",
            "CARDINAL": "account_number"
        }
        return mapping.get(spacy_label, "")
    
    def _map_transformer_to_pii_type(self, transformer_label: str) -> str:
        """Map transformer entity labels to PII types"""
        mapping = {
            "PER": "name",
            "ORG": "organization",
            "LOC": "location",
            "MISC": "other"
        }
        return mapping.get(transformer_label, "")