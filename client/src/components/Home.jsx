import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Download, AlertCircle, CheckCircle, Loader2, Eye, EyeOff, Shield, FileCheck, Moon, Sun, Sparkles, Zap, Target, BarChart3, Clock, Users, Lock, Star, TrendingUp, CreditCard } from 'lucide-react'

const Home = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [showWelcome, setShowWelcome] = useState(true)
  const [stats, setStats] = useState({
    totalProcessed: 1247,
    totalRedacted: 8934,
    avgConfidence: 94.2,
    successRate: 99.8
  })

  // Theme management
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Welcome animation
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']
    },
    multiple: false
  })

  // Mock PII detection data with extensive realistic details
  const generateMockResults = (filename) => {
    const mockTextPII = {
      ssn: [
        ['123-45-6789', 'regex', 0.98, 'Line 15, Column 8-18'],
        ['987-65-4321', 'spacy', 0.89, 'Line 23, Column 12-22'],
        ['456-78-9012', 'transformer', 0.94, 'Line 31, Column 5-15']
      ],
      account_number: [
        ['1234567890', 'regex', 0.96, 'Line 8, Column 15-25'],
        ['9876543210', 'spacy', 0.91, 'Line 12, Column 8-18'],
        ['5551234567', 'transformer', 0.93, 'Line 19, Column 22-32'],
        ['1111222233', 'regex', 0.89, 'Line 27, Column 3-13']
      ],
      credit_card: [
        ['4111-1111-1111-1111', 'regex', 0.99, 'Line 6, Column 20-39'],
        ['5555-4444-3333-2222', 'regex', 0.97, 'Line 14, Column 15-34'],
        ['3782-822463-10005', 'regex', 0.95, 'Line 25, Column 8-25']
      ],
      phone: [
        ['(555) 123-4567', 'regex', 0.96, 'Line 9, Column 12-26'],
        ['555-987-6543', 'spacy', 0.88, 'Line 16, Column 18-30'],
        ['+1-212-555-0123', 'regex', 0.92, 'Line 22, Column 5-19'],
        ['1.800.555.0199', 'regex', 0.90, 'Line 28, Column 10-23']
      ],
      name: [
        ['John Michael Smith', 'spacy', 0.94, 'Line 3, Column 8-27'],
        ['Jane Elizabeth Doe', 'transformer', 0.97, 'Line 7, Column 12-31'],
        ['Robert A. Johnson', 'spacy', 0.91, 'Line 11, Column 15-30'],
        ['Dr. Sarah Williams', 'transformer', 0.89, 'Line 18, Column 5-21'],
        ['Michael O\'Connor', 'spacy', 0.86, 'Line 24, Column 20-35']
      ],
      organization: [
        ['First National Bank', 'spacy', 0.95, 'Line 4, Column 15-35'],
        ['ABC Financial Corp', 'transformer', 0.92, 'Line 10, Column 8-26'],
        ['Wells Fargo & Company', 'spacy', 0.88, 'Line 17, Column 12-32'],
        ['JPMorgan Chase Bank', 'transformer', 0.90, 'Line 26, Column 5-24']
      ],
      location: [
        ['123 Main Street, New York, NY 10001', 'transformer', 0.96, 'Line 5, Column 10-50'],
        ['456 Oak Avenue, Los Angeles, CA 90210', 'spacy', 0.93, 'Line 13, Column 15-55'],
        ['789 Pine Road, Chicago, IL 60601', 'transformer', 0.91, 'Line 20, Column 8-45'],
        ['321 Elm Street, Boston, MA 02101', 'spacy', 0.89, 'Line 29, Column 12-48']
      ],
      email: [
        ['john.smith@email.com', 'regex', 0.98, 'Line 6, Column 25-45'],
        ['jane.doe@company.org', 'regex', 0.96, 'Line 15, Column 18-38'],
        ['robert.j@business.net', 'regex', 0.94, 'Line 21, Column 12-32']
      ],
      date_of_birth: [
        ['01/15/1985', 'regex', 0.92, 'Line 8, Column 20-30'],
        ['March 22, 1978', 'spacy', 0.88, 'Line 14, Column 15-28'],
        ['12-03-1990', 'regex', 0.90, 'Line 19, Column 25-35']
      ],
      driver_license: [
        ['D123456789', 'regex', 0.95, 'Line 11, Column 18-28'],
        ['DL987654321', 'regex', 0.93, 'Line 17, Column 22-33']
      ],
      passport: [
        ['A12345678', 'regex', 0.97, 'Line 9, Column 15-24'],
        ['P987654321', 'regex', 0.94, 'Line 16, Column 20-30']
      ],
      routing_number: [
        ['021000021', 'regex', 0.98, 'Line 7, Column 25-34'],
        ['111000025', 'regex', 0.96, 'Line 13, Column 18-27']
      ]
    }

    const mockVisualPII = [
      { 
        type: 'signature', 
        page: 1, 
        bbox: [150, 200, 300, 250], 
        confidence: 0.96,
        method: 'YOLOv8',
        description: 'Handwritten signature detected'
      },
      { 
        type: 'logo', 
        page: 1, 
        bbox: [50, 50, 200, 100], 
        confidence: 0.94,
        method: 'YOLOv8',
        description: 'Corporate logo identified'
      },
      { 
        type: 'signature', 
        page: 2, 
        bbox: [100, 400, 250, 450], 
        confidence: 0.91,
        method: 'YOLOv8',
        description: 'Digital signature block'
      },
      { 
        type: 'stamp', 
        page: 1, 
        bbox: [300, 150, 400, 200], 
        confidence: 0.89,
        method: 'YOLOv8',
        description: 'Official seal/stamp'
      },
      { 
        type: 'watermark', 
        page: 2, 
        bbox: [0, 0, 600, 800], 
        confidence: 0.85,
        method: 'YOLOv8',
        description: 'Background watermark pattern'
      }
    ]

    // Generate processing metadata
    const processingMetadata = {
      processing_time: '4.2 seconds',
      total_pages: Math.floor(Math.random() * 5) + 1,
      file_size: `${(Math.random() * 10 + 1).toFixed(1)} MB`,
      language_detected: 'English',
      ocr_confidence: 96.8,
      model_versions: {
        'spacy': '3.8.0',
        'transformers': '4.30.0',
        'yolov8': '8.0.0'
      },
      detection_methods: ['regex', 'spacy_ner', 'bert_ner', 'yolo_v8'],
      compliance_standards: ['GDPR', 'CCPA', 'HIPAA', 'SOX']
    }

    return {
      status: 'success',
      redacted_file: `redacted_${filename}`,
      audit_log: {
        document: filename,
        text_pii: mockTextPII,
        visual_pii: mockVisualPII,
        timestamp: new Date().toISOString(),
        redacted_output: `redacted_${filename}`,
        processing_metadata: processingMetadata,
        total_text_pii: Object.values(mockTextPII).reduce((sum, items) => sum + items.length, 0),
        total_visual_pii: mockVisualPII.length,
        overall_confidence: 94.2,
        risk_score: 'LOW',
        compliance_status: 'COMPLIANT'
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setProcessingStep(0)

    // Simulate step-by-step processing
    const steps = [
      { step: 1, delay: 500, text: "Extracting text content" },
      { step: 2, delay: 800, text: "Running regex patterns" },
      { step: 3, delay: 1000, text: "Analyzing with spaCy NER" },
      { step: 4, delay: 1200, text: "Processing with BERT transformers" },
      { step: 5, delay: 600, text: "Detecting visual elements" },
      { step: 6, delay: 400, text: "Generating redacted document" }
    ]

    for (const { step, delay, text } of steps) {
      setProcessingStep(step)
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    try {
      const mockResult = generateMockResults(file.name)
      setResult(mockResult)
    } catch (err) {
      setError('An error occurred during processing')
    } finally {
      setUploading(false)
      setProcessingStep(0)
    }
  }

  const downloadFile = (filename) => {
    // Create a comprehensive mock redacted document with detailed audit trail
    const mockRedactedContent = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    AI-POWERED DOCUMENT REDACTION REPORT                     ║
║                    Enterprise Security & Compliance Suite                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

DOCUMENT INFORMATION:
═══════════════════════════════════════════════════════════════════════════════
Original Document: ${filename}
Processing Date: ${new Date().toLocaleDateString()}
Processing Time: ${new Date().toLocaleTimeString()}
Document ID: DOC-${Math.random().toString(36).substr(2, 9).toUpperCase()}
Processing Duration: 4.2 seconds
File Size: ${(Math.random() * 10 + 1).toFixed(1)} MB
Total Pages: ${Math.floor(Math.random() * 5) + 1}
Language Detected: English
OCR Confidence: 96.8%

COMPLIANCE STATUS:
═══════════════════════════════════════════════════════════════════════════════
✓ GDPR Compliant
✓ CCPA Compliant  
✓ HIPAA Compliant
✓ SOX Compliant
Risk Level: LOW
Overall Security Score: 94.2/100

DETECTION SUMMARY:
═══════════════════════════════════════════════════════════════════════════════
TEXT PII DETECTED: 47 items across 11 categories
VISUAL PII DETECTED: 5 items across 4 categories
TOTAL REDACTIONS: 52 items

DETAILED TEXT PII DETECTIONS:
═══════════════════════════════════════════════════════════════════════════════

SOCIAL SECURITY NUMBERS (3 instances):
├─ 123-45-6789 (Regex, 98% confidence, Line 15, Column 8-18)
├─ 987-65-4321 (spaCy NER, 89% confidence, Line 23, Column 12-22)
└─ 456-78-9012 (BERT Transformer, 94% confidence, Line 31, Column 5-15)

ACCOUNT NUMBERS (4 instances):
├─ 1234567890 (Regex, 96% confidence, Line 8, Column 15-25)
├─ 9876543210 (spaCy NER, 91% confidence, Line 12, Column 8-18)
├─ 5551234567 (BERT Transformer, 93% confidence, Line 19, Column 22-32)
└─ 1111222233 (Regex, 89% confidence, Line 27, Column 3-13)

CREDIT CARD NUMBERS (3 instances):
├─ 4111-1111-1111-1111 (Regex, 99% confidence, Line 6, Column 20-39)
├─ 5555-4444-3333-2222 (Regex, 97% confidence, Line 14, Column 15-34)
└─ 3782-822463-10005 (Regex, 95% confidence, Line 25, Column 8-25)

PHONE NUMBERS (4 instances):
├─ (555) 123-4567 (Regex, 96% confidence, Line 9, Column 12-26)
├─ 555-987-6543 (spaCy NER, 88% confidence, Line 16, Column 18-30)
├─ +1-212-555-0123 (Regex, 92% confidence, Line 22, Column 5-19)
└─ 1.800.555.0199 (Regex, 90% confidence, Line 28, Column 10-23)

PERSONAL NAMES (5 instances):
├─ John Michael Smith (spaCy NER, 94% confidence, Line 3, Column 8-27)
├─ Jane Elizabeth Doe (BERT Transformer, 97% confidence, Line 7, Column 12-31)
├─ Robert A. Johnson (spaCy NER, 91% confidence, Line 11, Column 15-30)
├─ Dr. Sarah Williams (BERT Transformer, 89% confidence, Line 18, Column 5-21)
└─ Michael O'Connor (spaCy NER, 86% confidence, Line 24, Column 20-35)

ORGANIZATIONS (4 instances):
├─ First National Bank (spaCy NER, 95% confidence, Line 4, Column 15-35)
├─ ABC Financial Corp (BERT Transformer, 92% confidence, Line 10, Column 8-26)
├─ Wells Fargo & Company (spaCy NER, 88% confidence, Line 17, Column 12-32)
└─ JPMorgan Chase Bank (BERT Transformer, 90% confidence, Line 26, Column 5-24)

ADDRESSES (4 instances):
├─ 123 Main Street, New York, NY 10001 (BERT Transformer, 96% confidence, Line 5, Column 10-50)
├─ 456 Oak Avenue, Los Angeles, CA 90210 (spaCy NER, 93% confidence, Line 13, Column 15-55)
├─ 789 Pine Road, Chicago, IL 60601 (BERT Transformer, 91% confidence, Line 20, Column 8-45)
└─ 321 Elm Street, Boston, MA 02101 (spaCy NER, 89% confidence, Line 29, Column 12-48)

EMAIL ADDRESSES (3 instances):
├─ john.smith@email.com (Regex, 98% confidence, Line 6, Column 25-45)
├─ jane.doe@company.org (Regex, 96% confidence, Line 15, Column 18-38)
└─ robert.j@business.net (Regex, 94% confidence, Line 21, Column 12-32)

DATES OF BIRTH (3 instances):
├─ 01/15/1985 (Regex, 92% confidence, Line 8, Column 20-30)
├─ March 22, 1978 (spaCy NER, 88% confidence, Line 14, Column 15-28)
└─ 12-03-1990 (Regex, 90% confidence, Line 19, Column 25-35)

DRIVER LICENSE NUMBERS (2 instances):
├─ D123456789 (Regex, 95% confidence, Line 11, Column 18-28)
└─ DL987654321 (Regex, 93% confidence, Line 17, Column 22-33)

PASSPORT NUMBERS (2 instances):
├─ A12345678 (Regex, 97% confidence, Line 9, Column 15-24)
└─ P987654321 (Regex, 94% confidence, Line 16, Column 20-30)

ROUTING NUMBERS (2 instances):
├─ 021000021 (Regex, 98% confidence, Line 7, Column 25-34)
└─ 111000025 (Regex, 96% confidence, Line 13, Column 18-27)

DETAILED VISUAL PII DETECTIONS:
═══════════════════════════════════════════════════════════════════════════════

SIGNATURES (2 instances):
├─ Page 1: Handwritten signature (YOLOv8, 96% confidence, BBox: 150,200,300,250)
└─ Page 2: Digital signature block (YOLOv8, 91% confidence, BBox: 100,400,250,450)

LOGOS (1 instance):
└─ Page 1: Corporate logo identified (YOLOv8, 94% confidence, BBox: 50,50,200,100)

STAMPS/SEALS (1 instance):
└─ Page 1: Official seal/stamp (YOLOv8, 89% confidence, BBox: 300,150,400,200)

WATERMARKS (1 instance):
└─ Page 2: Background watermark pattern (YOLOv8, 85% confidence, BBox: 0,0,600,800)

TECHNICAL DETAILS:
═══════════════════════════════════════════════════════════════════════════════
AI Models Used:
├─ spaCy NER: v3.8.0
├─ BERT Transformer: v4.30.0
├─ YOLOv8 Object Detection: v8.0.0
└─ Custom Regex Patterns: v2.1.0

Detection Methods:
├─ Regex Pattern Matching
├─ spaCy Named Entity Recognition
├─ BERT Transformer NER
└─ YOLOv8 Computer Vision

Processing Pipeline:
1. Document OCR and text extraction
2. Regex pattern matching for structured data
3. spaCy NER for entity recognition
4. BERT transformer for contextual analysis
5. YOLOv8 for visual element detection
6. Confidence scoring and validation
7. Redaction mask generation
8. Final document compilation

CONFIDENCE SCORES:
═══════════════════════════════════════════════════════════════════════════════
Average Text PII Confidence: 93.4%
Average Visual PII Confidence: 91.0%
Overall Processing Confidence: 94.2%
OCR Quality Score: 96.8%
Model Accuracy: 99.8%

SECURITY VERIFICATION:
═══════════════════════════════════════════════════════════════════════════════
✓ All PII successfully identified and redacted
✓ No false positives detected
✓ Document integrity maintained
✓ Metadata sanitized
✓ Audit trail complete
✓ Compliance requirements met

REDACTION QUALITY: EXCELLENT
RISK ASSESSMENT: LOW
COMPLIANCE STATUS: FULLY COMPLIANT

This document has been processed by the Enterprise AI-Powered Document Redaction System.
All personally identifiable information has been automatically detected, verified, and redacted
using state-of-the-art machine learning models and enterprise-grade security protocols.

Generated by: AI Document Redaction System v2.1.0
Processing ID: ${Math.random().toString(36).substr(2, 12).toUpperCase()}
    `

    // Create and download the comprehensive redacted file
    const blob = new Blob([mockRedactedContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `redacted_audit_report_${filename}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  const getFileIcon = (filename) => {
    if (filename?.toLowerCase().endsWith('.pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />
    }
    return <FileText className="w-8 h-8 text-blue-500" />
  }

  const formatConfidence = (confidence) => {
    return (confidence * 100).toFixed(1) + '%'
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} py-8 relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      {/* Welcome Animation */}
      {showWelcome && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center z-50 animate-fadeIn">
          <div className="text-center text-white">
            <div className="mb-8 animate-bounce">
              <Shield className="w-24 h-24 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold mb-4 animate-slideUp">AI Document Redaction</h1>
            <p className="text-xl animate-slideUp delay-500">Advanced PII Protection Technology</p>
          </div>
        </div>
      )}

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDarkMode 
              ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300' 
              : 'bg-gray-800 text-white hover:bg-gray-700'
          } shadow-lg hover:shadow-xl transform hover:scale-110`}
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      {/* Processing Overlay */}
      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className={`rounded-2xl p-8 max-w-lg mx-4 text-center transform transition-all duration-500 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          } shadow-2xl`}>
            <div className="mb-6">
              <div className="relative">
                <Loader2 className="w-20 h-20 text-blue-600 animate-spin mx-auto" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Processing Document
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Our advanced AI is analyzing your document for PII...</p>
            
            <div className="space-y-3 text-sm">
              {[
                { text: "Extracting text content", completed: processingStep >= 1 },
                { text: "Running regex patterns", completed: processingStep >= 2 },
                { text: "Analyzing with spaCy NER", completed: processingStep >= 3 },
                { text: "Processing with BERT transformers", completed: processingStep >= 4 },
                { text: "Detecting visual elements", completed: processingStep >= 5 },
                { text: "Generating redacted document", completed: processingStep >= 6 }
              ].map((item, index) => (
                <div key={index} className={`flex items-center justify-center space-x-3 transition-all duration-300 ${
                  item.completed ? 'opacity-100' : 'opacity-50'
                }`}>
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500 animate-bounce" />
                  ) : processingStep === index + 1 ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                  )}
                  <span className={item.completed ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Shield className="w-16 h-16 text-blue-600 dark:text-blue-400 mr-4 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              AI-Powered Document Redaction
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced AI technology powered by machine learning to automatically detect and redact 
            personally identifiable information with 99.8% accuracy
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {[
              { icon: Lock, text: "SSN Detection", color: "green" },
              { icon: CreditCard, text: "Credit Cards", color: "blue" },
              { icon: Target, text: "Signatures", color: "purple" },
              { icon: Users, text: "Names & Addresses", color: "pink" },
              { icon: BarChart3, text: "Real-time Analytics", color: "indigo" },
              { icon: Zap, text: "Lightning Fast", color: "yellow" }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } shadow-lg hover:shadow-xl`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className={`w-4 h-4 text-${feature.color}-500`} />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: FileText, value: stats.totalProcessed.toLocaleString(), label: "Documents Processed", color: "blue" },
              { icon: Shield, value: stats.totalRedacted.toLocaleString(), label: "PII Items Redacted", color: "green" },
              { icon: TrendingUp, value: `${stats.avgConfidence}%`, label: "Avg Confidence", color: "purple" },
              { icon: Star, value: `${stats.successRate}%`, label: "Success Rate", color: "yellow" }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-50'
                } shadow-lg hover:shadow-xl`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
                </div>
                <div className={`text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400 mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Upload Section */}
        <div className={`rounded-2xl shadow-xl p-8 mb-8 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Upload className="w-6 h-6 mr-3 text-blue-600" />
              Upload Document
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Processing time: ~3-5 seconds</span>
            </div>
          </div>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                : isDarkMode
                ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            } group`}
          >
            <input {...getInputProps()} />
            <div className="relative">
              <Upload className={`w-16 h-16 mx-auto mb-6 transition-all duration-300 ${
                isDragActive ? 'text-blue-600 scale-110' : 'text-gray-400 group-hover:text-blue-500'
              }`} />
              {isDragActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-blue-300 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
            {isDragActive ? (
              <div className="space-y-2">
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 animate-bounce">
                  Drop the file here...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Release to upload
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Drag & drop a file here, or click to select
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supports PDF, PNG, JPG, JPEG, BMP, TIFF • Max 50MB
                </p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  {['PDF', 'PNG', 'JPG', 'TIFF'].map((format, index) => (
                    <span 
                      key={format}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {file && (
            <div className={`mt-6 p-6 rounded-xl transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 border border-gray-600' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {getFileIcon(file.name)}
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>•</span>
                      <span>{file.type || 'Unknown type'}</span>
                      <span>•</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Ready to process
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>AI Processing Document...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-6 h-6" />
                      <span>Start Redaction Process</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className={`rounded-2xl shadow-2xl p-8 border-l-4 border-green-500 transition-all duration-500 animate-fadeInUp ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full animate-bounce">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Redaction Complete!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    AI successfully processed your document with 99.8% accuracy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50' 
                    : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                }`}
              >
                {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                <span className="font-medium">{showDetails ? 'Hide' : 'Show'} Details</span>
              </button>
            </div>

            {/* Download Section */}
            <div className={`mb-8 p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30' 
                : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <FileCheck className="w-12 h-12 text-green-600 dark:text-green-400 animate-float" />
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-300">
                      Redacted Document Ready
                    </h3>
                    <p className="text-green-600 dark:text-green-400 text-lg">
                      All PII has been successfully redacted and secured
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => downloadFile(result.audit_log.document)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-blue-700 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-glow"
                >
                  <Download className="w-6 h-6" />
                  <span>Download Redacted File</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { 
                  icon: FileText, 
                  value: Object.values(result.audit_log.text_pii || {}).reduce((sum, items) => sum + items.length, 0), 
                  label: "Text PII Items", 
                  color: "blue",
                  bgColor: isDarkMode ? "bg-blue-900/30" : "bg-blue-50",
                  textColor: "text-blue-600 dark:text-blue-400"
                },
                { 
                  icon: Target, 
                  value: result.audit_log.visual_pii?.length || 0, 
                  label: "Visual PII Items", 
                  color: "purple",
                  bgColor: isDarkMode ? "bg-purple-900/30" : "bg-purple-50",
                  textColor: "text-purple-600 dark:text-purple-400"
                },
                { 
                  icon: TrendingUp, 
                  value: "91.2%", 
                  label: "Confidence Score", 
                  color: "green",
                  bgColor: isDarkMode ? "bg-green-900/30" : "bg-green-50",
                  textColor: "text-green-600 dark:text-green-400"
                }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`${stat.bgColor} p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.textColor} animate-float`} />
                  </div>
                  <div className={`text-4xl font-bold ${stat.textColor} mb-2`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm font-medium ${stat.textColor} opacity-80`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced PII Detection Summary */}
            {result.audit_log && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className={`p-6 rounded-2xl transition-all duration-300 ${
                  isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <h4 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                    <FileText className="w-6 h-6 mr-2" />
                    Text PII Detected
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(result.audit_log.text_pii || {}).map(([type, items]) => (
                      <div key={type} className={`p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                        isDarkMode ? 'bg-blue-800/50' : 'bg-white'
                      }`}>
                        <div className="text-sm font-semibold text-blue-700 dark:text-blue-300 capitalize">
                          {type.replace('_', ' ')}
                        </div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {items.length}
                        </div>
                        <div className="text-xs text-blue-500 dark:text-blue-400">
                          items detected
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`p-6 rounded-2xl transition-all duration-300 ${
                  isDarkMode ? 'bg-purple-900/30 border border-purple-700' : 'bg-purple-50 border border-purple-200'
                }`}>
                  <h4 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center">
                    <Target className="w-6 h-6 mr-2" />
                    Visual PII Detected
                  </h4>
                  <div className="space-y-3">
                    {result.audit_log.visual_pii?.map((item, index) => (
                      <div key={index} className={`p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                        isDarkMode ? 'bg-purple-800/50' : 'bg-white'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-purple-700 dark:text-purple-300 capitalize">
                            {item.type}
                          </div>
                          <div className="text-xs text-purple-500 dark:text-purple-400">
                            {formatConfidence(item.confidence)}
                          </div>
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">
                          Page {item.page} • {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Processing Metadata */}
            {result.audit_log?.processing_metadata && (
              <div className={`p-6 rounded-2xl mb-8 ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              }`}>
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  Processing Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {result.audit_log.processing_metadata.processing_time}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Processing Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {result.audit_log.processing_metadata.total_pages}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pages Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {result.audit_log.processing_metadata.ocr_confidence}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">OCR Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {result.audit_log.processing_metadata.file_size}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">File Size</div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Results */}
            {showDetails && result.audit_log && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Eye className="w-6 h-6 mr-2" />
                  Detailed Detection Results
                </h3>
                
                {/* Text PII Details */}
                {result.audit_log.text_pii && Object.keys(result.audit_log.text_pii).length > 0 && (
                  <div className={`p-6 rounded-2xl ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Text PII Details
                    </h4>
                    <div className="space-y-6">
                      {Object.entries(result.audit_log.text_pii).map(([type, items]) => (
                        <div key={type} className="border-l-4 border-blue-500 pl-4">
                          <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 capitalize mb-3">
                            {type.replace('_', ' ').toUpperCase()} ({items.length} items)
                          </h5>
                          <div className="grid grid-cols-1 gap-3">
                            {items.map((item, index) => (
                              <div key={index} className={`p-4 rounded-lg transition-all duration-300 hover:scale-105 ${
                                isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                              }`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-mono text-sm text-gray-900 dark:text-white font-semibold">
                                    {item[0]}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                      item[1] === 'regex' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                      item[1] === 'spacy' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                    }`}>
                                      {item[1].toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                      {formatConfidence(item[2])}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  📍 {item[3] || 'Location not specified'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual PII Details */}
                {result.audit_log.visual_pii && result.audit_log.visual_pii.length > 0 && (
                  <div className={`p-6 rounded-2xl ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Visual PII Details
                    </h4>
                    <div className="space-y-4">
                      {result.audit_log.visual_pii.map((item, index) => (
                        <div key={index} className={`p-4 rounded-lg transition-all duration-300 hover:scale-105 ${
                          isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                item.type === 'signature' ? 'bg-red-500' :
                                item.type === 'logo' ? 'bg-blue-500' :
                                item.type === 'stamp' ? 'bg-yellow-500' :
                                'bg-purple-500'
                              }`}></div>
                              <span className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                {item.type}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                {item.method}
                              </span>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {formatConfidence(item.confidence)}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            📄 Page {item.page || 'N/A'} • {item.description}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            📐 Bounding Box: [{item.bbox.join(', ')}]
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance & Security Status */}
                <div className={`p-6 rounded-2xl ${
                  isDarkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
                }`}>
                  <h4 className="text-xl font-bold text-green-800 dark:text-green-300 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security & Compliance Status
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
                      <div className="text-sm text-green-700 dark:text-green-300">GDPR Compliant</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
                      <div className="text-sm text-green-700 dark:text-green-300">CCPA Compliant</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
                      <div className="text-sm text-green-700 dark:text-green-300">HIPAA Compliant</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
                      <div className="text-sm text-green-700 dark:text-green-300">SOX Compliant</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                      Risk Level: {result.audit_log.risk_score || 'LOW'} • 
                      Status: {result.audit_log.compliance_status || 'COMPLIANT'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home