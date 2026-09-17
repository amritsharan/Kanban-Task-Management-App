import React from 'react';
import { X, Printer, Download, CheckCircle2, AlertTriangle, Layers, Calendar, User, FileText } from 'lucide-react';

export default function SprintReportModal({ isOpen, onClose, project, tasks = [], workload = [] }) {
  if (!isOpen) return null;

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'DONE').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const todo = tasks.filter(t => t.status === 'TODO').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const now = new Date();
  const overdue = tasks.filter(t => t.status !== 'DONE' && t.due_date && new Date(t.due_date) < now).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar (Hidden during Print) */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Sprint Summary Report Preview</h3>
              <p className="text-[11px] text-slate-400">Executive PDF report formatted for printing & export</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div id="printable-sprint-report" className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-slate-900 font-sans print-sheet">
          
          {/* Executive Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600">Quantiphi TaskFlow</span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {project?.name || 'Sprint Report'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 max-w-lg">{project?.description || 'Enterprise sprint backlog and capacity telemetry report.'}</p>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <div className="text-xs font-bold text-slate-700">Sprint Health: <span className="text-emerald-600 font-extrabold">Optimal</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <div className="text-[10px] text-slate-400">Status: {completionRate}% Complete</div>
            </div>
          </div>

          {/* Key Metrics Dashboard Cards */}
          <div className="grid grid-cols-4 gap-3 my-6">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Total Tasks</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{total}</div>
              <div className="text-[10px] text-slate-500 mt-1">100% scoped</div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-[10px] uppercase font-bold text-emerald-700">Completed</div>
              <div className="text-2xl font-black text-emerald-700 mt-0.5">{completed}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">{completionRate}% finished</div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-[10px] uppercase font-bold text-amber-700">In Progress</div>
              <div className="text-2xl font-black text-amber-700 mt-0.5">{inProgress}</div>
              <div className="text-[10px] text-amber-600 font-semibold mt-1">Active execution</div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200">
              <div className="text-[10px] uppercase font-bold text-indigo-700">To-Do Queue</div>
              <div className="text-2xl font-black text-indigo-700 mt-0.5">{todo}</div>
              <div className="text-[10px] text-indigo-600 font-semibold mt-1">Backlog ready</div>
            </div>
          </div>

          {/* Team Workload Allocation Table */}
          {workload.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Team Capacity & Workload Allocation</h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Team Member</th>
                      <th className="py-2 px-3">Role</th>
                      <th className="py-2 px-3 text-center">To-Do</th>
                      <th className="py-2 px-3 text-center">In-Progress</th>
                      <th className="py-2 px-3 text-center">Done</th>
                      <th className="py-2 px-3 text-right">Workload Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {workload.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-semibold text-slate-900">{m.name}</td>
                        <td className="py-2 px-3 text-slate-500">{m.role}</td>
                        <td className="py-2 px-3 text-center text-slate-600">{m.todo_count || 0}</td>
                        <td className="py-2 px-3 text-center font-bold text-slate-900">{m.in_progress_count || 0}</td>
                        <td className="py-2 px-3 text-center text-slate-600">{m.done_count || 0}</td>
                        <td className="py-2 px-3 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.is_burnout_warning || m.in_progress_count > 5
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {m.is_burnout_warning || m.in_progress_count > 5 ? 'High Load (>5)' : 'Balanced'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Detailed Tasks Breakdown Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Sprint Tasks Breakdown</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 w-1/3">Task Title & Details</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Priority</th>
                    <th className="py-2 px-3">Assignee</th>
                    <th className="py-2 px-3">Due Date</th>
                    <th className="py-2 px-3 text-right">Subtasks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tasks.map((task) => {
                    const st = task.subtasks || [];
                    const stDone = st.filter(s => s.completed).length;

                    return (
                      <tr key={task.id} className="hover:bg-slate-50/50 break-inside-avoid">
                        <td className="py-2 px-3">
                          <div className="font-bold text-slate-900">{task.title}</div>
                          {task.description && (
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{task.description}</div>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            task.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' :
                            task.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                            'bg-indigo-100 text-indigo-700'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            task.priority === 'URGENT' ? 'bg-red-100 text-red-700' :
                            task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                            task.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-700 font-medium">
                          {task.assignee_name || 'Unassigned'}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-600 font-medium">
                          {st.length > 0 ? `${stDone}/${st.length}` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Report Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Generated via Quantiphi TaskFlow Enterprise System</span>
            <span>Page 1 of 1 • Confidential & Internal Use</span>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs no-print">
          <span className="text-slate-400 text-xs">Press <strong>Ctrl+P</strong> or click Print to export a PDF document.</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
