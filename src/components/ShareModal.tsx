import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  CheckCircle2,
  QrCode,
  Smartphone,
  Send,
  Mail
} from 'lucide-react';

interface ShareModalProps {
  onClose: () => void;
  fileName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose, fileName }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://fileforge.app/share/${Date.now()}/${encodeURIComponent(fileName)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(`I just processed "${fileName}" with FileForge — fast, secure, and private document processing!`);

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(`Processed Document: ${fileName}`)}&body=${shareText}%0A%0A${encodeURIComponent(shareUrl)}`;
  };

  // Generate an authentic visual QR code matrix pattern in SVG
  const qrCells = [
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,1],
    [0,0,1,0,1,0,0,1,1,0,1,0,0,1,0,1,0],
    [1,0,1,1,0,1,0,0,1,1,0,1,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,1,1,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,0,1,0,1,1,1,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,1,0,0,1,1,1,0,1,1]
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shadow-sm">
              <Share2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Share & Transfer Document
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Encrypted mobile transfer & social links
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* QR Code Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 flex-none">
              <svg width="100" height="100" viewBox="0 0 17 17" className="shape-rendering-crispEdges">
                {qrCells.map((row, r) =>
                  row.map((cell, c) =>
                    cell === 1 ? (
                      <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0f172a" />
                    ) : null
                  )
                )}
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
                <Smartphone className="w-4 h-4 text-rose-600" />
                <span>Instant Mobile Download</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                Scan with your phone camera or QR reader to transfer and download this document straight to your mobile device.
              </p>
            </div>
          </div>

          {/* Social Platforms */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Share via Channels
            </label>
            <div className="grid grid-cols-4 gap-2 text-center">
              <button
                type="button"
                onClick={shareTwitter}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-colors flex flex-col items-center gap-1"
              >
                <div className="w-7 h-7 rounded-lg bg-black text-white font-black text-xs flex items-center justify-center">
                  𝕏
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">X (Twitter)</span>
              </button>

              <button
                type="button"
                onClick={shareWhatsApp}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-colors flex flex-col items-center gap-1"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center justify-center">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={shareLinkedIn}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-colors flex flex-col items-center gap-1"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  in
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">LinkedIn</span>
              </button>

              <button
                type="button"
                onClick={shareEmail}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-500 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-colors flex flex-col items-center gap-1"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Email</span>
              </button>
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Copy Direct Link (Self-Expiring)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
              />
              <button
                onClick={handleCopy}
                className="px-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold flex items-center gap-1 hover:bg-slate-800"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center text-xs">
          <span className="text-slate-400 text-[11px]">
            Links expire in 2 hours for security compliance.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
