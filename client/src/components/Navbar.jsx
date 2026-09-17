import React from 'react';
import { 
  Plus, 
  Users, 
  FolderPlus, 
  Flame, 
  Layers, 
  BarChart3,
  Download,
  Keyboard,
  Wand2
} from 'lucide-react';

export default function Navbar({
  projects,
  currentProject,
  onSelectProject,
  onOpenNewProjectModal,
  onOpenMembersModal,
  onOpenNewTaskModal,
  onOpenAnalyticsModal,
  onOpenExportModal,
  onOpenShortcutsModal,
  onSimulateBurnout,
  isBurnoutPresent,
  overloadedUserName
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#0c1222]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Brand & Project Switcher */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                  Quantiphi TaskFlow
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Vibe Edition
                </span>
              </div>
              <p className="text-xs text-slate-400">Streamlined Kanban & Workload Balancer</p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          {/* Project Selector */}
          <div className="flex items-center gap-2">
            <select
              value={currentProject?.id || ''}
              onChange={(e) => {
                const proj = projects.find(p => p.id === e.target.value);
                if (proj) onSelectProject(proj);
              }}
              className="bg-slate-900/90 text-sm text-slate-200 border border-slate-700/80 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:border-slate-600 font-medium transition-colors"
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id} className="bg-slate-900 text-slate-200">
                  📁 {proj.name} ({proj.task_count || 0} tasks)
                </option>
              ))}
            </select>

            <button
              onClick={onOpenNewProjectModal}
              title="Create new project"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/70 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Controls & Views */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Burnout Simulation Button */}
          <button
            onClick={onSimulateBurnout}
            title="Simulate Overload: Assigns > 5 In-Progress tasks to trigger pulsating red avatar"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
              isBurnoutPresent
                ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-lg shadow-red-500/20 animate-pulse'
                : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border-amber-500/30'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{isBurnoutPresent ? `Burnout Warning Active!` : 'Simulate Overload (>5 tasks)'}</span>
          </button>

          {/* Analytics View Button */}
          <button
            onClick={onOpenAnalyticsModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 transition-all"
            title="Sprint Analytics & Velocity (Shortcut: A)"
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Analytics</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 transition-all"
            title="Export to CSV/JSON (Shortcut: E)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Manage Team Members Button */}
          <button
            onClick={onOpenMembersModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 transition-all"
            title="Manage Team & Permissions (Shortcut: T)"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Team</span>
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            onClick={onOpenShortcutsModal}
            className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/80 transition-all"
            title="Keyboard Shortcuts Guide (Shortcut: ?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* New Task Button */}
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Create Task (Shortcut: N)"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>

      </div>
    </header>
  );
}
