import React from 'react';
import * as Icons from 'lucide-react';
import { ToolDefinition } from '../types';

interface ToolGridProps {
  tools: ToolDefinition[];
  onSelectTool: (tool: ToolDefinition) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ tools, onSelectTool }) => {
  if (tools.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4">
          <Icons.SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No matching tools found</h3>
        <p className="mt-1 text-sm text-slate-500">
          Try adjusting your search query or select another category filter above.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {tools.map((tool) => {
          // Dynamically resolve icon from Lucide
          const IconComponent = (Icons as any)[tool.iconName] || Icons.FileText;

          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="text-left group relative bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 hover:border-rose-400 dark:hover:border-rose-600/80 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Tool icon box with gradient */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.accentColor} flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-6 h-6 stroke-[2]" />
                  </div>

                  {tool.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {tool.name}
                </h3>

                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span className="capitalize">{tool.category.replace('-', ' ')}</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  Launch <Icons.ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
