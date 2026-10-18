import React, { useRef, useState, useEffect } from 'react';
import { Pen, Type, Upload, Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string, name: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureChange }) => {
  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [signerName, setSignerName] = useState('John Doe');
  const [selectedFont, setSelectedFont] = useState('cursive');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    if (tab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [tab]);

  // Handle Type Signature generation
  useEffect(() => {
    if (tab === 'type') {
      const offscreen = document.createElement('canvas');
      offscreen.width = 400;
      offscreen.height = 120;
      const ctx = offscreen.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e293b';
        ctx.font = `italic 36px ${selectedFont}`;
        ctx.textBaseline = 'middle';
        ctx.fillText(signerName || 'Signature', 20, 60);
        onSignatureChange(offscreen.toDataURL('image/png'), signerName);
      }
    }
  }, [signerName, selectedFont, tab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      onSignatureChange(canvasRef.current.toDataURL('image/png'), signerName);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSignatureChange('', signerName);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) onSignatureChange(result, signerName);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setTab('draw')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            tab === 'draw'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Pen className="w-3.5 h-3.5" /> Draw
        </button>
        <button
          type="button"
          onClick={() => setTab('type')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            tab === 'type'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Type className="w-3.5 h-3.5" /> Type
        </button>
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            tab === 'upload'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          Signer Full Name
        </label>
        <input
          type="text"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          placeholder="e.g. John Doe"
          className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      {tab === 'draw' && (
        <div>
          <div className="relative border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={360}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-36 cursor-crosshair touch-none"
            />
            <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 pointer-events-none">
              Sign above the line
            </div>
            <button
              type="button"
              onClick={clearCanvas}
              className="absolute top-2 right-2 p-1.5 text-xs text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200"
              title="Clear Canvas"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {tab === 'type' && (
        <div className="space-y-3">
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-center">
            <span
              style={{ fontFamily: selectedFont }}
              className="text-2xl text-slate-800 dark:text-slate-200 italic"
            >
              {signerName || 'Your Signature'}
            </span>
          </div>

          <div className="flex gap-2">
            {['cursive', 'serif', 'sans-serif'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFont(f)}
                className={`flex-1 py-1.5 text-xs rounded-lg border capitalize ${
                  selectedFont === f
                    ? 'border-rose-600 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                Style {f === 'cursive' ? '1' : f === 'serif' ? '2' : '3'}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'upload' && (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileUpload}
            id="sig-upload"
            className="hidden"
          />
          <label htmlFor="sig-upload" className="cursor-pointer block text-xs text-slate-500">
            <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
            <span className="font-semibold text-rose-600">Click to upload signature</span> (PNG or JPG)
          </label>
        </div>
      )}
    </div>
  );
};
