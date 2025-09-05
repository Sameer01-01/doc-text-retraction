from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import uuid
import json

from ..processing.document_processor import DocumentProcessor
from ..utils.config import Config
from ..utils.logger import setup_logger

logger = setup_logger(__name__)

app = FastAPI(title="Financial Document Redaction API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor = DocumentProcessor()

@app.post("/redact/")
async def redact_document(file: UploadFile = File(...)):
    """API endpoint to redact a document"""
    try:
        # Generate unique filename
        file_id = str(uuid.uuid4())
        input_path = Config.INPUT_DIR / f"{file_id}_{file.filename}"
        output_path = Config.OUTPUT_DIR / f"redacted_{file_id}_{file.filename}"
        
        # Save uploaded file
        with open(input_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Process document
        result = processor.process_document(input_path, output_path)
        
        # Clean up input file
        input_path.unlink(missing_ok=True)
        
        return {
            "status": "success",
            "redacted_file": str(output_path),
            "audit_log": result
        }
    
    except Exception as e:
        logger.error(f"API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{file_id}")
async def download_file(file_id: str):
    """Download a redacted file"""
    file_path = Config.OUTPUT_DIR / file_id
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        file_path,
        media_type="application/octet-stream",
        filename=file_path.name
    )

@app.get("/")
async def root():
    return {"message": "Financial Document Redaction API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)