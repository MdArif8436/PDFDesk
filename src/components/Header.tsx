import React, { useState } from 'react';
import {
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  Workflow,
  Calendar,
  History,
  Check
} from 'lucide-react';
import { TOOLS } from '../data/tools';
import { ToolDefinition, ToolCategory } from '../types';

interface HeaderProps {
  onSelectTool: (tool: ToolDefinition) => void;
  onSelectCategory?: (category: ToolCategory) => void;
  onOpenActivity: () => void;
  onOpenWorkflow: () => void;
  onOpenAuth: () => void;
  onOpenCalendar: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  activityCount: number;
  userEmail?: string;
  onSearchFocus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTool,
  onSelectCategory,
  onOpenActivity,
  onOpenWorkflow,
  onOpenAuth,
  onOpenCalendar,
  isDark,
  onToggleDark,
  activityCount,
  userEmail,
  onSearchFocus
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [privacyDropdownOpen, setPrivacyDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const scrollToTools = () => {
    const el = document.getElementById('tools-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleConvertClick = () => {
    if (onSelectCategory) {
      onSelectCategory('convert-to-pdf');
    }
    scrollToTools();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-xl text-white transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          
          {/* Zone 1: Brand Wordmark "// PDFNEST" */}
          <div className="flex items-center gap-8">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-white tracking-tight">
                <span className="font-mono text-xl sm:text-2xl font-black text-rose-500 tracking-tighter">
                  //
                </span>
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  PDFNEST
                </span>
              </div>
            </a>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
              {/* Tools Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  className="hover:text-white transition-colors flex items-center gap-1 py-1"
                >
                  <span>Tools</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {toolsDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setToolsDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-3 w-72 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 p-3 shadow-2xl z-40 max-h-[70vh] overflow-y-auto">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1 font-mono">
                        Quick Launch
                      </div>
                      <div className="space-y-0.5 mt-1">
                        {TOOLS.slice(0, 10).map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => {
                              onSelectTool(tool);
                              setToolsDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between transition-colors"
                          >
                            <span>{tool.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono uppercase">
                              {tool.category}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="pt-2 mt-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            scrollToTools();
                            setToolsDropdownOpen(false);
                          }}
                          className="w-full py-1.5 text-center text-xs text-rose-400 font-bold hover:underline"
                        >
                          View all 28 tools ↓
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Convert Tab */}
              <button
                onClick={handleConvertClick}
                className="hover:text-white transition-colors py-1 cursor-pointer"
              >
                Convert
              </button>

              {/* Privacy Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPrivacyDropdownOpen(!privacyDropdownOpen)}
                  className="hover:text-white transition-colors flex items-center gap-1 py-1 cursor-pointer"
                >
                  <span>Privacy</span>
                  <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform ${privacyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {privacyDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setPrivacyDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-3 w-80 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 p-4 shadow-2xl z-40 text-xs space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Zero Retention Guarantee</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        All documents are processed strictly in high-performance ephemeral memory. Files are never stored permanently and are automatically purged after 2 hours.
                      </p>
                      <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-rose-400" />
                          <span>AES-256 In-Transit Encryption</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>Client-first execution pipeline</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>

          {/* Zone 3: Actions & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick history badge */}
            <button
              onClick={onOpenActivity}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors relative"
              title="Recent Activity"
            >
              <History className="w-4 h-4" />
              {activityCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activityCount}
                </span>
              )}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={onToggleDark}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Log in / Request access */}
            <button
              onClick={onOpenAuth}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <span>{userEmail ? userEmail.split('@')[0] : 'Log in / Request access'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Try PDFNest free Capsule Button */}
            <button
              onClick={() => {
                const mergeTool = TOOLS.find((t) => t.id === 'merge');
                if (mergeTool) onSelectTool(mergeTool);
              }}
              className="px-4 py-2 text-xs font-bold text-white rounded-full border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              Try PDFNest free
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onToggleDark}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-full border border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Modal (Matches Image 8 reference) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm mt-12 bg-[#171b26]/95 backdrop-blur-2xl rounded-3xl border border-white/15 p-6 shadow-2xl relative text-white space-y-5">
            {/* Header in Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5 font-bold text-lg">
                <span className="text-rose-500 font-mono">//</span>
                <span>PDFNEST</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="space-y-3 text-base font-semibold">
              <button
                onClick={() => {
                  scrollToTools();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-xl hover:bg-white/10 transition-colors text-slate-200"
              >
                Tools
              </button>
              <button
                onClick={() => {
                  handleConvertClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-xl hover:bg-white/10 transition-colors text-slate-200"
              >
                Convert
              </button>
              
              <div className="border-t border-white/10 pt-3">
                <div className="text-xs uppercase font-bold text-slate-400 font-mono px-3 mb-2">
                  Privacy & Security
                </div>
                <div className="px-3 text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <Check className="w-3.5 h-3.5" /> 100% In-Memory Ephemeral Storage
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <Check className="w-3.5 h-3.5" /> 2-Hour Automatic Server Purge
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <Check className="w-3.5 h-3.5" /> End-to-End Encryption
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 space-y-2.5">
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/10 transition-colors text-slate-200 flex items-center justify-between"
                >
                  <span>{userEmail || 'Log in / Request access'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const mergeTool = TOOLS.find((t) => t.id === 'merge');
                    if (mergeTool) onSelectTool(mergeTool);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-full border border-white/30 bg-white/15 hover:bg-white/25 text-center font-bold text-sm text-white shadow-lg transition-all"
                >
                  Try PDFNest free
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
