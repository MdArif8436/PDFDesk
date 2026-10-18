import React, { useState } from 'react';
import { X, Workflow, ArrowRight, Play, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { ToolDefinition } from '../types';

interface WorkflowBuilderModalProps {
  onClose: () => void;
  onExecuteWorkflow: (steps: string[]) => void;
}

export const WorkflowBuilderModal: React.FC<WorkflowBuilderModalProps> = ({
  onClose,
  onExecuteWorkflow
}) => {
  const availableSteps = [
    { id: 'compress', name: 'Compress Document', desc: 'Downsamples color images & deflates streams' },
    { id: 'watermark', name: 'Stamp Watermark', desc: 'Applies confidential security overlay' },
    { id: 'page-numbers', name: 'Add Page Numbers', desc: 'Inserts sequential footer numbering' }
  ];

  const [activePipeline, setActivePipeline] = useState<string[]>(['compress', 'watermark']);

  const addStep = (id: string) => {
    setActivePipeline((prev) => [...prev, id]);
  };

  const removeStep = (index: number) => {
    setActivePipeline((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Automated Workflow Builder
              </h3>
              <p className="text-[11px] text-slate-400">
                Chain multiple document operations into a single continuous pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pipeline Builder */}
        <div className="p-6 space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Sequential Pipeline Stages ({activePipeline.length})
            </div>

            <div className="space-y-2">
              {activePipeline.map((stepId, idx) => {
                const stepMeta = availableSteps.find((s) => s.id === stepId);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {stepMeta?.name || stepId}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {stepMeta?.desc}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeStep(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Step options */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Add Operation to Pipeline
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => addStep(step.id)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-500 text-left text-xs bg-white dark:bg-slate-800/40 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-rose-600">
                    + {step.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <span className="text-[11px] text-slate-400">
            Passes intermediate buffers seamlessly across stages
          </span>
          <button
            disabled={activePipeline.length === 0}
            onClick={() => {
              onExecuteWorkflow(activePipeline);
              onClose();
            }}
            className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Run Workflow Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};
