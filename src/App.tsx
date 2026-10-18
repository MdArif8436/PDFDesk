import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ToolGrid } from './components/ToolGrid';
import { ToolWorkspace } from './components/ToolWorkspace';
import { ActivityModal } from './components/ActivityModal';
import { WorkflowBuilderModal } from './components/WorkflowBuilderModal';
import { AuthModal } from './components/AuthModal';
import { CalendarModal } from './components/CalendarModal';
import { Footer } from './components/Footer';
import { TOOLS } from './data/tools';
import { ToolDefinition, ToolCategory, ProcessedTask } from './types';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<ToolDefinition | null>(null);
  const [carryoverFile, setCarryoverFile] = useState<File | undefined>(undefined);
  const [carryoverFiles, setCarryoverFiles] = useState<File[] | undefined>(undefined);

  // Modals
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // User session
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  // Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fileforge-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Task activity history
  const [tasks, setTasks] = useState<ProcessedTask[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fileforge-tasks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Sync dark class on document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fileforge-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fileforge-theme', 'light');
    }
  }, [isDark]);

  // Persist tasks in localStorage
  useEffect(() => {
    localStorage.setItem('fileforge-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Global keydown handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setSelectedTool(null);
        setShowActivityModal(false);
        setShowWorkflowModal(false);
        setShowAuthModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveTask = (task: ProcessedTask) => {
    setTasks((prev) => [task, ...prev].slice(0, 30));
  };

  const handleClearTasks = () => {
    setTasks([]);
  };

  // Continue to another tool chaining
  const handleContinueToTool = (toolId: string, fileBlob: Blob, fileName: string) => {
    const nextTool = TOOLS.find((t) => t.id === toolId);
    if (!nextTool) return;
    const file = new File([fileBlob], fileName, { type: 'application/pdf' });
    setCarryoverFile(file);
    setCarryoverFiles(undefined);
    setSelectedTool(nextTool);
  };

  const handleStartWithSampleFiles = (files: File[]) => {
    const mergeTool = TOOLS.find((t) => t.id === 'merge') || TOOLS[0];
    setCarryoverFiles(files);
    setCarryoverFile(undefined);
    setSelectedTool(mergeTool);
  };

  // Filter tools based on category and search query
  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory =
      activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header
        onSelectTool={(tool) => {
          if (tool.id === 'schedule') {
            setShowCalendarModal(true);
            return;
          }
          setCarryoverFile(undefined);
          setCarryoverFiles(undefined);
          setSelectedTool(tool);
        }}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
        onOpenActivity={() => setShowActivityModal(true)}
        onOpenWorkflow={() => setShowWorkflowModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenCalendar={() => setShowCalendarModal(true)}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        activityCount={tasks.length}
        userEmail={userEmail}
        onSearchFocus={() => searchInputRef.current?.focus()}
      />

      <main className="flex-1">
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectTool={(tool) => {
            if (tool.id === 'schedule') {
              setShowCalendarModal(true);
              return;
            }
            setCarryoverFile(undefined);
            setCarryoverFiles(undefined);
            setSelectedTool(tool);
          }}
          onStartWithSampleFiles={handleStartWithSampleFiles}
          searchInputRef={searchInputRef}
        />

        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setSearchQuery('');
          }}
        />

        <ToolGrid
          tools={filteredTools}
          onSelectTool={(tool) => {
            if (tool.id === 'schedule') {
              setShowCalendarModal(true);
              return;
            }
            setCarryoverFile(undefined);
            setCarryoverFiles(undefined);
            setSelectedTool(tool);
          }}
        />
      </main>

      <Footer
        onSelectTool={(tool) => {
          if (tool.id === 'schedule') {
            setShowCalendarModal(true);
            return;
          }
          setCarryoverFile(undefined);
          setCarryoverFiles(undefined);
          setSelectedTool(tool);
        }}
      />

      {/* Tool Workspace Modal */}
      {selectedTool && (
        <ToolWorkspace
          tool={selectedTool}
          initialFile={carryoverFile}
          initialFiles={carryoverFiles}
          onClose={() => {
            setSelectedTool(null);
            setCarryoverFile(undefined);
            setCarryoverFiles(undefined);
          }}
          onContinueToTool={handleContinueToTool}
          onSaveTask={handleSaveTask}
        />
      )}

      {/* Activity History & Automated Reports Modal */}
      {showActivityModal && (
        <ActivityModal
          tasks={tasks}
          onClose={() => setShowActivityModal(false)}
          onClearTasks={handleClearTasks}
          onOpenCalendar={() => setShowCalendarModal(true)}
        />
      )}

      {/* Calendar & Scheduled Jobs Modal */}
      {showCalendarModal && (
        <CalendarModal
          onClose={() => setShowCalendarModal(false)}
        />
      )}

      {/* Workflow Builder Modal */}
      {showWorkflowModal && (
        <WorkflowBuilderModal
          onClose={() => setShowWorkflowModal(false)}
          onExecuteWorkflow={() => {
            const workflowTool = TOOLS.find((t) => t.id === 'workflow');
            if (workflowTool) {
              setCarryoverFile(undefined);
              setCarryoverFiles(undefined);
              setSelectedTool(workflowTool);
            }
          }}
        />
      )}

      {/* User Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          currentUserEmail={userEmail}
          onLoginSuccess={(email) => setUserEmail(email)}
          onLogout={() => setUserEmail(undefined)}
        />
      )}
    </div>
  );
}
