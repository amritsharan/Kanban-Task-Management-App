import React from 'react';
import { X, Download, FileSpreadsheet, FileJson, Printer, CheckCircle, FileText } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, project, tasks = [], onOpenSprintReport }) {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Assignee', 'Subtasks Count', 'Completed Subtasks'];
    const rows = tasks.map(t => [
      `"${t.id}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${t.status}"`,
      `"${t.priority}"`,
      `"${t.due_date || ''}"`,
      `"${t.assignee_name || 'Unassigned'}"`,
      (t.subtasks || []).length,
      (t.subtasks || []).filter(s => s.completed).length
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${project?.name || 'kanban'}_sprint_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ project, exportedAt: new Date().toISOString(), taskCount: tasks.length, tasks }, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `${project?.name || 'kanban'}_sprint_export.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleOpenReport = () => {
    onClose();
    if (onOpenSprintReport) onOpenSprintReport();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export & Report Generator</h3>
              <p className="text-xs text-slate-400">Export sprint tasks for <span className="text-indigo-300 font-semibold">{project?.name}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {/* Rich Printable Sprint Summary PDF */}
          <button
            onClick={handleOpenReport}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-indigo-500/40 hover:border-indigo-400 transition-all text-left group shadow-lg shadow-indigo-950/40"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 flex items-center gap-1.5">
                  <span>Executive PDF Sprint Summary</span>
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold uppercase">Enhanced</span>
                </h4>
                <p className="text-[11px] text-slate-400">Formatted executive report with metrics, capacity & task breakdown</p>
              </div>
            </div>
            <Printer className="w-4 h-4 text-indigo-400 group-hover:text-white" />
          </button>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">Spreadsheet (CSV)</h4>
                <p className="text-[11px] text-slate-400">Export all {tasks.length} tasks to Excel / Sheets</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-white" />
          </button>

          {/* JSON Export */}
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-300">Raw Data (JSON)</h4>
                <p className="text-[11px] text-slate-400">Structured JSON payload with subtasks & tags</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-white" />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
