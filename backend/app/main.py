"""
FileForge Backend API - FastAPI Service
Provides high-performance document processing for Merge, Split, Compress,
Rotate, Watermark, and Page Numbering operations.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import io
from pypdf import PdfWriter, PdfReader

app = FastAPI(
    title="FileForge API",
    description="Full-featured PDF processing backend inspired by iLovePDF",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FileForge Python Backend",
        "version": "1.0.0"
    }

@app.post("/api/v1/pdf/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files are required to merge.")

    merger = PdfWriter()
    try:
        for f in files:
            content = await f.read()
            reader = PdfReader(io.BytesIO(content))
            for page in reader.pages:
                merger.add_page(page)

        output = io.BytesIO()
        merger.write(output)
        output.seek(0)

        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="fileforge-merged.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/pdf/rotate")
async def rotate_pdf(file: UploadFile = File(...), angle: int = Form(90)):
    content = await file.read()
    try:
        reader = PdfReader(io.BytesIO(content))
        writer = PdfWriter()

        for page in reader.pages:
            page.rotate(angle)
            writer.add_page(page)

        output = io.BytesIO()
        writer.write(output)
        output.seek(0)

        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="fileforge-rotated.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/pdf/compress")
async def compress_pdf(file: UploadFile = File(...)):
    content = await file.read()
    orig_size = len(content)
    try:
        reader = PdfReader(io.BytesIO(content))
        writer = PdfWriter()

        for page in reader.pages:
            page.compress_content_streams()
            writer.add_page(page)

        output = io.BytesIO()
        writer.write(output)
        output.seek(0)
        comp_size = len(output.getvalue())

        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={
                "Content-Disposition": 'attachment; filename="fileforge-compressed.pdf"',
                "X-Original-Size": str(orig_size),
                "X-Compressed-Size": str(comp_size)
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
