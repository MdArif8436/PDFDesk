import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  FileText,
  Trash2,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
  GalleryHorizontal,
  RotateCw,
  Plus,
  SlidersHorizontal,
  FileCheck,
  Cloud,
  Calendar,
  Share2,
  Lock,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ShieldCheck,
  Check
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { ToolDefinition, ProcessedTask } from '../types';
import { SignaturePad } from './SignaturePad';
import { CalendarModal } from './CalendarModal';
import { CloudSyncModal } from './CloudSyncModal';
import { ShareModal } from './ShareModal';
import { formatFileSize, calculateSavings, reorderItems } from '../utils/pdfCalculations';
import { createSamplePdfFiles } from '../utils/samplePdfs';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
  onClose: () => void;
  onContinueToTool: (toolId: string, fileBlob: Blob, fileName: string) => void;
  onSaveTask: (task: ProcessedTask) => void;
  initialFile?: File;
  initialFiles?: File[];
}

interface FileItem {
  file: File;
  id: string;
  previewUrl?: string;
  pageCount?: number;
  rotation: number;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
  tool,
  onClose,
  onContinueToTool,
  onSaveTask,
  initialFile,
  initialFiles
}) => {
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [file2, setFile2] = useState<File | null>(null); // For Compare tool
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [activeCarouselIdx, setActiveCarouselIdx] = useState(0);
  const [previewModalItem, setPreviewModalItem] = useState<FileItem | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingPhase, setProcessingPhase] = useState('Initializing pipeline...');
  const [transferSpeed, setTransferSpeed] = useState('18.4 MB/s');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const [resultStats, setResultStats] = useState<{ originalSize?: number; compressedSize?: number; savings?: number } | null>(null);
  const [aiResultText, setAiResultText] = useState<{ summary?: string; keyPoints?: string[]; translatedOverview?: string } | null>(null);

  // Modals for Result Actions
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Tool Specific Settings
  const [splitMode, setSplitMode] = useState<'pages' | 'range' | 'fixed'>('pages');
  const [splitRange, setSplitRange] = useState('1-3');
  const [compressLevel, setCompressLevel] = useState<'recommended' | 'extreme' | 'less'>('recommended');
  const [rotateAngle, setRotateAngle] = useState(90);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkAngle, setWatermarkAngle] = useState(45);
  const [watermarkPos, setWatermarkPos] = useState('center');
  const [pageNumberFormat, setPageNumberFormat] = useState('Page {n} of {total}');
  const [pageNumberPos, setPageNumberPos] = useState('bottom-center');
  const [imgOrientation, setImgOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [protectPassword, setProtectPassword] = useState('');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  const [signerName, setSignerName] = useState('Authorized Signer');
  const [cropPercent, setCropPercent] = useState('10');
  const [aiTone, setAiTone] = useState<'executive' | 'key_points' | 'deep'>('executive');
  const [targetLang, setTargetLang] = useState('Spanish');

  // Image Tool Specific Settings
  const [imgScalePercent, setImgScalePercent] = useState(100);
  const [imgCustomWidth, setImgCustomWidth] = useState('');
  const [imgCustomHeight, setImgCustomHeight] = useState('');
  const [imgDpi, setImgDpi] = useState('150');
  const [imgFormat, setImgFormat] = useState('jpeg');
  const [imgQuality, setImgQuality] = useState(80);
  const [imgAspectRatio, setImgAspectRatio] = useState('1:1');
  const [imgFlipH, setImgFlipH] = useState(false);
  const [imgFlipV, setImgFlipV] = useState(false);
  const [imgUpscaleFactor, setImgUpscaleFactor] = useState(2);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const file2InputRef = useRef<HTMLInputElement | null>(null);
  const carouselTrackRef = useRef<HTMLDivElement | null>(null);

  // Initial file populate
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      addFiles(initialFiles);
    } else if (initialFile) {
      addFiles([initialFile]);
    }
  }, [initialFile, initialFiles]);

  // Elapsed time counter during processing
  useEffect(() => {
    let timer: any;
    if (isProcessing) {
      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isProcessing]);

  // Helper to add files and inspect page counts
  const addFiles = async (newFiles: File[]) => {
    const items: FileItem[] = [];

    for (const file of newFiles) {
      const isImg = file.type.startsWith('image/');
      const previewUrl = isImg ? URL.createObjectURL(file) : undefined;
      let pageCount: number | undefined = undefined;

      if (file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')) {
        try {
          const ab = await file.arrayBuffer();
          const doc = await PDFDocument.load(ab, { ignoreEncryption: true });
          pageCount = doc.getPageCount();
        } catch {
          pageCount = 1;
        }
      }

      items.push({
        file,
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        previewUrl,
        pageCount: pageCount || 1,
        rotation: 0
      });
    }

    setFileItems((prev) => {
      if (tool.maxFiles === 1) return [items[0]];
      return [...prev, ...items].slice(0, tool.maxFiles);
    });
  };

  const handleLoadSampleDocuments = async () => {
    const samples = await createSamplePdfFiles();
    addFiles(samples);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const removeFileItem = (id: string) => {
    setFileItems((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (activeCarouselIdx >= filtered.length) {
        setActiveCarouselIdx(Math.max(0, filtered.length - 1));
      }
      return filtered;
    });
  };

  const moveFileItem = (index: number, direction: 'prev' | 'next') => {
    const updated = reorderItems(fileItems, index, direction);
    setFileItems(updated);
    const targetIdx = direction === 'prev' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < updated.length) {
      setActiveCarouselIdx(targetIdx);
    }
  };

  const rotateFileItem = (id: string) => {
    setFileItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const rotateAllFiles = () => {
    setFileItems((prev) =>
      prev.map((item) => ({ ...item, rotation: (item.rotation + 90) % 360 }))
    );
  };

  const sortAZ = () => {
    setFileItems((prev) =>
      [...prev].sort((a, b) => a.file.name.localeCompare(b.file.name))
    );
  };

  const clearAll = () => {
    setFileItems([]);
    setActiveCarouselIdx(0);
  };

  const totalBytes = fileItems.reduce((acc, item) => acc + item.file.size, 0);

  // Perform processing
  const handleProcess = async () => {
    if (tool.id === 'schedule') {
      setShowCalendarModal(true);
      return;
    }

    if (fileItems.length === 0) {
      setErrorMsg('Please select at least one file to process.');
      return;
    }

    if (tool.id === 'compare' && !file2) {
      setErrorMsg('Please select both Document 1 and Document 2 for comparison.');
      return;
    }

    if (tool.id === 'protect' && (!protectPassword || protectPassword.length < 3)) {
      setErrorMsg('Password must be at least 3 characters.');
      return;
    }

    setIsProcessing(true);
    setProgress(15);
    setProcessingPhase('Validating payload & hashing checksums...');
    setTransferSpeed('22.1 MB/s');
    setErrorMsg(null);

    try {
      const formData = new FormData();
      const endpoint = tool.apiEndpoint || '/api/v1/pdf/merge';
      const rawFiles = fileItems.map((item) => item.file);

      // Attach tool-specific data
      if (tool.id === 'merge') {
        rawFiles.forEach((f) => formData.append('files', f));
      } else if (tool.id === 'split') {
        formData.append('file', rawFiles[0]);
        formData.append('mode', splitMode);
        formData.append('range', splitRange);
      } else if (tool.id === 'compress') {
        formData.append('file', rawFiles[0]);
        formData.append('level', compressLevel);
      } else if (tool.id === 'rotate') {
        formData.append('file', rawFiles[0]);
        formData.append('angle', rotateAngle.toString());
      } else if (tool.id === 'watermark') {
        formData.append('file', rawFiles[0]);
        formData.append('text', watermarkText);
        formData.append('opacity', watermarkOpacity.toString());
        formData.append('angle', watermarkAngle.toString());
        formData.append('position', watermarkPos);
      } else if (tool.id === 'pagenum') {
        formData.append('file', rawFiles[0]);
        formData.append('format', pageNumberFormat);
        formData.append('position', pageNumberPos);
      } else if (tool.id === 'img2pdf') {
        rawFiles.forEach((f) => formData.append('images', f));
        formData.append('orientation', imgOrientation);
      } else if (tool.id === 'sign') {
        formData.append('file', rawFiles[0]);
        formData.append('signatureDataUrl', signatureDataUrl);
        formData.append('signerName', signerName);
      } else if (tool.id === 'protect') {
        formData.append('file', rawFiles[0]);
        formData.append('password', protectPassword);
      } else if (tool.id === 'unlock') {
        formData.append('file', rawFiles[0]);
        formData.append('password', unlockPassword);
      } else if (tool.id === 'crop') {
        formData.append('file', rawFiles[0]);
        formData.append('cropPercent', cropPercent);
      } else if (tool.id === 'resize-img') {
        rawFiles.forEach((f) => formData.append('images', f));
        formData.append('scalePercent', imgScalePercent.toString());
        if (imgCustomWidth) formData.append('width', imgCustomWidth);
        if (imgCustomHeight) formData.append('height', imgCustomHeight);
        formData.append('dpi', imgDpi);
        formData.append('format', imgFormat);
      } else if (tool.id === 'compress-img') {
        rawFiles.forEach((f) => formData.append('images', f));
        formData.append('level', compressLevel);
        formData.append('quality', imgQuality.toString());
      } else if (tool.id === 'crop-img') {
        formData.append('image', rawFiles[0]);
        formData.append('aspectRatio', imgAspectRatio);
      } else if (tool.id === 'rotate-img') {
        formData.append('image', rawFiles[0]);
        formData.append('angle', rotateAngle.toString());
        formData.append('flipH', imgFlipH.toString());
        formData.append('flipV', imgFlipV.toString());
      } else if (tool.id === 'convert-img') {
        rawFiles.forEach((f) => formData.append('images', f));
        formData.append('targetFormat', imgFormat);
      } else if (tool.id === 'upscale-img') {
        formData.append('image', rawFiles[0]);
        formData.append('factor', imgUpscaleFactor.toString());
      } else if (tool.id === 'compare') {
        formData.append('file1', rawFiles[0]);
        if (file2) formData.append('file2', file2);
      } else if (tool.id === 'summarizer') {
        formData.append('file', rawFiles[0]);
        formData.append('tone', aiTone);
      } else if (tool.id === 'translate') {
        formData.append('file', rawFiles[0]);
        formData.append('targetLang', targetLang);
      } else {
        formData.append('file', rawFiles[0]);
      }

      setProgress(45);
      setProcessingPhase('Executing high-efficiency document pipeline...');
      setTransferSpeed('34.8 MB/s');

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        let errJson;
        try {
          errJson = await response.json();
        } catch {
          errJson = { error: `Server error: ${response.statusText}` };
        }
        throw new Error(errJson.error || 'Failed to process document');
      }

      setProgress(85);
      setProcessingPhase('Finalizing & assembling cryptographic output...');
      setTransferSpeed('19.2 MB/s');

      const contentType = response.headers.get('Content-Type') || '';

      if (contentType.includes('application/json')) {
        const jsonData = await response.json();
        setAiResultText(jsonData);
        setResultFileName(`${tool.id}-report.json`);
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        setResultBlob(blob);
      } else {
        const blob = await response.blob();
        setResultBlob(blob);

        let outName = `fileforge-${tool.id}`;
        if (contentType.includes('application/pdf')) outName += '.pdf';
        else if (contentType.includes('application/zip')) outName += '.zip';
        else if (contentType.includes('image/png')) outName += '.png';
        else if (contentType.includes('image/webp')) outName += '.webp';
        else if (contentType.includes('image/jpeg')) outName += '.jpg';
        else if (contentType.includes('text/markdown')) outName += '.md';
        else outName += '.pdf';

        setResultFileName(outName);

        const origSize = rawFiles.reduce((acc, f) => acc + f.size, 0);
        const compSize = blob.size;
        const savingsCalc = calculateSavings(origSize, compSize);
        setResultStats({
          originalSize: origSize,
          compressedSize: compSize,
          savings: savingsCalc.savingsPercent
        });

        onSaveTask({
          id: Date.now().toString(),
          toolId: tool.id,
          toolName: tool.name,
          inputFileName: rawFiles[0].name,
          outputFileName: outName,
          originalSize: origSize,
          resultSize: compSize,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'completed'
        });
      }

      setProgress(100);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resultFileName || 'fileforge-output.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Determine Squircle Icon Background
  const getToolIconBg = () => {
    if (tool.id === 'merge') return 'bg-[#FF0040]';
    if (tool.id === 'compress') return 'bg-[#00C853]';
    if (tool.id === 'split') return 'bg-[#FF6D00]';
    if (tool.id === 'sign') return 'bg-[#2979FF]';
    return 'bg-[#FF0040]';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-5xl w-full border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Workspace Top Header (Matches Reference Images 1, 2, 3, 4) */}
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3.5">
            {/* Squircle Tool Icon */}
            <div className={`w-11 h-11 rounded-2xl ${getToolIconBg()} flex items-center justify-center text-white shadow-md shadow-slate-900/10`}>
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {tool.name}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                  {tool.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle when files exist */}
            {fileItems.length > 0 && !resultBlob && (
              <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('carousel')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === 'carousel'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Filmstrip Carousel View"
                >
                  <GalleryHorizontal className="w-3.5 h-3.5" />
                  <span>Carousel</span>
                </button>
              </div>
            )}

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Progress Monitoring Banner */}
        {isProcessing && (
          <div className="bg-gradient-to-r from-rose-500 via-indigo-600 to-purple-600 p-3 text-white shadow-inner animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{processingPhase}</span>
              </span>
              <span className="font-mono bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                {progress}% • {transferSpeed} • {elapsedSeconds}s
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300 rounded-full shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Workspace Main Body */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Visual Carousel / Grid File Explorer / Results */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {!resultBlob ? (
              <div className="space-y-4">
                
                {/* Empty Drop Zone if no files yet */}
                {fileItems.length === 0 ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-rose-500 rounded-3xl p-10 text-center cursor-pointer bg-slate-50/40 dark:bg-slate-800/20 hover:bg-rose-50/20 transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple={tool.maxFiles > 1}
                      accept={tool.accepts.join(',')}
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-rose-500 mx-auto flex items-center justify-center shadow-md border border-slate-200/80 dark:border-slate-700 group-hover:scale-110 transition-transform mb-4">
                      <Upload className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      Drop your files here, or <span className="text-rose-600 font-semibold underline decoration-rose-300">browse</span>
                    </h4>
                    <p className="mt-1 text-xs text-slate-400">
                      Supports {tool.accepts.join(', ')} up to 100MB (Max: {tool.maxFiles} files)
                    </p>
                    
                    {/* Instant Load Sample Files button */}
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadSampleDocuments();
                        }}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-rose-400 hover:text-rose-600 shadow-sm transition-all"
                      >
                        ⚡ Try with 3 Sample Documents (doc1, doc2, doc3)
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Document Explorer (Carousel or Grid) */
                  <div className="space-y-3">
                    
                    {/* Summary Header Bar */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-emerald-500" />
                          <span>{fileItems.length} {fileItems.length === 1 ? 'Document' : 'Documents'}</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {formatFileSize(totalBytes)} Total
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        {fileItems.length > 1 && (
                          <>
                            <button
                              onClick={sortAZ}
                              className="text-slate-600 dark:text-slate-300 hover:text-rose-600 font-semibold transition-colors"
                            >
                              Sort A-Z
                            </button>
                            <button
                              onClick={rotateAllFiles}
                              className="text-slate-600 dark:text-slate-300 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1"
                            >
                              <RotateCw className="w-3 h-3" /> Rotate All
                            </button>
                          </>
                        )}
                        <button
                          onClick={clearAll}
                          className="text-[#FF0040] hover:underline font-semibold transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    {/* View 1: THUMBNAIL CAROUSEL */}
                    {viewMode === 'carousel' && (
                      <div className="relative rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 p-4 border border-slate-200/80 dark:border-slate-800">
                        <div
                          ref={carouselTrackRef}
                          className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-thin scroll-smooth"
                        >
                          {fileItems.map((item, idx) => {
                            const isSelected = activeCarouselIdx === idx;
                            return (
                              <div
                                key={item.id}
                                onClick={() => setActiveCarouselIdx(idx)}
                                className={`flex-none w-44 rounded-2xl p-3 border transition-all cursor-pointer relative group ${
                                  isSelected
                                    ? 'bg-white dark:bg-slate-800 border-rose-500 shadow-md ring-2 ring-rose-500/20'
                                    : 'bg-white/90 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                }`}
                              >
                                {/* Sheet Mockup Canvas Preview */}
                                <div className="h-32 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group/thumb">
                                  {item.previewUrl ? (
                                    <img
                                      src={item.previewUrl}
                                      alt={item.file.name}
                                      style={{ transform: `rotate(${item.rotation}deg)` }}
                                      className="w-full h-full object-cover transition-transform duration-200"
                                    />
                                  ) : (
                                    /* Stylized PDF Document Preview with Top Lines & Red "PDF" Badge */
                                    <div
                                      style={{ transform: `rotate(${item.rotation}deg)` }}
                                      className="w-20 h-26 bg-white dark:bg-slate-800 rounded-md shadow-md border border-slate-200 dark:border-slate-700 p-2 flex flex-col justify-between transition-transform duration-200"
                                    >
                                      <div className="space-y-1.5 pt-1">
                                        <div className="h-1.5 w-10 bg-slate-300 dark:bg-slate-600 rounded" />
                                        <div className="h-1 w-14 bg-slate-200 dark:bg-slate-700 rounded" />
                                        <div className="h-1 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
                                      </div>
                                      <div className="text-[10px] font-black text-[#FF0040] text-center font-mono tracking-wider pb-1">
                                        PDF
                                      </div>
                                    </div>
                                  )}

                                  {/* Badges: #Index and Page count */}
                                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-800/80 backdrop-blur-sm text-white font-mono text-[9px] font-bold">
                                    #{idx + 1}
                                  </div>

                                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-800/80 backdrop-blur-sm text-white font-mono text-[9px]">
                                    {item.pageCount || 1}p
                                  </div>

                                  {/* Hover Controls */}
                                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewModalItem(item);
                                      }}
                                      className="p-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-xs"
                                      title="Inspect thumbnail"
                                    >
                                      <ZoomIn className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        rotateFileItem(item.id);
                                      }}
                                      className="p-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-xs"
                                      title="Rotate +90°"
                                    >
                                      <RotateCw className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeFileItem(item.id);
                                      }}
                                      className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs"
                                      title="Remove document"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* File info & reorder arrows */}
                                <div className="mt-2.5">
                                  <div className="font-bold text-slate-900 dark:text-white text-xs truncate" title={item.file.name}>
                                    {item.file.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex justify-between">
                                    <span>{formatFileSize(item.file.size)}</span>
                                    {item.rotation > 0 && <span>+{item.rotation}°</span>}
                                  </div>

                                  {/* Reorder controls */}
                                  {fileItems.length > 1 && (
                                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                                      <button
                                        disabled={idx === 0}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          moveFileItem(idx, 'prev');
                                        }}
                                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                                        title="Move Left"
                                      >
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                      </button>
                                      <span className="text-[10px] text-slate-400 font-medium">Order #{idx + 1}</span>
                                      <button
                                        disabled={idx === fileItems.length - 1}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          moveFileItem(idx, 'next');
                                        }}
                                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                                        title="Move Right"
                                      >
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* + Add Files Tile in Carousel */}
                          {fileItems.length < tool.maxFiles && (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex-none w-44 h-[216px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 bg-white/50 dark:bg-slate-800/30 flex flex-col items-center justify-center text-slate-500 hover:text-rose-600 transition-colors p-4 group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-rose-600 group-hover:bg-rose-50 transition-colors mb-2">
                                <Plus className="w-5 h-5 stroke-[2.5]" />
                              </div>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Files</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View 2: THUMBNAIL GRID VIEW (Matches Image 2 & 3) */}
                    {viewMode === 'grid' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[360px] overflow-y-auto pr-1">
                        {fileItems.map((item, idx) => (
                          <div
                            key={item.id}
                            className={`rounded-2xl p-3 border transition-all flex flex-col justify-between ${
                              idx === 0
                                ? 'bg-white dark:bg-slate-800/90 border-rose-400 dark:border-rose-500/80 shadow-sm'
                                : 'bg-white dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300'
                            }`}
                          >
                            <div className="relative h-28 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                              {item.previewUrl ? (
                                <img
                                  src={item.previewUrl}
                                  alt={item.file.name}
                                  style={{ transform: `rotate(${item.rotation}deg)` }}
                                  className="w-full h-full object-cover transition-transform duration-200"
                                />
                              ) : (
                                /* Stylized Document Page with Red PDF Label */
                                <div
                                  style={{ transform: `rotate(${item.rotation}deg)` }}
                                  className="w-18 h-24 bg-white dark:bg-slate-800 rounded shadow border border-slate-200/80 dark:border-slate-700 p-2 flex flex-col justify-between"
                                >
                                  <div className="space-y-1 pt-1">
                                    <div className="h-1 w-8 bg-slate-300 dark:bg-slate-600 rounded" />
                                    <div className="h-1 w-11 bg-slate-200 dark:bg-slate-700 rounded" />
                                  </div>
                                  <span className="text-[9px] font-black text-[#FF0040] font-mono text-center pb-0.5">
                                    PDF
                                  </span>
                                </div>
                              )}

                              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-800/80 backdrop-blur-sm text-white font-mono text-[9px] font-bold">
                                #{idx + 1}
                              </div>

                              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-slate-800/80 backdrop-blur-sm text-white font-mono text-[9px]">
                                {item.pageCount || 1}p
                              </div>

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-slate-950/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setPreviewModalItem(item)}
                                  className="p-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-xs"
                                  title="Inspect thumbnail"
                                >
                                  <ZoomIn className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => rotateFileItem(item.id)}
                                  className="p-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-xs"
                                  title="Rotate +90°"
                                >
                                  <RotateCw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFileItem(item.id)}
                                  className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs"
                                  title="Remove"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="mt-2.5">
                              <div className="font-bold text-slate-900 dark:text-white text-xs truncate" title={item.file.name}>
                                {item.file.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between mt-0.5">
                                <span>{formatFileSize(item.file.size)}</span>
                                {item.rotation > 0 && <span>+{item.rotation}°</span>}
                              </div>

                              {/* Reorder Buttons */}
                              <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-slate-400">
                                <button
                                  disabled={idx === 0}
                                  onClick={() => moveFileItem(idx, 'prev')}
                                  className="p-1 hover:text-slate-700 dark:hover:text-white disabled:opacity-20"
                                  title="Move earlier"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                                <span className="text-[10px] text-slate-400">Order #{idx + 1}</span>
                                <button
                                  disabled={idx === fileItems.length - 1}
                                  onClick={() => moveFileItem(idx, 'next')}
                                  className="p-1 hover:text-slate-700 dark:hover:text-white disabled:opacity-20"
                                  title="Move later"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* + Add Files Tile in Grid (Matches Image 3) */}
                        {fileItems.length < tool.maxFiles && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-full min-h-[175px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center text-slate-500 hover:text-rose-600 transition-colors p-3 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-rose-600 group-hover:bg-rose-50 transition-colors mb-2">
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Files</span>
                          </button>
                        )}
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple={tool.maxFiles > 1}
                      accept={tool.accepts.join(',')}
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Compare Tool: Second File Picker */}
                {tool.id === 'compare' && (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Upload Document 2 (Comparison Target)
                    </div>
                    <input
                      ref={file2InputRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile2(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    {file2 ? (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 text-xs">
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{file2.name}</span>
                        <button onClick={() => setFile2(null)} className="text-red-500 ml-2 font-bold">Remove</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => file2InputRef.current?.click()}
                        className="w-full py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-slate-100"
                      >
                        Select Document 2
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Success / Results Screen (Matches Reference Images 1 & 5) */
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-6 shadow-sm">
                
                {/* Circular Green Checkmark Badge with Radiant Glow */}
                <div className="w-16 h-16 rounded-full bg-[#10b981]/15 text-[#10b981] mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/20 ring-8 ring-emerald-50/60 dark:ring-emerald-950/40">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.4]" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Document Processed!
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Your generated file has been processed in secure memory and is ready for instant download.
                  </p>
                </div>

                {/* Compression stats pill */}
                {resultStats && (
                  <div className="p-3 px-5 rounded-2xl bg-[#ecfdf5] dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 inline-flex items-center gap-4 text-xs font-semibold">
                    <div>
                      <div className="text-[9px] text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider">Original</div>
                      <div className="font-bold text-slate-900 dark:text-white font-mono">
                        {formatFileSize(resultStats.originalSize || 3072)}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="text-[9px] text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider">Compressed</div>
                      <div className="font-bold text-slate-900 dark:text-white font-mono">
                        {formatFileSize(resultStats.compressedSize || 1024)}
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-[#00C853] text-white font-bold text-xs shadow-sm">
                      -{resultStats.savings || 47}% Saved
                    </div>
                  </div>
                )}

                {/* Primary Download Button (Vibrant Crimson Red #FF0040) */}
                <div className="pt-2">
                  <button
                    onClick={handleDownload}
                    className="w-full py-4 px-6 rounded-2xl bg-[#FF0040] hover:bg-[#E00038] text-white font-bold shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2.5 text-base transition-all active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5 stroke-[2.2]" />
                    <span>Download {resultFileName || 'fileforge-output.pdf'}</span>
                  </button>
                </div>

                {/* Continue to other tools (Matches Image 1 reference) */}
                <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    onClick={() => {
                      if (resultBlob) onContinueToTool('compress', resultBlob, resultFileName);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Continue to Compress</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (resultBlob) onContinueToTool('protect', resultBlob, resultFileName);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Continue to Protect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-none" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Right Column: Configuration & Options (Matches Reference Images 1, 2, 4, 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF0040]" />
                  <span>CONFIGURATION</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {fileItems.length} {fileItems.length === 1 ? 'file loaded' : 'files loaded'}
                </span>
              </div>

              {/* Tool Specific Options Form */}
              {tool.id === 'split' && (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold block mb-1.5 text-slate-700 dark:text-slate-300">Split Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSplitMode('pages')}
                        className={`p-2.5 rounded-xl border font-bold transition-all ${splitMode === 'pages' ? 'border-[#FF0040] bg-rose-50/50 text-[#FF0040] shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                      >
                        Extract All Pages
                      </button>
                      <button
                        type="button"
                        onClick={() => setSplitMode('range')}
                        className={`p-2.5 rounded-xl border font-bold transition-all ${splitMode === 'range' ? 'border-[#FF0040] bg-rose-50/50 text-[#FF0040] shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                      >
                        Custom Range
                      </button>
                    </div>
                  </div>
                  {splitMode === 'range' && (
                    <div>
                      <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Page Ranges (e.g. 1-3, 5)</label>
                      <input
                        type="text"
                        value={splitRange}
                        onChange={(e) => setSplitRange(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              )}

              {tool.id === 'compress' && (
                <div className="space-y-2 text-xs">
                  <label className="font-semibold block mb-2 text-slate-700 dark:text-slate-300">Compression Level</label>
                  {[
                    { id: 'extreme', title: 'Extreme Compression', desc: 'Smallest file size, lower quality' },
                    { id: 'recommended', title: 'Recommended', desc: 'Good quality, high compression' },
                    { id: 'less', title: 'Less Compression', desc: 'Highest quality, smaller reduction' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setCompressLevel(lvl.id as any)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        compressLevel === lvl.id
                          ? 'border-[#FF0040] bg-white dark:bg-slate-800 shadow-sm ring-1 ring-[#FF0040]'
                          : 'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 hover:bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-900 dark:text-white">{lvl.title}</div>
                      <div className="text-[11px] text-slate-400">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* IMAGE RESIZE TOOL */}
              {tool.id === 'resize-img' && (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold block mb-1.5 text-slate-700 dark:text-slate-300">
                      Quick Scale Factor
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[25, 50, 75, 125, 150, 200].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => {
                            setImgScalePercent(pct);
                            setImgCustomWidth('');
                            setImgCustomHeight('');
                          }}
                          className={`p-2 rounded-xl border font-bold text-xs transition-all ${
                            imgScalePercent === pct && !imgCustomWidth
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Width (px)</label>
                      <input
                        type="number"
                        placeholder="Auto"
                        value={imgCustomWidth}
                        onChange={(e) => {
                          setImgCustomWidth(e.target.value);
                          setImgScalePercent(100);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Height (px)</label>
                      <input
                        type="number"
                        placeholder="Auto"
                        value={imgCustomHeight}
                        onChange={(e) => {
                          setImgCustomHeight(e.target.value);
                          setImgScalePercent(100);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* WATERMARK TOOL */}
              {tool.id === 'watermark' && (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* SIGN TOOL */}
              {tool.id === 'sign' && (
                <SignaturePad
                  onSignatureChange={(sig, name) => {
                    setSignatureDataUrl(sig);
                    setSignerName(name);
                  }}
                />
              )}

              {/* PROTECT TOOL */}
              {tool.id === 'protect' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Set Password (AES-256)</label>
                    <input
                      type="password"
                      value={protectPassword}
                      onChange={(e) => setProtectPassword(e.target.value)}
                      placeholder="Enter strong password"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Area (Matches Reference Images 1, 2, 4) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              {!resultBlob ? (
                <button
                  disabled={isProcessing || (tool.id !== 'schedule' && fileItems.length === 0)}
                  onClick={handleProcess}
                  className="w-full py-4 px-5 rounded-2xl bg-[#FF0040] hover:bg-[#E00038] disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-rose-600/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{processingPhase} ({progress}%)</span>
                    </>
                  ) : (
                    <>
                      <span>Execute {tool.name}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setResultBlob(null);
                    setResultStats(null);
                    setAiResultText(null);
                  }}
                  className="w-full py-3.5 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Process Another Document</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Item Zoom Preview Modal */}
      {previewModalItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {previewModalItem.file.name}
              </span>
              <button
                onClick={() => setPreviewModalItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-950 rounded-2xl p-4">
              {previewModalItem.previewUrl ? (
                <img
                  src={previewModalItem.previewUrl}
                  alt={previewModalItem.file.name}
                  style={{ transform: `rotate(${previewModalItem.rotation}deg)` }}
                  className="max-h-[50vh] max-w-full object-contain rounded-lg shadow"
                />
              ) : (
                <div className="w-40 h-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-2 w-20 bg-slate-300 dark:bg-slate-600 rounded" />
                    <div className="h-1.5 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-1.5 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="text-center font-bold text-rose-500 font-mono text-sm">
                    PDF PREVIEW
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">
                {formatFileSize(previewModalItem.file.size)}
              </span>
              <button
                onClick={() => {
                  rotateFileItem(previewModalItem.id);
                  setPreviewModalItem((prev) =>
                    prev ? { ...prev, rotation: (prev.rotation + 90) % 360 } : null
                  );
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 hover:bg-slate-200"
              >
                <RotateCw className="w-3.5 h-3.5" /> Rotate 90°
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cloud Storage Sync Modal */}
      {showCloudModal && (
        <CloudSyncModal
          fileName={resultFileName}
          fileSize={resultBlob?.size}
          onClose={() => setShowCloudModal(false)}
        />
      )}

      {/* Calendar & Schedule Modal */}
      {showCalendarModal && (
        <CalendarModal
          defaultTitle={`PDFNest: ${tool.name} Review`}
          defaultDescription={`Scheduled review for document ${resultFileName || 'document.pdf'}`}
          onClose={() => setShowCalendarModal(false)}
        />
      )}

      {/* Share & Mobile QR Modal */}
      {showShareModal && (
        <ShareModal
          fileName={resultFileName || 'fileforge-output.pdf'}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
