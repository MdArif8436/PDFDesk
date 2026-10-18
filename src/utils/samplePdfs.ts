import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Creates sample PDF files in memory for instant interactive testing.
 */
export async function createSamplePdfFiles(): Promise<File[]> {
  const samples = [
    { name: 'doc1.pdf', title: 'Document 1: Project Overview', color: rgb(0.9, 0.1, 0.2) },
    { name: 'doc2.pdf', title: 'Document 2: Architecture Specifications', color: rgb(0.1, 0.5, 0.9) },
    { name: 'doc3.pdf', title: 'Document 3: Security & Verification Audit', color: rgb(0.1, 0.7, 0.4) }
  ];

  const files: File[] = [];

  for (const s of samples) {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595.28, 841.89]); // A4
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await doc.embedFont(StandardFonts.Helvetica);

    // Title
    page.drawText('PDFNEST / FILEFORGE SUITE', {
      x: 50,
      y: 780,
      size: 14,
      font,
      color: s.color
    });

    page.drawText(s.title, {
      x: 50,
      y: 740,
      size: 20,
      font,
      color: rgb(0.1, 0.1, 0.1)
    });

    page.drawText('Processed securely in ephemeral memory with zero permanent retention.', {
      x: 50,
      y: 710,
      size: 11,
      font: regularFont,
      color: rgb(0.4, 0.4, 0.4)
    });

    // Content lines
    for (let i = 0; i < 8; i++) {
      page.drawLine({
        start: { x: 50, y: 660 - i * 25 },
        end: { x: 545, y: 660 - i * 25 },
        thickness: 1,
        color: rgb(0.85, 0.85, 0.85)
      });
    }

    page.drawText('Generated for verified instant document workflows.', {
      x: 50,
      y: 420,
      size: 10,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5)
    });

    const pdfBytes = await doc.save();
    const file = new File([pdfBytes], s.name, { type: 'application/pdf' });
    files.push(file);
  }

  return files;
}
