import io
import pytest
from pypdf import PdfWriter, PdfReader

def create_sample_pdf(text: str = "Test Page") -> bytes:
    writer = PdfWriter()
    writer.add_blank_page(width=200, height=200)
    out = io.BytesIO()
    writer.write(out)
    return out.getvalue()

def test_pdf_creation_and_merge():
    pdf1 = create_sample_pdf("Doc 1")
    pdf2 = create_sample_pdf("Doc 2")

    merger = PdfWriter()
    merger.add_page(PdfReader(io.BytesIO(pdf1)).pages[0])
    merger.add_page(PdfReader(io.BytesIO(pdf2)).pages[0])

    out = io.BytesIO()
    merger.write(out)
    merged_bytes = out.getvalue()

    result_reader = PdfReader(io.BytesIO(merged_bytes))
    assert len(result_reader.pages) == 2

def test_pdf_rotation():
    pdf = create_sample_pdf()
    reader = PdfReader(io.BytesIO(pdf))
    page = reader.pages[0]
    page.rotate(90)
    assert page.rotation == 90
