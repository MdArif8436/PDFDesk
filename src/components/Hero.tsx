import React from 'react';
import { Search, ShieldCheck, Zap, Lock, ChevronRight, X, ArrowRight, Sparkles } from 'lucide-react';
import { ToolDefinition } from '../types';
import { TOOLS } from '../data/tools';
import { createSamplePdfFiles } from '../utils/samplePdfs';
import cosmicHeroImg from '../assets/images/cosmic_aurora_nebula_1792266108934.jpg';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTool: (tool: ToolDefinition) => void;
  onStartWithSampleFiles?: (files: File[]) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSelectTool,
  onStartWithSampleFiles,
  searchInputRef
}) => {
  const popularToolIds = ['merge', 'compress', 'split', 'sign', 'summarizer', 'protect'];
  const popularTools = popularToolIds
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter((t): t is ToolDefinition => Boolean(t));

  const handleStartWithPdf = async () => {
    // If handler provided, generate sample files and open merge tool
    if (onStartWithSampleFiles) {
      const sampleFiles = await createSamplePdfFiles();
      onStartWithSampleFiles(sampleFiles);
    } else {
      const mergeTool = TOOLS.find((t) => t.id === 'merge') || TOOLS[0];
      onSelectTool(mergeTool);
    }
  };

  return (
    <div className="relative w-full">
      {/* COSMIC HERO SECTION (Matches Reference Images 6, 7, 8) */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden bg-black text-white">
        
        {/* Cosmic Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={cosmicHeroImg}
            alt="Cosmic Aurora Horizon"
            className="w-full h-full object-cover object-center opacity-85 scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle vignette and contrast scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/70 pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6">
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-md">
            Every PDF Task,<br />
            In One Nest.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200/90 max-w-xl font-normal leading-relaxed drop-shadow-sm">
            Merge, split, compress, convert and protect files instantly.
          </p>

          {/* Primary Call to Action Button */}
          <div className="pt-2">
            <button
              onClick={handleStartWithPdf}
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-white/40 bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-xl text-white font-semibold text-base sm:text-lg shadow-2xl shadow-cyan-500/10 transition-all hover:scale-105 cursor-pointer ring-1 ring-white/20"
            >
              <span>Start with a PDF</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.2]" />
            </button>
          </div>

          {/* 4 Feature Bullet Points (with Chevrons) */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-medium text-slate-200 drop-shadow">
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
              <span>No account needed</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
              <span>Browser-based tools</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
              <span>Fast and private</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
              <span>Works on any device</span>
            </div>
          </div>

          {/* Subtle Vertical Divider Line */}
          <div className="w-px h-8 bg-white/30 my-4" />

          {/* Trust and Year Stamp */}
          <div className="space-y-1 text-xs text-slate-300 font-medium drop-shadow">
            <div>Trusted by students, creators and teams worldwide.</div>
            <div className="font-mono text-slate-400">2026</div>
          </div>
        </div>
      </section>

      {/* QUICK SEARCH & POPULAR TOOLS STRIP */}
      <section id="tools-section" className="relative z-10 pt-10 pb-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-lg shadow-slate-200/50 dark:shadow-none rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10">
            <Search className="w-5 h-5 text-slate-400 ml-4 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search all 28 tools (e.g. compress, merge, watermark, sign)..."
              className="w-full py-3.5 pl-3 pr-10 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1.5 mr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Popular Shortcuts */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold mr-1 text-slate-400">Popular:</span>
          {popularTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 border border-slate-200/60 dark:border-slate-700/60 transition-colors font-medium cursor-pointer"
            >
              {tool.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
