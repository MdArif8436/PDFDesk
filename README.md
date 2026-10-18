# FileForge — Complete Premium PDF & Document Processing Suite

FileForge is a production-grade, full-stack document processing suite inspired by iLovePDF, offering 28 tools spanning **Organize, Optimize, Convert to/from PDF, Edit & Annotate, Security & Signatures, AI Intelligence, and Multi-Step Workflows**.

---

## Key Features

1. **Organize PDF**: Merge PDF, Split PDF (Extract Pages, Custom Ranges, Fixed intervals), Organize (Reorder, Rotate, Delete), Rotate (90°, 180°, 270°), Scan to PDF.
2. **Optimize PDF**: Compress PDF (Extreme, Recommended, Less), Repair corrupted PDFs, OCR PDF (Searchable text layer).
3. **Convert to PDF**: JPG/PNG/WebP to PDF, Word (DOCX) to PDF, PowerPoint (PPTX) to PDF, Excel (XLSX) to PDF, HTML to PDF, PDF/A Archival.
4. **Convert from PDF**: PDF to JPG (ZIP export), PDF to Word, PDF to Excel, PDF to PowerPoint, PDF to Markdown (LLM-ready).
5. **Edit & Annotate**: Edit PDF, Watermark (3×3 position grid, opacity, rotation angle), Page Numbers (`{n} of {total}`), Crop PDF, Interactive Forms.
6. **Security & Signatures**: Sign PDF (Interactive canvas pad, typed calligraphy fonts, audit stamp), Protect (AES-256 encryption), Unlock (Password decryption), Redact (Content scrub), Compare PDF (Side-by-side textual diff).
7. **PDF Intelligence (AI)**: AI Summarizer (Executive summaries and key points via Gemini 2.5 Flash), AI Translate (30+ languages).
8. **Automated Workflows**: Multi-step pipeline builder (e.g. Merge → Compress → Watermark → Protect).
9. **Privacy & Security**: Ephemeral memory processing with strict 2-hour automatic purge policy. No permanent file retention.
10. **Modern UI/UX**: Dark mode, responsive mobile/tablet layout, drag-and-drop batch upload, real-time activity tracker.

---

## Quick Start (Unified Full-Stack Express Server)

The applet runs as a full-stack unified service on port 3000:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## Windows / VS Code Step-by-Step Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer)
- [Python](https://www.python.org/) (version 3.10 or newer)
- [VS Code](https://code.visualstudio.com/)

### Step 1: Open Project in VS Code
1. Launch VS Code.
2. Go to **File → Open Folder...** and select the `fileforge` project folder.

### Step 2: Configure Environment Variables
Open PowerShell inside VS Code (`Ctrl + ~`) and copy the example environment file:
```powershell
Copy-Item .env.example .env
```
*(Optional: Add your Gemini API key inside `.env` to enable AI Summarization & Translation)*.

### Step 3: Start Frontend & API (Unified Mode)
In your PowerShell terminal:
```powershell
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Step 4 (Optional): Running the Standalone Python FastAPI Backend
If you prefer running the Python FastAPI backend on port 8000:
1. Open a second PowerShell terminal in VS Code:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --port 8000 --reload
```
2. Verify API Health:
```powershell
Invoke-RestMethod http://localhost:8000/api/v1/health
```

---

## API Documentation & Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health status and available PDF engines |
| `POST` | `/api/v1/pdf/merge` | Combine multiple PDF files |
| `POST` | `/api/v1/pdf/split` | Split PDF by range, pages, or interval |
| `POST` | `/api/v1/pdf/compress` | Compress PDF and return size comparison |
| `POST` | `/api/v1/pdf/rotate` | Rotate pages by 90°, 180°, or 270° |
| `POST` | `/api/v1/pdf/watermark`| Apply watermark with 3×3 grid anchor & opacity |
| `POST` | `/api/v1/pdf/page-numbers`| Insert page numbering with format template |
| `POST` | `/api/v1/convert/to-pdf` | Convert images to styled PDF |
| `POST` | `/api/v1/convert/from-pdf` | Convert PDF to Markdown or plain text |
| `POST` | `/api/v1/pdf/sign` | Stamp drawn or typed signature with audit seal |
| `POST` | `/api/v1/pdf/protect` | Encrypt document with AES-256 password |
| `POST` | `/api/v1/pdf/unlock` | Decrypt password-protected document |
| `POST` | `/api/v1/pdf/crop` | Trim document margins |
| `POST` | `/api/v1/pdf/compare` | Compare two PDF documents side-by-side |
| `POST` | `/api/v1/pdf/summarize` | Generate AI summary using Gemini model |
| `POST` | `/api/v1/pdf/translate` | Translate PDF into target language |
| `POST` | `/api/v1/workflows` | Execute chained multi-step pipeline |

---

## Security & Compliance
- **Ephemeral Processing**: Files are loaded in temporary memory buffers and purged immediately following operation completion.
- **GDPR & ISO 27001 Aligned**: Complies with 2-hour retention boundaries and data privacy standards.
- **Client Security**: No private API keys or credentials exposed to the frontend browser bundle.
