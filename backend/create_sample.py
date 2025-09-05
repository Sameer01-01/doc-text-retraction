# create_sample.py
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from pathlib import Path

def create_sample_pdf():
    # Create the data directory if it doesn't exist
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    
    # Create sample PDF
    pdf_path = data_dir / "sample_financial.pdf"
    
    c = canvas.Canvas(str(pdf_path), pagesize=letter)
    c.setFont("Helvetica", 12)
    
    # Add sample content with PII
    content = [
        "FINANCIAL DOCUMENT SAMPLE",
        " ",
        "Customer Information:",
        "Name: John David Smith",
        "Date of Birth: January 15, 1985",
        "SSN: 123-45-6789",
        "Account Number: 9876543210",
        "Credit Card: 4111-1111-1111-1111",
        "Phone: (555) 123-4567",
        "Address: 123 Main Street, Anytown, USA 12345",
        " ",
        "Transaction History:",
        "Date: 2024-01-15, Amount: $100.00, Description: Grocery Store",
        "Date: 2024-01-16, Amount: $45.50, Description: Gas Station",
        "Date: 2024-01-17, Amount: $250.00, Description: Online Shopping",
        " ",
        "Bank Details:",
        "Bank Name: Example National Bank",
        "Routing Number: 021000021",
        "SWIFT Code: ABCDUS33",
        " ",
        "Signature: _________________________",
        " ",
        "Confidential: This document contains sensitive personal information",
        "that should be protected according to GDPR and CCPA regulations."
    ]
    
    y = 750
    for line in content:
        c.drawString(50, y, line)
        y -= 20
        if y < 50:
            c.showPage()
            c.setFont("Helvetica", 12)
            y = 750
    
    c.save()
    print(f"Sample PDF created at: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    create_sample_pdf()