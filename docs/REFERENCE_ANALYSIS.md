# Reference Analysis: iLovePDF Product Architecture & Feature Audit

## 1. Executive Summary
This document provides an exhaustive structural analysis of iLovePDF based on the 11-page specification, serving as the functional benchmark for **FileForge**.

### Core Architecture Pattern
```
Client ──► GET  /api/v1/start/{tool}    ──► { task_id, upload_url }
       ──► POST /api/v1/upload          ──► (multipart batch / cloud stream)
       ──► POST /api/v1/process         ──► { task_id, tool, options }
       ──► GET  /api/v1/download/{task} ──► single file or ZIP archive
```

## 2. Feature Taxonomies & Capabilities
1. **Organize PDF**:
   - `Merge`: Combines multiple PDFs into one unified document with custom ordering.
   - `Split`: Splits by Range (custom/fixed intervals), Page extraction, or Max file size.
   - `Remove / Extract`: Deletes or extracts selected pages into an isolated PDF.
   - `Organize`: Reorders, deletes, rotates, and adds pages.
   - `Scan to PDF`: Camera capture converted to high-contrast PDF.
2. **Optimize PDF**:
   - `Compress`: Extreme, Recommended, and Less levels, downsampling color images and deflating streams.
   - `Repair`: Cross-reference reconstruction (`qpdf`/`pdf-lib` stream scrubbing).
   - `OCR`: Searchable text layer synthesis over image-only pages.
3. **Convert to PDF**:
   - `Images to PDF`: Multi-image collage, orientation (portrait/landscape), margins, auto-scaling.
   - `Office / HTML to PDF`: Structural document rendering.
   - `PDF to PDF/A`: ISO archival compliance.
4. **Convert from PDF**:
   - `PDF to JPG`: Page rendering and image extraction into ZIP archives.
   - `PDF to Word / Excel / Markdown`: Text, table, and structure preservation.
5. **Edit & Annotate**:
   - `Edit PDF`: Overlay text, shapes, stamps, and drawn vectors.
   - `Watermark`: 3x3 anchor grid, custom text/image, opacity, rotation angle.
   - `Page Numbers`: Formatted `{n} of {total}`, margins, position grid.
   - `Crop`: Bounding box cropping (`setCropBox`/`setMediaBox`).
   - `Forms`: Form field inspection, manual insertion, and autofill.
6. **Security & Signatures**:
   - `Protect`: AES-256 password encryption.
   - `Unlock`: Password authentication and restriction stripping.
   - `Sign`: Visual signature pad, typed calligraphy, stamp placement, date stamping.
   - `Redact`: Content scrubbing and black-box sanitization.
   - `Compare`: Side-by-side textual and visual difference detection.
7. **Intelligence (AI)**:
   - `Summarizer`: Executive synopsis, bullet key points, tone selection.
   - `Translate`: Multi-language structural translation.
   - `PDF to Markdown`: LLM-ready clean markdown formatting.
8. **Automation & Workflows**:
   - Multi-step chained pipelines (e.g., Merge -> Compress -> Watermark -> Protect).
