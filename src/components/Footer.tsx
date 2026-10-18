import React from 'react';
import { FileText, Shield, Heart, ExternalLink } from 'lucide-react';
import { ToolDefinition } from '../types';
import { TOOLS } from '../data/tools';

interface FooterProps {
  onSelectTool: (tool: ToolDefinition) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool }) => {
  const organizeTools = TOOLS.filter((t) => t.category === 'organize').slice(0, 5);
  const optimizeTools = TOOLS.filter((t) => t.category === 'optimize');
  const convertTools = TOOLS.filter((t) => t.category === 'convert-to' || t.category === 'convert-from').slice(0, 5);
  const securityTools = TOOLS.filter((t) => t.category === 'security' || t.category === 'edit').slice(0, 5);

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-sm">
                <FileText className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                FileForge
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Full-featured document processing suite inspired by iLovePDF. Fast, private, and secure browser-based and server-side PDF manipulation with zero permanent storage.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> ISO 27001 Aligned
              </span>
              <span>•</span>
              <span>GDPR Compliant</span>
              <span>•</span>
              <span>2-Hour Auto Purge</span>
            </div>
          </div>

          {/* Column 1: Organize */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Organize PDF
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              {organizeTools.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelectTool(t)}
                    className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-left"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Optimize & Convert */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Optimize & Convert
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              {optimizeTools.concat(convertTools).slice(0, 5).map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelectTool(t)}
                    className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-left"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Security & Edit */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Security & Edit
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              {securityTools.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelectTool(t)}
                    className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-left"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} FileForge Suite. Built for professionals, students, and teams worldwide.
          </div>

          <div className="flex items-center gap-4">
            <a href="/api/v1/health" target="_blank" rel="noreferrer" className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1">
              API Status <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#privacy" className="hover:text-slate-600 dark:hover:text-slate-200">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-600 dark:hover:text-slate-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
