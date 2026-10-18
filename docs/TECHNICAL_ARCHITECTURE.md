# FileForge Technical Architecture & Security Specifications

## 1. System Components
- **Unified Full-Stack Express + Vite Server (`server.ts`)**: Serves API routes at `/api/v1/*` and proxies Vite React frontend on port 3000.
- **Python FastAPI Service (`backend/app/main.py`)**: Standalone FastAPI service providing alternative Python PDF processing using `pypdf`, `reportlab`, and `Pillow`.
- **Client Processing & PDF Rendering**: React + `pdf-lib` + Tailwind CSS + Lucide React icons for instant preview, zero-lag local processing, and server-side fallback.
- **AI Intelligence Subsystem**: Powered by `@google/genai` (Gemini 2.5 Flash) via server proxy route for summarization, smart page boundary analysis, and translation.

## 2. Security & Compliance
- **Ephemeral Storage**: Files processed in-memory (`Buffer`) or isolated temp folders (`/tmp/fileforge-*`) and wiped after download or 2-hour timeout.
- **Strict Input Validation**: Magic byte inspection for `%PDF-` and image headers, bounds checking, and path traversal prevention.
- **Zero Client-Side Secrets**: All Gemini API keys and secrets stay safely on the server backend.
