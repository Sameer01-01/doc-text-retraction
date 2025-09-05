@echo off
echo Setting up AI-Powered Financial Document Redaction System on Windows...
echo.

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate.bat

REM Install Python dependencies
pip install -r requirements.txt

REM Download spaCy model
python -m spacy download en_core_web_sm

echo.
echo Installation complete!
echo Activate virtual environment with: venv\Scripts\activate.bat
pause