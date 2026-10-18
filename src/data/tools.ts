import { ToolDefinition } from '../types';

export const TOOLS: ToolDefinition[] = [
  // 1. ORGANIZE PDF
  {
    id: 'merge',
    name: 'Merge PDF',
    category: 'organize',
    description: 'Combine multiple PDF files into a single unified document in your specified order.',
    iconName: 'Layers',
    accentColor: 'from-red-500 to-rose-600',
    accepts: ['.pdf'],
    maxFiles: 25,
    apiEndpoint: '/api/v1/pdf/merge'
  },
  {
    id: 'split',
    name: 'Split PDF',
    category: 'organize',
    description: 'Separate pages or extract specific page ranges into individual PDF documents or a ZIP.',
    iconName: 'Scissors',
    accentColor: 'from-amber-500 to-orange-600',
    accepts: ['.pdf'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/pdf/split'
  },
  {
    id: 'organize',
    name: 'Organize PDF',
    category: 'organize',
    description: 'Sort, reorder, rotate, or delete individual pages with an interactive thumbnail board.',
    iconName: 'Grid',
    accentColor: 'from-orange-500 to-amber-600',
    accepts: ['.pdf'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/pdf/organize'
  },
  {
    id: 'rotate',
    name: 'Rotate PDF',
    category: 'organize',
    description: 'Rotate individual pages or entire documents clockwise or counter-clockwise by 90° intervals.',
    iconName: 'RotateCw',
    accentColor: 'from-purple-500 to-indigo-600',
    accepts: ['.pdf'],
    maxFiles: 10,
    apiEndpoint: '/api/v1/pdf/rotate'
  },
  {
    id: 'scan',
    name: 'Scan to PDF',
    category: 'organize',
    description: 'Capture documents with your device camera and convert directly to a clean PDF.',
    iconName: 'Camera',
    accentColor: 'from-emerald-500 to-teal-600',
    accepts: ['.jpg', '.jpeg', '.png'],
    maxFiles: 10,
    apiEndpoint: '/api/v1/convert/to-pdf'
  },

  // 2. OPTIMIZE PDF
  {
    id: 'compress',
    name: 'Compress PDF',
    category: 'optimize',
    description: 'Reduce file size while optimizing quality. Choose Extreme, Recommended, or Less compression.',
    iconName: 'Minimize2',
    accentColor: 'from-emerald-500 to-green-600',
    accepts: ['.pdf'],
    maxFiles: 10,
    apiEndpoint: '/api/v1/pdf/compress'
  },
  {
    id: 'repair',
    name: 'Repair PDF',
    category: 'optimize',
    description: 'Fix corrupt or unreadable PDFs and restore cross-reference tables and damaged streams.',
    iconName: 'Wrench',
    accentColor: 'from-cyan-500 to-blue-600',
    accepts: ['.pdf'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/pdf/repair'
  },
  {
    id: 'ocr',
    name: 'OCR PDF',
    category: 'optimize',
    description: 'Convert scanned, image-only documents into searchable PDFs with selectable text layers.',
    iconName: 'ScanText',
    accentColor: 'from-blue-600 to-indigo-600',
    badge: 'Searchable',
    accepts: ['.pdf'],
    maxFiles: 5,
    apiEndpoint: '/api/v1/pdf/repair'
  },

  // 3. CONVERT TO PDF
  {
    id: 'img2pdf',
    name: 'Image to PDF',
    category: 'convert-to',
    description: 'Convert JPG, PNG, and WebP images into a styled PDF with custom margins and orientation.',
    iconName: 'Image',
    accentColor: 'from-yellow-500 to-amber-600',
    accepts: ['.jpg', '.jpeg', '.png', '.webp'],
    maxFiles: 50,
    apiEndpoint: '/api/v1/convert/to-pdf'
  },
  {
    id: 'word2pdf',
    name: 'Word to PDF',
    category: 'convert-to',
    description: 'Convert Microsoft Word documents (DOC, DOCX) to standardized PDF files.',
    iconName: 'FileText',
    accentColor: 'from-blue-500 to-blue-700',
    accepts: ['.doc', '.docx'],
    maxFiles: 5,
    apiEndpoint: '/api/v1/convert/to-pdf'
  },
  {
    id: 'ppt2pdf',
    name: 'PowerPoint to PDF',
    category: 'convert-to',
    description: 'Transform PowerPoint presentations (PPT, PPTX) into easy-to-view PDF slides.',
    iconName: 'Presentation',
    accentColor: 'from-orange-600 to-red-600',
    accepts: ['.ppt', '.pptx'],
    maxFiles: 5,
    apiEndpoint: '/api/v1/convert/to-pdf'
  },
  {
    id: 'excel2pdf',
    name: 'Excel to PDF',
    category: 'convert-to',
    description: 'Convert spreadsheets (XLS, XLSX) into PDF tables with custom page fitting.',
    iconName: 'Table',
    accentColor: 'from-green-600 to-emerald-700',
    accepts: ['.xls', '.xlsx'],
    maxFiles: 5,
    apiEndpoint: '/api/v1/convert/to-pdf'
  },
  {
    id: 'html2pdf',
    name: 'HTML to PDF',
    category: 'convert-to',
    description: 'Convert web pages by URL or raw HTML files into high-fidelity PDF documents.',
    iconName: 'Globe',
    accentColor: 'from-indigo-500 to-violet-600',
    accepts: ['.html', '.htm'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/convert/to-pdf'
  },
  {
    id: 'pdf2pdfa',
    name: 'PDF to PDF/A',
    category: 'convert-to',
    description: 'Convert standard documents to PDF/A format for ISO-compliant long-term archiving.',
    iconName: 'Archive',
    accentColor: 'from-slate-600 to-gray-800',
    accepts: ['.pdf'],
    maxFiles: 5,
    apiEndpoint: '/api/v1/pdf/repair'
  },

  // 4. CONVERT FROM PDF
  {
    id: 'pdf2jpg',
    name: 'PDF to JPG',
    category: 'convert-from',
    description: 'Extract all pages as high-resolution JPG images or pull out all embedded photos into a ZIP.',
    iconName: 'FileImage',
    accentColor: 'from-amber-500 to-yellow-600',
    accepts: ['.pdf'],
    maxFiles: 5,
    apiEndpoint: '/api/v1/convert/from-pdf'
  },
  {
    id: 'pdf2word',
    name: 'PDF to Word',
    category: 'convert-from',
    description: 'Extract PDF content into editable Microsoft Word DOCX documents with preserved layout.',
    iconName: 'FileText',
    accentColor: 'from-blue-600 to-cyan-600',
    accepts: ['.pdf'],
    maxFiles: 5,
    apiEndpoint: '/api/v1/convert/from-pdf'
  },
  {
    id: 'pdf2excel',
    name: 'PDF to Excel',
    category: 'convert-from',
    description: 'Pull tables and financial data from PDF reports directly into editable XLSX spreadsheets.',
    iconName: 'Sheet',
    accentColor: 'from-emerald-600 to-teal-700',
    accepts: ['.pdf'],
    maxFiles: 5,
    apiEndpoint: '/api/v1/convert/from-pdf'
  },
  {
    id: 'pdf2md',
    name: 'PDF to Markdown',
    category: 'convert-from',
    description: 'Extract structure-aware Markdown (.md) preserving headings, lists, tables, and LLM formatting.',
    iconName: 'Code',
    accentColor: 'from-slate-700 to-slate-900',
    badge: 'LLM Ready',
    accepts: ['.pdf'],
    maxFiles: 5,
    apiEndpoint: '/api/v1/convert/from-pdf'
  },

  // 5. EDIT PDF
  {
    id: 'edit',
    name: 'Edit PDF',
    category: 'edit',
    description: 'Add custom text, shape overlays, images, freehand drawings, and annotations directly to pages.',
    iconName: 'Edit3',
    accentColor: 'from-pink-500 to-rose-600',
    accepts: ['.pdf'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/pdf/organize'
  },
  {
    id: 'watermark',
    name: 'Watermark PDF',
    category: 'edit',
    description: 'Stamp custom text or logos across pages with adjustable 3×3 positioning, opacity, and rotation.',
    iconName: 'Stamp',
    accentColor: 'from-rose-500 to-red-600',
    accepts: ['.pdf'],
    maxFiles: 10,
    apiEndpoint: '/api/v1/pdf/watermark'
  },
  {
    id: 'pagenum',
    name: 'Page Numbers',
    category: 'edit',
    description: 'Insert dynamic page numbering with customizable format templates, positioning, and margins.',
    iconName: 'Hash',
    accentColor: 'from-violet-500 to-purple-600',
    accepts: ['.pdf'],
    maxFiles: 10,
    apiEndpoint: '/api/v1/pdf/page-numbers'
  },
  {
    id: 'crop',
    name: 'Crop PDF',
    category: 'edit',
    description: 'Trim margins or crop pages to a specific bounding box for cleaner print and screen viewing.',
    iconName: 'Crop',
    accentColor: 'from-sky-500 to-blue-600',
    accepts: ['.pdf'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/pdf/crop'
  },
  {
    id: 'forms',
    name: 'PDF Forms',
    category: 'edit',
    description: 'Fill in interactive form fields, check checkboxes, and inject fillable input elements.',
    iconName: 'CheckSquare',
    accentColor: 'from-indigo-600 to-blue-600',
    accepts: ['.pdf'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/pdf/organize'
  },

  // 6. SECURITY & SIGNATURES
  {
    id: 'sign',
    name: 'Sign PDF',
    category: 'security',
    description: 'Create a visual drawn signature, type your signature, stamp initials, and seal with audit stamp.',
    iconName: 'PenTool',
    accentColor: 'from-blue-600 to-indigo-700',
    badge: 'Popular',
    accepts: ['.pdf'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/pdf/sign'
  },
  {
    id: 'protect',
    name: 'Protect PDF',
    category: 'security',
    description: 'Encrypt your document with AES-256 password protection and restrict unauthorized copying.',
    iconName: 'Lock',
    accentColor: 'from-red-600 to-rose-700',
    accepts: ['.pdf'],
    maxFiles: 10,
    apiEndpoint: '/api/v1/pdf/protect'
  },
  {
    id: 'unlock',
    name: 'Unlock PDF',
    category: 'security',
    description: 'Remove password security and viewing restrictions from authorized PDF files.',
    iconName: 'Unlock',
    accentColor: 'from-emerald-500 to-green-600',
    accepts: ['.pdf'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/pdf/unlock'
  },
  {
    id: 'redact',
    name: 'Redact PDF',
    category: 'security',
    description: 'Permanently remove and sanitize sensitive confidential text and graphics from the document.',
    iconName: 'EyeOff',
    accentColor: 'from-gray-700 to-gray-900',
    accepts: ['.pdf'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/pdf/watermark'
  },
  {
    id: 'compare',
    name: 'Compare PDF',
    category: 'security',
    description: 'Inspect two versions of a document side-by-side to highlight page differences and revisions.',
    iconName: 'GitCompare',
    accentColor: 'from-purple-600 to-indigo-700',
    accepts: ['.pdf'],
    maxFiles: 2,
    apiEndpoint: '/api/v1/pdf/compare'
  },

  // 7. PDF INTELLIGENCE (AI)
  {
    id: 'summarizer',
    name: 'AI Summarizer',
    category: 'intelligence',
    description: 'Extract executive summaries and key takeaway bullet points powered by Gemini AI intelligence.',
    iconName: 'Sparkles',
    accentColor: 'from-violet-600 to-fuchsia-600',
    badge: 'Gemini AI',
    accepts: ['.pdf'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/pdf/summarize'
  },
  {
    id: 'translate',
    name: 'AI Translate',
    category: 'intelligence',
    description: 'Translate PDF documents into Spanish, French, German, Arabic, Japanese, and 30+ languages.',
    iconName: 'Languages',
    accentColor: 'from-teal-500 to-emerald-600',
    badge: 'Gemini AI',
    accepts: ['.pdf'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/pdf/translate'
  },

  // 8. IMAGE PROCESSING SUITE
  {
    id: 'resize-img',
    name: 'Resize Image',
    category: 'image',
    description: 'Reduce or increase image dimensions by percentage, exact pixels, or change print DPI resolution.',
    iconName: 'Maximize2',
    accentColor: 'from-sky-500 to-indigo-600',
    badge: 'High Precision',
    accepts: ['.jpg', '.jpeg', '.png', '.webp', '.avif'],
    maxFiles: 50,
    apiEndpoint: '/api/v1/image/resize'
  },
  {
    id: 'compress-img',
    name: 'Compress Image',
    category: 'image',
    description: 'Drastically reduce image file sizes with lossless or visual-preserving compression.',
    iconName: 'Minimize2',
    accentColor: 'from-emerald-500 to-teal-600',
    badge: 'Instant',
    accepts: ['.jpg', '.jpeg', '.png', '.webp'],
    maxFiles: 50,
    apiEndpoint: '/api/v1/image/compress'
  },
  {
    id: 'crop-img',
    name: 'Crop Image',
    category: 'image',
    description: 'Crop images to 1:1 square, 4:3, 16:9 widescreen, or custom bounding boxes.',
    iconName: 'Crop',
    accentColor: 'from-amber-500 to-orange-600',
    accepts: ['.jpg', '.jpeg', '.png', '.webp'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/image/crop'
  },
  {
    id: 'rotate-img',
    name: 'Rotate & Flip Image',
    category: 'image',
    description: 'Rotate images by 90°, 180°, or mirror horizontally and vertically.',
    iconName: 'RotateCw',
    accentColor: 'from-purple-500 to-pink-600',
    accepts: ['.jpg', '.jpeg', '.png', '.webp'],
    maxFiles: 20,
    apiEndpoint: '/api/v1/image/rotate'
  },
  {
    id: 'convert-img',
    name: 'Convert Image',
    category: 'image',
    description: 'Convert between JPG, PNG, WebP, AVIF, TIFF, and GIF formats in batch.',
    iconName: 'RefreshCw',
    accentColor: 'from-blue-600 to-cyan-600',
    accepts: ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif', '.avif'],
    maxFiles: 50,
    apiEndpoint: '/api/v1/image/convert'
  },
  {
    id: 'upscale-img',
    name: 'Upscale Image',
    category: 'image',
    description: 'Enhance resolution 2× or 4× using Lanczos3 super-sampling and edge clarity filter.',
    iconName: 'Sparkles',
    accentColor: 'from-fuchsia-600 to-pink-600',
    badge: 'Super Res',
    accepts: ['.jpg', '.jpeg', '.png', '.webp'],
    maxFiles: 1,
    apiEndpoint: '/api/v1/image/upscale'
  },

  // 9. WORKFLOWS & CALENDAR SCHEDULING
  {
    id: 'workflow',
    name: 'Workflow Pipeline',
    category: 'workflow',
    description: 'Chain multiple tools into an automated batch sequence (e.g., Merge → Compress → Watermark → Protect).',
    iconName: 'Workflow',
    accentColor: 'from-rose-600 to-indigo-600',
    badge: 'Automation',
    accepts: ['.pdf'],
    maxFiles: 10,
    apiEndpoint: '/api/v1/workflows'
  },
  {
    id: 'schedule',
    name: 'Calendar & Scheduled Jobs',
    category: 'workflow',
    description: 'Sync recurring document processing reviews and audits to Google Calendar & Outlook.',
    iconName: 'Calendar',
    accentColor: 'from-indigo-600 to-blue-700',
    badge: 'Calendar Sync',
    accepts: ['.pdf', '.jpg', '.png'],
    maxFiles: 10,
    apiEndpoint: '/api/v1/calendar/event'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Tools', count: TOOLS.length },
  { id: 'organize', label: 'Organize', count: TOOLS.filter(t => t.category === 'organize').length },
  { id: 'optimize', label: 'Optimize', count: TOOLS.filter(t => t.category === 'optimize').length },
  { id: 'convert-to', label: 'Convert to PDF', count: TOOLS.filter(t => t.category === 'convert-to').length },
  { id: 'convert-from', label: 'Convert from PDF', count: TOOLS.filter(t => t.category === 'convert-from').length },
  { id: 'edit', label: 'Edit & Annotate', count: TOOLS.filter(t => t.category === 'edit').length },
  { id: 'image', label: 'Image Suite', count: TOOLS.filter(t => t.category === 'image').length },
  { id: 'security', label: 'Security & Sign', count: TOOLS.filter(t => t.category === 'security').length },
  { id: 'intelligence', label: 'AI Intelligence', count: TOOLS.filter(t => t.category === 'intelligence').length },
  { id: 'workflow', label: 'Workflows & Sync', count: TOOLS.filter(t => t.category === 'workflow').length }
];
