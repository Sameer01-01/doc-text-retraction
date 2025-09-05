import argparse
import sys
from pathlib import Path
from typing import List

from .processing.document_processor import DocumentProcessor
from .utils.config import Config
from .utils.logger import setup_logger

logger = setup_logger(__name__)

def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(description="AI-Powered Financial Document Redaction System")
    
    # Input arguments
    parser.add_argument("input", nargs="+", help="Input file(s) or directory to process")
    parser.add_argument("-o", "--output", help="Output directory for redacted files")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose logging")
    parser.add_argument("--batch", action="store_true", help="Process files in batch mode")
    
    args = parser.parse_args()
    
    # Set log level
    if args.verbose:
        logger.setLevel("DEBUG")
    
    # Process output directory
    output_dir = Path(args.output) if args.output else Config.OUTPUT_DIR
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Get input files
    input_files = []
    for input_path in args.input:
        path = Path(input_path)
        if path.is_dir():
            # Add all supported files from directory
            for ext in [".pdf", ".jpg", ".jpeg", ".png", ".bmp", ".tiff"]:
                input_files.extend(path.glob(f"**/*{ext}"))
        elif path.exists():
            input_files.append(path)
        else:
            logger.warning(f"Input path does not exist: {path}")
    
    if not input_files:
        logger.error("No valid input files found")
        sys.exit(1)
    
    # Process files
    processor = DocumentProcessor()
    results = []
    
    for input_file in input_files:
        try:
            logger.info(f"Processing: {input_file}")
            
            # Determine output path
            output_file = output_dir / f"redacted_{input_file.name}"
            
            # Process document
            result = processor.process_document(input_file, output_file)
            results.append(result)
            
            logger.info(f"Completed: {input_file} -> {output_file}")
            
        except Exception as e:
            logger.error(f"Error processing {input_file}: {e}")
    
    # Print summary
    logger.info(f"Processing complete. Processed {len(results)} files.")
    
    for result in results:
        doc_name = Path(result['document']).name
        text_pii_count = sum(len(items) for items in result['text_pii'].values())
        visual_pii_count = len(result['visual_pii'])
        
        logger.info(f"{doc_name}: {text_pii_count} text PII, {visual_pii_count} visual PII redacted")

if __name__ == "__main__":
    main()