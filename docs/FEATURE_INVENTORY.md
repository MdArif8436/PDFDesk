# FileForge Feature Inventory & Traceability Matrix

| Tool ID | Category | Tool Name | Accepted Inputs | Output Format | Processing Method | Backend Endpoint | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `merge` | Organize | Merge PDF | 2+ PDF files | Combined PDF | `pdf-lib` copyPages | `POST /api/v1/pdf/merge` | Active |
| `split` | Organize | Split PDF | 1 PDF file | PDF or ZIP | Range & Page extract | `POST /api/v1/pdf/split` | Active |
| `organize`| Organize | Organize PDF | 1 PDF file | PDF | Page reorder/rotate/delete | `POST /api/v1/pdf/organize` | Active |
| `rotate` | Organize | Rotate PDF | 1+ PDF files | Rotated PDF | Degree rotation (90/180/270) | `POST /api/v1/pdf/rotate` | Active |
| `compress`| Optimize | Compress PDF | 1+ PDF files | Compressed PDF | Stream deflating / Ghostscript | `POST /api/v1/pdf/compress` | Active |
| `repair` | Optimize | Repair PDF | 1 PDF file | Recovered PDF | PDF syntax reconstruction | `POST /api/v1/pdf/repair` | Active |
| `ocr` | Optimize | OCR PDF | 1 PDF file | Searchable PDF | OCR / Tesseract wrapper | `POST /api/v1/pdf/ocr` | Active |
| `img2pdf` | Convert To | Image to PDF | 1+ JPG, PNG, WEBP | PDF | `pdf-lib` embed image canvas | `POST /api/v1/convert/to-pdf` | Active |
| `pdf2img` | Convert From| PDF to JPG | 1 PDF file | ZIP of JPGs | Canvas/Ghostscript rendering | `POST /api/v1/convert/from-pdf` | Active |
| `pdf2md` | Convert From| PDF to Markdown | 1 PDF file | `.md` file | Structural text extraction | `POST /api/v1/convert/from-pdf` | Active |
| `watermark`| Edit | Watermark PDF | 1+ PDF files | Watermarked PDF | 3x3 grid text & opacity | `POST /api/v1/pdf/watermark` | Active |
| `pagenum` | Edit | Page Numbers | 1+ PDF files | Numbered PDF | `{n} of {total}` typography | `POST /api/v1/pdf/page-numbers` | Active |
| `crop` | Edit | Crop PDF | 1 PDF file | Cropped PDF | CropBox/MediaBox adjusting | `POST /api/v1/pdf/crop` | Active |
| `forms` | Edit | PDF Forms | 1 PDF file | Form-enabled PDF| Interactive form field inject | `POST /api/v1/pdf/forms` | Active |
| `edit` | Edit | Edit PDF | 1 PDF file | Edited PDF | Text/drawing/shape overlay | `POST /api/v1/pdf/edit` | Active |
| `protect` | Security | Protect PDF | 1+ PDF files | Encrypted PDF | Password encryption | `POST /api/v1/pdf/protect` | Active |
| `unlock` | Security | Unlock PDF | 1 PDF file | Unlocked PDF | Password validation/decrypt | `POST /api/v1/pdf/unlock` | Active |
| `sign` | Security | Sign PDF | 1 PDF file | Signed PDF | Visual stamp & audit trail | `POST /api/v1/pdf/sign` | Active |
| `redact` | Security | Redact PDF | 1 PDF file | Redacted PDF | Text stream scrub & blackout | `POST /api/v1/pdf/redact` | Active |
| `compare` | Security | Compare PDF | 2 PDF files | Diff report / PDF | Text diff match engine | `POST /api/v1/pdf/compare` | Active |
| `ai-sum` | Intelligence| AI Summarizer | 1 PDF file | JSON / TXT / MD | Gemini 2.5 Flash / local LLM | `POST /api/v1/pdf/summarize` | Active |
| `ai-trans`| Intelligence| AI Translate | 1 PDF file | Translated text/PDF | Multi-lingual translation | `POST /api/v1/pdf/translate` | Active |
| `workflow`| Automation | Workflows | 1+ files | Chained result | Pipeline runner (e.g. 1->2->3) | `POST /api/v1/workflows` | Active |
