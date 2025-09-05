# 🛡️ Financial Document Redaction

A Python-based solution for detecting and redacting Personally Identifiable Information (PII) from financial documents using a hybrid approach (regex, spaCy, and transformer-based NER).

---

## 🔍 Example Output

```bash
PS C:\Users\BITTU\Desktop\financial-document-redaction> python demo.py
Testing PII detection...
```

## ✅ Regex Detection Results:
ssn: ['123-45-6789']
account_number: ['1234567890']
credit_card: ['4111-1111-1111-1111']
phone: ['1234567890', '555) 123-4567']

✅ Hybrid Detection Results:

Some weights of the model checkpoint at dslim/bert-base-NER were not used when initializing BertForTokenClassification:
['bert.pooler.dense.bias', 'bert.pooler.dense.weight']

- This IS expected if you are initializing BertForTokenClassification from the checkpoint of a model trained on another task or with another architecture (e.g. initializing a BertForSequenceClassification model from a BertForPreTraining model).
- This IS NOT expected if you are initializing BertForTokenClassification from the checkpoint of a model that you expect to be exactly identical (initializing a BertForSequenceClassification model from a BertForSequenceClassification model).

Device set to use cpu

🔐 Detected PII:

SSN:
123-45-6789 (regex, confidence: 0.90)

Account Number:
1234567890 (regex, confidence: 0.90)
123 (spacy, confidence: 0.85)
1234567890 (spacy, confidence: 0.85)
555 (spacy, confidence: 0.85)
123 (spacy, confidence: 0.85)
123 (spacy, confidence: 0.85)

Credit Card:
4111-1111-1111-1111 (regex, confidence: 0.90)

Phone:
1234567890 (regex, confidence: 0.90)
555) 123-4567 (regex, confidence: 0.90)

Name:
John Doe SSN (spacy, confidence: 0.85)
Main St (spacy, confidence: 0.85)
John Doe (transformer, confidence: 0.98)

Organization:
Credit Card (spacy, confidence: 0.85)

Location:
Anytown (spacy, confidence: 0.85)
USA (spacy, confidence: 0.85)
Main St (transformer, confidence: 0.97)
Anytown (transformer, confidence: 0.98)
USA (transformer, confidence: 1.00)


---

## 🚀 How It Works

The application uses:
- ✅ **Regex** for high-confidence patterns like SSNs, credit cards, and phone numbers.
- 🧠 **spaCy NER** for detecting names, organizations, and locations.
- 🤖 **Transformers (BERT)** for deep contextual NER on entities missed by other methods.

---

## 📂 Run the Demo

```bash
python demo.py
```

📦 Requirements

Python 3.7+
Transformers
spaCy
torch
scikit-learn
tqdm

Install dependencies with:
pip install -r requirements.txt

## output
```
PS C:\Users\BITTU\Desktop\financial-document-redaction> python demo.py
Testing PII detection...
Regex detection results:
  ssn: ['123-45-6789']
  account_number: ['1234567890']
  credit_card: ['4111-1111-1111-1111']
  phone: ['1234567890', '555) 123-4567']

Hybrid detection results:
Some weights of the model checkpoint at dslim/bert-base-NER were not used when initializing BertForTokenClassification: ['bert.pooler.dense.bias', 'bert.pooler.dense.weight']
- This IS expected if you are initializing BertForTokenClassification from the checkpoint of a model trained on another task or with another architecture (e.g. initializing a BertForSequenceClassification model from a BertForPreTraining model).
- This IS NOT expected if you are initializing BertForTokenClassification from the checkpoint of a model that you expect to be exactly identical (initializing a BertForSequenceClassification model from a BertForSequenceClassification model).
Device set to use cpu
  ssn:
    - 123-45-6789 (regex, confidence: 0.90)
  account_number:
    - 1234567890 (regex, confidence: 0.90)
    - 123 (spacy, confidence: 0.85)
    - 1234567890 (spacy, confidence: 0.85)
    - 555 (spacy, confidence: 0.85)
    - 123 (spacy, confidence: 0.85)
    - 123 (spacy, confidence: 0.85)
  credit_card:
    - 4111-1111-1111-1111 (regex, confidence: 0.90)
  phone:
    - 1234567890 (regex, confidence: 0.90)
    - 555) 123-4567 (regex, confidence: 0.90)
  name:
    - John Doe
    SSN (spacy, confidence: 0.85)
    - Main St (spacy, confidence: 0.85)
    - John Doe (transformer, confidence: 0.98)
  organization:
    - Credit Card (spacy, confidence: 0.85)
  location:
    - Anytown (spacy, confidence: 0.85)
    - USA (spacy, confidence: 0.85)
    - Main St (transformer, confidence: 0.97)
    - Anytown (transformer, confidence: 0.98)
    - USA (transformer, confidence: 1.00)
```
