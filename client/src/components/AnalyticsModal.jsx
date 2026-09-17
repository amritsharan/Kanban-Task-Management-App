import React, { useEffect, useState } from 'react';
import { X, BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle, Users, Flame, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function AnalyticsModal({ isOpen, onClose, projectId, projectName }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && projectId) {
      setLoading(true);
      api.getAnalytics(projectId)
        .then(data => setAnalytics(data))
        .catch(err => console.error('Error fetching analytics:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sprint Velocity & Workload Analytics</h3>
              <p className="text-xs text-slate-400">Real-time performance metrics for <span className="text-indigo-300 font-semibold">{projectName}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>Calculating sprint metrics...</span>
          </div>
        ) : analytics ? (
          <div className="mt-5 space-y-6">
            
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-emerald-400">{analytics.completionRate}%</span>
                  <span className="text-[10px] text-slate-500">{analytics.completed}/{analytics.total}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analytics.completionRate}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">In Progress</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-amber-400">{analytics.inProgress}</span>
                  <span className="text-[10px] text-slate-500">active tasks</span>
                </div>
                <span className="text-[10px] text-amber-400/80 block mt-2">Active focus</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Overdue</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-2xl font-black ${analytics.overdue > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {analytics.overdue}
                  </span>
                  <span className="text-[10px] text-slate-500">past due</span>
                </div>
                <span className={`text-[10px] block mt-2 ${analytics.overdue > 0 ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                  {analytics.overdue > 0 ? 'Needs attention' : 'All on schedule'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">To-Do Queue</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-indigo-400">{analytics.todo}</span>
                  <span className="text-[10px] text-slate-500">backlog</span>
                </div>
                <span className="text-[10px] text-indigo-300/80 block mt-2">Ready to start</span>
              </div>
            </div>

            {/* Team Capacity & Workload Distribution Bar Chart */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Team Workload Capacity & Burnout Radar</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Threshold: &gt;5 tasks = Overload</span>
              </h4>

              <div className="space-y-3">
                {analytics.workload.map((user) => {
                  const isOver = user.is_burnout_warning || user.in_progress_count > 5;
                  const pct = Math.min(100, Math.round((user.in_progress_count / 5) * 100));

                  return (
                    <div key={user.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatar_url}
                            alt={user.name}
                            className={`w-5 h-5 rounded-full object-cover border ${isOver ? 'border-red-500' : 'border-slate-700'}`}
                          />
                          <span className="font-semibold text-slate-200">{user.name}</span>
                          <span className="text-[10px] text-slate-500">({user.role})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isOver && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">
                              <Flame className="w-3 h-3" /> Overloaded
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-slate-300">
                            {user.in_progress_count} in-progress / {user.total_tasks} total
                          </span>
                        </div>
                      </div>

                      {/* Bar */}
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOver ? 'bg-red-500 animate-pulse' : pct > 60 ? 'bg-amber-400' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Priority Distribution Breakdown */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                Priority Distribution Matrix
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/40 text-center">
                  <span className="text-[10px] font-bold text-red-400 uppercase">🔴 Urgent</span>
                  <p className="text-xl font-black text-red-300 mt-0.5">{analytics.priorityCounts.URGENT}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-center">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">🟠 High</span>
                  <p className="text-xl font-black text-amber-300 mt-0.5">{analytics.priorityCounts.HIGH}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/40 text-center">
                  <span className="text-[10px] font-bold text-blue-400 uppercase">🔵 Medium</span>
                  <p className="text-xl font-black text-blue-300 mt-0.5">{analytics.priorityCounts.MEDIUM}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">⚪ Low</span>
                  <p className="text-xl font-black text-slate-300 mt-0.5">{analytics.priorityCounts.LOW}</p>
                </div>
              </div>
            </div>

          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
